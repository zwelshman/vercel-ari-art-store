"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, Github, Chrome, Check } from "lucide-react";
import { Button, Input, Card, CardContent } from "@/components/ui";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Sign in after registration
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
        });
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  const benefits = [
    "10 free AI art generations",
    "Access to all art styles",
    "Save and organize your creations",
    "Join our creative community",
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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
              Create your account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Start creating amazing AI art for free
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
                  or register with email
                </span>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />
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
                  placeholder="Password (min. 8 characters)"
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                  minLength={8}
                />

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-purple-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={loading}
                >
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:underline dark:text-purple-400"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Benefits (hidden on mobile) */}
      <div className="hidden bg-gradient-to-br from-purple-600 to-pink-600 p-12 lg:flex lg:w-1/2 lg:items-center lg:justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-lg text-white"
        >
          <h3 className="text-3xl font-bold">
            Start creating with AI today
          </h3>
          <p className="mt-4 text-lg text-white/80">
            Join thousands of artists and creators using AI to bring their
            visions to life.
          </p>

          <ul className="mt-8 space-y-4">
            {benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-lg">{benefit}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-12">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400"
                  />
                ))}
              </div>
              <div>
                <p className="font-semibold">10,000+ creators</p>
                <p className="text-sm text-white/80">
                  Already using Ari Art
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
