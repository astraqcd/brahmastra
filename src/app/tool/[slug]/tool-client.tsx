"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Star,
  Copy,
  CheckCircle2,
  AlertCircle,
  Globe,
  Tag,
  Layers,
  ExternalLink,
  Satellite,
  Image as ImageIcon,
  Users,
  Mail,
  EyeOff,
  Radio,
  Bug,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HealthMonitor } from "@/components/health-monitor";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import type { ToolsData } from "@/lib/types";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  GEOINT: Satellite,
  IMINT: ImageIcon,
  SOCMINT: Users,
  WEBINT: Globe,
  PHONE_EMAIL: Mail,
  DARKWEB: EyeOff,
  SIGINT: Radio,
  MALWARE: Bug,
};

const categoryColors: Record<string, string> = {
  GEOINT: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  IMINT: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  SOCMINT: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  WEBINT: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  PHONE_EMAIL: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  DARKWEB: "from-red-500/20 to-rose-500/20 border-red-500/30",
  SIGINT: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  MALWARE: "from-orange-500/20 to-red-500/20 border-orange-500/30",
};

const categoryIconBg: Record<string, string> = {
  GEOINT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  IMINT: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  SOCMINT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  WEBINT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PHONE_EMAIL: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  DARKWEB: "bg-red-500/10 text-red-400 border-red-500/20",
  SIGINT: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  MALWARE: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ToolClientProps {
  slug: string;
  toolsData: ToolsData;
}

export default function ToolClient({ slug, toolsData }: ToolClientProps) {
  const router = useRouter();
  const { t } = useI18n();

  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  const tool = toolsData.tools.find((t) => slugify(t.name) === slug);
  const category = tool
    ? toolsData.categories.find((c) => c.id === tool.category)
    : null;

  const Icon = tool ? categoryIcons[tool.category] : null;

  const relatedTools = tool
    ? toolsData.tools
        .filter((t) => t.category === tool.category && t.name !== tool.name)
        .slice(0, 4)
    : [];

  useEffect(() => {
    if (tool) {
      const favorites = JSON.parse(
        localStorage.getItem("osint-favorites") || "[]"
      );
      setIsFavorite(favorites.includes(tool.url));

      const recent = JSON.parse(localStorage.getItem("osint-recent") || "[]");
      const newRecent = [
        tool.url,
        ...recent.filter((url: string) => url !== tool.url),
      ].slice(0, 5);
      localStorage.setItem("osint-recent", JSON.stringify(newRecent));
    }
  }, [tool]);

  const toggleFavorite = () => {
    if (!tool) return;
    const favorites = JSON.parse(
      localStorage.getItem("osint-favorites") || "[]"
    );
    if (isFavorite) {
      const newFavorites = favorites.filter(
        (url: string) => url !== tool.url
      );
      localStorage.setItem("osint-favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(tool.url);
      localStorage.setItem("osint-favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleCopy = () => {
    if (!tool) return;
    navigator.clipboard.writeText(tool.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tool) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("tool.notFound")}
          </h1>
          <Button onClick={() => router.push("/")}>{t("common.returnHome")}</Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="relative w-full h-48 sm:h-64 md:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,_rgba(56,189,248,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,_rgba(99,102,241,0.06)_0%,_transparent_50%)]" />

        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-[25%] left-[30%] w-0.5 h-0.5 bg-white/80 rounded-full" />
          <div className="absolute top-[10%] left-[55%] w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-[35%] left-[70%] w-0.5 h-0.5 bg-white/60 rounded-full" />
          <div className="absolute top-[20%] left-[85%] w-1 h-1 bg-white/70 rounded-full" />
          <div className="absolute top-[8%] left-[45%] w-0.5 h-0.5 bg-white rounded-full" />
          <div className="absolute top-[40%] left-[20%] w-0.5 h-0.5 bg-white/50 rounded-full" />
          <div className="absolute top-[30%] left-[92%] w-1 h-1 bg-white/60 rounded-full" />
          <div className="absolute top-[5%] left-[75%] w-0.5 h-0.5 bg-white/80 rounded-full" />
          <div className="absolute top-[45%] left-[50%] w-0.5 h-0.5 bg-white/40 rounded-full" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24">
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute bottom-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
          <div className="absolute bottom-14 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent blur-sm" />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-20">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex items-center justify-center mb-5 shadow-2xl backdrop-blur-sm bg-gradient-to-br ${categoryColors[tool.category] || "from-foreground/10 to-foreground/5 border-foreground/20"}`}
        >
          {Icon && <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-foreground/80" />}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>

        <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl text-foreground mb-2 tracking-tight">
          {tool.name}
        </h1>

        <div className="mt-6 border-t border-border/50 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-28 flex-shrink-0 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              {t("tool.category")}
            </span>
            <Link
              href={`/category/${category?.slug || ""}`}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80 ${categoryIconBg[tool.category] || "bg-foreground/5 text-foreground/70 border-foreground/10"}`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {category?.title || tool.category}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-28 flex-shrink-0 flex items-center gap-2">
              {tool.working ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {t("tool.status")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                tool.working
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {tool.working ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t("tool.operational")}
                </>
              ) : (
                <>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {t("tool.inactive")}
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-28 flex-shrink-0 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t("tool.url")}
            </span>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline truncate max-w-md transition-colors"
            >
              {tool.url}
            </a>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-sm text-muted-foreground w-28 flex-shrink-0 flex items-center gap-2 pt-1">
              <Tag className="h-4 w-4" />
              {t("tool.tags")}
            </span>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-border/50" />

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("tool.description")}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            {tool.description}
          </p>
        </div>

        {/* Health Monitor */}
        <div className="mb-8">
          <HealthMonitor toolUrl={tool.url} toolName={tool.name} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-12">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl"
          >
            {t("tool.visitTool")}
            <ArrowUpRight className="h-4 w-4" />
          </a>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-sm font-medium transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {t("tool.copied")}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {t("tool.copyLink")}
              </>
            )}
          </button>

          <button
            onClick={toggleFavorite}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
              isFavorite
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
                : "border-border bg-card hover:bg-accent text-foreground"
            }`}
          >
            <Star
              className={`h-4 w-4 ${isFavorite ? "fill-yellow-500" : ""}`}
            />
            {isFavorite ? t("tool.favorited") : t("tool.addFavorite")}
          </button>
        </div>

        {relatedTools.length > 0 && (
          <div className="mb-16">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {t("tool.relatedTools")} {category?.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedTools.map((related) => {
                const RelatedIcon = categoryIcons[related.category];
                return (
                  <Link
                    key={related.name}
                    href={`/tool/${slugify(related.name)}`}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-foreground/20 transition-all duration-200"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${categoryIconBg[related.category] || "bg-foreground/5 text-foreground/70 border-foreground/10"}`}
                    >
                      {RelatedIcon && <RelatedIcon className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground text-sm group-hover:text-foreground/80 transition-colors truncate">
                          {related.name}
                        </h3>
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {related.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
