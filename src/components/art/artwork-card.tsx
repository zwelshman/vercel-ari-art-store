"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, Download, ShoppingCart, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Badge, Avatar, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { ArtworkWithUser } from "@/types";
import { useCartStore } from "@/store";

interface ArtworkCardProps {
  artwork: ArtworkWithUser;
  showActions?: boolean;
  onLike?: () => void;
}

export function ArtworkCard({ artwork, showActions = true, onLike }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (artwork.isForSale && artwork.price) {
      addItem({
        artworkId: artwork.id,
        title: artwork.title,
        imageUrl: artwork.imageUrl,
        price: artwork.price,
        licenseType: artwork.licenseType,
        quantity: 1,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/artwork/${artwork.id}`}>
        <div
          className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-xl dark:bg-gray-900"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-800" />
            )}
            <Image
              src={artwork.thumbnailUrl || artwork.imageUrl}
              alt={artwork.title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex gap-2">
              {artwork.isForSale && (
                <Badge variant="success">For Sale</Badge>
              )}
              {artwork.licenseType === "COMMERCIAL" && (
                <Badge variant="warning">Commercial</Badge>
              )}
            </div>

            {/* Quick Actions on Hover */}
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                className="absolute bottom-3 left-3 right-3 flex items-center justify-between"
              >
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onLike?.();
                    }}
                    className="flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-900 backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                    {artwork.likes}
                  </button>
                  <button className="flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-900 backdrop-blur-sm transition-colors hover:bg-white">
                    <Eye className="h-4 w-4" />
                    {artwork.views}
                  </button>
                </div>
                {artwork.isForSale && artwork.price && (
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {formatPrice(artwork.price)}
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {artwork.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                  {artwork.prompt}
                </p>
              </div>
            </div>

            {/* Author */}
            <div className="mt-3 flex items-center justify-between">
              <Link
                href={`/profile/${artwork.user.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2"
              >
                <Avatar
                  src={artwork.user.image}
                  name={artwork.user.name || "Anonymous"}
                  size="sm"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {artwork.user.name}
                </span>
              </Link>
              {artwork.isForSale && artwork.price && (
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {formatPrice(artwork.price)}
                </span>
              )}
            </div>

            {/* Tags */}
            {artwork.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {artwork.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
                {artwork.tags.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{artwork.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
