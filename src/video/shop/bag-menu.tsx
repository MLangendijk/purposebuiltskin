/** @jsxImportSource react */

import { Popover, useTranslator } from '@videojs/react';
import { useId, useRef, useState } from 'react';

import { ArrowIcon, BagIcon, CloseIcon } from '../drop/icons';
import { GarmentIcon } from '../garments/garment-icons';
import { useShop } from './shop-context';

/** The bag: a counter in the top bar that opens the pieces picked from the drop. */
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
      const buttons = popup.current?.querySelectorAll<HTMLButtonElement>('.drop-bag-remove');
      (buttons?.[Math.min(index, buttons.length - 1)] ?? popup.current)?.focus();
    });
  }

  return (
    <Popover.Root side="bottom" align="end" onOpenChange={(open) => !open && setNotice(false)}>
      <Popover.Trigger
        className="drop-bag-button"
        aria-label={
          count === 0
            ? t('drop.bagEmpty', { default: 'Bag, empty' })
            : count === 1
              ? t('drop.bagOne', { default: 'Bag, 1 item' })
              : t('drop.bagMany', { count, default: 'Bag, {count} items' })
        }
      >
        <BagIcon />
        <span className="drop-bag-label">{t('drop.bag', { default: 'Bag' })}</span>
        <span className="drop-bag-count" data-empty={count === 0 ? '' : undefined} aria-hidden="true">
          {count}
        </span>
      </Popover.Trigger>

      {/* `data-interactive` keeps clicks in the bag from reaching the player's tap gestures. */}
      <Popover.Popup
        ref={popup}
        className="media-popup drop-bag-popup"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-interactive=""
      >
        <p className="drop-bag-title" id={titleId}>
          {t('drop.yourBag', { default: 'Your bag' })} <span>({count})</span>
        </p>
        {count === 0 ? (
          <p className="drop-bag-empty">
            {t('drop.bagEmptyHint', { default: 'Nothing yet. Open a swing tag in the film to shop the piece.' })}
          </p>
        ) : (
          <>
            <ul className="drop-bag-list">
              {bag.map((item, i) => (
                <li key={`${item.look.id}-${i}`} className="drop-bag-item">
                  <GarmentIcon garment={item.look.garment} className="drop-bag-item-icon" />
                  <span className="drop-bag-item-name">
                    {item.look.name}
                    <span className="drop-bag-item-size">{t('drop.sizeValue', { size: item.size, default: 'Size {size}' })}</span>
                  </span>
                  <span className="drop-bag-item-price">{formatPrice(item.look.price)}</span>
                  <button
                    type="button"
                    className="drop-icon-button drop-icon-button-sm drop-bag-remove"
                    aria-label={t('drop.removeItem', { name: item.look.name, size: item.size, default: 'Remove {name}, size {size}' })}
                    onClick={() => remove(i)}
                  >
                    <CloseIcon />
                  </button>
                </li>
              ))}
            </ul>
            <p className="drop-bag-total">
              <span>{t('drop.total', { default: 'Total' })}</span>
              <span>{formatPrice(total)}</span>
            </p>
            <button
              type="button"
              className="drop-cta"
              onClick={() => (config.onCheckout ? config.onCheckout(bag) : setNotice(true))}
            >
              <span>{t('drop.checkout', { default: 'Checkout' })}</span>
              <ArrowIcon />
            </button>
          </>
        )}
        <p className="drop-bag-notice" role="status">
          {notice ? t('drop.demoNotice', { default: 'Demo store: nothing was charged.' }) : ''}
        </p>
      </Popover.Popup>
    </Popover.Root>
  );
}
