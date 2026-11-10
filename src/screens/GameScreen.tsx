import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import IconButton from '../components/IconButton';
import ClayButton from '../components/ClayButton';
import ClayCard from '../components/ClayCard';
import SignalChip from '../components/SignalChip';
import RoadBoard from '../components/RoadBoard';
import CountdownRing from '../components/CountdownRing';
import {COLORS, GRADIENTS, SIGNAL_COLOR, TABULAR} from '../constants/theme';
import {
  BOARD_FRAME,
  BOARD_MAX_W,
  BTN_SECONDARY_H,
  GO_H,
  GO_H_BIG,
  LANE_H_MAX,
} from '../constants/config';
import type {
  GameSettings,
  RunResult,
  Signal,
  StageLayout,
} from '../game/types';
import {signalAt, windowProgress, windowRemaining} from '../game/signal';
import {formatFeathers} from '../game/economy';
import useSignalClock from '../hooks/useSignalClock';
import useRunEngine from '../hooks/useRunEngine';
import assets from '../assets';

interface Props {
  layout: StageLayout;
  settings: GameSettings;
  ownedStickers: string[];
  daily: boolean;
  onGameOver: (result: RunResult) => void;
  onExit: () => void;
  onRestart: () => void;
}

const PEEK_MS = 1500;

