import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").toLowerCase().trim();
    const password = body.password ?? "";

    //perform server validation
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and Password are required!",
        },
        {
          status: 400,
        }
      );
    }

    // validate the email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email",
        },
        {
          status: 400,
        }
      );
    }

    // validate the password
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

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with than email already exists!",
        },
        {
          status: 409,
        }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // create the user

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
