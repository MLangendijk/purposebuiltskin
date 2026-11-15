# Drop

**A shoppable fashion skin for the [Video.js v10](https://videojs.org) player, with controls cut from the clothes.**

Fashion video deserves controls made of clothes, and each one has to make sense for its job. Drop's seek bar is a strip of the garments in the film: each chapter is cut from its garment's material, and whatever has played is finished. The playhead is the tool that does the finishing, and it changes as the film moves from one piece to the next.

## Design

| Garment | Ahead of the playhead | Behind it | Playhead (the tool doing the work) |
| --- | --- | --- | --- |
| Shirt | Buttonholes on oxford | Buttons done up | A button |
| Denim | Light-wash twill | Raw indigo, orange topstitching | The needle sewing it |
| Leather | Open zipper | Zipped shut | The zip pull |
| Knit | Flat heather jersey | Rib knit, drawstring threaded | A safety pin, which is how drawstrings are threaded |
| Footwear | Bare eyelets | Criss-cross laces | The lace's aglet |
| Dress | Flat crepe | Pressed, printed pleats | An iron |

Every other control takes the garment that does its job:

| Control | Garment logic |
| --- | --- |
| Mute | A zipper. Unzipped, the sound comes out; zipped, it's shut in. The pull slides across when you mute. |
| Volume | A size run, XS to XL. Turning it up is going up a size; muted, every size reads sold out. |
| Time | A tailor's tape measure, measuring the length of the film. The tape pulls out under the readout as it plays (still under reduced motion). |
| Replay | The tape measure rewinding to zero. |
| Pause | Two dressmaker's pins, pinning the moment. |
| Next / previous look | Hangers moving along the rail. |
| Settings | Tailor's scissors, for alterations. |
| Loading | A ring of stitches being sewn. |
| Shop | A kraft swing tag on a cord (the price tag), and a product sheet with the fabric and care label. |

Play and fullscreen keep their standard shapes, because no garment does those jobs better.

- **All CSS.** The materials are layered gradients, so they scale with the player and cost no images. A new garment type is a few gradient rules in `src/video/garments/garments.css` and a tool in `hardware.tsx`.
- **Inks and type.** Black, warm white and acid volt, with hot pink kept for scarcity. Archivo at its narrowest for display, Space Mono for anything that counts.
- **Legible over anything.** Controls are solid fills with a black keyline, so they read over a white sneaker or a black leather jacket alike.

## Accessibility (WCAG 2.2 AAA target)

- **Contrast 7:1** for all text, including dimmed labels, over solid fills only, so footage never sits behind type (1.4.6). Checked with a script over every visible text node.
- **Targets of 44×44px or larger** for every control, including slider thumbs, the bag's remove buttons and menu items (2.5.5).
- **Focus never hidden.** Keyboard focus keeps the controls on screen through the idle hide, and the swing tag moves clear (2.4.12). The focus ring is black, volt and black, and reads on any frame (2.4.13).
- **Keyboard only** (2.1.3). Every control is a native button, slider or radio with a label, in visual order. Escape closes the product sheet, bag and settings, and focus returns to the trigger. After the start screen, focus moves to the bar's play button.
- **Media alternatives.** The soundtrack is captioned (music only, no speech), and the showcase has a full described version of the film (1.2.2, 1.2.8).
- **Abbreviations expanded**: `SS27` and the size systems (W = waist in inches, EU shoe sizes) (3.1.4).
- **Motion.** Under reduced motion everything set off by interaction stops: tag swings, zipper pulls, tool swaps, the sliding tape, the ticker and the spinner (2.3.3). The ticker also pauses with the film (2.2.2).
- **Text blocks** on the showcase stay within 65–72 characters at 1.6+ line height (1.4.8).
- **Phones and tablets.** The skin measures its own box. Under 520px wide or 480px tall (phones either way up, tablets in portrait) it switches to a compact layout: play and the hangers in the middle, one bottom row of mute, garment strip, time and fullscreen, and a product sheet trimmed to name, price, sizes and button. `/devices.html` previews the showcase at iPhone, Android and iPad sizes in both orientations.
- `prefers-contrast: more`, `prefers-reduced-transparency` and forced-colors modes are handled.
- Keys: Space/K play, ←/→ seek 10s, ↑/↓ volume, M mute, C captions, F fullscreen, 0–9 jump.

Not done: no sign-language track (there is no speech to interpret), and no screen-reader pass with VoiceOver, NVDA or JAWS yet.

## Use it

```tsx
import { Video, VideoPlayer } from '@videojs/react/video';
import { VideoSkin, type ShopConfig } from './video/skin';

const shop: ShopConfig = {
  brand: 'NØ SIGNAL',
  drop: 'Drop 004',
  looks: [
    { id: '01', start: 0, end: 7, garment: 'shirt', name: 'Oxford Button-Down', price: 89, sizes: ['S', 'M', 'L'] },
    { id: '02', start: 7, end: 14, garment: 'denim', name: 'Selvedge Jean', price: 149, sizes: ['W30', 'W32'] },
  ],
  onAddToBag: (item) => console.log(item),
};

<VideoPlayer>
  <VideoSkin shop={shop}>
    <Video src="drop.mp4" playsInline>
      <track kind="chapters" src="chapters.vtt" default />
    </Video>
  </VideoSkin>
</VideoPlayer>;
```

Without `shop` it's a plain (loud) player.

## Develop

```sh
pnpm install
pnpm dev        # showcase at /, workbench at /workbench.html, device simulator at /devices.html
pnpm run build
```

- `src/video/skin.tsx`: the skin. `garments/` holds the garment seek strip, playhead tools, icons and size-run volume; `drop/` the other controls and `drop.css`; `shop/` the swing tag, product sheet, bag and look skipping.
- `scripts/build-media.sh`: rebuilds the demo lookbook, poster, product shots, storyboard and chapters from Mixkit sources.
- `apps/preview/`: the showcase page (`index.html`), the Video.js workbench (`workbench.html`), and the demo media.

The skin started from the Scaffold skin made by `videojs skin create`. Scaffold's layered CSS still supplies behavior (icon swaps, popup positioning, idle hiding), and Drop's unlayered CSS styles on top.

## Credits

- Footage and music: [Mixkit](https://mixkit.co), used under the Mixkit License, cut into a 42-second lookbook by `scripts/build-media.sh`.
- Fonts: Archivo and Space Mono (SIL Open Font License), via Fontsource.
- NØ SIGNAL is a fictional label. Prices and products are made up, and the checkout is a demo.

## License

The skin code is licensed under [Apache-2.0](LICENSE). The media in `apps/preview/public/media` stays under its own license (Mixkit).
