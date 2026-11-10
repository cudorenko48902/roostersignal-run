import {isFinalRow, resolveHop} from '../src/game/crossing';

describe('the safe-crossing choice', () => {
  it('advances and scores on green', () => {
    const out = resolveHop('GO', false, 0);
    expect(out.safe).toBe(true);
    expect(out.feathers).toBe(10);
    expect(out.streak).toBe(1);
  });

  it('ends the run on red', () => {
    const out = resolveHop('STOP', false, 7);
    expect(out.safe).toBe(false);
    expect(out.streak).toBe(0);
  });

  it('never ends the run on amber', () => {
    expect(resolveHop('WAIT', true, 3).safe).toBe(true);
    expect(resolveHop('WAIT', false, 3).safe).toBe(true);
  });

  it('treats the far kerb as the final row', () => {
    expect(isFinalRow(4, 4)).toBe(true);
    expect(isFinalRow(3, 4)).toBe(false);
  });
});
