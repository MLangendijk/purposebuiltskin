/**
 * The garment types the skin knows how to draw. In the seek bar, each one is finished as it plays, and the playhead is
 * the tool that does the finishing:
 *
 * - shirt: buttonholes ahead, buttons done up behind; the playhead is a button.
 * - denim: light-wash twill ahead, raw indigo with orange topstitching behind; the playhead is the needle sewing it.
 * - leather: an open zipper ahead, zipped shut behind; the playhead is the zip pull.
 * - knit: flat jersey ahead, rib knit with the drawstring threaded behind; the playhead is the safety pin threading it.
 * - footwear: bare eyelets ahead, laces criss-crossed behind; the playhead is the lace's aglet.
 * - dress: flat crepe ahead, pressed printed pleats behind; the playhead is the iron pressing them.
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
