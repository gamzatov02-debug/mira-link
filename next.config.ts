import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/demo/guest/welcome",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
