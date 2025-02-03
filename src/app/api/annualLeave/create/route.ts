import executeQuery from "@/lib/db";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the incoming JSON data

    // Destructure incoming data
    const { name, employee_id, type, type2, start_date, end_date, start_time, end_time, description, given_number } = data;

    // Get the current date (today)
    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Adjust start_date, end_date, and status based on the type condition
    const adjustedStartDate = type > 10 ? today : start_date;
    const adjustedEndDate = type > 10 ? today : end_date || start_date;
    const adjustedGivenNumber = type == 11 ? given_number : type == 12 ? -given_number : null;
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
      const typeText =
        type == 1 ? "연차" : type == 2 && type2 == 1 ? "오전 반차" : type == 2 && type2 == 2 ? "오후 반차" : type == 3 ? "반반차" : type == 4 ? "경조 휴가" : type == 5 ? "공가" : "연차";
      let dateText;
      const daysDifference = moment(end_date || start_date).diff(moment(start_date), "days");
      console.log(";tttt", type, type2, daysDifference, end_date, start_date);

      if (type == 3) {
        dateText = `${moment(start_date).format("YYYY-MM-DD HH:mm")}~${moment(end_date).format("HH:mm")}`;
      } else {
        if (daysDifference === 0) {
          dateText = moment(start_date).format("YYYY-MM-DD");
        } else {
          dateText = `${moment(start_date).format("YYYY-MM-DD")} ~ ${moment(end_date).format("YYYY-MM-DD")}`;
        }
      }

      const text = `(스텝업 연차관리) \n\n${name}님이 연차를 신청했습니다. \n\n 종류: ${typeText} \n 날짜: ${dateText}`;
      console.log("jjjj", process.env.BOT_ID, process.env.CHANNEL_ID, text);
      if (type < 11) {
        const res = await fetch(`https://api.telegram.org/${process.env.BOT_ID}/sendMessage`, {
          method: "POST",
          body: JSON.stringify({
            chat_id: process.env.CHANNEL_ID,
            text,
            entities: [
              {
                type: "text_link",
                url: "https://annual-leave-manage.vercel.app/dashboard/annualleave",
                offset: 0,
                length: 4,
              },
            ],
            disable_web_page_preview: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();

        const messageId = json.result?.message_id;

        // 기존 텍스트와 messageId 저장
        const saveResult = await executeQuery("UPDATE annual_leave SET message_id = ?, message_text = ? WHERE id = ?", [messageId, text, result.insertId]);

        console.log("saveResultsaveResult", saveResult);
      }

      return NextResponse.json({ success: true, error: "Success to add AnnualLeave" });
    } else {
      return NextResponse.json({ success: false, error: "Failed to add AnnualLeave" });
    }
  } catch (err) {
    console.error("Error adding AnnualLeave:", err);
    return NextResponse.json({ success: false, error: "Failed to add AnnualLeave" }, { status: 500 });
  }
}
