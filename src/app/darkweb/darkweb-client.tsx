"use client";

import { useState, useEffect, useMemo } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  Shield,
  AlertTriangle,
  EyeOff,
  Search,
  Globe,
  Lock,
  Users,
  CheckCircle2,
  XCircle,
  Ban,
  HelpCircle,
  ExternalLink,
  Copy,
  CheckCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n/context";
import type {
  DarkWebData,
  DarkWebForum,
  DarkWebCategory,
} from "@/lib/darkweb-types";
import type { TranslationKey } from "@/lib/i18n/translations";
import { DARKWEB_CATEGORIES } from "@/lib/darkweb-types";

interface DarkWebClientProps {
  data: DarkWebData;
}

type DarkwebStatusFilter = "all" | "active" | "inactive" | "seized" | "scam";
type StatusConfig = { label: string; icon: LucideIcon; color: string };

// TODO: Use proper keys
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";

export function DarkWebClient({ data }: DarkWebClientProps) {
  const [consented, setConsented] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [legalConfirmed, setLegalConfirmed] = useState(false);
  const [researchConfirmed, setResearchConfirmed] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    DarkWebCategory | "all"
  >("all");
  const [selectedStatus, setSelectedStatus] =
    useState<DarkwebStatusFilter>("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    const hasConsent = sessionStorage.getItem("darkweb-consent");
    if (hasConsent === "true") {
      setConsented(true);
    }
  }, []);

  const { t } = useI18n();
  const statusConfigMap: Record<DarkWebForum["status"], StatusConfig> = {
    active: {
      label: t("darkweb.status.active"),
      icon: CheckCircle2,
      color: "text-green-400 bg-green-500/10 border-green-500/20",
    },
    inactive: {
      label: t("darkweb.status.inactive"),
      icon: XCircle,
      color: "text-red-400 bg-red-500/10 border-red-500/20",
    },
    seized: {
      label: t("darkweb.status.seized"),
      icon: Ban,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    },
    scam: {
      label: t("darkweb.status.scam"),
      icon: AlertTriangle,
      color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    },
    unknown: {
      label: t("darkweb.status.unknown"),
      icon: HelpCircle,
      color: "text-gray-400 bg-gray-500/10 border-gray-500/20",
    },
  };

  const handleConsent = () => {
    if (
      ageConfirmed &&
      legalConfirmed &&
      researchConfirmed &&
      captchaVerified
    ) {
      setConsented(true);
      sessionStorage.setItem("darkweb-consent", "true");
    }
  };

  const filteredForums = useMemo(() => {
    return data.forums.filter((forum) => {
      const matchesSearch =
        !searchQuery ||
        forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forum.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forum.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "all" || forum.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || forum.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [data.forums, searchQuery, selectedCategory, selectedStatus]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!consented) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <Shield className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="font-mono text-3xl sm:text-4xl text-foreground mb-4 tracking-tight">
              {t("darkweb.consent.title")}
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
              {t("darkweb.consent.description")}
            </p>
          </div>

          <div className="p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong className="text-foreground">
                    {t("darkweb.warning.title")}
                  </strong>{" "}
                  {t("darkweb.warning.body1")}
                </p>
                <p>{t("darkweb.warning.body2")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-foreground/20 transition-colors">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border accent-red-500"
              />
              <span className="text-sm text-foreground">
                {t("darkweb.consent.age")}
              </span>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-foreground/20 transition-colors">
              <input
                type="checkbox"
                checked={legalConfirmed}
                onChange={(e) => setLegalConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border accent-red-500"
              />
              <span className="text-sm text-foreground">
                {t("darkweb.consent.legal")}
              </span>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-foreground/20 transition-colors">
              <input
                type="checkbox"
                checked={researchConfirmed}
                onChange={(e) => setResearchConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border accent-red-500"
              />
              <span className="text-sm text-foreground">
                {t("darkweb.consent.research")}
              </span>
            </label>
          </div>

          <div className="flex justify-center mb-8">
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={() => setCaptchaVerified(true)}
              onExpire={() => setCaptchaVerified(false)}
              onError={() => setCaptchaVerified(false)}
              options={{ theme: "dark", size: "normal" }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleConsent}
              disabled={
                !ageConfirmed ||
                !legalConfirmed ||
                !researchConfirmed ||
                !captchaVerified
              }
              className="flex-1 px-6 py-3 rounded-xl bg-red-500/90 hover:bg-red-500 text-white font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-red-500/90"
            >
              {t("darkweb.consent.enter")}
            </button>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-medium text-sm transition-all"
            >
              {t("darkweb.consent.goBack")}
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <EyeOff className="h-4 w-4 text-red-400" />
            <span className="text-xs font-medium text-red-400">
              {t("darkweb.researchOnly")}
            </span>
          </div>
          <h1 className="font-mono text-3xl sm:text-4xl text-foreground mb-3 tracking-tight">
            {t("darkweb.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("darkweb.directoryPrefix")} {data.forums.length}{" "}
            {t("darkweb.directorySuffix")}
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("darkweb.searchPlaceholder")}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t("darkweb.allCategories")}
            </button>
            {DARKWEB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {(
              [
                "all",
                "active",
                "inactive",
                "seized",
                "scam",
              ] as DarkwebStatusFilter[]
            ).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {status === "all"
                  ? t("darkweb.allStatus")
                  : statusConfigMap[status].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 text-center">
          <span className="text-sm text-muted-foreground">
            {t("darkweb.showingPrefix")} {filteredForums.length}{" "}
            {t("darkweb.of")} {data.forums.length} {t("darkweb.resources")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForums.map((forum) => (
            <ForumCard
              key={`${forum.name}-${forum.onionUrl}`}
              forum={forum}
              onCopy={handleCopy}
              copiedUrl={copiedUrl}
              statusConfigMap={statusConfigMap}
              t={t}
            />
          ))}
        </div>

        {filteredForums.length === 0 && (
          <div className="text-center py-16">
            <EyeOff className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("darkweb.noResults")}</p>
          </div>
        )}

        <div className="mt-16 p-6 rounded-xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">
                {t("darkweb.disclaimerTitle")}
              </p>
              <p>{t("darkweb.disclaimerBody1")}</p>
              <p>{t("darkweb.disclaimerBody2")}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function ForumCard({
  forum,
  onCopy,
  copiedUrl,
  statusConfigMap,
  t,
}: {
  forum: DarkWebForum;
  onCopy: (url: string) => void;
  copiedUrl: string | null;
  statusConfigMap: Record<DarkWebForum["status"], StatusConfig>;
  t: (key: TranslationKey) => string;
}) {
  const statusConfig = statusConfigMap[forum.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card hover:border-foreground/20 transition-all duration-200 overflow-hidden">
      {forum.status === "seized" && (
        <div className="bg-orange-500/20 border-b border-orange-500/30 px-4 py-1.5 flex items-center gap-2">
          <Ban className="h-3 w-3 text-orange-400" />
          <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">
            {t("darkweb.seized")}{" "}
            {forum.seizedBy ? `${t("darkweb.by")} ${forum.seizedBy}` : ""}
          </span>
        </div>
      )}

      {forum.status === "scam" && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-1.5 flex items-center gap-2">
          <AlertTriangle className="h-3 w-3 text-yellow-400" />
          <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider">
            {t("darkweb.reportedScam")}
          </span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-foreground text-base leading-tight">
            {forum.name}
          </h3>
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${statusConfig.color}`}
          >
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase tracking-wider font-medium">
            {forum.category.replace("-", " ")}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {forum.language}
          </span>
          {forum.registrationRequired && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Lock className="h-2.5 w-2.5" /> {t("darkweb.regRequired")}
            </span>
          )}
          {forum.inviteOnly && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400">
              <Users className="h-2.5 w-2.5" /> {t("darkweb.inviteOnly")}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
          {forum.description}
        </p>

        {forum.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {forum.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/50 border border-border/50">
            <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <code className="text-[11px] text-muted-foreground truncate flex-1 font-mono">
              {forum.onionUrl}
            </code>
            <button
              type="button"
              onClick={() => onCopy(forum.onionUrl)}
              className="p-1 rounded hover:bg-accent transition-colors shrink-0"
              title={t("darkweb.copyOnionUrl")}
            >
              {copiedUrl === forum.onionUrl ? (
                <CheckCheck className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
          {forum.mirrorUrl && (
            <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-secondary/30">
              <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-[10px] text-muted-foreground">
                {t("darkweb.mirror")}: {forum.mirrorUrl}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
