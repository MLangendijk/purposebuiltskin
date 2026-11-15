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
   hairdryer volume, tape-measure time; settings and fullscreen at the far end.

Compact (narrower or shorter, set by `useLayout`): settings joins the bag on top; play and the hangers sit in the
centre; one bottom row of mute, the garment strip, time and fullscreen. The tag steps aside while the controls are up.

## Controls and what they are

| Control | Garment | Why |
| --- | --- | --- |
| Seek bar | One swatch per chapter, finished as it plays | Knitted rows, buttons done up, a seam sewn, pleats pressed, a zip closed |
| Playhead | The tool doing that finishing | Knitting needle, button, needle and thread, iron, zip pull |
| Volume | Sound-wave arcs leaving the hairdryer's nozzle; more arcs light up as it gets louder | The universal volume signal, from a tool nothing else uses |
| Time | Tailor's tape measure that pulls out as it plays | It measures the film's length |
| Replay | The tape rewinding | Back to zero |
| Mute | The hairdryer itself, switched off (crossed out) when muted | Off is silent |
| Pause | Two dressmaker's pins | The moment is pinned |
| Previous / next look | Hangers along a rail | Moving along the rail |
| Settings | Tailor's scissors | Alterations |
| Loading | A ring of stitches | Being sewn |
| Shop | Ivory swing tag on a gold cord; sheet with a fabric-and-care label | How a price is hung on a garment |

Play and fullscreen keep their standard shapes: no garment does those jobs better.

The strip follows the film's chapters, so any cut works (any number and length of chapters, intros and gaps). Each
chapter's garment comes from its metadata (`garment` in Mux's Apple JSON chapters, see `use-pieces.ts`), else its
title's department (`Knitwear · …`), else its look. A garment the skin doesn't draw is cut as a toile: calico, the
pattern line traced ahead, basted behind, with a tracing wheel as the playhead. Looks are linked to chapters by id
(chapter metadata `look`, or a WebVTT cue identifier); without chapters, the looks' own timings make them.

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
- Volume: five sound-wave arcs growing from the dryer's nozzle; lit in the accent up to the level, thin outlines
  beyond. Any sound lights the first arc; full volume lights all five.

## Motion

Tokens `--atelier-fast` 160ms and `--atelier-slow` 420ms, both collapsed under reduced motion. The moving parts:

- The tag swings on its cord when the piece changes.
- The playhead tool swaps in when the garment changes, never on first load.
- The tape slides with playback.
- Controls fade and lift.

## Focus and accessibility

- **Focus ring:** one shared ring on every focusable part (ivory, 3px charcoal, ivory), inset on menu items.
- **Hiding:** keyboard focus keeps the controls on screen.
- **Targets:** 44px minimum (48px on touch).
- **Captions:** from Mux, raised clear of the tag and the panel.
- **Copy:** all text goes through Video.js i18n (`atelier.*` keys with English defaults).
