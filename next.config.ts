import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev indicator off the bottom-left corner where the sticky logout button lives.
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'umqvaajaxnlijotkddux.supabase.co',
      },
    ],
  },
};

export default nextConfig;
