import {STAGES} from '../src/game/stages';
import {
  amberElapsed,
  isGoldenWindow,
  signalAt,
  windowProgress,
  windowRemaining,
} from '../src/game/signal';

const stage = STAGES[1]; // green 2800, amber 800, red 2600

describe('the signal clock', () => {
  it('runs green then amber then red inside one period', () => {
    expect(signalAt(stage, 0, 0)).toBe('GO');
    expect(signalAt(stage, 0, 2799)).toBe('GO');
    expect(signalAt(stage, 0, 2800)).toBe('WAIT');
    expect(signalAt(stage, 0, 3599)).toBe('WAIT');
    expect(signalAt(stage, 0, 3600)).toBe('STOP');
  });

  it('wraps around and respects each lane phase offset', () => {
    const period = stage.green + stage.amber + stage.red;
    expect(signalAt(stage, 0, period)).toBe('GO');
    expect(signalAt(stage, 2800, 0)).toBe('WAIT');
  });

  it('reports how long the current window still has', () => {
    expect(windowRemaining(stage, 0, 0)).toBe(2800);
    expect(windowProgress(stage, 0, 1400)).toBeCloseTo(0.5, 5);
  });

  it('marks the first 400 ms of amber as the golden window', () => {
    expect(amberElapsed(stage, 0, 2900)).toBe(100);
    expect(isGoldenWindow(stage, 0, 2900)).toBe(true);
    expect(isGoldenWindow(stage, 0, 3300)).toBe(false);
    expect(isGoldenWindow(stage, 0, 100)).toBe(false);
  });
});
