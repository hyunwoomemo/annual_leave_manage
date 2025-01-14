import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const employee_id = searchParams.get("employee_id") || "";

    const search = searchParams.get("search") !== "null" && searchParams.get("search") ? searchParams.get("search") : "";
    const department = searchParams.get("department") !== "null" && searchParams.get("department") ? searchParams.get("department") : "";

    // 총 갯수 쿼리
    let countSql = `SELECT COUNT(id) AS totalCount FROM annual_leave`;

    let dataSql = "SELECT al.*, e.name, e.department FROM annual_leave al  left join employees e on al.employee_id = e.id";

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

    if (employee_id) {
      conditions.push(`employee_id = ?`);
      countSql += ` WHERE employee_id = ${employee_id}`;
      values.push(employee_id);
    }

    if (conditions.length > 0) {
      // countSql += ` WHERE ` + conditions.join(" AND ");
      dataSql += ` WHERE ` + conditions.join(" AND ");
    }

    // countSql += " group by e.id";
    dataSql += ` LIMIT ? OFFSET ?`;
    values.push(limit, (Number(page) - 1) * Number(limit));

    const countData = await executeQuery(countSql, values.slice(0, conditions.length));
    const data = await executeQuery(dataSql, values);

    console.log("Employee List Response:", countData);
    return NextResponse.json({ totalCount: countData?.[0]?.totalCount, data }, { status: 200 });
  } catch (err) {
    console.error("Error fetching annual_leave list:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
