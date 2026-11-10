import type {StageDef} from './types';

/**
 * Six hand-authored stages. The author fixes lane count, signal durations and
 * the sticker set; the attempt generator places the phases and the token lanes.
 */
export const STAGES: StageDef[] = [
  {
    index: 0,
    name: 'DAWN KERB',
    lanes: 3,
    green: 3200,
    amber: 900,
    red: 2400,
    setId: 0,
    tokens: 2,
    fallbackPhases: [0, 2200, 4400],
  },
  {
    index: 1,
    name: 'MARKET STREET',
    lanes: 4,
    green: 2800,
    amber: 800,
    red: 2600,
    setId: 1,
    tokens: 2,
    fallbackPhases: [0, 1600, 3200, 4800],
  },
  {
    index: 2,
    name: 'RUSH HOUR',
    lanes: 4,
    green: 2400,
    amber: 700,
    red: 2800,
    setId: 2,
    tokens: 3,
    fallbackPhases: [0, 1500, 3000, 4500],
  },
  {
    index: 3,
    name: 'NIGHT SHIFT',
    lanes: 5,
    green: 2200,
    amber: 600,
    red: 3000,
    setId: 3,
    tokens: 3,
    fallbackPhases: [0, 1200, 2400, 3600, 4800],
  },
  {
    index: 4,
    name: 'TRAM LINE',
    lanes: 5,
    green: 2000,
    amber: 600,
    red: 3200,
    setId: 4,
    tokens: 3,
    fallbackPhases: [0, 1160, 2320, 3480, 4640],
  },
  {
    index: 5,
    name: 'SIGNAL STORM',
    lanes: 6,
    green: 1800,
    amber: 500,
    red: 3400,
    setId: 5,
    tokens: 3,
    fallbackPhases: [0, 940, 1880, 2820, 3760, 4700],
  },
];

export const STAGE_COUNT = STAGES.length;

export function stageAt(index: number): StageDef {
  const i = Math.max(0, Math.min(STAGE_COUNT - 1, index));
  return STAGES[i];
}

export function stagePeriod(stage: StageDef): number {
  return stage.green + stage.amber + stage.red;
}

/** "GREEN 2.4s · AMBER 0.7s · RED 2.8s" — the contract line on Challenge. */
export function timingLine(stage: StageDef): string {
  const s = (ms: number) => (ms / 1000).toFixed(1) + 's';
  return `GREEN ${s(stage.green)} · AMBER ${s(stage.amber)} · RED ${s(
    stage.red,
  )}`;
}
