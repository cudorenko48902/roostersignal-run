import {
  CLEAR_BASE,
  CLEAR_PER_LANE,
  FEATHERS_GOLDEN,
  FEATHERS_SAFE,
  MAX_STREAK_MULT,
} from '../constants/config';

/** 1,1,1,2,2,2,3 ... capped at 5. Patience is what pays. */
export function streakMult(streak: number): number {
  return Math.min(MAX_STREAK_MULT, 1 + Math.floor(Math.max(0, streak) / 3));
}

export function safeHopFeathers(streak: number): number {
  return FEATHERS_SAFE * streakMult(streak);
}

export function goldenHopFeathers(streak: number): number {
  return FEATHERS_GOLDEN * streakMult(streak);
}

/** A late-amber hop is safe but scruffy: flat payout, no multiplier. */
export function lateHopFeathers(): number {
  return FEATHERS_SAFE;
}

export function clearBonus(lanes: number): number {
  return CLEAR_BASE + CLEAR_PER_LANE * lanes;
}

/** 1,240 — thousands separators everywhere a number can change. */
export function formatNumber(n: number): string {
  const v = Math.max(0, Math.floor(n));
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
