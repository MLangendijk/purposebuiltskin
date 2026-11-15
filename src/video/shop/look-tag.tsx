/** @jsxImportSource react */

import { GarmentIcon } from '../garments/garment-icons';
import { GARMENT_LABEL } from '../garments/garments';
import { useShop } from './shop-context';
import { useCurrentLook, usePlaybackState } from './use-looks';

/**
 * A kraft swing tag for the piece on screen, hanging on its string. It stays up while the controls hide, because in a
 * shoppable video the product is the point.
 */
export function LookTag() {
  const { formatPrice, setOpenLook } = useShop();
  const playback = usePlaybackState();
  const { look, total } = useCurrentLook();

  if (!look || !playback?.started) return null;

  return (
    <div className="drop-tag-anchor">
      <button
        type="button"
        className="drop-tag"
        aria-label={`Shop look ${look.id} of ${total}: ${look.name}, ${formatPrice(look.price)}`}
        onClick={() => setOpenLook(look)}
      >
        {/* Only the face re-mounts per look, so a focused tag keeps focus when the piece changes. */}
        <span key={look.id} className="drop-tag-face">
          <span className="drop-tag-shop">
            <GarmentIcon garment={look.garment} />
            <span>Shop</span>
          </span>
          <span className="drop-tag-info">
            <span className="drop-tag-look">
              {GARMENT_LABEL[look.garment]} · {look.id}
              {look.lowStock && <span className="drop-tag-low">Low stock</span>}
            </span>
            <span className="drop-tag-name">{look.shortName ?? look.name}</span>
          </span>
          <span className="drop-tag-price">{formatPrice(look.price)}</span>
        </span>
      </button>
    </div>
  );
}
