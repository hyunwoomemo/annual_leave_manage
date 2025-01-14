// app/api/annualLeave/create/route.ts
import executeQuery from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the incoming JSON data

    const { id, status } = data;

    console.log("Received data:", data);

    const sql = `update annual_leave set status = ? where id = ?`;
    const values = [status, id];

    const result = await executeQuery(sql, values);

    console.log("resultresultresult", id, status, sql, values, result);

    if (result.affectedRows > 0) {
      return NextResponse.json({ success: true, message: "AnnualLeave edited successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: "Failed to add annualLeave" }, { status: 200 });
    }
  } catch (err) {
    console.error("Error adding annualLeave:", err);
    return NextResponse.json({ success: false, error: "Failed to add annualLeave" }, { status: 500 });
  }
}
