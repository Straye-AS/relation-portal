/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true,
   
      domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
    
   },
  experimental: {
    serverActions: true,
    forceSwcTransforms: true,
  },
  webpack: (config, { isServer }) => {
    // Suppress the warning about the dynamic require in @supabase/realtime-js
    config.module.exprContextCritical = false;
    
    // Ignore specific warnings
    if (!config.ignoreWarnings) {
      config.ignoreWarnings = [];
    }
    config.ignoreWarnings.push(
      /Critical dependency: the request of a dependency is an expression/
    );
    
    return config;
  },
};

module.exports = nextConfig;
