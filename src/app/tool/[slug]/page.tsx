import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolJsonLd } from "@/components/json-ld";
import { env } from "@/env";
import { fetchToolsData } from "@/lib/google-sheets";
import { slugify } from "@/lib/utils";
import ToolClient from "./tool-client";

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/tool/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const toolsData = await fetchToolsData();
  const tool = toolsData.tools.find((t) => slugify(t.name) === slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  const category = toolsData.categories.find((c) => c.id === tool.category);

  return {
    title: `${tool.name} - ${category?.title || "OSINT"} Tool`,
    description: `${tool.description} Free OSINT tool for ${category?.title?.toLowerCase() || "intelligence gathering"}. Status: ${tool.working ? "Active" : "Inactive"}.`,
    keywords: [
      tool.name,
      "OSINT",
      category?.title || "",
      ...tool.tags,
      "free tool",
      "intelligence",
    ],
    openGraph: {
      title: `${tool.name} - Free ${category?.title || "OSINT"} Tool | Brahmastra`,
      description: tool.description,
      url: `${env.NEXT_PUBLIC_SITE_URL}/tool/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${tool.name} - ${category?.title || "OSINT"} Tool`,
      description: tool.description,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/tool/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const toolsData = await fetchToolsData();
  return toolsData.tools.map((tool) => ({
    slug: slugify(tool.name),
  }));
}

export default async function ToolDetailPage({
  params,
}: PageProps<"/tool/[slug]">) {
  const { slug } = await params;
  const toolsData = await fetchToolsData();
  const tool = toolsData.tools.find((t) => slugify(t.name) === slug);
  if (!tool) {
    notFound();
  }
  const category =
    toolsData.categories.find((c) => c.id === tool.category) ?? null;
  const relatedTools = toolsData.tools
    .filter(
      (item) => item.category === tool.category && item.name !== tool.name,
    )
    .slice(0, 4);

  return (
    <>
      <ToolJsonLd tool={tool} />
      <ToolClient tool={tool} category={category} relatedTools={relatedTools} />
    </>
  );
}
