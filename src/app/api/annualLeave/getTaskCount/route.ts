import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const sql = "SELECT COUNT(*) AS count FROM annual_leave WHERE status = ?";
    const statusParam = 0; // 기본 상태 값

    // 쿼리 실행
    const result = await executeQuery(sql, [statusParam]);

    // 결과 유효성 검사
    const count = result?.[0]?.count;
    if (typeof count !== "number") {
      throw new Error("Unexpected result format from database.");
    }

    // 성공 응답
    return NextResponse.json({ success: true, count }, { status: 200 });
  } catch (error: any) {
    // 에러 로깅
    console.error("Error fetching annual leave count:", error.message || error);

    // 실패 응답
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
