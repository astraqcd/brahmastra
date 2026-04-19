"use client";

import Fuse from "fuse.js";
import { AlertCircle, CheckCircle2, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Tool } from "@/lib/types";
import { getToolDescription, slugify } from "@/lib/utils";

interface FuzzySearchProps {
  tools: Tool[];
}

export function FuzzySearch({ tools }: FuzzySearchProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(tools, {
        keys: [
          { name: "name", weight: 0.4 },
          { name: "description", weight: 0.25 },
          { name: "tags", weight: 0.2 },
          { name: "category", weight: 0.15 },
        ],
        threshold: 0.4,
        minMatchCharLength: 2,
      }),
    [tools],
  );

  const results = useMemo(() => {
    if (!deferredQuery.trim()) return [];
    return fuse.search(deferredQuery).slice(0, 8);
  }, [deferredQuery, fuse]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !isOpen &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setQuery("");
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        const tool = results[selectedIndex].item;
        router.push(`/tool/${slugify(tool.name)}`);
        setIsOpen(false);
      }
    },
    [results, router, selectedIndex],
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={t("search.placeholder")}
          className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        {!query && (
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded border border-border bg-secondary text-[10px] font-mono text-muted-foreground">
            /
          </kbd>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden z-50 max-h-[420px] overflow-y-auto"
        >
          <div className="p-2">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {results.length}{" "}
              {results.length !== 1 ? t("search.results") : t("search.result")}
            </div>
            {results.map((result, index) => (
              <Link
                key={result.item.url}
                href={`/tool/${slugify(result.item.name)}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground truncate">
                      {result.item.name}
                    </span>
                    {result.item.working ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {getToolDescription(result.item, locale)}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground shrink-0">
                  {result.item.category}
                </span>
              </Link>
            ))}
          </div>
          <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>
              <kbd className="px-1 py-0.5 rounded border border-border bg-secondary font-mono">
                ↑↓
              </kbd>{" "}
              navigate{" "}
              <kbd className="px-1 py-0.5 rounded border border-border bg-secondary font-mono">
                ↵
              </kbd>{" "}
              select{" "}
              <kbd className="px-1 py-0.5 rounded border border-border bg-secondary font-mono">
                esc
              </kbd>{" "}
              close
            </span>
          </div>
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden z-50"
        >
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("search.noResults")} &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {t("search.tryDifferent")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
