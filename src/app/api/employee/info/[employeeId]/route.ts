import { auth } from "@/lib/auth";
import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req: Request, { params }) {
  try {
    // 세션 정보 가져오기
    // 서버 사이드에서 세션 가져오기

    const employeeId = (await params).employeeId;
    console.log("employeeId", employeeId);

    const sql = `SELECT 
    e.*,
    (
        -- 사용 연차 계산 (주말 제외)
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

    (
        -- 연차 발생량 계산 (관리자 지급/차감 포함)
        (
CASE
    WHEN ABS(DATEDIFF('2025-01-01', e.startDate)) >= 365
         AND (e.enddate IS NULL OR e.enddate > '2025-01-01') THEN
        15
    ELSE 0
END
            +
           CASE
        -- 2025년 1월 1일 기준 1년 미만 근무자: 1년 도달 전까지 매월 1개씩
        WHEN  DATEDIFF('2025-01-01', e.startDate) < 365 THEN
            TIMESTAMPDIFF(
                MONTH,
                GREATEST(e.startDate, '2025-01-01'),
                LEAST(
                    DATE_ADD(e.startDate, INTERVAL 1 YEAR),
                    IFNULL(e.enddate, CURRENT_DATE())
                )
            )
        ELSE 0
    END
            +
            CASE
                WHEN ABS(DATEDIFF('2025-01-01', e.startDate)) < 365 AND DATEDIFF(CURRENT_DATE(), e.startDate) >= 365 THEN
                    ROUND((DATEDIFF(CONCAT(YEAR(e.startDate), '-12-31'), e.startDate) / 366) * 15)
                ELSE 0
            END
            +
            CASE 
                WHEN YEAR(CURRENT_DATE()) > 2025 AND DATEDIFF(CURRENT_DATE(), e.startDate) >= 365 THEN 15
                ELSE 0
            END
            +
(
    -- 수동 지급 (type 11)도 발생 연차에 포함
    SELECT 
        IFNULL(SUM(al.given_number), 0) 
    FROM annual_leave al
    WHERE al.status = 1 AND al.employee_id = e.id AND al.type = 11
)
        )
    ) AS annual_leave_count
FROM employees e WHERE e.employee_num = ?;
`;
    const values = [employeeId];
    console.log("ss", sql, values);
    const [rows] = await executeQuery(sql, values);

    console.log("rorrrr", rows);

    // const json = await result.json();
    console.log("Employee Info Response:", rows);
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Error fetching employee info:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
