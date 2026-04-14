import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryJsonLd } from "@/components/json-ld";
import { env } from "@/env";
import { fetchToolsData } from "@/lib/google-sheets";
import CategoryClient from "./category-client";

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const toolsData = await fetchToolsData();
  const category = toolsData.categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const toolCount = toolsData.tools.filter(
    (t) => t.category === category.id,
  ).length;

  return {
    title: `${category.title} Tools (${toolCount}+ Free) - OSINT`,
    description: `${category.description} Browse ${toolCount}+ free ${category.title.toLowerCase()} tools for OSINT investigations and research.`,
    keywords: [
      category.title,
      category.id,
      "OSINT tools",
      "free tools",
      "intelligence",
      category.slug,
    ],
    openGraph: {
      title: `${category.title} - ${toolCount}+ Free OSINT Tools | Brahmastra`,
      description: category.description,
      url: `${env.NEXT_PUBLIC_SITE_URL}/category/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/category/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const toolsData = await fetchToolsData();
  return toolsData.categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const toolsData = await fetchToolsData();
  const category = toolsData.categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const categoryTools = toolsData.tools.filter(
    (tool) => tool.category === category.id,
  );
  const toolCount = categoryTools.length;

  return (
    <>
      <CategoryJsonLd category={category} toolCount={toolCount} />
      <CategoryClient category={category} tools={categoryTools} />
    </>
  );
}
