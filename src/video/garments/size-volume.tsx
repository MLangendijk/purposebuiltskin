/** @jsxImportSource react */

import { VolumeSlider } from '@videojs/react';

import { MuteButton } from '../drop/buttons';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

function SizeRun() {
  return (
    <span className="size-run" aria-hidden="true">
      {SIZES.map((size) => (
        <span key={size}>{size}</span>
      ))}
    </span>
  );
}

/**
 * Volume as a size run: turning it up is going up a size, from XS to XL. The sizes you have light up. Touch screens keep
 * only mute and use the hardware buttons.
 */
export function SizeVolume() {
  return (
    <div className="size-volume">
      <MuteButton />
      <VolumeSlider.Root className="size-slider" orientation="horizontal" thumbAlignment="edge">
        <VolumeSlider.Track className="size-track">
          <SizeRun />
          <VolumeSlider.Fill className="size-fill">
            <SizeRun />
          </VolumeSlider.Fill>
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="size-thumb" />
      </VolumeSlider.Root>
    </div>
  );
}
