import type { Metadata } from "next";
import { fetchToolsData } from "@/lib/google-sheets";
import { CategoryJsonLd } from "@/components/json-ld";
import CategoryClient from "./category-client";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
      url: `https://brahmastra-osint.vercel.app/category/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://brahmastra-osint.vercel.app/category/${slug}`,
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const toolsData = await fetchToolsData();
  const category = toolsData.categories.find((c) => c.slug === slug);
  const toolCount = category
    ? toolsData.tools.filter((t) => t.category === category.id).length
    : 0;

  return (
    <>
      {category && <CategoryJsonLd category={category} toolCount={toolCount} />}
      <CategoryClient slug={slug} toolsData={toolsData} />
    </>
  );
}
