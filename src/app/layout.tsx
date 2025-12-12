import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Ari Art Store - AI Art Generation Platform",
    template: "%s | Ari Art Store",
  },
  description:
    "Create stunning AI-generated artwork with our powerful platform. Generate, customize, and sell unique digital art using cutting-edge AI models.",
  keywords: [
    "AI art",
    "AI image generation",
    "digital art",
    "art marketplace",
    "stable diffusion",
    "DALL-E",
    "art creation",
  ],
  authors: [{ name: "Ari Art Store" }],
  creator: "Ari Art Store",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ari Art Store",
    title: "Ari Art Store - AI Art Generation Platform",
    description:
      "Create stunning AI-generated artwork with our powerful platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ari Art Store - AI Art Generation Platform",
    description:
      "Create stunning AI-generated artwork with our powerful platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
