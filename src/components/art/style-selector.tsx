"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ART_STYLES, ArtStyle } from "@/types";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  value: ArtStyle;
  onChange: (style: ArtStyle) => void;
  className?: string;
}

// Sample preview images for styles (using gradient placeholders)
const stylePreviewColors: Record<string, string> = {
  none: "from-gray-200 to-gray-400",
  anime: "from-pink-400 to-purple-500",
  photorealistic: "from-blue-400 to-cyan-500",
  "digital-art": "from-purple-400 to-indigo-500",
  "oil-painting": "from-amber-400 to-orange-500",
  watercolor: "from-cyan-300 to-blue-400",
  "3d-render": "from-violet-400 to-purple-600",
  "pixel-art": "from-green-400 to-emerald-500",
  "comic-book": "from-red-400 to-yellow-500",
  fantasy: "from-purple-500 to-pink-500",
  cyberpunk: "from-cyan-400 to-pink-500",
  minimalist: "from-gray-300 to-gray-500",
  abstract: "from-red-500 to-purple-500",
  surreal: "from-indigo-400 to-purple-600",
  "pop-art": "from-yellow-400 to-red-500",
};

export function StyleSelector({ value, onChange, className }: StyleSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Art Style
      </label>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {ART_STYLES.map((style) => (
          <motion.button
            key={style.id}
            onClick={() => onChange(style.id as ArtStyle)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative flex flex-col items-center overflow-hidden rounded-lg border-2 p-2 transition-all",
              value === style.id
                ? "border-purple-500 ring-2 ring-purple-500/20"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
          >
            {/* Preview gradient */}
            <div
              className={cn(
                "mb-2 h-16 w-full rounded-md bg-gradient-to-br",
                stylePreviewColors[style.id] || "from-gray-300 to-gray-400"
              )}
            />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {style.name}
            </span>

            {/* Selected indicator */}
            {value === style.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500"
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
