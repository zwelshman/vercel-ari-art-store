"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl dark:bg-gray-900"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Cart
                  </h2>
                  {items.length > 0 && (
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      {items.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    <ShoppingBag className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Your cart is empty
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Discover amazing AI artwork in our marketplace
                    </p>
                    <Link href="/marketplace" onClick={() => setIsOpen(false)}>
                      <Button className="mt-6">Browse Marketplace</Button>
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {items.map((item) => (
                      <li key={item.artworkId} className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {item.title}
                                </h4>
                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                  {item.licenseType} License
                                </p>
                                {item.printSize && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.printSize} - {item.printMaterial}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => removeItem(item.artworkId)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.artworkId,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  className="rounded-md border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.artworkId, item.quantity + 1)
                                  }
                                  className="rounded-md border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 p-6 dark:border-gray-800">
                  <div className="flex items-center justify-between text-base font-medium text-gray-900 dark:text-white">
                    <p>Subtotal</p>
                    <p>{formatPrice(total)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Taxes calculated at checkout
                  </p>
                  <div className="mt-6 space-y-3">
                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" size="lg">
                        Checkout
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
