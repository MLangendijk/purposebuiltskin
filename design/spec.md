# Atelier: design spec

A Video.js 10 video skin for shoppable fashion film, for a quiet, high-end boutique. Built from the Scaffold skin
(`skin.json`), React + CSS. Agreed with the user over several rounds; details marked **derived** follow from what was
agreed rather than being asked.

## Brief

- High-class, clean shopping website. Classic garments (knitwear, shirts, tailoring, skirts, dresses), no streetwear.
- Pastel colours.
- The controls use real clothing elements, and each one has to make sense for its job.
- WCAG 2.2 AAA where it applies; works on phones and tablets in both orientations.
- Video, chapters and captions hosted on Mux.

## Layout and control order

Regular (players at least 520 × 480):

1. Top: wordmark (left), bag (right).
2. Swing tag for the piece on screen (right, above the panel; drops to the bottom corner while the controls rest).
3. Bottom panel: garment seek strip with its department rail, then one row: play, previous look, next look, mute,
   size-run volume, tape-measure time; settings and fullscreen at the far end.

Compact (narrower or shorter, set by `useLayout`): settings joins the bag on top; play and the hangers sit in the
centre; one bottom row of mute, the garment strip, time and fullscreen. The tag steps aside while the controls are up.

## Controls and what they are

| Control | Garment | Why |
| --- | --- | --- |
| Seek bar | One swatch per chapter, finished as it plays | Knitted rows, buttons done up, a seam sewn, pleats pressed, a zip closed |
| Playhead | The tool doing that finishing | Knitting needle, button, needle and thread, iron, zip pull |
| Volume | Size run XS to XL, a fifth each | Turning it up is going up a size |
| Time | Tailor's tape measure that pulls out as it plays | It measures the film's length |
| Replay | The tape rewinding | Back to zero |
| Mute | Open zip lets the sound out; closed zip shuts it in | "Zip it" |
| Pause | Two dressmaker's pins | The moment is pinned |
| Previous / next look | Hangers along a rail | Moving along the rail |
| Settings | Tailor's scissors | Alterations |
| Loading | A ring of stitches | Being sewn |
| Shop | Ivory swing tag on a gold cord; sheet with a fabric-and-care label | How a price is hung on a garment |

Play and fullscreen keep their standard shapes: no garment does those jobs better.

The garment for each chapter comes from the chapter title's department (`Knitwear · …`), so chapters on Mux carry
their materials with them.

## Type

- Cormorant Garamond 500 (and italic) for names and headlines.
- Jost for everything functional; labels in small capitals tracked at 0.14em (**derived**).
- `--media-font-family` overrides the sans.
- Times, prices and counts use tabular numerals.

## Colour and surfaces

- Ivory `#fbf8f3` and linen `#f3ede4` surfaces, charcoal `#2a2826` type, taupe `#4f4a45` secondary type (8.3:1).
- Pastels as fills only: blush, sage, powder, butter, lilac. Soft gold `#c9ab72` for hardware.
- `--media-accent-color` / `--media-accent-text-color` re-colour the filled controls (play, CTA, chosen size).
- Controls sit on solid ivory surfaces with a hairline and a soft shadow, so they read over any frame. Every text pair
  is at least 7:1.

## Icons

- One fine-line set on a 24px grid, 1.6px stroke, round caps.
- Garment flats for the departments, in the same weight.
- Playhead tools drawn on a 28 × 36 box with a charcoal keyline.

## Slider

- Seek: 6u swatch strip, pill segments, the active one outlined in charcoal, growing 1.5u on hover (**derived**).
- Volume: five chips, each centred on its step so a click picks that size.

## Motion

Tokens `--drop-fast` 160ms and `--drop-slow` 420ms, both collapsed under reduced motion. The moving parts:

- The tag swings on its cord when the piece changes.
- The playhead tool swaps in when the garment changes, never on first load.
- The zip pull slides when you mute.
- The tape slides with playback.
- Controls fade and lift.

## Focus and accessibility

- **Focus ring:** one shared ring on every focusable part (ivory, 3px charcoal, ivory), inset on menu items.
- **Hiding:** keyboard focus keeps the controls on screen.
- **Targets:** 44px minimum (48px on touch).
- **Captions:** from Mux, raised clear of the tag and the panel.
- **Copy:** all text goes through Video.js i18n (`drop.*` keys with English defaults).
