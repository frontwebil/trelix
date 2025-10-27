import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { pusherServer } from "../../../../lib/pusher";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ error: " Unathorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text, receiverId } = body;

    if (!text || !receiverId) {
      return NextResponse.json(
        { error: "Text and receiverId are required" },
        { status: 400 }
      );
    }

    // save the message to DB

    const newMessage = await prisma.message.create({
      data: {
        text,
        receiverId,
        senderId: session.user.id,
      },
    });

    // fetch full message with sender and receiver
    const fullMessage = await prisma.message.findUnique({
      where: {
        id: newMessage.id,
      },
      include: {
        sender: {
          select: { avatar: true, id: true },
        },
        receiver: {
          select: { avatar: true, id: true },
        },
      },
    });

    if (!fullMessage) {
      return;
    }

    // create a shared chanel between chat users;

    const ids = [session.user.id, receiverId].sort();
    const channelName = `chat-${ids[0]}-${ids[1]}`;

    // we can trigger events in sthis private chanel

    await pusherServer.trigger(channelName, "new-message", fullMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal sever error" },
      { status: 500 }
    );
  }
}
