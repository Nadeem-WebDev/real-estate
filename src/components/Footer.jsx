import { SITE, NAV } from '../data/site';
import { useLenis } from './SmoothScroll';

const LEGAL = [
  { label: 'Privacy policy', href: '#' },
  { label: 'Terms of engagement', href: '#' },
  { label: 'RERA disclosures', href: '#' },
];

export default function Footer() {
  const lenis = useLenis();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.07] bg-graphite">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-display text-2xl text-bone">{SITE.brand}</p>
            <p className="mt-3 max-w-[15rem] text-[13px] font-light leading-relaxed text-bone/45">
              Private residential brokerage. Western coastline, Mumbai.
            </p>
          </div>

          <div>
            <p className="marker mb-5">Navigate</p>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => lenis?.scrollTo(item.href)}
                    data-cursor="hover"
                    className="link-underline text-[13px] text-bone/60 transition-colors duration-500 hover:text-bone"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="marker mb-5">Legal</p>
            <ul className="space-y-3">
              {LEGAL.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    data-cursor="hover"
                    className="link-underline text-[13px] text-bone/60 transition-colors duration-500 hover:text-bone"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="marker mb-5">Direct</p>
            <ul className="space-y-3 text-[13px] text-bone/60">
              <li>
                <a
                  href={`tel:+${SITE.whatsapp}`}
                  data-cursor="hover"
                  className="link-underline"
                >
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} data-cursor="hover" className="link-underline">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/[0.07] pt-8">
          <p className="max-w-3xl text-[11px] leading-relaxed text-ash">
            {SITE.rera}. All areas stated are carpet areas as defined under RERA and
            are indicative until verified against the registered agreement. Images
            are representative. Prices are exclusive of stamp duty, registration and
            GST, and are subject to change without notice.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-ash">
              © {year} {SITE.brand}. All rights reserved.
            </p>
            <p className="text-[11px] text-ash">Mumbai, Maharashtra, India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
