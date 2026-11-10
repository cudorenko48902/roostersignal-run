import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';
import type {
  GameSettings,
  Outcome,
  RunPhase,
  RunResult,
  StageLayout,
} from '../game/types';
import {isFinalRow, resolveHop} from '../game/crossing';
import {isGoldenWindow, signalAt} from '../game/signal';
import {clearBonus} from '../game/scoring';
import {drawSticker, setTint} from '../game/stickers';
import {
  CAR_MS,
  CLEAR_FLASH_MS,
  FEATHERS_STICKER,
  HOP_MS,
  STICKER_POP_MS,
} from '../constants/config';
import {mulberry32} from '../game/rng';

interface Params {
  layout: StageLayout;
  settings: GameSettings;
  ownedStickers: string[];
  tRef: {current: number};
  daily: boolean;
  onFinish: (result: RunResult) => void;
}

/**
 * The run state machine. Every animation completion callback reads the live
 * values out of refs, and the busy flag is always cleared inside the callback
 * so a tap can never be swallowed permanently.
 */
export function useRunEngine({
  layout,
  settings,
  ownedStickers,
  tRef,
  daily,
  onFinish,
}: Params) {
  const stage = layout.stage;
  const lanes = stage.lanes;
  const rows = lanes + 2;

  const [row, setRow] = useState(0);
  const [phase, setPhase] = useState<RunPhase>('idle');
  const [streak, setStreak] = useState(0);
  const [feathers, setFeathers] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);
  const [carLane, setCarLane] = useState<number | null>(null);
  const [popLane, setPopLane] = useState<number | null>(null);

  const rowAnim = useRef(new Animated.Value(0)).current;
  const carX = useRef(new Animated.Value(0)).current;
  const tumble = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const kerbFlash = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;

  // Live mirrors so animation callbacks never read a stale closure.
  const rowRef = useRef(0);
  const streakRef = useRef(0);
  const bestStreakRef = useRef(0);
  const feathersRef = useRef(0);
  const collectedRef = useRef<string[]>([]);
  const cleanRef = useRef(true);
  const goldenRef = useRef(0);
  const busyRef = useRef(false);
  const doneRef = useRef(false);
  const ownedRef = useRef<string[]>(ownedStickers);
  const rollRef = useRef(mulberry32(layout.seed ^ 0x9e3779b9));

  useEffect(() => {
    ownedRef.current = ownedStickers;
  }, [ownedStickers]);

  const reset = useCallback(() => {
    rowRef.current = 0;
    streakRef.current = 0;
    bestStreakRef.current = 0;
    feathersRef.current = 0;
    collectedRef.current = [];
    cleanRef.current = true;
    goldenRef.current = 0;
    busyRef.current = false;
    doneRef.current = false;
    rollRef.current = mulberry32(layout.seed ^ 0x9e3779b9);
    rowAnim.setValue(0);
    carX.setValue(0);
    tumble.setValue(0);
    shake.setValue(0);
    kerbFlash.setValue(0);
    pop.setValue(0);
    setRow(0);
    setPhase('idle');
    setStreak(0);
    setFeathers(0);
    setCollected([]);
    setCarLane(null);
    setPopLane(null);
  }, [carX, kerbFlash, layout.seed, pop, rowAnim, shake, tumble]);

  useEffect(() => {
    reset();
  }, [reset]);

  const finish = useCallback(
    (outcome: Outcome) => {
      if (doneRef.current) {
        return;
      }
      doneRef.current = true;
      onFinish({
        outcome,
        stageIndex: stage.index,
        stageName: stage.name,
        lanesCrossed: Math.min(rowRef.current, lanes),
        lanes,
        feathers: feathersRef.current,
        bestStreak: bestStreakRef.current,
        newStickers: collectedRef.current.slice(),
        cleanRun: outcome === 'cleared' && cleanRef.current,
        goldenHops: goldenRef.current,
        seed: layout.seed,
        daily,
      });
    },
    [daily, lanes, layout.seed, onFinish, stage.index, stage.name],
  );

  const collectAt = useCallback(
    (laneIndex: number) => {
      if (layout.stickerLanes.indexOf(laneIndex) === -1) {
        return;
      }
      const id = drawSticker(
        ownedRef.current.concat(collectedRef.current),
        stage.setId,
        rollRef.current(),
      );
      feathersRef.current += FEATHERS_STICKER;
      setFeathers(feathersRef.current);
      if (id) {
        collectedRef.current = collectedRef.current.concat([id]);
        setCollected(collectedRef.current);
      }
      setPopLane(laneIndex);
      setPhase('collecting');
      pop.setValue(0);
      Animated.sequence([
        Animated.timing(pop, {
          toValue: 1.15,
          duration: STICKER_POP_MS * 0.6,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(pop, {
          toValue: 1,
          duration: STICKER_POP_MS * 0.4,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPopLane(null);
        if (!doneRef.current) {
          setPhase('idle');
        }
      });
    },
    [layout.stickerLanes, pop, stage.setId],
  );

  const runCaught = useCallback(
    (laneIndex: number) => {
      setPhase('caught');
      setCarLane(laneIndex);
      cleanRef.current = false;
      if (settings.reducedMotion) {
        // State still changes instantly, just without the travel animation.
        tumble.setValue(1);
        setTimeout(() => {
          busyRef.current = false;
          finish('caught');
        }, 420);
        return;
      }
      carX.setValue(0);
      Animated.parallel([
        Animated.timing(carX, {
          toValue: 1,
          duration: CAR_MS,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(tumble, {
          toValue: 1,
          duration: CAR_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shake, {
            toValue: 1,
            duration: 70,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: -1,
            duration: 70,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: 0,
            duration: 70,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        busyRef.current = false;
        finish('caught');
      });
    },
    [carX, finish, settings.reducedMotion, shake, tumble],
  );

  const runCleared = useCallback(() => {
    setPhase('cleared');
    feathersRef.current += clearBonus(lanes);
    setFeathers(feathersRef.current);
    if (settings.reducedMotion) {
      kerbFlash.setValue(1);
      setTimeout(() => {
        busyRef.current = false;
        finish('cleared');
      }, 420);
      return;
    }
    const flash = Animated.sequence([
      Animated.timing(kerbFlash, {
        toValue: 1,
        duration: CLEAR_FLASH_MS / 6,
        useNativeDriver: true,
      }),
      Animated.timing(kerbFlash, {
        toValue: 0,
        duration: CLEAR_FLASH_MS / 6,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(flash, {iterations: 3}).start(() => {
      busyRef.current = false;
      finish('cleared');
    });
  }, [finish, kerbFlash, lanes, settings.reducedMotion]);

  /** The one player action: hop into the lane straight ahead. */
  const hop = useCallback(() => {
    if (busyRef.current || doneRef.current) {
      return;
    }
    const from = rowRef.current;

    if (!isFinalRow(from, lanes)) {
      const laneIndex = from;
      const now = tRef.current;
      const phaseOffset = layout.phases[laneIndex];
      const sig = signalAt(stage, phaseOffset, now);
      const golden = isGoldenWindow(stage, phaseOffset, now);
      const out = resolveHop(sig, golden, streakRef.current);

      if (!out.safe) {
        busyRef.current = true;
        runCaught(laneIndex);
        return;
      }
      if (out.late) {
        cleanRef.current = false;
      }
      if (out.golden) {
        goldenRef.current += 1;
      }
      feathersRef.current += out.feathers;
      streakRef.current = out.streak;
      if (out.streak > bestStreakRef.current) {
        bestStreakRef.current = out.streak;
      }
      setFeathers(feathersRef.current);
      setStreak(out.streak);
    }

    busyRef.current = true;
    setPhase('hopping');
    Animated.timing(rowAnim, {
      toValue: from + 1,
      duration: HOP_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // The busy flag is released inside the completion callback, always.
      busyRef.current = false;
      rowRef.current = from + 1;
      setRow(from + 1);
      if (rowRef.current >= rows - 1) {
        runCleared();
        return;
      }
      setPhase('idle');
      collectAt(from);
    });
  }, [
    collectAt,
    lanes,
    layout.phases,
    rowAnim,
    rows,
    runCaught,
    runCleared,
    stage,
    tRef,
  ]);

  return {
    row,
    rows,
    phase,
    streak,
    feathers,
    collected,
    carLane,
    popLane,
    rowAnim,
    carX,
    tumble,
    shake,
    kerbFlash,
    pop,
    hop,
    reset,
    busy: phase !== 'idle',
    stickerTint: setTint(stage.setId),
  };
}

export default useRunEngine;
