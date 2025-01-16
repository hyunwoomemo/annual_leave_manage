// app/api/annualLeave/create/route.ts
import executeQuery from "@/lib/db";
import moment from "moment";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the incoming JSON data

    const { id, status, name } = data;

    console.log("Received data:", data);

    const sql = `update annual_leave set status = ? where id = ?`;
    const values = [status, id];

    const result = await executeQuery(sql, values);

    console.log("resultresultresult", id, status, sql, values, result);

    if (result.affectedRows > 0) {
      // 기존 메시지 정보 가져오기
      const result = await executeQuery("SELECT message_id, message_text FROM annual_leave WHERE id = ?", [id]);

      if (result.length === 0) {
        return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });
      }

      const { message_id: messageId, message_text: messageText } = result[0];

      // 첫 줄 (링크) 제거
      const updatedText = messageText
        .split("\n")
        .slice(1) // 첫 번째 줄 제외
        .join("\n")
        .concat(`\n\n✅ 처리 완료되었습니다. (${name}: ${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")})`);

      // 텔레그램 메시지 수정
      const res = await fetch(`https://api.telegram.org/${process.env.BOT_ID}/editMessageText`, {
        method: "POST",
        body: JSON.stringify({
          chat_id: process.env.CHANNEL_ID,
          message_id: messageId,
          text: updatedText,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      console.log("Telegram edit response:", json);

      return NextResponse.json({ success: true, message: "AnnualLeave edited successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: "Failed to add annualLeave" }, { status: 200 });
    }
  } catch (err) {
    console.error("Error adding annualLeave:", err);
    return NextResponse.json({ success: false, error: "Failed to add annualLeave" }, { status: 500 });
  }
}
