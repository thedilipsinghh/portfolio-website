import type { NextConfig } from "next";
import { APP_URL } from "./app/constant/confi";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${APP_URL}/api/:path*`,
      },
    ];
  }
};

export default nextConfig;
