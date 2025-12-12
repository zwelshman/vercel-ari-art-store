import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createSubscriptionCheckout, getOrCreateCustomer } from "@/services/stripe";
import { SUBSCRIPTION_PLANS } from "@/types";
import { z } from "zod";

const schema = z.object({
  planId: z.string(),
  interval: z.enum(["month", "year"]).optional().default("month"),
});

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, interval } = schema.parse(body);

    // Find the plan
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, stripeCustomerId: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await getOrCreateCustomer(
        user.id,
        session.user.email,
        session.user.name || undefined
      );
      customerId = customer.id;

      // Update user with Stripe customer ID
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Get the appropriate price ID based on interval
    const priceId = plan.stripePriceId || process.env[`STRIPE_${plan.tier}_PRICE_ID`];

    if (!priceId) {
      // For demo purposes, return a mock URL
      return NextResponse.json({
        url: `/pricing?demo=true&plan=${planId}`,
      });
    }

    // Create checkout session
    const checkoutSession = await createSubscriptionCheckout(
      customerId,
      priceId,
      user.id
    );

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Subscription checkout error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
