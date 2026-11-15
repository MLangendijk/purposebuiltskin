/** @jsxImportSource react */

import { useEffect, useRef } from 'react';

import { GarmentIcon } from '../garments/garment-icons';
import { GARMENT_LABEL } from '../garments/garments';
import { useShop } from '../shop/shop-context';
import { usePlaybackState } from '../shop/use-looks';
import { PlayButton } from './buttons';

/** The cover over the poster until playback starts: house, collection, the pieces in the film, and play. */
export function StartScreen() {
  const { config, formatPrice } = useShop();
  const playback = usePlaybackState();
  const started = playback?.started ?? false;
  // The container, remembered while the start button has focus, so focus can follow the shopper into the controls.
  const focusHome = useRef<HTMLElement | null>(null);

  // The start button unmounts once playback starts; hand focus to the bar's play button so hotkeys keep working.
  useEffect(() => {
    const container = focusHome.current;
    if (!started || !container) return;
    focusHome.current = null;
    requestAnimationFrame(() => (container.querySelector<HTMLElement>('.drop-play') ?? container).focus());
  }, [started]);

  if (started) return null;

  const from = config.looks.length ? Math.min(...config.looks.map((look) => look.price)) : 0;

  return (
    <div
      className="drop-start"
      onFocus={(event) => (focusHome.current = event.currentTarget.closest('.media-container'))}
      onBlur={() => (focusHome.current = null)}
    >
      <div className="drop-start-card">
      <p className="drop-start-kicker">
        {config.brand} · <abbr title={config.seasonName}>{config.season}</abbr>
      </p>
      <p className="drop-start-title">{config.drop}</p>
      {config.looks.length > 0 && (
        <ul className="drop-start-rack" aria-label="Pieces in this film">
          {config.looks.map((look) => (
            <li key={look.id}>
              <GarmentIcon garment={look.garment} />
              {GARMENT_LABEL[look.garment]}
            </li>
          ))}
        </ul>
      )}
      <p className="drop-start-sub">
        {config.looks.length} pieces, shoppable as you watch{from ? ` · from ${formatPrice(from)}` : ''}
      </p>
      <PlayButton className="drop-start-play" label="Watch the film" tooltip={false} />
      </div>
    </div>
  );
}
