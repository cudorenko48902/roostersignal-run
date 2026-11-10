import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';
import assets from '../assets';

interface Props {
  tint: string;
  owned: boolean;
  size?: number;
  cell?: number;
}

/**
 * A collection slot. Owned = the sprite tinted with its set colour on a lit
 * cell; missing = the same sprite at 16% with a themed "?" marker, so the
 * album never shows an empty box.
 */
export function StickerBadge({tint, owned, size = 44, cell = 68}: Props) {
  return (
    <View
      style={[
        styles.cell,
        {width: cell, height: cell},
        owned
          ? {
              borderColor: tint + '99',
              backgroundColor: COLORS.surface,
              shadowColor: tint,
            }
          : null,
      ]}>
      <Image
        source={assets.sticker}
        style={{
          width: size,
          height: size,
          opacity: owned ? 1 : 0.16,
          tintColor: owned ? tint : COLORS.laneEdge,
        }}
        resizeMode="contain"
      />
      {owned ? null : <Text style={styles.missing}>?</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
  missing: {
    position: 'absolute',
    bottom: 6,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
});

export default StickerBadge;
