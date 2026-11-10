import type {StageDef, StageLayout} from './types';
import {mulberry32} from './rng';
import {signalAt, stagePeriodSafe} from './generatorUtil';
import {MAX_LAYOUT_RETRIES, REACTION_ALLOWANCE_MS} from '../constants/config';

/**
 * A candidate layout is accepted only when it is provably crossable:
 *   - every lane reaches a green window within 6 s of the player arriving,
 *     allowing 450 ms of human reaction time, and
 *   - no two adjacent lanes are red at the same time for more than 4 s.
 * Up to 20 regenerations, then the stage's hardcoded FALLBACK_PHASES is used.
 * The fallback is a guarantee, not the game.
 */
const GREEN_REACHABLE_MS = 6000;
const ADJACENT_RED_LIMIT_MS = 4000;
const STEP_MS = 100;

export function isSolvable(stage: StageDef, phases: number[]): boolean {
  const period = stagePeriodSafe(stage);

  // 1. Each lane must offer a usable green window soon after arrival.
  for (let lane = 0; lane < stage.lanes; lane++) {
    let ok = false;
    for (let t = 0; t <= GREEN_REACHABLE_MS; t += STEP_MS) {
      if (signalAt(stage, phases[lane], t + REACTION_ALLOWANCE_MS) === 'GO') {
        ok = true;
        break;
      }
    }
    if (!ok) {
      return false;
    }
  }

  // 2. Neighbouring lanes must not stay red-locked together for too long.
  for (let lane = 0; lane + 1 < stage.lanes; lane++) {
    let run = 0;
    for (let t = 0; t <= period * 2; t += STEP_MS) {
      const bothRed =
        signalAt(stage, phases[lane], t) === 'STOP' &&
        signalAt(stage, phases[lane + 1], t) === 'STOP';
      run = bothRed ? run + STEP_MS : 0;
      if (run > ADJACENT_RED_LIMIT_MS) {
        return false;
      }
    }
  }
  return true;
}

function placeStickers(
  stage: StageDef,
  rnd: () => number,
  count: number,
): number[] {
  const pool: number[] = [];
  for (let i = 0; i < stage.lanes; i++) {
    pool.push(i);
  }
  // Fisher-Yates on a local RNG — placement comes from the seed, never a const.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, Math.max(0, Math.min(count, pool.length))).sort((a, b) => a - b);
}

export function buildLayout(
  stage: StageDef,
  seed: number,
  tokenMultiplier = 1,
): StageLayout {
  const rnd = mulberry32(seed);
  const period = stagePeriodSafe(stage);
  let phases: number[] = [];
  let fallback = true;

  for (let attempt = 0; attempt < MAX_LAYOUT_RETRIES; attempt++) {
    const candidate: number[] = [];
    for (let lane = 0; lane < stage.lanes; lane++) {
      candidate.push(Math.floor(rnd() * period));
    }
    if (isSolvable(stage, candidate)) {
      phases = candidate;
      fallback = false;
      break;
    }
  }
  if (fallback) {
    phases = stage.fallbackPhases.slice(0, stage.lanes);
    while (phases.length < stage.lanes) {
      phases.push(0);
    }
  }

  const wanted = Math.min(
    stage.lanes,
    Math.round(stage.tokens * tokenMultiplier),
  );
  const stickerLanes = placeStickers(stage, rnd, wanted);

  return {stage, phases, stickerLanes, seed, fallback};
}
