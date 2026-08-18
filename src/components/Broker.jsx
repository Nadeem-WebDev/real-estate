import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { CREDENTIALS } from '../data/listings';
import { SITE } from '../data/site';
import { usePrefersReducedMotion } from '../hooks/useEnvironment';

const TITLES = [
  'Luxury Real Estate Advisor',
  'Sea-Facing Specialist, Worli',
  'MahaRERA Registered Broker',
];

/**
 * Types a phrase, holds, deletes, moves to the next. Falls back to plain
 * static text when reduced motion is requested — a caret blinking forever
 * is exactly the kind of thing that setting exists for.
 */
function TypedTitle() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const full = TITLES[index];
    const done = !deleting && text === full;
    const cleared = deleting && text === '';

    if (done) {
      const hold = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(hold);
    }
    if (cleared) {
      setDeleting(false);
      setIndex((i) => (i + 1) % TITLES.length);
      return undefined;
    }

    // Deletion runs faster than typing, which is how real typing reads.
    const tick = setTimeout(
      () => {
        setText((prev) =>
          deleting ? full.slice(0, prev.length - 1) : full.slice(0, prev.length + 1)
        );
      },
      deleting ? 32 : 62
    );
    return () => clearTimeout(tick);
  }, [text, deleting, index, reduceMotion]);

  if (reduceMotion) {
    return <span className="text-gold">{TITLES[0]}</span>;
  }

  return (
    <span className="text-gold" aria-label={TITLES[0]}>
      <span aria-hidden="true">{text}</span>
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1.05, repeat: Infinity, ease: 'linear' }}
        className="ml-0.5 inline-block h-[0.95em] w-[1px] translate-y-[0.12em] bg-gold"
      />
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Broker() {
  return (
    <section id="advisor" className="relative overflow-hidden bg-graphite py-28 lg:py-40">
      {/* Oversized ghosted initials — quiet texture, not a focal point. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-10 select-none font-display text-[34vw] leading-none text-white/[0.015] lg:-right-16"
      >
        RK
      </span>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:gap-20 lg:px-12">
        {/* Portrait — deliberately narrower than the text column and offset
            downward, so the layout reads asymmetric rather than split. */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="relative lg:col-span-5 lg:translate-y-10"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-obsidian" data-cursor="media">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1080&auto=format&fit=crop"
              alt={`${SITE.advisor}, principal advisor at ${SITE.brand}`}
              loading="lazy"
              className="h-full w-full object-cover grayscale transition-all duration-[1600ms] ease-cinematic hover:scale-[1.04] hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
          </div>

          <div className="absolute -bottom-5 -left-3 flex items-center gap-2.5 border border-gold/25 bg-obsidian px-4 py-3 lg:-left-8">
            <BadgeCheck size={15} strokeWidth={1.25} className="text-gold" />
            <span className="text-[10px] uppercase tracking-marker text-champagne">
              {SITE.rera}
            </span>
          </div>
        </motion.div>

        <div className="lg:col-span-7">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="h-px w-12 bg-gold/50" />
            <span className="marker">The advisor</span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-display text-[11vw] leading-[0.95] tracking-[-0.02em] text-bone sm:text-6xl lg:text-[4.4rem]"
          >
            {SITE.advisor}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-5 min-h-[1.6em] font-body text-sm uppercase tracking-[0.16em]"
          >
            <TypedTitle />
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-9 max-w-xl space-y-5 text-[15px] font-light leading-relaxed text-bone/60"
          >
            <p>
              Seventeen years on the same three kilometres of coastline. I represent
              eleven towers between Worli and Bandra, which means I usually know a
              home is coming to market a quarter before it does.
            </p>
            <p>
              I work with a small number of buyers at a time. If a residence is wrong
              for you, I will say so — the shortlist I send is genuinely short.
            </p>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            custom={4}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3"
          >
            {CREDENTIALS.map((item) => (
              <div key={item.label} className="bg-graphite px-6 py-7">
                <dt className="font-display text-3xl text-bone">{item.value}</dt>
                <dd className="mt-2 text-[10px] uppercase tracking-marker text-ash">
                  {item.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
