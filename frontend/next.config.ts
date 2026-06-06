import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:5000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/eras",
        destination: `${BACKEND_URL}/api/eras`,
      },
      {
        source: "/api/eras/:path*",
        destination: `${BACKEND_URL}/api/eras/:path*`,
      },
      {
        source: "/api/kings",
        destination: `${BACKEND_URL}/api/kings`,
      },
      {
        source: "/api/kings/:path*",
        destination: `${BACKEND_URL}/api/kings/:path*`,
      },
      {
        source: "/api/swagger.json",
        destination: `${BACKEND_URL}/api/swagger.json`,
      },
      {
        source: "/api/uploads/:path*",
        destination: `${BACKEND_URL}/api/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

