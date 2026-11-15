/** @jsxImportSource react */

import type { ReactNode } from 'react';

import type { Garment } from './garments';

/*
 * The seek bar's playhead is the tool that finishes each garment as it moves: it knits the rows, does up the buttons,
 * sews along the chalk, presses the pleats, closes the zip. Drawn on a 28×36 box centred on the bar, in fine charcoal
 * line with pearl, silver and soft-gold fills, so it reads on light and dark materials alike.
 */

const INK = '#2a2826';
const PEARL = '#faf6ef';
const SILVER = '#dcd8d1';
const GOLD = '#c9ab72';

const PARTS: Record<Garment, ReactNode> = {
  // Knitting needle with a ball end, a loop of yarn still on it.
  knit: (
    <>
      <path d="M2 24c3-3 6-3 8.5 0" fill="none" stroke="#b9a58a" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 33L14 9" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M14 33L14 9" stroke={SILVER} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="6" r="4.5" fill={GOLD} stroke={INK} strokeWidth="1.5" />
      <ellipse cx="14" cy="23" rx="5" ry="2.2" fill="none" stroke="#b9a58a" strokeWidth="1.75" />
    </>
  ),
  // Four-hole pearl button, sewn on with blue thread.
  shirt: (
    <>
      <circle cx="14" cy="18" r="10.5" fill={PEARL} stroke={INK} strokeWidth="1.5" />
      <circle cx="14" cy="18" r="7.5" fill="none" stroke="#d9d1c2" strokeWidth="1.25" />
      <path d="M11.3 15.3l5.4 5.4M16.7 15.3l-5.4 5.4" stroke="#7d9cc2" strokeWidth="1.25" />
      <g fill="#5d6470">
        <circle cx="11.3" cy="15.3" r="1.4" />
        <circle cx="16.7" cy="15.3" r="1.4" />
        <circle cx="11.3" cy="20.7" r="1.4" />
        <circle cx="16.7" cy="20.7" r="1.4" />
      </g>
    </>
  ),
  // Sewing needle, trailing the thread of the seam it has sewn.
  tailoring: (
    <>
      <path d="M1 27c4 0 7-2 10-5" fill="none" stroke="#8a7a66" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M11.5 3h5v24l-2.5 7-2.5-7z" fill={SILVER} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="13" y="5" width="2" height="6" rx="1" fill={INK} />
    </>
  ),
  // A pressing iron, nose forward, pleats setting behind it.
  skirt: (
    <g transform="translate(28 0) scale(-1 1)">
      <path d="M5 14h13a6.5 6.5 0 0 1 6.5 6.5V26H3l2-12z" fill={PEARL} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 26h21.5v3.5H2.6z" fill={SILVER} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 14c0-5 2-7.5 7-7.5h3" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="19.5" r="1.8" fill={GOLD} />
    </g>
  ),
  // A fine zip pull in soft gold.
  dress: (
    <>
      <path d="M9 4h10l-1.5 8h-7z" fill={GOLD} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11.5 11.5h5l-.8 19a1.7 1.7 0 0 1-3.4 0z" fill={GOLD} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="14" cy="26.5" r="1.4" fill={INK} />
    </>
  ),
};

export function Hardware({ garment, swapped = false }: { garment: Garment; swapped?: boolean }) {
  return (
    <svg
      className="garment-hardware"
      data-swapped={swapped ? '' : undefined}
      viewBox="0 0 28 36"
      aria-hidden="true"
      focusable="false"
    >
      {PARTS[garment]}
    </svg>
  );
}
