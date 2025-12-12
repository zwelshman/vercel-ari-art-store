import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateImage } from "@/services/ai";
import { uploadFromUrl } from "@/services/cloudinary";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string().min(1).max(1000),
  negativePrompt: z.string().max(500).optional(),
  model: z.string().optional().default("stable-diffusion-xl"),
  width: z.number().min(256).max(2048).optional().default(1024),
  height: z.number().min(256).max(2048).optional().default(1024),
  steps: z.number().min(10).max(50).optional().default(30),
  guidance: z.number().min(1).max(20).optional().default(7.5),
  seed: z.number().optional(),
  style: z.string().optional(),
  numImages: z.number().min(1).max(4).optional().default(1),
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
    const validatedData = generateSchema.parse(body);

    // Get user and check credits
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, creditsRemaining: true, subscriptionTier: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.creditsRemaining < validatedData.numImages) {
      return NextResponse.json(
        { error: "Not enough credits. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // Generate images
    const results = await generateImage({
      prompt: validatedData.prompt,
      negativePrompt: validatedData.negativePrompt,
      model: validatedData.model,
      width: validatedData.width,
      height: validatedData.height,
      steps: validatedData.steps,
      guidance: validatedData.guidance,
      seed: validatedData.seed,
      style: validatedData.style,
      numImages: validatedData.numImages,
    });

    // Upload images to Cloudinary for persistent storage
    const uploadedImages = await Promise.all(
      results.map(async (result) => {
        const uploaded = await uploadFromUrl(result.imageUrl, {
          folder: `ari-art-store/generations/${user.id}`,
          tags: ["generation", user.id],
        });
        return {
          ...result,
          imageUrl: uploaded.secureUrl,
          thumbnailUrl: uploaded.thumbnailUrl,
        };
      })
    );

    // Deduct credits
    await db.user.update({
      where: { id: user.id },
      data: {
        creditsRemaining: { decrement: validatedData.numImages },
        totalCreditsUsed: { increment: validatedData.numImages },
      },
    });

    // Log transaction
    await db.transaction.create({
      data: {
        userId: user.id,
        type: "API_USAGE",
        amount: 0,
        creditsAmount: -validatedData.numImages,
        description: `Generated ${validatedData.numImages} image(s)`,
      },
    });

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      creditsUsed: validatedData.numImages,
      creditsRemaining: user.creditsRemaining - validatedData.numImages,
    });
  } catch (error) {
    console.error("Generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
