/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Remove CORS headers as they don't work for static exports
  // and are causing issues in the browser
};

module.exports = nextConfig;