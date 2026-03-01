import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias["@so1/shared"] = path.resolve(
      __dirname,
      "../../platform-tools/so1-shared/src"
    );
    return config;
  },
};

export default nextConfig;

