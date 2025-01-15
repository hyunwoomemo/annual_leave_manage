import executeQuery from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the incoming JSON data

    // Destructure incoming data
    const { employee_id, type, type2, start_date, end_date, start_time, end_time, description, given_number } = data;

    // Get the current date (today)
    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Adjust start_date, end_date, and status based on the type condition
    const adjustedStartDate = type > 10 ? today : start_date;
    const adjustedEndDate = type > 10 ? today : end_date || start_date;
    const adjustedGivenNumber = type == 11 ? given_number : -given_number;
    const status = type > 10 ? 1 : 0; // Set status to 1 if type > 10, otherwise keep it null

    const values = [employee_id, adjustedStartDate, adjustedEndDate, type, type2, start_time, end_time, description, adjustedGivenNumber, status];

    // Prepare SQL query with an additional status column
    let sql = `
      INSERT INTO annual_leave (employee_id, start_date, end_date, type, type2, start_time, end_time, description, given_number, status) 
      VALUES (${values.map(() => "?").join(", ")})
    `;

    // Log the query and values for debugging
    console.log("SQL query:", sql);
    console.log("Values:", values);

    // Execute the query
    const result = await executeQuery(sql, values);

    // Log the result from executeQuery to understand its structure
    console.log("Execute query result:", result, result.affectedRows);

    if (result.affectedRows > 0) {
      revalidatePath("/dashboard/myannualleave");
      revalidatePath("/dashboard/calendar");

      return NextResponse.json({ success: true, error: "Success to add AnnualLeave" });
    } else {
      return NextResponse.json({ success: false, error: "Failed to add AnnualLeave" });
    }
  } catch (err) {
    console.error("Error adding AnnualLeave:", err);
    return NextResponse.json({ success: false, error: "Failed to add AnnualLeave" }, { status: 500 });
  }
}
