import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, RADIUS, TABULAR} from '../constants/theme';
import {HEADER_H, HEADER_PAD_TOP} from '../constants/config';
import {usePressScale} from '../hooks/usePressScale';
import {formatFeathers} from '../game/economy';
import assets from '../assets';

interface Props {
  title: string;
  eyebrow?: string;
  /** shown as the MENU back pill when provided */
  onBack?: () => void;
  backLabel?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  centered?: boolean;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const PILL_ICON = 24;

/** The MENU back pill — icon_home 24 px + real text, lineHeight 24, gap 10. */
export function BackPill({
  onPress,
  label = 'MENU',
}: {
  onPress: () => void;
  label?: string;
}) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.94);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.pillTouch}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.pill, {transform: [{scale}]}]}>
        <Image
          source={assets.iconHome}
          style={styles.pillIcon}
          resizeMode="contain"
        />
        <Text style={styles.pillLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** The feather balance badge used on the right of most headers. */
export function FeatherBadge({value}: {value: number}) {
  return (
    <View style={styles.badge}>
      <View style={styles.badgeDot} />
      <Text style={styles.badgeText}>{formatFeathers(value)}</Text>
    </View>
  );
}

/**
 * One header for every screen with a title. Different leftSlot / rightSlot per
 * screen, identical geometry everywhere: paddingTop 44 so the status bar stays
 * visible, h 72, a dark veil and a bottom hairline.
 */
export function ScreenHeader({
  title,
  eyebrow,
  onBack,
  backLabel,
  leftSlot,
  rightSlot,
  centered = true,
}: Props) {
  const left = onBack ? (
    <BackPill onPress={onBack} label={backLabel} />
  ) : (
    leftSlot
  );
  return (
    <View style={styles.header}>
      <View style={[styles.side, left ? null : styles.sideCollapsed]}>
        {left}
      </View>
      <View style={[styles.titleWrap, centered ? null : styles.titleLeft]}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_PAD_TOP,
    height: HEADER_H + HEADER_PAD_TOP,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.headerVeil,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  side: {
    width: 108,
    height: HEADER_H,
    justifyContent: 'center',
  },
  sideRight: {alignItems: 'flex-end'},
  sideCollapsed: {width: 0},
  titleWrap: {
    flex: 1,
    height: HEADER_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleLeft: {alignItems: 'flex-start'},
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.textPrimary,
  },
  pillTouch: {width: 108, height: 44},
  pill: {
    width: 108,
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderTopWidth: 2,
    borderTopColor: COLORS.hairlineBright,
  },
  pillIcon: {width: PILL_ICON, height: PILL_ICON},
  pillLabel: {
    fontSize: 14,
    lineHeight: PILL_ICON,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.textPrimary,
    includeFontPadding: false,
  },
  badge: {
    height: 36,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  badgeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.amber,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    ...TABULAR,
  },
});

export default ScreenHeader;
