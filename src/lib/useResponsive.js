import { useState, useEffect } from 'react';

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
