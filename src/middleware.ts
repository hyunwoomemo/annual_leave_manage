import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const id = session?.user?.id;

  // 로그인된 경우
  if (id) {
    console.log("로그인 되어있음!!");

    // "/"로 접근하면 "/dashboard/calendar"로 리디렉션
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard/calendar", request.url));
    }

    // 다른 경로는 그대로 통과
    return NextResponse.next();
  }

  // 로그인되지 않은 경우
  console.log("로그인 안되어있음!!");

  // "/"를 제외한 모든 경로에서 "/"로 리디렉션
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 적용할 경로 설정
export const config = {
  matcher: ["/dashboard/:path"], // 모든 경로에서 미들웨어 작동
};
