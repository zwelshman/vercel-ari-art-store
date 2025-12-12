import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  format: string;
}

// Upload image from URL
export async function uploadFromUrl(
  imageUrl: string,
  options?: {
    folder?: string;
    publicId?: string;
    tags?: string[];
  }
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: options?.folder || "ari-art-store",
    public_id: options?.publicId,
    tags: options?.tags,
    transformation: [
      { quality: "auto:best" },
      { fetch_format: "auto" },
    ],
  });

  // Generate thumbnail URL
  const thumbnailUrl = cloudinary.url(result.public_id, {
    width: 400,
    height: 400,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    thumbnailUrl,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

// Upload image from base64
export async function uploadFromBase64(
  base64Data: string,
  options?: {
    folder?: string;
    publicId?: string;
    tags?: string[];
  }
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(
    `data:image/png;base64,${base64Data}`,
    {
      folder: options?.folder || "ari-art-store",
      public_id: options?.publicId,
      tags: options?.tags,
      transformation: [
        { quality: "auto:best" },
        { fetch_format: "auto" },
      ],
    }
  );

  const thumbnailUrl = cloudinary.url(result.public_id, {
    width: 400,
    height: 400,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    thumbnailUrl,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

// Delete image
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

// Get optimized URL with transformations
export function getOptimizedUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
): string {
  return cloudinary.url(publicId, {
    width: options?.width,
    height: options?.height,
    crop: options?.crop || "fill",
    quality: options?.quality || "auto",
    fetch_format: "auto",
    secure: true,
  });
}

// Get responsive image URLs
export function getResponsiveUrls(publicId: string): {
  small: string;
  medium: string;
  large: string;
  original: string;
} {
  return {
    small: cloudinary.url(publicId, {
      width: 400,
      crop: "scale",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    }),
    medium: cloudinary.url(publicId, {
      width: 800,
      crop: "scale",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    }),
    large: cloudinary.url(publicId, {
      width: 1200,
      crop: "scale",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    }),
    original: cloudinary.url(publicId, {
      quality: "auto:best",
      fetch_format: "auto",
      secure: true,
    }),
  };
}

// Generate download URL with watermark (for non-purchased)
export function getWatermarkedUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: "auto" },
      {
        overlay: "text:Arial_40_bold:Ari%20Art%20Store",
        opacity: 50,
        gravity: "south_east",
        x: 10,
        y: 10,
      },
    ],
    secure: true,
  });
}

// Generate high-res download URL (for purchased)
export function getDownloadUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    flags: "attachment",
    quality: "auto:best",
    secure: true,
  });
}

export default cloudinary;
