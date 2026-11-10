/**
 * TROPICAL preset + the single accent override (#FF4D4D) the signal game needs.
 * Style: CLAYMORPHISM.
 */
export const COLORS = {
  bgDeep: '#0D2818',
  bgMid: '#132D1E',
  surface: '#1A3A28',
  surfaceAlt: '#0F3024',
  asphalt: '#0A1F13',
  laneEdge: '#2A4A36',

  go: '#00E676',
  goDeep: '#06B257',
  goInk: '#06301C',
  amber: '#FF6D00',
  amberSoft: '#FFA04D',
  stop: '#FF4D4D',

  textPrimary: '#F2FFF7',
  textSecondary: '#9FC3AC',
  textMuted: '#6E8F7C',

  hairline: 'rgba(255,255,255,0.09)',
  hairlineBright: 'rgba(255,255,255,0.14)',
  glassLow: 'rgba(255,255,255,0.05)',
  glass: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.12)',
  headerVeil: 'rgba(0,0,0,0.32)',
  disabled: '#214A33',
} as const;

export const GRADIENTS = {
  menu: ['#132D1E', '#0D2818', '#0F3024'],
  loader: ['rgba(5,18,10,0.94)', 'rgba(13,40,24,0.97)', 'rgba(10,31,19,1)'],
  result: ['rgba(13,40,24,0.88)', 'rgba(10,31,19,0.96)'],
  go: ['#00E676', '#06B257'],
  amber: ['#FF6D00', '#D14E00'],
  loaderBar: ['#00E676', '#FF6D00'],
} as const;

export const RADIUS = {sm: 14, md: 20, lg: 26, xl: 30, pill: 999} as const;

export const SPACING = {xs: 6, sm: 10, md: 16, lg: 22, xl: 28} as const;

/** Signal colours keyed by the signal word itself. */
export const SIGNAL_COLOR = {
  GO: COLORS.go,
  WAIT: COLORS.amber,
  STOP: COLORS.stop,
} as const;

/** The 6 sticker-set tints: light/dark derivations of the three accents only. */
export const SET_TINTS = [
  '#00E676',
  '#58F0A0',
  '#FF6D00',
  '#FFA04D',
  '#FF4D4D',
  '#F2FFF7',
] as const;

export const TYPE = {
  hero: {fontSize: 34, fontWeight: '800' as const, letterSpacing: 2.5},
  title: {fontSize: 26, fontWeight: '800' as const, letterSpacing: 1.5},
  tile: {fontSize: 17, fontWeight: '800' as const},
  body: {fontSize: 15, fontWeight: '600' as const},
  caption: {fontSize: 11, fontWeight: '700' as const, letterSpacing: 2},
  number: {fontSize: 22, fontWeight: '800' as const},
};

/** Every changing number uses tabular figures so the layout never jitters. */
export const TABULAR = {fontVariant: ['tabular-nums' as const]};

/** Claymorphic surface recipe — one shared source of truth. */
export const clay = (radius = RADIUS.lg, bg: string = COLORS.surface) => ({
  backgroundColor: bg,
  borderRadius: radius,
  borderWidth: 1,
  borderColor: COLORS.hairline,
  borderTopWidth: 2,
  borderTopColor: COLORS.hairlineBright,
  shadowColor: '#000',
  shadowOpacity: 0.5,
  shadowRadius: 18,
  shadowOffset: {width: 0, height: 8},
  elevation: 10,
});
