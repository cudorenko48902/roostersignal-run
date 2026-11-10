import {useCallback, useRef} from 'react';
import {Animated} from 'react-native';
import {PRESS_SPRING} from '../constants/config';

/**
 * Press feedback the only way that works on this stack: the Pressable is the
 * PARENT and drives an Animated.spring on transform:scale of a CHILD
 * Animated.View. useNativeDriver is true because scale is a transform.
 */
export function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      ...PRESS_SPRING,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...PRESS_SPRING,
    }).start();
  }, [scale]);

  return {scale, onPressIn, onPressOut};
}

export default usePressScale;
