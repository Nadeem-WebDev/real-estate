import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { LISTINGS } from '../data/listings';
import { SITE, openWhatsApp } from '../data/site';

const BUDGETS = ['₹25–50 Cr', '₹50–75 Cr', '₹75 Cr+', 'Advise me'];

/** Underlined field — no boxes anywhere in this form. */
function Field({ label, id, error, children }) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-3 block text-[10px] uppercase tracking-marker text-ash"
      >
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-[11px] text-gold"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

const inputClass =
  'w-full border-0 border-b border-white/15 bg-transparent pb-3 font-body text-base text-bone placeholder-white/20 transition-colors duration-500 focus:border-gold focus:outline-none focus:ring-0';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    interest: LISTINGS[0].id,
    budget: BUDGETS[0],
    note: '',
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    // Accepts 10 digits, optionally prefixed with +91 or 0.
    const digits = form.phone.replace(/[\s-]/g, '');
    if (!/^(\+91|0)?[6-9]\d{9}$/.test(digits)) {
      next.phone = 'Enter a 10-digit mobile number.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    const listing = LISTINGS.find((l) => l.id === form.interest);
    const message = [
      `Hello ${SITE.advisor},`,
      '',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Interested in: ${listing.title}, ${listing.locality}`,
      `Budget: ${form.budget}`,
      form.note.trim() ? `Note: ${form.note.trim()}` : null,
      '',
      'Please send the full details and available viewing times.',
    ]
      .filter(Boolean)
      .join('\n');

    openWhatsApp(message);
    setSent(true);
    // Reset the confirmation so the form stays usable for a second enquiry.
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <section id="enquire" className="relative bg-obsidian py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:gap-24 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-gold/50" />
            <span className="marker">Enquire</span>
          </div>
          <h2 className="font-display text-[11vw] leading-[0.95] tracking-[-0.02em] text-bone sm:text-6xl lg:text-[4.2rem]">
            Tell me what
            <br />
            <span className="italic text-champagne">you are looking for.</span>
          </h2>
          <p className="mt-7 max-w-sm text-[15px] font-light leading-relaxed text-bone/55">
            Your details go straight to my WhatsApp. I reply personally, usually
            within the hour between 9am and 9pm IST.
          </p>

          <div className="mt-12 space-y-5 border-t border-white/[0.07] pt-8">
            <a
              href={`mailto:${SITE.email}`}
              data-cursor="hover"
              className="link-underline block text-sm text-bone/70"
            >
              {SITE.email}
            </a>
            <p className="max-w-[16rem] text-sm leading-relaxed text-bone/45">
              {SITE.office}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          {/* Not a <form>: submission opens WhatsApp rather than POSTing,
              so there is no navigation to prevent. */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            <Field label="Full name" id="name" error={errors.name}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={update('name')}
                placeholder="Ananya Rao"
                className={inputClass}
              />
            </Field>

            <Field label="Mobile" id="phone" error={errors.phone}>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="+91 9XXXXXXXX"
                className={inputClass}
              />
            </Field>

            <Field label="Property of interest" id="interest">
              <select
                id="interest"
                value={form.interest}
                onChange={update('interest')}
                className={`${inputClass} appearance-none`}
              >
                {LISTINGS.map((l) => (
                  <option key={l.id} value={l.id} className="bg-graphite text-bone">
                    {l.title} — {l.locality}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Budget" id="budget">
              <select
                id="budget"
                value={form.budget}
                onChange={update('budget')}
                className={`${inputClass} appearance-none`}
              >
                {BUDGETS.map((b) => (
                  <option key={b} value={b} className="bg-graphite text-bone">
                    {b}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Anything specific? (optional)" id="note">
                <textarea
                  id="note"
                  rows={2}
                  value={form.note}
                  onChange={update('note')}
                  placeholder="Sea-facing, high floor, ready to move"
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start gap-5 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[19rem] text-[11px] leading-relaxed text-ash">
              By sending, you agree to be contacted about these residences. No
              marketing lists, no third parties.
            </p>
            <MagneticButton onClick={submit}>
              {sent ? (
                <>
                  <Check size={14} strokeWidth={1.5} /> Sent to WhatsApp
                </>
              ) : (
                <>
                  Send on WhatsApp <ArrowUpRight size={14} strokeWidth={1.5} />
                </>
              )}
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
