import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Properties from './components/Properties';
import Broker from './components/Broker';
import Contact from './components/Contact';
import WhatsAppFab from './components/WhatsAppFab';
import Footer from './components/Footer';
import { SITE } from './data/site';

/**
 * Entry curtain. Holds for a beat so the hero's background image has time to
 * decode, then lifts — which is what makes the headline reveal land cleanly
 * instead of racing an unpainted image.
 */
function Curtain({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      exit={{ y: '-100%' }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-obsidian"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="font-display text-2xl tracking-wide text-bone">{SITE.brand}</p>
        <div className="mx-auto mt-4 h-px w-16 overflow-hidden bg-white/10">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
            className="h-full w-full bg-gold"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  // Lock scroll behind the curtain so the visitor cannot scroll blind.
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <SmoothScroll>
      <Cursor />

      <AnimatePresence>
        {loading && <Curtain key="curtain" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Nav />

      <main>
        <Hero />
        <Properties />
        <Broker />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFab />
    </SmoothScroll>
  );
}
