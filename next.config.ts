import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Accepts any HTTPS hostname
      },
      {
        protocol: "http",
        hostname: "**", // Accepts any HTTP hostname (if needed)
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/external/:path*", // local path
        destination: "https://api.escuelajs.co/:path*", // external host
      },
    ];
  },
};

export default nextConfig;
