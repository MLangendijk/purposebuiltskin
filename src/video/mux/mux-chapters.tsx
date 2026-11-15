/** @jsxImportSource react */

import type { TextCueInit } from '@videojs/core';
import { useCreateTextTrack } from '@videojs/react';

/** One entry of Mux's chapters JSON: `stream.mux.com/{PLAYBACK_ID}/chapters/{TRACK_ID}.json`. */
interface MuxChapter {
  chapter: number;
  'start-time': number;
  titles?: { language: string; title: string }[];
}

/**
 * Reads Mux's chapters JSON into cues. Mux gives each chapter a start only; in a chapters track Video.js runs each
 * one to the next, and the last to the end of the media.
 */
export function parseMuxChapters(text: string): TextCueInit[] {
  const chapters = JSON.parse(text) as MuxChapter[];
  return chapters
    .slice()
    .sort((a, b) => a['start-time'] - b['start-time'])
    .map((chapter) => ({ startTime: chapter['start-time'], text: chapter.titles?.[0]?.title ?? '' }));
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
