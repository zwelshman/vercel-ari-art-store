"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Github, Chrome } from "lucide-react";
import { Button, Input, Card, CardContent } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Ari Art
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to continue creating amazing art
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthLogin("google")}
              >
                <Chrome className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthLogin("github")}
              >
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
                or continue with email
              </span>
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:underline dark:text-purple-400"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
              >
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-purple-600 hover:underline dark:text-purple-400"
          >
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
