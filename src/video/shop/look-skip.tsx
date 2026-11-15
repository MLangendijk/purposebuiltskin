/** @jsxImportSource react */

import { useTranslator } from '@videojs/react';

import { NextLookIcon, PrevLookIcon } from '../atelier/icons';
import { ButtonTooltip } from '../shared/tooltip';
import { useCurrentLook, useLookSeek } from './use-looks';

/** Jumps to the previous or next look, the way you move along a rail of hangers. */
export function LookSkip({ direction }: { direction: 'prev' | 'next' }) {
  const t = useTranslator();
  const { prev, next, seekTo } = useLookSeek();
  const current = useCurrentLook().look;
  const target = direction === 'prev' ? prev : next;
  const look = target?.look;
  const name = look ? (look.shortName ?? look.name) : '';
  // Back, more than two seconds into a look, starts that look again.
  const restart = direction === 'prev' && look !== undefined && look === current;

  const label = look
    ? restart
      ? t('atelier.restartLook', { id: look.id, name, default: 'Restart look {id}, {name}' })
      : direction === 'prev'
      ? t('atelier.previousLook', { id: look.id, name, default: 'Previous look: {id}, {name}' })
      : t('atelier.nextLook', { id: look.id, name, default: 'Next look: {id}, {name}' })
    : direction === 'prev'
      ? t('atelier.noPreviousLook', { default: 'No previous look' })
      : t('atelier.noNextLook', { default: 'No next look' });

  const tooltip = look
    ? restart
      ? t('atelier.restartLookShort', { id: look.id, default: 'Restart look {id}' })
      : direction === 'prev'
      ? t('atelier.previousLookShort', { id: look.id, default: 'Previous look {id}' })
      : t('atelier.nextLookShort', { id: look.id, default: 'Next look {id}' })
    : label;

  return (
    <ButtonTooltip label={tooltip}>
      <button
        type="button"
        className={`media-button atelier-skip atelier-skip-${direction}`}
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
