import type {Profile, StageProgress} from './types';
import {STAGES} from './stages';

/**
 * One-file persistence facade with an async API and a module-scope cache, so
 * every screen is already written against a persistent-storage shape. Swapping
 * the two functions below for a real key-value backend is the only change
 * needed to make the profile cross-process; no other file touches storage.
 */

function freshStages(): Record<number, StageProgress> {
  const out: Record<number, StageProgress> = {};
  for (let i = 0; i < STAGES.length; i++) {
    out[i] = {cleared: false, best: 0, attempts: 0, doubleStickers: false};
  }
  return out;
}

export function defaultProfile(): Profile {
  return {
    feathers: 0,
    bestStreak: 0,
    stickers: [],
    stages: freshStages(),
    unlocked: 1,
    settings: {
      colourBlind: false,
      bigTap: false,
      reducedMotion: false,
      hopAssist: false,
    },
    daily: {
      lastDate: null,
      streak: 0,
      lastScore: 0,
      lastStreakValue: 0,
      days: [],
    },
    totals: {crossings: 0, goldenHops: 0, cleanRuns: 0},
  };
}

let cache: Profile | null = null;

export async function loadProfile(): Promise<Profile> {
  if (!cache) {
    cache = defaultProfile();
  }
  return cache;
}

export async function saveProfile(p: Profile): Promise<void> {
  cache = p;
}

export async function resetProfile(): Promise<Profile> {
  cache = defaultProfile();
  return cache;
}

/** Test seam only. */
export function __clearCache(): void {
  cache = null;
}
