import { useEffect, useRef, useState } from 'react';
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useEnvironment';

/**
 * Two-part cursor: a 4px dot that tracks the pointer exactly, and a gold ring
 * that lags behind on a lerp. The ring expands over anything interactive.
 *
 * Position is written straight to the DOM via rAF rather than through React
 * state — re-rendering on every mousemove would drop frames.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const [mode, setMode] = useState('default'); // default | hover | media
  const [visible, setVisible] = useState(false);

  const finePointer = useFinePointer();
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!finePointer) return undefined;

    let frame;

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Interactive elements opt in via [data-cursor], with a sensible
      // fallback for anything natively clickable.
      const el = e.target instanceof Element ? e.target.closest('[data-cursor], a, button') : null;
      if (!el) {
        setMode('default');
        return;
      }
      setMode(el.getAttribute('data-cursor') === 'media' ? 'media' : 'hover');
    };

    const onLeave = () => setVisible(false);

    const render = () => {
      // Ring eases toward the pointer; dot snaps. The gap is the "trail".
      const ease = reduceMotion ? 1 : 0.16;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [finePointer, reduceMotion, visible]);

  if (!finePointer) return null;

  const ringSize =
    mode === 'media' ? 'h-24 w-24 border-gold/70' : mode === 'hover' ? 'h-14 w-14 border-gold' : 'h-8 w-8 border-gold/45';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[100] transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 rounded-full border transition-[height,width,border-color,background-color] duration-500 ease-cinematic ${ringSize} ${
          mode === 'media' ? 'bg-gold/[0.06] backdrop-blur-[1px]' : ''
        }`}
      >
        {mode === 'media' && (
          <span className="absolute inset-0 flex items-center justify-center text-[9px] uppercase tracking-marker text-champagne">
            View
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 h-1 w-1 rounded-full bg-champagne transition-opacity duration-300 ${
          mode === 'media' ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
