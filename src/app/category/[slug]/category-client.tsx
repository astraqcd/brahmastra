"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, Filter, SortAsc } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolCard } from "@/components/tool-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ToolsData } from "@/lib/types";

interface CategoryClientProps {
  slug: string;
  toolsData: ToolsData;
}

export default function CategoryClient({
  slug,
  toolsData,
}: CategoryClientProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("name");

  const category = toolsData.categories.find((cat) => cat.slug === slug);

  const filteredTools = useMemo(() => {
    let tools = toolsData.tools.filter((tool) => {
      const matchesCategory = category && tool.category === category.id;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "working" && tool.working) ||
        (statusFilter === "not-working" && !tool.working);

      return matchesCategory && matchesSearch && matchesStatus;
    });

    if (sortOrder === "name") {
      tools.sort((a, b) => a.name.localeCompare(b.name));
    }

    return tools;
  }, [searchQuery, statusFilter, sortOrder, category, toolsData.tools]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!category) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("category.notFound")}
          </h1>
          <Button onClick={() => router.push("/")}>
            {t("common.returnHome")}
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("tool.backToCategories")}
        </Button>

        <div className="mb-12">
          <h1 className="font-mono text-4xl sm:text-5xl text-foreground mb-4 tracking-tight">
            {category.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {filteredTools.length}{" "}
              {filteredTools.length !== 1
                ? t("categories.tools")
                : t("categories.tool")}{" "}
              {t("category.available")}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-input"
              type="text"
              placeholder={t("category.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-lg border-border bg-card text-foreground"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-48 h-12 rounded-lg border-border bg-card text-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("category.allStatus")}</SelectItem>
              <SelectItem value="working">{t("category.working")}</SelectItem>
              <SelectItem value="not-working">
                {t("category.notWorking")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="md:w-48 h-12 rounded-lg border-border bg-card text-foreground">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t("category.sortByName")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard key={`${tool.name}-${index}`} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {t("category.noTools")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("category.adjustFilters")}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                {t("category.clearFilters")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
