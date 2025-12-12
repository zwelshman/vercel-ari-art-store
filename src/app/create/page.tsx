"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, History, Save, AlertCircle } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { GenerationForm } from "@/components/art/generation-form";
import { ImageGallery } from "@/components/art/image-gallery";
import { useGenerationStore } from "@/store";

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    prompt,
    negativePrompt,
    style,
    width,
    height,
    steps,
    guidance,
    seed,
    numImages,
    isGenerating,
    setIsGenerating,
    generatedImages,
    setGeneratedImages,
    addToHistory,
    history,
  } = useGenerationStore();

  const creditsRemaining = session?.user?.creditsRemaining ?? 0;

  const handleGenerate = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/create");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (creditsRemaining < numImages) {
      setError("Not enough credits. Please upgrade your plan.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          style,
          width,
          height,
          steps,
          guidance,
          seed,
          numImages,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await response.json();
      setGeneratedImages(data.images.map((img: { imageUrl: string }) => img.imageUrl));

      // Add to history
      addToHistory({
        prompt,
        negativePrompt,
        style,
        width,
        height,
        steps,
        guidance,
        seed: seed || undefined,
        numImages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        useGenerationStore.getState().setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error("Failed to enhance prompt:", err);
    }
  };

  const handleSave = async (imageUrl: string) => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      await fetch("/api/artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          prompt,
          negativePrompt,
          style,
          width,
          height,
          steps,
          guidance,
          seed,
          title: prompt.slice(0, 50),
        }),
      });
    } catch (err) {
      console.error("Failed to save artwork:", err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            AI Art Generator
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Create Your Masterpiece
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Describe your vision and let AI bring it to life
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Generation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <GenerationForm
                  onGenerate={handleGenerate}
                  onEnhancePrompt={handleEnhancePrompt}
                  isLoading={isGenerating}
                  creditsRemaining={creditsRemaining}
                />

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  >
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </motion.div>
                )}

                {/* Auth Warning */}
                {!session && status !== "loading" && (
                  <div className="mt-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Please{" "}
                      <Link
                        href="/login"
                        className="font-medium underline hover:no-underline"
                      >
                        sign in
                      </Link>{" "}
                      to generate and save artwork.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* History */}
            {history.length > 0 && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <History className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Recent Prompts
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          useGenerationStore.getState().setPrompt(item.prompt);
                          if (item.style) {
                            useGenerationStore.getState().setStyle(item.style);
                          }
                        }}
                        className="w-full rounded-lg border border-gray-200 p-3 text-left text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <p className="line-clamp-2 text-gray-700 dark:text-gray-300">
                          {item.prompt}
                        </p>
                        {item.style && item.style !== "none" && (
                          <Badge className="mt-2" variant="secondary">
                            {item.style}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Generated Images */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Generated Artwork
                  </h3>
                  {generatedImages.length > 0 && session && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(generatedImages[0])}
                    >
                      <Save className="mr-1 h-4 w-4" />
                      Save to Gallery
                    </Button>
                  )}
                </div>
                <ImageGallery
                  images={generatedImages}
                  prompt={prompt}
                  onSave={session ? handleSave : undefined}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
