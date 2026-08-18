import { useEffect, useState } from 'react';

/** Matches a media query and stays in sync with it. */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on devices with a precise pointer — gates the custom cursor. */
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Viewport below the `lg` breakpoint — used to skip the 3D canvas. */
export function useIsCompact() {
  return useMediaQuery('(max-width: 1023px)');
}
