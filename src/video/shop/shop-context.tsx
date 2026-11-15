/** @jsxImportSource react */

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import type { BagItem, Look, ShopConfig } from './types';

interface ShopContextValue {
  /** Whether the skin was given a shop. Without one it's a plain player: no wordmark, bag, hangers or tags. */
  enabled: boolean;
  config: Required<Omit<ShopConfig, 'onAddToBag' | 'onCheckout'>> & Pick<ShopConfig, 'onAddToBag' | 'onCheckout'>;
  formatPrice: (value: number) => string;
  bag: BagItem[];
  addToBag: (item: BagItem) => void;
  removeFromBag: (index: number) => void;
  /** The look whose product sheet is open, or `null`. */
  openLook: Look | null;
  setOpenLook: (look: Look | null) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const EMPTY: ShopConfig = { looks: [] };

export function ShopProvider({ shop, children }: { shop?: ShopConfig | undefined; children: ReactNode }) {
  const enabled = shop !== undefined;
  const [bag, setBag] = useState<BagItem[]>([]);
  const [openLook, setOpenLook] = useState<Look | null>(null);

  const config = useMemo(
    () => ({
      brand: 'Maison Marelle',
      collection: 'The Spring Edit',
      season: 'SS27',
      seasonName: 'Spring/Summer 2027',
      currency: 'EUR',
      locale: 'en-IE',
      ...(shop ?? EMPTY),
    }),
    [shop]
  );

  const formatPrice = useMemo(() => {
    const format = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      maximumFractionDigits: 0,
    });
    return (value: number) => format.format(value);
  }, [config.locale, config.currency]);

  const addToBag = useCallback(
    (item: BagItem) => {
      setBag((items) => [...items, item]);
      config.onAddToBag?.(item);
    },
    [config]
  );

  const removeFromBag = useCallback((index: number) => {
    setBag((items) => items.filter((_, i) => i !== index));
  }, []);

  const value = useMemo(
    () => ({ enabled, config, formatPrice, bag, addToBag, removeFromBag, openLook, setOpenLook }),
    [enabled, config, formatPrice, bag, addToBag, removeFromBag, openLook]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error('useShop must be used inside <ShopProvider>.');
  return value;
}
