"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n/context";
import type { Tool, ToolsData } from "@/lib/types";

export function RecentlyUsed({ toolsData }: { toolsData: ToolsData }) {
  const { t } = useI18n();
  const [favoriteUrls, setFavoriteUrls] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  useEffect(() => {
    const loadLocalData = () => {
      const recentUrls = JSON.parse(
        localStorage.getItem("osint-recent") || "[]",
      );
      const favorites = JSON.parse(
        localStorage.getItem("osint-favorites") || "[]",
      );
      const tools = recentUrls
        .map((url: string) => toolsData.tools.find((t) => t.url === url))
        .filter(Boolean);
      setFavoriteUrls(favorites);
      setRecentTools(tools as Tool[]);
    };
    loadLocalData();
    window.addEventListener("storage", loadLocalData);
    return () => window.removeEventListener("storage", loadLocalData);
  }, [toolsData.tools]);

  const toggleFavorite = (toolUrl: string) => {
    const current = JSON.parse(localStorage.getItem("osint-favorites") || "[]");
    const exists = current.includes(toolUrl);
    const next = exists
      ? current.filter((url: string) => url !== toolUrl)
      : [...current, toolUrl];
    localStorage.setItem("osint-favorites", JSON.stringify(next));
    setFavoriteUrls(next);
  };

  const trackRecent = (toolUrl: string) => {
    const recent = JSON.parse(localStorage.getItem("osint-recent") || "[]");
    const next = [
      toolUrl,
      ...recent.filter((url: string) => url !== toolUrl),
    ].slice(0, 5);
    localStorage.setItem("osint-recent", JSON.stringify(next));
    const orderedTools = next
      .map((url: string) => toolsData.tools.find((tool) => tool.url === url))
      .filter(Boolean);
    setRecentTools(orderedTools as Tool[]);
  };

  if (recentTools.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <Clock className="h-6 w-6 text-foreground/70" />
          <h2 className="font-mono text-2xl sm:text-3xl text-foreground tracking-tight">
            {t("recent.title")}{" "}
            <span className="text-foreground/60">
              {t("recent.titleSuffix")}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {recentTools.map((tool) => (
            <ToolCard
              key={tool.url}
              tool={tool}
              isFavorite={favoriteUrls.includes(tool.url)}
              onToggleFavorite={toggleFavorite}
              onOpen={trackRecent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
