/** @jsxImportSource react */

import { useTranslator } from '@videojs/react';
import { type FocusEvent, useEffect, useRef } from 'react';

import { GarmentIcon } from '../garments/garment-icons';
import { useGarmentLabel } from '../garments/use-garment-label';
import { useShop } from '../shop/shop-context';
import { PlayButton } from './buttons';
import { useHasPlayed } from './use-has-played';

/** The cover over the poster until playback starts: house, collection, the pieces in the film, and play. */
export function StartScreen() {
  const { config, enabled, formatPrice } = useShop();
  const t = useTranslator();
  const department = useGarmentLabel();
  const started = useHasPlayed();
  // The container, remembered while the start button has focus, so focus can follow the shopper into the controls.
  const focusHome = useRef<HTMLElement | null>(null);

  // The start button unmounts once playback starts; hand focus to the bar's play button so hotkeys keep working.
  useEffect(() => {
    const container = focusHome.current;
    if (!started || !container) return;
    focusHome.current = null;
    requestAnimationFrame(() => (container.querySelector<HTMLElement>('.atelier-play') ?? container).focus());
  }, [started]);

  if (started) return null;

  const from = config.looks.length ? Math.min(...config.looks.map((look) => look.price)) : 0;
  const onFocus = (event: FocusEvent<HTMLElement>) => (focusHome.current = event.currentTarget.closest('.media-container'));

  // A plain player (no shop) starts from the poster with a play button alone.
  if (!enabled) {
    return (
      <div className="atelier-start atelier-start-plain" onFocus={onFocus} onBlur={() => (focusHome.current = null)}>
        <PlayButton className="atelier-start-play" label={t('atelier.play', { default: 'Play' })} tooltip={false} />
      </div>
    );
  }

  return (
    <div
      className="atelier-start"
      onFocus={onFocus}
      onBlur={() => (focusHome.current = null)}
    >
      <div className="atelier-start-card">
      <p className="atelier-start-kicker">
        {config.brand} · {config.seasonName}
      </p>
      <h2 className="atelier-start-title">{config.collection}</h2>
      {config.looks.length > 0 && (
        <ul className="atelier-start-rack" aria-label={t('atelier.piecesInFilm', { default: 'Pieces in this film' })}>
          {config.looks.map((look) => (
            <li key={look.id}>
              <GarmentIcon garment={look.garment} />
              {department(look.garment)}
            </li>
          ))}
        </ul>
      )}
      <p className="atelier-start-sub">
        {t('atelier.piecesShoppable', { count: config.looks.length, default: '{count} pieces, shoppable as you watch' })}
        {from ? ` · ${t('atelier.fromPrice', { price: formatPrice(from), default: 'from {price}' })}` : ''}
      </p>
      <PlayButton className="atelier-start-play" label={t('atelier.watchFilm', { default: 'Watch the film' })} tooltip={false} />
      </div>
    </div>
  );
}
