/** @type {import('next').NextConfig} */
// This comment is a trivial change to help trigger a new Git commit if needed.
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*', // Apply this policy to all paths in your application
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline'; // 'unsafe-eval' often needed for Next.js development/build
              style-src 'self' 'unsafe-inline'; // 'unsafe-inline' often needed for styled-components, etc.
              img-src 'self' data:;
              media-src 'self';
              font-src 'self';
              connect-src 'self' http://localhost:8000 https://lhkffzhivpjbsufenncu.supabase.co https://sourcing-platform-api-jake.onrender.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, ' ').trim(), // This removes extra whitespace and newlines for a clean header string
          },
        ],
      },
    ];
  },
};

// Export the configuration as an ES Module default export
export default nextConfig;