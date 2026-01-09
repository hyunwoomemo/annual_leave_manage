import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit") ?? 10);
    const page = Number(searchParams.get("page") ?? 1);
    const employee_id = searchParams.get("employee_id");
    const apply = searchParams.get("apply") === "true";
    const year = Number(searchParams.get("year") ?? 2025);

    const search = searchParams.get("search") && searchParams.get("search") !== "null" ? searchParams.get("search")! : "";

    const department = searchParams.get("department") && searchParams.get("department") !== "null" ? searchParams.get("department")! : "all";

    let conditions: string[] = [];
    let values: any[] = [];
    let countValues: any[] = [];

    // 🔎 이름 검색
    if (search) {
      conditions.push(`e.name LIKE ?`);
      values.push(`%${search}%`);
      countValues.push(`%${search}%`);
    }

    // 🏢 부서 필터
    if (department !== "all") {
      conditions.push(`e.department = ?`);
      values.push(department);
      countValues.push(department);
    }

    // 👤 직원 필터
    if (employee_id) {
      conditions.push(`al.employee_id = ?`);
      values.push(employee_id);
      countValues.push(employee_id);
    }

    // ✅ 신청된 연차만
    if (apply) {
      conditions.push(`al.type < 11`);
    }

    // 📅 연도
    if (year) {
      conditions.push(`YEAR(al.start_date) = ?`);
      values.push(year);
      countValues.push(year);
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")} AND al.status > -1` : ` WHERE al.status > -1`;

    const countSql = `
      SELECT COUNT(al.id) AS totalCount
      FROM annual_leave al
      LEFT JOIN employees e ON al.employee_id = e.id
      ${whereClause}
    `;

    const dataSql = `
      SELECT al.*, e.name, e.department
      FROM annual_leave al
      LEFT JOIN employees e ON al.employee_id = e.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `;

    values.push(limit, (page - 1) * limit);

    const countData = await executeQuery<any[]>(countSql, countValues);
    const data = await executeQuery<any[]>(dataSql, values);

    return NextResponse.json(
      {
        totalCount: countData[0]?.totalCount ?? 0,
        data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching annual_leave list:", err);
    return NextResponse.json({ error: "Failed to load annual leave list" }, { status: 500 });
  }
}
