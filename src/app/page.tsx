import type { Metadata } from "next";
import { CategoryGrid } from "@/components/category-grid";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FAQJsonLd, WebsiteJsonLd } from "@/components/json-ld";
import { RecentlyUsed } from "@/components/recently-used";
import { env } from "@/env";
import { fetchToolsData } from "@/lib/google-sheets";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Free OSINT Tools Directory",
  description:
    "Explore 80+ curated OSINT tools in one place for WEBINT, GEOINT, IMINT, SOCMINT, SIGINT, malware analysis, and dark web research.",
  keywords: [
    "free osint tools",
    "osint directory",
    "webint tools",
    "geoint tools",
    "socmint tools",
    "dark web osint",
    "cyber threat intelligence",
  ],
  alternates: {
    canonical: env.NEXT_PUBLIC_SITE_URL,
  },
};

export default async function Home() {
  const toolsData = await fetchToolsData();

  return (
    <main className="min-h-screen bg-background">
      <WebsiteJsonLd />
      <FAQJsonLd />
      <Header toolsData={toolsData} />
      <HeroSection toolsData={toolsData} />
      <CategoryGrid toolsData={toolsData} />
      <RecentlyUsed toolsData={toolsData} />
      <Footer />
    </main>
  );
}
