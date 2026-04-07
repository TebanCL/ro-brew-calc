/**
 * ro-prices Cloudflare Worker
 *
 * Proxies ROLATAM shop search requests and returns the lowest sell price for
 * a given item as JSON — adding the CORS headers that the origin lacks.
 *
 * Endpoint:
 *   GET /price?item=<name>&server=<FREYA|CHAOS>
 *   → { "item": "Red Herb", "minPrice": 100, "listings": 4 }
 *   → { "item": "Unknown",  "minPrice": null, "listings": 0 }  (no listings)
 *
 * Edge cache TTL: CACHE_TTL seconds (responses are cached per URL at the CF edge).
 */

const SHOP_BASE = "https://ro.gnjoylatam.com/en/intro/shop-search/trading";
const CACHE_TTL = 300; // 5 minutes
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── RSC payload parser ────────────────────────────────────────────────────────

/** Returns the first bracket-balanced JSON array starting at startIdx. */
function extractJsonArray(str, startIdx) {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = startIdx; i < str.length; i++) {
    const ch = str[i];
    if (escape)        { escape = false; continue; }
    if (ch === "\\")   { escape = true;  continue; }
    if (ch === '"')    { inString = !inString; continue; }
    if (inString)      continue;
    if (ch === "[")    depth++;
    else if (ch === "]") { depth--; if (depth === 0) return str.slice(startIdx, i + 1); }
  }
  return null;
}

/**
 * Fetches the shop page for `item` and returns the minimum sell price.
 * Returns { minPrice: null, listings: 0 } when nothing is found.
 */
async function fetchMinPrice(item, server) {
  const url = `${SHOP_BASE}?storeType=SELL&serverType=${server}&searchWord=${encodeURIComponent(item)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ro-brew-calc/1.0)" },
  });
  if (!res.ok) return { minPrice: null, listings: 0 };

  const html = await res.text();

  // Next.js App Router streams RSC payloads as self.__next_f.push([1,"..."]) calls.
  // The listing array lives in one of these chunks under the key "list".
  const pushRe = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
  let match;
  while ((match = pushRe.exec(html)) !== null) {
    let decoded;
    try { decoded = JSON.parse(`"${match[1]}"`); } catch { continue; }

    const listIdx = decoded.indexOf('"list":[');
    if (listIdx === -1) continue;

    const arrayStart = decoded.indexOf("[", listIdx + 7);
    if (arrayStart === -1) continue;

    const arrayStr = extractJsonArray(decoded, arrayStart);
    if (!arrayStr) continue;

    let list;
    try { list = JSON.parse(arrayStr); } catch { continue; }

    if (!Array.isArray(list) || list.length === 0) return { minPrice: null, listings: 0 };

    // Prefer exact name matches (the search can return partial results).
    const exact = list.filter((e) => e.itemName?.toLowerCase() === item.toLowerCase());
    const source = exact.length > 0 ? exact : list;
    const minPrice = Math.min(...source.map((e) => e.itemPrice));
    return { minPrice, listings: source.length };
  }

  return { minPrice: null, listings: 0 };
}

// ── Worker entry point ────────────────────────────────────────────────────────

export default {
  async fetch(request, _env, ctx) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);

    if (url.pathname !== "/price") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }

    const item   = url.searchParams.get("item");
    const server = (url.searchParams.get("server") ?? "FREYA").toUpperCase();

    if (!item) {
      return new Response(JSON.stringify({ error: "Missing 'item' parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }
    if (!["FREYA", "CHAOS"].includes(server)) {
      return new Response(JSON.stringify({ error: "Invalid server (FREYA or CHAOS)" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }

    // ── Edge cache lookup ────────────────────────────────────────────────────
    const cache    = caches.default;
    const cacheKey = new Request(url.toString(), { method: "GET" });
    const cached   = await cache.match(cacheKey);
    if (cached) return cached;

    // ── Upstream fetch + parse ───────────────────────────────────────────────
    const data = await fetchMinPrice(item, server);

    const body = JSON.stringify({ item, ...data });
    const response = new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_TTL}`,
        ...CORS,
      },
    });

    // Store in edge cache asynchronously (non-blocking).
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  },
};
