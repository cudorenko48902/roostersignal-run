import type {DailyState, StageDef} from './types';
import {STAGES} from './stages';
import {mulberry32, seedForDate} from './rng';

export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function prettyDate(key: string): string {
  const parts = key.split('-');
  if (parts.length !== 3) {
    return key;
  }
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

/** The daily stage is picked by the date, so everyone gets the same street. */
export function dailyStage(key: string): StageDef {
  const rnd = mulberry32(seedForDate(key));
  const i = Math.floor(rnd() * STAGES.length);
  return STAGES[Math.max(0, Math.min(STAGES.length - 1, i))];
}

export function isDailyDone(daily: DailyState, key: string): boolean {
  return daily.lastDate === key;
}

function dayBefore(key: string): string {
  const parts = key.split('-').map(n => parseInt(n, 10));
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

/** Consecutive days keep the streak; a gap resets it to 1. */
export function completeDaily(
  daily: DailyState,
  key: string,
  score: number,
  streakValue: number,
): DailyState {
  if (daily.lastDate === key) {
    return daily;
  }
  const continued = daily.lastDate === dayBefore(key);
  const days = daily.days.concat([key]).slice(-7);
  return {
    lastDate: key,
    streak: continued ? daily.streak + 1 : 1,
    lastScore: score,
    lastStreakValue: streakValue,
    days,
  };
}

/** The last seven calendar days, newest last, flagged played / missed. */
export function last7Days(daily: DailyState, key: string): boolean[] {
  const out: boolean[] = [];
  let k = key;
  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    keys.unshift(k);
    k = dayBefore(k);
  }
  for (let i = 0; i < keys.length; i++) {
    out.push(daily.days.indexOf(keys[i]) !== -1);
  }
  return out;
}

/** Milliseconds until local midnight — the "NEXT SIGNAL IN" countdown. */
export function msUntilTomorrow(now: Date = new Date()): number {
  const next = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  return Math.max(0, next.getTime() - now.getTime());
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}
