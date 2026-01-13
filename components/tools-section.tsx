"use client"

import { useState, useMemo } from "react"
import { Search, ArrowUpRight, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

// Type definition for tool
interface Tool {
  name: string
  url: string
  category: string
  description: string
  sheet: string
}

interface ToolsSectionProps {
  toolsData: {
    tools: Tool[]
    categories: string[] // We can ignore this and re-derive, or use it. We'll re-derive for safety.
  }
}

export function ToolsSection({ toolsData }: ToolsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  // Process and clean data
  const { tools, categories } = useMemo(() => {
    if (!toolsData || !toolsData.tools) return { tools: [], categories: [] }

    const normalizeText = (text: string) => {
      if (!text) return ""
      // Remove emojis and non-standard chars, keep alphanumeric, spaces, hyphens
      const clean = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').replace(/[^\w\s-]/g, ' ').trim()
      // Title Case
      return clean.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ').replace(/\s+/g, ' ').trim()
    }

    // Clean unique tools
    const uniqueTools = toolsData.tools
      .filter((tool: Tool) => {
        // Filter out invalid entries
        if (!tool.name || !isNaN(Number(tool.name)) || tool.name.length < 2) return false
        // Filter out URLs in name or category (common parsing issue)
        if (tool.name.includes('http') || tool.category.includes('http') || tool.name.length > 60) return false
        return true
      })
      .map(tool => ({
        ...tool,
        name: normalizeText(tool.name),
        category: normalizeText(tool.category) || "Other",
        sheet: normalizeText(tool.sheet)
      }))

    // Extract unique categories
    const uniqueCategories = ["All", ...Array.from(new Set(uniqueTools.map((t) => t.category))).sort()]

    return { tools: uniqueTools, categories: uniqueCategories }
  }, [toolsData])

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = activeCategory === "All" || tool.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory, tools])

  return (
    <section id="tools" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-primary">OSINT</span> Arsenal
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Access {tools.length}+ operational intelligence tools. Complete cyber defence capability.
          </p>
        </div>

        {/* Search and Filter Controls */}
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

          <div className="relative md:w-64">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none">
              <Filter className="h-4 w-4" />
            </div>
            <select
              className="w-full h-12 pl-12 pr-4 rounded-lg border-border/50 bg-card/50 backdrop-blur-sm text-foreground appearance-none cursor-pointer hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-card text-foreground">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool, index) => (
            <a
              key={`${tool.name}-${index}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-5 rounded-xl border border-border/40 bg-card/30 hover:bg-card/80 hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden h-full"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors truncate pr-4 text-sm sm:text-base">
                    {tool.name}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>

                {tool.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-auto pt-2">
                  <span className="inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded bg-primary/10 text-primary border border-primary/20">
                    {tool.category}
                  </span>
                  {tool.sheet && tool.sheet !== tool.category && (
                    <span className="inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded bg-secondary/50 text-secondary-foreground border border-border/50">
                      {tool.sheet}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border/30 rounded-xl bg-card/10">
            <p className="text-muted-foreground text-lg">No intelligence tools found matching parameters.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All") }}
              className="mt-4 text-primary hover:underline text-sm font-mono"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
