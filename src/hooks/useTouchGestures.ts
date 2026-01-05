import { useRef, useEffect } from 'react';

interface TouchGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  threshold?: number;
}

export const useTouchGestures = (ref: React.RefObject<HTMLElement>, config: TouchGestureConfig = {}) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX.current = t.clientX;
      startY.current = t.clientY;
      startTime.current = Date.now();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]);
      if (!t) return;
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;
      const dt = Date.now() - startTime.current;
      const threshold = config.threshold || 40;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx > 0) config.onSwipeRight && config.onSwipeRight();
        else config.onSwipeLeft && config.onSwipeLeft();
      } else if (Math.abs(dy) > threshold) {
        if (dy > 0) config.onSwipeDown && config.onSwipeDown();
        else config.onSwipeUp && config.onSwipeUp();
      } else if (dt < 250) {
        config.onTap && config.onTap();
      }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart as any);
      el.removeEventListener('touchend', onTouchEnd as any);
    };
  }, [ref, config]);
};

export default useTouchGestures;
