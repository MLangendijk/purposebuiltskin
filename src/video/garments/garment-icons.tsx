/** @jsxImportSource react */

import type { SVGProps } from 'react';

import type { Garment } from './garments';

/** Fine-line garment sketches, drawn like a designer's flat. Decorative; labels carry the meaning. */
const PATHS: Record<Garment, string> = {
  // Crew-neck jumper with ribbed cuffs and hem.
  knit: 'M8.5 3.5c1 1.5 2 2 3.5 2s2.5-.5 3.5-2l5 3-1.5 5-2-1V20h-10V10.5l-2 1-1.5-5 5-3zM7 18h10M3.5 9.5l2 .8M20.5 9.5l-2 .8',
  // Collared shirt with a centre placket.
  shirt: 'M8 3l4 3 4-3 5 3-2 5-2-1v11H7V10l-2 1-2-5 5-3zM12 6v15M8 3l1.5 4L12 6l2.5 1L16 3',
  // Single-breasted blazer with notch lapels.
  tailoring: 'M9 3h6l5 3-1 15h-5l-2-9-2 9H5L4 6l5-3zM9 3l3 9 3-9M10.5 15.5h.01M10.5 18h.01',
  // A-line pleated midi skirt.
  skirt: 'M7.5 4h9l3.5 16H4L7.5 4zM7.5 7h9M10 7l-1.5 13M14 7l1.5 13M12 7v13',
  // Fitted maxi dress with a tie waist.
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
      strokeWidth="1.4"
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
