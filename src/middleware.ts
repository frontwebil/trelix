import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const hasProfile = token ? (token as any).hasProfile : false;

  // protect chat page
  if (pathname.startsWith("/chat")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (!hasProfile) {
      return NextResponse.redirect(new URL("/auth/setup-profile", req.url));
    }
  }

  // protect the setup-profile page
  if (pathname.startsWith("/auth/setup-profile") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && (pathname === "/" || pathname === "/auth/signup")) {
    // Check if user has profile, if not redirect to setup-profile
    if (!hasProfile) {
      return NextResponse.redirect(new URL("/auth/setup-profile", req.url));
    }
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat", "/auth/setup-profile", "/", "/auth/signup"],
};
