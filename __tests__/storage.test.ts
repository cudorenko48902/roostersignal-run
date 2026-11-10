import {
  __clearCache,
  defaultProfile,
  loadProfile,
  resetProfile,
  saveProfile,
} from '../src/game/storage';
import {STAGE_COUNT} from '../src/game/stages';

describe('offline-first local persistence', () => {
  beforeEach(() => __clearCache());

  it('starts from a themed default profile', async () => {
    const p = await loadProfile();
    expect(p.feathers).toBe(0);
    expect(p.unlocked).toBe(1);
    expect(Object.keys(p.stages)).toHaveLength(STAGE_COUNT);
    expect(p.settings.colourBlind).toBe(false);
  });

  it('round-trips the whole profile through the facade', async () => {
    const p = defaultProfile();
    p.feathers = 1240;
    p.stickers = ['0-1', '2-3'];
    await saveProfile(p);
    const back = await loadProfile();
    expect(back.feathers).toBe(1240);
    expect(back.stickers).toEqual(['0-1', '2-3']);
  });

  it('resets back to the default profile', async () => {
    const p = defaultProfile();
    p.feathers = 999;
    await saveProfile(p);
    const fresh = await resetProfile();
    expect(fresh.feathers).toBe(0);
  });
});
