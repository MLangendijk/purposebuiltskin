/** @jsxImportSource react */

import { Dialog, useTranslator } from '@videojs/react';
import { useEffect, useRef, useState } from 'react';

import { CheckIcon, CloseIcon } from '../atelier/icons';
import { GarmentIcon } from '../garments/garment-icons';
import { useGarmentLabel } from '../garments/use-garment-label';
import { useShop } from './shop-context';
import type { Look } from './types';
import { usePlaybackState } from './use-looks';

/**
 * The product sheet for one look. It pauses the film while it is open and picks playback back up when it closes, so
 * shopping never costs the shopper their place.
 */
export function ProductSheet() {
  const { openLook, setOpenLook } = useShop();
  const playback = usePlaybackState();
  const resume = useRef(false);
  // The last opened look stays rendered while the sheet animates closed.
  const lastLook = useRef<Look | null>(null);
  if (openLook) lastLook.current = openLook;
  const shown = openLook ?? lastLook.current;

  const isOpen = openLook !== null;
  const paused = playback?.paused ?? true;
  const pause = playback?.pause;
  const play = playback?.play;

  useEffect(() => {
    if (isOpen && !paused) {
      resume.current = true;
      pause?.();
    } else if (!isOpen && resume.current) {
      resume.current = false;
      void play?.();
    }
  }, [isOpen, paused, pause, play]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && setOpenLook(null)}>
      <Dialog.Backdrop className="atelier-sheet-backdrop" onClick={() => setOpenLook(null)} />
      <Dialog.Popup className="atelier-sheet">{shown && <SheetBody key={shown.id} look={shown} />}</Dialog.Popup>
    </Dialog.Root>
  );
}

function SheetBody({ look }: { look: Look }) {
  const { config, formatPrice, addToBag, setOpenLook } = useShop();
  const t = useTranslator();
  const department = useGarmentLabel();
  const [size, setSize] = useState(look.sizes[Math.floor((look.sizes.length - 1) / 2)] ?? '');
  const [added, setAdded] = useState(false);
  const position = config.looks.indexOf(look) + 1;

  return (
    <>
      <div className="atelier-sheet-media">
        {look.image && <img className="atelier-sheet-image" src={look.image} alt="" />}
        <span className="atelier-sheet-look" aria-hidden="true">
          {t('atelier.lookNumber', { id: look.id, default: 'Look {id}' })}
          <span className="atelier-sheet-look-of">/{String(config.looks.length).padStart(2, '0')}</span>
        </span>
      </div>

      <div className="atelier-sheet-body">
        <div className="atelier-sheet-head">
          <p className="atelier-eyebrow atelier-sheet-dept">
            <GarmentIcon garment={look.garment} />
            {department(look.garment)} ·{' '}
            {t('atelier.lookPosition', { position, total: config.looks.length, default: 'Look {position} of {total}' })}
          </p>
          <Dialog.Close className="atelier-icon-button atelier-sheet-close" aria-label={t('atelier.closeSheet', { default: 'Close and keep watching' })}>
            <CloseIcon />
          </Dialog.Close>
        </div>

        <Dialog.Title className="atelier-sheet-title">{look.name}</Dialog.Title>
        <Dialog.Description className="atelier-sheet-meta">
          {look.color && <span>{look.color}</span>}
          <span className="atelier-sheet-price">{formatPrice(look.price)}</span>
          {look.lowStock && <span className="atelier-badge">{t('atelier.lowStock', { default: 'Low stock' })}</span>}
        </Dialog.Description>

        {(look.fabric || look.care) && (
          <p className="atelier-sheet-care">
            {look.fabric && <span>{look.fabric}</span>}
            {look.care && <span>{look.care}</span>}
          </p>
        )}

        <fieldset className="atelier-sizes">
          <legend className="atelier-sizes-legend">
            {t('atelier.size', { default: 'Size' })}
            {look.sizeGuide && <span className="atelier-sizes-guide"> · {look.sizeGuide}</span>}
          </legend>
          <div className="atelier-sizes-grid">
            {look.sizes.map((value) => (
              <label key={value} className="atelier-size">
                <input
                  type="radio"
                  name={`size-${look.id}`}
                  value={value}
                  checked={size === value}
                  onChange={() => {
                    setSize(value);
                    setAdded(false);
                  }}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {added ? (
          <button type="button" className="atelier-cta atelier-cta-done" onClick={() => setOpenLook(null)}>
            <CheckIcon />
            <span>{t('atelier.inBag', { default: 'In the bag — keep watching' })}</span>
          </button>
        ) : (
          <button
            type="button"
            className="atelier-cta"
            onClick={() => {
              addToBag({ look, size });
              setAdded(true);
            }}
          >
            <span>{t('atelier.addToBag', { default: 'Add to bag' })}</span>
            <span className="atelier-cta-price">{formatPrice(look.price)}</span>
          </button>
        )}
        <p className="atelier-sheet-note" role="status">
          {added
            ? t('atelier.added', { name: look.name, size, default: 'Added {name}, size {size}, to your bag.' })
            : t('atelier.serviceNote', { default: 'Free returns · Ships in 48 hours' })}
        </p>
      </div>
    </>
  );
}
