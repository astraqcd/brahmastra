import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brahmastra-osint.vercel.app"),
  title: {
    default:
      "Brahmastra OSINT Platform | 80+ Curated OSINT Tools for Investigations",
    template: "%s | Brahmastra OSINT",
  },
  description:
    "Brahmastra is a free OSINT platform with 80+ curated tools for WEBINT, GEOINT, IMINT, SOCMINT, SIGINT, malware analysis, and dark web research workflows.",
  keywords: [
    "OSINT",
    "OSINT tools",
    "Open Source Intelligence",
    "OSINT framework",
    "free OSINT tools",
    "cybersecurity tools",
    "GEOINT tools",
    "IMINT tools",
    "SOCMINT tools",
    "SIGINT tools",
    "dark web OSINT",
    "intelligence gathering",
    "reconnaissance tools",
    "threat intelligence",
    "investigation tools",
    "digital forensics",
    "social media intelligence",
    "geospatial intelligence",
    "reverse image search",
    "username lookup",
    "email investigation",
    "dark web monitoring",
    "OSINT investigation",
    "cyber intelligence",
    "Brahmastra",
    "AstraQ",
  ],
  authors: [{ name: "AstraQ Cyber Defence PVT. LTD" }],
  creator: "AstraQ Cyber Defence",
  publisher: "AstraQ Cyber Defence PVT. LTD",
  category: "Technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brahmastra-osint.vercel.app",
    title:
      "Brahmastra OSINT Platform | 80+ Curated OSINT Tools for Investigations",
    description:
      "Free OSINT toolkit with 80+ curated resources for cybersecurity teams, investigators, and analysts across major intelligence disciplines.",
    siteName: "Brahmastra OSINT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brahmastra OSINT - Professional Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brahmastra OSINT Platform - 80+ Free Intelligence Tools",
    description:
      "Discover 80+ curated OSINT tools for investigations, cyber threat research, and intelligence workflows.",
    creator: "@astraqcd",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://brahmastra-osint.vercel.app",
    languages: {
      "en-US": "https://brahmastra-osint.vercel.app",
      "hi-IN": "https://brahmastra-osint.vercel.app/hi",
      "ar-SA": "https://brahmastra-osint.vercel.app/ar",
      "ru-RU": "https://brahmastra-osint.vercel.app/ru",
      "zh-CN": "https://brahmastra-osint.vercel.app/zh",
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <I18nProvider>
            <div className="dot-pattern" />
            {children}
            <Analytics />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
