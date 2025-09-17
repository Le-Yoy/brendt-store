/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['brendt-store-production-d6ef.up.railway.app'],
    formats: ['image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
