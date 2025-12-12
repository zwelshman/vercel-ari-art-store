"use client";

import * as React from "react";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  if (src && !imageError) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-semibold text-white",
        sizeClasses[size],
        className
      )}
    >
      {name ? getInitials(name) : "?"}
    </div>
  );
}
