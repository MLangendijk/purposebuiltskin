/** @jsxImportSource react */

import { useTranslator } from '@videojs/react';

import { GarmentIcon } from '../garments/garment-icons';
import { useGarmentLabel } from '../garments/use-garment-label';
import { useShop } from './shop-context';
import { useCurrentLook, usePlaybackState } from './use-looks';

/**
 * A kraft swing tag for the piece on screen, hanging on its string. It stays up while the controls hide, because in a
 * shoppable video the product is the point.
 */
export function LookTag() {
  const { formatPrice, setOpenLook } = useShop();
  const t = useTranslator();
  const department = useGarmentLabel();
  const playback = usePlaybackState();
  const { look, total } = useCurrentLook();

  if (!look || !playback?.started) return null;

  return (
    <div className="drop-tag-anchor">
      <button
        type="button"
        className="drop-tag"
        aria-label={t('drop.shopLook', {
          id: look.id,
          total,
          name: look.name,
          price: formatPrice(look.price),
          default: 'Shop look {id} of {total}: {name}, {price}',
        })}
        onClick={() => setOpenLook(look)}
      >
        {/* Only the face re-mounts per look, so a focused tag keeps focus when the piece changes. */}
        <span key={look.id} className="drop-tag-face">
          <span className="drop-tag-shop">
            <GarmentIcon garment={look.garment} />
            <span>{t('drop.shop', { default: 'Shop' })}</span>
          </span>
          <span className="drop-tag-info">
            <span className="drop-tag-look">
              {department(look.garment)} · {look.id}
              {look.lowStock && <span className="drop-tag-low">{t('drop.lowStock', { default: 'Low stock' })}</span>}
            </span>
            <span className="drop-tag-name">{look.shortName ?? look.name}</span>
          </span>
          <span className="drop-tag-price">{formatPrice(look.price)}</span>
        </span>
      </button>
    </div>
  );
}
