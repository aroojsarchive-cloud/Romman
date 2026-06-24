import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ovysjrsatstzdgaaqcwg.supabase.co",
      },
    ],
  },
};

export default nextConfig;
