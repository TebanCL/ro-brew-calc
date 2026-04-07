/**
 * marketPrices.ts
 *
 * Client-side helpers for fetching ingredient prices from the ro-prices
 * Cloudflare Worker and caching the results in localStorage (30-min TTL).
 */

/** Cloudflare Worker URL — set via PUBLIC_WORKER_URL env variable. */
export const WORKER_URL = import.meta.env.PUBLIC_WORKER_URL as string ?? "";

const CACHE_KEY    = "ro_market_cache";
const CACHE_TTL    = 30 * 60 * 1000; // 30 minutes in ms
export const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between fetches

export interface MarketCache {
  prices: Record<string, number>;
  ts: number; // Unix ms timestamp of last fetch
}

// ── localStorage cache ────────────────────────────────────────────────────────

/** Returns the cached market prices if still fresh, otherwise null. */
export function getMarketCache(): MarketCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as MarketCache;
    if (Date.now() - cache.ts > CACHE_TTL) return null;
    return cache;
  } catch {
    return null;
  }
}

/** Returns the cached market prices regardless of TTL (for display purposes). */
export function getMarketCacheAny(): MarketCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as MarketCache) : null;
  } catch {
    return null;
  }
}

export function setMarketCache(prices: Record<string, number>) {
  try {
    const cache: MarketCache = { prices, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* noop */ }
}

/** Milliseconds remaining before the next fetch is allowed (0 = available now). */
export function getCooldownRemaining(): number {
  const cache = getMarketCacheAny();
  if (!cache) return 0;
  return Math.max(0, COOLDOWN_MS - (Date.now() - cache.ts));
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

/**
 * Fetches the minimum sell price for a single item from the Worker.
 * Returns null if the item has no active listings or the request fails.
 */
async function fetchItemPrice(
  item: string,
  server: string,
): Promise<number | null> {
  const url = `${WORKER_URL}/price?item=${encodeURIComponent(item)}&server=${server}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as { minPrice: number | null };
  return typeof data.minPrice === "number" ? data.minPrice : null;
}

/**
 * Fetches market prices for all supplied items sequentially, calling
 * onProgress after each one.  Returns a map of { itemName → minPrice }
 * for items that have active listings.
 */
export async function fetchAllMarketPrices(
  items: string[],
  server = "FREYA",
  onProgress?: (done: number, total: number) => void,
  signal?: AbortSignal,
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  for (let i = 0; i < items.length; i++) {
    if (signal?.aborted) break;
    const price = await fetchItemPrice(items[i], server);
    if (price !== null && price > 0) results[items[i]] = price;
    onProgress?.(i + 1, items.length);
  }
  return results;
}
