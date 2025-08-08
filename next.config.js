/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Remove static export to allow dynamic product pages
  // output: 'export',
};

module.exports = nextConfig;