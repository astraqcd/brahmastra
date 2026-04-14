import type { NextConfig } from "next";
import "./src/env";

const nextConfig = {
  typedRoutes: true,
} satisfies NextConfig;

export default nextConfig;
