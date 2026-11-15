/** @jsxImportSource react */

import { GARMENT_LABEL } from '../garments/garments';
import { BagMenu } from '../shop/bag-menu';
import { useShop } from '../shop/shop-context';
import { usePlaybackState } from '../shop/use-looks';

/** Brand stamp, the drop ticker, and the bag. */
export function TopBar() {
  const { config } = useShop();

  return (
    <>
      <span className="drop-stamp" aria-hidden="true">
        <span className="drop-stamp-brand">{config.brand}</span>
        <span className="drop-stamp-drop">{config.drop}</span>
      </span>
      <Ticker />
      <BagMenu />
    </>
  );
}

/**
 * A scrolling strip of the departments in the drop, like a shop-front banner. Decorative, so it is hidden from
 * assistive tech. It pauses with the film and stops under reduced motion.
 */
function Ticker() {
  const { config } = useShop();
  const paused = usePlaybackState()?.paused ?? true;
  const departments = [...new Set(config.looks.map((look) => GARMENT_LABEL[look.garment]))];
  const words = [`${config.drop} out now`, ...departments, config.season, 'Tap a tag to shop'];
  const line = (
    <span className="drop-ticker-line">
      {words.map((word) => (
        <span key={word}>
          {word}
          <span className="drop-ticker-star">✶</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="drop-ticker" aria-hidden="true" data-paused={paused ? '' : undefined}>
      <div className="drop-ticker-track">
        {line}
        {line}
      </div>
    </div>
  );
}
