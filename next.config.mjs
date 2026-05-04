/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "script-src-elem 'self' 'unsafe-eval' 'unsafe-inline'",
              "script-src-attr 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "style-src-elem 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://cdn.sanity.io https://placehold.co",
              "font-src 'self' data:",
              "connect-src 'self' https://api.openai.com https://api.ycloud.com",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              !isDev ? "upgrade-insecure-requests" : "",
            ].filter(Boolean).join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;