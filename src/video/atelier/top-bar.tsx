/** @jsxImportSource react */

import type { ReactNode } from 'react';

import { BagMenu } from '../shop/bag-menu';
import { useShop } from '../shop/shop-context';

/** The house wordmark and the bag. Compact players also keep their settings here. */
export function TopBar({ settings }: { settings?: ReactNode } = {}) {
  const { config } = useShop();

  return (
    <>
      <span className="atelier-stamp" aria-hidden="true">
        {config.brand}
      </span>
      <span className="atelier-top-actions">
        {settings}
        <BagMenu />
      </span>
    </>
  );
}
