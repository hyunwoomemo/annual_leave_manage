import executeQuery from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the incoming JSON data

    const { employee_id, type, type2, start_date, end_date, start_time, end_time, description } = data;

    console.log("Received data:", data);

    const values = [employee_id, start_date, end_date || start_date, type, type2, start_time, end_time, description];

    let sql = `INSERT INTO annual_leave (employee_id, start_date, end_date, type,type2, start_time, end_time, description) 
               VALUES (${values.map(() => "?").join(", ")})`;

    // Log the query and values for debugging
    console.log("SQL query:", sql);
    console.log("Values:", values);

    // Execute the query
    const result = await executeQuery(sql, values);

    // Log the result from executeQuery to understand its structure
    console.log("Execute query result:", result, result.affectedRows);

    // If result is an object with a specific property you need, extract it
    // Example:
    // const rows = result.rows || result; // Depending on your query execution method

    if (result.affectedRows > 0) {
      revalidatePath("/dashboard/myannualleave");
      return NextResponse.json({ success: true, error: "Success to add AnnualLeave" });
    } else {
      return NextResponse.json({ success: false, error: "Failed to add AnnualLeave" });
    }

    // Revalidate path or perform any necessary logic
    // revalidatePath("/api/AnnualLeave/list");
  } catch (err) {
    console.error("Error adding AnnualLeave:", err);
    return NextResponse.json({ success: false, error: "Failed to add AnnualLeave" }, { status: 500 });
  }
}
