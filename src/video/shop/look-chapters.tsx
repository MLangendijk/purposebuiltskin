/** @jsxImportSource react */

import type { TextCueInit } from '@videojs/core';
import { selectTextTrack } from '@videojs/core/dom';
import { useCreateTextTrack, usePlayer } from '@videojs/react';
import { useMemo } from 'react';

import type { ChapterValue } from '../garments/use-pieces';
import { useShop } from './shop-context';
import type { Look } from './types';

const LABEL = 'Looks (shop)';

/**
 * Chapters made from the looks' own `start` and `end`, for a film that has no chapters track. As soon as the film or
 * the app adds one (Mux chapters load, say), this one steps aside, so there's only ever one set of chapters.
 */
export function LookChapters() {
  const { config } = useShop();
  const tracks = usePlayer(selectTextTrack)?.textTrackList ?? [];
  // Kept stable across renders: new cues would replace the track.
  const timed = useMemo(
    () => config.looks.filter((look) => look.start !== undefined && look.end !== undefined),
    [config.looks]
  );
  const hasChapters = tracks.some((track) => track.kind === 'chapters' && track.label !== LABEL);

  if (hasChapters || !timed.length) return null;
  return <LooksTrack looks={timed} />;
}

function LooksTrack({ looks }: { looks: Look[] }) {
  const cues = useMemo(
    () =>
      looks.map(
        (look): TextCueInit<ChapterValue> => ({
          id: look.id,
          startTime: look.start!,
          endTime: look.end,
          text: look.name,
          value: { garment: look.garment, look: look.id },
        })
      ),
    [looks]
  );
  useCreateTextTrack({ kind: 'chapters', label: LABEL, language: 'en', cues });
  return null;
}
