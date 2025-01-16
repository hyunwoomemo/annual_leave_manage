import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await auth();
  const id = session?.user?.id;

  // 루프 방지: 리디렉션 대상 경로 제외
  if (!id && !request.nextUrl.pathname.startsWith("/")) {
    console.log("로그인 안되어있음!!");
    return NextResponse.redirect(new URL("/", request.url));
  } else {
    console.log("로그인 되어있음!!");
  }

  // if (request.nextUrl.pathname.startsWith("/about")) {
  //   return NextResponse.redirect(new URL("/about-2", request.url));
  // }

  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/dashboard/user", request.url));
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: "/dashboard/:path*",
};
