import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/theme';
import ClayCard from './ClayCard';
import ClayButton from './ClayButton';
import {BTN_SECONDARY_H} from '../constants/config';

interface Props {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Two-step destructive action — a single tap never destroys anything. */
export function ConfirmPanel({
  title,
  body,
  confirmLabel,
  cancelLabel = 'CANCEL',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <View style={styles.scrim}>
      <ClayCard radius={28} style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.actions}>
          <View style={styles.half}>
            <ClayButton
              label={cancelLabel}
              variant="secondary"
              height={BTN_SECONDARY_H}
              fontSize={15}
              onPress={onCancel}
            />
          </View>
          <View style={styles.half}>
            <ClayButton
              label={confirmLabel}
              variant="danger"
              height={BTN_SECONDARY_H}
              fontSize={15}
              onPress={onConfirm}
            />
          </View>
        </View>
      </ClayCard>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,18,10,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {width: '100%', padding: 22},
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.textPrimary,
  },
  body: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
  actions: {flexDirection: 'row', gap: 12, marginTop: 20},
  half: {flex: 1},
});

export default ConfirmPanel;
