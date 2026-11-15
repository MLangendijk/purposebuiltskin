/** @jsxImportSource react */

import { selectTextTrack, selectTime } from '@videojs/core/dom';
import { Slider as SliderPrimitive, TimeSlider, usePlayer } from '@videojs/react';
import { type CSSProperties, useEffect, useRef } from 'react';

import { useShop } from '../shop/shop-context';
import type { Look } from '../shop/types';
import { GarmentIcon } from './garment-icons';
import { type Garment, garmentFromTitle } from './garments';
import { Hardware } from './hardware';
import { useGarmentLabel } from './use-garment-label';

/** One piece of the strip: where it runs and which garment it's cut from. */
interface Piece {
  key: string;
  start: number;
  end: number;
  garment: Garment;
}

/**
 * The seek bar is a strip of the garments in the film. Every chapter is cut from its own garment's material, and the
 * part already played is finished: knitted, buttoned, sewn, pressed, zipped. The playhead turns into the tool doing
 * that work as it crosses from one piece to the next.
 *
 * The garment for each chapter comes from the chapter's own title (`Knitwear · …`), so chapters served by Mux carry
 * their materials with them. The shop's looks fill in when a title doesn't name one.
 */
export function GarmentSeek() {
  const pieces = usePieces();
  const time = usePlayer(selectTime)?.currentTime ?? 0;
  const current = pieces.find((piece) => time >= piece.start && time < piece.end) ?? pieces.at(-1);
  const garment: Garment = current?.garment ?? 'shirt';
  const { config } = useShop();
  // The tool only swaps in with motion when the garment changes, never on first load.
  const previous = useRef(garment);
  const swapped = previous.current !== garment;
  useEffect(() => {
    previous.current = garment;
  }, [garment]);

  return (
    <div className="garment-seek" data-garment={garment}>
      <TimeSlider.Root className="media-time-slider garment-slider" thumbAlignment="center">
        <TimeSlider.Chapters
          className="garment-segments"
          renderChapter={(props, state) => (
            <div
              {...props}
              className="garment-segment"
              // A stretch no chapter covers (a few frames of encoder rounding at the end) shows no garment.
              data-garment={
                garmentFromTitle(state.cue?.text) ??
                (state.cue ? lookAt(config.looks, state.cue.startTime, state.index)?.garment : undefined) ??
                'none'
              }
              style={{ ...props.style, '--fill': `${state.fillPercent}%` } as CSSProperties}
            >
              <span className="garment-material garment-material-ahead" />
              <span className="garment-material garment-material-done" />
            </div>
          )}
        />

        <TimeSlider.Thumb className="media-time-slider-thumb garment-thumb">
          <Hardware key={garment} garment={garment} swapped={swapped} />
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
      <GarmentRail pieces={pieces} current={current} />
    </div>
  );
}

/** The department signs under the strip: an icon and name per piece, the current one underlined. */
function GarmentRail({ pieces, current }: { pieces: Piece[]; current: Piece | undefined }) {
  const duration = usePlayer(selectTime)?.duration ?? 0;
  const department = useGarmentLabel();
  if (!duration || !pieces.length) return null;

  return (
    <div className="garment-rail" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.key}
          className="garment-rail-item"
          data-active={piece === current ? '' : undefined}
          style={
            {
              '--start': `${(piece.start / duration) * 100}%`,
              '--width': `${((Math.min(piece.end, duration) - piece.start) / duration) * 100}%`,
            } as CSSProperties
          }
        >
          <GarmentIcon garment={piece.garment} />
          <span className="garment-rail-label">{department(piece.garment)}</span>
        </span>
      ))}
    </div>
  );
}

/** The strip's pieces: from the chapters track when there is one, otherwise from the shop's looks. */
function usePieces(): Piece[] {
  const { config } = useShop();
  const cues = usePlayer(selectTextTrack)?.chaptersCues ?? [];

  if (cues.length) {
    return cues.flatMap((cue, index) => {
      const garment = garmentFromTitle(cue.text) ?? lookAt(config.looks, cue.startTime, index)?.garment;
      return garment ? [{ key: cue.id, start: cue.startTime, end: cue.endTime, garment }] : [];
    });
  }

  return config.looks.map((look) => ({ key: look.id, start: look.start, end: look.end, garment: look.garment }));
}

/** Matches a chapter to its look by start time, falling back to order. */
function lookAt(looks: Look[], start: number, index: number): Look | undefined {
  return looks.find((look) => Math.abs(look.start - start) < 0.5) ?? looks[index];
}
