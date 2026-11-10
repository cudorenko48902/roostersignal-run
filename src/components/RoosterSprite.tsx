import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import assets from '../assets';

interface Props {
  size: number;
  state?: 'idle' | 'hop' | 'tumble';
  /** 0..1 tumble progress driven by the run engine */
  tumbleValue?: Animated.Value;
  bob?: boolean;
}

/**
 * Aspect-preserving Image on sprite_1 — never stretched, never scaled inside an
 * overflow:hidden wrapper.
 */
export function RoosterSprite({size, tumbleValue, bob = true}: Props) {
  const idle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!bob) {
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idle, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(idle, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, idle]);

  const bobY = idle.interpolate({inputRange: [0, 1], outputRange: [0, -4]});
  const rotate = tumbleValue
    ? tumbleValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '24deg'],
      })
    : '0deg';
  const opacity = tumbleValue
    ? tumbleValue.interpolate({inputRange: [0, 1], outputRange: [1, 0.35]})
    : 1;

  return (
    <Animated.Image
      source={assets.rooster}
      resizeMode="contain"
      style={{
        width: size,
        height: size,
        opacity,
        transform: [{translateY: bobY}, {rotate}],
      }}
    />
  );
}

export default RoosterSprite;
