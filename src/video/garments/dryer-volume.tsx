/** @jsxImportSource react */

import { selectVolume } from '@videojs/core/dom';
import { usePlayer, VolumeSlider } from '@videojs/react';

import { MuteButton } from '../drop/buttons';

/** Five sound-wave arcs leaving the dryer's nozzle, each one taller than the last: the classic volume signal. */
const ARCS = [
  { x: 8, h: 4 },
  { x: 27, h: 6 },
  { x: 46, h: 8 },
  { x: 65, h: 10 },
  { x: 84, h: 12 },
];

/** The arcs, lit up to the current level. Decorative: the slider carries the value and its name. */
function SoundWaves({ lit }: { lit: number }) {
  return (
    <svg className="dryer-waves" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {ARCS.map(({ x, h }, i) => (
        <path key={x} data-on={i < lit ? '' : undefined} d={`M${x} ${14 - h}Q${x + h * 0.75} 14 ${x} ${14 + h}`} />
      ))}
    </svg>
  );
}

/**
 * Volume as a hairdryer: the mute button is the dryer itself (switched off when muted), and the slider is the sound
 * it sends out, drawn as the familiar sound-wave arcs. More arcs light up the louder it plays. It's an ordinary volume
 * slider underneath: click or drag anywhere, arrow keys in 5% steps, read out as "Volume, 60%". Touch screens keep
 * only the dryer (mute) and use the hardware buttons.
 */
export function DryerVolume() {
  const volume = usePlayer(selectVolume);
  const level = volume?.muted ? 0 : (volume?.volume ?? 0);
  // Any sound lights the first arc; full volume lights all five.
  const lit = level <= 0 ? 0 : Math.ceil(level * ARCS.length - 0.001);

  return (
    <div className="dryer">
      <MuteButton />
      <VolumeSlider.Root className="dryer-slider" orientation="horizontal" thumbAlignment="center">
        <VolumeSlider.Track className="dryer-track">
          <SoundWaves lit={lit} />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="dryer-thumb" />
      </VolumeSlider.Root>
    </div>
  );
}
