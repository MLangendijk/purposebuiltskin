/** @jsxImportSource react */

import { useTranslator } from '@videojs/react';

import { GarmentIcon } from '../garments/garment-icons';
import { useGarmentLabel } from '../garments/use-garment-label';
import { useShop } from './shop-context';
import type { Look } from './types';
import { useHasPlayed } from '../atelier/use-has-played';
import { useCurrentLook } from './use-looks';

/**
 * A touch tap on the tag would reach the player's container first and call up the controls, and in compact players the
 * tag steps aside for them before the click lands. A native listener (React's sit above the container) keeps the tap.
 */
function keepTouchTap(button: HTMLButtonElement | null) {
  if (!button) return;
  const stop = (event: PointerEvent) => event.pointerType === 'touch' && event.stopPropagation();
  button.addEventListener('pointerup', stop);
  return () => button.removeEventListener('pointerup', stop);
}

/**
 * A kraft swing tag for the piece on screen, hanging on its string. It stays up while the controls hide, because in a
 * shoppable video the product is the point.
 */
export function LookTag() {
  const { formatPrice, setOpenLook } = useShop();
  const t = useTranslator();
  const played = useHasPlayed();
  const { look, total } = useCurrentLook();

  if (!look || !played) return null;

  return (
    <div className="atelier-tag-anchor">
      <button
        type="button"
        className="atelier-tag"
        aria-label={[
          t('atelier.shopLook', {
            id: look.id,
            total,
            name: look.name,
            price: formatPrice(look.price),
            default: 'Shop look {id} of {total}: {name}, {price}',
          }),
          look.lowStock ? t('atelier.lowStock', { default: 'Low stock' }) : '',
        ]
          .filter(Boolean)
          .join(', ')}
        ref={keepTouchTap}
        onClick={() => setOpenLook(look)}
      >
        {/* Only the face re-mounts per look, so a focused tag keeps focus when the piece changes. */}
        <TagFace key={look.id} look={look} />
      </button>
    </div>
  );
}

/** The tag's face: garment, department and look number, name, and price. The elements page shows it on its own. */
export function TagFace({ look }: { look: Look }) {
  const { formatPrice } = useShop();
  const t = useTranslator();
  const department = useGarmentLabel();

  return (
    <span className="atelier-tag-face">
      <span className="atelier-tag-shop">
        <GarmentIcon garment={look.garment} />
        <span>{t('atelier.shop', { default: 'Shop' })}</span>
      </span>
      <span className="atelier-tag-info">
        <span className="atelier-tag-look">
          {department(look.garment)} · {look.id}
          {look.lowStock && <span className="atelier-tag-low">{t('atelier.lowStock', { default: 'Low stock' })}</span>}
        </span>
        <span className="atelier-tag-name">{look.shortName ?? look.name}</span>
      </span>
      <span className="atelier-tag-price">{formatPrice(look.price)}</span>
    </span>
  );
}
