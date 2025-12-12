import Stripe from "stripe";
import { SUBSCRIPTION_PLANS, LICENSE_PRICES, PRINT_SIZES, PRINT_MATERIALS, LicenseType } from "@/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

// Create checkout session for subscription
export async function createSubscriptionCheckout(
  customerId: string,
  priceId: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session;
}

// Create checkout session for artwork purchase
export async function createArtworkCheckout(
  customerId: string,
  artwork: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  },
  licenseType: LicenseType,
  userId: string,
  sellerId: string
) {
  const licensePrice = LICENSE_PRICES[licenseType] || 0;
  const totalPrice = artwork.price + licensePrice;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: artwork.title,
            description: `License: ${licenseType}`,
            images: [artwork.imageUrl],
          },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchases?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/artwork/${artwork.id}?canceled=true`,
    metadata: {
      userId,
      sellerId,
      artworkId: artwork.id,
      licenseType,
    },
  });

  return session;
}

// Create checkout session for print order
export async function createPrintCheckout(
  customerId: string,
  artwork: {
    id: string;
    title: string;
    imageUrl: string;
  },
  printSize: string,
  printMaterial: string,
  quantity: number,
  userId: string,
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
) {
  const size = PRINT_SIZES.find((s) => s.id === printSize);
  const material = PRINT_MATERIALS.find((m) => m.id === printMaterial);

  if (!size || !material) {
    throw new Error("Invalid print options");
  }

  const basePrice = size.price * material.priceMultiplier;
  const totalPrice = basePrice * quantity;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${artwork.title} - ${size.name} on ${material.name}`,
            images: [artwork.imageUrl],
          },
          unit_amount: Math.round(basePrice * 100),
        },
        quantity,
      },
    ],
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR"],
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/artwork/${artwork.id}?canceled=true`,
    metadata: {
      userId,
      artworkId: artwork.id,
      printSize,
      printMaterial,
      isPrintOrder: "true",
    },
  });

  return session;
}

// Create checkout for credit purchase
export async function createCreditCheckout(
  customerId: string,
  credits: number,
  userId: string
) {
  // Pricing: $0.10 per credit
  const pricePerCredit = 0.1;
  const totalPrice = credits * pricePerCredit;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${credits} Generation Credits`,
            description: "Credits for AI art generation",
          },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?canceled=true`,
    metadata: {
      userId,
      credits: credits.toString(),
      type: "credit_purchase",
    },
  });

  return session;
}

// Get or create Stripe customer
export async function getOrCreateCustomer(userId: string, email: string, name?: string) {
  // First check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  return customer;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

// Create billing portal session
export async function createBillingPortal(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

// Get payment intent
export async function getPaymentIntent(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
}

// Create connected account for sellers (marketplace)
export async function createConnectedAccount(email: string, userId: string) {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    metadata: {
      userId,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account;
}

// Create account link for onboarding
export async function createAccountLink(accountId: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onboarding?refresh=true`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/dashboard`,
    type: "account_onboarding",
  });

  return accountLink;
}

// Transfer funds to seller
export async function transferToSeller(
  amount: number,
  connectedAccountId: string,
  orderId: string
) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    destination: connectedAccountId,
    metadata: {
      orderId,
    },
  });

  return transfer;
}
