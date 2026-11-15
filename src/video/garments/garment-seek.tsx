/** @jsxImportSource react */

import { selectTime } from '@videojs/core/dom';
import { Slider as SliderPrimitive, TimeSlider, usePlayer } from '@videojs/react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';

import { GarmentIcon } from './garment-icons';
import { type Garment, GARMENTS } from './garments';
import { Hardware } from './hardware';
import { SteadyThumb } from './steady-thumb';
import { type Piece, pieceAt, usePieces } from './use-pieces';

/**
 * The seek bar is a strip of the garments in the film. Every chapter is cut from its own garment's material, and the
 * part already played is finished: knitted, buttoned, sewn, pressed, zipped. The playhead turns into the tool doing
 * that work as it crosses from one piece to the next.
 *
 * The strip follows whatever chapters the film has, so any cut works: a 40-second lookbook or a runway show, five
 * looks or twenty. Each chapter names its garment in its metadata or title (see `use-pieces.ts`), so chapters served
 * by Mux carry their materials with them; a garment the skin doesn't draw is cut as a toile. A film with no chapters
 * at all is cut whole from one garment, picked at random, with no seams.
 */
export function GarmentSeek() {
  const pieces = usePieces();
  const time = usePlayer(selectTime)?.currentTime ?? 0;
  const current = pieceAt(pieces, time) ?? pieces[0];
  const [whole] = useState(pickGarment);
  const garment: Garment = pieces.length ? (current?.garment ?? 'other') : whole;
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
              // Without chapters the strip is one whole garment. A stretch no chapter covers when there are chapters (a few
              // frames of encoder rounding at the end) shows no garment.
              data-garment={
                state.cue
                  ? (pieces.find((piece) => piece.start === state.cue!.startTime)?.garment ?? 'other')
                  : pieces.length
                    ? 'none'
                    : whole
              }
              style={{ ...props.style, '--fill': `${state.fillPercent}%` } as CSSProperties}
            >
              <span className="garment-material garment-material-ahead" />
              <span className="garment-material garment-material-done" />
            </div>
          )}
        />

        <TimeSlider.Thumb className="media-time-slider-thumb garment-thumb" render={(props) => <SteadyThumb {...props} />}>
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
          <span className="garment-rail-label">{piece.label}</span>
        </span>
      ))}
    </div>
  );
}

/** One of the garments the skin draws in full (not the toile), at random. */
function pickGarment(): Garment {
  const drawn = GARMENTS.filter((garment) => garment !== 'other');
  return drawn[Math.floor(Math.random() * drawn.length)]!;
}
