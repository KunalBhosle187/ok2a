/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback.fs = false;
    }
    config.externals = config.externals || [];
    config.externals = [...config.externals];
    config.resolve.alias["fs"] = false;

    return config;
  },
};

export default nextConfig;
