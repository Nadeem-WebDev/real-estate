// Single source of truth for anything the client will want to swap.
export const SITE = {
  brand: 'Kapadia Estates',
  advisor: 'Rhea Kapadia',
  // Country code + number, digits only. No plus, no spaces — wa.me is strict.
  whatsapp: '918972469383',
  whatsappDisplay: '+91 8972469383',
  email: 'private@kapadiaestates.in',
  office: 'Level 21, One Lodha Place, Lower Parel, Mumbai 400013',
  rera: 'MahaRERA A51900012345',
  established: 2009,
};

export const NAV = [
  { label: 'Residences', href: '#residences' },
  { label: 'Advisor', href: '#advisor' },
  { label: 'Enquire', href: '#enquire' },
];

/**
 * Opens WhatsApp with a pre-filled message.
 * Uses wa.me, which routes to the app on mobile and WhatsApp Web on desktop.
 */
export function openWhatsApp(message) {
  const url = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
