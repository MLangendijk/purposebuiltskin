import { selectTextTrack, selectTime } from '@videojs/core/dom';
import { usePlayer } from '@videojs/react';
import { useMemo } from 'react';

import { useShop } from '../shop/shop-context';
import type { Look } from '../shop/types';
import { type Garment, garmentFromTitle, parseGarment, titleHead, titleTail } from './garments';
import { useGarmentLabel } from './use-garment-label';

type ChapterCue = NonNullable<ReturnType<typeof selectTextTrack>>['chaptersCues'][number];

/**
 * What a chapter can carry as its cue `value`: the garment, and the id of the look it sells. Chapters loaded by
 * `MuxChapters` carry it from Mux's chapter metadata. Chapters the media brings itself (Mux streams carry their chapters
 * in the HLS playlist, which Video.js prefers) have only a title, so the title names both: `Knitwear · Cable-Knit
 * Cashmere Jumper`. A WebVTT chapter can also name its look with its cue identifier.
 */
export interface ChapterValue {
  garment?: string;
  look?: string;
}

/** One stretch of the film: a chapter, the garment it's cut from, its department sign, and the look it sells. */
export interface Piece {
  key: string;
  start: number;
  end: number;
  garment: Garment;
  label: string;
  look: Look | undefined;
}

/**
 * The film's pieces, from its chapters track: any number of chapters, any lengths. Without one, the skin makes the
 * chapters from the looks' own timings (see `shop/look-chapters.tsx`), and those timings also stand in while a
 * chapters file loads or if it fails. For each chapter:
 *
 * - the look is the one its metadata or cue id names, else the one its title names (`… · Linen Maxi Dress`), else the
 *   look in the same position when there's one look per chapter, else none (an opening, a backstage shot);
 * - the garment comes from its metadata, else its title (`Knitwear · …`), else its look, else it's a toile (`other`).
 */
export function usePieces(): Piece[] {
  const { config } = useShop();
  const cues = usePlayer(selectTextTrack)?.chaptersCues;
  const duration = usePlayer(selectTime)?.duration ?? 0;
  const department = useGarmentLabel();

  return useMemo(() => {
    const list = cues ?? [];
    // No cues yet (a chapters file still loading, or one that failed): the looks' own timings stand in, so the shop
    // keeps working.
    if (!list.length) {
      return config.looks.flatMap((look) =>
        look.start === undefined || look.end === undefined
          ? []
          : [{ key: look.id, start: look.start, end: look.end, garment: look.garment, label: department(look.garment), look }]
      );
    }
    return list.map((cue, index) => {
      const value = chapterValue(cue);
      const look = findLook(config.looks, cue, value, index, list.length);
      const garment = parseGarment(value.garment) ?? garmentFromTitle(cue.text) ?? look?.garment ?? 'other';
      // A chapter without an end runs to the next one, and the last to the end of the film.
      const end = cue.endTime > cue.startTime ? cue.endTime : (list[index + 1]?.startTime ?? duration);
      const label = garment === 'other' ? (titleHead(cue.text) ?? department(garment)) : department(garment);
      return { key: cue.id || String(index), start: cue.startTime, end, garment, label, look };
    });
  }, [cues, config.looks, duration, department]);
}

/** The piece playing at `time`. Past the last chapter's end (the final frame) still counts as the last piece. */
export function pieceAt(pieces: Piece[], time: number): Piece | undefined {
  const last = pieces.at(-1);
  return pieces.find((piece) => time >= piece.start && time < piece.end) ?? (last && time >= last.end ? last : undefined);
}

function chapterValue(cue: ChapterCue): ChapterValue {
  const value = cue.value as ChapterValue | undefined;
  return value && typeof value === 'object' ? value : {};
}

function findLook(looks: Look[], cue: ChapterCue, value: ChapterValue, index: number, count: number) {
  const id = value.look ?? cue.id;
  const name = (titleTail(cue.text) ?? cue.text).toLowerCase();
  return (
    looks.find((look) => look.id === id) ??
    looks.find((look) => look.name.toLowerCase() === name || look.shortName?.toLowerCase() === name) ??
    (looks.length === count ? looks[index] : undefined)
  );
}
