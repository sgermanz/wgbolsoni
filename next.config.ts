import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Payload writes uploads to ./media and serves them via its own routes,
  // so allow remote images from our own domain plus partner logos referenced
  // in the institutional content.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.mpafoods.com" },
      { protocol: "https", hostname: "**.chickenhpc85.com.br" },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
