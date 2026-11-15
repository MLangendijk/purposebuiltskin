import { useTranslator } from '@videojs/react';
import { useCallback } from 'react';

import { GARMENT_LABEL, type Garment } from './garments';

/** The translated department name for a garment, falling back to English (`atelier.garment.knit` → "Knitwear"). */
export function useGarmentLabel(): (garment: Garment) => string {
  const t = useTranslator();
  return useCallback((garment) => t(`atelier.garment.${garment}`, { default: GARMENT_LABEL[garment] }), [t]);
}
