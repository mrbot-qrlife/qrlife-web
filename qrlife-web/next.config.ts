import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: Once we add a real backend (Supabase) + dynamic public slugs,
  // we cannot use `output: "export"` (static export).
  // Deploy as SSR (Vercel / Amplify SSR) instead.
  trailingSlash: true,
  // Allow LAN access to the dev server (so other devices on the network can load /_next/* assets)
  allowedDevOrigins: [
    "http://192.168.1.229:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
