import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import type {Signal} from '../game/types';
import {COLORS, SIGNAL_COLOR} from '../constants/theme';
import {SIGNAL_FADE_MS} from '../constants/config';

interface Props {
  state: Signal;
  height?: number;
}

/**
 * The readout the whole game is about. Word first, colour second, so the state
 * is readable without relying on colour at all.
 */
export function SignalChip({state, height = 40}: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const prev = useRef<Signal>(state);

  useEffect(() => {
    if (prev.current === state) {
      return;
    }
    prev.current = state;
    Animated.sequence([
      Animated.timing(fade, {
        toValue: 0.45,
        duration: SIGNAL_FADE_MS / 2,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: SIGNAL_FADE_MS / 2,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.06,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, pulse, state]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.chip,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: SIGNAL_COLOR[state],
          opacity: fade,
          transform: [{scale: pulse}],
        },
      ]}>
      <Text style={styles.text}>{state}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minWidth: 86,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.goInk,
    includeFontPadding: false,
  },
});

export default SignalChip;
