import {
  SLOTS_PER_SET,
  STICKER_SETS,
  TOTAL_STICKERS,
  isSetComplete,
  ownedInSet,
  setName,
  setTint,
  stickerId,
} from '../src/game/stickers';

describe('the collection album', () => {
  it('lays out 24 slots across six named sets', () => {
    expect(STICKER_SETS.length * SLOTS_PER_SET).toBe(TOTAL_STICKERS);
    expect(setName(0)).toBe('DAWN KERB');
    expect(setName(5)).toBe('SIGNAL STORM');
  });

  it('separates owned slots from missing ones', () => {
    const owned = [stickerId(3, 0), stickerId(3, 2)];
    expect(ownedInSet(owned, 3)).toBe(2);
    expect(isSetComplete(owned, 3)).toBe(false);
    expect(owned.indexOf(stickerId(3, 1))).toBe(-1);
  });

  it('flips a set to its complete state at four of four', () => {
    const owned = [0, 1, 2, 3].map(s => stickerId(5, s));
    expect(isSetComplete(owned, 5)).toBe(true);
  });

  it('falls back to a valid tint for an unknown set id', () => {
    expect(setTint(99)).toMatch(/^#/);
    expect(setName(99)).toBe('DAWN KERB');
  });
});
