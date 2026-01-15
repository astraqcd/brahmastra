import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Brahmastra - Open Source OSINT Tool Arsenal",
  description:
    "Access powerful intelligence gathering tools curated by cybersecurity experts. Free, open source, and built for the community.",
  keywords: [
    "OSINT",
    "Open Source Intelligence",
    "Cybersecurity",
    "Reconnaissance",
    "Information Gathering",
  ],
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <div className="dot-pattern" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
