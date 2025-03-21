import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") !== "null" && searchParams.get("search") ? searchParams.get("search") : "";
    const department = searchParams.get("department") !== "null" && searchParams.get("department") ? searchParams.get("department") : "";

    // 총 갯수 쿼리
    let countSql = `SELECT COUNT(*) AS totalCount FROM employees e`;
    let dataSql = `SELECT 
    e.*,
    (
        -- 사용 연차 계산 (주말 제외)
        SELECT 
            SUM(
                CASE 
                    WHEN al.type = 1 THEN 
                        ABS(DATEDIFF(al.end_date, al.start_date)) + 1
                        - ABS(DATEDIFF(
                            ADDDATE(al.end_date, INTERVAL 1 - DAYOFWEEK(al.end_date) DAY),
                            ADDDATE(al.start_date, INTERVAL 1 - DAYOFWEEK(al.start_date) DAY)
                        )) / 7 * 2
                        - (DAYOFWEEK(al.start_date) = 7) -- 시작일이 토요일이면 -1
                        - (DAYOFWEEK(al.end_date) = 1)   -- 종료일이 일요일이면 -1
                    WHEN al.type = 2 THEN 0.5
                    WHEN al.type = 3 THEN 0.25
                    ELSE 0
                END
            )
        FROM annual_leave al 
        WHERE al.status = 1 AND al.employee_id = e.id
    ) AS use_leave_count,

   (
    -- 1년 이상 근무한 경우 (2025년 1월 1일 기준)
    CASE
        WHEN ABS(DATEDIFF('2025-01-01', e.startDate)) >= 365 THEN
            -- 매년 1월 1일 15개 지급 (1년 이상 근무자)
            15
        ELSE 0
    END
    +
    -- 1년 미만 근무한 경우 (입사일에 따른 연차 지급)
    CASE
        WHEN ABS(DATEDIFF('2025-01-01', e.startDate)) < 365 AND DATEDIFF(CURRENT_DATE(), '2025-01-01') >= 0 THEN
            -- 2025년 1월 1일부터 매월 1개씩 발생
            TIMESTAMPDIFF(MONTH, '2025-01-01', CURRENT_DATE())
        ELSE 0
    END
    +
    -- 입사 첫해 연차: 입사일 기준 1년이 되는 날 연차 지급 (입사 재직일 ÷ 365 * 15)
    CASE
        WHEN ABS(DATEDIFF('2025-01-01', e.startDate)) < 365 AND DATEDIFF(CURRENT_DATE(), e.startDate) >= 365 THEN
            ROUND(
               (DATEDIFF(CONCAT(YEAR(e.startDate), '-12-31'), e.startDate) / 366) * 15
            )
        ELSE 0
    END
    +
    -- 매년 1월 1일 추가 지급: 1년 이상 근무한 경우 15개 지급
    CASE 
        WHEN YEAR(CURRENT_DATE()) > 2025 AND DATEDIFF(CURRENT_DATE(), e.startDate) >= 365 THEN 15
        ELSE 0
    END
) AS annual_leave_count
FROM employees e`;

    let conditions = [];
    let values = [];

    // 조건 추가
    if (search) {
      conditions.push(`name LIKE ?`);
      values.push(`%${search}%`);
    }

    if (department) {
      conditions.push(`department = ?`);
      values.push(department);
    }

    if (conditions.length > 0) {
      const whereClause = ` WHERE ` + conditions.join(" AND ");
      countSql += whereClause;
      dataSql += whereClause;
    }

    // `status > -1` 조건 추가
    const statusCondition = `e.status > -1`;
    countSql += conditions.length > 0 ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;
    dataSql += conditions.length > 0 ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;

    dataSql += ` ORDER BY e.employee_num ASC`;
    dataSql += ` LIMIT ? OFFSET ?`;
    values.push(limit, (page - 1) * limit);

    const countResult = await executeQuery(countSql, values);
    const result = await executeQuery(dataSql, values);

    console.log("dataSqldataSql", dataSql);

    return NextResponse.json({ success: true, totalCount: countResult?.[0]?.totalCount, data: result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching employee list:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
