import Replicate from "replicate";
import OpenAI from "openai";
import { GenerationParams, GenerationResult, StyleTransferParams } from "@/types";

// Initialize clients
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model configurations
const MODELS = {
  "stable-diffusion-xl": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
  "stable-diffusion-3": "stability-ai/stable-diffusion-3",
  "playground-v2.5": "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24",
  "kandinsky-2.2": "ai-forever/kandinsky-2.2:ea1addaab376f4dc227f5368bbd8ac01fcb023d6b93f470cc8e3d9f8b2aba266",
  "dall-e-3": "dall-e-3",
} as const;

// Style prompts for different art styles
const STYLE_PROMPTS: Record<string, string> = {
  anime: "anime style, vibrant colors, detailed, studio ghibli inspired",
  photorealistic: "photorealistic, 8k, highly detailed, professional photography, sharp focus",
  "digital-art": "digital art, trending on artstation, highly detailed, vibrant colors",
  "oil-painting": "oil painting, masterpiece, classical art, detailed brushstrokes, museum quality",
  watercolor: "watercolor painting, soft colors, artistic, flowing, delicate",
  "3d-render": "3d render, octane render, highly detailed, volumetric lighting, raytracing",
  "pixel-art": "pixel art, 8-bit, retro gaming style, nostalgic",
  "comic-book": "comic book style, bold lines, vibrant colors, dynamic composition",
  fantasy: "fantasy art, epic, magical, detailed, dramatic lighting",
  cyberpunk: "cyberpunk, neon lights, futuristic, dystopian, high tech low life",
  minimalist: "minimalist, clean, simple, elegant, modern design",
  abstract: "abstract art, non-representational, expressive, colorful, modern art",
  surreal: "surrealist art, dreamlike, Salvador Dali inspired, impossible, imaginative",
  "pop-art": "pop art style, Andy Warhol inspired, bold colors, graphic, commercial art",
};

// Generate image using Replicate (Stable Diffusion)
export async function generateWithReplicate(
  params: GenerationParams
): Promise<GenerationResult[]> {
  const {
    prompt,
    negativePrompt,
    model = "stable-diffusion-xl",
    width = 1024,
    height = 1024,
    steps = 30,
    guidance = 7.5,
    seed,
    style,
    numImages = 1,
  } = params;

  // Enhance prompt with style
  let enhancedPrompt = prompt;
  if (style && style !== "none" && STYLE_PROMPTS[style]) {
    enhancedPrompt = `${prompt}, ${STYLE_PROMPTS[style]}`;
  }

  const modelId = MODELS[model as keyof typeof MODELS] || MODELS["stable-diffusion-xl"];

  const input: Record<string, unknown> = {
    prompt: enhancedPrompt,
    negative_prompt: negativePrompt || "blurry, bad quality, distorted, ugly, deformed",
    width,
    height,
    num_inference_steps: steps,
    guidance_scale: guidance,
    num_outputs: numImages,
  };

  if (seed) {
    input.seed = seed;
  }

  const output = await replicate.run(modelId, { input }) as string[];

  return output.map((imageUrl, index) => ({
    id: `gen-${Date.now()}-${index}`,
    imageUrl,
    prompt: enhancedPrompt,
    model,
    width,
    height,
    seed: seed || undefined,
  }));
}

// Generate image using DALL-E 3
export async function generateWithDallE(
  params: GenerationParams
): Promise<GenerationResult[]> {
  const {
    prompt,
    style,
    numImages = 1,
  } = params;

  // Enhance prompt with style
  let enhancedPrompt = prompt;
  if (style && style !== "none" && STYLE_PROMPTS[style]) {
    enhancedPrompt = `${prompt}, ${STYLE_PROMPTS[style]}`;
  }

  const results: GenerationResult[] = [];

  // DALL-E 3 only supports 1 image at a time
  for (let i = 0; i < numImages; i++) {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid",
    });

    if (response.data[0]?.url) {
      results.push({
        id: `dalle-${Date.now()}-${i}`,
        imageUrl: response.data[0].url,
        prompt: enhancedPrompt,
        model: "dall-e-3",
        width: 1024,
        height: 1024,
      });
    }
  }

  return results;
}

// Main generation function
export async function generateImage(
  params: GenerationParams
): Promise<GenerationResult[]> {
  const { model = "stable-diffusion-xl" } = params;

  if (model === "dall-e-3") {
    return generateWithDallE(params);
  }

  return generateWithReplicate(params);
}

// Style transfer using Replicate
export async function styleTransfer(
  params: StyleTransferParams
): Promise<GenerationResult> {
  const { sourceImageUrl, styleImageUrl, styleName, strength = 0.5 } = params;

  // Use img2img for style transfer
  const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        image: sourceImageUrl,
        prompt: styleName ? `${STYLE_PROMPTS[styleName]}, masterpiece` : "artistic style transfer",
        strength: strength,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    }
  ) as string[];

  return {
    id: `style-${Date.now()}`,
    imageUrl: output[0],
    prompt: styleName || "style transfer",
    model: "stable-diffusion-xl",
    width: 1024,
    height: 1024,
  };
}

// Image upscaling
export async function upscaleImage(imageUrl: string, scale: number = 4): Promise<string> {
  const output = await replicate.run(
    "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
    {
      input: {
        image: imageUrl,
        scale,
        face_enhance: true,
      },
    }
  ) as string;

  return output;
}

// Image variation
export async function generateVariation(
  imageUrl: string,
  prompt: string,
  strength: number = 0.3
): Promise<GenerationResult> {
  const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        image: imageUrl,
        prompt,
        strength,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    }
  ) as string[];

  return {
    id: `var-${Date.now()}`,
    imageUrl: output[0],
    prompt,
    model: "stable-diffusion-xl",
    width: 1024,
    height: 1024,
  };
}

// Prompt enhancement using GPT
export async function enhancePrompt(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert at writing prompts for AI image generation.
        Enhance the user's prompt to be more detailed and descriptive while maintaining their original intent.
        Add details about lighting, composition, style, and quality.
        Keep the enhanced prompt under 200 words.
        Only output the enhanced prompt, nothing else.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 300,
  });

  return completion.choices[0]?.message?.content || prompt;
}

// Get available models
export function getAvailableModels() {
  return [
    { id: "stable-diffusion-xl", name: "Stable Diffusion XL", provider: "Stability AI" },
    { id: "playground-v2.5", name: "Playground v2.5", provider: "Playground AI" },
    { id: "kandinsky-2.2", name: "Kandinsky 2.2", provider: "AI Forever" },
    { id: "dall-e-3", name: "DALL-E 3", provider: "OpenAI" },
  ];
}
