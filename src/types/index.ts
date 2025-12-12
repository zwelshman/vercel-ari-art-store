import { LicenseType, SubscriptionTier, OrderStatus, TransactionType } from "@prisma/client";

// Re-export Prisma enums
export { LicenseType, SubscriptionTier, OrderStatus, TransactionType };

// Generation Types
export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance?: number;
  seed?: number;
  style?: string;
  numImages?: number;
}

export interface GenerationResult {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  model: string;
  width: number;
  height: number;
  seed?: number;
}

export interface StyleTransferParams {
  sourceImageUrl: string;
  styleImageUrl?: string;
  styleName?: string;
  strength?: number;
}

// Art Styles
export const ART_STYLES = [
  { id: "none", name: "None", description: "No specific style" },
  { id: "anime", name: "Anime", description: "Japanese animation style" },
  { id: "photorealistic", name: "Photorealistic", description: "Highly realistic photography" },
  { id: "digital-art", name: "Digital Art", description: "Modern digital artwork" },
  { id: "oil-painting", name: "Oil Painting", description: "Classic oil painting style" },
  { id: "watercolor", name: "Watercolor", description: "Soft watercolor painting" },
  { id: "3d-render", name: "3D Render", description: "3D rendered graphics" },
  { id: "pixel-art", name: "Pixel Art", description: "Retro pixel art style" },
  { id: "comic-book", name: "Comic Book", description: "Comic book illustration" },
  { id: "fantasy", name: "Fantasy", description: "Fantasy art style" },
  { id: "cyberpunk", name: "Cyberpunk", description: "Futuristic cyberpunk aesthetic" },
  { id: "minimalist", name: "Minimalist", description: "Clean minimal design" },
  { id: "abstract", name: "Abstract", description: "Abstract art style" },
  { id: "surreal", name: "Surreal", description: "Surrealist art style" },
  { id: "pop-art", name: "Pop Art", description: "Vibrant pop art style" },
] as const;

export type ArtStyle = typeof ART_STYLES[number]["id"];

// Categories
export const CATEGORIES = [
  { id: "gaming", name: "Gaming", icon: "gamepad-2" },
  { id: "branding", name: "Branding", icon: "badge" },
  { id: "social-media", name: "Social Media", icon: "share-2" },
  { id: "illustration", name: "Illustration", icon: "palette" },
  { id: "photography", name: "Photography", icon: "camera" },
  { id: "abstract", name: "Abstract", icon: "shapes" },
  { id: "nature", name: "Nature", icon: "leaf" },
  { id: "portraits", name: "Portraits", icon: "user" },
  { id: "architecture", name: "Architecture", icon: "building" },
  { id: "food", name: "Food", icon: "utensils" },
] as const;

export type Category = typeof CATEGORIES[number]["id"];

// Image Dimensions
export const IMAGE_DIMENSIONS = [
  { id: "square", width: 1024, height: 1024, label: "Square (1:1)" },
  { id: "portrait", width: 832, height: 1216, label: "Portrait (2:3)" },
  { id: "landscape", width: 1216, height: 832, label: "Landscape (3:2)" },
  { id: "wide", width: 1344, height: 768, label: "Wide (16:9)" },
  { id: "tall", width: 768, height: 1344, label: "Tall (9:16)" },
] as const;

export type ImageDimension = typeof IMAGE_DIMENSIONS[number]["id"];

// Subscription Plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  interval: "month" | "year";
  creditsPerMonth: number;
  features: string[];
  stripePriceId?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    tier: "FREE",
    price: 0,
    interval: "month",
    creditsPerMonth: 10,
    features: [
      "10 generations per month",
      "Standard quality",
      "Personal use only",
      "Community support",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    tier: "BASIC",
    price: 9.99,
    interval: "month",
    creditsPerMonth: 100,
    features: [
      "100 generations per month",
      "HD quality",
      "Personal use",
      "Style transfer",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tier: "PRO",
    price: 29.99,
    interval: "month",
    creditsPerMonth: 500,
    features: [
      "500 generations per month",
      "4K quality",
      "Commercial use",
      "All styles & models",
      "Priority generation",
      "API access",
      "Priority support",
    ],
  },
  {
    id: "commercial",
    name: "Commercial",
    tier: "COMMERCIAL",
    price: 99.99,
    interval: "month",
    creditsPerMonth: 2000,
    features: [
      "2000 generations per month",
      "8K quality",
      "Full commercial rights",
      "Exclusive licensing",
      "White-label options",
      "Dedicated API",
      "24/7 support",
      "Custom models",
    ],
  },
];

// License Pricing
export const LICENSE_PRICES: Record<LicenseType, number> = {
  PERSONAL: 0,
  COMMERCIAL: 29.99,
  EXCLUSIVE: 199.99,
  EXTENDED: 499.99,
};

// Print Options
export const PRINT_SIZES = [
  { id: "small", name: "Small (8x10)", price: 19.99 },
  { id: "medium", name: "Medium (16x20)", price: 39.99 },
  { id: "large", name: "Large (24x36)", price: 69.99 },
  { id: "xlarge", name: "Extra Large (30x40)", price: 99.99 },
] as const;

export const PRINT_MATERIALS = [
  { id: "poster", name: "Premium Poster", priceMultiplier: 1 },
  { id: "canvas", name: "Canvas Print", priceMultiplier: 1.5 },
  { id: "metal", name: "Metal Print", priceMultiplier: 2 },
  { id: "acrylic", name: "Acrylic Print", priceMultiplier: 2.5 },
] as const;

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User types
export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  subscriptionTier: SubscriptionTier;
  creditsRemaining: number;
  createdAt: Date;
}

// Artwork types
export interface ArtworkWithUser {
  id: string;
  title: string;
  description: string | null;
  prompt: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  isPublic: boolean;
  isForSale: boolean;
  price: number | null;
  licenseType: LicenseType;
  views: number;
  likes: number;
  tags: string[];
  category: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
