import type {RunResult} from '../src/game/types';
import {STAGE_COUNT} from '../src/game/stages';

function make(partial: Partial<RunResult>): RunResult {
  return {
    outcome: 'caught',
    stageIndex: 1,
    stageName: 'MARKET STREET',
    lanesCrossed: 2,
    lanes: 4,
    feathers: 120,
    bestStreak: 3,
    newStickers: [],
    cleanRun: false,
    goldenHops: 0,
    seed: 42,
    daily: false,
    ...partial,
  };
}

// Mirrors the title and the NEXT STAGE rule of RunResultScreen.
function title(r: RunResult): string {
  if (r.daily && r.outcome === 'cleared') {
    return 'DAILY SIGNAL DONE';
  }
  return r.outcome === 'cleared' ? 'KERB REACHED' : 'CAUGHT ON RED';
}

function hasNextStage(r: RunResult): boolean {
  return r.outcome === 'cleared' && !r.daily && r.stageIndex + 1 < STAGE_COUNT;
}

describe('the run result screen', () => {
  it('titles the outcome in the words of the game', () => {
    expect(title(make({}))).toBe('CAUGHT ON RED');
    expect(title(make({outcome: 'cleared'}))).toBe('KERB REACHED');
    expect(title(make({outcome: 'cleared', daily: true}))).toBe(
      'DAILY SIGNAL DONE',
    );
  });

  it('offers NEXT STAGE only after a clear that has a next stage', () => {
    expect(hasNextStage(make({outcome: 'cleared'}))).toBe(true);
    expect(hasNextStage(make({outcome: 'caught'}))).toBe(false);
    expect(
      hasNextStage(make({outcome: 'cleared', stageIndex: STAGE_COUNT - 1})),
    ).toBe(false);
    expect(hasNextStage(make({outcome: 'cleared', daily: true}))).toBe(false);
  });

  it('carries the attempt seed so any run is reproducible', () => {
    expect(make({seed: 7919}).seed).toBe(7919);
  });
});
