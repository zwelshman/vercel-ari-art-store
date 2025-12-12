import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createArtworkSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  prompt: z.string().min(1),
  negativePrompt: z.string().optional(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  model: z.string().optional().default("stable-diffusion-xl"),
  width: z.number().optional().default(1024),
  height: z.number().optional().default(1024),
  steps: z.number().optional().default(30),
  guidance: z.number().optional().default(7.5),
  seed: z.number().optional(),
  style: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
  isForSale: z.boolean().optional().default(false),
  price: z.number().optional(),
  licenseType: z.enum(["PERSONAL", "COMMERCIAL", "EXCLUSIVE", "EXTENDED"]).optional().default("PERSONAL"),
  collectionId: z.string().optional(),
});

// Create artwork
export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = createArtworkSchema.parse(body);

    const artwork = await db.artwork.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      artwork,
    });
  } catch (error) {
    console.error("Create artwork error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create artwork" },
      { status: 500 }
    );
  }
}

// Get artworks
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const style = searchParams.get("style");
    const forSale = searchParams.get("forSale") === "true";
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      isPublic: true,
    };

    if (category) where.category = category;
    if (style) where.style = style;
    if (forSale) where.isForSale = true;
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { prompt: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const [artworks, total] = await Promise.all([
      db.artwork.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.artwork.count({ where }),
    ]);

    return NextResponse.json({
      items: artworks,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get artworks error:", error);
    return NextResponse.json(
      { error: "Failed to get artworks" },
      { status: 500 }
    );
  }
}
