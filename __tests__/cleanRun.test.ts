import {resolveHop} from '../src/game/crossing';
import {buildLayout} from '../src/game/generator';
import {STAGES} from '../src/game/stages';
import {seedForAttempt} from '../src/game/rng';

/**
 * A run stays clean while every hop is green or golden; one late-amber hop
 * ends that, and the bonus pays out as a doubled sticker drop next time.
 */
function isCleanAfter(signals: Array<[string, boolean]>): boolean {
  let clean = true;
  let streak = 0;
  for (const [sig, golden] of signals) {
    const out = resolveHop(sig as 'GO' | 'WAIT' | 'STOP', golden, streak);
    if (out.late) {
      clean = false;
    }
    streak = out.streak;
  }
  return clean;
}

describe('the clean run bonus', () => {
  it('survives greens and golden hops', () => {
    expect(
      isCleanAfter([
        ['GO', false],
        ['WAIT', true],
        ['GO', false],
      ]),
    ).toBe(true);
  });

  it('is lost by a single late amber hop', () => {
    expect(
      isCleanAfter([
        ['GO', false],
        ['WAIT', false],
      ]),
    ).toBe(false);
  });

  it('doubles the token drop on the next run of that stage', () => {
    const stage = STAGES[2];
    const seed = seedForAttempt(2, 3);
    const normal = buildLayout(stage, seed, 1);
    const doubled = buildLayout(stage, seed, 2);
    expect(normal.stickerLanes.length).toBe(stage.tokens);
    expect(doubled.stickerLanes.length).toBeGreaterThan(
      normal.stickerLanes.length,
    );
    expect(doubled.stickerLanes.length).toBeLessThanOrEqual(stage.lanes);
  });
});
