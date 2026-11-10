import {STAGES, STAGE_COUNT, stageAt, stagePeriod, timingLine} from '../src/game/stages';
import {clearBonus} from '../src/game/scoring';
import {buildLayout, isSolvable} from '../src/game/generator';
import {seedForAttempt} from '../src/game/rng';

describe('handcrafted stages and progression', () => {
  it('ships six stages with rising lane counts and tighter greens', () => {
    expect(STAGE_COUNT).toBe(6);
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].lanes).toBeGreaterThanOrEqual(STAGES[i - 1].lanes);
      expect(STAGES[i].green).toBeLessThan(STAGES[i - 1].green);
    }
  });

  it('clamps an out-of-range stage index instead of crashing', () => {
    expect(stageAt(-4).index).toBe(0);
    expect(stageAt(99).index).toBe(5);
  });

  it('pays 100 + 25 per lane for a clear', () => {
    expect(clearBonus(4)).toBe(200);
    expect(clearBonus(6)).toBe(250);
  });

  it('describes the signal contract in words', () => {
    expect(timingLine(STAGES[2])).toBe('GREEN 2.4s · AMBER 0.7s · RED 2.8s');
    expect(stagePeriod(STAGES[0])).toBe(6500);
  });

  it('only ever hands out a solvable layout', () => {
    for (let i = 0; i < STAGES.length; i++) {
      const layout = buildLayout(STAGES[i], seedForAttempt(i, 1));
      expect(layout.phases).toHaveLength(STAGES[i].lanes);
      if (!layout.fallback) {
        expect(isSolvable(STAGES[i], layout.phases)).toBe(true);
      } else {
        expect(layout.phases).toEqual(
          STAGES[i].fallbackPhases.slice(0, STAGES[i].lanes),
        );
      }
    }
  });

  it('places the sticker tokens from the seed, never from a constant', () => {
    const a = buildLayout(STAGES[3], seedForAttempt(3, 1));
    const b = buildLayout(STAGES[3], seedForAttempt(3, 2));
    expect(a.stickerLanes.length).toBe(STAGES[3].tokens);
    expect(a.phases).not.toEqual(b.phases);
  });

  it('is reproducible from the same seed', () => {
    const seed = seedForAttempt(2, 7);
    expect(buildLayout(STAGES[2], seed)).toEqual(buildLayout(STAGES[2], seed));
  });
});
