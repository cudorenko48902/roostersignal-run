import React from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import type {Signal} from '../game/types';
import {COLORS, SIGNAL_COLOR} from '../constants/theme';
import CountdownRing from './CountdownRing';
import assets from '../assets';

interface Props {
  index: number;
  height: number;
  signal: Signal;
  /** 0..1 of the current window, used by the countdown ring */
  progress: number;
  hasSticker: boolean;
  stickerTint: string;
  highlighted: boolean;
  colourBlind: boolean;
  showRing: boolean;
  popValue?: Animated.Value;
  popping?: boolean;
}

const LETTER: Record<Signal, string> = {GO: 'G', WAIT: 'W', STOP: 'S'};

/** One street lane: asphalt, dashed centre line, signal post, lamp and token. */
export function LaneRow({
  index,
  height,
  signal,
  progress,
  hasSticker,
  stickerTint,
  highlighted,
  colourBlind,
  showRing,
  popValue,
  popping,
}: Props) {
  const colour = SIGNAL_COLOR[signal];
  const postH = Math.min(30, height - 20);
  const tokenSize = Math.min(28, height - 24);

  return (
    <View
      style={[
        styles.row,
        {
          height,
          backgroundColor: index % 2 === 0 ? COLORS.asphalt : '#0C2416',
        },
        highlighted ? {borderColor: colour + '8C'} : null,
      ]}>
      <View style={styles.dashes} pointerEvents="none">
        {DASHES.map(d => (
          <View key={d} style={styles.dash} />
        ))}
      </View>

      {hasSticker ? (
        <Animated.Image
          source={assets.sticker}
          resizeMode="contain"
          style={[
            styles.token,
            {
              width: tokenSize,
              height: tokenSize,
              tintColor: stickerTint,
              transform: [{scale: popping && popValue ? popValue : 1}],
            },
          ]}
        />
      ) : null}

      <View style={styles.signalSlot} pointerEvents="none">
        {showRing ? (
          <View style={styles.ring}>
            <CountdownRing progress={progress} colour={colour} size={34} />
          </View>
        ) : null}
        <View
          style={[
            styles.lamp,
            {
              backgroundColor: colour,
              shadowColor: colour,
            },
          ]}>
          {colourBlind ? (
            <Text style={styles.lampLetter}>{LETTER[signal]}</Text>
          ) : null}
        </View>
        <Image
          source={assets.signalPost}
          resizeMode="contain"
          style={{width: postH, height: postH}}
        />
      </View>
    </View>
  );
}

const DASHES = [0, 1, 2, 3, 4, 5];

const styles = StyleSheet.create({
  row: {
    width: '100%',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dashes: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  dash: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.laneEdge,
  },
  token: {
    position: 'absolute',
    left: 24,
    alignSelf: 'center',
  },
  signalSlot: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ring: {marginRight: 2},
  lamp: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 0},
    elevation: 6,
  },
  lampLetter: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.goInk,
    includeFontPadding: false,
  },
});

export default LaneRow;
