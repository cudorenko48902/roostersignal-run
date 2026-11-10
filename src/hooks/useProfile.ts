import {useCallback, useEffect, useRef, useState} from 'react';
import type {GameSettings, Profile} from '../game/types';
import {defaultProfile, loadProfile, resetProfile, saveProfile} from '../game/storage';

/**
 * One owner of the saved profile. Screens receive the slices they need as
 * props instead of subscribing to the whole object themselves.
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [ready, setReady] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    loadProfile().then(p => {
      if (alive.current) {
        setProfile(p);
        setReady(true);
      }
    });
    return () => {
      alive.current = false;
    };
  }, []);

  const update = useCallback((patch: (p: Profile) => Profile) => {
    setProfile(prev => {
      const next = patch(prev);
      saveProfile(next);
      return next;
    });
  }, []);

  const setSettings = useCallback(
    (patch: Partial<GameSettings>) => {
      update(p => ({...p, settings: {...p.settings, ...patch}}));
    },
    [update],
  );

  const reset = useCallback(() => {
    resetProfile().then(p => {
      if (alive.current) {
        setProfile({...p});
      }
    });
  }, []);

  return {profile, ready, update, setSettings, reset};
}

export default useProfile;
