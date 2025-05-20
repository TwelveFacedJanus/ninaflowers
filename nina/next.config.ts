import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'content2.flowwow-images.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'content3.flowwow-images.com',
        pathname: '/**',
      },
    ]
  },
  allowedDevOrigins: [
    'http://192.168.0.102:3000'
  ]
};

export default nextConfig;
