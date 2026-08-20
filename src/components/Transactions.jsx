import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TRANSACTIONS } from '../data/transactions';
import { usePrefersReducedMotion } from '../hooks/useEnvironment';

gsap.registerPlugin(ScrollTrigger);

export default function Transactions() {
  const root = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.txn-row',
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: root.current, start: 'top 78%' },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section ref={root} className="border-t border-white/[0.06] bg-obsidian py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-gold/50" />
              <span className="marker">Closed</span>
            </div>
            <h2 className="font-display text-4xl leading-tight text-bone lg:text-5xl">
              Recent transactions
            </h2>
          </div>
          <p className="max-w-xs text-[13px] font-light leading-relaxed text-bone/45">
            Every deal below is registered and verifiable at the sub-registrar
            office for the relevant ward.
          </p>
        </div>

        <div className="mt-14">
          {/* Column headers are decorative on mobile — the row labels carry
              the meaning there, so they're hidden below lg. */}
          <div className="hidden grid-cols-12 gap-6 border-b border-white/[0.07] pb-4 lg:grid">
            <span className="col-span-4 marker">Residence</span>
            <span className="col-span-3 marker">Locality</span>
            <span className="col-span-2 marker">Value</span>
            <span className="col-span-2 marker">Closed</span>
            <span className="col-span-1 marker text-right">Days</span>
          </div>

          {TRANSACTIONS.map((t) => (
            <div
              key={`${t.locality}-${t.closed}`}
              className="txn-row grid grid-cols-2 gap-y-2 border-b border-white/[0.07] py-6 lg:grid-cols-12 lg:gap-6"
            >
              <span className="col-span-2 text-sm text-bone lg:col-span-4">{t.unit}</span>
              <span className="col-span-1 text-[13px] text-bone/55 lg:col-span-3">
                {t.locality}
              </span>
              <span className="col-span-1 text-right font-display text-lg text-gold lg:col-span-2 lg:text-left">
                {t.value}
              </span>
              <span className="col-span-1 text-[13px] text-bone/45 lg:col-span-2">
                {t.closed}
              </span>
              <span className="col-span-1 text-right text-[13px] tabular-nums text-bone/45 lg:col-span-1">
                {t.days}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
