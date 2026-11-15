# Atelier

**A shoppable boutique skin for the [Video.js v10](https://videojs.org) player, with controls cut from the clothes.**

Live: https://mlangendijk.github.io/purposebuiltskin/

Fashion film deserves controls made of clothes, and each one has to make sense for its job. Atelier's seek bar is a strip of the garments in the film: each chapter is cut from its garment's material, and whatever has played is finished. The playhead is the tool doing the finishing, and it changes as the film moves from one piece to the next. The demo house is Maison Marelle, showing The Spring Edit: five pieces in forty seconds.

## Design

| Garment | Ahead of the playhead | Behind it | Playhead (the tool doing the work) |
| --- | --- | --- | --- |
| Knitwear | Loose yarn | Knitted stocking stitch | A knitting needle |
| Shirting | Buttonholes on oxford | Pearl buttons done up | A button |
| Tailoring | Tailor's chalk on flannel | The seam sewn | Needle and thread |
| Skirts | Flat crepe | Pressed pleats | An iron |
| Dresses | The back zip open | Zipped shut | A fine zip pull |
| Anything else | A toile in calico, the pattern line traced | Basted in red thread | A tracing wheel |

Every other control takes the tool that does its job:

| Control | What it is |
| --- | --- |
| Mute | A hairdryer. Muted, it's switched off. |
| Volume | The sound the hairdryer sends out, as sound-wave arcs: more arcs light up the louder it plays. |
| Time | A tailor's tape measure that pulls out as the film plays. |
| Replay | The tape rewinding to zero. |
| Pause | Two dressmaker's pins, pinning the moment. |
| Previous / next look | Hangers moving along the rail. |
| Settings | Tailor's scissors, for alterations. |
| Loading | A ring of stitches being sewn. |
| Shop | An ivory swing tag on a gold cord, and a product sheet with the fabric and care label. |

Play and fullscreen keep their standard shapes, because no garment does those jobs better.

- **Boutique, not streetwear.** Ivory and linen surfaces, charcoal type, pastel fills, soft-gold hardware. Cormorant Garamond for names, Jost for everything functional.
- **All CSS.** The materials are layered gradients, so they scale with the player and cost no images. A new garment is a few gradient rules in `src/video/garments/garments.css` and a tool in `hardware.tsx`.
- **Legible over anything.** Controls sit on solid ivory with a hairline, so they read over a white dress or a dark interior alike.

## Any film, any cut

The strip follows the film's chapters, so it fits any video: a 40-second lookbook or a runway show, five looks or twenty, an intro or a backstage shot between pieces. For each chapter the skin works out:

- **Its garment:** from the chapter's metadata, else its title (`Knitwear · Cable-Knit Jumper`), else the look it sells. A garment the skin doesn't draw (`Outerwear`, `Footwear`) is cut as a toile, and the department rail shows the title's own word for it.
- **Its look:** the look the chapter's metadata or cue id names, else the one its title names (`… · Linen Maxi Dress`), else the look in the same position when there's one per chapter. Chapters without a look (an intro, a finale) have no swing tag, and the hangers skip them.

The showcase proves it with two films on Mux: the 16:9 lookbook (five looks of eight seconds), and a 30-second 9:16 vertical cut. The vertical cut shows three of the pieces in a new order and at different lengths. The skin and products are the same, and the strip, tags and hangers follow each film's chapters.

Where the chapters come from:

- **Mux:** a chapters track in Apple's JSON chapters format, with the garment and look as chapter metadata. Mux also puts the chapters in the HLS stream, and Video.js prefers those, but they keep only the titles. That's why a title names both garment and product. `MuxChapters` loads the JSON with its metadata for playback that doesn't expose the stream's chapters.

  ```json
  { "chapter": 1, "start-time": 0,
    "titles": [{ "language": "en", "title": "Knitwear · Cable-Knit Cashmere Jumper" }],
    "metadata": [{ "key": "garment", "value": "knit" }, { "key": "look", "value": "01" }] }
  ```

- **WebVTT:** a chapters `<track>`. The cue identifier is the look id; the title names the garment.
- **Neither:** the skin builds the chapters from each look's `start` and `end`. Those timings also stand in while a chapters file loads, or if it fails, so the shop keeps working.

The rail drops its labels on short chapters and its icons on very short ones. In compact players the skin switches layout by measuring its own box, so portrait (9:16) and square players work too.

## Accessibility (WCAG 2.2 AAA target)

- **Contrast 7:1** for all text, including dimmed labels, over solid fills only (1.4.6). Control edges, the unlit volume arcs and the seek swatches' outlines are at least 3:1 (1.4.11), and turn charcoal under `prefers-contrast: more`.
- **Targets of 44×44px or larger** for every control, including slider thumbs, the bag's remove buttons and menu items (2.5.5).
- **Focus never hidden.** Keyboard focus keeps the controls on screen through the idle hide, and the swing tag moves clear (2.4.12). In compact players the tag fades while the controls are up but stays in the tab order, and focusing it brings it back. The focus ring is ivory, charcoal and ivory, and reads on any frame (2.4.13).
- **Focus kept across layouts.** Going fullscreen, rotating or zooming can switch between the compact and regular layouts. Focus moves to the same control in the new layout, so keyboard users and hotkeys keep their place.
- **Keyboard only** (2.1.3). Every control is a native button, slider or radio with a label, in visual order. Escape closes the product sheet, bag and settings, and focus returns to the trigger. After the start screen, focus moves to the bar's play button.
- **Names say what happens.** The back hanger reads "Restart look 03" or "Previous look: 02" depending on what it will do. The swing tag's name includes low stock.
- **Media alternatives.** The soundtrack is captioned (music only, no speech), and the showcase has a full described version of the film (1.2.2, 1.2.8).
- **Abbreviations written out** (3.1.4): the season (`Spring/Summer 2027`), the size runs, and "48 hours".
- **Text wraps** instead of being cut off: product names and chapter titles in the preview (1.4.12).
- **Motion.** Under reduced motion everything set off by interaction stops: tag swings, tool swaps, the sliding tape and the spinner (2.3.3).
- **Language.** All copy goes through Video.js i18n (`atelier.*` keys with English defaults), including group labels.
- **RTL.** The controls mirror; the timeline keeps running left to right, as media timelines do.
- `prefers-contrast: more`, `prefers-reduced-transparency` and forced-colors modes are handled.
- Keys: Space/K play, ←/→ seek 10s, ↑/↓ volume, M mute, C captions, F fullscreen, 0–9 jump.

Not done: no sign-language track (there is no speech to interpret), and no pass with a real screen reader (VoiceOver, NVDA, JAWS) or on real touch devices yet.

## Use it

```tsx
import { MuxVideo } from '@videojs/react/media/mux-video';
import { VideoPlayer } from '@videojs/react/video';
import { MuxChapters } from './video/mux/mux-chapters';
import { VideoSkin, type ShopConfig } from './video/skin';

const shop: ShopConfig = {
  brand: 'Maison Marelle',
  collection: 'The Spring Edit',
  looks: [
    { id: '01', garment: 'knit', name: 'Cable-Knit Cashmere Jumper', price: 240, sizes: ['S', 'M', 'L'] },
    { id: '02', garment: 'shirt', name: 'Oxford Cotton Shirt', price: 120, sizes: ['S', 'M', 'L'] },
  ],
  onAddToBag: (item) => console.log(item),
};

<VideoPlayer>
  <VideoSkin shop={shop}>
    <MuxVideo src={`https://stream.mux.com/${PLAYBACK_ID}.m3u8`} playsInline />
    <MuxChapters playbackId={PLAYBACK_ID} trackId={CHAPTERS_TRACK_ID} />
  </VideoSkin>
</VideoPlayer>;
```

Looks need no timings when the film has chapters. Without `shop` it's a plain player, still cut from cloth.

## Mux

Mux hosts the stream, poster, storyboard, chapters and captions, and measures views with Mux Data.

Each film has a config in `scripts/films/` (`spring-edit`, `vertical`), and the scripts take its name:

- `scripts/mux-upload.sh <film>` uploads the video as a new asset (a direct upload, so it needn't be public first) and writes the ids into the config.
- `scripts/mux-add-tracks.sh <film>` puts the chapters and captions on the asset. It's safe to re-run, and it replaces the chapters track when `chapters.json` changes.
- `scripts/mux-set-meta.sh <film>` names the asset (title, external id).
- **Mux Data:** the showcase player includes Video.js's `<MuxData>` extension. No env key is needed: views are tied to the environment through the playback ID. It reports `player_name`, `video_title` and `video_series`, and sets no cookies, so the demo needs no consent banner.

## Develop

```sh
pnpm install
pnpm dev        # showcase at /, workbench at /workbench.html, device simulator at /devices.html
pnpm run build
```

- `src/video/skin.tsx`: the skin. `garments/` holds the seek strip, its pieces (`use-pieces.ts`), playhead tools, icons, hairdryer volume and tape-measure time; `atelier/` the other controls, layouts and styles; `shop/` the swing tag, product sheet, bag, look skipping and the looks-as-chapters fallback; `mux/` the Mux chapters loader.
- `scripts/build-media.sh`: rebuilds the demo lookbook, poster, product shots, storyboard and chapters from Mixkit sources (`build-media.sh chapters` rewrites only the chapters). `scripts/build-vertical.sh` cuts the 9:16 film from the same clips.
- `apps/preview/`: the showcase page (`index.html`), the Video.js workbench (`workbench.html`), and the demo media.

The skin started from the Scaffold skin made by `videojs skin create`. Scaffold's layered CSS still supplies behavior (icon swaps, popup positioning, idle hiding), and Atelier's unlayered CSS styles on top.

## Credits

- Footage and music: [Mixkit](https://mixkit.co), used under the Mixkit License, cut into a 40-second lookbook by `scripts/build-media.sh`.
- Fonts: Cormorant Garamond and Jost (SIL Open Font License), via Fontsource.
- Maison Marelle is a fictional house. Prices and products are made up, and the checkout is a demo.

## License

The skin code is licensed under [Apache-2.0](LICENSE). The media in `apps/preview/public/media` stays under its own license (Mixkit).
