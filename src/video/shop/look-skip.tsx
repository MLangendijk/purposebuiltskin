/** @jsxImportSource react */

import { useTranslator } from '@videojs/react';

import { NextLookIcon, PrevLookIcon } from '../drop/icons';
import { ButtonTooltip } from '../shared/tooltip';
import { useLookSeek } from './use-looks';

/** Jumps to the previous or next look, the way you move along a rail of hangers. */
export function LookSkip({ direction }: { direction: 'prev' | 'next' }) {
  const t = useTranslator();
  const { prev, next, seekTo } = useLookSeek();
  const target = direction === 'prev' ? prev : next;
  const name = target ? (target.shortName ?? target.name) : '';

  const label = target
    ? direction === 'prev'
      ? t('drop.previousLook', { id: target.id, name, default: 'Previous look: {id}, {name}' })
      : t('drop.nextLook', { id: target.id, name, default: 'Next look: {id}, {name}' })
    : direction === 'prev'
      ? t('drop.noPreviousLook', { default: 'No previous look' })
      : t('drop.noNextLook', { default: 'No next look' });

  const tooltip = target
    ? direction === 'prev'
      ? t('drop.previousLookShort', { id: target.id, default: 'Previous look {id}' })
      : t('drop.nextLookShort', { id: target.id, default: 'Next look {id}' })
    : label;

  return (
    <ButtonTooltip label={tooltip}>
      <button
        type="button"
        className={`media-button drop-skip drop-skip-${direction}`}
        aria-label={label}
        aria-disabled={target ? undefined : 'true'}
        onClick={() => target && seekTo(target)}
      >
        {direction === 'prev' ? (
          <PrevLookIcon className="media-button-icon" />
        ) : (
          <NextLookIcon className="media-button-icon" />
        )}
      </button>
    </ButtonTooltip>
  );
}
