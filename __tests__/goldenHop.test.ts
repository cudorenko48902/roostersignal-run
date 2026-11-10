import {resolveHop} from '../src/game/crossing';
import {goldenHopFeathers} from '../src/game/scoring';

describe('the golden hop', () => {
  it('pays 25 x multiplier and keeps the streak alive', () => {
    const out = resolveHop('WAIT', true, 3);
    expect(out.golden).toBe(true);
    expect(out.feathers).toBe(goldenHopFeathers(3));
    expect(out.feathers).toBe(50);
    expect(out.streak).toBe(4);
    expect(out.late).toBe(false);
  });

  it('degrades to a flat 10 once the 400 ms window has passed', () => {
    const out = resolveHop('WAIT', false, 3);
    expect(out.golden).toBe(false);
    expect(out.feathers).toBe(10);
    expect(out.streak).toBe(0);
    expect(out.late).toBe(true);
  });
});
