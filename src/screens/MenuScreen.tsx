import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import {
  BarChart3,
  CalendarDays,
  Flag,
  Play,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, {FeatherBadge} from '../components/ScreenHeader';
import ClayButton from '../components/ClayButton';
import BentoTile from '../components/BentoTile';
import {COLORS, GRADIENTS} from '../constants/theme';
import {STAGES, STAGE_COUNT} from '../game/stages';
import {SLOTS_PER_SET, STICKER_SETS, TOTAL_STICKERS} from '../game/stickers';
import {dateKey, isDailyDone} from '../game/daily';
import type {Profile} from '../game/types';
import assets from '../assets';

interface Props {
  profile: Profile;
  onPlay: () => void;
  onChallenge: () => void;
  onDaily: () => void;
  onProgress: () => void;
  onCollection: () => void;
  onSettings: () => void;
}

/** M3 Bento-Hub. Only the hero strip flexes; every tile has a fixed height. */
export function MenuScreen({
  profile,
  onPlay,
  onChallenge,
  onDaily,
  onProgress,
  onCollection,
  onSettings,
}: Props) {
  const stagger = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(stagger, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, stagger]);

  const today = useMemo(() => dateKey(), []);
  const current = Math.min(profile.unlocked - 1, STAGE_COUNT - 1);
  const stage = STAGES[Math.max(0, current)];
  const clearedCount = Object.keys(profile.stages).filter(
    k => profile.stages[Number(k)].cleared,
  ).length;
  const dailyDone = isDailyDone(profile.daily, today);
  const completeSets = STICKER_SETS.filter(
    s =>
      profile.stickers.filter(id => Number(id.split('-')[0]) === s.id).length >=
      SLOTS_PER_SET,
  ).length;

  const rise = (order: number) =>
    stagger.interpolate({
      inputRange: [0, 1],
      outputRange: [18 + order * 6, 0],
    });

  return (
    <ScreenBackground
      colors={GRADIENTS.menu as unknown as string[]}
      imageOpacity={0.22}
      blobs={[
        {colour: COLORS.go, size: 300, opacity: 0.09, top: -70, right: -80},
        {colour: COLORS.amber, size: 240, opacity: 0.07, bottom: -60, left: -70},
      ]}>
      <ScreenHeader
        title="ROOSTER SIGNAL"
        eyebrow="CHICKEN ROAD"
        centered={false}
        rightSlot={<FeatherBadge value={profile.feathers} />}
      />

      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Text style={styles.heroEyebrow}>
              {`STAGE ${Math.max(1, profile.unlocked)} OF ${STAGE_COUNT}`}
            </Text>
            <Text style={styles.heroTitle} numberOfLines={1}>
              {stage.name}
            </Text>
          </View>
          <View style={styles.heroArt}>
            <View style={styles.heroGlow} />
            <Animated.Image
              source={assets.rooster}
              resizeMode="contain"
              style={[
                styles.heroSprite,
                {
                  transform: [
                    {
                      translateY: bob.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -4],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>

        {/* Hint sits ABOVE the primary CTA, never under it. */}
        <Text style={styles.hint}>
          {`HOW TO PLAY · TAP GO WHILE THE LANE IS GREEN`}
        </Text>

        <Animated.View
          pointerEvents="box-none"
          style={{opacity: stagger, transform: [{translateY: rise(0)}]}}>
          <ClayButton
            label="PLAY"
            Icon={Play}
            iconSize={28}
            fontSize={28}
            letterSpacing={4}
            height={104}
            onPress={onPlay}
            plate
            testID="menu-play"
          />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.row,
            {opacity: stagger, transform: [{translateY: rise(1)}]},
          ]}>
          <View style={styles.half}>
            <BentoTile
              Icon={Flag}
              label="CHALLENGE"
              sub={`${STAGE_COUNT} STAGES`}
              accent={COLORS.go}
              height={96}
              onPress={onChallenge}
            />
          </View>
          <View style={styles.half}>
            <BentoTile
              Icon={CalendarDays}
              label="DAILY MODE"
              sub={dailyDone ? 'DONE TODAY' : 'READY TODAY'}
              accent={COLORS.amber}
              height={96}
              onPress={onDaily}
            />
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.row,
            {opacity: stagger, transform: [{translateY: rise(2)}]},
          ]}>
          <View style={styles.half}>
            <BentoTile
              Icon={BarChart3}
              label="PROGRESS"
              sub={`CLEARED ${clearedCount} / ${STAGE_COUNT}`}
              accent={COLORS.go}
              height={96}
              onPress={onProgress}
            />
          </View>
          <View style={styles.half}>
            <BentoTile
              Icon={Sparkles}
              label="COLLECTION"
              sub={
                completeSets > 0
                  ? `${profile.stickers.length} / ${TOTAL_STICKERS} · ${completeSets} SETS`
                  : `${profile.stickers.length} / ${TOTAL_STICKERS}`
              }
              accent={COLORS.amber}
              height={96}
              onPress={onCollection}
            />
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={{opacity: stagger, transform: [{translateY: rise(3)}]}}>
          <ClayButton
            label="SETTINGS"
            Icon={SettingsIcon}
            variant="ghost"
            height={56}
            fontSize={15}
            onPress={onSettings}
          />
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {flex: 1, paddingHorizontal: 16, paddingBottom: 20, gap: 12},
  hero: {
    flex: 1,
    minHeight: 88,
    maxHeight: 148,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroText: {flex: 1, justifyContent: 'center'},
  heroEyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: COLORS.go,
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textPrimary,
  },
  heroArt: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlow: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.amber,
    opacity: 0.18,
  },
  heroSprite: {width: 104, height: 104},
  hint: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  row: {flexDirection: 'row', gap: 12},
  half: {flex: 1},
});

export default MenuScreen;
