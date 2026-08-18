import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BedDouble, Bath, Maximize, Compass, ArrowUpRight } from 'lucide-react';
import { LISTINGS } from '../data/listings';
import { SITE, openWhatsApp } from '../data/site';
import { usePrefersReducedMotion } from '../hooks/useEnvironment';

gsap.registerPlugin(ScrollTrigger);

function Spec({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={13} strokeWidth={1.25} className="text-gold/70" />
      <span className="text-[12px] text-bone/75">{value}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function PropertyCard({ listing }) {
  const enquire = () =>
    openWhatsApp(
      `Hello ${SITE.advisor}, I'd like details on the ${listing.title} in ${listing.locality} (${listing.price}, ${listing.sqft.toLocaleString('en-IN')} sq ft). When can I view it?`
    );

  return (
    <article className="property-card group flex flex-col">
      {/* Image well. overflow-hidden is what lets the 5% scale read as a
          slow push-in rather than the whole card growing. */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-graphite"
        data-cursor="media"
      >
        <img
          src={listing.image}
          alt={listing.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-cinematic group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-40" />

        {/* Status badge floats over the image, top-left. */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-obsidian/55 px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-gold" />
          <span className="text-[9px] uppercase tracking-marker text-champagne">
            {listing.status}
          </span>
        </div>

        {/* Floor plate — the number that ties the card to the elevation rail. */}
        <div className="absolute bottom-4 right-4 text-right">
          <span className="block font-display text-3xl leading-none text-bone/90">
            {String(listing.floor).padStart(2, '0')}
          </span>
          <span className="mt-1 block text-[8px] uppercase tracking-marker text-bone/50">
            Floor · {listing.elevation}m
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl leading-tight text-bone">{listing.title}</h3>
            <p className="mt-1.5 text-[11px] uppercase tracking-marker text-ash">
              {listing.locality}
            </p>
          </div>
          <span className="shrink-0 font-display text-xl text-gold">{listing.price}</span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-5">
          <Spec icon={BedDouble} value={`${listing.beds} bed`} label="bedrooms" />
          <Spec icon={Bath} value={`${listing.baths} bath`} label="bathrooms" />
          <Spec
            icon={Maximize}
            value={`${listing.sqft.toLocaleString('en-IN')} sq ft`}
            label="carpet area"
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Compass size={13} strokeWidth={1.25} className="text-gold/70" />
          <span className="text-[12px] text-bone/55">{listing.orientation}</span>
        </div>

        <button
          onClick={enquire}
          data-cursor="hover"
          className="mt-6 flex w-full items-center justify-between border-t border-white/[0.07] pt-5 text-left text-[11px] uppercase tracking-marker text-bone/70 transition-colors duration-500 hover:text-gold"
        >
          Request details
          <ArrowUpRight
            size={15}
            strokeWidth={1.25}
            className="transition-transform duration-500 ease-cinematic group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </article>
  );
}

export default function Properties() {
  const root = useRef(null);
  const railFill = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;

    // gsap.context scopes every selector to this subtree and gives us a
    // single revert() that kills the tweens *and* their ScrollTriggers.
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.property-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 90, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
            // Stagger by column so a row resolves left-to-right.
            delay: (i % 3) * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Rail fills in proportion to scroll through the section.
      gsap.fromTo(
        railFill.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 65%',
            end: 'bottom 85%',
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        '.section-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.section-line', start: 'top 92%' },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      id="residences"
      ref={root}
      className="relative bg-obsidian py-28 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-gold/50" />
              <span className="marker">Current portfolio</span>
            </div>
            <h2 className="max-w-2xl font-display text-[10vw] leading-[0.95] tracking-[-0.02em] text-bone sm:text-6xl lg:text-7xl">
              Six residences,
              <br />
              <span className="italic text-champagne">ordered by altitude.</span>
            </h2>
          </div>
          <p className="max-w-xs text-[14px] font-light leading-relaxed text-bone/55">
            In this city, height and orientation set the price before the finishes
            do. Each home below is pinned to its floor plate and metres above sea
            level.
          </p>
        </div>

        <div className="section-line rule mt-14 origin-left" />

        {/* Rail + grid. The rail is the section's spine on desktop; it is
            hidden on narrow screens where there is no room for it to mean
            anything. */}
        <div className="relative mt-14 lg:pl-20">
          <div
            aria-hidden="true"
            className="absolute left-6 top-2 hidden h-full w-px bg-white/[0.07] lg:block"
          >
            <div
              ref={railFill}
              className="h-full w-full origin-top scale-y-0 bg-gradient-to-b from-gold via-gold/60 to-transparent"
            />
            <span className="absolute -left-[6px] top-0 h-3 w-3 rounded-full border border-gold/60 bg-obsidian" />
            <span className="absolute -left-4 top-6 rotate-180 text-[9px] uppercase tracking-marker text-ash [writing-mode:vertical-rl]">
              214m — sea level
            </span>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {LISTINGS.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
