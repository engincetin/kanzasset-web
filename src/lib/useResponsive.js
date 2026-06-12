import { useState, useEffect, useLayoutEffect, useRef } from 'react';

// ─── Responsive breakpoints (single source of truth) ──────────
// mobile  : phones                — single column, sidebar becomes a drawer
// tablet  : small laptops/tablets — relaxed two-column where it still fits
export const BP = { mobile: 768, tablet: 1024 };

// Subscribe to a media query and re-render when it flips.
export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Convenience flags used across screens.
export const useIsMobile = () => useMediaQuery(`(max-width: ${BP.mobile}px)`);
export const useIsTablet = () => useMediaQuery(`(max-width: ${BP.tablet}px)`);

// Measure an element's actual rendered width with a ResizeObserver.
// Unlike media queries this reflects the *available* space (e.g. it grows when
// the sidebar is collapsed), so layouts can fit content side-by-side as long
// as it physically fits — not based on the browser window alone.
// Returns [ref, width]; width is 0 until first measured.
export function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}
