import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE, openWhatsApp } from '../data/site';
import { usePrefersReducedMotion } from '../hooks/useEnvironment';

/**
 * Fixed conversion button. Appears once the visitor is past the hero, so it
 * never competes with the primary CTA on first paint.
 */
export default function WhatsAppFab() {
  const [shown, setShown] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const start = () =>
    openWhatsApp(
      `Hello ${SITE.advisor}, I saw your portfolio and would like to discuss a sea-facing residence in Mumbai.`
    );

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[70] lg:bottom-9 lg:right-9"
        >
          {/* Halo. Two offset rings so the pulse never fully clears — it
              reads as a slow breath rather than a blinking beacon. */}
          {!reduceMotion &&
            [0, 1.4].map((delay) => (
              <motion.span
                key={delay}
                aria-hidden="true"
                initial={{ scale: 1, opacity: 0.45 }}
                animate={{ scale: 1.85, opacity: 0 }}
                transition={{ duration: 2.8, repeat: Infinity, delay, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-gold"
              />
            ))}

          <motion.button
            onClick={start}
            onHoverStart={() => setExpanded(true)}
            onHoverEnd={() => setExpanded(false)}
            whileTap={{ scale: 0.94 }}
            data-cursor="hover"
            aria-label={`Chat with ${SITE.advisor} on WhatsApp`}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold text-obsidian shadow-[0_10px_40px_-8px_rgba(212,175,55,0.55)] transition-colors duration-500 hover:bg-champagne"
          >
            {/* Inline WhatsApp glyph — lucide-react has no brand marks. */}
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.23 8.23 0 0 1 .01 16.47z" />
            </svg>
          </motion.button>

          {/* Label slides out from behind the button on hover. */}
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute right-[74px] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-obsidian/90 px-5 py-3 text-[10px] uppercase tracking-marker text-champagne backdrop-blur-md lg:block"
              >
                Chat on WhatsApp
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
