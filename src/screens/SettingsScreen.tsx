import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import ToggleRow from '../components/ToggleRow';
import ClayButton from '../components/ClayButton';
import ConfirmPanel from '../components/ConfirmPanel';
import {COLORS, GRADIENTS} from '../constants/theme';
import {BTN_SECONDARY_H} from '../constants/config';
import {OFFLINE_NOTICE} from '../game/economy';
import type {GameSettings} from '../game/types';

interface Props {
  settings: GameSettings;
  onChange: (patch: Partial<GameSettings>) => void;
  onReset: () => void;
  onBack: () => void;
}

/**
 * Four options that each change how the game actually behaves, plus a two-step
 * reset. No audio controls — the app has no sound, so a volume slider would be
 * a dead control.
 */
export function SettingsScreen({
  settings,
  onChange,
  onReset,
  onBack,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <ScreenBackground
      colors={GRADIENTS.menu as unknown as string[]}
      imageOpacity={0.18}
      blobs={[
        {colour: COLORS.go, size: 260, opacity: 0.07, top: 100, left: -80},
        {colour: COLORS.amber, size: 220, opacity: 0.06, bottom: -40, right: -70},
      ]}>
      <ScreenHeader title="SETTINGS" onBack={onBack} />

      <View style={styles.body}>
        <ToggleRow
          label="COLOUR-BLIND SIGNALS"
          hint="Adds G / W / S letters to every lane lamp."
          value={settings.colourBlind}
          onChange={v => onChange({colourBlind: v})}
        />
        <ToggleRow
          label="BIG TAP ZONE"
          hint="GO button grows from 72 to 88 px."
          value={settings.bigTap}
          onChange={v => onChange({bigTap: v})}
        />
        <ToggleRow
          label="REDUCED MOTION"
          hint="Turns off the car dash and the screen shake; every state change still resolves."
          value={settings.reducedMotion}
          onChange={v => onChange({reducedMotion: v})}
        />
        <ToggleRow
          label="HOP ASSIST"
          hint="Shows the countdown ring on the lane ahead at all times, not only after WAIT."
          value={settings.hopAssist}
          onChange={v => onChange({hopAssist: v})}
        />

        <View style={styles.spacer} />

        <Text style={styles.resetHint}>
          RESET CLEARS STAGES, STICKERS AND THE DAILY STREAK.
        </Text>
        <ClayButton
          label="RESET PROGRESS"
          variant="danger"
          height={BTN_SECONDARY_H}
          fontSize={15}
          onPress={() => setConfirming(true)}
        />

        <Text style={styles.footer}>{OFFLINE_NOTICE}</Text>
      </View>

      {confirming ? (
        <ConfirmPanel
          title="RESET PROGRESS?"
          body="Every cleared stage, every sticker and the daily streak go back to zero. This cannot be undone."
          confirmLabel="RESET"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onReset();
          }}
        />
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20, gap: 10},
  spacer: {flex: 1, minHeight: 10},
  resetHint: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  footer: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});

export default SettingsScreen;
