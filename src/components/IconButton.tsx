import React from 'react';
import {Animated, Image, Pressable, StyleSheet} from 'react-native';
import type {ImageSourcePropType, StyleProp, ViewStyle} from 'react-native';
import {usePressScale} from '../hooks/usePressScale';
import assets from '../assets';

interface Props {
  source: ImageSourcePropType;
  onPress: () => void;
  size?: number;
  glyph?: number;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/**
 * Round navigation button: the button_round plate from the art contract with a
 * contract glyph (icon_home / icon_pause) on top, both aspect-preserved.
 * Pressable outside, Animated.View inside.
 */
export function IconButton({
  source,
  onPress,
  size = 44,
  glyph = 22,
  accessibilityLabel,
  style,
}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.92);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[{width: size, height: size}, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          {width: size, height: size, borderRadius: size / 2},
          {transform: [{scale}]},
        ]}>
        <Image
          source={assets.plateRound}
          style={[StyleSheet.absoluteFill, {borderRadius: size / 2}]}
          resizeMode="contain"
        />
        <Image
          source={source}
          style={{width: glyph, height: glyph}}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
});

export default IconButton;
