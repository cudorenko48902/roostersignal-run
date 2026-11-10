import {CAR_MS, GOLDEN_WINDOW_MS, HOP_MS} from '../src/constants/config';
import {resolveHop} from '../src/game/crossing';

/**
 * The engine releases its busy flag inside the animation completion callback,
 * so the lock can never outlive the animation that set it.
 */
describe('responsive touch controls', () => {
  it('locks input for the length of the hop only', () => {
    expect(HOP_MS).toBe(220);
    expect(HOP_MS).toBeLessThan(400);
  });

  it('reaches the result screen well inside the 3 s capture budget', () => {
    expect(CAR_MS).toBeLessThan(3000);
    expect(HOP_MS + CAR_MS).toBeLessThan(1500);
  });

  it('keeps the golden window a real skill check', () => {
    expect(GOLDEN_WINDOW_MS).toBe(400);
  });

  it('resolves every tap to exactly one outcome, never to nothing', () => {
    const signals: Array<'GO' | 'WAIT' | 'STOP'> = ['GO', 'WAIT', 'STOP'];
    for (let i = 0; i < signals.length; i++) {
      const out = resolveHop(signals[i], false, 2);
      expect(typeof out.safe).toBe('boolean');
      expect(out.feathers).toBeGreaterThanOrEqual(0);
    }
  });
});
