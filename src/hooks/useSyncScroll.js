import { useRef, useEffect, useCallback } from 'react';

/**
 * High-performance synchronized scroll hook for split diff view
 */
export function useSyncScroll(enabled = true) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isScrollingRef = useRef(null); // 'left' | 'right' | null

  const handleScroll = useCallback((source) => {
    if (!enabled) return;

    if (source === 'left') {
      if (isScrollingRef.current === 'right') return;
      isScrollingRef.current = 'left';

      if (leftRef.current && rightRef.current) {
        rightRef.current.scrollTop = leftRef.current.scrollTop;
        rightRef.current.scrollLeft = leftRef.current.scrollLeft;
      }
    } else if (source === 'right') {
      if (isScrollingRef.current === 'left') return;
      isScrollingRef.current = 'right';

      if (leftRef.current && rightRef.current) {
        leftRef.current.scrollTop = rightRef.current.scrollTop;
        leftRef.current.scrollLeft = rightRef.current.scrollLeft;
      }
    }

    requestAnimationFrame(() => {
      isScrollingRef.current = null;
    });
  }, [enabled]);

  useEffect(() => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;

    if (!leftEl || !rightEl || !enabled) return;

    const onLeftScroll = () => handleScroll('left');
    const onRightScroll = () => handleScroll('right');

    leftEl.addEventListener('scroll', onLeftScroll, { passive: true });
    rightEl.addEventListener('scroll', onRightScroll, { passive: true });

    return () => {
      leftEl.removeEventListener('scroll', onLeftScroll);
      rightEl.removeEventListener('scroll', onRightScroll);
    };
  }, [handleScroll, enabled]);

  return { leftRef, rightRef };
}
