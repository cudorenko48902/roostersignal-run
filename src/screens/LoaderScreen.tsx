import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenBackground from '../components/ScreenBackground';
import {COLORS, GRADIENTS} from '../constants/theme';
import {
  DISC_SPRING,
  LOADER_BAR_MS,
  LOADER_DURATION_MS,
} from '../constants/config';
import assets from '../assets';

interface Props {
  onDone: () => void;
}

const DOTS = [COLORS.stop, COLORS.amber, COLORS.go];

/**
 * Brand card, not a menu duplicate: no PLAY button, no stat chips, no touch
 * handler anywhere. The hold is exactly LOADER_DURATION_MS and the transition
 * is fired by that timer, never by an animation callback or a tap.
 */
export function LoaderScreen({onDone}: Props) {
  const disc = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(disc, {
      toValue: 1,
      useNativeDriver: true,
      ...DISC_SPRING,
    }).start();
    Animated.timing(titleIn, {
      toValue: 1,
      duration: 520,
      delay: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // width is NOT a native-driver property
    Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_BAR_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 3,
        duration: 2100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    const timer = setTimeout(onDone, LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [bar, disc, onDone, pulse, titleIn]);

  const barWidth = bar.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScreenBackground
      colors={GRADIENTS.loader as unknown as string[]}
      imageOpacity={0.3}
      blobs={[
        {colour: COLORS.go, size: 260, opacity: 0.07, top: -40, left: -60},
        {colour: COLORS.amber, size: 200, opacity: 0.06, bottom: 40, right: -50},
        {colour: COLORS.stop, size: 160, opacity: 0.04, top: 360, right: 20},
      ]}>
      <View style={styles.body}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.disc,
            {opacity: disc, transform: [{scale: disc}]},
          ]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <View style={styles.dots}>
          {DOTS.map((c, i) => (
            <Animated.View
              pointerEvents="none"
              key={c}
              style={[
                styles.dot,
                {
                  backgroundColor: c,
                  shadowColor: c,
                  opacity: pulse.interpolate({
                    inputRange: [i - 0.5, i, i + 0.5, i + 1],
                    outputRange: [0.25, 1, 0.25, 0.25],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          ))}
        </View>

        <Animated.View
          pointerEvents="none"
          style={{
            opacity: titleIn,
            transform: [
              {
                translateY: titleIn.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          }}>
          <Text style={styles.title}>ROOSTER SIGNAL RUN</Text>
          <Text style={styles.subtitle}>READ THE LIGHTS. CROSS CLEAN.</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View
            pointerEvents="none"
            style={[styles.barFill, {width: barWidth}]}>
            <LinearGradient
              colors={GRADIENTS.loaderBar as unknown as string[]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING…</Text>

        <Image
          source={assets.kerbDecor}
          style={styles.decor}
          resizeMode="contain"
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24},
  disc: {
    width: 196,
    height: 196,
    borderRadius: 98,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 10},
    elevation: 16,
  },
  logo: {width: 148, height: 148},
  dots: {flexDirection: 'row', gap: 14, marginTop: 26},
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 0},
    elevation: 6,
  },
  title: {
    marginTop: 30,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: COLORS.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(0,230,118,0.35)',
    textShadowRadius: 14,
    textShadowOffset: {width: 0, height: 0},
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  barTrack: {
    marginTop: 34,
    width: 220,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {height: '100%', borderRadius: 5, overflow: 'hidden'},
  loading: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    color: COLORS.textMuted,
  },
  decor: {position: 'absolute', bottom: 26, right: 26, width: 64, height: 64, opacity: 0.35},
});

export default LoaderScreen;
