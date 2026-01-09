import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

// 25년 1월 1일부터 제도 시작
// 25년 1월 1일 이전 입사자 중 1년 이상 근무자: 15일 연차 부여
// 이후 입사자 입사일 이후 1개월마다 1개씩 생성
// 1년 되면 (당해 1월 1일부터 근속일) / 366 * 15일 부여

// 매일 연차 발생 여부 체크해서 발생시키기 (백그라운드 작업)
// 퇴사자 연차 발생 안함

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") !== "null" && searchParams.get("search") ? searchParams.get("search") : "";
    const department = searchParams.get("department") !== "null" && searchParams.get("department") ? searchParams.get("department") : "all";
    const isEmployed = searchParams.get("isEmployed") !== "null" && searchParams.get("isEmployed") ? searchParams.get("isEmployed") : "all";

    console.log("🔍 isEmployed raw:", searchParams.get("isEmployed"));
    console.log("🔍 isEmployed parsed:", isEmployed);
    // 총 갯수 쿼리
    let countSql = `SELECT COUNT(*) AS totalCount FROM employees e`;
    let dataSql = `SELECT 
  e.*,
  (
    IFNULL((
      SELECT 
        SUM(
          CASE 
            WHEN al.type = 1 THEN ABS(DATEDIFF(al.end_date, al.start_date)) + 1
            WHEN al.type = 2 THEN 0.5
            WHEN al.type = 3 THEN 0.25
            ELSE 0
          END
        )
      FROM annual_leave al 
      WHERE al.status = 1 AND al.employee_id = e.id
    ), 0)
    +
    IFNULL((
      SELECT 
        SUM(ABS(al.given_number)) 
      FROM annual_leave al
      WHERE al.status = 1 AND al.employee_id = e.id AND al.type IN (11, 12)
    ), 0)
  ) AS use_leave_count,

    CASE
        WHEN e.employee_num IN (1, 2) THEN 0
        ELSE (
            -- 연차 발생량 계산 (관리자 지급/차감 포함)

            CASE
                WHEN ABS(DATEDIFF('2025-01-01', e.startDate)) >= 365
                     AND (e.enddate IS NULL OR e.enddate > '2025-01-01') THEN
                    15
                ELSE 0
            END
            +
            CASE
                -- 2025년 1월 1일 기준 1년 미만 근무자: 1년 도달 전까지 매월 1개씩 (퇴사일 이후는 제외, 1년 되는 달 제외)
                WHEN  DATEDIFF('2025-01-01', e.startDate) < 365 THEN
                    TIMESTAMPDIFF(
                        MONTH,
                        GREATEST(e.startDate, '2025-01-01'),
                        LEAST(
                            DATE_ADD(e.startDate, INTERVAL 1 YEAR) - INTERVAL 1 DAY,
                            CASE 
                                WHEN e.enddate IS NULL THEN CURRENT_DATE()
                                ELSE LEAST(e.enddate, CURRENT_DATE())
                            END
                        )
                    )
                ELSE 0
            END
            +
            CASE
                WHEN ABS(DATEDIFF('2025-01-01', e.startDate)) < 365 AND DATEDIFF(LEAST(CURRENT_DATE(), '2025-12-31'), e.startDate) >= 365 THEN
                    ROUND((DATEDIFF(CONCAT(YEAR(e.startDate), '-12-31'), e.startDate) / 366) * 15)
                ELSE 0
            END
            +
            CASE
                WHEN ABS(DATEDIFF('2026-01-01', e.startDate)) >= 365
                     AND (e.enddate IS NULL OR e.enddate > '2026-01-01') THEN
                    15
                ELSE 0
            END
            +
                CASE
                -- 2026년 1월 1일 기준 1년 미만 근무자: 1년 도달 전까지 매월 1개씩 (퇴사일 이후는 제외, 1년 되는 달 제외)
                WHEN  DATEDIFF('2026-01-01', e.startDate) < 365 THEN
                    TIMESTAMPDIFF(
                        MONTH,
                        GREATEST(e.startDate, '2026-01-01'),
                        LEAST(
                            DATE_ADD(e.startDate, INTERVAL 1 YEAR) - INTERVAL 1 DAY,
                            CASE 
                                WHEN e.enddate IS NULL THEN CURRENT_DATE()
                                ELSE LEAST(e.enddate, CURRENT_DATE())
                            END
                        )
                    )
                ELSE 0
            END
            +
            CASE
                WHEN ABS(DATEDIFF('2026-01-01', e.startDate)) < 365 AND DATEDIFF(LEAST(CURRENT_DATE(), '2026-12-31'), e.startDate) >= 365 THEN
                    ROUND((DATEDIFF(CONCAT(YEAR(e.startDate), '-12-31'), e.startDate) / 366) * 15)
                ELSE 0
            END
            +
            IFNULL((
                -- 수동 지급 (type 11)도 발생 연차에 포함
                SELECT 
                    SUM(al.given_number) 
                FROM annual_leave al
                WHERE al.status = 1 AND al.employee_id = e.id AND al.type = 11
            ), 0)
        )
    END AS annual_leave_count

FROM employees e
`;

    let conditions = [];
    let values = [];

    // 조건 추가
    if (search) {
      conditions.push(`e.name LIKE ?`);
      values.push(`%${search}%`);
    }

    if (department && department !== "all") {
      conditions.push(`e.department = ?`);
      values.push(department);
    }
    if (isEmployed === "employed") {
      conditions.push(`e.enddate IS NULL`);
      console.log("✅ Added condition: e.enddate IS NULL");
    } else if (isEmployed === "not_employed") {
      conditions.push(`e.enddate IS NOT NULL`);
      console.log("✅ Added condition: e.enddate IS NOT NULL");
    } else {
      console.log("⚠️ No employment condition added. isEmployed:", isEmployed);
    }

    if (conditions.length > 0) {
      const whereClause = ` WHERE ` + conditions.join(" AND ");
      countSql += whereClause;
      dataSql += whereClause;
    }

    console.log("📝 conditions:", conditions);
    console.log("📝 Final dataSql:", dataSql);

    // `status > -1` 조건 추가
    const statusCondition = `e.status > -1`;
    countSql += conditions.length > 0 ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;
    dataSql += conditions.length > 0 ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;

    dataSql += ` ORDER BY e.employee_num ASC`;
    dataSql += ` LIMIT ? OFFSET ?`;

    const countResult = await executeQuery(countSql, values);
    const dataValues = [...values, limit, (page - 1) * limit];
    const result = await executeQuery(dataSql, dataValues);

    return NextResponse.json({ success: true, totalCount: countResult?.[0]?.totalCount, data: result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching employee list:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
