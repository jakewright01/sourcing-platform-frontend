/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // This is the final, correct policy that works everywhere.
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:8000 https://lhkffzhivpjbsufenncu.supabase.co https://sourcing-platform-api-jake.onrender.com; img-src 'self' data:; font-src 'self';",
          },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;