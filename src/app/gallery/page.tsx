"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Grid, LayoutGrid } from "lucide-react";
import { Input, Button, Select, Badge, Card, CardContent } from "@/components/ui";
import { ArtworkCard } from "@/components/art/artwork-card";
import { CATEGORIES, ART_STYLES, ArtworkWithUser } from "@/types";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<ArtworkWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArtworks();
  }, [category, style, page]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (category) params.set("category", category);
      if (style) params.set("style", style);
      if (search) params.set("search", search);

      const response = await fetch(`/api/artwork?${params}`);
      const data = await response.json();

      setArtworks(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArtworks();
  };

  // Demo artworks for display
  const demoArtworks: ArtworkWithUser[] = [
    {
      id: "1",
      title: "Cosmic Dreams",
      description: "A journey through space",
      prompt: "Cosmic nebula with vibrant colors, stars, and galaxies",
      imageUrl: "https://via.placeholder.com/400/9333ea/ffffff?text=Cosmic+Dreams",
      thumbnailUrl: "https://via.placeholder.com/400/9333ea/ffffff?text=Cosmic+Dreams",
      isPublic: true,
      isForSale: true,
      price: 29.99,
      licenseType: "PERSONAL",
      views: 1245,
      likes: 89,
      tags: ["space", "cosmic", "nebula"],
      category: "abstract",
      createdAt: new Date(),
      user: { id: "u1", name: "ArtistOne", image: null },
    },
    {
      id: "2",
      title: "Forest Spirit",
      description: "Mystical forest creature",
      prompt: "Ethereal forest spirit, magical, glowing, fantasy art",
      imageUrl: "https://via.placeholder.com/400/ec4899/ffffff?text=Forest+Spirit",
      thumbnailUrl: "https://via.placeholder.com/400/ec4899/ffffff?text=Forest+Spirit",
      isPublic: true,
      isForSale: true,
      price: 49.99,
      licenseType: "COMMERCIAL",
      views: 2341,
      likes: 156,
      tags: ["fantasy", "forest", "spirit"],
      category: "illustration",
      createdAt: new Date(),
      user: { id: "u2", name: "FantasyArt", image: null },
    },
    {
      id: "3",
      title: "Neon City",
      description: "Cyberpunk metropolis",
      prompt: "Cyberpunk city at night, neon lights, rain, futuristic",
      imageUrl: "https://via.placeholder.com/400/06b6d4/ffffff?text=Neon+City",
      thumbnailUrl: "https://via.placeholder.com/400/06b6d4/ffffff?text=Neon+City",
      isPublic: true,
      isForSale: false,
      price: null,
      licenseType: "PERSONAL",
      views: 3456,
      likes: 234,
      tags: ["cyberpunk", "city", "neon"],
      category: "gaming",
      createdAt: new Date(),
      user: { id: "u3", name: "CyberArtist", image: null },
    },
    {
      id: "4",
      title: "Ocean Sunset",
      description: "Peaceful beach scene",
      prompt: "Beautiful ocean sunset, peaceful beach, golden hour",
      imageUrl: "https://via.placeholder.com/400/f59e0b/ffffff?text=Ocean+Sunset",
      thumbnailUrl: "https://via.placeholder.com/400/f59e0b/ffffff?text=Ocean+Sunset",
      isPublic: true,
      isForSale: true,
      price: 19.99,
      licenseType: "PERSONAL",
      views: 1876,
      likes: 112,
      tags: ["nature", "ocean", "sunset"],
      category: "nature",
      createdAt: new Date(),
      user: { id: "u4", name: "NatureVibes", image: null },
    },
  ];

  const displayArtworks = artworks.length > 0 ? artworks : demoArtworks;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Art Gallery
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Explore stunning AI-generated artwork from our community
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search artworks..."
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </form>

                {/* Category Filter */}
                <Select
                  value={category}
                  onChange={setCategory}
                  options={[
                    { value: "", label: "All Categories" },
                    ...CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  className="w-full md:w-48"
                />

                {/* Style Filter */}
                <Select
                  value={style}
                  onChange={setStyle}
                  options={[
                    { value: "", label: "All Styles" },
                    ...ART_STYLES.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  className="w-full md:w-48"
                />

                {/* View Toggle */}
                <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-md p-2 ${
                      viewMode === "grid"
                        ? "bg-white shadow dark:bg-gray-700"
                        : "text-gray-500"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("large")}
                    className={`rounded-md p-2 ${
                      viewMode === "large"
                        ? "bg-white shadow dark:bg-gray-700"
                        : "text-gray-500"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {(category || style || search) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {search && (
                    <Badge variant="secondary">
                      Search: {search}
                      <button
                        onClick={() => setSearch("")}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {category && (
                    <Badge variant="secondary">
                      {CATEGORIES.find((c) => c.id === category)?.name}
                      <button
                        onClick={() => setCategory("")}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {style && (
                    <Badge variant="secondary">
                      {ART_STYLES.find((s) => s.id === style)?.name}
                      <button
                        onClick={() => setStyle("")}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                      setStyle("");
                    }}
                    className="text-sm text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Gallery Grid */}
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
            transition={{ delay: 0.2 }}
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "sm:grid-cols-2 lg:grid-cols-2"
            }`}
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
            <p className="text-gray-500 dark:text-gray-400">
              No artworks found. Try adjusting your filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-4 text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
