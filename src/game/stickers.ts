import {SET_TINTS} from '../constants/theme';

export interface StickerSet {
  id: number;
  name: string;
  tint: string;
  slots: number;
}

export const SLOTS_PER_SET = 4;

export const STICKER_SETS: StickerSet[] = [
  {id: 0, name: 'DAWN KERB', tint: SET_TINTS[0], slots: SLOTS_PER_SET},
  {id: 1, name: 'MARKET STALLS', tint: SET_TINTS[1], slots: SLOTS_PER_SET},
  {id: 2, name: 'RUSH HOUR', tint: SET_TINTS[2], slots: SLOTS_PER_SET},
  {id: 3, name: 'NIGHT SHIFT', tint: SET_TINTS[3], slots: SLOTS_PER_SET},
  {id: 4, name: 'TRAM LINE', tint: SET_TINTS[4], slots: SLOTS_PER_SET},
  {id: 5, name: 'SIGNAL STORM', tint: SET_TINTS[5], slots: SLOTS_PER_SET},
];

export const TOTAL_STICKERS = STICKER_SETS.length * SLOTS_PER_SET;

export function stickerId(setId: number, slot: number): string {
  return `${setId}-${slot}`;
}

export function setOf(id: string): number {
  return parseInt(id.split('-')[0], 10) || 0;
}

export function setTint(setId: number): string {
  const s = STICKER_SETS[setId];
  return s ? s.tint : SET_TINTS[0];
}

export function setName(setId: number): string {
  const s = STICKER_SETS[setId];
  return s ? s.name : 'DAWN KERB';
}

export function ownedInSet(owned: string[], setId: number): number {
  let n = 0;
  for (let i = 0; i < owned.length; i++) {
    if (setOf(owned[i]) === setId) {
      n++;
    }
  }
  return n;
}

export function isSetComplete(owned: string[], setId: number): boolean {
  return ownedInSet(owned, setId) >= SLOTS_PER_SET;
}

/**
 * Landing on a token awards one sticker of the stage's set. A duplicate is
 * re-rolled to a slot of that set the player is still missing; once the set is
 * complete the token yields feathers only.
 */
export function drawSticker(
  owned: string[],
  setId: number,
  roll: number,
): string | null {
  const missing: string[] = [];
  for (let slot = 0; slot < SLOTS_PER_SET; slot++) {
    const id = stickerId(setId, slot);
    if (owned.indexOf(id) === -1) {
      missing.push(id);
    }
  }
  if (missing.length === 0) {
    return null;
  }
  const i = Math.floor(Math.max(0, Math.min(0.999999, roll)) * missing.length);
  return missing[i];
}
