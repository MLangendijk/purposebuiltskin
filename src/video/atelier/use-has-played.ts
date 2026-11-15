import { selectPlayback } from '@videojs/core/dom';
import { usePlayer } from '@videojs/react';
import { useState } from 'react';

/**
 * Whether the film has played at all. Video.js counts a paused film back at 0:00 as not started, so going back to the
 * first look would bring the start screen back and hide the controls; once the film has played, this stays true.
 */
export function useHasPlayed(): boolean {
  const started = usePlayer(selectPlayback)?.started ?? false;
  const [played, setPlayed] = useState(started);
  if (started && !played) setPlayed(true);
  return played || started;
}
