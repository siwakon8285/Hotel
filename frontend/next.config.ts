import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const csp = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""};
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      font-src 'self' data:;
      connect-src 'self' http://localhost:8080;
    `.replace(/\s{2,}/g, " ").trim();

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          }
        ],
      },
    ];
  },
};

export default nextConfig;
