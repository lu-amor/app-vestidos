import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint checks during build to avoid failing production builds for dev warnings.
  // This keeps the build process resilient; address lint issues separately.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
