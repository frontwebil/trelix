import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { pusherServer } from "../../../../../lib/pusher";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorize" }, { status: 401 });
  }

  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);

  const socket_id = params.get("socket_id");
  const channel_name = params.get("channel_name");

  if (!socket_id || !channel_name) {
    return NextResponse.json(
      { error: "Missing socket_id or channel_name" },
      {
        status: 400,
      }
    );
  }

  const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
    user_id: session.user.id,
  });

  return NextResponse.json(auth);
}
