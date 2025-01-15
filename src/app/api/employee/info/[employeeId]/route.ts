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
        SELECT 
            SUM(
                CASE 
                    WHEN al.type = 1 THEN DATEDIFF(al.end_date, al.start_date) + 1 -- 연차는 날짜 차이를 계산
                    WHEN al.type = 2 THEN 0.5 -- 반차는 0.5로 카운트
                    WHEN al.type = 3 THEN 0.25 -- 반반차는 0.25로 카운트

                    ELSE 0 -- 기타 타입은 0으로 처리
                END
            )
        FROM annual_leave al 
        WHERE al.status = 1 AND al.employee_id = e.id
    ) AS use_leave_count,
    (
        CASE 
            WHEN TIMESTAMPDIFF(YEAR, e.startDate, CURRENT_DATE()) = 0 THEN 
                TIMESTAMPDIFF(MONTH, e.startDate, CURRENT_DATE())
            ELSE 
                TIMESTAMPDIFF(MONTH, e.startDate, CURRENT_DATE()) + 
                FLOOR(TIMESTAMPDIFF(YEAR, e.startDate, CURRENT_DATE()) / 1) * 15 
        END
        +
        (
            SELECT 
                IFNULL(SUM(al.given_number), 0)
            FROM annual_leave al
            WHERE al.employee_id = e.id AND al.status = 1
        )
    ) AS annual_leave_count
FROM employees e
WHERE e.employee_num = ?;
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
