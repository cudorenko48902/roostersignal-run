import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, {FeatherBadge} from '../components/ScreenHeader';
import ClayCard from '../components/ClayCard';
import ProgressTrack from '../components/ProgressTrack';
import EmptyState from '../components/EmptyState';
import {StatRow} from '../components/StatCard';
import {COLORS, GRADIENTS, TABULAR} from '../constants/theme';
import {STAGES, STAGE_COUNT} from '../game/stages';
import {TOTAL_STICKERS} from '../game/stickers';
import {dateKey, last7Days} from '../game/daily';
import {formatFeathers} from '../game/economy';
import type {Profile} from '../game/types';

interface Props {
  profile: Profile;
  onBack: () => void;
}

/** Stages, streaks and lifetime totals, read straight from the saved profile. */
export function ProgressScreen({profile, onBack}: Props) {
  const cleared = STAGES.filter(s => profile.stages[s.index].cleared).length;
  const attempts = STAGES.reduce(
    (n, s) => n + profile.stages[s.index].attempts,
    0,
  );
  const today = dateKey();
  const week = last7Days(profile.daily, today);
  const visibleStages = attempts === 0 ? STAGES.slice(0, 1) : STAGES;

  return (
    <ScreenBackground
      colors={GRADIENTS.menu as unknown as string[]}
      imageOpacity={0.18}
      blobs={[
        {colour: COLORS.go, size: 260, opacity: 0.08, top: 80, right: -80},
        {colour: COLORS.amber, size: 200, opacity: 0.06, bottom: -40, left: -60},
      ]}>
      <ScreenHeader
        title="PROGRESS"
        onBack={onBack}
        rightSlot={<FeatherBadge value={profile.feathers} />}
      />

      <View style={styles.body}>
        <StatRow
          items={[
            {
              key: 'stages',
              value: `${cleared}/${STAGE_COUNT}`,
              label: 'STAGES',
              accent: COLORS.go,
            },
            {
              key: 'streak',
              value: profile.bestStreak,
              label: 'BEST STREAK',
              accent: COLORS.amber,
            },
            {
              key: 'stickers',
              value: `${profile.stickers.length}/${TOTAL_STICKERS}`,
              label: 'STICKERS',
              accent: COLORS.textPrimary,
            },
          ]}
        />

        <ClayCard radius={24} padded={false} style={styles.ladder}>
          {attempts === 0 ? (
            <EmptyState
              title="NO RUNS YET"
              body="TAP PLAY TO CROSS YOUR FIRST STREET."
            />
          ) : null}
          {visibleStages.map(s => {
            const prog = profile.stages[s.index];
            const locked = s.index >= profile.unlocked;
            const value = prog.cleared ? s.lanes : Math.min(prog.attempts, s.lanes);
            return (
              <View key={s.index} style={styles.row}>
                <View style={styles.rowDisc}>
                  <Text style={styles.rowDiscText}>{s.index + 1}</Text>
                </View>
                <View style={styles.rowMain}>
                  <View style={styles.rowTop}>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {s.name}
                    </Text>
                    {prog.best > 0 ? (
                      <Text style={styles.rowBest}>
                        {formatFeathers(prog.best)}
                      </Text>
                    ) : null}
                  </View>
                  <ProgressTrack
                    value={locked ? 0 : value}
                    max={s.lanes}
                    accent={prog.cleared ? COLORS.go : COLORS.amber}
                    height={6}
                  />
                </View>
              </View>
            );
          })}
        </ClayCard>

        <ClayCard radius={24} style={styles.daily}>
          <View style={styles.dailyTop}>
            <View>
              <Text style={styles.dailyCaption}>DAILY STREAK</Text>
              <Text style={styles.dailyValue}>{profile.daily.streak}</Text>
            </View>
            <View style={styles.weekDots}>
              {week.map((played, i) => (
                <View
                  key={String(i)}
                  style={[
                    styles.weekDot,
                    {
                      backgroundColor: played ? COLORS.go : COLORS.laneEdge,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </ClayCard>

        <Text style={styles.totals}>
          {`CROSSINGS ${profile.totals.crossings} · GOLDEN HOPS ${profile.totals.goldenHops} · CLEAN RUNS ${profile.totals.cleanRuns}`}
        </Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20, gap: 12},
  ladder: {paddingVertical: 8, paddingHorizontal: 12},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
  },
  rowDisc: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  rowDiscText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    ...TABULAR,
  },
  rowMain: {flex: 1},
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rowName: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.textPrimary,
  },
  rowBest: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.go,
    ...TABULAR,
  },
  daily: {padding: 16},
  dailyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyCaption: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textMuted,
  },
  dailyValue: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.amber,
    ...TABULAR,
  },
  weekDots: {flexDirection: 'row', gap: 8},
  weekDot: {width: 14, height: 14, borderRadius: 7},
  totals: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ProgressScreen;
