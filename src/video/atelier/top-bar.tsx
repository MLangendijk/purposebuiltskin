/** @jsxImportSource react */

import type { ReactNode } from 'react';

import { BagMenu } from '../shop/bag-menu';
import { useShop } from '../shop/shop-context';

/**
 * The house wordmark and the bag. Compact players also keep sound and time (`start`, after the wordmark) and settings
 * here, so the garment strip gets the bottom row to itself.
 */
export function TopBar({ start, settings }: { start?: ReactNode; settings?: ReactNode } = {}) {
  const { config } = useShop();

  return (
    <>
      <span className="atelier-stamp" aria-hidden="true">
        {config.brand}
      </span>
      {start && <span className="atelier-top-start">{start}</span>}
      <span className="atelier-top-actions">
        {settings}
        <BagMenu />
      </span>
    </>
  );
}
