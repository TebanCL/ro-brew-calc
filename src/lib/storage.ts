export function lsGet<T>(k: string, def: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; }
}

export function lsSet(k: string, v: unknown) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* noop */ }
}
