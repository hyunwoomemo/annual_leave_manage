import executeQuery from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the incoming JSON data
    const { id, ...updateFields } = data; // id와 업데이트할 필드 분리

    if (!id) {
      return NextResponse.json({ success: false, message: "leave ID is required" }, { status: 400 });
    }

    // 업데이트할 필드가 없는 경우
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
    }

    // 동적 쿼리 생성
    const columns = Object.keys(updateFields);
    const values = Object.values(updateFields);

    // SET 부분 동적 생성
    const setClause = columns.map((col) => `${col} = ?`).join(", ");

    // 최종 SQL 쿼리
    const sql = `UPDATE annual_leave SET ${setClause} WHERE id = ?`;
    values.push(id); // ID는 마지막에 추가

    console.log("Generated SQL:", sql);
    console.log("Values:", values);

    // 데이터베이스 실행
    const result = await executeQuery(sql, values);

    console.log("resultresult", result);

    if (result.affectedRows > 0) {
      revalidatePath("/dashboard/annualleave");
      revalidatePath("/dashboard/calendar");

      return NextResponse.json({ success: true, message: "Annual_leave updated successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Failed to update Annual_leave" }, { status: 400 });
    }
  } catch (err) {
    console.error("Error updating annual_leave:", err);
    return NextResponse.json({ success: false, error: "Failed to update employee" }, { status: 500 });
  }
}
