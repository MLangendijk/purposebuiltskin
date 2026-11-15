import type { Garment } from '../garments/garments';

/**
 * One look in the collection: the product worn in a stretch of the film. The film's chapters say where it plays: a
 * chapter names its look by id (Mux chapter metadata `look`, or a WebVTT cue identifier). Without a chapters track the
 * skin builds one from `start` and `end`.
 */
export interface Look {
  /** Look number shown on the tags, such as `03`. Chapters refer to the look by it. */
  id: string;
  /** Where the look starts and ends in the video, in seconds. Only needed when the film has no chapters. */
  start?: number;
  end?: number;
  /** Product name, such as `Night Shift Leather Jacket`. */
  name: string;
  /** Short name for tight spaces, such as `Night Shift Leather`. */
  shortName?: string;
  /** What kind of garment it is. Picks the seek-bar material, playhead hardware and icon for this stretch. */
  garment: Garment;
  /** Colorway, such as `Oxblood`. */
  color?: string;
  /** Fabric composition for the care label, such as `100% cotton oxford`. */
  fabric?: string;
  /** Care line for the care label, such as `Machine wash 30°`. */
  care?: string;
  /** Price in the shop's currency. */
  price: number;
  /** Product shot, ideally a 3:4 crop. */
  image?: string;
  sizes: string[];
  /** What the sizes mean, shown with the size picker, such as `Waist in inches`. */
  sizeGuide?: string;
  /** Flags a look as nearly gone. */
  lowStock?: boolean;
}

export interface BagItem {
  look: Look;
  size: string;
}

/** The shop the skin sells from. Everything except `looks` has a default. */
export interface ShopConfig {
  looks: Look[];
  /** House name, shown as the wordmark. */
  brand?: string;
  /** Collection name, such as `The Spring Edit`. */
  collection?: string;
  /** Season line, such as `SS27`. */
  season?: string;
  /** The season written out, used to expand the abbreviation, such as `Spring/Summer 2027`. */
  seasonName?: string;
  /** ISO currency code for prices. */
  currency?: string;
  /** Locale for prices. */
  locale?: string;
  /** Called after an item lands in the bag, so the host page can sync its own cart. */
  onAddToBag?: (item: BagItem) => void;
  /** Called when the shopper presses checkout. Without it the bag shows a demo notice. */
  onCheckout?: (items: BagItem[]) => void;
}
