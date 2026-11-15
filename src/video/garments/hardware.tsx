/** @jsxImportSource react */

import type { ReactNode } from 'react';

import type { Garment } from './garments';

/*
 * The seek bar's playhead is the tool that finishes each garment as it moves: it does up the shirt's buttons, sews the
 * denim's seam, closes the zipper, threads the drawstring, laces the shoe, presses the pleats. Drawn on a 28×36 box
 * centred on the bar; the ink keyline keeps each one visible over light and dark materials alike.
 */

const INK = '#0b0b0c';

const PARTS: Record<Garment, ReactNode> = {
  // Four-hole shirt button, sewn on with blue thread.
  shirt: (
    <>
      <circle cx="14" cy="18" r="11" fill="#f6f3ec" stroke={INK} strokeWidth="2" />
      <circle cx="14" cy="18" r="7.5" fill="none" stroke="#cfc8b8" strokeWidth="1.5" />
      <path d="M11 15l6 6M17 15l-6 6" stroke="#5f86b5" strokeWidth="1.5" />
      <g fill="#4b5563">
        <circle cx="11" cy="15" r="1.6" />
        <circle cx="17" cy="15" r="1.6" />
        <circle cx="11" cy="21" r="1.6" />
        <circle cx="17" cy="21" r="1.6" />
      </g>
    </>
  ),
  // Sewing needle, trailing the orange topstitch thread it lays down.
  denim: (
    <>
      <path d="M1 30c4-1 7-3 9-6" stroke="#f0a043" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M11 3h6v25l-3 7-3-7z" fill="#d9dce1" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="12.75" y="5" width="2.5" height="6" rx="1.25" fill={INK} />
    </>
  ),
  // Zip slider with a hanging pull tab.
  leather: (
    <>
      <path d="M7 4h14l-2 9H9z" fill="#d9dce1" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="9" y="11" width="10" height="23" rx="3" fill="#c3c7ce" stroke={INK} strokeWidth="2" />
      <rect x="12" y="25" width="4" height="5" rx="1.5" fill={INK} />
      <path d="M11.5 15h5" stroke="#f1f2f4" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  // Safety pin: how a drawstring is threaded through its channel.
  knit: (
    <>
      <path d="M0 18h8" stroke="#f6f3ec" strokeWidth="4" strokeLinecap="round" />
      <path d="M0 18h8" stroke={INK} strokeWidth="1" opacity="0.4" />
      <path
        d="M9 31V8a5 5 0 0 1 10 0v21"
        fill="none"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M9 31V8a5 5 0 0 1 10 0v21" fill="none" stroke="#d9dce1" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="9" cy="32" r="3.5" fill="#d9dce1" stroke={INK} strokeWidth="2" />
      <rect x="15" y="26" width="8" height="9" rx="2" fill="#c3c7ce" stroke={INK} strokeWidth="2" />
    </>
  ),
  // Lace end with a clear plastic aglet.
  footwear: (
    <>
      <path d="M14 0v16" stroke="#f6f3ec" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 0v16" stroke={INK} strokeWidth="1" strokeDasharray="2 2" opacity="0.35" />
      <rect x="9.5" y="14" width="9" height="20" rx="4.5" fill="#cfd5dc" stroke={INK} strokeWidth="2" />
      <path d="M12 18v12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  // Iron, nose forward, pressing the pleats in behind it.
  dress: (
    <g transform="translate(28 0) scale(-1 1)">
      <path d="M5 13h14a6 6 0 0 1 6 6v6H3l2-12z" fill="#f6f3ec" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 25h22v4H2.5z" fill="#d9dce1" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 13c0-5 2-7 7-7h3" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="18.5" r="2" fill="#ff3d8b" stroke={INK} strokeWidth="1.5" />
    </g>
  ),
};

export function Hardware({ garment }: { garment: Garment }) {
  return (
    <svg className="garment-hardware" viewBox="0 0 28 36" aria-hidden="true" focusable="false">
      {PARTS[garment]}
    </svg>
  );
}
