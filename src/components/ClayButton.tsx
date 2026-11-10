import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, GRADIENTS, RADIUS} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';
import assets from '../assets';

export type ButtonVariant =
  | 'primary'
  | 'amber'
  | 'secondary'
  | 'danger'
  | 'ghost';

/** Icon geometry is fixed: 24 px box, label lineHeight 24, gap 10. Everywhere. */
export const ICON_SIZE = 24;
export const ICON_GAP = 10;

export interface LucideIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

interface Props {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  height?: number;
  width?: number | string;
  disabled?: boolean;
  Icon?: React.ComponentType<LucideIconProps>;
  /** 24 or 28 only — the label lineHeight always matches it */
  iconSize?: 24 | 28;
  /** optional claymorphic plate texture from the art contract */
  plate?: boolean;
  fontSize?: number;
  letterSpacing?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

function inkFor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) {
    return COLORS.textMuted;
  }
  if (variant === 'primary' || variant === 'amber') {
    return COLORS.goInk;
  }
  if (variant === 'danger') {
    return COLORS.stop;
  }
  return COLORS.textPrimary;
}

/**
 * The only button in the app. Pressable is the PARENT and drives the scale on
 * a CHILD Animated.View (transform only, native driver) — the wrapper never
 * sits above the Pressable, so a tap can never be eaten on Android release.
 */
export function ClayButton({
  label,
  onPress,
  variant = 'primary',
  height = 60,
  width = '100%',
  disabled = false,
  Icon,
  iconSize = ICON_SIZE,
  plate = false,
  fontSize = 17,
  letterSpacing = 2,
  style,
  testID,
}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.96);
  const ink = inkFor(variant, disabled);
  const gradient = (
    variant === 'amber' ? GRADIENTS.amber : GRADIENTS.go
  ) as unknown as string[];
  const useGradient =
    !disabled && (variant === 'primary' || variant === 'amber');
  const accentShadow =
    variant === 'amber' ? COLORS.amber : COLORS.go;

  const body = (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.body,
        {
          height,
          borderRadius: height >= 60 ? RADIUS.lg : RADIUS.md,
          transform: [{scale}],
        },
        !useGradient && !disabled ? surfaceFor(variant) : null,
        disabled ? styles.disabled : null,
        !disabled && useGradient
          ? {
              shadowColor: accentShadow,
              shadowOpacity: 0.45,
              shadowRadius: 18,
              shadowOffset: {width: 0, height: 8},
              elevation: 12,
            }
          : null,
      ]}>
      {useGradient ? (
        <LinearGradient
          colors={gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            StyleSheet.absoluteFill,
            {borderRadius: height >= 60 ? RADIUS.lg : RADIUS.md},
          ]}
        />
      ) : null}
      {plate && !disabled ? (
        <Image
          source={assets.plateRect}
          style={[
            StyleSheet.absoluteFill,
            {borderRadius: height >= 60 ? RADIUS.lg : RADIUS.md, opacity: 0.35},
          ]}
          resizeMode="cover"
        />
      ) : null}
      <View style={styles.row}>
        {Icon ? <Icon size={iconSize} color={ink} strokeWidth={2.4} /> : null}
        <Text
          style={[
            styles.label,
            {color: ink, fontSize, letterSpacing, lineHeight: iconSize},
          ]}
          numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      style={[{width: width as number, height}, style]}>
      {body}
    </Pressable>
  );
}

function surfaceFor(variant: ButtonVariant) {
  if (variant === 'danger') {
    return {
      backgroundColor: 'rgba(255,77,77,0.10)',
      borderWidth: 1,
      borderColor: 'rgba(255,77,77,0.45)',
    };
  }
  if (variant === 'ghost') {
    return {
      backgroundColor: COLORS.glassLow,
      borderWidth: 1,
      borderColor: COLORS.glassBorder,
    };
  }
  return {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderTopWidth: 2,
    borderTopColor: COLORS.hairlineBright,
  };
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ICON_GAP,
  },
  label: {
    fontWeight: '800',
    lineHeight: ICON_SIZE,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  disabled: {
    backgroundColor: COLORS.disabled,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
});

export default ClayButton;
