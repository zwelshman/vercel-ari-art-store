"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Palette, Upload, Wand2, Download, RefreshCw } from "lucide-react";
import { Button, Card, CardContent, Badge, Slider, Select } from "@/components/ui";
import { StyleSelector } from "@/components/art/style-selector";
import { ART_STYLES, ArtStyle } from "@/types";

export default function StyleTransferPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [style, setStyle] = useState<ArtStyle>("oil-painting");
  const [strength, setStrength] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransfer = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/style-transfer");
      return;
    }

    if (!sourceImage) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/style-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImage,
          styleName: style,
          strength,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Style transfer failed");
      }

      const data = await response.json();
      setResultImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;

    const response = await fetch(resultImage);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `style-transfer-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
            <Palette className="mr-1 h-3 w-3" />
            Style Transfer
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Transform Your Images
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Apply artistic styles to your photos using AI
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Panel - Upload & Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                {/* Upload Section */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Image
                  </label>
                  <div
                    className={`relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
                      sourceImage
                        ? "border-purple-500"
                        : "border-gray-300 hover:border-purple-400 dark:border-gray-700"
                    }`}
                  >
                    {sourceImage ? (
                      <Image
                        src={sourceImage}
                        alt="Source"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Click or drag to upload
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>
                  {sourceImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setSourceImage(null);
                        setResultImage(null);
                      }}
                    >
                      <RefreshCw className="mr-1 h-4 w-4" />
                      Change Image
                    </Button>
                  )}
                </div>

                {/* Style Selection */}
                <StyleSelector value={style} onChange={setStyle} className="mb-6" />

                {/* Strength Slider */}
                <Slider
                  label="Style Strength"
                  value={strength}
                  onChange={setStrength}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="mb-6"
                />

                {/* Error Display */}
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Transfer Button */}
                <Button
                  onClick={handleTransfer}
                  isLoading={loading}
                  disabled={!sourceImage || loading}
                  className="w-full"
                  size="lg"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Apply Style
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel - Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Result
                  </h3>
                  {resultImage && (
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>

                <div className="flex flex-1 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  {loading ? (
                    <div className="text-center">
                      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                      <p className="mt-4 text-sm text-gray-500">
                        Applying style...
                      </p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={resultImage}
                        alt="Result"
                        fill
                        className="rounded-lg object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Palette className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
                      <p className="mt-4 text-sm text-gray-500">
                        Upload an image and apply a style to see results
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Style Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Style Examples
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ART_STYLES.slice(1, 9).map((artStyle) => (
              <Card
                key={artStyle.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  style === artStyle.id
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
                onClick={() => setStyle(artStyle.id as ArtStyle)}
              >
                <CardContent className="p-4">
                  <div className="mb-3 aspect-square rounded-lg bg-gradient-to-br from-purple-400 to-pink-500" />
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {artStyle.name}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {artStyle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
