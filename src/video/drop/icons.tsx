/** @jsxImportSource react */

import type { SVGProps } from 'react';

/**
 * Drop's icon set: chunky, square-capped glyphs drawn on a 24px grid so they read like screen-printed tags. Every icon
 * is decorative; the button around it carries the label.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const PlayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 4v16L20 12z" fill="currentColor" stroke="none" />
  </Icon>
);

export const PauseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 4h4.5v16H5.5zM14 4h4.5v16H14z" fill="currentColor" stroke="none" />
  </Icon>
);

export const RestartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5" />
    <path d="M4 3.5v5h5" />
  </Icon>
);

export const VolumeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 8.5h4.5l5.5-4.5v16L7 15.5H2.5z" fill="currentColor" stroke="none" />
    <path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 6.5a7.5 7.5 0 0 1 0 11" />
  </Icon>
);

export const MutedIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 8.5h4.5l5.5-4.5v16L7 15.5H2.5z" fill="currentColor" stroke="none" />
    <path d="M15.5 9l6 6M21.5 9l-6 6" />
  </Icon>
);

export const FullscreenIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 9V3.5H9M15 3.5h5.5V9M20.5 15v5.5H15M9 20.5H3.5V15" />
  </Icon>
);

export const ExitFullscreenIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 3.5V9H3.5M20.5 9H15V3.5M15 20.5V15h5.5M3.5 15H9v5.5" />
  </Icon>
);

export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 8h15l-1.25 12.5H5.75z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </Icon>
);

export const PrevLookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19.5 4.5v15L8.5 12z" fill="currentColor" stroke="none" />
    <path d="M5 4.5v15" />
  </Icon>
);

export const NextLookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 4.5v15l11-7.5z" fill="currentColor" stroke="none" />
    <path d="M19 4.5v15" />
  </Icon>
);

export const SettingsIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 7h18M3 17h18" />
    <path d="M7 4.5h4v5H7zM13 14.5h4v5h-4z" fill="currentColor" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
  </Icon>
);

export const ArrowIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 12h15M13 6l6 6-6 6" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </Icon>
);
