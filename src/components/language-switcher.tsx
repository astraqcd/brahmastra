"use client";

import { useState, useRef, useEffect } from "react";
import { Languages, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const { locale, setLocale, isTranslating } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-1.5"
        aria-label="Change language"
      >
        {isTranslating ? (
          <Loader2 className="h-4 w-4 text-foreground/70 animate-spin" />
        ) : (
          <Languages className="h-4 w-4 text-foreground/70" />
        )}
        <span className="text-xs font-medium text-foreground/70 uppercase">
          {locale}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {SUPPORTED_LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setLocale(loc);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                locale === loc
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <span>{LOCALE_NAMES[loc]}</span>
              {locale === loc && (
                <span className="text-xs text-foreground/50">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
