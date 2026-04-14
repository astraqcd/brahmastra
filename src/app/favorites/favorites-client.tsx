"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ToolCard } from "@/components/tool-card";
import fallbackData from "@/lib/data.json";
import { useI18n } from "@/lib/i18n/context";
import type { Tool } from "@/lib/types";

const toolsByUrl = new Map(fallbackData.tools.map((tool) => [tool.url, tool]));

export default function FavoritesClient() {
  const { t } = useI18n();
  const [favoriteUrls, setFavoriteUrls] = useState<string[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      const favoriteUrls = JSON.parse(
        localStorage.getItem("osint-favorites") || "[]",
      );
      setFavoriteUrls(favoriteUrls);
      const tools = favoriteUrls
        .map((url: string) => toolsByUrl.get(url))
        .filter(Boolean);
      setFavoriteTools(tools as Tool[]);
    };

    loadFavorites();

    const handleStorageChange = () => loadFavorites();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleFavorite = (toolUrl: string) => {
    const next = favoriteUrls.filter((url) => url !== toolUrl);
    localStorage.setItem("osint-favorites", JSON.stringify(next));
    setFavoriteUrls(next);
    setFavoriteTools((prev) => prev.filter((tool) => tool.url !== toolUrl));
  };

  const trackRecent = (toolUrl: string) => {
    const recent = JSON.parse(localStorage.getItem("osint-recent") || "[]");
    const next = [
      toolUrl,
      ...recent.filter((url: string) => url !== toolUrl),
    ].slice(0, 5);
    localStorage.setItem("osint-recent", JSON.stringify(next));
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            <h1 className="font-mono text-4xl sm:text-5xl text-foreground tracking-tight">
              {t("favorites.title")}{" "}
              <span className="text-foreground/60">
                {t("favorites.titleSuffix")}
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {t("favorites.subtitle")}
          </p>
          <div className="mt-4">
            <span className="text-sm font-medium text-muted-foreground">
              {favoriteTools.length}{" "}
              {favoriteTools.length !== 1
                ? t("favorites.countPlural")
                : t("favorites.count")}
            </span>
          </div>
        </div>

        {favoriteTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.url}
                tool={tool}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                onOpen={trackRecent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Star className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {t("favorites.empty")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("favorites.emptyDesc")}
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all"
              >
                {t("favorites.explore")}
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
