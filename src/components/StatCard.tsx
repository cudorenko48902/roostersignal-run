import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, RADIUS, TABULAR} from '../constants/theme';

export interface StatItem {
  key: string;
  value: string | number;
  label: string;
  accent: string;
}

interface CardProps {
  value: string | number;
  label: string;
  accent: string;
}

function isEmpty(value: string | number): boolean {
  if (typeof value === 'number') {
    return value === 0;
  }
  const v = String(value).trim();
  return v === '' || v === '0';
}

/**
 * One accent-dot card: dot, tabular number, uppercase caption. No raster icon,
 * so every pill in a row is the same shape whatever the value is. A card with
 * nothing to show renders null instead of an empty box.
 */
export function StatCard({value, label, accent}: CardProps) {
  if (isEmpty(value)) {
    return null;
  }
  return (
    <View style={styles.card}>
      <View style={[styles.dot, {backgroundColor: accent}]} />
      <Text style={[styles.value, {color: accent}]} numberOfLines={1}>
        {String(value)}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** The row renders nothing at all when fewer than two cards survive. */
export function StatRow({items}: {items: StatItem[]}) {
  const visible = items.filter(i => !isEmpty(i.value));
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map(i => (
        <View key={i.key} style={styles.slot}>
          <StatCard value={i.value} label={i.label} accent={i.accent} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 10},
  // flex on the SLOT only — the card itself takes the slot width and its own
  // intrinsic height, so the text can never collapse to zero.
  slot: {flex: 1},
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    borderTopWidth: 2,
    borderTopColor: COLORS.hairlineBright,
  },
  dot: {width: 8, height: 8, borderRadius: 4, marginBottom: 8},
  value: {
    fontSize: 22,
    fontWeight: '800',
    includeFontPadding: false,
    ...TABULAR,
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textMuted,
  },
});

export default StatCard;
