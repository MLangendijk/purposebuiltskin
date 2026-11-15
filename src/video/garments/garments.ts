/**
 * The garment types the skin knows how to draw. Each one gets its own seek-bar material, playhead hardware, and icon:
 *
 * - shirt: a button placket. Buttonholes ahead, buttons done up behind the playhead, a shirt button as the playhead.
 * - denim: light-wash twill ahead, raw indigo with orange double stitching behind, a copper rivet as the playhead.
 * - leather: an open zipper ahead, zipped up behind, a zip pull as the playhead.
 * - knit: flat jersey ahead, rib knit with a drawstring behind, a cord stopper as the playhead.
 * - footwear: bare eyelets ahead, criss-cross laces behind, an aglet as the playhead.
 * - dress: flat crepe ahead, pressed printed pleats behind, a dressmaker's pin as the playhead.
 */
export const GARMENTS = ['shirt', 'denim', 'leather', 'knit', 'footwear', 'dress'] as const;

export type Garment = (typeof GARMENTS)[number];

/** Department name, as it reads on a shop floor sign. */
export const GARMENT_LABEL: Record<Garment, string> = {
  shirt: 'Shirting',
  denim: 'Denim',
  leather: 'Leather',
  knit: 'Knit',
  footwear: 'Footwear',
  dress: 'Dresses',
};
