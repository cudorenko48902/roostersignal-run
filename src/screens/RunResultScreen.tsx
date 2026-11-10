import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {Home, RotateCcw, SkipForward} from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import ClayCard from '../components/ClayCard';
import ClayButton from '../components/ClayButton';
import {StatRow} from '../components/StatCard';
import {COLORS, GRADIENTS} from '../constants/theme';
import {BTN_PRIMARY_H, BTN_SECONDARY_H} from '../constants/config';
import type {RunResult} from '../game/types';
import {STAGE_COUNT} from '../game/stages';
import {formatFeathers} from '../game/economy';
import {setName, setOf, setTint} from '../game/stickers';
import assets from '../assets';

interface Props {
  result: RunResult;
  onAgain: () => void;
  onNextStage: () => void;
  onMenu: () => void;
}

function titleFor(r: RunResult): string {
  if (r.daily && r.outcome === 'cleared') {
    return 'DAILY SIGNAL DONE';
  }
  return r.outcome === 'cleared' ? 'KERB REACHED' : 'CAUGHT ON RED';
}

/** The mandatory result screen — a result card, never the idle game board. */
export function RunResultScreen({
  result,
  onAgain,
  onNextStage,
  onMenu,
}: Props) {
  const cleared = result.outcome === 'cleared';
  const accent = cleared ? COLORS.go : COLORS.stop;
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, {
      toValue: 1,
      tension: 90,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [pop]);

  const hasNext =
    cleared && !result.daily && result.stageIndex + 1 < STAGE_COUNT;

  return (
    <ScreenBackground
      colors={GRADIENTS.result as unknown as string[]}
      imageOpacity={0.2}
      blobs={[
        {colour: accent, size: 320, opacity: 0.1, top: 60, right: -90},
        {colour: COLORS.amber, size: 220, opacity: 0.07, bottom: -40, left: -60},
      ]}>
      <ScreenHeader
        title="RUN RESULT"
        eyebrow={result.daily ? 'DAILY MODE' : 'CHALLENGE'}
        onBack={onMenu}
      />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={{opacity: pop, transform: [{scale: pop}]}}>
          <ClayCard radius={32} style={styles.card}>
            <Text style={[styles.title, {color: accent}]}>
              {titleFor(result)}
            </Text>
            <Text style={styles.sub}>
              {`${result.stageName} · LANE ${result.lanesCrossed} OF ${result.lanes}`}
            </Text>

            {result.cleanRun ? (
              <View style={styles.cleanPill}>
                <Text style={styles.cleanText}>
                  CLEAN RUN · NEXT RUN DROPS 2x STICKERS
                </Text>
              </View>
            ) : null}

            <View style={styles.stats}>
              <StatRow
                items={[
                  {
                    key: 'feathers',
                    value: formatFeathers(result.feathers),
                    label: 'FEATHERS',
                    accent: COLORS.amber,
                  },
                  {
                    key: 'streak',
                    value: result.bestStreak,
                    label: 'BEST STREAK',
                    accent: COLORS.go,
                  },
                  {
                    key: 'stickers',
                    value: result.newStickers.length,
                    label: 'STICKERS',
                    accent: COLORS.textPrimary,
                  },
                  {
                    key: 'golden',
                    value: result.goldenHops,
                    label: 'GOLDEN HOPS',
                    accent: COLORS.amberSoft,
                  },
                ]}
              />
            </View>

            {result.newStickers.length > 0 ? (
              <View style={styles.stickerRow}>
                {result.newStickers.slice(0, 3).map(id => (
                  <View key={id} style={styles.stickerSlot}>
                    <Image
                      source={assets.sticker}
                      resizeMode="contain"
                      style={[styles.stickerImg, {tintColor: setTint(setOf(id))}]}
                    />
                    <Text style={styles.stickerName} numberOfLines={1}>
                      {setName(setOf(id))}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noSticker}>
                NO STICKERS THIS RUN. GREEN LANES HIDE THEM.
              </Text>
            )}
          </ClayCard>
        </Animated.View>

        <View style={styles.actions}>
          <ClayButton
            label="RUN AGAIN"
            Icon={RotateCcw}
            height={BTN_PRIMARY_H}
            fontSize={18}
            onPress={onAgain}
            testID="result-again"
          />
          {hasNext ? (
            <ClayButton
              label="NEXT STAGE"
              Icon={SkipForward}
              variant="amber"
              height={BTN_SECONDARY_H}
              fontSize={16}
              onPress={onNextStage}
            />
          ) : null}
          <ClayButton
            label="MENU"
            Icon={Home}
            variant="secondary"
            height={BTN_SECONDARY_H}
            fontSize={16}
            onPress={onMenu}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'center',
    gap: 18,
  },
  card: {width: '100%', padding: 22},
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  sub: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  cleanPill: {
    marginTop: 14,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,109,0,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,109,0,0.5)',
  },
  cleanText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.amber,
  },
  stats: {marginTop: 18},
  stickerRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  stickerSlot: {alignItems: 'center', width: 76},
  stickerImg: {width: 44, height: 44},
  stickerName: {
    marginTop: 6,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  noSticker: {
    marginTop: 18,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    lineHeight: 17,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  actions: {gap: 12},
});

export default RunResultScreen;
