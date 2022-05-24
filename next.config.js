const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  handleImages: ['jpeg', 'jpg', 'png', 'svg'],
  images: {
    domains: ['arweave.net', '*.arweave.net', 'www.arweave.net'],
  },
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // Work around the anchor 'fs' requirement for node wallets
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

module.exports = nextConfig;
