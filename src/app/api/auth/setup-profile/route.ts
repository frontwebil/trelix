import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../../../../lib/cloudinary";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const avatarFile = formData.get("avatar") as File;


    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "trelix-avatars" }, (error, resault) => {
            if (error || !resault) {
              reject(error);
            } else {
              resolve(resault);
            }
          })
          .end(buffer);
      }
    );

    const avatar_url = uploadResult.secure_url;

    // update the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        avatar: avatar_url,
        hasProfile: true,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Profile setup error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
