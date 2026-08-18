import { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/useEnvironment';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

/** Gives any child access to `scrollTo` for anchor navigation. */
export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Respect the OS setting: fall back to native scrolling entirely.
    if (reduceMotion) {
      ScrollTrigger.refresh();
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.3,
      // Long, decelerating curve — matches the slow cinematic brief.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    // Lenis owns the scroll position, so ScrollTrigger has to be told
    // to re-read on every Lenis frame or triggers fire against stale values.
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduceMotion]);

  const scrollTo = (target) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -8, duration: 1.6 });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>
  );
}
