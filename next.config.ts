import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.imgur.com', 'cdn.discordapp.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
