import type { Metadata } from "next";
import { fetchToolsData } from "@/lib/google-sheets";
import { ToolJsonLd } from "@/components/json-ld";
import ToolClient from "./tool-client";

export const revalidate = 60;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
      url: `https://brahmastra-osint.vercel.app/tool/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${tool.name} - ${category?.title || "OSINT"} Tool`,
      description: tool.description,
    },
    alternates: {
      canonical: `https://brahmastra-osint.vercel.app/tool/${slug}`,
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const toolsData = await fetchToolsData();
  const tool = toolsData.tools.find((t) => slugify(t.name) === slug);

  return (
    <>
      {tool && <ToolJsonLd tool={tool} />}
      <ToolClient slug={slug} toolsData={toolsData} />
    </>
  );
}
