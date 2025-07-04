/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:8000 https://lhkffzhivpjbsufenncu.supabase.co https://sourcing-platform-api-jake.onrender.com https://api.ebay.com https://www.depop.com https://www.vinted.co.uk; img-src 'self' data: https:; font-src 'self';",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://sourcing-platform-api-jake.onrender.com/:path*',
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;