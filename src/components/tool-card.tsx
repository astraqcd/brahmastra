"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Copy,
  Star,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import type { Tool } from "@/lib/types";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

const categoryAccent: Record<string, string> = {
  GEOINT: "border-emerald-500/30 group-hover:border-emerald-500/50",
  IMINT: "border-violet-500/30 group-hover:border-violet-500/50",
  SOCMINT: "border-blue-500/30 group-hover:border-blue-500/50",
  WEBINT: "border-amber-500/30 group-hover:border-amber-500/50",
  PHONE_EMAIL: "border-rose-500/30 group-hover:border-rose-500/50",
  DARKWEB: "border-red-500/30 group-hover:border-red-500/50",
  SIGINT: "border-indigo-500/30 group-hover:border-indigo-500/50",
  MALWARE: "border-orange-500/30 group-hover:border-orange-500/50",
};

const categoryBadge: Record<string, string> = {
  GEOINT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  IMINT: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  SOCMINT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  WEBINT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PHONE_EMAIL: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  DARKWEB: "bg-red-500/10 text-red-400 border-red-500/20",
  SIGINT: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  MALWARE: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { t } = useI18n();
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const domain = getDomain(tool.url);
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : "";
  const fallbackLogoUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : "";

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("osint-favorites") || "[]",
    );
    setIsFavorite(favorites.includes(tool.url));
  }, [tool.url]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(
      localStorage.getItem("osint-favorites") || "[]",
    );

    if (isFavorite) {
      const newFavorites = favorites.filter((url: string) => url !== tool.url);
      localStorage.setItem("osint-favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(tool.url);
      localStorage.setItem("osint-favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(tool.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = () => {
    const recent = JSON.parse(localStorage.getItem("osint-recent") || "[]");
    const newRecent = [
      tool.url,
      ...recent.filter((url: string) => url !== tool.url),
    ].slice(0, 5);
    localStorage.setItem("osint-recent", JSON.stringify(newRecent));
  };

  const accent =
    categoryAccent[tool.category] ||
    "border-border group-hover:border-foreground/30";
  const badge =
    categoryBadge[tool.category] ||
    "bg-foreground/5 text-foreground/70 border-foreground/10";

  return (
    <div
      className={`group relative flex flex-col h-full rounded-xl border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 overflow-hidden ${accent}`}
    >
      <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent group-hover:via-foreground/20 transition-colors" />

      <div className="relative flex flex-col h-full p-5">
        <div className="flex items-start gap-3 mb-4">
          {(logoUrl || fallbackLogoUrl) && (
            <div className="shrink-0 w-9 h-9 rounded-lg bg-foreground/4 border border-foreground/8 flex items-center justify-center overflow-hidden mt-0.5">
              <img
                src={logoError ? fallbackLogoUrl : logoUrl}
                alt=""
                className="w-5 h-5 object-contain"
                onError={() => {
                  if (!logoError) setLogoError(true);
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground tracking-tight text-[15px] leading-snug truncate">
                {tool.name}
              </h3>
              {tool.working ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
              )}
            </div>
            <span
              className={`inline-flex items-center mt-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded-md border ${badge}`}
            >
              {tool.category}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleFavorite}
            className="shrink-0 p-1.5 -m-1 rounded-lg hover:bg-foreground/5 transition-colors"
            aria-label={
              isFavorite ? t("tool.favorited") : t("tool.addFavorite")
            }
          >
            <Star
              className={`h-4 w-4 transition-all duration-200 ${
                isFavorite
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-foreground/20 group-hover:text-foreground/40"
              }`}
            />
          </button>
        </div>

        <p className="text-[13px] text-muted-foreground/80 leading-relaxed mb-4 flex-1 line-clamp-2">
          {tool.description}
        </p>

        {tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md bg-foreground/4 text-foreground/50 border border-foreground/6 font-medium"
              >
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-foreground/4 text-foreground/40 border border-foreground/6 font-medium">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-1 border-t border-foreground/5">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-foreground/4 hover:bg-foreground/8 text-foreground/80 hover:text-foreground border border-foreground/6 hover:border-foreground/12 transition-all text-sm font-medium"
          >
            {t("tool.visit")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-2 rounded-lg bg-foreground/4 hover:bg-foreground/8 border border-foreground/6 hover:border-foreground/12 text-foreground/50 hover:text-foreground/80 transition-all"
            aria-label={t("tool.copyLink")}
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
