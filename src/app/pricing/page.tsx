"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Building } from "lucide-react";
import { Button, Card, CardContent, Badge, Tabs } from "@/components/ui";
import { SUBSCRIPTION_PLANS } from "@/types";
import { formatPrice } from "@/lib/utils";

const planIcons = {
  FREE: Sparkles,
  BASIC: Zap,
  PRO: Crown,
  COMMERCIAL: Building,
};

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      router.push("/login?callbackUrl=/pricing");
      return;
    }

    setLoading(planId);
    try {
      const response = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, interval: billingInterval }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(null);
    }
  };

  const tabs = [
    { id: "month", label: "Monthly" },
    { id: "year", label: "Yearly (Save 20%)" },
  ];

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4" variant="secondary">
            Pricing
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Choose Your Creative Plan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Start free and upgrade as you grow. All plans include access to our
            powerful AI art generation tools.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center">
            <Tabs
              tabs={tabs}
              activeTab={billingInterval}
              onChange={(id) => setBillingInterval(id as "month" | "year")}
            />
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-4">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const Icon = planIcons[plan.tier];
            const price =
              billingInterval === "year"
                ? plan.price * 12 * 0.8
                : plan.price;
            const isCurrentPlan =
              session?.user?.subscriptionTier === plan.tier;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full ${
                    plan.tier === "PRO"
                      ? "border-2 border-purple-500 shadow-xl"
                      : ""
                  }`}
                >
                  {plan.tier === "PRO" && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="flex h-full flex-col p-6">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                        <Icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(price)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          /{billingInterval === "year" ? "year" : "month"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                        {plan.creditsPerMonth} generations/month
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="mb-8 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      isLoading={loading === plan.id}
                      disabled={isCurrentPlan}
                      variant={plan.tier === "PRO" ? "default" : "outline"}
                      className="w-full"
                    >
                      {isCurrentPlan
                        ? "Current Plan"
                        : plan.price === 0
                        ? "Get Started"
                        : "Subscribe"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What happens if I run out of credits?",
                a: "You can purchase additional credits or wait for your monthly reset. Unused credits don't roll over.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 14-day money-back guarantee for all paid plans. No questions asked.",
              },
              {
                q: "Can I use the images commercially?",
                a: "Pro and Commercial plans include commercial usage rights. Check our license terms for details.",
              },
              {
                q: "Is there an API available?",
                a: "Yes, API access is included in Pro and Commercial plans. Documentation is available in your dashboard.",
              },
              {
                q: "Do you offer enterprise pricing?",
                a: "Yes, contact us for custom enterprise solutions with dedicated support and custom features.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    {faq.q}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="overflow-hidden">
            <div className="flex flex-col items-center gap-6 bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white md:flex-row md:text-left">
              <div className="flex-1">
                <h3 className="text-2xl font-bold">Need Enterprise Features?</h3>
                <p className="mt-2 text-white/80">
                  Custom solutions, dedicated support, and white-label options for large organizations.
                </p>
              </div>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Contact Sales
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