/** G3 Split Panel: header, flexible board, thin stat strip, controls block. */
export function GameScreen({
  layout,
  settings,
  ownedStickers,
  daily,
  onGameOver,
  onExit,
  onRestart,
}: Props) {
  const stage = layout.stage;
  const [paused, setPaused] = useState(false);
  const [peek, setPeek] = useState(false);
  const [areaH, setAreaH] = useState(0);
  const peekTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {t, tRef} = useSignalClock(!paused);
  const engine = useRunEngine({
    layout,
    settings,
    ownedStickers,
    tRef,
    daily,
    onFinish: onGameOver,
  });

  const rows = stage.lanes + 2;
  const laneH = useMemo(() => {
    if (areaH <= 0) {
      return 56;
    }
    const raw = Math.floor((areaH - 16 - 2 * BOARD_FRAME) / rows);
    return Math.max(34, Math.min(LANE_H_MAX, raw));
  }, [areaH, rows]);

  const signals: Signal[] = useMemo(
    () => layout.phases.map(p => signalAt(stage, p, t)),
    [layout.phases, stage, t],
  );
  const progress = useMemo(
    () => layout.phases.map(p => windowProgress(stage, p, t)),
    [layout.phases, stage, t],
  );

  const laneAhead = engine.row < stage.lanes ? engine.row : -1;
  const aheadSignal: Signal = laneAhead >= 0 ? signals[laneAhead] : 'GO';
  const aheadProgress = laneAhead >= 0 ? progress[laneAhead] : 1;
  const aheadRemaining =
    laneAhead >= 0
      ? windowRemaining(stage, layout.phases[laneAhead], t)
      : 0;

  // Feather pulse on every gain.
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (engine.feathers <= 0) {
      return;
    }
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.18,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start();
  }, [engine.feathers, pulse]);

  useEffect(
    () => () => {
      if (peekTimer.current) {
        clearTimeout(peekTimer.current);
      }
    },
    [],
  );

  const onWait = useCallback(() => {
    setPeek(true);
    if (peekTimer.current) {
      clearTimeout(peekTimer.current);
    }
    peekTimer.current = setTimeout(() => setPeek(false), PEEK_MS);
  }, []);

  const shakeX = engine.shake.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-6, 0, 6],
  });

  const showRing = peek || settings.hopAssist;
  const goDisabled = engine.busy;
  const goHeight = settings.bigTap ? GO_H_BIG : GO_H;

  return (
    <ScreenBackground
      colors={GRADIENTS.menu as unknown as string[]}
      imageOpacity={0.16}
      blobs={[
        {colour: COLORS.go, size: 260, opacity: 0.07, top: 120, left: -80},
        {colour: COLORS.stop, size: 200, opacity: 0.05, bottom: 180, right: -70},
      ]}>
      <ScreenHeader
        title={stage.name}
        eyebrow={`LANE ${Math.min(engine.row, stage.lanes)} / ${stage.lanes}`}
        leftSlot={
          <IconButton
            source={assets.iconPause}
            accessibilityLabel="PAUSE"
            onPress={() => setPaused(true)}
          />
        }
        rightSlot={
          <Animated.View
            pointerEvents="none"
            style={{transform: [{scale: pulse}]}}>
            <Text style={styles.gain}>
              {`+${formatFeathers(engine.feathers)}`}
            </Text>
          </Animated.View>
        }
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.area, {transform: [{translateX: shakeX}]}]}
        onLayout={e => setAreaH(e.nativeEvent.layout.height)}>
        {areaH > 0 ? (
          <RoadBoard
            layout={layout}
            width={BOARD_MAX_W}
            laneH={laneH}
            signals={signals}
            progress={progress}
            row={engine.row}
            rowAnim={engine.rowAnim}
            carLane={engine.carLane}
            carX={engine.carX}
            tumble={engine.tumble}
            kerbFlash={engine.kerbFlash}
            pop={engine.pop}
            popLane={engine.popLane}
            settings={settings}
            stickerTint={engine.stickerTint}
            showRing={showRing}
          />
        ) : null}
      </Animated.View>

      {layout.fallback ? (
        <Text style={styles.fallbackNote}>
          SIGNAL FEED UNSTABLE. STAGE RESET TO A SAFE LAYOUT.
        </Text>
      ) : null}

      <ClayCard radius={22} padded={false} style={styles.strip}>
        <View style={styles.stripSlot}>
          <SignalChip state={aheadSignal} />
        </View>
        <View style={styles.divider} />
        <View style={styles.stripSlot}>
          {engine.streak > 0 ? (
            <View style={styles.pill}>
              <Text style={[styles.pillValue, {color: COLORS.go}]}>
                {`x${engine.streak}`}
              </Text>
              <Text style={styles.pillLabel}>STREAK</Text>
            </View>
          ) : (
            <View style={styles.pill}>
              <CountdownRing
                progress={aheadProgress}
                colour={SIGNAL_COLOR[aheadSignal]}
                size={28}
              />
              <Text style={styles.pillLabel}>LANE AHEAD</Text>
            </View>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.stripSlot}>
          <View style={styles.pill}>
            <Text style={[styles.pillValue, {color: COLORS.amber}]}>
              {`${engine.collected.length}/${layout.stickerLanes.length}`}
            </Text>
            <Text style={styles.pillLabel}>STICKERS</Text>
          </View>
        </View>
      </ClayCard>

      <View style={styles.controls}>
        <Text style={styles.hint}>
          {showRing && laneAhead >= 0
            ? `LANE AHEAD IS ${aheadSignal} FOR ${(aheadRemaining / 1000).toFixed(1)}s`
            : 'TAP GO ON GREEN. TAP WAIT TO HOLD.'}
        </Text>
        <ClayButton
          label="GO"
          height={goHeight}
          fontSize={26}
          letterSpacing={5}
          disabled={goDisabled}
          onPress={engine.hop}
          testID="game-go"
        />
        <ClayButton
          label="WAIT"
          variant="secondary"
          height={BTN_SECONDARY_H}
          fontSize={16}
          letterSpacing={3}
          onPress={onWait}
        />
      </View>

      {paused ? (
        <View style={styles.pauseScrim}>
          <ClayCard radius={30} style={styles.pauseCard}>
            <Text style={styles.pauseTitle}>SIGNALS HELD</Text>
            <Text style={styles.pauseBody}>
              The lights are frozen where you left them. Nothing is lost.
            </Text>
            <View style={styles.pauseActions}>
              <ClayButton
                label="RESUME"
                height={60}
                fontSize={18}
                onPress={() => setPaused(false)}
              />
              <ClayButton
                label="RESTART"
                variant="secondary"
                height={BTN_SECONDARY_H}
                fontSize={15}
                onPress={() => {
                  setPaused(false);
                  onRestart();
                }}
              />
              <ClayButton
                label="MENU"
                variant="ghost"
                height={BTN_SECONDARY_H}
                fontSize={15}
                onPress={onExit}
              />
            </View>
          </ClayCard>
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  gain: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.amber,
    ...TABULAR,
  },
  fallbackNote: {
    marginHorizontal: 16,
    marginBottom: 6,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.amber,
    textAlign: 'center',
  },
  strip: {
    height: 64,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stripSlot: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  divider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  pill: {alignItems: 'center', justifyContent: 'center'},
  pillValue: {
    fontSize: 20,
    fontWeight: '800',
    includeFontPadding: false,
    ...TABULAR,
  },
  pillLabel: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textMuted,
  },
  controls: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 10,
    backgroundColor: COLORS.bgMid,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
  },
  hint: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  pauseScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,18,10,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pauseCard: {width: '100%', padding: 22},
  pauseTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  pauseBody: {
    marginTop: 10,
    marginBottom: 18,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  pauseActions: {gap: 12},
});

export default GameScreen;
