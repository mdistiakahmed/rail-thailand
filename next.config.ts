import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
        domains: [
          "cdn.sanity.io"
        ], // Add 'picsum.photos' to the allowed domains
      },
};

export default nextConfig;
