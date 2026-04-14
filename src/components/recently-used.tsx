"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n/context";
import type { Tool, ToolsData } from "@/lib/types";

export function RecentlyUsed({ toolsData }: { toolsData: ToolsData }) {
  const { t } = useI18n();
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  useEffect(() => {
    const recentUrls = JSON.parse(
      localStorage.getItem("osint-recent") || "[]"
    );
    const tools = recentUrls
      .map((url: string) => toolsData.tools.find((t) => t.url === url))
      .filter(Boolean);
    setRecentTools(tools);
  }, []);

  if (recentTools.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <Clock className="h-6 w-6 text-foreground/70" />
          <h2 className="font-mono text-2xl sm:text-3xl text-foreground tracking-tight">
            {t("recent.title")} <span className="text-foreground/60">{t("recent.titleSuffix")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {recentTools.map((tool, index) => (
            <ToolCard key={`${tool.name}-${index}`} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
