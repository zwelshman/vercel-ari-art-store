"use client";

import { useState } from "react";
import { Wand2, RefreshCw, Sparkles, Settings2 } from "lucide-react";
import { Button, Textarea, Input, Slider, Tabs, TabPanel } from "@/components/ui";
import { StyleSelector } from "./style-selector";
import { DimensionSelector } from "./dimension-selector";
import { useGenerationStore } from "@/store";
import { IMAGE_DIMENSIONS } from "@/types";
import { cn } from "@/lib/utils";

interface GenerationFormProps {
  onGenerate: () => void;
  onEnhancePrompt?: () => void;
  isLoading?: boolean;
  creditsRemaining?: number;
}

export function GenerationForm({
  onGenerate,
  onEnhancePrompt,
  isLoading = false,
  creditsRemaining = 0,
}: GenerationFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const {
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    style,
    setStyle,
    width,
    height,
    setDimensions,
    steps,
    setSteps,
    guidance,
    setGuidance,
    seed,
    setSeed,
    numImages,
    setNumImages,
  } = useGenerationStore();

  const currentDimension =
    IMAGE_DIMENSIONS.find((d) => d.width === width && d.height === height)?.id ||
    "square";

  const handleDimensionChange = (dimensionId: string) => {
    const dimension = IMAGE_DIMENSIONS.find((d) => d.id === dimensionId);
    if (dimension) {
      setDimensions(dimension.width, dimension.height);
    }
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 999999999));
  };

  const tabs = [
    { id: "basic", label: "Basic", icon: <Sparkles className="h-4 w-4" /> },
    { id: "advanced", label: "Advanced", icon: <Settings2 className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Describe your artwork
          </label>
          {onEnhancePrompt && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEnhancePrompt}
              disabled={!prompt || isLoading}
            >
              <Sparkles className="mr-1 h-4 w-4" />
              Enhance
            </Button>
          )}
        </div>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A magical forest with glowing mushrooms, bioluminescent plants, ethereal mist, fantasy art style, highly detailed..."
          className="min-h-[120px]"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Be descriptive! Include details about style, mood, lighting, and composition.
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Basic Settings */}
      {activeTab === "basic" && (
        <TabPanel className="space-y-6">
          <StyleSelector value={style} onChange={setStyle} />
          <DimensionSelector
            value={currentDimension}
            onChange={handleDimensionChange}
          />

          {/* Number of Images */}
          <div className="space-y-3">
            <Slider
              label="Number of Images"
              value={numImages}
              onChange={setNumImages}
              min={1}
              max={4}
              step={1}
            />
          </div>
        </TabPanel>
      )}

      {/* Advanced Settings */}
      {activeTab === "advanced" && (
        <TabPanel className="space-y-6">
          {/* Negative Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Negative Prompt (what to avoid)
            </label>
            <Textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blurry, low quality, distorted, ugly, deformed..."
              className="min-h-[80px]"
            />
          </div>

          {/* Steps */}
          <Slider
            label="Quality (Steps)"
            value={steps}
            onChange={setSteps}
            min={10}
            max={50}
            step={1}
          />

          {/* Guidance */}
          <Slider
            label="Prompt Guidance"
            value={guidance}
            onChange={setGuidance}
            min={1}
            max={20}
            step={0.5}
          />

          {/* Seed */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Seed (for reproducibility)
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={seed || ""}
                onChange={(e) =>
                  setSeed(e.target.value ? parseInt(e.target.value) : null)
                }
                placeholder="Random"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleRandomSeed}
                title="Generate random seed"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabPanel>
      )}

      {/* Generate Button */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={onGenerate}
          isLoading={isLoading}
          disabled={!prompt || isLoading || creditsRemaining < numImages}
          className="w-full"
          size="lg"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          Generate {numImages > 1 ? `${numImages} Images` : "Image"}
        </Button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {creditsRemaining} credits remaining
          {numImages > creditsRemaining && (
            <span className="text-red-500"> (not enough credits)</span>
          )}
        </p>
      </div>
    </div>
  );
}
