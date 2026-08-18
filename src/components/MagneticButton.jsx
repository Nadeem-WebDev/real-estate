import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion, useFinePointer } from '../hooks/useEnvironment';

/**
 * Button that drifts toward the pointer while it's within its bounds.
 * `strength` caps the pull so it stays restrained rather than springy.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  strength = 0.25,
  variant = 'solid',
  type = 'button',
  ...rest
}) {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const magnetic = finePointer && !reduceMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 140, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 140, damping: 18, mass: 0.6 });

  const onMove = (e) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-[11px] font-medium uppercase tracking-marker transition-colors duration-500 ease-cinematic';

  const skin =
    variant === 'solid'
      ? 'bg-gold text-obsidian hover:bg-champagne'
      : 'border border-white/20 text-bone hover:border-gold hover:text-gold';

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      data-cursor="hover"
      className={`${base} ${skin} ${className}`}
      {...rest}
    >
      {/* Glow sits behind the label and blooms outward on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity duration-700 ease-cinematic group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle at center, #d4af37 0%, transparent 70%)' }}
      />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </motion.button>
  );
}
