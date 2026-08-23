/** @type {import('next').NextConfig} */
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'panel-x7k9m2p4q';

const nextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: `/${ADMIN_SECRET}`,
        destination: '/admin',
      },
      {
        source: `/${ADMIN_SECRET}/:path*`,
        destination: '/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
