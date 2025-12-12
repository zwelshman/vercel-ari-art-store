"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share2,
  Heart,
  Expand,
  X,
  Copy,
  Check,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  prompt?: string;
  onSave?: (imageUrl: string) => void;
  onShare?: (imageUrl: string) => void;
  className?: string;
}

export function ImageGallery({
  images,
  prompt,
  onSave,
  onShare,
  className,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentImage = images[selectedIndex];

  const handleDownload = async () => {
    if (!currentImage) return;

    const response = await fetch(currentImage);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ari-art-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleCopyPrompt = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
          className
        )}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your generated images will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={currentImage}
              alt="Generated artwork"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
            >
              <Download className="mr-1 h-4 w-4" />
              Download
            </Button>
            {onSave && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSave(currentImage)}
                className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
              >
                <Heart className="mr-1 h-4 w-4" />
                Save
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {onShare && (
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onShare(currentImage)}
                className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setFullscreenOpen(true)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                selectedIndex === index
                  ? "border-purple-500 ring-2 ring-purple-500/20"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Prompt Display */}
      {prompt && (
        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Prompt
              </p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {prompt}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreenOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setFullscreenOpen(false)}
          >
            <button
              onClick={() => setFullscreenOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage}
                alt="Generated artwork"
                width={1024}
                height={1024}
                className="max-h-[90vh] w-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
