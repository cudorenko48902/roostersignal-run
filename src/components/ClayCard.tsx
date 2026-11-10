import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';

type Tone = 'surface' | 'alt' | 'dark';

interface Props {
  tone?: Tone;
  radius?: number;
  padded?: boolean;
  /** when set, the border picks up this accent at 45% */
  accent?: string | null;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const TONE_BG: Record<Tone, string> = {
  surface: COLORS.surface,
  alt: COLORS.surfaceAlt,
  dark: COLORS.asphalt,
};

/**
 * The one claymorphic surface recipe for the whole app: soft body, 1 px
 * hairline, a brighter 2 px top edge (the inner light) and a deep outer shadow.
 */
export function ClayCard({
  tone = 'surface',
  radius = RADIUS.lg,
  padded = true,
  accent = null,
  style,
  children,
}: Props) {
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: TONE_BG[tone],
          borderRadius: radius,
          padding: padded ? 16 : 0,
        },
        accent ? {borderColor: accent + '73'} : null,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: COLORS.hairline,
    borderTopWidth: 2,
    borderTopColor: COLORS.hairlineBright,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 10,
  },
});

export default ClayCard;
