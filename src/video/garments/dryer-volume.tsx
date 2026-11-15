/** @jsxImportSource react */

import { selectVolume } from '@videojs/core/dom';
import { usePlayer, VolumeSlider } from '@videojs/react';

import { MuteButton } from '../atelier/buttons';

/** Five sound-wave arcs leaving the dryer's nozzle, each one taller than the last: the classic volume signal. */
const ARCS = [
  { x: 8, h: 4 },
  { x: 27, h: 6 },
  { x: 46, h: 8 },
  { x: 65, h: 10 },
  { x: 84, h: 12 },
];

/**
 * The arcs, lit up to the current level: each arc is a fifth of the range, and the one the level is inside lights up
 * part way, so every step of the slider shows. Decorative: the slider carries the value and its name.
 */
function SoundWaves({ level }: { level: number }) {
  return (
    <svg className="dryer-waves" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {ARCS.map(({ x, h }, i) => {
        const d = `M${x} ${14 - h}Q${x + h * 0.75} 14 ${x} ${14 + h}`;
        const lit = Math.min(1, Math.max(0, level * ARCS.length - i));
        return (
          <g key={x}>
            <path d={d} />
            {lit > 0 && <path className="dryer-wave-lit" d={d} style={{ opacity: lit }} />}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Volume as a hairdryer: the mute button is the dryer itself (switched off when muted), and the slider is the sound
 * it sends out, drawn as the familiar sound-wave arcs. The arcs light up as it gets louder. It's an ordinary volume
 * slider underneath: click or drag anywhere, arrow keys in 5% steps, read out as "Volume, 60%". Touch screens keep
 * only the dryer (mute) and use the hardware buttons.
 */
export function DryerVolume() {
  const volume = usePlayer(selectVolume);
  const level = volume?.muted ? 0 : (volume?.volume ?? 0);

  return (
    <div className="dryer">
      <MuteButton />
      <VolumeSlider.Root className="dryer-slider" orientation="horizontal" thumbAlignment="center">
        <VolumeSlider.Track className="dryer-track">
          <SoundWaves level={level} />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="dryer-thumb" />
      </VolumeSlider.Root>
    </div>
  );
}
