import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN access to the dev server (so other devices on the network can load /_next/* assets)
  allowedDevOrigins: [
    "http://192.168.1.229:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
