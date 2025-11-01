import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import crypto from "crypto";
import { resend } from "../../../../lib/resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate Token

    const token = crypto.randomBytes(32).toString("hex");

    const expiry = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.user.update({
      where: { id: user?.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

    const html = `
  <div style="font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px; max-width: 500px; margin: auto;">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://trelix-lime.vercel.app/logo.png" alt="TreliX" width="180" style="margin-bottom: 16px;" />
      <h1 style="color: #f8fafc; margin: 0; font-size: 22px;">Reset your password</h1>
      <p style="color: #94a3b8; font-size: 14px;">We received a request to reset your password.</p>
    </div>

    <div style="background: #1e293b; padding: 24px; border-radius: 12px; text-align: center;">
      <p style="color: #cbd5e1; font-size: 15px; margin-bottom: 24px;">
        Click the button below to reset your password:
      </p>
      <a href="${resetLink}"
         style="display: inline-block; background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                color: white; padding: 12px 24px; border-radius: 8px;
                text-decoration: none; font-weight: 600; transition: 0.3s;">
        Reset Password
      </a>
      <p style="margin-top: 24px; color: #64748b; font-size: 13px;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #475569; font-size: 12px;">© ${new Date().getFullYear()} TreliX — All rights reserved.</p>
    </div>
  </div>
`;

    await resend.emails.send({
      from: "TreliX <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: html,
    });

    return NextResponse.json(
      { message: "Reset link sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
