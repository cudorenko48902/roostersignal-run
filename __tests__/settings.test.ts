import {defaultProfile} from '../src/game/storage';
import {GO_H, GO_H_BIG} from '../src/constants/config';
import type {GameSettings, Profile} from '../src/game/types';

function apply(p: Profile, patch: Partial<GameSettings>): Profile {
  return {...p, settings: {...p.settings, ...patch}};
}

describe('settings: colour-blind signals', () => {
  it('is off by default and persists once switched on', () => {
    const p = defaultProfile();
    expect(p.settings.colourBlind).toBe(false);
    expect(apply(p, {colourBlind: true}).settings.colourBlind).toBe(true);
  });
});

describe('settings: big tap zone', () => {
  it('switches the GO button between 72 and 88 px', () => {
    const p = defaultProfile();
    expect(GO_H).toBe(72);
    expect(GO_H_BIG).toBe(88);
    const height = (s: Profile) => (s.settings.bigTap ? GO_H_BIG : GO_H);
    expect(height(p)).toBe(72);
    expect(height(apply(p, {bigTap: true}))).toBe(88);
  });
});

describe('settings: reduced motion', () => {
  it('is persisted and leaves the other options untouched', () => {
    const p = apply(defaultProfile(), {reducedMotion: true});
    expect(p.settings.reducedMotion).toBe(true);
    expect(p.settings.hopAssist).toBe(false);
    expect(p.settings.bigTap).toBe(false);
  });
});

describe('settings: hop assist', () => {
  it('makes the countdown ring permanent rather than press-only', () => {
    const p = defaultProfile();
    const ringVisible = (s: Profile, holding: boolean) =>
      holding || s.settings.hopAssist;
    expect(ringVisible(p, false)).toBe(false);
    expect(ringVisible(p, true)).toBe(true);
    expect(ringVisible(apply(p, {hopAssist: true}), false)).toBe(true);
  });
});

describe('settings: reset progress', () => {
  it('needs the confirm step — cancelling leaves the profile untouched', () => {
    const played = {
      ...defaultProfile(),
      feathers: 1240,
      stickers: ['0-1'],
      unlocked: 3,
    };
    const cancelled = played;
    expect(cancelled.feathers).toBe(1240);
    const confirmed = defaultProfile();
    expect(confirmed.feathers).toBe(0);
    expect(confirmed.stickers).toEqual([]);
    expect(confirmed.unlocked).toBe(1);
  });
});
