import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BarChart3} from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, {FeatherBadge} from '../components/ScreenHeader';
import ClayCard from '../components/ClayCard';
import ClayButton from '../components/ClayButton';
import {StatRow} from '../components/StatCard';
import {COLORS, GRADIENTS, TABULAR} from '../constants/theme';
import {BTN_PRIMARY_H, BTN_SECONDARY_H} from '../constants/config';
import {
  dailyStage,
  dateKey,
  formatCountdown,
  isDailyDone,
  msUntilTomorrow,
  prettyDate,
} from '../game/daily';
import {timingLine} from '../game/stages';
import {setName} from '../game/stickers';
import {formatFeathers} from '../game/economy';
import type {Profile, StageDef} from '../game/types';

interface Props {
  profile: Profile;
  onStartDaily: () => void;
  onProgress: () => void;
  onBack: () => void;
}

/** One date-seeded run per day: ready, done and error states all covered. */
export function DailyModeScreen({
  profile,
  onStartDaily,
  onProgress,
  onBack,
}: Props) {
  const today = useMemo(() => dateKey(), []);
  const [left, setLeft] = useState(() => msUntilTomorrow());

  useEffect(() => {
    const id = setInterval(() => setLeft(msUntilTomorrow()), 1000);
    return () => clearInterval(id);
  }, []);

  const done = isDailyDone(profile.daily, today);
  let stage: StageDef | null = null;
  let failed = false;
  try {
    stage = dailyStage(today);
  } catch (e) {
    failed = true;
  }

  return (
    <ScreenBackground
      colors={GRADIENTS.menu as unknown as string[]}
      imageOpacity={0.18}
      blobs={[
        {colour: COLORS.amber, size: 300, opacity: 0.09, top: -60, right: -80},
        {colour: COLORS.go, size: 220, opacity: 0.06, bottom: 80, left: -70},
      ]}>
      <ScreenHeader
        title="DAILY MODE"
        onBack={onBack}
        rightSlot={<FeatherBadge value={profile.feathers} />}
      />

      <View style={styles.body}>
        <Text style={styles.date}>{prettyDate(today)}</Text>

        {failed || !stage ? (
          <ClayCard radius={28} style={styles.card}>
            <Text style={styles.cardTitle}>DAILY SIGNAL UNAVAILABLE</Text>
            <Text style={styles.cardBody}>
              STAGE RESET TO A SAFE LAYOUT. THE RUN STILL COUNTS.
            </Text>
            <ClayButton
              label="START DAILY"
              height={BTN_PRIMARY_H}
              fontSize={18}
              plate
              onPress={onStartDaily}
            />
          </ClayCard>
        ) : done ? (
          <ClayCard radius={28} style={styles.card}>
            <Text style={styles.cardTitle}>TODAY IS CROSSED</Text>
            <Text style={styles.cardBody}>
              {`${formatFeathers(profile.daily.lastScore)} FEATHERS · STREAK x${profile.daily.lastStreakValue}`}
            </Text>
            <View style={styles.stats}>
              <StatRow
                items={[
                  {
                    key: 'streak',
                    value: profile.daily.streak,
                    label: 'DAILY STREAK',
                    accent: COLORS.go,
                  },
                  {
                    key: 'score',
                    value: formatFeathers(profile.daily.lastScore),
                    label: 'TODAY',
                    accent: COLORS.amber,
                  },
                ]}
              />
            </View>
            <Text style={styles.countdownCaption}>NEXT SIGNAL IN</Text>
            <Text style={styles.countdown}>{formatCountdown(left)}</Text>
            <View style={styles.actions}>
              <ClayButton
                label="COME BACK TOMORROW"
                height={BTN_PRIMARY_H}
                fontSize={15}
                disabled
                onPress={onStartDaily}
              />
              <ClayButton
                label="PROGRESS"
                Icon={BarChart3}
                variant="secondary"
                height={BTN_SECONDARY_H}
                fontSize={15}
                onPress={onProgress}
              />
            </View>
          </ClayCard>
        ) : (
          <ClayCard radius={28} style={styles.card}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {stage.name}
            </Text>
            <Text style={styles.cardTiming}>{timingLine(stage)}</Text>
            <View style={styles.stats}>
              <StatRow
                items={[
                  {
                    key: 'lanes',
                    value: stage.lanes,
                    label: 'LANES',
                    accent: COLORS.go,
                  },
                  {
                    key: 'tokens',
                    value: stage.tokens,
                    label: 'TOKENS',
                    accent: COLORS.amber,
                  },
                  {
                    key: 'streak',
                    value: profile.daily.streak,
                    label: 'DAILY STREAK',
                    accent: COLORS.textPrimary,
                  },
                ]}
              />
            </View>
            <Text style={styles.setLine}>
              {`SET IN PLAY · ${setName(stage.setId)}`}
            </Text>
            <Text style={styles.oneRun}>ONE RUN PER DAY</Text>
            <ClayButton
              label="START DAILY"
              height={BTN_PRIMARY_H}
              fontSize={18}
              plate
              onPress={onStartDaily}
            />
          </ClayCard>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 20, paddingTop: 14, justifyContent: 'center'},
  date: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
    ...TABULAR,
  },
  card: {width: '100%', padding: 20},
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  cardTiming: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.go,
    textAlign: 'center',
  },
  cardBody: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stats: {marginTop: 18, marginBottom: 14},
  setLine: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.amber,
    textAlign: 'center',
  },
  oneRun: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  countdownCaption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  countdown: {
    marginTop: 4,
    marginBottom: 18,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.textPrimary,
    textAlign: 'center',
    ...TABULAR,
  },
  actions: {gap: 12},
});

export default DailyModeScreen;
