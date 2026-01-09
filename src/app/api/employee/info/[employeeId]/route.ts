import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req: Request, { params }) {
  try {
    // 세션 정보 가져오기
    // 서버 사이드에서 세션 가져오기

    const employeeId = (await params).employeeId;
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year") || "2025");

    console.log("employeeId", employeeId);
    console.log("📅 year:", year);

    const sql = `SELECT 
    e.*,
    (
        -- 사용 연차 계산: 실제 연차 사용만 (type 1,2,3)
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
      WHERE al.status = 1 AND al.employee_id = e.id AND al.type IN (1,2,3)
        AND YEAR(al.start_date) = ${year}
    ), 0)
  ) AS use_leave_count,

    (
        -- 연차 발생량 계산: 기본 연차 + 관리자 지급 - 관리자 차감
        (
CASE
    WHEN ABS(DATEDIFF('${year}-01-01', e.startDate)) >= 365
         AND (e.enddate IS NULL OR e.enddate > '${year}-01-01') THEN
        15
    ELSE 0
END
            +
           CASE
        -- ${year}년 1월 1일 기준 1년 미만 근무자: 1년 도달 전까지 매월 1개씩 (퇴사일 이후는 제외)
        WHEN  DATEDIFF('${year}-01-01', e.startDate) < 365 THEN
            TIMESTAMPDIFF(
                MONTH,
                GREATEST(e.startDate, '${year}-01-01'),
                LEAST(
                    DATE_ADD(e.startDate, INTERVAL 1 YEAR),
                    CASE 
                        WHEN e.enddate IS NULL THEN LEAST(CURRENT_DATE(), '${year}-12-31')
                        ELSE LEAST(e.enddate, LEAST(CURRENT_DATE(), '${year}-12-31'))
                    END
                )
            )
        ELSE 0
    END
            +
            CASE
                WHEN ABS(DATEDIFF('${year}-01-01', e.startDate)) < 365 AND DATEDIFF(LEAST(CURRENT_DATE(), '${year}-12-31'), e.startDate) >= 365 THEN
                    ROUND((DATEDIFF(CONCAT(YEAR(e.startDate), '-12-31'), e.startDate) / 366) * 15)
                ELSE 0
            END
            +
            CASE 
                WHEN YEAR(LEAST(CURRENT_DATE(), '${year}-12-31')) > ${year} AND DATEDIFF(LEAST(CURRENT_DATE(), '${year}-12-31'), e.startDate) >= 365 THEN 15
                ELSE 0
            END
            +
(
    -- 관리자 지급 (type 11) 더하기
    SELECT 
        IFNULL(SUM(al.given_number), 0) 
    FROM annual_leave al
    WHERE al.status = 1 AND al.employee_id = e.id AND al.type = 11
      AND YEAR(al.start_date) = ${year}
)
            -
(
    -- 관리자 차감 (type 12) 빼기
    SELECT 
        IFNULL(SUM(ABS(al.given_number)), 0) 
    FROM annual_leave al
    WHERE al.status = 1 AND al.employee_id = e.id AND al.type = 12
      AND YEAR(al.start_date) = ${year}
)
        )
    ) AS annual_leave_count
FROM employees e WHERE e.id = ?;
`;
    const values = [employeeId];
    console.log("ss", sql, values);
    const result = (await executeQuery(sql, values)) as any[];
    const rows = result[0];

    console.log("rorrrr", rows);

    // const json = await result.json();
    console.log("Employee Info Response:", rows);
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Error fetching employee info:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
