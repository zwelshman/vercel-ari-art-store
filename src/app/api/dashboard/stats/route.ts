import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
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
      select: {
        id: true,
        creditsRemaining: true,
        totalCreditsUsed: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get artwork stats
    const artworkStats = await db.artwork.aggregate({
      where: { userId: user.id },
      _count: true,
      _sum: {
        views: true,
        likes: true,
      },
    });

    // Get sales stats
    const salesStats = await db.order.aggregate({
      where: {
        sellerId: user.id,
        status: "DELIVERED",
      },
      _sum: {
        total: true,
      },
    });

    return NextResponse.json({
      totalArtworks: artworkStats._count,
      totalViews: artworkStats._sum.views || 0,
      totalLikes: artworkStats._sum.likes || 0,
      totalSales: salesStats._sum.total || 0,
      creditsRemaining: user.creditsRemaining,
      creditsUsed: user.totalCreditsUsed,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
