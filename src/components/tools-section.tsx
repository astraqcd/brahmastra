"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpRight, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type data from "@/lib/data.json";
import Link from "next/link";

export function ToolsSection({ toolsData }: { toolsData: typeof data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...toolsData.categories];

  const filteredTools = useMemo(() => {
    return toolsData.tools.filter((tool) => {
      const matchesSearch =
        tool.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || tool.type === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, toolsData.tools]);

  return (
    <section id="tools" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl sm:text-4xl text-foreground mb-4 tracking-tight">
            <span className="text-primary">OSINT</span> Arsenal
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Access {Math.floor(toolsData.tools.length / 10) * 10}+ operational intelligence tools.
            Complete cyber defence capability.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools, capabilities, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-lg border-border/50 bg-card/50 backdrop-blur-sm text-foreground focus:ring-ring focus:border-ring transition-all"
            />
          </div>

          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="md:w-64 h-12! rounded-lg border-border/50 bg-card/50 backdrop-blur-sm text-foreground hover:bg-card focus:ring-ring">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool, index) => (
            <Link
              key={`${tool.toolName}-${index}`}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-5 rounded-xl border border-border/40 bg-card/30 hover:bg-card/80 hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors truncate pr-4 text-sm sm:text-base">
                    {tool.toolName}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>

                <div className="flex items-center gap-2 mt-auto pt-2">
                  <span className="inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded bg-primary/10 text-primary border border-primary/20">
                    {tool.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border/30 rounded-xl bg-card/10">
            <p className="text-muted-foreground text-lg">
              No intelligence tools found matching parameters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 text-primary hover:underline text-sm font-mono"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
