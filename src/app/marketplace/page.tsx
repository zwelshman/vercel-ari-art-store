"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Filter, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Input, Button, Select, Badge, Card, CardContent, Tabs } from "@/components/ui";
import { ArtworkCard } from "@/components/art/artwork-card";
import { ArtworkWithUser, CATEGORIES, LICENSE_PRICES } from "@/types";
import { formatPrice } from "@/lib/utils";

type SortOption = "newest" | "popular" | "price-low" | "price-high";

export default function MarketplacePage() {
  const [artworks, setArtworks] = useState<ArtworkWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchMarketplace();
  }, [category, sortBy, priceRange, licenseType]);

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        forSale: "true",
        limit: "24",
      });
      if (category) params.set("category", category);
      if (search) params.set("search", search);

      const response = await fetch(`/api/artwork?${params}`);
      const data = await response.json();
      setArtworks(data.items || []);
    } catch (error) {
      console.error("Failed to fetch marketplace:", error);
    } finally {
      setLoading(false);
    }
  };

  // Demo marketplace items
  const demoArtworks: ArtworkWithUser[] = [
    {
      id: "m1",
      title: "Digital Dreamscape",
      description: "Abstract digital art piece",
      prompt: "Abstract digital dreamscape with flowing colors",
      imageUrl: "https://via.placeholder.com/400/8b5cf6/ffffff?text=Dreamscape",
      thumbnailUrl: "https://via.placeholder.com/400/8b5cf6/ffffff?text=Dreamscape",
      isPublic: true,
      isForSale: true,
      price: 49.99,
      licenseType: "COMMERCIAL",
      views: 5432,
      likes: 321,
      tags: ["abstract", "digital", "colorful"],
      category: "abstract",
      createdAt: new Date(),
      user: { id: "seller1", name: "DigitalDreamer", image: null },
    },
    {
      id: "m2",
      title: "Warrior Princess",
      description: "Fantasy character art",
      prompt: "Warrior princess in golden armor, epic fantasy",
      imageUrl: "https://via.placeholder.com/400/ec4899/ffffff?text=Warrior",
      thumbnailUrl: "https://via.placeholder.com/400/ec4899/ffffff?text=Warrior",
      isPublic: true,
      isForSale: true,
      price: 79.99,
      licenseType: "EXCLUSIVE",
      views: 8765,
      likes: 567,
      tags: ["fantasy", "character", "warrior"],
      category: "illustration",
      createdAt: new Date(),
      user: { id: "seller2", name: "FantasyForge", image: null },
    },
    {
      id: "m3",
      title: "Brand Logo Pack",
      description: "Professional logo designs",
      prompt: "Modern minimalist logo design, professional branding",
      imageUrl: "https://via.placeholder.com/400/06b6d4/ffffff?text=Logo+Pack",
      thumbnailUrl: "https://via.placeholder.com/400/06b6d4/ffffff?text=Logo+Pack",
      isPublic: true,
      isForSale: true,
      price: 199.99,
      licenseType: "EXTENDED",
      views: 12345,
      likes: 890,
      tags: ["branding", "logo", "business"],
      category: "branding",
      createdAt: new Date(),
      user: { id: "seller3", name: "BrandMaster", image: null },
    },
    {
      id: "m4",
      title: "Sci-Fi Landscape",
      description: "Futuristic alien world",
      prompt: "Alien planet landscape, two suns, sci-fi",
      imageUrl: "https://via.placeholder.com/400/f59e0b/ffffff?text=Sci-Fi",
      thumbnailUrl: "https://via.placeholder.com/400/f59e0b/ffffff?text=Sci-Fi",
      isPublic: true,
      isForSale: true,
      price: 34.99,
      licenseType: "PERSONAL",
      views: 4321,
      likes: 234,
      tags: ["sci-fi", "landscape", "alien"],
      category: "gaming",
      createdAt: new Date(),
      user: { id: "seller4", name: "SpaceArtist", image: null },
    },
    {
      id: "m5",
      title: "Portrait Collection",
      description: "AI portrait series",
      prompt: "Professional portrait, studio lighting, artistic",
      imageUrl: "https://via.placeholder.com/400/ef4444/ffffff?text=Portrait",
      thumbnailUrl: "https://via.placeholder.com/400/ef4444/ffffff?text=Portrait",
      isPublic: true,
      isForSale: true,
      price: 59.99,
      licenseType: "COMMERCIAL",
      views: 6543,
      likes: 432,
      tags: ["portrait", "professional", "studio"],
      category: "portraits",
      createdAt: new Date(),
      user: { id: "seller5", name: "PortraitPro", image: null },
    },
    {
      id: "m6",
      title: "Nature Pack",
      description: "Beautiful nature scenes",
      prompt: "Stunning nature photography, landscapes, high quality",
      imageUrl: "https://via.placeholder.com/400/22c55e/ffffff?text=Nature",
      thumbnailUrl: "https://via.placeholder.com/400/22c55e/ffffff?text=Nature",
      isPublic: true,
      isForSale: true,
      price: 24.99,
      licenseType: "PERSONAL",
      views: 7654,
      likes: 543,
      tags: ["nature", "landscape", "photography"],
      category: "nature",
      createdAt: new Date(),
      user: { id: "seller6", name: "NatureLens", image: null },
    },
  ];

  const displayArtworks = artworks.length > 0 ? artworks : demoArtworks;

  const tabs = [
    { id: "all", label: "All", icon: <ShoppingBag className="h-4 w-4" /> },
    { id: "trending", label: "Trending", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "new", label: "New", icon: <Clock className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Marketplace
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Buy and sell unique AI-generated artwork
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { label: "Listed Artworks", value: "12,450+", icon: ShoppingBag },
            { label: "Total Sales", value: "$1.2M+", icon: DollarSign },
            { label: "Active Artists", value: "3,200+", icon: TrendingUp },
            { label: "Avg. Sale Price", value: "$45", icon: DollarSign },
          ].map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <stat.icon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search marketplace..."
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>

                <Select
                  value={category}
                  onChange={setCategory}
                  options={[
                    { value: "", label: "All Categories" },
                    ...CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  className="w-full md:w-40"
                />

                <Select
                  value={licenseType}
                  onChange={setLicenseType}
                  options={[
                    { value: "", label: "All Licenses" },
                    { value: "PERSONAL", label: `Personal (Free)` },
                    { value: "COMMERCIAL", label: `Commercial (+${formatPrice(LICENSE_PRICES.COMMERCIAL)})` },
                    { value: "EXCLUSIVE", label: `Exclusive (+${formatPrice(LICENSE_PRICES.EXCLUSIVE)})` },
                    { value: "EXTENDED", label: `Extended (+${formatPrice(LICENSE_PRICES.EXTENDED)})` },
                  ]}
                  className="w-full md:w-48"
                />

                <Select
                  value={sortBy}
                  onChange={(v) => setSortBy(v as SortOption)}
                  options={[
                    { value: "newest", label: "Newest" },
                    { value: "popular", label: "Most Popular" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                  ]}
                  className="w-full md:w-40"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Marketplace Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {displayArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && displayArtworks.length === 0 && (
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              No artwork for sale matching your criteria.
            </p>
          </div>
        )}

        {/* Become a Seller CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="overflow-hidden">
            <div className="flex flex-col items-center gap-6 bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white md:flex-row md:text-left">
              <div className="flex-1">
                <h3 className="text-2xl font-bold">Start Selling Your Art</h3>
                <p className="mt-2 text-white/80">
                  Join our community of artists and earn money from your AI-generated creations.
                </p>
              </div>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Become a Seller
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
