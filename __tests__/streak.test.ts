import {safeHopFeathers, streakMult} from '../src/game/scoring';
import {resolveHop} from '../src/game/crossing';

describe('the feather streak multiplier', () => {
  it('climbs every three clean greens and caps at five', () => {
    expect(streakMult(0)).toBe(1);
    expect(streakMult(2)).toBe(1);
    expect(streakMult(3)).toBe(2);
    expect(streakMult(6)).toBe(3);
    expect(streakMult(99)).toBe(5);
  });

  it('pays the multiplier on a green hop', () => {
    expect(safeHopFeathers(6)).toBe(30);
  });

  it('is wiped by a late amber hop and by a red one', () => {
    expect(resolveHop('WAIT', false, 9).streak).toBe(0);
    expect(resolveHop('STOP', false, 9).streak).toBe(0);
  });
});
