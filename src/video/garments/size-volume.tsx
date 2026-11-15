/** @jsxImportSource react */

import { selectVolume } from '@videojs/core/dom';
import { usePlayer, useTranslator, VolumeSlider } from '@videojs/react';

import { MuteButton } from '../drop/buttons';

/** The size run, smallest to largest. Each size is a fifth of the volume: XS is 20%, XL is full. */
const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
const STEP = 100 / SIZES.length;

/** The size a volume level falls in, or `undefined` at zero. */
function sizeAt(value: number): (typeof SIZES)[number] | undefined {
  return value <= 0 ? undefined : SIZES[Math.min(SIZES.length - 1, Math.ceil(value / STEP - 0.001) - 1)];
}

/** The chips, lit up to the current size. Decorative: the slider carries the value and its name. */
function SizeRun({ level }: { level: number }) {
  return (
    <span className="size-run" aria-hidden="true">
      {SIZES.map((size, i) => (
        <span key={size} data-on={i < level ? '' : undefined}>
          {size}
        </span>
      ))}
    </span>
  );
}

/**
 * Volume as a size run: turning it up is going up a size, from XS to XL. The slider steps in fifths and each chip is
 * centred on its step, so clicking a size picks that size; the arrow keys move one size; and the slider's name says
 * the size, so it reads "Volume, size L" as well as the percentage. Touch screens keep only mute and use the hardware
 * buttons.
 */
export function SizeVolume() {
  const t = useTranslator();
  const volume = usePlayer(selectVolume);
  const muted = volume?.muted ?? false;
  // How many sizes are lit: one per fifth of the volume, none when muted.
  const level = muted ? 0 : Math.round((volume?.volume ?? 0) * SIZES.length);

  return (
    <div className="size-volume">
      <MuteButton />
      <VolumeSlider.Root
        className="size-slider"
        orientation="horizontal"
        thumbAlignment="center"
        step={STEP}
        largeStep={STEP}
        wheelStep={STEP}
        label={(state) => {
          const size = sizeAt(state.value);
          if (muted || !size) return t('drop.volumeOff', { default: 'Volume, muted' });
          return t('drop.volumeSize', { size, default: 'Volume, size {size}' });
        }}
      >
        <VolumeSlider.Track className="size-track">
          <SizeRun level={level} />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="size-thumb" />
      </VolumeSlider.Root>
    </div>
  );
}
