import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { employee_id, password } = await req.json();

  console.log("employee_id", employee_id, password);
  try {
    if (employee_id && password) {
      const sql = "select * from employees where id = ? and password = ? and status > -1";
      const values = [employee_id, password];

      const [result] = await executeQuery(sql, values);

      if (result) {
        return NextResponse.json({ success: true, data: result }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, message: "로그인에 실패했습니다." }, { status: 401 });
      }
    } else {
      return NextResponse.json({ success: false, message: "로그인에 실패했습니다." }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: err?.message || "로그인에 실패했습니다." }, { status: 401 });
  }
}
