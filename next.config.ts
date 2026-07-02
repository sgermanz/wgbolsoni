import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Payload serves uploaded media as absolute URLs built from
// NEXT_PUBLIC_SERVER_URL (e.g. https://wgbolsoni-production.up.railway.app/api/media/file/x.jpg).
// next/image refuses to optimize any host not in remotePatterns, so we must
// allow our own domain. We derive it from the env var so this keeps working
// when the site moves to a custom domain (wgbolsoni.net) — no code change,
// just update the env var. The railway.app wildcard is a safety net for the
// default Railway domain.
const remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  { protocol: "https", hostname: "**.mpafoods.com" },
  { protocol: "https", hostname: "**.chickenhpc85.com.br" },
  { protocol: "https", hostname: "*.up.railway.app" },
];

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
if (serverUrl) {
  try {
    const u = new URL(serverUrl);
    remotePatterns.push({
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      // Sem a porta explícita o Next só casa 80/443 — em dev a URL é
      // localhost:3000 e o otimizador devolvia 400 para a própria mídia.
      ...(u.port ? { port: u.port } : {}),
    });
  } catch {
    // ignore malformed env value
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    // Next 16 blocks optimizing images whose host resolves to a private IP
    // (SSRF guard). In dev, Payload media URLs are http://localhost:3000/...,
    // so every cover 400s without this. Never enabled in production.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
