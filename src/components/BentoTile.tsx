import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';
import type {LucideIconProps} from './ClayButton';

interface Props {
  Icon: React.ComponentType<LucideIconProps>;
  label: string;
  sub?: string | null;
  accent: string;
  height: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const TILE_ICON = 24;

/** One Menu bento cell: clay surface, accent icon, label and a live sub-line. */
export function BentoTile({
  Icon,
  label,
  sub,
  accent,
  height,
  onPress,
  style,
}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.96);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[{height}, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.tile, {height, transform: [{scale}]}]}>
        <View style={[styles.iconWrap, {backgroundColor: accent + '22'}]}>
          <Icon size={TILE_ICON} color={accent} strokeWidth={2.2} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {sub ? (
          <Text style={styles.sub} numberOfLines={1}>
            {sub}
          </Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    borderRadius: RADIUS.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    borderTopWidth: 2,
    borderTopColor: COLORS.hairlineBright,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  sub: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
});

export default BentoTile;
