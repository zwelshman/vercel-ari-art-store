import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/services/stripe";
import { SUBSCRIPTION_PLANS } from "@/types";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Find the plan by price ID
          const priceId = subscription.items.data[0]?.price.id;
          const plan = SUBSCRIPTION_PLANS.find(
            (p) => p.stripePriceId === priceId
          );

          if (plan) {
            await db.user.update({
              where: { id: userId },
              data: {
                subscriptionTier: plan.tier,
                subscriptionId: subscription.id,
                subscriptionEnd: new Date(subscription.current_period_end * 1000),
                creditsRemaining: plan.creditsPerMonth,
              },
            });

            await db.transaction.create({
              data: {
                userId,
                type: "SUBSCRIPTION",
                amount: plan.price,
                creditsAmount: plan.creditsPerMonth,
                stripePaymentId: session.payment_intent as string,
                description: `Subscribed to ${plan.name} plan`,
              },
            });
          }
        }

        // Handle one-time payments (artwork purchase, credits)
        if (session.mode === "payment" && userId) {
          const metadata = session.metadata || {};

          if (metadata.type === "credit_purchase") {
            const credits = parseInt(metadata.credits || "0");
            await db.user.update({
              where: { id: userId },
              data: {
                creditsRemaining: { increment: credits },
              },
            });

            await db.transaction.create({
              data: {
                userId,
                type: "CREDIT_PURCHASE",
                amount: session.amount_total ? session.amount_total / 100 : 0,
                creditsAmount: credits,
                stripePaymentId: session.payment_intent as string,
                description: `Purchased ${credits} credits`,
              },
            });
          }

          if (metadata.artworkId) {
            // Create order for artwork purchase
            await db.order.create({
              data: {
                buyerId: userId,
                sellerId: metadata.sellerId || null,
                status: "PAID",
                total: session.amount_total ? session.amount_total / 100 : 0,
                stripePaymentId: session.payment_intent as string,
                isPrintOrder: metadata.isPrintOrder === "true",
                items: {
                  create: {
                    artworkId: metadata.artworkId,
                    quantity: 1,
                    price: session.amount_total ? session.amount_total / 100 : 0,
                    licenseType: (metadata.licenseType as any) || "PERSONAL",
                    printSize: metadata.printSize,
                    printMaterial: metadata.printMaterial,
                  },
                },
              },
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const priceId = subscription.items.data[0]?.price.id;
          const plan = SUBSCRIPTION_PLANS.find(
            (p) => p.stripePriceId === priceId
          );

          await db.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: plan?.tier || "FREE",
              subscriptionEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await db.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: "FREE",
              subscriptionId: null,
              subscriptionEnd: null,
              creditsRemaining: 10, // Reset to free tier credits
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;

          if (userId) {
            const priceId = subscription.items.data[0]?.price.id;
            const plan = SUBSCRIPTION_PLANS.find(
              (p) => p.stripePriceId === priceId
            );

            if (plan) {
              // Reset monthly credits
              await db.user.update({
                where: { id: userId },
                data: {
                  creditsRemaining: plan.creditsPerMonth,
                  subscriptionEnd: new Date(subscription.current_period_end * 1000),
                },
              });
            }
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle failed payment - could send email notification
        console.log("Payment failed for invoice:", invoice.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
