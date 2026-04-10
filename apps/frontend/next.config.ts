import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["stripe"],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
  headers: async () => [
    {
      source: "/assets/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.calendly.com https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live https://*.calendly.com; font-src 'self' https://fonts.gstatic.com https://vercel.live; img-src 'self' data: blob: https://vercel.com https://vercel.live https://*.calendly.com https://www.googletagmanager.com https://www.google-analytics.com; media-src 'self'; connect-src 'self' https://vercel.live https://vitals.vercel-insights.com https://portfolio-api-72tq.onrender.com https://api.resend.com https://*.calendly.com https://api.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com; frame-src 'self' https://vercel.live https://calendly.com https://js.stripe.com https://checkout.stripe.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
        },
      ],
    },
  ],
};

export default nextConfig;
