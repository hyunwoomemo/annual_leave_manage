import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 10; // Default to 10 items per page
    const search = searchParams.get("search") !== "null" && searchParams.get("search") ? searchParams.get("search") : "";

    const department = searchParams.get("department") !== "null" && searchParams.get("department") ? searchParams.get("department") : "";

    // 총 갯수 쿼리
    let countSql = `SELECT COUNT(*) AS totalCount FROM employees`;
    let dataSql = `SELECT 
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
    const statusCondition = `status > -1`;
    countSql += conditions.length > 0 ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;
    dataSql += conditions.length > 0 ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;
    dataSql += " order by created_at desc";
    dataSql += ` LIMIT ? OFFSET ?`;
    values.push(limit, (page - 1) * limit);

    const countResult = await executeQuery(countSql, values);
    const result = await executeQuery(dataSql, values);

    // const json = await result.json();
    // console.log("Employee List Response:", json);
    return NextResponse.json({ success: true, totalCount: countResult?.[0]?.totalCount, data: result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching employee list:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
