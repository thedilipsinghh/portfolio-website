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
    if (!APP_URL) {
      console.warn("WARNING: APP_URL is undefined. API rewrites will be disabled to prevent server startup crash.");
      return [];
    }

    const cleanAppUrl = APP_URL.trim();
    if (!cleanAppUrl) {
      console.warn("WARNING: APP_URL is empty. API rewrites will be disabled.");
      return [];
    }

    const dest = cleanAppUrl.startsWith("http") ? `${cleanAppUrl}/api/:path*` : `https://${cleanAppUrl}/api/:path*`;

    return [
      {
        source: "/api/:path((?!revalidate).*)",
        destination: dest,
      },
    ];
  }
};

export default nextConfig;
