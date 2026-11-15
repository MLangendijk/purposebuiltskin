/** @jsxImportSource react */

import { selectTime } from '@videojs/core/dom';
import { Time, usePlayer } from '@videojs/react';
import type { CSSProperties } from 'react';

/** How far the tape pulls out per second of film: one millimetre tick. */
const PX_PER_SECOND = 4;

/**
 * Time on a tailor's tape measure. The readout stays put while the tape pulls out under it, one tick per second and a
 * long tick every five, so watching time pass looks like measuring the length of the film.
 */
export function TapeMeasure() {
  const seconds = usePlayer(selectTime)?.currentTime ?? 0;

  return (
    <Time.Group
      className="media-time-group drop-time tape-measure"
      style={{ '--tape-x': `${-seconds * PX_PER_SECOND}px` } as CSSProperties}
    >
      <Time.Value className="media-time-toggle" type="current" toggle />
      <Time.Value className="media-time-current-value" type="current" />
      <Time.Separator className="media-time-separator" />
      <Time.Value className="media-time-duration-value" type="duration" />
    </Time.Group>
  );
}
