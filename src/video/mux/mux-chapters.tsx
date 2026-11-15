/** @jsxImportSource react */

import type { TextCueInit } from '@videojs/core';
import { useCreateTextTrack } from '@videojs/react';

import type { ChapterValue } from '../garments/use-pieces';

/**
 * One entry of Mux's chapters JSON (`stream.mux.com/{PLAYBACK_ID}/chapters/{TRACK_ID}.json`), which is Apple's JSON
 * chapters format: a start, titles, and optional `{ key, value }` metadata. Mux serves the file as it was uploaded.
 */
interface MuxChapter {
  'start-time': number;
  titles?: { language: string; title: string }[];
  metadata?: { key: string; value: string }[];
}

/**
 * Reads Mux's chapters JSON into cues. Mux gives each chapter a start only; in a chapters track Video.js runs each one
 * to the next, and the last to the end of the media. The `garment` and `look` metadata keys become the cue's value, so
 * the seek bar knows each chapter's material and product without parsing its title.
 */
export function parseMuxChapters(text: string): TextCueInit<ChapterValue>[] {
  const chapters = JSON.parse(text) as MuxChapter[];
  return chapters
    .slice()
    .sort((a, b) => a['start-time'] - b['start-time'])
    .map((chapter) => {
      const meta = Object.fromEntries((chapter.metadata ?? []).map(({ key, value }) => [key, value]));
      return {
        startTime: chapter['start-time'],
        text: chapter.titles?.[0]?.title ?? '',
        value: { garment: meta.garment, look: meta.look },
      };
    });
}

/**
 * Loads an asset's chapters from Mux into the player as a chapters track, which the seek bar splits into garments.
 * Render it anywhere inside the player. The chapters live on the Mux asset as a `text_type: "chapters"` track.
 */
export function MuxChapters({ playbackId, trackId, label = 'Looks' }: { playbackId: string; trackId: string; label?: string }) {
  useCreateTextTrack({
    kind: 'chapters',
    label,
    language: 'en',
    src: `https://stream.mux.com/${playbackId}/chapters/${trackId}.json`,
    format: parseMuxChapters,
  });
  return null;
}
