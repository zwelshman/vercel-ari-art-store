import { NextResponse } from "next/server";
import { enhancePrompt } from "@/services/ai";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().min(1).max(500),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = schema.parse(body);

    const enhancedPrompt = await enhancePrompt(prompt);

    return NextResponse.json({
      success: true,
      enhancedPrompt,
    });
  } catch (error) {
    console.error("Enhance prompt error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
