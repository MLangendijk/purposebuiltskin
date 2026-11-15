/** @jsxImportSource react */

import { type SVGProps, useId } from 'react';

/**
 * Atelier's icon set, in fine line. Where an atelier tool has a real job that matches the control, the icon is that tool:
 * pins hold the moment (pause), a tape measure rewinds to zero (replay), a hairdryer switches the sound on and off
 * (mute), hangers move along the rail (next look), scissors make alterations (settings), stitches sew while it loads.
 * Play, captions and fullscreen keep their standard shapes, because no garment does those jobs better. Every icon is decorative; the button carries the label.
 * Parts that animate on a state change carry an `icon-*` class (see atelier.css).
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
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
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
    <path d="M5 12a7 7 0 1 0 2.1-5" strokeWidth="2.72" strokeLinecap="round" strokeDasharray="1.8 1" />
    <path d="M3 3v6.5h6.5z" fill="currentColor" stroke="none" />
  </Icon>
);

/** A hairdryer, nozzle forward: barrel, rear vent and handle. */
const DRYER = (
  <>
    <path d="M5 5h9l5 1.75v4.5L14 13H5a4 4 0 0 1 0-8z" />
    <circle cx="5.5" cy="9" r="1.6" />
    <path d="M8 13l-1.5 7.5h3.25L11.5 13" />
  </>
);

/** Sound on: the hairdryer, sending out a sound wave. The volume slider beside it carries on the waves. */
export const VolumeIcon = (p: IconProps) => (
  <Icon {...p}>
    {DRYER}
    <path d="M20.75 6.75q1.75 2.25 0 4.5" />
  </Icon>
);

/** Muted: the hairdryer, switched off. */
export const MutedIcon = (p: IconProps) => (
  <Icon {...p}>
    {DRYER}
    <path d="M2.5 2.5l19 19" strokeWidth="2" />
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

/** Captions: the standard CC box, the one shape everyone looks for. Off is outlined; on is filled, the letters cut out. */
const CC = 'M10.6 10.4a2.2 2.2 0 1 0 0 3.2M17.1 10.4a2.2 2.2 0 1 0 0 3.2';

export const CaptionsOffIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d={CC} />
  </Icon>
);

export function CaptionsOnIcon(p: IconProps) {
  const mask = useId();
  return (
    <Icon {...p}>
      <mask id={mask}>
        <rect width="24" height="24" fill="white" />
        <path d={CC} stroke="black" strokeWidth="1.8" />
      </mask>
      <rect x="1.7" y="4.2" width="20.6" height="15.6" rx="3.2" fill="currentColor" stroke="none" mask={`url(#${mask})`} />
    </Icon>
  );
}

/** Settings: tailor's scissors, for alterations. */
export const SettingsIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="6.5" r="3" strokeWidth="1.36" />
    <circle cx="6" cy="17.5" r="3" strokeWidth="1.36" />
    <path d="M8.5 8.2L21 17M8.5 15.8L21 7" strokeWidth="1.36" strokeLinecap="round" />
  </Icon>
);

const HANGER = 'M9.5 5a2.5 2.5 0 1 1 2.5 2.5V9.5M12 9.5L2.5 16h19z';

/** Previous look: back one hanger along the rail. */
export const PrevLookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d={HANGER} strokeWidth="1.36" strokeLinejoin="round" />
    <path d="M18 20.5H6M9 17.5l-3 3 3 3" strokeWidth="1.36" strokeLinejoin="round" strokeLinecap="round" />
  </Icon>
);

/** Next look: on to the next hanger along the rail. */
export const NextLookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d={HANGER} strokeWidth="1.36" strokeLinejoin="round" />
    <path d="M6 20.5h12M15 17.5l3 3-3 3" strokeWidth="1.36" strokeLinejoin="round" strokeLinecap="round" />
  </Icon>
);

/** Loading: a ring of stitches being sewn round and round. */
export const SpinnerIcon = (p: IconProps) => (
  <Icon {...p}>
    <g className="icon-spin">
      <circle cx="12" cy="12" r="8" strokeWidth="1.7" strokeDasharray="3 2.2" strokeLinecap="round" />
      <path d="M12 1.5v5" strokeWidth="1.36" strokeLinecap="round" />
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
