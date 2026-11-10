import {LOADER_DURATION_MS, MAX_LAYOUT_RETRIES} from '../src/constants/config';
import {buildLayout} from '../src/game/generator';
import {defaultProfile} from '../src/game/storage';
import {STAGES} from '../src/game/stages';
import {seedForAttempt} from '../src/game/rng';
import {completeDaily, isDailyDone} from '../src/game/daily';

describe('loading, empty, error and completion states', () => {
  it('holds the loader for exactly 8000 ms', () => {
    expect(LOADER_DURATION_MS).toBe(8000);
  });

  it('starts empty: no stickers, no runs, nothing cleared', () => {
    const p = defaultProfile();
    expect(p.stickers).toEqual([]);
    expect(p.stages[0].attempts).toBe(0);
    expect(p.stages[0].cleared).toBe(false);
  });

  it('falls back to a safe layout instead of dead-ending', () => {
    const impossible = {...STAGES[0], green: 0, amber: 0, red: 4000};
    const layout = buildLayout(impossible, seedForAttempt(0, 1));
    expect(MAX_LAYOUT_RETRIES).toBe(20);
    expect(layout.fallback).toBe(true);
    expect(layout.phases).toHaveLength(impossible.lanes);
  });

  it('renders the completion state once the daily is finished', () => {
    const p = defaultProfile();
    const after = completeDaily(p.daily, '2026-11-10', 1480, 9);
    expect(isDailyDone(after, '2026-11-10')).toBe(true);
    expect(completeDaily(after, '2026-11-10', 1, 1)).toBe(after);
  });
});
