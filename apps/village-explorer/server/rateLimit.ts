interface CacheEntry {
  result: any;
  cachedAt: number;
}

const responseCache = new Map<string, CacheEntry>();
const sessionCallCounts = new Map<string, { count: number; resetAt: number }>();

const MAX_CALLS_PER_HOUR = 30;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function checkRateLimit(sessionId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let session = sessionCallCounts.get(sessionId);

  if (!session || now > session.resetAt) {
    session = { count: 0, resetAt: now + 60 * 60 * 1000 };
    sessionCallCounts.set(sessionId, session);
  }

  if (session.count >= MAX_CALLS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  session.count += 1;
  return { allowed: true, remaining: MAX_CALLS_PER_HOUR - session.count };
}

export function getCachedResponse<T>(cacheKey: string): T | null {
  const entry = responseCache.get(cacheKey);
  if (!entry) return null;

  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    responseCache.delete(cacheKey);
    return null;
  }

  return entry.result as T;
}

export function setCachedResponse(cacheKey: string, result: any): void {
  responseCache.set(cacheKey, {
    result,
    cachedAt: Date.now(),
  });
}
