/** @jsxImportSource react */

import { Popover, useTranslator } from '@videojs/react';
import { useId, useRef, useState } from 'react';

import { ArrowIcon, BagIcon, CloseIcon } from '../atelier/icons';
import { GarmentIcon } from '../garments/garment-icons';
import { useShop } from './shop-context';

/** The bag: a counter in the top bar that opens the pieces picked from the collection. */
export function BagMenu() {
  const { bag, config, formatPrice, removeFromBag } = useShop();
  const t = useTranslator();
  const [notice, setNotice] = useState(false);
  const popup = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const total = bag.reduce((sum, item) => sum + item.look.price, 0);
  const count = bag.length;

  // Removing a row deletes the focused button, so hand focus to the next row's button, or the bag itself.
  function remove(index: number) {
    removeFromBag(index);
    requestAnimationFrame(() => {
      const buttons = popup.current?.querySelectorAll<HTMLButtonElement>('.atelier-bag-remove');
      (buttons?.[Math.min(index, buttons.length - 1)] ?? popup.current)?.focus();
    });
  }

  return (
    <Popover.Root side="bottom" align="end" onOpenChange={(open) => !open && setNotice(false)}>
      <Popover.Trigger
        className="atelier-bag-button"
        aria-label={
          count === 0
            ? t('atelier.bagEmpty', { default: 'Bag, empty' })
            : count === 1
              ? t('atelier.bagOne', { default: 'Bag, 1 item' })
              : t('atelier.bagMany', { count, default: 'Bag, {count} items' })
        }
      >
        <BagIcon />
        <span className="atelier-bag-label">{t('atelier.bag', { default: 'Bag' })}</span>
        <span className="atelier-bag-count" data-empty={count === 0 ? '' : undefined} aria-hidden="true">
          {count}
        </span>
      </Popover.Trigger>

      {/* `data-interactive` keeps clicks in the bag from reaching the player's tap gestures. */}
      <Popover.Popup
        ref={popup}
        className="media-popup atelier-bag-popup"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-interactive=""
      >
        <p className="atelier-bag-title" id={titleId}>
          {t('atelier.yourBag', { default: 'Your bag' })} <span>({count})</span>
        </p>
        {count === 0 ? (
          <p className="atelier-bag-empty">
            {t('atelier.bagEmptyHint', { default: 'Nothing yet. Open a swing tag in the film to shop the piece.' })}
          </p>
        ) : (
          <>
            <ul className="atelier-bag-list">
              {bag.map((item, i) => (
                <li key={`${item.look.id}-${i}`} className="atelier-bag-item">
                  <GarmentIcon garment={item.look.garment} className="atelier-bag-item-icon" />
                  <span className="atelier-bag-item-name">
                    {item.look.name}
                    <span className="atelier-bag-item-size">{t('atelier.sizeValue', { size: item.size, default: 'Size {size}' })}</span>
                  </span>
                  <span className="atelier-bag-item-price">{formatPrice(item.look.price)}</span>
                  <button
                    type="button"
                    className="atelier-icon-button atelier-icon-button-sm atelier-bag-remove"
                    aria-label={t('atelier.removeItem', { name: item.look.name, size: item.size, default: 'Remove {name}, size {size}' })}
                    onClick={() => remove(i)}
                  >
                    <CloseIcon />
                  </button>
                </li>
              ))}
            </ul>
            <p className="atelier-bag-total">
              <span>{t('atelier.total', { default: 'Total' })}</span>
              <span>{formatPrice(total)}</span>
            </p>
            <button
              type="button"
              className="atelier-cta"
              onClick={() => (config.onCheckout ? config.onCheckout(bag) : setNotice(true))}
            >
              <span>{t('atelier.checkout', { default: 'Checkout' })}</span>
              <ArrowIcon />
            </button>
          </>
        )}
        <p className="atelier-bag-notice" role="status">
          {notice ? t('atelier.demoNotice', { default: 'Demo store: nothing was charged.' }) : ''}
        </p>
      </Popover.Popup>
    </Popover.Root>
  );
}
