/**
 * The garment types the skin knows how to draw. In the seek bar each one is finished as it plays, and the playhead is
 * the tool that does the finishing:
 *
 * - knit: loose yarn ahead, knitted stocking stitch behind; the playhead is a knitting needle.
 * - shirt: buttonholes ahead, pearl buttons done up behind; the playhead is a button.
 * - tailoring: tailor's chalk lines ahead, a sewn seam behind; the playhead is the needle sewing along the chalk.
 * - skirt: flat crepe ahead, pressed pleats behind; the playhead is an iron.
 * - dress: the back zip open ahead, closed behind; the playhead is a fine zip pull.
 * - other: anything else is drawn as a toile, the calico mock-up every garment starts as: the pattern line traced
 *   ahead, basted behind; the playhead is a tracing wheel.
 */
export const GARMENTS = ['knit', 'shirt', 'tailoring', 'skirt', 'dress', 'other'] as const;

export type Garment = (typeof GARMENTS)[number];

/** Department name, as it reads on a boutique's floor plan. */
export const GARMENT_LABEL: Record<Garment, string> = {
  knit: 'Knitwear',
  shirt: 'Shirting',
  tailoring: 'Tailoring',
  skirt: 'Skirts',
  dress: 'Dresses',
  other: 'Pieces',
};

/** A garment from its key or department name, in any case: `knit`, `Knitwear`. */
export function parseGarment(name: string | undefined): Garment | undefined {
  const value = name?.trim().toLowerCase();
  if (!value) return undefined;
  return GARMENTS.find((garment) => garment === value || GARMENT_LABEL[garment].toLowerCase() === value);
}

/** The part of a chapter title before its separator: `Knitwear` in `Knitwear · Cable-Knit Jumper`. */
export function titleHead(title: string | undefined): string | undefined {
  const parts = title?.split(/[·:|—]/);
  return parts && parts.length > 1 ? parts[0]!.trim() : undefined;
}

/**
 * Reads the garment from a chapter title, so the seek bar can take its materials from the chapters themselves (on
 * Mux, or a WebVTT file). Titles start with the department or the garment key: `Knitwear · Cable-Knit Jumper`,
 * `knit: Cable-Knit Jumper`.
 */
export function garmentFromTitle(title: string | undefined): Garment | undefined {
  return parseGarment(titleHead(title) ?? title);
}
