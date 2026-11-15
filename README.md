# Drop

**A shoppable fashion skin for the [Video.js v10](https://videojs.org) player, with controls cut from the clothes.**

Fashion video deserves controls made of clothes. Drop's seek bar is a strip of the garments in the film. Each chapter is cut from its garment's material, and whatever has played is finished: the shirt buttoned, the jacket zipped, the sneaker laced. The playhead turns into each garment's hardware as it crosses from one piece to the next. A kraft swing tag for the piece on screen lets you pick a size and bag it without leaving the film.

## Design

| Garment | Ahead of the playhead | Behind it | Playhead |
| --- | --- | --- | --- |
| Shirt | Buttonholes on oxford | Buttons done up | Shirt button |
| Denim | Light-wash twill | Raw indigo, orange double stitch | Copper rivet |
| Leather | Open zipper | Zipped shut | Zip pull |
| Knit | Flat heather jersey | Rib knit with drawstring | Cord stopper |
| Footwear | Bare eyelets | Criss-cross laces | Aglet |
| Dress | Flat crepe | Printed pleats | Dressmaker's pin |

- **The rest of the wardrobe.** Volume is a leather belt: slide the buckle along the holes. Time is printed on a woven care label. Products hang on kraft swing tags with a cord, which swing in when the piece changes. The product sheet carries the fabric and care line like the label in a collar, with real sizes (W30, EU 42).
- **All CSS.** The materials are layered gradients, so they scale with the player and cost no images. A new garment type is a few gradient rules in `src/video/garments/garments.css`.
- **Inks and type.** Black, warm white and acid volt, with hot pink kept for scarcity. Archivo at its narrowest for display, Space Mono for anything that counts.
- **Legible over anything.** Controls are solid fills with a black keyline and a hard shadow, so they read over a white sneaker or a black leather jacket alike.

## Accessibility

- Every control is a native button, slider or radio with a label. The source order follows the visual order.
- Focus shows as a black, volt and black ring that reads on any frame.
- Controls are 40px (44px on touch screens).
- The layout responds to the player's own width (container queries), from 320px up to fullscreen.
- Escape closes the product sheet, bag and settings menu, and focus returns to the control that opened them.
- `prefers-contrast: more`, `prefers-reduced-transparency` and forced-colors modes are handled.
- Keys: Space/K to play, ←/→ to seek, ↑/↓ for volume, M to mute, F for fullscreen, 0–9 to jump.

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
pnpm dev        # showcase at /, workbench at /workbench.html
pnpm run build
```

- `src/video/skin.tsx`: the skin. `garments/` holds the garment seek strip, hardware, icons and belt volume; `drop/` the other controls and `drop.css`; `shop/` the swing tag, product sheet, bag and look skipping.
- `scripts/build-media.sh`: rebuilds the demo lookbook, poster, product shots, storyboard and chapters from Mixkit sources.
- `apps/preview/`: the showcase page (`index.html`), the Video.js workbench (`workbench.html`), and the demo media.

The skin started from the Scaffold skin made by `videojs skin create`. Scaffold's layered CSS still supplies behavior (icon swaps, popup positioning, idle hiding), and Drop's unlayered CSS styles on top.

## Credits

- Footage and music: [Mixkit](https://mixkit.co), used under the Mixkit License, cut into a 42-second lookbook by `scripts/build-media.sh`.
- Fonts: Archivo and Space Mono (SIL Open Font License), via Fontsource.
- NØ SIGNAL is a fictional label. Prices and products are made up, and the checkout is a demo.

## License

The skin code is licensed under [Apache-2.0](LICENSE). The media in `apps/preview/public/media` stays under its own license (Mixkit).
