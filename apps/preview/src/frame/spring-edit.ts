import type { ShopConfig } from '@/video/skin';

/**
 * The demo collection: five classic pieces, eight seconds each, cut from Mixkit footage by `scripts/build-media.sh`.
 * One product per look; the house, prices and products are fictional.
 */
const media = (file: string) => `./media/${file}`;

export const SPRING_EDIT: ShopConfig = {
  brand: 'Maison Marelle',
  collection: 'The Spring Edit',
  season: 'SS27',
  seasonName: 'Spring/Summer 2027',
  currency: 'EUR',
  locale: 'en-IE',
  looks: [
    {
      id: '01',
      start: 0,
      end: 8,
      garment: 'knit',
      name: 'Cable-Knit Cashmere Jumper',
      shortName: 'Cashmere Jumper',
      color: 'Oatmeal',
      fabric: '100% Mongolian cashmere',
      care: 'Hand wash cold · Dry flat',
      price: 240,
      image: media('look-01.jpg'),
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      sizeGuide: 'Extra small to extra large',
    },
    {
      id: '02',
      start: 8,
      end: 16,
      garment: 'shirt',
      name: 'Oxford Cotton Shirt',
      shortName: 'Oxford Shirt',
      color: 'Powder Blue',
      fabric: '100% cotton oxford · Mother-of-pearl buttons',
      care: 'Wash 30° · Iron medium',
      price: 120,
      image: media('look-02.jpg'),
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      sizeGuide: 'Extra small to extra large',
    },
    {
      id: '03',
      start: 16,
      end: 24,
      garment: 'tailoring',
      name: 'Single-Breasted Wool Blazer',
      shortName: 'Wool Blazer',
      color: 'Sand',
      fabric: 'Italian wool flannel · Half-lined',
      care: 'Dry clean only',
      price: 390,
      image: media('look-03.jpg'),
      sizes: ['34', '36', '38', '40', '42'],
      sizeGuide: 'European sizes',
      lowStock: true,
    },
    {
      id: '04',
      start: 24,
      end: 32,
      garment: 'skirt',
      name: 'Pleated Midi Skirt',
      shortName: 'Pleated Midi',
      color: 'Ivory',
      fabric: 'Recycled crepe de chine',
      care: 'Cool iron · Hang to dry',
      price: 160,
      image: media('look-04.jpg'),
      sizes: ['XS', 'S', 'M', 'L'],
      sizeGuide: 'Extra small to large',
    },
    {
      id: '05',
      start: 32,
      end: 40,
      garment: 'dress',
      name: 'Linen Maxi Dress',
      shortName: 'Linen Maxi',
      color: 'White',
      fabric: '100% European linen',
      care: 'Wash 30° · Steam to finish',
      price: 280,
      image: media('look-05.jpg'),
      sizes: ['XS', 'S', 'M', 'L'],
      sizeGuide: 'Extra small to large',
    },
  ],
};

/**
 * The described version of the film: what each look shows, for anyone who can't see it. There is no dialogue; the
 * soundtrack is captioned in `captions.vtt`.
 */
export const DESCRIBED_VERSION: { time: string; text: string }[] = [
  { time: '0:00', text: 'A rail of cable-knit jumpers in oatmeal, plum, slate and forest green, close-up as the camera glides along.' },
  { time: '0:08', text: 'Close-up: a man does up the buttons of a powder-blue oxford shirt, working down the placket.' },
  { time: '0:16', text: 'A woman in a sand-coloured wool blazer over a black top smiles as she talks, in a warm, book-lined room.' },
  { time: '0:24', text: 'In a wheat field at golden hour, a woman twirls and an ivory pleated skirt flares out around her.' },
  {
    time: '0:32',
    text: 'On a rock above a turquoise sea, a woman in a white linen maxi dress raises one arm as the wind lifts the skirt.',
  },
];
