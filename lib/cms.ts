import "server-only";

import { getPayload, type Payload } from "payload";

import config from "@/payload.config";

/**
 * Singleton Payload client.
 *
 * `getPayload({ config })` is heavyweight — it parses the entire config and
 * opens the Postgres pool. We cache the promise so concurrent requests share
 * a single instance and we don't reconnect on every render.
 */

let cachedPayload: Promise<Payload> | null = null;

export function getPayloadClient(): Promise<Payload> {
  if (!cachedPayload) {
    cachedPayload = getPayload({ config }).catch((error) => {
      // Reset cache on failure so subsequent attempts retry instead of
      // returning a permanently-rejected promise.
      cachedPayload = null;
      throw error;
    });
  }
  return cachedPayload;
}

/**
 * Wrap a Payload query with a graceful fallback. If the DB is unreachable
 * (build time without DATABASE_URI, or a transient runtime error), we log
 * once and return the fallback value so the public site never crashes.
 */
export async function withFallback<T>(
  task: (payload: Payload) => Promise<T>,
  fallback: T,
  label: string,
): Promise<T> {
  try {
    const payload = await getPayloadClient();
    return await task(payload);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[cms:${label}] DB unavailable — using fallback.`, error);
    }
    return fallback;
  }
}
