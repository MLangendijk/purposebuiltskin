import type { ShopConfig } from '@/video/skin';

/**
 * The demo drop: six garments, seven seconds each, cut from Mixkit footage by `scripts/build-media.sh`. One product
 * per look; prices and products are fictional.
 */
const media = (file: string) => `./media/${file}`;

export const DROP_004: ShopConfig = {
  brand: 'NØ SIGNAL',
  drop: 'Drop 004',
  season: 'SS27',
  seasonName: 'Spring/Summer 2027',
  currency: 'EUR',
  locale: 'en-IE',
  looks: [
    {
      id: '01',
      start: 0,
      end: 7,
      garment: 'shirt',
      name: 'Oxford Button-Down Shirt',
      shortName: 'Oxford Button-Down',
      color: 'Powder Blue',
      fabric: '100% cotton oxford',
      care: 'Wash 30° · Iron medium',
      price: 89,
      image: media('look-01.jpg'),
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      sizeGuide: 'Extra small to extra large',
    },
    {
      id: '02',
      start: 7,
      end: 14,
      garment: 'denim',
      name: 'Straight Selvedge Jean',
      shortName: 'Straight Selvedge',
      color: 'Mid Wash',
      fabric: '13.5oz selvedge denim',
      care: 'Wash cold · Inside out',
      price: 149,
      image: media('look-02.jpg'),
      sizes: ['W26', 'W28', 'W30', 'W32', 'W34'],
      sizeGuide: 'W = waist in inches',
    },
    {
      id: '03',
      start: 14,
      end: 21,
      garment: 'leather',
      name: 'Studded Leather Biker',
      shortName: 'Studded Biker',
      color: 'Black / Nickel',
      fabric: 'Lambskin · Nickel hardware',
      care: 'Specialist leather clean',
      price: 420,
      image: media('look-03.jpg'),
      sizes: ['XS', 'S', 'M', 'L'],
      sizeGuide: 'Extra small to large',
      lowStock: true,
    },
    {
      id: '04',
      start: 21,
      end: 28,
      garment: 'knit',
      name: 'Heavyweight Oversized Hoodie',
      shortName: 'Heavyweight Hoodie',
      color: 'Heather Grey',
      fabric: '480gsm brushed fleece',
      care: 'Wash 30° · Do not tumble',
      price: 110,
      image: media('look-04.jpg'),
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      sizeGuide: 'Extra small to extra large',
    },
    {
      id: '05',
      start: 28,
      end: 35,
      garment: 'footwear',
      name: 'Court Low Sneaker',
      shortName: 'Court Low',
      color: 'Triple White',
      fabric: 'Full-grain leather upper',
      care: 'Wipe clean',
      price: 130,
      image: media('look-05.jpg'),
      sizes: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43'],
      sizeGuide: 'European shoe sizes',
    },
    {
      id: '06',
      start: 35,
      end: 42,
      garment: 'dress',
      name: 'Print Blazer Dress',
      shortName: 'Print Blazer Dress',
      color: 'Black / Ivory',
      fabric: 'Viscose crepe',
      care: 'Dry clean only',
      price: 195,
      image: media('look-06.jpg'),
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
  { time: '0:00', text: 'Close-up: a man does up the buttons of a powder-blue oxford shirt, working down the placket.' },
  {
    time: '0:07',
    text: 'From behind, a woman walks down a country road in mid-wash straight jeans and a green flannel shirt, a phone in her back pocket.',
  },
  {
    time: '0:14',
    text: 'Extreme close-up of a black studded leather biker jacket painted with grey graffiti, its silver zipper catching the light.',
  },
  {
    time: '0:21',
    text: 'On a rooftop, a woman in an oversized heather-grey hoodie pulls the hood up, then lowers it and stretches her arms overhead.',
  },
  { time: '0:28', text: 'Crouched on asphalt, someone ties the laces of white leather sneakers.' },
  {
    time: '0:35',
    text: 'In a boutique lined with clothing racks, a woman stands and poses in a black-and-ivory print blazer dress.',
  },
];
