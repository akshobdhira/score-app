import type { NextConfig } from "next";

const securityHeaders = [
  // Blocks your site from being embedded in iframes (clickjacking protection)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stops browsers guessing file types
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Only sends domain (not full URL) when linking to other sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disables browser features this app doesn't need
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Forces HTTPS for 2 years
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Controls where scripts, styles, and connections can come from
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-eval' is only needed by the dev server's hot reload.
      // ponytail: 'unsafe-inline' stays until Next.js nonce-based CSP is wired up via middleware.
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://calendly.com",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co https://calendly.com https://*.calendly.com",
      "frame-src 'self' https://calendly.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;
