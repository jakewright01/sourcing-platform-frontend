/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*', // Apply to all paths
        headers: [
          {
            key: 'Content-Security-Policy',
            // IMPORTANT: Add your Render backend URL here.
            // Keep 'self', Supabase, and localhost for development convenience if desired.
            // 'unsafe-inline' is often needed for styles/scripts in dev, but review for prod.
            // Replace process.env.NEXT_PUBLIC_SUPABASE_URL with the actual URL if it's not being read correctly
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              media-src 'self';
              font-src 'self';
              connect-src 'self' http://localhost:8000 https://lhkffzhivpjbsufenncu.supabase.co https://sourcing-platform-api-jake.onrender.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, ' ').trim(), // Removes extra whitespace and newlines
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;