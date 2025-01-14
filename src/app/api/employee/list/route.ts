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
    let countSql = `SELECT COUNT(*) AS totalCount FROM employees where status > -1`;
    let dataSql = `SELECT 
    *,
    CASE 
        WHEN TIMESTAMPDIFF(YEAR, startDate, CURRENT_DATE()) = 0 THEN 
            TIMESTAMPDIFF(MONTH, startDate, CURRENT_DATE())
        ELSE 
            TIMESTAMPDIFF(MONTH, startDate, CURRENT_DATE()) + 
            FLOOR(TIMESTAMPDIFF(YEAR, startDate, CURRENT_DATE()) / 1) * 15 
    END AS annual_leave_count
FROM employees where status > -1`;

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
      countSql += ` WHERE ` + conditions.join(" AND ");
      dataSql += ` WHERE ` + conditions.join(" AND ");
    }
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
