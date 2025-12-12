"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Plus,
  Settings,
  Download,
  Eye,
  Heart,
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Avatar } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

interface DashboardStats {
  totalArtworks: number;
  totalViews: number;
  totalLikes: number;
  totalSales: number;
  creditsRemaining: number;
  creditsUsed: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalArtworks: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSales: 0,
    creditsRemaining: 0,
    creditsUsed: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const statCards = [
    {
      title: "Artworks Created",
      value: stats.totalArtworks,
      icon: ImageIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "Total Sales",
      value: formatPrice(stats.totalSales),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  const quickActions = [
    {
      title: "Create New Art",
      description: "Generate stunning AI artwork",
      icon: Plus,
      href: "/create",
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "Browse Gallery",
      description: "View your art collection",
      icon: ImageIcon,
      href: "/dashboard/gallery",
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Marketplace",
      description: "Sell your creations",
      icon: ShoppingBag,
      href: "/marketplace",
      color: "from-orange-600 to-red-600",
    },
    {
      title: "Upgrade Plan",
      description: "Get more credits",
      icon: CreditCard,
      href: "/pricing",
      color: "from-green-600 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Avatar
              src={session.user.image}
              name={session.user.name || "User"}
              size="xl"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {session.user.name?.split(" ")[0]}!
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="default">{session.user.subscriptionTier}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user.creditsRemaining} credits remaining
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/settings">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Link href="/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statCards.map((stat, index) => (
            <Card key={stat.title}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Credits Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generation Credits
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your monthly credits for AI art generation
                  </p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      {session.user.creditsRemaining}
                    </p>
                    <p className="text-sm text-gray-500">Remaining</p>
                  </div>
                  <div className="h-12 w-px bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-400">
                      {stats.creditsUsed}
                    </p>
                    <p className="text-sm text-gray-500">Used</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                    style={{
                      width: `${Math.min(
                        (session.user.creditsRemaining /
                          (session.user.creditsRemaining + stats.creditsUsed)) *
                          100 || 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/pricing">
                  <Button variant="outline" size="sm">
                    Upgrade Plan
                  </Button>
                </Link>
                <Link href="/credits">
                  <Button variant="ghost" size="sm">
                    Buy Credits
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Creations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">
                  No artworks yet. Create your first masterpiece!
                </p>
                <Link href="/create" className="mt-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Start Creating
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
