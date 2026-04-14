"use client";
import {
  Bug,
  EyeOff,
  Globe,
  Image,
  Mail,
  Radio,
  Satellite,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { ToolsData } from "@/lib/types";

const categoryIcons = {
  GEOINT: Satellite,
  IMINT: Image,
  SOCMINT: Users,
  WEBINT: Globe,
  PHONE_EMAIL: Mail,
  DARKWEB: EyeOff,
  SIGINT: Radio,
  MALWARE: Bug,
};

export function CategoryGrid({ toolsData }: { toolsData: ToolsData }) {
  const { t } = useI18n();

  const toolsByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const tool of toolsData.tools) {
      counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1);
    }
    return counts;
  }, [toolsData.tools]);

  return (
    <section id="categories" className="py-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl sm:text-4xl text-foreground mb-4 tracking-tight">
            {t("categories.title")}{" "}
            <span className="text-foreground/60">
              {t("categories.titleSuffix")}
            </span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            {t("categories.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toolsData.categories.map((category) => {
            const Icon =
              categoryIcons[category.id as keyof typeof categoryIcons];
            const toolCount = toolsByCategory.get(category.id) ?? 0;

            return (
              <CategoryCard
                key={category.id}
                category={category}
                Icon={Icon}
                toolCount={toolCount}
                toolsLabel={
                  toolCount !== 1 ? t("categories.tools") : t("categories.tool")
                }
                exploreLabel={t("categories.explore")}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  Icon,
  toolCount,
  toolsLabel,
  exploreLabel,
}: {
  category: { id: string; slug: string; title: string; description: string };
  Icon: React.ComponentType<{ className?: string }> | undefined;
  toolCount: number;
  toolsLabel: string;
  exploreLabel: string;
}) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative p-6 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all duration-300 hover:shadow-lg hover:shadow-foreground/5 overflow-hidden min-h-[220px]"
    >
      <div className="relative z-3">
        <div className="w-12 h-12 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center mb-4 group-hover:bg-white/15 group-hover:border-white/20 transition-colors duration-300">
          {Icon && (
            <Icon className="h-6 w-6 text-foreground/70 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
          )}
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-white transition-colors duration-300">
          {category.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2 group-hover:text-white/80 transition-colors duration-300">
          {category.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground group-hover:text-white/70 transition-colors duration-300">
            {toolCount} {toolsLabel}
          </span>
          <span className="text-xs font-medium text-foreground/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
            {exploreLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
