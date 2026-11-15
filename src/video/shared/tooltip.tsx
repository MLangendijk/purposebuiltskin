/** @jsxImportSource react */

import { Tooltip } from '@videojs/react';
import type { ClassValue } from 'cn';
import type { ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/resolve-class-name';

export function ButtonTooltip({
  children,
  delay,
  disabled,
  label,
  popupClassName,
  sticky,
}: {
  children: ReactElement;
  delay?: number;
  disabled?: boolean;
  label?: ReactNode;
  popupClassName?: ClassValue;
  sticky?: boolean;
}) {
  return (
    <Tooltip.Root delay={delay} disabled={disabled} side="top" sticky={sticky}>
      <Tooltip.Trigger render={children} />
      {/*
       * No `media-popup-safe-area`: its hover bridge hangs below a tooltip placed on top, which Video.js counts in the
       * tooltip's height, so with just enough room above a trigger the tooltip flips sides on every render until React
       * stops with "Maximum update depth exceeded". Tooltips aren't hovered into, so they need no bridge.
       */}
      <Tooltip.Popup className={cn('media-popup', 'media-tooltip-popup', popupClassName)}>
        {label ?? <Tooltip.Label />}
        {!label && <Tooltip.Shortcut className={'media-tooltip-shortcut'} />}
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}
