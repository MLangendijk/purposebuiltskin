/** @jsxImportSource react */

import type { ReactNode } from 'react';

import type { Garment } from './garments';

/*
 * The seek bar's playhead, as a piece of garment hardware. Drawn on a 28×36 box centred on the bar; the ink keyline
 * keeps each part visible over light and dark materials alike.
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
  // Hammered copper rivet.
  denim: (
    <>
      <circle cx="14" cy="18" r="11" fill="#b8682e" stroke={INK} strokeWidth="2" />
      <circle cx="14" cy="18" r="7" fill="#d98a48" stroke="#8a4a1f" strokeWidth="1.5" />
      <circle cx="14" cy="18" r="2.5" fill="#8a4a1f" />
      <path d="M9.5 13.5a6.5 6.5 0 0 1 5-2" stroke="#f3c08f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
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
  // Spring cord stopper threaded on a drawstring.
  knit: (
    <>
      <path d="M14 0v36" stroke="#f6f3ec" strokeWidth="4" />
      <rect x="6" y="9" width="16" height="18" rx="6" fill="#2c2d30" stroke={INK} strokeWidth="2" />
      <rect x="10" y="4" width="8" height="6" rx="2" fill="#d4ff1f" stroke={INK} strokeWidth="2" />
      <path d="M14 13v10" stroke="#f6f3ec" strokeWidth="3" />
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
  // Dressmaker's pin: round head, steel shaft.
  dress: (
    <>
      <path d="M14 14v21" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M14 14v21" stroke="#d9dce1" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="10" r="8" fill="#ff3d8b" stroke={INK} strokeWidth="2" />
      <circle cx="11.5" cy="7.5" r="2.2" fill="#ffd1e3" />
    </>
  ),
};

export function Hardware({ garment }: { garment: Garment }) {
  return (
    <svg className="garment-hardware" viewBox="0 0 28 36" aria-hidden="true" focusable="false">
      {PARTS[garment]}
    </svg>
  );
}
