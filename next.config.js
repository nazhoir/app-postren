/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
/** @type {import("next").NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname: "postren-dev.sgp1.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "postren-storage.is3.cloudhost.id",
        port: "",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
