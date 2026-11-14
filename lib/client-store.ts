/** 浏览器端本地状态：收藏、最近搜索、开店指南进度、文章字号。仅在客户端调用。 */

const KEYS = {
  favorites: 'rp:favorites',
  searches: 'rp:recent-searches',
  roadmap: 'rp:roadmap-progress',
  fontScale: 'rp:font-scale',
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T, eventName?: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
  if (eventName) window.dispatchEvent(new CustomEvent(eventName));
}

export const FAVORITES_EVENT = 'rp:favorites-changed';

export function getFavorites(): string[] {
  return read<string[]>(KEYS.favorites, []);
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const list = getFavorites();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  write(KEYS.favorites, next, FAVORITES_EVENT);
  return next.includes(slug);
}

export function getRecentSearches(): string[] {
  return read<string[]>(KEYS.searches, []);
}

export function pushRecentSearch(query: string): void {
  const q = query.trim();
  if (!q) return;
  const next = [q, ...getRecentSearches().filter((s) => s !== q)].slice(0, 6);
  write(KEYS.searches, next, 'rp:searches-changed');
}

export function clearRecentSearches(): void {
  write(KEYS.searches, [], 'rp:searches-changed');
}

export const ROADMAP_EVENT = 'rp:roadmap-changed';

export function getRoadmapProgress(): string[] {
  return read<string[]>(KEYS.roadmap, []);
}

export function toggleRoadmapStage(id: string): string[] {
  const list = getRoadmapProgress();
  const next = list.includes(id) ? list.filter((s) => s !== id) : [...list, id];
  write(KEYS.roadmap, next, ROADMAP_EVENT);
  return next;
}

export function resetRoadmapProgress(): void {
  write(KEYS.roadmap, [], ROADMAP_EVENT);
}

export function getFontScale(): number {
  return read<number>(KEYS.fontScale, 1);
}

export function setFontScale(scale: number): void {
  write(KEYS.fontScale, scale);
}
