import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {Lock} from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, {FeatherBadge} from '../components/ScreenHeader';
import ClayCard from '../components/ClayCard';
import ClayButton from '../components/ClayButton';
import {COLORS, GRADIENTS, TABULAR} from '../constants/theme';
import {BTN_PRIMARY_H} from '../constants/config';
import {STAGES, timingLine} from '../game/stages';
import {SLOTS_PER_SET, setTint, stickerId} from '../game/stickers';
import {formatFeathers} from '../game/economy';
import type {Profile} from '../game/types';

interface Props {
  profile: Profile;
  onStart: (stageIndex: number) => void;
  onBack: () => void;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** The session picker: choose a street and read its contract before running. */
export function ChallengeScreen({profile, onStart, onBack}: Props) {
  const [selected, setSelected] = useState(
    Math.max(0, Math.min(profile.unlocked - 1, STAGES.length - 1)),
  );
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shakeIndex === null) {
      return;
    }
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, {toValue: 1, duration: 55, useNativeDriver: true}),
      Animated.timing(shake, {toValue: -1, duration: 55, useNativeDriver: true}),
      Animated.timing(shake, {toValue: 1, duration: 55, useNativeDriver: true}),
      Animated.timing(shake, {toValue: 0, duration: 55, useNativeDriver: true}),
    ]).start(() => setShakeIndex(null));
  }, [shake, shakeIndex]);

  const stage = STAGES[selected];
  const locked = (i: number) => i >= profile.unlocked;
  const shakeX = shake.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-6, 0, 6],
  });

  return (
    <ScreenBackground
      colors={GRADIENTS.menu as unknown as string[]}
      imageOpacity={0.18}
      blobs={[
        {colour: COLORS.go, size: 280, opacity: 0.08, top: -60, left: -70},
        {colour: COLORS.amber, size: 220, opacity: 0.06, bottom: 120, right: -70},
      ]}>
      <ScreenHeader
        title="CHALLENGE"
        onBack={onBack}
        rightSlot={<FeatherBadge value={profile.feathers} />}
      />

      <View style={styles.body}>
        <View style={styles.grid}>
          {STAGES.map(s => {
            const isLocked = locked(s.index);
            const prog = profile.stages[s.index];
            const active = s.index === selected;
            const card = (
              <View
                style={[
                  styles.card,
                  active ? {borderColor: COLORS.go + '99'} : null,
                  isLocked ? styles.cardLocked : null,
                ]}>
                <View style={styles.cardTop}>
                  <View style={styles.disc}>
                    <Text style={styles.discText}>{s.index + 1}</Text>
                  </View>
                  {isLocked ? <Lock size={18} color={COLORS.textMuted} /> : null}
                </View>
                <Text style={styles.cardName} numberOfLines={1}>
                  {s.name}
                </Text>
                <Text style={styles.cardLanes}>{`${s.lanes} LANES`}</Text>
                <View style={styles.dots}>
                  {SLOT_INDEXES.map(slot => (
                    <View
                      key={slot}
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            profile.stickers.indexOf(
                              stickerId(s.setId, slot),
                            ) !== -1
                              ? setTint(s.setId)
                              : COLORS.laneEdge,
                        },
                      ]}
                    />
                  ))}
                </View>
                {isLocked ? (
                  <Text style={styles.lockLine}>
                    {`CLEAR STAGE ${profile.unlocked}`}
                  </Text>
                ) : prog && prog.best > 0 ? (
                  <Text style={styles.best}>
                    {`BEST ${formatFeathers(prog.best)}`}
                  </Text>
                ) : null}
              </View>
            );
            return (
              <Pressable
                key={s.index}
                accessibilityRole="button"
                accessibilityLabel={s.name}
                hitSlop={HIT}
                style={styles.cardTouch}
                onPress={() => {
                  if (isLocked) {
                    setShakeIndex(s.index);
                    return;
                  }
                  setSelected(s.index);
                }}>
                {shakeIndex === s.index ? (
                  <Animated.View
                    pointerEvents="box-none"
                    style={{transform: [{translateX: shakeX}]}}>
                    {card}
                  </Animated.View>
                ) : (
                  card
                )}
              </Pressable>
            );
          })}
        </View>

        <ClayCard radius={24} style={styles.footer}>
          <Text style={styles.footerTitle} numberOfLines={1}>
            {stage.name}
          </Text>
          <Text style={styles.footerTiming}>{timingLine(stage)}</Text>
          <Text style={styles.footerHint} numberOfLines={2}>
            {profile.unlocked <= 1
              ? 'STAGE 1 IS OPEN. CLEAR IT TO UNLOCK MARKET STREET.'
              : `${stage.tokens} STICKER TOKENS SIT ON THE SAFE LANES.`}
          </Text>
          <ClayButton
            label="START RUN"
            height={BTN_PRIMARY_H}
            fontSize={18}
            plate
            onPress={() => onStart(selected)}
          />
        </ClayCard>
      </View>
    </ScreenBackground>
  );
}

const SLOT_INDEXES = Array.from({length: SLOTS_PER_SET}, (_, i) => i);

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardTouch: {width: '47.5%'},
  card: {
    width: '100%',
    height: 128,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    borderTopWidth: 2,
    borderTopColor: COLORS.hairlineBright,
  },
  cardLocked: {opacity: 0.45},
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disc: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  discText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    ...TABULAR,
  },
  cardName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.textPrimary,
  },
  cardLanes: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
  dots: {flexDirection: 'row', gap: 6, marginTop: 8},
  dot: {width: 10, height: 10, borderRadius: 5},
  best: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.go,
    ...TABULAR,
  },
  lockLine: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.amber,
  },
  footer: {marginTop: 16, padding: 16},
  footerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  footerTiming: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.go,
  },
  footerHint: {
    marginTop: 8,
    marginBottom: 14,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    lineHeight: 16,
    color: COLORS.textSecondary,
  },
});

export default ChallengeScreen;
