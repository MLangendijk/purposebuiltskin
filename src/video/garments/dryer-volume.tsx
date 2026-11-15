/** @jsxImportSource react */

import { selectPlayback, selectVolume } from '@videojs/core/dom';
import { usePlayer, VolumeSlider } from '@videojs/react';

import { MuteButton } from '../drop/buttons';

/**
 * Three streams of air leaving the nozzle, fanning out as they go. Drawn on a 100×24 box stretched to the slider, so
 * the stroke stays the same weight at any width.
 */
function Airflow() {
  return (
    <svg className="dryer-air" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 9 C 12 7, 20 9, 30 7 S 50 5, 62 4 S 85 2, 100 1" />
      <path d="M0 12 C 12 10, 20 14, 32 12 S 52 10, 64 12 S 86 14, 100 12" />
      <path d="M0 15 C 12 17, 20 15, 30 17 S 50 19, 62 20 S 85 22, 100 23" />
    </svg>
  );
}

/**
 * Volume as a hairdryer: the mute button is the dryer itself (switched off when muted), and the slider is its airflow.
 * The louder the film, the further the air reaches. It's an ordinary volume slider underneath: click or drag
 * anywhere, arrow keys in 5% steps, read out as "Volume, 60%". The air drifts while the film plays and rests when it's
 * paused, muted, or under reduced motion. Touch screens keep only the dryer (mute) and use the hardware buttons.
 */
export function DryerVolume() {
  const muted = usePlayer(selectVolume)?.muted ?? false;
  const paused = usePlayer(selectPlayback)?.paused ?? true;

  return (
    <div className="dryer" data-flowing={!muted && !paused ? '' : undefined}>
      <MuteButton />
      <VolumeSlider.Root className="dryer-slider" orientation="horizontal" thumbAlignment="center">
        <VolumeSlider.Track className="dryer-track">
          <Airflow />
          <VolumeSlider.Fill className="dryer-fill">
            <Airflow />
          </VolumeSlider.Fill>
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="dryer-thumb" />
      </VolumeSlider.Root>
    </div>
  );
}
