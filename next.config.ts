import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        hostname: "rk17buob4g.ufs.sh",
        port:"",
        protocol: "https",
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
