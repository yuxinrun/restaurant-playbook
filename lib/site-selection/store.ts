'use client';

/** 选址实验室本地持久化：第一阶段无账号，全部数据留在用户浏览器；接口形状便于后续迁移到数据库。 */
import { useCallback, useEffect, useState } from 'react';

export const SS_KEYS = {
  roadmap: 'ss:roadmap',
  visits: 'ss:visits',
  traffic: 'ss:traffic',
  scorecard: 'ss:scorecard',
  rentPlans: 'ss:rent-plans',
  forecast: 'ss:forecast',
  candidates: 'ss:candidates',
  leaseChecks: 'ss:lease-checks',
  reportMeta: 'ss:report-meta',
} as const;

export const SS_EVENT = 'ss:store-changed';

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SS_EVENT, { detail: key }));
  } catch {
    // 隐私模式或配额不足时静默失败，界面仍可用当前会话数据
  }
}

export type LocalSetter<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalState<T>(key: string, fallback: T): [T, LocalSetter<T>, () => void] {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(readLocal<T>(key, fallback));
    const sync = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (!detail || detail === key) setValue(readLocal<T>(key, fallback));
    };
    window.addEventListener(SS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
    // fallback 由调用方传入稳定值；只在 key 变化时重新订阅
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback<LocalSetter<T>>((next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      writeLocal(key, resolved);
      return resolved;
    });
  }, [key]);

  const reset = useCallback(() => {
    writeLocal(key, fallback);
    setValue(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set, reset];
}

export function clearAllSiteSelectionData(): void {
  if (typeof window === 'undefined') return;
  for (const key of Object.values(SS_KEYS)) {
    try { window.localStorage.removeItem(key); } catch { /* 忽略 */ }
  }
  window.dispatchEvent(new CustomEvent(SS_EVENT, { detail: '' }));
}
