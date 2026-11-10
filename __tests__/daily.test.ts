import {
  completeDaily,
  dailyStage,
  dateKey,
  formatCountdown,
  isDailyDone,
  last7Days,
  msUntilTomorrow,
  prettyDate,
} from '../src/game/daily';
import {defaultProfile} from '../src/game/storage';
import {seedForDate} from '../src/game/rng';

describe('daily mode', () => {
  it('keys a day as YYYY-MM-DD', () => {
    expect(dateKey(new Date(2026, 10, 9))).toBe('2026-11-09');
    expect(prettyDate('2026-11-09')).toBe('09.11.2026');
  });

  it('seeds the same stage for everyone on the same date', () => {
    expect(seedForDate('2026-11-09')).toBe(seedForDate('2026-11-09'));
    expect(dailyStage('2026-11-09').index).toBe(
      dailyStage('2026-11-09').index,
    );
  });

  it('locks the day once the run is finished', () => {
    const p = defaultProfile();
    expect(isDailyDone(p.daily, '2026-11-09')).toBe(false);
    const after = completeDaily(p.daily, '2026-11-09', 1480, 9);
    expect(isDailyDone(after, '2026-11-09')).toBe(true);
    expect(after.lastScore).toBe(1480);
    expect(after.streak).toBe(1);
  });

  it('continues the streak on consecutive days and resets after a gap', () => {
    const p = defaultProfile();
    const d1 = completeDaily(p.daily, '2026-11-09', 100, 2);
    const d2 = completeDaily(d1, '2026-11-10', 200, 3);
    expect(d2.streak).toBe(2);
    const d3 = completeDaily(d2, '2026-11-20', 300, 1);
    expect(d3.streak).toBe(1);
  });

  it('reports the last seven days and a live countdown', () => {
    const p = defaultProfile();
    const d1 = completeDaily(p.daily, '2026-11-10', 10, 1);
    const week = last7Days(d1, '2026-11-10');
    expect(week).toHaveLength(7);
    expect(week[6]).toBe(true);
    expect(msUntilTomorrow(new Date(2026, 10, 10, 23, 59, 0))).toBe(60000);
    expect(formatCountdown(6 * 3600000 + 12 * 60000 + 40000)).toBe('06:12:40');
  });
});
