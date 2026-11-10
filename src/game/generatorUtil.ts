/**
 * Tiny re-exports so generator.ts does not import stages.ts (which imports the
 * whole stage table) just for two helpers — keeps the module graph acyclic.
 */
import type {Signal, StageDef} from './types';

export function stagePeriodSafe(stage: StageDef): number {
  return Math.max(1, stage.green + stage.amber + stage.red);
}

export function signalAt(stage: StageDef, phase: number, t: number): Signal {
  const period = stagePeriodSafe(stage);
  let p = (t + phase) % period;
  if (p < 0) {
    p += period;
  }
  if (p < stage.green) {
    return 'GO';
  }
  if (p < stage.green + stage.amber) {
    return 'WAIT';
  }
  return 'STOP';
}
