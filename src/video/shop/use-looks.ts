import { selectPlayback, selectTime } from '@videojs/core/dom';
import { usePlayer } from '@videojs/react';

import { useShop } from './shop-context';
import type { Look } from './types';

/** The look on screen right now, and its position in the drop. */
export function useCurrentLook(): { look: Look | undefined; index: number; total: number } {
  const { config } = useShop();
  const time = usePlayer(selectTime);
  const t = time?.currentTime ?? 0;
  const index = config.looks.findIndex((look) => t >= look.start && t < look.end);
  const last = config.looks.length - 1;
  // Past the final cue (the last frame) still counts as the final look.
  const resolved = index === -1 && t > 0 && last >= 0 && t >= config.looks[last]!.start ? last : index;

  return { look: config.looks[resolved], index: resolved, total: config.looks.length };
}

/** Jumps between looks. Going back within the first two seconds of a look lands on the one before it. */
export function useLookSeek() {
  const { config } = useShop();
  const time = usePlayer(selectTime);
  const { index } = useCurrentLook();
  const looks = config.looks;
  const t = time?.currentTime ?? 0;

  const prevIndex = index <= 0 ? -1 : t - looks[index]!.start < 2 ? index - 1 : index;
  const nextIndex = index + 1 < looks.length ? index + 1 : -1;

  return {
    prev: prevIndex >= 0 ? looks[prevIndex] : undefined,
    next: nextIndex >= 0 ? looks[nextIndex] : undefined,
    seekTo: (look: Look) => time?.seek(look.start),
  };
}

export function usePlaybackState() {
  return usePlayer(selectPlayback);
}
