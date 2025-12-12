"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { IMAGE_DIMENSIONS, ImageDimension } from "@/types";
import { cn } from "@/lib/utils";

interface DimensionSelectorProps {
  value: ImageDimension;
  onChange: (dimension: ImageDimension) => void;
  className?: string;
}

export function DimensionSelector({
  value,
  onChange,
  className,
}: DimensionSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Image Dimensions
      </label>
      <div className="flex flex-wrap gap-3">
        {IMAGE_DIMENSIONS.map((dimension) => {
          const aspectRatio = dimension.width / dimension.height;
          const previewWidth = 40;
          const previewHeight = previewWidth / aspectRatio;

          return (
            <motion.button
              key={dimension.id}
              onClick={() => onChange(dimension.id as ImageDimension)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                value === dimension.id
                  ? "border-purple-500 bg-purple-50 ring-2 ring-purple-500/20 dark:bg-purple-900/20"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              )}
            >
              {/* Preview shape */}
              <div
                className="rounded-sm bg-gradient-to-br from-purple-400 to-pink-500"
                style={{
                  width: previewWidth,
                  height: Math.max(previewHeight, 20),
                }}
              />
              <div className="text-center">
                <span className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  {dimension.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {dimension.width}x{dimension.height}
                </span>
              </div>

              {/* Selected indicator */}
              {value === dimension.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
