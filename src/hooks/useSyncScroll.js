import { useRef, useEffect, useCallback } from 'react';

/**
 * High-performance synchronized scroll hook for split diff & editor views
 */
export function useSyncScroll(enabled = true, onScrollRatio = null) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isScrollingRef = useRef(null); // 'left' | 'right' | null

  const handleScroll = useCallback((source) => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;

    if (source === 'left' && leftEl) {
      if (onScrollRatio) {
        const maxScroll = Math.max(1, leftEl.scrollHeight - leftEl.clientHeight);
        onScrollRatio(leftEl.scrollTop / maxScroll);
      }

      if (!enabled || isScrollingRef.current === 'right') return;
      isScrollingRef.current = 'left';

      if (rightEl) {
        rightEl.scrollTop = leftEl.scrollTop;
        rightEl.scrollLeft = leftEl.scrollLeft;
      }
    } else if (source === 'right' && rightEl) {
      if (onScrollRatio) {
        const maxScroll = Math.max(1, rightEl.scrollHeight - rightEl.clientHeight);
        onScrollRatio(rightEl.scrollTop / maxScroll);
      }

      if (!enabled || isScrollingRef.current === 'left') return;
      isScrollingRef.current = 'right';

      if (leftEl) {
        leftEl.scrollTop = rightEl.scrollTop;
        leftEl.scrollLeft = rightEl.scrollLeft;
      }
    }

    requestAnimationFrame(() => {
      isScrollingRef.current = null;
    });
  }, [enabled, onScrollRatio]);

  useEffect(() => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;

    if (!leftEl && !rightEl) return;

    const onLeftScroll = () => handleScroll('left');
    const onRightScroll = () => handleScroll('right');

    if (leftEl) leftEl.addEventListener('scroll', onLeftScroll, { passive: true });
    if (rightEl) rightEl.addEventListener('scroll', onRightScroll, { passive: true });

    return () => {
      if (leftEl) leftEl.removeEventListener('scroll', onLeftScroll);
      if (rightEl) rightEl.removeEventListener('scroll', onRightScroll);
    };
  }, [handleScroll]);

  return { leftRef, rightRef };
}
