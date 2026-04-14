"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FuzzySearch } from "@/components/fuzzy-search";
import { useI18n } from "@/lib/i18n/context";
import type { ToolsData } from "@/lib/types";

export function HeroSection({ toolsData }: { toolsData: ToolsData }) {
  const { t } = useI18n();
  const totalTools = toolsData.tools.length;
  const totalCategories = toolsData.categories.length;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl text-center">
        <h1 className="font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] sm:tracking-[0.25em] text-foreground text-balance">
          {t("hero.title")}
          <span className="text-foreground/50"> {t("hero.titleSuffix")}</span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm sm:text-base text-muted-foreground/80 mb-6">
          {t("hero.subtitle")}
        </p>

        {/* Fuzzy Search */}
        <div className="mb-8">
          <FuzzySearch tools={toolsData.tools} />
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <Button size="default"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 text-sm"
            asChild
          >
            <Link href="#categories">{t("hero.explore")}</Link>
          </Button>
          <Button
            size="default"
            variant="outline"
            className="rounded-full border-border/60 hover:bg-accent px-6 text-sm"
            asChild
          >
            <Link href="/about">{t("hero.learnMore")}</Link>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-8 sm:gap-12 text-muted-foreground/70">
          <div className="text-center">
            <div className="font-mono text-xl sm:text-2xl text-foreground/80">
              {totalTools}+
            </div>
            <div className="text-xs mt-0.5">{t("hero.tools")}</div>
          </div>
          <div className="w-px h-8 bg-border/40" />
          <div className="text-center">
            <div className="font-mono text-xl sm:text-2xl text-foreground/80">
              {totalCategories}
            </div>
            <div className="text-xs mt-0.5">{t("hero.disciplines")}</div>
          </div>
          <div className="w-px h-8 bg-border/40" />
          <div className="text-center">
            <div className="font-mono text-xl sm:text-2xl text-foreground/80">
              {t("hero.free")}
            </div>
            <div className="text-xs mt-0.5">{t("hero.openSource")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
