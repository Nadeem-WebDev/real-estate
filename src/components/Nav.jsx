import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV, SITE } from '../data/site';
import { useLenis } from './SmoothScroll';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    lenis?.scrollTo(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-cinematic ${
          scrolled
            ? 'border-b border-white/[0.06] bg-obsidian/80 py-4 backdrop-blur-xl'
            : 'border-b border-transparent py-7'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <button
            onClick={() => go('#top')}
            data-cursor="hover"
            className="text-left"
          >
            <span className="block font-display text-lg tracking-wide text-bone">
              {SITE.brand}
            </span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-marker text-ash">
              Est. {SITE.established} · Mumbai
            </span>
          </button>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((item) => (
              <button
                key={item.href}
                onClick={() => go(item.href)}
                data-cursor="hover"
                className="link-underline text-[11px] uppercase tracking-marker text-bone/70 transition-colors duration-500 hover:text-bone"
              >
                {item.label}
              </button>
            ))}
            <a
              href={`tel:${SITE.whatsappDisplay.replace(/\s/g, '')}`}
              data-cursor="hover"
              className="rounded-full border border-gold/40 px-5 py-2.5 text-[11px] uppercase tracking-marker text-gold transition-colors duration-500 hover:bg-gold hover:text-obsidian"
            >
              {SITE.whatsappDisplay}
            </a>
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="text-bone md:hidden"
          >
            <Menu size={22} strokeWidth={1.25} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-obsidian/98 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-7">
              <span className="font-display text-lg text-bone">{SITE.brand}</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-bone">
                <X size={22} strokeWidth={1.25} />
              </button>
            </div>
            <nav className="flex flex-col px-6 pt-10">
              {NAV.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => go(item.href)}
                  className="border-b border-white/[0.07] py-6 text-left font-display text-3xl text-bone"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
