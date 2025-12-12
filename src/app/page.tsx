"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Palette,
  ShoppingBag,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Star,
  Play,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Creation",
    description:
      "Generate stunning artwork from text prompts using state-of-the-art AI models like Stable Diffusion and DALL-E.",
  },
  {
    icon: Palette,
    title: "Style Transfer",
    description:
      "Transform your images with artistic styles. Apply the essence of famous artists or create unique visual effects.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "Buy and sell AI-generated artwork. Earn from your creations or find the perfect piece for your project.",
  },
  {
    icon: Zap,
    title: "Fast Generation",
    description:
      "Get your artwork in seconds with our optimized cloud infrastructure and GPU-accelerated processing.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Join a vibrant community of artists and creators. Share, collaborate, and get inspired.",
  },
  {
    icon: Shield,
    title: "Commercial Licensing",
    description:
      "Full commercial rights available. Use your creations for business, marketing, and products.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    credits: "10 generations/month",
    features: ["Standard quality", "Personal use", "Community access"],
  },
  {
    name: "Pro",
    price: "$29",
    credits: "500 generations/month",
    popular: true,
    features: [
      "4K quality",
      "Commercial use",
      "All styles & models",
      "Priority generation",
      "API access",
    ],
  },
  {
    name: "Commercial",
    price: "$99",
    credits: "2000 generations/month",
    features: [
      "8K quality",
      "Full commercial rights",
      "Exclusive licensing",
      "Dedicated API",
      "24/7 support",
    ],
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    content:
      "Ari Art has completely transformed my creative workflow. I can iterate on ideas 10x faster.",
  },
  {
    name: "Marcus Johnson",
    role: "Marketing Director",
    content:
      "We use Ari Art for all our social media content. The quality and speed are unmatched.",
  },
  {
    name: "Elena Rodriguez",
    role: "Game Developer",
    content:
      "The style variety is incredible. Perfect for concept art and game asset creation.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge className="mb-6" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" /> Powered by Advanced AI
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Create Stunning Art with
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                AI Magic
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Transform your ideas into breathtaking artwork. Generate,
              customize, and sell unique digital art using cutting-edge AI
              models.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/create">
                <Button size="xl">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" size="xl">
                  <Play className="mr-2 h-5 w-5" />
                  Explore Gallery
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-xl"
              >
                <div className="flex h-full items-center justify-center text-white/50">
                  <Sparkles className="h-12 w-12" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Everything You Need to Create
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
              A complete platform for AI art generation, from creation to
              monetization.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                      <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
              Create amazing artwork in three simple steps.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Describe Your Vision",
                description:
                  "Write a detailed text prompt describing the artwork you want to create.",
              },
              {
                step: "02",
                title: "Choose Your Style",
                description:
                  "Select from various art styles, dimensions, and AI models to customize your output.",
              },
              {
                step: "03",
                title: "Generate & Download",
                description:
                  "Click generate and watch AI create your artwork in seconds. Download in high resolution.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
              Choose the plan that works best for you.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`h-full ${
                    tier.popular
                      ? "border-2 border-purple-500 shadow-xl"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    {tier.popular && (
                      <Badge className="mb-4">Most Popular</Badge>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {tier.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        /month
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                      {tier.credits}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                        >
                          <Star className="mr-2 h-4 w-4 text-purple-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing" className="mt-8 block">
                      <Button
                        variant={tier.popular ? "default" : "outline"}
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Loved by Creators
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
              See what our community is saying about Ari Art.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white sm:p-12"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Create Something Amazing?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Join thousands of artists and creators using AI to bring their
              visions to life.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="xl"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white text-white hover:bg-white/10"
                >
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
