/**
 * Maharashtra / Mumbai property acquisition costs.
 *
 * Rates change with each state budget. Treat these as defaults to be verified
 * against the current Maharashtra Stamp Act schedule and the IGR Maharashtra
 * site before the site goes live — the calculator surfaces a note saying so.
 */
export const RATES = {
  // Conveyance duty in Mumbai municipal limits: 5% base + 1% metro cess.
  stampDutyMumbai: 0.06,
  // Concession where the sole or first-named buyer is a woman.
  stampDutyWomanConcession: 0.01,
  // 1% of agreement value, capped, for consideration above ₹30 lakh.
  registrationRate: 0.01,
  registrationCap: 30000,
  // GST applies to under-construction only; nil once an OC is issued.
  gstUnderConstruction: 0.05,
  // TDS u/s 194-IA, deducted by the buyer, on consideration ≥ ₹50 lakh.
  tdsRate: 0.01,
  tdsThreshold: 5000000,
};

const CRORE = 10000000;

/** Formats paise-free rupee amounts in the Indian numbering system. */
export function formatINR(amount) {
  if (amount >= CRORE) {
    return `₹${(amount / CRORE).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Cr`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Returns the full line-item breakdown for a purchase.
 * `price` is the agreement value in rupees.
 */
export function calculateAcquisition({ price, womanBuyer, underConstruction }) {
  const stampRate =
    RATES.stampDutyMumbai - (womanBuyer ? RATES.stampDutyWomanConcession : 0);

  const stampDuty = price * stampRate;
  const registration = Math.min(price * RATES.registrationRate, RATES.registrationCap);
  const gst = underConstruction ? price * RATES.gstUnderConstruction : 0;
  const tds = price >= RATES.tdsThreshold ? price * RATES.tdsRate : 0;

  const lineItems = [
    {
      key: 'price',
      label: 'Agreement value',
      amount: price,
      note: 'Consideration stated in the sale agreement',
    },
    {
      key: 'stamp',
      label: 'Stamp duty',
      amount: stampDuty,
      note: `${(stampRate * 100).toFixed(0)}% — includes 1% metro cess${
        womanBuyer ? ', less the 1% concession' : ''
      }`,
    },
    {
      key: 'registration',
      label: 'Registration fee',
      amount: registration,
      note: registration === RATES.registrationCap ? 'Capped at ₹30,000' : '1% of value',
    },
    {
      key: 'gst',
      label: 'GST',
      amount: gst,
      note: underConstruction ? '5% — under construction, no ITC' : 'Nil — completed, OC issued',
    },
    {
      key: 'tds',
      label: 'TDS (section 194-IA)',
      amount: tds,
      note: 'Deducted by you and paid to the department',
    },
  ];

  // TDS is withheld from the seller's consideration, not paid on top of it,
  // so it is shown for cash-flow planning but excluded from the total outlay.
  const totalOutlay = price + stampDuty + registration + gst;
  const costOverPrice = totalOutlay - price;

  return {
    lineItems,
    totalOutlay,
    costOverPrice,
    costPercent: (costOverPrice / price) * 100,
  };
}
