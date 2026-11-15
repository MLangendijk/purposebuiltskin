/** @jsxImportSource react */

import { selectPlayback } from '@videojs/core/dom';
import { usePlayer } from '@videojs/react';
import { type ComponentProps, useRef, useState } from 'react';

/** How long after a key press the slider's spoken value follows the seek it caused. */
const SETTLE_MS = 1000;

/**
 * The seek slider's handle, holding its spoken value still while the film plays. Video.js updates `aria-valuenow` and
 * `aria-valuetext` every second, and a screen reader on the focused slider reads each change, so it would count along
 * with the film. Here the value only changes when the shopper moves it, or while the film is paused.
 */
export function SteadyThumb({ onKeyDown, onFocus, onBlur, ...props }: ComponentProps<'div'>) {
  const playing = usePlayer(selectPlayback)?.paused === false;
  const [focused, setFocused] = useState(false);
  const movedAt = useRef(0);
  const held = useRef({ now: props['aria-valuenow'], text: props['aria-valuetext'] });

  const settling = performance.now() - movedAt.current < SETTLE_MS;
  if (!playing || !focused || settling) held.current = { now: props['aria-valuenow'], text: props['aria-valuetext'] };

  return (
    <div
      {...props}
      aria-valuenow={held.current.now}
      aria-valuetext={held.current.text}
      onKeyDown={(event) => {
        movedAt.current = performance.now();
        onKeyDown?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
    />
  );
}
