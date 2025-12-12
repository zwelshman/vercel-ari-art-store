import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { styleTransfer } from "@/services/ai";
import { uploadFromUrl } from "@/services/cloudinary";
import { z } from "zod";

const schema = z.object({
  sourceImage: z.string(),
  styleName: z.string().optional(),
  styleImageUrl: z.string().url().optional(),
  strength: z.number().min(0.1).max(1).optional().default(0.5),
});

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sourceImage, styleName, styleImageUrl, strength } = schema.parse(body);

    // Get user and check credits
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, creditsRemaining: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.creditsRemaining < 1) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 403 }
      );
    }

    // Upload source image first if it's a data URL
    let sourceImageUrl = sourceImage;
    if (sourceImage.startsWith("data:")) {
      const base64Data = sourceImage.split(",")[1];
      const uploaded = await uploadFromUrl(`data:image/png;base64,${base64Data}`, {
        folder: `ari-art-store/style-transfer/${user.id}`,
      });
      sourceImageUrl = uploaded.secureUrl;
    }

    // Perform style transfer
    const result = await styleTransfer({
      sourceImageUrl,
      styleImageUrl,
      styleName,
      strength,
    });

    // Upload result to Cloudinary
    const uploaded = await uploadFromUrl(result.imageUrl, {
      folder: `ari-art-store/style-transfer/${user.id}`,
      tags: ["style-transfer", user.id],
    });

    // Deduct credit
    await db.user.update({
      where: { id: user.id },
      data: {
        creditsRemaining: { decrement: 1 },
        totalCreditsUsed: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl: uploaded.secureUrl,
      thumbnailUrl: uploaded.thumbnailUrl,
    });
  } catch (error) {
    console.error("Style transfer error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Style transfer failed" },
      { status: 500 }
    );
  }
}
