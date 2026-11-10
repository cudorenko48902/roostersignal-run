/**
 * RoosterSignal Run — screen state machine only. No gameplay lives here and no
 * navigation library is used: one place owns the current screen.
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import GameScreen from './src/screens/GameScreen';
import RunResultScreen from './src/screens/RunResultScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import DailyModeScreen from './src/screens/DailyModeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {COLORS} from './src/constants/theme';
import {SCREEN_FADE_MS} from './src/constants/config';
import {STAGES, STAGE_COUNT, stageAt} from './src/game/stages';
import {buildLayout} from './src/game/generator';
import {seedForAttempt, seedForDate} from './src/game/rng';
import {completeDaily, dailyStage, dateKey} from './src/game/daily';
import useProfile from './src/hooks/useProfile';
import type {Profile, RunResult, StageLayout} from './src/game/types';

type Screen =
  | 'loader'
  | 'menu'
  | 'challenge'
  | 'game'
  | 'gameover'
  | 'progress'
  | 'collection'
  | 'daily'
  | 'settings';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [layout, setLayout] = useState<StageLayout | null>(null);
  const [isDaily, setIsDaily] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const attemptRef = useRef(0);

  const {profile, update, setSettings, reset} = useProfile();

  // 260 ms cross-fade plus a 12 px rise on the incoming screen.
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: SCREEN_FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade, screen]);

  const startRun = useCallback(
    (stageIndex: number, daily: boolean) => {
      attemptRef.current += 1;
      const today = dateKey();
      const stage = daily ? dailyStage(today) : stageAt(stageIndex);
      const seed = daily
        ? seedForDate(today)
        : seedForAttempt(stage.index, attemptRef.current);
      const prog = profile.stages[stage.index];
      const multiplier = !daily && prog && prog.doubleStickers ? 2 : 1;
      setLayout(buildLayout(stage, seed, multiplier));
      setIsDaily(daily);
      setResult(null);
      if (!daily && multiplier > 1) {
        // the Clean Run bonus is consumed by the run it pays out on
        update(p => ({
          ...p,
          stages: {
            ...p.stages,
            [stage.index]: {...p.stages[stage.index], doubleStickers: false},
          },
        }));
      }
      setScreen('game');
    },
    [profile.stages, update],
  );

  const commit = useCallback(
    (r: RunResult) => {
      update((p: Profile) => {
        const merged = p.stickers.slice();
        for (let i = 0; i < r.newStickers.length; i++) {
          if (merged.indexOf(r.newStickers[i]) === -1) {
            merged.push(r.newStickers[i]);
          }
        }
        const stages = {...p.stages};
        if (!r.daily) {
          const prev = stages[r.stageIndex];
          stages[r.stageIndex] = {
            cleared: prev.cleared || r.outcome === 'cleared',
            best: Math.max(prev.best, r.feathers),
            attempts: prev.attempts + 1,
            doubleStickers: prev.doubleStickers || r.cleanRun,
          };
        }
        const unlocked =
          !r.daily && r.outcome === 'cleared'
            ? Math.min(STAGE_COUNT, Math.max(p.unlocked, r.stageIndex + 2))
            : p.unlocked;
        return {
          ...p,
          feathers: p.feathers + r.feathers,
          bestStreak: Math.max(p.bestStreak, r.bestStreak),
          stickers: merged,
          stages,
          unlocked,
          daily: r.daily
            ? completeDaily(p.daily, dateKey(), r.feathers, r.bestStreak)
            : p.daily,
          totals: {
            crossings: p.totals.crossings + r.lanesCrossed,
            goldenHops: p.totals.goldenHops + r.goldenHops,
            cleanRuns: p.totals.cleanRuns + (r.cleanRun ? 1 : 0),
          },
        };
      });
      setResult(r);
      setScreen('gameover');
    },
    [update],
  );

  const goMenu = useCallback(() => setScreen('menu'), []);

  // Forward navigation pushes, system Back returns; Back on Menu closes the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'loader' || screen === 'menu') {
        return false;
      }
      goMenu();
      return true;
    });
    return () => sub.remove();
  }, [goMenu, screen]);

  const currentStage = layout ? layout.stage : STAGES[0];

  let body: React.ReactNode = null;
  if (screen === 'loader') {
    body = <LoaderScreen onDone={goMenu} />;
  } else if (screen === 'menu') {
    body = (
      <MenuScreen
        profile={profile}
        onPlay={() => startRun(Math.max(0, profile.unlocked - 1), false)}
        onChallenge={() => setScreen('challenge')}
        onDaily={() => setScreen('daily')}
        onProgress={() => setScreen('progress')}
        onCollection={() => setScreen('collection')}
        onSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'challenge') {
    body = (
      <ChallengeScreen
        profile={profile}
        onStart={i => startRun(i, false)}
        onBack={goMenu}
      />
    );
  } else if (screen === 'game' && layout) {
    body = (
      <GameScreen
        layout={layout}
        settings={profile.settings}
        ownedStickers={profile.stickers}
        daily={isDaily}
        onGameOver={commit}
        onExit={goMenu}
        onRestart={() => startRun(currentStage.index, isDaily)}
      />
    );
  } else if (screen === 'gameover' && result) {
    body = (
      <RunResultScreen
        result={result}
        onAgain={() => startRun(result.stageIndex, result.daily)}
        onNextStage={() =>
          startRun(Math.min(STAGE_COUNT - 1, result.stageIndex + 1), false)
        }
        onMenu={goMenu}
      />
    );
  } else if (screen === 'progress') {
    body = <ProgressScreen profile={profile} onBack={goMenu} />;
  } else if (screen === 'collection') {
    body = <CollectionScreen profile={profile} onBack={goMenu} />;
  } else if (screen === 'daily') {
    body = (
      <DailyModeScreen
        profile={profile}
        onStartDaily={() => startRun(0, true)}
        onProgress={() => setScreen('progress')}
        onBack={goMenu}
      />
    );
  } else if (screen === 'settings') {
    body = (
      <SettingsScreen
        settings={profile.settings}
        onChange={setSettings}
        onReset={reset}
        onBack={goMenu}
      />
    );
  } else {
    body = (
      <MenuScreen
        profile={profile}
        onPlay={() => startRun(Math.max(0, profile.unlocked - 1), false)}
        onChallenge={() => setScreen('challenge')}
        onDaily={() => setScreen('daily')}
        onProgress={() => setScreen('progress')}
        onCollection={() => setScreen('collection')}
        onSettings={() => setScreen('settings')}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.root,
          {
            opacity: fade,
            transform: [
              {
                translateY: fade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}>
        {body}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.bgDeep},
});

export default App;
