import executeQuery from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sql = "select distinct department from employees order by department";

    const result = await executeQuery(sql, []);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
