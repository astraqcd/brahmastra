"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/context";
import { Menu, X, Star, EyeOff, ChevronDown } from "lucide-react";
import type { ToolsData } from "@/lib/types";

interface HeaderProps {
  toolsData?: ToolsData;
}

export function Header({ toolsData }: HeaderProps) {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const openDropdown = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsCategoryOpen(true);
  };

  const closeDropdown = () => {
    // Small delay so the user can move the cursor from trigger to dropdown
    closeTimeoutRef.current = setTimeout(() => setIsCategoryOpen(false), 150);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const categories = toolsData?.categories ?? [];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center">
              <img
                src="/logo/astraq-brahmastra.png"
                alt="Brahmastra"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-foreground leading-none">
                Brahmastra
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                by Team AstraQ
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {/* Category Dropdown — opens on hover */}
            {categories.length > 0 ? (
              <div
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <Link
                  href="/#categories"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.categories")}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
                </Link>
                {isCategoryOpen && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-64 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden py-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                          {cat.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/#categories"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.categories")}
              </Link>
            )}
            <Link
              href="/darkweb"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <EyeOff className="h-3.5 w-3.5" />
              {t("nav.darkweb")}
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Star className="h-4 w-4" />
              {t("nav.favorites")}
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.about")}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              size="sm"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5"
              asChild
            >
              <Link
                href="https://astraqcyberdefence.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                AstraQ
              </Link>
            </Button>
          </nav>
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg absolute inset-x-0 shadow-lg">
            <nav className="flex flex-col p-4 gap-4">
              {/* Mobile category links */}
              {categories.length > 0 ? (
                <div>
                  <span className="text-sm font-medium text-foreground py-2 block">
                    {t("nav.categories")}
                  </span>
                  <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-border/50 pl-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={closeMenu}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href="/#categories"
                  onClick={closeMenu}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {t("nav.categories")}
                </Link>
              )}
              <Link
                href="/darkweb"
                onClick={closeMenu}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <EyeOff className="h-4 w-4" />
                {t("nav.darkweb")}
              </Link>
              <Link
                href="/favorites"
                onClick={closeMenu}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <Star className="h-4 w-4" />
                {t("nav.favorites")}
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {t("nav.about")}
              </Link>
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              <Button
                size="sm"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 w-fit px-5"
                asChild
              >
                <Link
                  href="https://astraqcyberdefence.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  AstraQ
                </Link>
              </Button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
