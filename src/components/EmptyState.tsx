import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/theme';

interface Props {
  title: string;
  body?: string;
}

/** Any list or panel that can be empty shows this, never a blank area. */
export function EmptyState({title, body}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <View style={[styles.dot, {backgroundColor: COLORS.stop}]} />
        <View style={[styles.dot, {backgroundColor: COLORS.amber}]} />
        <View style={[styles.dot, {backgroundColor: COLORS.go}]} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  mark: {flexDirection: 'row', gap: 8, marginBottom: 14},
  dot: {width: 12, height: 12, borderRadius: 6, opacity: 0.8},
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  body: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyState;
