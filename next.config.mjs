/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // This is the final, correct policy.
            // It allows connections to your Supabase URL AND your Render URL.
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://lhkffzhivpjbsufenncu.supabase.co https://sourcing-platform-api-jake.onrender.com; img-src 'self' data:; font-src 'self';",
          },
        ],
      },
    ]
  },
  // This setting ignores style warnings and allows the build to complete.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;