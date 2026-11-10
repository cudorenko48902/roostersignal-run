import React from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import type {GameSettings, Signal, StageLayout} from '../game/types';
import {COLORS, RADIUS} from '../constants/theme';
import {BOARD_BORDER, BOARD_FRAME, BOARD_PAD} from '../constants/config';
import LaneRow from './LaneRow';
import RoosterSprite from './RoosterSprite';
import assets from '../assets';

interface Props {
  layout: StageLayout;
  width: number;
  laneH: number;
  signals: Signal[];
  progress: number[];
  row: number;
  rowAnim: Animated.Value;
  carLane: number | null;
  carX: Animated.Value;
  tumble: Animated.Value;
  kerbFlash: Animated.Value;
  pop: Animated.Value;
  popLane: number | null;
  settings: GameSettings;
  stickerTint: string;
  /** the kerb read: ring on the lane ahead while WAIT is held or assist is on */
  showRing: boolean;
}

/**
 * The street. Geometry is exact: board height is laneH * rows + 2 * frame, so
 * nothing ever overflows the rounded kerb.
 */
export function RoadBoard({
  layout,
  width,
  laneH,
  signals,
  progress,
  row,
  rowAnim,
  carLane,
  carX,
  tumble,
  kerbFlash,
  pop,
  popLane,
  settings,
  stickerTint,
  showRing,
}: Props) {
  const lanes = layout.stage.lanes;
  const rows = lanes + 2;
  const boardH = laneH * rows + 2 * BOARD_FRAME;
  const innerW = width - 2 * BOARD_FRAME;
  const roosterSize = Math.max(28, laneH - 18);
  const carSize = Math.max(26, laneH - 22);

  // Lane ahead is the lane the rooster would enter next.
  const laneAhead = row < lanes ? row : -1;

  const roosterTranslate = rowAnim.interpolate({
    inputRange: [0, rows - 1],
    outputRange: [0, -(rows - 1) * laneH],
  });

  const carTranslate = carX.interpolate({
    inputRange: [0, 1],
    outputRange: [-carSize - 12, innerW + 12],
  });

  const laneIndices: number[] = [];
  for (let i = lanes - 1; i >= 0; i--) {
    laneIndices.push(i);
  }

  return (
    <View style={[styles.board, {width, height: boardH}]}>
      <View style={[styles.inner, {width: innerW, height: laneH * rows}]}>
        {/* far kerb */}
        <View style={[styles.kerb, {height: laneH}]}>
          <Animated.View
            pointerEvents="none"
            style={[styles.finishBand, {opacity: kerbFlash}]}
          />
          <View style={styles.finishLine} />
          <Text style={styles.kerbText}>KERB</Text>
          <Image
            source={assets.kerbDecor}
            resizeMode="contain"
            style={[styles.kerbDecor, {width: laneH - 20, height: laneH - 20}]}
          />
        </View>

        {laneIndices.map(i => (
          <LaneRow
            key={i}
            index={i}
            height={laneH}
            signal={signals[i] || 'STOP'}
            progress={progress[i] || 0}
            hasSticker={
              layout.stickerLanes.indexOf(i) !== -1 && i > row - 1
            }
            stickerTint={stickerTint}
            highlighted={i === laneAhead}
            colourBlind={settings.colourBlind}
            showRing={showRing && i === laneAhead}
            popValue={pop}
            popping={popLane === i}
          />
        ))}

        {/* start kerb */}
        <View style={[styles.kerb, styles.startKerb, {height: laneH}]}>
          <Text style={styles.kerbText}>START KERB</Text>
        </View>

        {/* the rooster rides on top of the rows */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.roosterSlot,
            {height: laneH, transform: [{translateY: roosterTranslate}]},
          ]}>
          <RoosterSprite size={roosterSize} tumbleValue={tumble} />
        </Animated.View>

        {carLane !== null && !settings.reducedMotion ? (
          <Animated.Image
            source={assets.car}
            resizeMode="contain"
            style={[
              styles.car,
              {
                width: carSize * 1.6,
                height: carSize,
                bottom: (carLane + 1) * laneH + (laneH - carSize) / 2,
                transform: [{translateX: carTranslate}],
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    padding: BOARD_PAD,
    borderRadius: RADIUS.lg,
    borderWidth: BOARD_BORDER,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: COLORS.asphalt,
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 12,
    overflow: 'hidden',
  },
  inner: {borderRadius: RADIUS.md, overflow: 'hidden'},
  kerb: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderTopWidth: 2,
    borderTopColor: COLORS.laneEdge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startKerb: {borderTopColor: COLORS.laneEdge},
  finishBand: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.go,
    opacity: 0,
  },
  finishLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.go,
  },
  kerbText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textMuted,
  },
  kerbDecor: {position: 'absolute', right: 12, bottom: 8, opacity: 0.85},
  roosterSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  car: {position: 'absolute', left: 0},
});

export default RoadBoard;
