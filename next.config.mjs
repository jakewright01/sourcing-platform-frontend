/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // This is the updated, correct policy for development
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:8000 https://lhkffzhivpjbsufenncu.supabase.co; img-src 'self' data:; font-src 'self';",
          },
        ],
      },
    ]
  },
};

export default nextConfig;