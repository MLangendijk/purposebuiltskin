/** @jsxImportSource react */

import type { SVGProps } from 'react';

/**
 * Drop's icon set. Where a garment has a real job that matches the control, the icon is that garment: pins hold the
 * moment (pause), a tape measure rewinds to zero (replay), a zipper shuts the sound in (mute), hangers move along the
 * rail (next look), scissors make alterations (settings), stitches sew while it loads. Play and fullscreen keep their
 * standard shapes, because no garment does those jobs better. Every icon is decorative; the button carries the label.
 * Parts that animate on a state change carry an `icon-*` class (see drop.css).
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
      strokeWidth="2.5"
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

/** Play: the standard triangle. */
export const PlayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 4v16l14-8z" fill="currentColor" stroke="none" />
  </Icon>
);

/** Pause: two dressmaker's pins, pinning the moment in place. */
export const PauseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 9h3v12H7zM14 9h3v12h-3z" fill="currentColor" stroke="none" />
    <circle cx="8.5" cy="6" r="3" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="6" r="3" fill="currentColor" stroke="none" />
  </Icon>
);

/** Replay: a tape measure curling back to the start, its hook as the arrowhead. */
export const RestartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12a7 7 0 1 0 2.1-5" strokeWidth="4" strokeLinecap="butt" strokeDasharray="1.8 1" />
    <path d="M3 3v6.5h6.5z" fill="currentColor" stroke="none" />
  </Icon>
);

const SPEAKER = 'M2.5 8.5h4l5.5-4.5v16l-5.5-4.5h-4z';

/** Unmuted: the zipper is open and the sound pours out between the teeth. */
export const VolumeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d={SPEAKER} fill="currentColor" stroke="none" />
    <path className="icon-teeth" d="M14.5 11l7-6.5M14.5 13l7 6.5" strokeWidth="3" strokeDasharray="1.6 1.4" strokeLinecap="butt" />
  </Icon>
);

/** Muted: the zipper is done up and the sound is shut in. The pull slides across when it mutes. */
export const MutedIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d={SPEAKER} fill="currentColor" stroke="none" />
    <path d="M14 10.5v3M16 9.5v3M18 10.5v3M20 9.5v3M22 10.5v3" strokeWidth="1.75" strokeLinecap="butt" />
    <g className="icon-zip-pull">
      <path d="M19.5 13h4v3h-1.25v4h-1.5v-4H19.5z" fill="currentColor" stroke="none" />
    </g>
  </Icon>
);

/** Fullscreen: the standard corners. */
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

/** Settings: tailor's scissors, for alterations. */
export const SettingsIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="6.5" r="3" strokeWidth="2" />
    <circle cx="6" cy="17.5" r="3" strokeWidth="2" />
    <path d="M8.5 8.2L21 17M8.5 15.8L21 7" strokeWidth="2" strokeLinecap="round" />
  </Icon>
);

const HANGER = 'M9.5 5a2.5 2.5 0 1 1 2.5 2.5V9.5M12 9.5L2.5 16h19z';

/** Previous look: back one hanger along the rail. */
export const PrevLookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d={HANGER} strokeWidth="2" strokeLinejoin="round" />
    <path d="M18 20.5H6M9 17.5l-3 3 3 3" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </Icon>
);

/** Next look: on to the next hanger along the rail. */
export const NextLookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d={HANGER} strokeWidth="2" strokeLinejoin="round" />
    <path d="M6 20.5h12M15 17.5l3 3-3 3" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </Icon>
);

/** Loading: a ring of stitches being sewn round and round. */
export const SpinnerIcon = (p: IconProps) => (
  <Icon {...p}>
    <g className="icon-spin">
      <circle cx="12" cy="12" r="8" strokeWidth="2.5" strokeDasharray="3 2.2" strokeLinecap="butt" />
      <path d="M12 1.5v5" strokeWidth="2" strokeLinecap="round" />
    </g>
  </Icon>
);

export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 8h15l-1.25 12.5H5.75z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
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
