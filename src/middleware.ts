import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log({ token });
  const { pathname } = req.nextUrl;

  // protect chat page
  if (pathname.startsWith("/chat") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log({ pathname });

  // protect the setup-profile page
  if (pathname.startsWith("/auth/setup-profile") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log({ pathname });

  // redirect authenticated users from auth pages to setup-profile
  if (token && (pathname === "/" || pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/auth/setup-profile", req.url));
  }

  console.log({ pathname });

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat", "/auth/setup-profile", "/", "/auth/signup"],
};
