/** @type {import('next').NextConfig} */
const API_BASE = process.env.API_BASE ?? "http://localhost:8000";

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${API_BASE}/api/v1/:path*` },
    ];
  },
};
export default nextConfig;
