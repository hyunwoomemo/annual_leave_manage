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
        (SELECT 
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
        WHERE al.status = 1 AND al.employee_id = e.id) +
        (
            -- type 12 (수동 차감)만 사용 연차에 포함
            SELECT 
                SUM(ABS(al.given_number)) 
            FROM annual_leave al
            WHERE al.status = 1 AND al.employee_id = e.id AND al.type = 12
        )
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
    -- 2025년 1월 1일 이전 입사자 (근무일수가 1년 미만인 경우)
    WHEN e.startDate < '2025-01-01' 
         AND DATEDIFF(CURRENT_DATE(), e.startDate) < 365 THEN
        1 + TIMESTAMPDIFF(
            MONTH, 
            GREATEST(e.startDate, '2025-01-01'),  -- 2025년 1월 1일부터 연차 시작
            CURRENT_DATE()
        )
    
    -- 2025년 1월 1일 이후 입사자 (30일 이상 근무 + 근무일수 1년 미만인 경우)
    WHEN DATEDIFF(CURRENT_DATE(), e.startDate) >= 30 
         AND DATEDIFF(CURRENT_DATE(), e.startDate) < 365 THEN
        TIMESTAMPDIFF(
            MONTH, 
            e.startDate, 
            CURRENT_DATE()
        )
    
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
    +
(
    -- 수동 지급 (type 11)도 발생 연차에 포함
    SELECT 
        IFNULL(SUM(al.given_number), 0) 
    FROM annual_leave al
    WHERE al.status = 1 AND al.employee_id = e.id AND al.type = 11
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
