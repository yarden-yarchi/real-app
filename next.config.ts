import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
