import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const employee_id = searchParams.get("employee_id") || "";
    const apply = searchParams.get("apply") || false;


    const search = searchParams.get("search") !== "null" && searchParams.get("search") ? searchParams.get("search") : "";
    const department = searchParams.get("department") !== "null" && searchParams.get("department") ? searchParams.get("department") : "";

    // 기본 쿼리
    let countSql = `SELECT COUNT(al.id) AS totalCount FROM annual_leave al`;
    let dataSql = `
      SELECT al.*, e.name, e.department 
      FROM annual_leave al 
      LEFT JOIN employees e ON al.employee_id = e.id
    `;

    let conditions = [];
    let values = [];

    // 조건 추가
    if (search) {
      conditions.push(`e.name LIKE ?`);
      values.push(`%${search}%`);
    }

    if (department) {
      conditions.push(`e.department = ?`);
      values.push(department);
    }

    if (employee_id) {
      conditions.push(`al.employee_id = ?`);
      values.push(employee_id);
    }

    if (apply) {
      conditions.push(`al.type < 11`);
    }

    if (conditions.length > 0) {
      const whereClause = ` WHERE ` + conditions.join(" AND ");
      countSql += whereClause;
      dataSql += whereClause;
    }

    // `status > -1` 조건 추가
    const statusCondition = `al.status > -1`;
    countSql += conditions.length > 0 ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;
    dataSql += conditions.length > 0 ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;

    // 정렬 및 페이징
    dataSql += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
    values.push(limit, (page - 1) * limit);

    // 쿼리 실행
    const countData = await executeQuery(countSql, values.slice(0, values.length - 2)); // limit, offset 제외
    const data = await executeQuery(dataSql, values);

    console.log("Employee List Response:", countData);
    return NextResponse.json({ totalCount: countData?.[0]?.totalCount, data }, { status: 200 });
  } catch (err) {
    console.error("Error fetching annual_leave list:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
