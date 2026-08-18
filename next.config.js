/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['**.preview.bl.run'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
  },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
