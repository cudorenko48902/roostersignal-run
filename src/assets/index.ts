/**
 * The ONLY module that touches assets/*.png.
 * The file names are a fixed contract from the art pipeline — never invent a
 * new one, the file would not exist and the bundler would fail at build time.
 */
export const assets = {
  bg: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  rooster: require('../../assets/sprite_1.png'),
  signalPost: require('../../assets/sprite_2.png'),
  car: require('../../assets/sprite_3.png'),
  sticker: require('../../assets/sprite_4.png'),
  kerbDecor: require('../../assets/sprite_5.png'),
  plateRect: require('../../assets/button_rect.png'),
  plateRound: require('../../assets/button_round.png'),
};

export type AssetKey = keyof typeof assets;
export default assets;
