import { useTranslator } from '@videojs/react';

import { GARMENT_LABEL, type Garment } from './garments';

/** The translated department name for a garment, falling back to English (`drop.garment.knit` → "Knitwear"). */
export function useGarmentLabel(): (garment: Garment) => string {
  const t = useTranslator();
  return (garment) => t(`drop.garment.${garment}`, { default: GARMENT_LABEL[garment] });
}
