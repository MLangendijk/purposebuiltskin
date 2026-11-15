/** @jsxImportSource react */

import { selectTime } from '@videojs/core/dom';
import { Slider as SliderPrimitive, TimeSlider, usePlayer } from '@videojs/react';
import type { CSSProperties } from 'react';

import { useShop } from '../shop/shop-context';
import type { Look } from '../shop/types';
import { useCurrentLook } from '../shop/use-looks';
import { GarmentIcon } from './garment-icons';
import { GARMENT_LABEL, type Garment } from './garments';
import { Hardware } from './hardware';

/**
 * The seek bar is a strip of the garments in the film. Every chapter is cut from its own garment's material, and the
 * part already played is "finished": buttons done up, zipper closed, laces threaded. The playhead turns into that
 * garment's hardware as it crosses from one piece to the next.
 */
export function GarmentSeek() {
  const { config } = useShop();
  const { look } = useCurrentLook();
  const current: Garment = look?.garment ?? config.looks[0]?.garment ?? 'shirt';

  return (
    <div className="garment-seek" data-garment={current}>
      <TimeSlider.Root className="media-time-slider garment-slider" thumbAlignment="center">
        <TimeSlider.Chapters
          className="garment-segments"
          renderChapter={(props, state) => (
            <div
              {...props}
              className="garment-segment"
              data-garment={lookAt(config.looks, state.cue?.startTime ?? state.start, state.index)?.garment ?? current}
              style={{ ...props.style, '--fill': `${state.fillPercent}%` } as CSSProperties}
            >
              <span className="garment-material garment-material-ahead" />
              <span className="garment-material garment-material-done" />
            </div>
          )}
        />

        <TimeSlider.Thumb className="media-time-slider-thumb garment-thumb">
          <Hardware key={current} garment={current} />
        </TimeSlider.Thumb>

        <TimeSlider.Preview className="media-time-slider-preview garment-preview">
          <SliderPrimitive.Thumbnail.Root className="media-slider-thumbnail garment-preview-frame">
            <SliderPrimitive.Thumbnail.Image className="media-slider-thumbnail-image" />
          </SliderPrimitive.Thumbnail.Root>
          <div className="garment-preview-label">
            <TimeSlider.Value className="media-time-slider-value" type="pointer" />
            <TimeSlider.ChapterTitle className="media-time-slider-chapter-title garment-preview-chapter" />
          </div>
        </TimeSlider.Preview>
      </TimeSlider.Root>
      <GarmentRail current={look} />
    </div>
  );
}

/** The department signs under the strip: an icon and name per garment, the current one lit. */
function GarmentRail({ current }: { current: Look | undefined }) {
  const { config } = useShop();
  const duration = usePlayer(selectTime)?.duration ?? 0;
  if (!duration || !config.looks.length) return null;

  return (
    <div className="garment-rail" aria-hidden="true">
      {config.looks.map((look) => (
        <span
          key={look.id}
          className="garment-rail-item"
          data-active={look === current ? '' : undefined}
          style={
            {
              '--start': `${(look.start / duration) * 100}%`,
              '--width': `${((look.end - look.start) / duration) * 100}%`,
            } as CSSProperties
          }
        >
          <GarmentIcon garment={look.garment} />
          <span className="garment-rail-label">{GARMENT_LABEL[look.garment]}</span>
        </span>
      ))}
    </div>
  );
}

/** Matches a chapter to its look by start time, falling back to order. */
function lookAt(looks: Look[], start: number, index: number): Look | undefined {
  return looks.find((look) => Math.abs(look.start - start) < 0.5) ?? looks[index];
}
