import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';

interface Props {
  label: string;
  hint: string;
  value: boolean;
  onChange: (next: boolean) => void;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const TRACK_W = 56;
const TRACK_H = 32;
const KNOB = 26;

/** A Settings row whose switch actually changes how the game behaves. */
export function ToggleRow({label, hint, value, onChange}: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      tension: 180,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [anim, value]);

  const knobX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, TRACK_W - KNOB - 3],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{checked: value}}
      hitSlop={HIT}
      onPress={() => onChange(!value)}
      style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.hint} numberOfLines={2}>
          {hint}
        </Text>
      </View>
      <View
        style={[
          styles.track,
          {backgroundColor: value ? COLORS.go : COLORS.laneEdge},
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.knob, {transform: [{translateX: knobX}]}]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    borderTopWidth: 2,
    borderTopColor: COLORS.hairlineBright,
  },
  texts: {flex: 1},
  label: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: COLORS.textSecondary,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: COLORS.textPrimary,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
});

export default ToggleRow;
