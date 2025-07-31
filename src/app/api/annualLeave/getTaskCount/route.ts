import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

// Add timeout for database queries
const queryWithTimeout = async (sql: string, values: any[], timeoutMs: number = 8000) => {
  return Promise.race([
    executeQuery(sql, values),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
    )
  ]);
};

export async function GET(req: Request) {
  try {
    const sql = "SELECT COUNT(*) AS count FROM annual_leave WHERE status = ?";
    const statusParam = 0; // 기본 상태 값

    console.log("Fetching annual leave count with status:", statusParam);

    // 쿼리 실행 (타임아웃 포함)
    const result = await queryWithTimeout(sql, [statusParam]) as any[];

    // 결과 유효성 검사
    const count = result?.[0]?.count;
    if (typeof count !== "number") {
      throw new Error("Unexpected result format from database.");
    }

    console.log("Annual leave count fetched successfully:", count);

    // 성공 응답 (캐시 헤더 포함)
    return NextResponse.json({ success: true, count }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
      }
    });
  } catch (error: any) {
    // 에러 로깅
    console.error("Error fetching annual leave count:", error.message || error);

    // 타임아웃 에러 처리
    if (error.message === 'Database query timeout') {
      return NextResponse.json({ 
        success: false, 
        error: "요청 시간이 초과되었습니다. 다시 시도해주세요." 
      }, { status: 504 });
    }

    // 실패 응답
    return NextResponse.json({ 
      success: false, 
      error: error.message || "서버 오류가 발생했습니다." 
    }, { status: 500 });
  }
}
