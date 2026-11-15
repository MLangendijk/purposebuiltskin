/** @jsxImportSource react */

import { NextLookIcon, PrevLookIcon } from '../drop/icons';
import { ButtonTooltip } from '../shared/tooltip';
import { useLookSeek } from './use-looks';

/** Jumps to the previous or next look, the way a lookbook flips pages. */
export function LookSkip({ direction }: { direction: 'prev' | 'next' }) {
  const { prev, next, seekTo } = useLookSeek();
  const target = direction === 'prev' ? prev : next;
  const label = target
    ? `${direction === 'prev' ? 'Previous' : 'Next'} look: ${target.id}, ${target.shortName ?? target.name}`
    : direction === 'prev'
      ? 'No previous look'
      : 'No next look';

  return (
    <ButtonTooltip label={target ? `${direction === 'prev' ? 'Prev' : 'Next'} look ${target.id}` : label}>
      <button
        type="button"
        className={`media-button drop-skip drop-skip-${direction}`}
        aria-label={label}
        aria-disabled={target ? undefined : 'true'}
        onClick={() => target && seekTo(target)}
      >
        {direction === 'prev' ? <PrevLookIcon className="media-button-icon" /> : <NextLookIcon className="media-button-icon" />}
      </button>
    </ButtonTooltip>
  );
}
