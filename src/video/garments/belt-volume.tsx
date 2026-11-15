/** @jsxImportSource react */

import { VolumeSlider } from '@videojs/react';

import { MuteButton } from '../drop/buttons';

/**
 * Volume as a belt: a leather strap punched with holes, and a buckle you slide along it. The strap left of the buckle
 * is the volume you have. Touch screens keep only mute and use the hardware buttons.
 */
export function BeltVolume() {
  return (
    <div className="belt">
      <MuteButton />
      <VolumeSlider.Root className="belt-slider" orientation="horizontal" thumbAlignment="center">
        <VolumeSlider.Track className="belt-strap">
          <VolumeSlider.Fill className="belt-strap-fill" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="belt-buckle">
          <svg viewBox="0 0 20 28" aria-hidden="true" focusable="false">
            <rect x="2" y="2" width="16" height="24" rx="3" fill="none" stroke="#0b0b0c" strokeWidth="5" />
            <rect x="2" y="2" width="16" height="24" rx="3" fill="none" stroke="#d9dce1" strokeWidth="2.5" />
            <path d="M10 14h8" stroke="#0b0b0c" strokeWidth="4" strokeLinecap="round" />
            <path d="M10 14h8" stroke="#d9dce1" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </VolumeSlider.Thumb>
      </VolumeSlider.Root>
    </div>
  );
}
