import {Dimensions} from 'react-native';

const win = Dimensions.get('window');

export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/**
 * Splash hold. EXACTLY 8000 ms, timer driven — never shorter, and there is no
 * "leave early when initialisation is ready" path (the QA capture needs 4-6 s
 * to reach its first frame).
 */
export const LOADER_DURATION_MS = 8000;
export const LOADER_BAR_MS = 7600;

/** Header geometry — status bar stays visible, so every screen pads 44 px. */
export const HEADER_PAD_TOP = 44;
export const HEADER_H = 72;

/** Board geometry (overflow must be 0). */
export const BOARD_PAD = 8;
export const BOARD_BORDER = 3;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 11
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const LANE_H_MIN = 56;
export const LANE_H_MAX = 96;

/** Timings. */
export const HOP_MS = 220;
export const CAR_MS = 520;
export const STICKER_POP_MS = 320;
export const SIGNAL_FADE_MS = 180;
export const SCREEN_FADE_MS = 260;
export const CLEAR_FLASH_MS = 600;
export const GOLDEN_WINDOW_MS = 400;
export const REACTION_ALLOWANCE_MS = 450;
export const HINT_VISIBLE_MS = 6000;

/** Press feedback springs. */
export const PRESS_SPRING = {tension: 180, friction: 12};
export const DISC_SPRING = {tension: 70, friction: 9};

/** Button heights. */
export const BTN_PRIMARY_H = 60;
export const BTN_SECONDARY_H = 52;
export const GO_H = 72;
export const GO_H_BIG = 88;

/** Generator. */
export const MAX_LAYOUT_RETRIES = 20;

/** Economy. */
export const FEATHERS_SAFE = 10;
export const FEATHERS_GOLDEN = 25;
export const FEATHERS_STICKER = 50;
export const CLEAR_BASE = 100;
export const CLEAR_PER_LANE = 25;
export const MAX_STREAK_MULT = 5;
