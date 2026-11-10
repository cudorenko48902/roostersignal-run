import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {COLORS} from '../constants/theme';

interface Props {
  value: number;
  max: number;
  accent: string;
  height?: number;
}

/**
 * The ladder bar. Width is NOT a native-driver property, so this animation is
 * explicitly useNativeDriver:false.
 */
export function ProgressTrack({value, max, accent, height = 8}: Props) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const w = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(w, {
      toValue: ratio,
      duration: 520,
      useNativeDriver: false,
    }).start();
  }, [ratio, w]);

  const width = w.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, {height, borderRadius: height / 2}]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          {width, backgroundColor: accent, borderRadius: height / 2},
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: COLORS.laneEdge,
    overflow: 'hidden',
  },
  fill: {height: '100%'},
});

export default ProgressTrack;
