/** @jsxImportSource react */

import type { ReactNode } from 'react';

import { BagMenu } from '../shop/bag-menu';
import { useShop } from '../shop/shop-context';

/** The house wordmark and the bag. Compact players also keep their settings here. */
export function TopBar({ settings }: { settings?: ReactNode } = {}) {
  const { config } = useShop();

  return (
    <>
      <span className="drop-stamp" aria-hidden="true">
        {config.brand}
      </span>
      <span className="drop-top-actions">
        {settings}
        <BagMenu />
      </span>
    </>
  );
}
