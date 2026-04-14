import type { Category, Tool } from "@/lib/types";
import { slugify } from "@/lib/utils";

const BASE_URL = "https://brahmastra-osint.vercel.app";

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Brahmastra OSINT",
    alternateName: "Brahmastra - Professional OSINT Intelligence Platform",
    url: BASE_URL,
    description:
      "Comprehensive OSINT toolkit with 80+ intelligence gathering tools across GEOINT, IMINT, SOCMINT, SIGINT, and more.",
    publisher: {
      "@type": "Organization",
      name: "AstraQ Cyber Defence PVT. LTD",
      url: "https://astraqcyberdefence.com/",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: It is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ToolJsonLd({ tool }: { tool: Tool }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    url: tool.url,
    description: tool.description,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: tool.working
      ? {
          "@type": "AggregateRating",
          ratingValue: "4.5",
          ratingCount: "1",
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
    isAccessibleForFree: true,
    keywords: tool.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.category,
        item: `${BASE_URL}/category/${tool.category.toLowerCase().replace("_", "-")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `${BASE_URL}/tool/${slugify(tool.name)}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: It is safe
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: It is safe
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

export function CategoryJsonLd({
  category,
  toolCount,
}: {
  category: Category;
  toolCount: number;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.title} - OSINT Tools`,
    description: category.description,
    url: `${BASE_URL}/category/${category.slug}`,
    numberOfItems: toolCount,
    isPartOf: {
      "@type": "WebSite",
      name: "Brahmastra OSINT",
      url: BASE_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.title,
          item: `${BASE_URL}/category/${category.slug}`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: It is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is OSINT?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "OSINT (Open Source Intelligence) is the collection and analysis of information from publicly available sources for intelligence purposes. It includes gathering data from the internet, social media, public records, and other open sources.",
        },
      },
      {
        "@type": "Question",
        name: "What tools does Brahmastra offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brahmastra provides 80+ curated OSINT tools across 8 intelligence disciplines: GEOINT (Geospatial), IMINT (Imagery), SOCMINT (Social Media), WEBINT (Web), PHONE_EMAIL (Contact), DARKWEB, SIGINT (Signals), and MALWARE intelligence.",
        },
      },
      {
        "@type": "Question",
        name: "Is Brahmastra free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Brahmastra is completely free and open source. All tools listed on the platform are curated for cybersecurity professionals, researchers, and investigators.",
        },
      },
      {
        "@type": "Question",
        name: "Who can use OSINT tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "OSINT tools are used by security researchers, law enforcement, journalists, corporate security teams, and anyone conducting legitimate open source investigations. Always ensure your activities comply with applicable laws.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: It is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
    />
  );
}
