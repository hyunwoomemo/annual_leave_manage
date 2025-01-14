// app/api/employee/create/route.ts
import executeQuery from "@/lib/db";
import moment from "moment";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the incoming JSON data

    const { name, department, hp, birthDate, startDate } = data;

    // Here, you would typically insert the data into your database
    // For example, using Prisma or directly with SQL queries:
    // const newEmployee = await prisma.employee.create({
    //   data: { name, department, hp, birthDate, startDate },
    // });

    console.log("Received data:", data);

    const sql = "insert into employees (name, department,hp,birthDate, startDate, password) values (?,?,?,?,?, ?)";
    const values = [name, department, hp, birthDate, startDate, moment(birthDate).format("YYMMDD")];

    const rows = await executeQuery(sql, values);

    if (rows.affectedRows > 0) {
      // Simulate successful employee addition
      return NextResponse.json({ success: true, message: "Employee added successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Failed to add Employee" }, { status: 200 });
    }
  } catch (err) {
    console.error("Error adding employee:", err);
    return NextResponse.json({ success: false, error: "Failed to add employee" }, { status: 500 });
  }
}
