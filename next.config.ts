import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Allow Cesium's WASM and large bundle
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle Cesium's Node.js-specific modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      https: false,
      zlib: false,
      http: false,
    };

    return config;
  },
};

export default nextConfig;
