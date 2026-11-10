import type {Signal, StageDef, StageLayout} from './types';
import {stagePeriod} from './stages';
import {GOLDEN_WINDOW_MS} from '../constants/config';

/** Where lane `lane` sits in its own cycle at run time `t` (ms). */
export function phasePos(
  stage: StageDef,
  phase: number,
  t: number,
): number {
  const period = stagePeriod(stage);
  const p = (t + phase) % period;
  return p < 0 ? p + period : p;
}

export function signalAt(
  stage: StageDef,
  phase: number,
  t: number,
): Signal {
  const p = phasePos(stage, phase, t);
  if (p < stage.green) {
    return 'GO';
  }
  if (p < stage.green + stage.amber) {
    return 'WAIT';
  }
  return 'STOP';
}

/** Milliseconds left before this lane's signal word changes. */
export function windowRemaining(
  stage: StageDef,
  phase: number,
  t: number,
): number {
  const p = phasePos(stage, phase, t);
  if (p < stage.green) {
    return stage.green - p;
  }
  if (p < stage.green + stage.amber) {
    return stage.green + stage.amber - p;
  }
  return stagePeriod(stage) - p;
}

/** 0..1 — how much of the current window is still left (CountdownRing). */
export function windowProgress(
  stage: StageDef,
  phase: number,
  t: number,
): number {
  const sig = signalAt(stage, phase, t);
  const total =
    sig === 'GO' ? stage.green : sig === 'WAIT' ? stage.amber : stage.red;
  if (total <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, windowRemaining(stage, phase, t) / total));
}

/** How long amber has already been showing. -1 when the lane is not amber. */
export function amberElapsed(
  stage: StageDef,
  phase: number,
  t: number,
): number {
  const p = phasePos(stage, phase, t);
  if (p < stage.green || p >= stage.green + stage.amber) {
    return -1;
  }
  return p - stage.green;
}

/** The 400 ms precision window at the very start of amber. */
export function isGoldenWindow(
  stage: StageDef,
  phase: number,
  t: number,
): boolean {
  const e = amberElapsed(stage, phase, t);
  return e >= 0 && e < GOLDEN_WINDOW_MS;
}

/** Signal words for every lane of a layout at time t. */
export function laneSignals(layout: StageLayout, t: number): Signal[] {
  return layout.phases.map(ph => signalAt(layout.stage, ph, t));
}
