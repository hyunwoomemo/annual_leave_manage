import executeQuery from "@/lib/db";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Type definitions for database results
interface DbResult {
  affectedRows?: number;
  insertId?: number;
}

interface CountResult {
  count: number;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Destructure incoming data
    const { name, employee_id, type, type2, start_date, end_date, start_time, end_time, description, given_number } = data;

    // Get the current date (today)
    const today = new Date().toISOString().split("T")[0];

    // Adjust start_date, end_date, and status based on the type condition
    const adjustedStartDate = type > 10 ? today : start_date;
    const adjustedEndDate = type > 10 ? today : end_date || start_date;
    const adjustedGivenNumber = type == 11 ? given_number : type == 12 ? -given_number : null;
    const status = type > 10 ? 1 : 0;

    // Check for existing annual leave on the same date first
    const prevResult = (await executeQuery(`SELECT COUNT(*) as count FROM annual_leave WHERE employee_id = ? AND start_date = ?`, [employee_id, adjustedStartDate])) as CountResult[];

    if (prevResult[0]?.count > 0) {
      return NextResponse.json({ success: false, error: "같은 날짜로 신청한 연차가 있습니다." });
    }

    // Prepare values for insertion
    const values = [employee_id, adjustedStartDate, adjustedEndDate, type, type2, start_time, end_time, description, adjustedGivenNumber, status];

    // Execute the insertion query
    const result = (await executeQuery(
      `INSERT INTO annual_leave (employee_id, start_date, end_date, type, type2, start_time, end_time, description, given_number, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    )) as DbResult;

    if (result.affectedRows && result.affectedRows > 0) {
      // Revalidate paths immediately
      revalidatePath("/dashboard/myannualleave");
      revalidatePath("/dashboard/calendar");

      // Send Telegram notification asynchronously (don't wait for it)
      if (type < 11 && result.insertId) {
        sendTelegramNotification(name, type, type2, start_date, end_date, result.insertId).catch((err) => console.error("Telegram notification failed:", err));
      }

      return NextResponse.json({ success: true, message: "연차 신청이 완료되었습니다." });
    } else {
      return NextResponse.json({ success: false, error: "연차 신청에 실패했습니다." });
    }
  } catch (err) {
    console.error("Error adding AnnualLeave:", err);
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// Separate function for Telegram notification to avoid blocking the main response
async function sendTelegramNotification(name: string, type: number, type2: number, start_date: string, end_date: string, insertId: number) {
  try {
    const typeText = getTypeText(type, type2);
    const dateText = getDateText(type, start_date, end_date);

    const text = `(스텝업 연차관리) \n\n${name}님이 연차를 신청했습니다. \n\n 종류: ${typeText} \n 날짜: ${dateText}`;

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`https://api.telegram.org/${process.env.BOT_ID}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.CHANNEL_ID,
        text,
        entities: [
          {
            type: "text_link",
            url: "https://annual-leave-manage.vercel.app/dashboard/annualleave",
            offset: 0,
            length: 9,
          },
        ],
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const messageId = json.result?.message_id;

      if (messageId) {
        await executeQuery("UPDATE annual_leave SET message_id = ?, message_text = ? WHERE id = ?", [messageId, text, insertId]);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Telegram notification timed out");
    } else {
      console.error("Failed to send Telegram notification:", error);
    }
  }
}

function getTypeText(type: number, type2: number): string {
  switch (type) {
    case 1:
      return "연차";
    case 2:
      return type2 === 1 ? "오전 반차" : "오후 반차";
    case 3:
      return "반반차";
    case 4:
      return "경조 휴가";
    case 5:
      return "공가";
    default:
      return "연차";
  }
}

function getDateText(type: number, start_date: string, end_date: string): string {
  if (type === 3) {
    return `${moment(start_date).format("YYYY-MM-DD HH:mm")}~${moment(end_date).format("HH:mm")}`;
  }

  const startMoment = moment(start_date);
  const endMoment = moment(end_date || start_date);
  const daysDifference = endMoment.diff(startMoment, "days");

  if (daysDifference === 0) {
    return startMoment.format("YYYY-MM-DD");
  } else {
    return `${startMoment.format("YYYY-MM-DD")} ~ ${endMoment.format("YYYY-MM-DD")}`;
  }
}
