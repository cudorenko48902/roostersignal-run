import {
  SLOTS_PER_SET,
  STICKER_SETS,
  TOTAL_STICKERS,
  drawSticker,
  isSetComplete,
  ownedInSet,
  setOf,
  stickerId,
} from '../src/game/stickers';

describe('roadside sticker collection', () => {
  it('has six sets of four distinct tints', () => {
    expect(STICKER_SETS).toHaveLength(6);
    expect(TOTAL_STICKERS).toBe(24);
    const tints = STICKER_SETS.map(s => s.tint);
    expect(new Set(tints).size).toBe(6);
  });

  it('awards a sticker of the stage set', () => {
    const id = drawSticker([], 2, 0.1);
    expect(id).not.toBeNull();
    expect(setOf(id as string)).toBe(2);
  });

  it('re-rolls a duplicate to a slot that is still missing', () => {
    const owned = [stickerId(1, 0), stickerId(1, 1), stickerId(1, 2)];
    expect(drawSticker(owned, 1, 0.0)).toBe(stickerId(1, 3));
    expect(drawSticker(owned, 1, 0.99)).toBe(stickerId(1, 3));
  });

  it('yields nothing once the set is complete', () => {
    const full = [0, 1, 2, 3].map(s => stickerId(4, s));
    expect(ownedInSet(full, 4)).toBe(SLOTS_PER_SET);
    expect(isSetComplete(full, 4)).toBe(true);
    expect(drawSticker(full, 4, 0.5)).toBeNull();
  });
});
