import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../lib/prisma";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // protect chat page
  if (pathname.startsWith("/chat") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // protect the setup-profile page
  if (pathname.startsWith("/auth/setup-profile") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // redirect authenticated users from auth pages
  if (token && (pathname === "/" || pathname === "/auth/signup")) {
    // Check if user has profile
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: { hasProfile: true },
    });

    if (user?.hasProfile) {
      return NextResponse.redirect(new URL("/chat", req.url));
    } else {
      return NextResponse.redirect(new URL("/auth/setup-profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat", "/auth/setup-profile", "/", "/auth/signup"],
};
