# Submission text

Draft copy for the Video.js v10 skin challenge form. Adjust to the form's fields.

**Title:** Atelier: a shoppable boutique skin, cut from the clothes

**One line:** A Video.js v10 skin for fashion film where every control is a piece of the atelier: the seek bar is the garments themselves, finished as they play.

**Links**

- Live: https://mlangendijk.github.io/purposebuiltskin/
- Code: https://github.com/MLangendijk/purposebuiltskin
- Mux playback ID: `iYNPL02029CpHpmg2Hc21G9hWsj3LEYq9bTqf02ipLkW02k`

**Description**

Atelier is a React + CSS skin for shoppable fashion video, built on the Scaffold skin. Each control is the atelier tool that does its job. The seek bar is a strip of the film's garments, and what has played is finished: a jumper knitted, a shirt buttoned, a seam sewn, pleats pressed, a zip closed. The playhead becomes the tool doing that work. Volume is a hairdryer sending out sound waves, time is a tailor's tape measure, pause is two pins, and the next and previous looks are hangers on a rail. A swing tag hangs on the piece on screen. It opens a product sheet with sizes and a care label, and the film pauses while you shop and picks up again when you're done.

It works for any film. The strip follows the video's chapters, which Mux serves with the garment and look as chapter metadata. Any number of chapters, any lengths and any garment work: one the skin doesn't draw is cut as a calico toile. Mux hosts the stream, poster, storyboard, chapters and captions, and Mux Data measures views.

**Visual design:** a quiet boutique palette (ivory, linen, charcoal, pastels, soft gold), Cormorant Garamond with Jost, and every material drawn in CSS gradients, so nothing is an image and everything scales.

**Usability:** controls on solid surfaces that read over any frame. Shopping never costs your place in the film. A compact layout, chosen by measuring the player itself, serves phones, tablets and portrait players.

**Accessibility:** built to WCAG 2.2 AAA where it applies:

- 7:1 text contrast and 44px targets
- One strong focus ring that is never hidden, and focus kept across layout changes
- Full keyboard and hotkey control, with names that say what each button will do
- Captions, and a described version of the film
- Reduced-motion, high-contrast, forced-colors and RTL support
- All copy translatable through Video.js i18n

**Polish:** tools swap as the film moves between garments, the tag swings on its cord, and the tape slides with playback. All of it stops under reduced motion.
