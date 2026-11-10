import type {Signal} from './types';
import {
  goldenHopFeathers,
  lateHopFeathers,
  safeHopFeathers,
} from './scoring';

export interface HopOutcome {
  /** false means the run ends right here */
  safe: boolean;
  feathers: number;
  streak: number;
  golden: boolean;
  /** a late-amber hop costs the run its Clean Run eligibility */
  late: boolean;
}

/**
 * The single source of truth for what one GO tap does.
 *  GO            -> safe hop, +10 x mult, streak + 1
 *  WAIT (<400ms) -> Golden Hop, +25 x mult, streak kept and counted
 *  WAIT (>400ms) -> safe but scruffy, +10 flat, streak wiped, run no longer clean
 *  STOP          -> fatal
 */
export function resolveHop(
  signal: Signal,
  golden: boolean,
  streak: number,
): HopOutcome {
  if (signal === 'STOP') {
    return {safe: false, feathers: 0, streak: 0, golden: false, late: true};
  }
  if (signal === 'GO') {
    return {
      safe: true,
      feathers: safeHopFeathers(streak),
      streak: streak + 1,
      golden: false,
      late: false,
    };
  }
  if (golden) {
    return {
      safe: true,
      feathers: goldenHopFeathers(streak),
      streak: streak + 1,
      golden: true,
      late: false,
    };
  }
  return {
    safe: true,
    feathers: lateHopFeathers(),
    streak: 0,
    golden: false,
    late: true,
  };
}

/** The far kerb is always free — reaching it is the clear, not a gamble. */
export function isFinalRow(roosterRow: number, lanes: number): boolean {
  return roosterRow >= lanes;
}
