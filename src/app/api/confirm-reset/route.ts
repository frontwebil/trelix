import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required!" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be atleast 8 characters long!",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findFirst({ where: { resetToken: token } });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token!" },
        { status: 400 }
      );
    }

    const isSamePasswords = await bcrypt.compare(password, user.password);
    if (isSamePasswords) {
      return NextResponse.json(
        { error: "The password must not match the previous one." },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password successfully reset!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset confirm error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
