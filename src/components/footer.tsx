"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { GithubDark } from "./ui/svgs/githubDark";
import { XDark } from "./ui/svgs/xDark";
import { useTheme } from "next-themes";
import { GithubLight } from "./ui/svgs/githubLight";
import { X } from "./ui/svgs/x";

export function Footer() {
  const { t } = useI18n();
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-16 w-16 items-center justify-center">
                <img
                  src="/logo/astraq-brahmastra.png"
                  alt="Brahmastra"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Brahmastra
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t("footer.description")}
            </p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/astraqcd/brahmastra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {theme === "dark" ? (
                  <GithubDark className="h-5 w-5" />
                ) : (
                  <GithubLight className="h-5 w-5" />
                )}
                <span className="sr-only">{t("footer.github")}</span>
              </Link>
              <Link
                href="https://twitter.com/astraqcd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {theme === "dark" ? (
                  <XDark className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
                <span className="sr-only">{t("footer.twitter")}</span>
              </Link>
              <Link
                href="https://astraqcyberdefence.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t("footer.website")}</span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {t("footer.categories")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/category/geoint"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GEOINT
                </Link>
              </li>
              <li>
                <Link
                  href="/category/imint"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  IMINT
                </Link>
              </li>
              <li>
                <Link
                  href="/category/socmint"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  SOCMINT
                </Link>
              </li>
              <li>
                <Link
                  href="/category/webint"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  WEBINT
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.favorites")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/astraqcd/brahmastra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.contribute")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {t("footer.company")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://astraqcyberdefence.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.astraq")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/astraqcd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.github")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/astraqcd/brahmastra/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.reportIssue")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/astraqcd/brahmastra#contributing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.contributing")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Brahmastra by AstraQ Cyber Defence.{" "}
            {t("footer.rights")}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {t("footer.builtFor")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
