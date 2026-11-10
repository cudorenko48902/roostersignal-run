import {defaultProfile} from '../src/game/storage';
import {STAGES, STAGE_COUNT} from '../src/game/stages';
import {TOTAL_STICKERS} from '../src/game/stickers';
import {last7Days} from '../src/game/daily';

describe('the progress view', () => {
  it('counts cleared stages, best streak and stickers out of the profile', () => {
    const p = defaultProfile();
    p.stages[0] = {cleared: true, best: 420, attempts: 3, doubleStickers: false};
    p.stages[1] = {cleared: true, best: 610, attempts: 5, doubleStickers: true};
    p.bestStreak = 14;
    p.stickers = ['0-0', '0-1', '1-2'];

    const cleared = STAGES.filter(s => p.stages[s.index].cleared).length;
    expect(cleared).toBe(2);
    expect(`${cleared}/${STAGE_COUNT}`).toBe('2/6');
    expect(`${p.stickers.length}/${TOTAL_STICKERS}`).toBe('3/24');
    expect(p.bestStreak).toBe(14);
  });

  it('shows an empty ladder only when nothing has been attempted', () => {
    const p = defaultProfile();
    const attempts = STAGES.reduce((n, s) => n + p.stages[s.index].attempts, 0);
    expect(attempts).toBe(0);
  });

  it('renders seven daily dots whatever the history is', () => {
    const p = defaultProfile();
    expect(last7Days(p.daily, '2026-11-10')).toHaveLength(7);
  });
});
