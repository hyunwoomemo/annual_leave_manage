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

    const existingSql = "select count(id) as count from employees where name = ? and birthdate = ? and > status > -1";
    const existingValues = [name, birthDate];

    console.log("123123", existingSql, existingValues);

    const [{ count }] = await executeQuery(existingSql, existingValues);

    console.log("eeeee", count);

    if (count > 0) {
      return NextResponse.json({ success: false, message: "이미 존재하는 직원입니다." }, { status: 200 });
    }

    const sql = "insert into employees (name, department,hp,birthDate, startDate, password) values (?,?,?,?,?,?)";
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
