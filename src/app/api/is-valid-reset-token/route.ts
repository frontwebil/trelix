import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  console.log(token , searchParams);

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { resetToken: token } });

  if (!user) {
    return NextResponse.json({ isValidToken: false });
  }

  return NextResponse.json({ isValidToken: true });
}
