import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {COLORS} from '../constants/theme';

interface Props {
  /** 0..1 — how much of the current signal window is still left */
  progress: number;
  colour: string;
  size?: number;
  thickness?: number;
}

/** The kerb read: a thin ring that empties as the lane ahead runs out of time. */
export function CountdownRing({
  progress,
  colour,
  size = 34,
  thickness = 3,
}: Props) {
  const p = Math.max(0, Math.min(1, progress));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={[styles.wrap, {width: size, height: size}]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={COLORS.laneEdge}
          strokeWidth={thickness}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colour}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c * p} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', justifyContent: 'center'},
});

export default CountdownRing;
