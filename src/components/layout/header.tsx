"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Menu,
  X,
  Sparkles,
  Image as ImageIcon,
  Store,
  User,
  LogOut,
  Settings,
  CreditCard,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import { Button, Avatar, Badge } from "@/components/ui";
import { useCartStore } from "@/store";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Create", href: "/create", icon: Sparkles },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Pricing", href: "/pricing", icon: CreditCard },
];

export function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { items, setIsOpen: setCartOpen } = useCartStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Ari Art
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-medium text-white">
                {cartItemCount}
              </span>
            )}
          </button>

          {status === "loading" ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Avatar
                  src={session.user.image}
                  name={session.user.name || "User"}
                  size="sm"
                />
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.user.creditsRemaining} credits
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user.email}
                      </p>
                      <Badge className="mt-2" variant="default">
                        {session.user.subscriptionTier}
                      </Badge>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-200 py-1 dark:border-gray-700">
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
