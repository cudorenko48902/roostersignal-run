export type Signal = 'GO' | 'WAIT' | 'STOP';
export type Outcome = 'cleared' | 'caught';
export type RunPhase =
  | 'idle'
  | 'hopping'
  | 'collecting'
  | 'caught'
  | 'cleared';

export interface StageDef {
  index: number;
  name: string;
  lanes: number;
  /** milliseconds */
  green: number;
  amber: number;
  red: number;
  setId: number;
  tokens: number;
  fallbackPhases: number[];
}

export interface StageLayout {
  stage: StageDef;
  /** one phase offset per lane, in milliseconds */
  phases: number[];
  /** lane indices (0-based) that hold a sticker token this attempt */
  stickerLanes: number[];
  seed: number;
  /** true when the solvability check never passed and FALLBACK_PHASES was used */
  fallback: boolean;
}

export interface GameSettings {
  colourBlind: boolean;
  bigTap: boolean;
  reducedMotion: boolean;
  hopAssist: boolean;
}

export interface StageProgress {
  cleared: boolean;
  best: number;
  attempts: number;
  /** earned by a Clean Run, consumed by the next run of this stage */
  doubleStickers: boolean;
}

export interface DailyState {
  lastDate: string | null;
  streak: number;
  lastScore: number;
  lastStreakValue: number;
  /** last 7 ISO day keys that were actually played */
  days: string[];
}

export interface Profile {
  feathers: number;
  bestStreak: number;
  /** flat sticker ids, e.g. "2-3" = set 2, slot 3 */
  stickers: string[];
  stages: Record<number, StageProgress>;
  unlocked: number;
  settings: GameSettings;
  daily: DailyState;
  totals: {crossings: number; goldenHops: number; cleanRuns: number};
}

export interface RunResult {
  outcome: Outcome;
  stageIndex: number;
  stageName: string;
  lanesCrossed: number;
  lanes: number;
  feathers: number;
  bestStreak: number;
  newStickers: string[];
  cleanRun: boolean;
  goldenHops: number;
  seed: number;
  daily: boolean;
}
