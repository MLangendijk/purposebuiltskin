/** @jsxImportSource react */

import {
  CaptionsButton as CaptionsButtonPrimitive,
  FullscreenButton as FullscreenButtonPrimitive,
  MuteButton as MuteButtonPrimitive,
  PlayButton as PlayButtonPrimitive,
} from '@videojs/react';
import type { ClassValue } from 'cn';

import { cn, resolveClassName } from '@/lib/resolve-class-name';

import { Button } from '../shared/button';
import { ButtonTooltip } from '../shared/tooltip';
import {
  CaptionsOffIcon,
  CaptionsOnIcon,
  ExitFullscreenIcon,
  FullscreenIcon,
  MutedIcon,
  PauseIcon,
  PlayIcon,
  RestartIcon,
  VolumeIcon,
} from './icons';

/*
 * Atelier's buttons wrap the Video.js primitives and keep the Scaffold class names that swap icons by state
 * (`media-play-button-play-icon` and friends), so only the artwork changes.
 */

export function PlayButton({
  className,
  label,
  tooltip = true,
}: { className?: ClassValue; label?: string; tooltip?: boolean } = {}) {
  const icon = 'media-button-icon-base';

  return (
    <ButtonTooltip disabled={!tooltip}>
      <PlayButtonPrimitive
        render={<Button />}
        className={(state) => cn('media-play-button', resolveClassName(className, state))}
        // A visible label is also the accessible name, so voice control can say what it sees.
        {...(label ? { 'aria-label': label } : {})}
      >
        <RestartIcon className={cn(icon, 'media-play-button-restart-icon')} />
        <PlayIcon className={cn(icon, 'media-play-button-play-icon')} />
        <PauseIcon className={cn(icon, 'media-play-button-pause-icon')} />
        {label && (
          <span className="atelier-play-label" aria-hidden="true">
            {label}
          </span>
        )}
      </PlayButtonPrimitive>
    </ButtonTooltip>
  );
}

export function MuteButton() {
  return (
    <ButtonTooltip>
      <MuteButtonPrimitive render={<Button />} className="media-mute-button">
        <MutedIcon className={cn('media-button-icon', 'media-mute-button-off-icon')} />
        <VolumeIcon className={cn('media-button-icon', 'media-mute-button-high-icon')} />
      </MuteButtonPrimitive>
    </ButtonTooltip>
  );
}

/** Captions on and off, in the bar where people look for it. Renders nothing when the film has no captions. */
export function CaptionsButton() {
  return (
    <ButtonTooltip>
      <CaptionsButtonPrimitive render={<Button />} className="media-captions-button">
        <CaptionsOffIcon className={cn('media-button-icon', 'media-captions-button-off-icon')} />
        <CaptionsOnIcon className={cn('media-button-icon', 'media-captions-button-on-icon')} />
      </CaptionsButtonPrimitive>
    </ButtonTooltip>
  );
}

export function FullscreenButton() {
  return (
    <ButtonTooltip>
      <FullscreenButtonPrimitive render={<Button />} className="media-fullscreen-button">
        <FullscreenIcon className={cn('media-button-icon', 'media-fullscreen-button-enter-icon')} />
        <ExitFullscreenIcon className={cn('media-button-icon', 'media-fullscreen-button-exit-icon')} />
      </FullscreenButtonPrimitive>
    </ButtonTooltip>
  );
}
