import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore type errors during migration
  },
  eslint: {
    ignoreDuringBuilds: false, // Keep ESLint warnings
  },
};

export default nextConfig;
