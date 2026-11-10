import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../constants/theme';
import assets from '../assets';

interface Blob {
  colour: string;
  size: number;
  opacity: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface Props {
  colors: string[];
  /** how much of bg_game shows through the wash */
  imageOpacity?: number;
  blobs?: Blob[];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * bg_game is the ONE background image in the app; screens are told apart by
 * their gradient wash, their image opacity and their decor blobs. Four depth
 * layers on every screen: image, wash, blobs, content.
 */
export function ScreenBackground({
  colors,
  imageOpacity = 0.22,
  blobs = [],
  style,
  children,
}: Props) {
  return (
    <View style={[styles.root, style]}>
      <ImageBackground
        source={assets.bg}
        resizeMode="cover"
        imageStyle={{opacity: imageOpacity}}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={colors}
        start={{x: 0.1, y: 0}}
        end={{x: 0.9, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      {blobs.map((b, i) => (
        <View
          key={String(i)}
          pointerEvents="none"
          style={[
            styles.blob,
            {
              width: b.size,
              height: b.size,
              borderRadius: b.size / 2,
              backgroundColor: b.colour,
              opacity: b.opacity,
              top: b.top,
              bottom: b.bottom,
              left: b.left,
              right: b.right,
            },
          ]}
        />
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.bgDeep},
  blob: {position: 'absolute'},
});

export default ScreenBackground;
