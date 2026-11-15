import { selectPlayback, selectTime } from '@videojs/core/dom';
import { usePlayer } from '@videojs/react';

import { type Piece, pieceAt, usePieces } from '../garments/use-pieces';
import { useShop } from './shop-context';
import type { Look } from './types';

/** The look on screen right now, and its position in the collection. A chapter that sells nothing has no look. */
export function useCurrentLook(): { look: Look | undefined; index: number; total: number } {
  const { config } = useShop();
  const time = usePlayer(selectTime)?.currentTime ?? 0;
  const look = pieceAt(usePieces(), time)?.look;

  return { look, index: look ? config.looks.indexOf(look) : -1, total: config.looks.length };
}

/**
 * Jumps between the chapters that sell a look. Back restarts the current look, or lands on the one before it within its
 * first two seconds.
 */
export function useLookSeek(): { prev: Piece | undefined; next: Piece | undefined; seekTo: (piece: Piece) => void } {
  const time = usePlayer(selectTime);
  const t = time?.currentTime ?? 0;
  const stops = usePieces().filter((piece) => piece.look);

  return {
    prev: stops.filter((piece) => piece.start < t - 2).at(-1),
    // A seek can land a hair before a chapter's start, so the look just jumped to doesn't count as next.
    next: stops.find((piece) => piece.start > t + 0.5),
    seekTo: (piece) => void time?.seek(piece.start),
  };
}

export function usePlaybackState() {
  return usePlayer(selectPlayback);
}
