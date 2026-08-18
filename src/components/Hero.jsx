import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import MagneticButton from './MagneticButton';
import HeroScene from './HeroScene';
import { useLenis } from './SmoothScroll';
import { useIsCompact, usePrefersReducedMotion } from '../hooks/useEnvironment';
import { SITE } from '../data/site';

const HEADLINE = [
  { text: 'Exclusive', italic: false },
  { text: 'Properties.', italic: false },
  { text: 'Extraordinary', italic: true },
  { text: 'Living.', italic: true },
];

// Words rise out of a clipping mask — the mask is what makes it read as
// typographic rather than a generic fade.
const wordVariants = {
  hidden: { y: '108%' },
  show: (i) => ({
    y: '0%',
    transition: { duration: 1.25, delay: 0.55 + i * 0.11, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const lenis = useLenis();
  const isCompact = useIsCompact();
  const reduceMotion = usePrefersReducedMotion();
  const show3D = !isCompact && !reduceMotion;

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Layer 1 — architectural plate, very slowly pushing in. */}
      <motion.div
        initial={{ scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1080&auto=format&fit=crop"
          alt="Tower residence at dusk with lit interiors overlooking the sea"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Layer 2 — grading. Two gradients: one for legibility at the base,
          one to sink the corners so the type sits forward. */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_92%)]" />

      {/* Layer 3 — 3D glass. Desktop only; it is decoration, not content. */}
      {show3D && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 1.2 }}
          className="pointer-events-none absolute inset-0 z-[1]"
        >
          <HeroScene />
        </motion.div>
      )}

      {/* Layer 4 — content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-6 pb-16 pt-32 lg:px-12 lg:pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-gold/50" />
          <span className="marker">Worli · Malabar Hill · Bandra</span>
        </motion.div>

        <h1 className="max-w-5xl font-display text-[13vw] font-normal leading-[0.92] tracking-[-0.02em] text-bone sm:text-[9vw] lg:text-[6.4vw]">
          {HEADLINE.map((word, i) => (
            <span key={word.text} className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em]">
              <motion.span
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="show"
                className={`inline-block ${word.italic ? 'italic text-champagne' : ''}`}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-10 border-t border-white/[0.08] pt-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-md text-[15px] font-light leading-relaxed text-bone/60">
            A private brokerage for sea-facing residences on the western coastline.
            Twenty-two homes released this year. Most were never listed publicly.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton onClick={() => lenis?.scrollTo('#residences')}>
              View portfolio
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={() => lenis?.scrollTo('#enquire')}>
              Book a viewing
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* Scroll affordance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.3, 1] }}
        transition={{ duration: 4, delay: 2.4, repeat: Infinity, repeatDelay: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-gold/60"
        aria-hidden="true"
      >
        <ArrowDown size={16} strokeWidth={1} />
      </motion.div>

      <span className="sr-only">
        {SITE.brand} — MahaRERA registered brokerage, Mumbai.
      </span>
    </section>
  );
}
