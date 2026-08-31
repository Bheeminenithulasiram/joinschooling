/** @type {import('next').NextConfig} */
const API_BASE = process.env.API_BASE ?? "http://localhost:8000";

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  output: "standalone",
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "984571154887-n473mh9lnvta8h0d8r0qimuj8pomudlc.apps.googleusercontent.com",
  },
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${API_BASE}/api/v1/:path*` },
    ];
  },
};
export default nextConfig;
