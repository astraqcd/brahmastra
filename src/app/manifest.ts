import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brahmastra - Professional OSINT Intelligence Platform",
    short_name: "Brahmastra OSINT",
    description:
      "Comprehensive OSINT toolkit with 80+ intelligence gathering tools across GEOINT, IMINT, SOCMINT, SIGINT, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#06b6d4",
    orientation: "portrait-primary",
    categories: ["security", "tools", "intelligence", "research"],
    icons: [
      {
        src: "/logo/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
