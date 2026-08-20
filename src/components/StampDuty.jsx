import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { calculateAcquisition, formatINR } from '../lib/stampDuty';
import { SITE, openWhatsApp } from '../data/site';

const CRORE = 10000000;
const PRESETS = [38, 64, 86, 98];

function Toggle({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      data-cursor="hover"
      className="group flex w-full items-start justify-between gap-6 border-b border-white/[0.07] py-5 text-left"
    >
      <span>
        <span className="block text-sm text-bone/85">{label}</span>
        <span className="mt-1 block text-[12px] font-light text-ash">{hint}</span>
      </span>
      <span
        className={`mt-1 flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-500 ease-cinematic ${
          checked ? 'border-gold bg-gold/20' : 'border-white/20 bg-transparent'
        }`}
      >
        <span
          className={`h-3 w-3 rounded-full transition-all duration-500 ease-cinematic ${
            checked ? 'ml-[18px] bg-gold' : 'ml-[3px] bg-white/40'
          }`}
        />
      </span>
    </button>
  );
}

export default function StampDuty() {
  const [crore, setCrore] = useState(64);
  const [womanBuyer, setWomanBuyer] = useState(false);
  const [underConstruction, setUnderConstruction] = useState(false);

  const result = useMemo(
    () =>
      calculateAcquisition({
        price: crore * CRORE,
        womanBuyer,
        underConstruction,
      }),
    [crore, womanBuyer, underConstruction]
  );

  const discuss = () => {
    openWhatsApp(
      `Hello ${SITE.advisor}, I used the acquisition cost calculator for a ₹${crore} Cr purchase — total outlay came to ${formatINR(
        result.totalOutlay
      )}. Could you take me through the structuring?`
    );
  };

  return (
    <section id="costs" className="relative bg-graphite py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px w-12 bg-gold/50" />
          <span className="marker">Acquisition cost</span>
        </div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <h2 className="font-display text-[10vw] leading-[0.95] tracking-[-0.02em] text-bone sm:text-5xl lg:text-[3.6rem]">
              What it really
              <br />
              <span className="italic text-champagne">costs to close.</span>
            </h2>
            <p className="mt-7 max-w-sm text-[15px] font-light leading-relaxed text-bone/55">
              Stamp duty, registration and GST sit on top of the headline price.
              On a Mumbai purchase that is rarely less than six percent, and
              nobody puts it on a brochure.
            </p>

            <div className="mt-10">
              <label
                htmlFor="price"
                className="mb-4 block text-[10px] uppercase tracking-marker text-ash"
              >
                Agreement value
              </label>
              <p className="font-display text-4xl text-gold">₹{crore} Cr</p>
              <input
                id="price"
                type="range"
                min={5}
                max={150}
                step={1}
                value={crore}
                onChange={(e) => setCrore(Number(e.target.value))}
                className="mt-5 w-full accent-[#d4af37]"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setCrore(p)}
                    data-cursor="hover"
                    className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-marker transition-colors duration-500 ${
                      crore === p
                        ? 'border-gold text-gold'
                        : 'border-white/15 text-bone/50 hover:border-white/35'
                    }`}
                  >
                    ₹{p} Cr
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Toggle
                checked={womanBuyer}
                onChange={setWomanBuyer}
                label="Sole or first buyer is a woman"
                hint="Maharashtra allows a 1% stamp duty concession"
              />
              <Toggle
                checked={underConstruction}
                onChange={setUnderConstruction}
                label="Under construction"
                hint="GST applies until the occupancy certificate is issued"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="border border-white/[0.09] bg-obsidian p-7 lg:p-10">
              <dl>
                {result.lineItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-baseline justify-between gap-6 border-b border-white/[0.07] py-5 last:border-b-0"
                  >
                    <div>
                      <dt className="text-sm text-bone/85">{item.label}</dt>
                      <dd className="mt-1 text-[12px] font-light text-ash">{item.note}</dd>
                    </div>
                    <dd
                      className={`shrink-0 font-display text-lg tabular-nums ${
                        item.amount === 0 ? 'text-ash' : 'text-bone'
                      }`}
                    >
                      {item.amount === 0 ? '—' : formatINR(item.amount)}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 border-t border-gold/25 pt-8">
                <div className="flex items-baseline justify-between gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-marker text-gold">
                      Total outlay
                    </p>
                    <p className="mt-2 text-[12px] font-light text-ash">
                      {result.costPercent.toFixed(1)}% above the agreement value
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-4xl tabular-nums text-gold">
                    {formatINR(result.totalOutlay)}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 border-t border-white/[0.07] pt-6">
                <Info size={14} strokeWidth={1.25} className="mt-0.5 shrink-0 text-ash" />
                <p className="text-[11px] leading-relaxed text-ash">
                  Indicative only. Rates are revised in each state budget and
                  vary with municipal limits and ready-reckoner values. TDS is
                  withheld from the seller’s consideration rather than paid on
                  top, so it sits outside the total. Confirm against your
                  conveyancing advocate before committing.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <MagneticButton variant="ghost" onClick={discuss}>
                Discuss structuring
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
