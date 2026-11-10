import {useCallback, useEffect, useRef, useState} from 'react';

const PUBLISH_MS = 90;

/**
 * One monotonic clock drives every lamp in the game. The exact time lives in a
 * ref (so animation callbacks never read a stale closure) and only a throttled
 * copy reaches React state, so nothing starts a timer from a render pass.
 * The loop is started by the mount effect and cancelled in its cleanup.
 */
export function useSignalClock(running: boolean) {
  const tRef = useRef(0);
  const accRef = useRef(0);
  const baseRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [t, setT] = useState(0);

  const reset = useCallback(() => {
    accRef.current = 0;
    baseRef.current = Date.now();
    tRef.current = 0;
    setT(0);
  }, []);

  useEffect(() => {
    if (!running) {
      // Freeze, do not rewind: pause keeps the signals where they were.
      accRef.current = tRef.current;
      return undefined;
    }
    baseRef.current = Date.now();
    let lastPublish = -PUBLISH_MS;
    let cancelled = false;

    const step = () => {
      if (cancelled) {
        return;
      }
      const now = accRef.current + (Date.now() - baseRef.current);
      tRef.current = now;
      if (now - lastPublish >= PUBLISH_MS) {
        lastPublish = now;
        setT(now);
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [running]);

  return {t, tRef, reset};
}

export default useSignalClock;
