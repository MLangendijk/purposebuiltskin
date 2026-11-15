/** @jsxImportSource react */

import { useEffect, useRef } from 'react';

import { GarmentIcon } from '../garments/garment-icons';
import { GARMENT_LABEL } from '../garments/garments';
import { useShop } from '../shop/shop-context';
import { usePlaybackState } from '../shop/use-looks';
import { PlayButton } from './buttons';

/** The drop announcement over the poster until playback starts: the headline, and the rack of pieces in the film. */
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
  const [word, number] = splitDrop(config.drop);

  return (
    <div
      className="drop-start"
      onFocus={(event) => (focusHome.current = event.currentTarget.closest('.media-container'))}
      onBlur={() => (focusHome.current = null)}
    >
      <p className="drop-start-kicker">
        <span className="drop-sticker drop-sticker-ink">{config.brand}®</span>
        <abbr className="drop-sticker drop-sticker-paper" title={config.seasonName}>
          {config.season}
        </abbr>
      </p>
      <p className="drop-start-title">
        <span className="drop-start-word">{word}</span>
        {number && <span className="drop-start-number">{number}</span>}
      </p>
      {config.looks.length > 0 && (
        <ul className="drop-start-rack" aria-label="Pieces in this drop">
          {config.looks.map((look) => (
            <li key={look.id}>
              <GarmentIcon garment={look.garment} />
              {GARMENT_LABEL[look.garment]}
            </li>
          ))}
        </ul>
      )}
      <p className="drop-start-sub">
        {config.looks.length} pieces · Shop every look{from ? ` · From ${formatPrice(from)}` : ''}
      </p>
      <PlayButton className="drop-start-play" label="Watch the drop" tooltip={false} />
    </div>
  );
}

/** `Drop 004` → `['Drop', '004']`, so the number can be set big. */
function splitDrop(drop: string): [string, string | undefined] {
  const match = drop.match(/^(.*?)\s*(\d+)$/);
  return match ? [match[1]!, match[2]] : [drop, undefined];
}
