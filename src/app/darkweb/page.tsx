import type { Metadata } from "next";
import { fetchDarkWebData } from "@/lib/darkweb-sheets";
import { DarkWebClient } from "./darkweb-client";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Dark Web Intelligence Directory - Forums & Hidden Services",
  description:
    "Research directory of dark web forums, marketplaces, search engines, and hidden services. For legitimate OSINT research, academic study, and law enforcement only. 18+ required.",
  keywords: [
    "dark web forums",
    "onion links",
    "tor hidden services",
    "dark web directory",
    "OSINT dark web",
    "dark web research",
    "dark web intelligence",
    "tor network",
    "onion sites",
  ],
  robots: {
    index: true,
    follow: false,
  },
};

export default async function DarkWebPage() {
  const darkWebData = await fetchDarkWebData();

  return <DarkWebClient data={darkWebData} />;
}
