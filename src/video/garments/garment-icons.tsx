/** @jsxImportSource react */

import type { SVGProps } from 'react';

import type { Garment } from './garments';

/** Flat-sketch garment icons, drawn like a tech-pack line drawing. Decorative; labels carry the meaning. */
const PATHS: Record<Garment, string> = {
  // Collared shirt with a centre placket.
  shirt: 'M8 3l4 3 4-3 5 3-2 5-2-1v11H7V10l-2 1-2-5 5-3zM12 6v15M8 3l1.5 4L12 6l2.5 1L16 3',
  // Five-pocket jeans.
  denim: 'M6 3h12l1 18h-5l-2-11-2 11H5L6 3zM6 6h12M9 6c0 2 1 3 3 3s3-1 3-3',
  // Biker jacket with an asymmetric zip.
  leather: 'M9 3h6l5 3-1 6-2-1v10H7V11l-2 1-1-6 5-3zM9 3l5 8v10M7 14h3',
  // Hoodie with drawstrings and a kangaroo pocket.
  knit: 'M9 4a3 3 0 0 1 6 0l5 3-1 5-2-1v10H7V11l-2 1-1-5 5-3zM10.5 6v4M13.5 6v4M9 16h6v3H9z',
  // Low-top sneaker.
  footwear: 'M3 16v-5l5-1 3 2 4 1 6 1v2l-1 2H4l-1-2zM3 16h18M9 11l1 2M11 11l1 2',
  // Wrap dress with a tie waist.
  dress: 'M9 3h6l-1 6 5 12H5l5-12-1-6zM10 9h4M9 3l3 4 3-4',
};

export function GarmentIcon({ garment, ...props }: { garment: Garment } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={PATHS[garment]} />
    </svg>
  );
}
