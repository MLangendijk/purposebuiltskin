import { Container, Tooltip } from '@videojs/react';
import { MuxVideo } from '@videojs/react/media/mux-video';
import { VideoPlayer } from '@videojs/react/video';
import { type CSSProperties, type ReactNode, useState } from 'react';

import * as Icons from '@/video/atelier/icons';
import { FullscreenButton, PlayButton } from '@/video/atelier/buttons';
import { DryerVolume } from '@/video/garments/dryer-volume';
import { GarmentIcon } from '@/video/garments/garment-icons';
import { GarmentSeek } from '@/video/garments/garment-seek';
import { type Garment, GARMENT_LABEL, GARMENTS } from '@/video/garments/garments';
import { Hardware } from '@/video/garments/hardware';
import { TapeMeasure } from '@/video/garments/tape-measure';
import { MuxChapters } from '@/video/mux/mux-chapters';
import { SettingsMenu } from '@/video/shared/settings-menu';
import { BagMenu } from '@/video/shop/bag-menu';
import { LookSkip } from '@/video/shop/look-skip';
import { LookTag, TagFace } from '@/video/shop/look-tag';
import { ProductSheet } from '@/video/shop/product-sheet';
import { ShopProvider } from '@/video/shop/shop-context';

import { VERTICAL } from '../frame/player';
import { SPRING_EDIT } from '../frame/spring-edit';

/** What each garment looks like in the seek bar: ahead of the playhead, behind it, and the tool doing the work. */
const MATERIALS: Record<Garment, { ahead: string; done: string; tool: string }> = {
  knit: { ahead: 'A loose strand of yarn', done: 'Knitted stocking stitch', tool: 'A knitting needle' },
  shirt: { ahead: 'Buttonholes on oxford', done: 'Pearl buttons done up', tool: 'A button' },
  tailoring: { ahead: "Tailor's chalk on flannel", done: 'The seam sewn', tool: 'Needle and thread' },
  skirt: { ahead: 'Flat crepe', done: 'Pressed pleats', tool: 'An iron' },
  dress: { ahead: 'The back zip open', done: 'Zipped shut', tool: 'A fine zip pull' },
  other: { ahead: 'Calico, the pattern line traced', done: 'Basted in red thread', tool: 'A tracing wheel' },
};

const ICONS = Object.entries(Icons).filter(([name]) => name.endsWith('Icon'));

const PALETTE = [
  ['Ivory', '--ivory', '#fbf8f3', 'Surfaces'],
  ['Linen', '--linen', '#f3ede4', 'Quiet surfaces, price cells'],
  ['Ink', '--ink', '#2a2826', 'Type, play, focus ring'],
  ['Taupe', '--taupe', '#4f4a45', 'Secondary type (8.3:1 on ivory)'],
  ['Gold', '--gold', '#c9ab72', 'Hardware, the tag cord'],
  ['Blush', '--blush', '#ebd3cc', 'Low stock, bag count'],
  ['Sage', '--sage', '#d3decf', 'Added to bag'],
  ['Powder', '--powder', '#d4e0ec', 'Pastel fill'],
  ['Butter', '--butter', '#f2e8c9', 'The tape measure'],
  ['Lilac', '--lilac', '#e4dcec', 'Pastel fill'],
] as const;

/** The attributes every Atelier part sits under: the Scaffold base, the video preset, and the skin itself. */
const SKIN = { 'data-theme': 'scaffold', 'data-preset': 'video', 'data-skin': 'atelier' } as const;

export function Elements() {
  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="Pages">
          <a href="./">Showcase</a>
          <a href="./workbench.html">Workbench</a>
        </nav>
        <span className="site-logo">Atelier</span>
        <span className="el-header-tag">Elements</span>
      </header>

      <main className="el-main">
        <section className="el-intro" aria-labelledby="el-title">
          <h1 id="el-title" className="site-title">
            The <em>elements</em>
          </h1>
          <p className="site-lede">
            Every part of the skin, on its own, with the component that draws it. The first section is live: one film
            drives all of them. Compose them into your own layout, or take the whole skin from{' '}
            <code>src/video/skin.tsx</code>.
          </p>
        </section>

        <LiveParts />
        <Materials />
        <Tools />
        <SwingTags />
        <IconSet />
        <Tokens />
      </main>

      <footer className="site-footer">
        <p>
          Atelier is a skin for the <a href="https://videojs.org">Video.js v10</a> player, licensed Apache-2.0.
          Footage from <a href="https://mixkit.co">Mixkit</a>.
        </p>
      </footer>
    </>
  );
}

function Section({ id, title, lede, children }: { id: string; title: string; lede: ReactNode; children: ReactNode }) {
  return (
    <section className="el-section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="site-h2">
        {title}
      </h2>
      <p className="el-lede">{lede}</p>
      {children}
    </section>
  );
}

/** One part, captioned with its component and file. */
function Part({ name, file, note, children, wide }: { name: string; file: string; note: string; children: ReactNode; wide?: boolean }) {
  return (
    <figure className="el-part" data-wide={wide ? '' : undefined}>
      <div className="el-part-stage">{children}</div>
      <figcaption>
        <code className="el-part-name">{`<${name} />`}</code>
        <span className="el-part-file">{file}</span>
        <span className="el-part-note">{note}</span>
      </figcaption>
    </figure>
  );
}

/** The live parts share one player: the vertical cut on Mux, with its chapters. */
function LiveParts() {
  return (
    <Section
      id="live"
      title="Live parts"
      lede="Play the film and every part follows it: the strip finishes each garment, the tools swap, the tape measures, the tag offers the piece on screen."
    >
      <VideoPlayer poster={`https://image.mux.com/${VERTICAL.playbackId}/thumbnail.webp?time=${VERTICAL.posterTime}&width=640`}>
        <ShopProvider shop={VERTICAL.shop}>
          <Container className="media-skin media-container el-bench" {...SKIN} data-layout="regular">
            <Tooltip.Provider>
              <div className="el-bench-film">
                <MuxVideo src={`https://stream.mux.com/${VERTICAL.playbackId}.m3u8`} playsInline crossOrigin="anonymous" />
                <LookTag />
              </div>
              <MuxChapters playbackId={VERTICAL.playbackId} trackId={VERTICAL.chaptersTrack!} />

              <div className="el-parts">
                <Part
                  wide
                  name="GarmentSeek"
                  file="src/video/garments/garment-seek.tsx"
                  note="The seek bar: one material per chapter, finished as it plays, with the department rail under it."
                >
                  <GarmentSeek />
                </Part>
                <Part name="PlayButton" file="src/video/atelier/buttons.tsx" note="Pause is two dressmaker's pins.">
                  <PlayButton className="atelier-play" />
                </Part>
                <Part name="LookSkip" file="src/video/shop/look-skip.tsx" note="Hangers: the previous and next look.">
                  <span className="el-row">
                    <LookSkip direction="prev" />
                    <LookSkip direction="next" />
                  </span>
                </Part>
                <Part
                  name="DryerVolume"
                  file="src/video/garments/dryer-volume.tsx"
                  note="Mute is the hairdryer; volume is the sound waves it sends out."
                >
                  <DryerVolume />
                </Part>
                <Part name="TapeMeasure" file="src/video/garments/tape-measure.tsx" note="Time on a tape that pulls out as it plays.">
                  <TapeMeasure />
                </Part>
                <Part name="SettingsMenu" file="src/video/shared/settings-menu.tsx" note="Tailor's scissors: quality, speed, captions.">
                  <SettingsMenu side="bottom" />
                </Part>
                <Part name="BagMenu" file="src/video/shop/bag-menu.tsx" note="The bag. Add a piece from the swing tag on the film.">
                  <BagMenu />
                </Part>
                <Part name="FullscreenButton" file="src/video/atelier/buttons.tsx" note="Kept standard: no garment does it better.">
                  <FullscreenButton />
                </Part>
              </div>
              <ProductSheet />
            </Tooltip.Provider>
          </Container>
        </ShopProvider>
      </VideoPlayer>
    </Section>
  );
}

/** Every material the strip can be cut from, with a handle to finish it yourself. */
function Materials() {
  return (
    <Section
      id="materials"
      title="Seek-bar materials"
      lede={
        <>
          A chapter's garment comes from its metadata or its title (<code>Shirting · Oxford Shirt</code>). Anything the
          skin doesn't draw is cut as a toile. Drag a slider to finish a garment.
        </>
      }
    >
      <div className="el-static media-skin" {...SKIN}>
        <ul className="el-materials">
          {GARMENTS.map((garment) => (
            <MaterialSwatch key={garment} garment={garment} />
          ))}
        </ul>
      </div>
    </Section>
  );
}

function MaterialSwatch({ garment }: { garment: Garment }) {
  const [fill, setFill] = useState(55);
  const notes = MATERIALS[garment];
  const id = `el-material-${garment}`;

  return (
    <li className="el-material">
      <p className="el-material-name" id={id}>
        <GarmentIcon garment={garment} />
        {GARMENT_LABEL[garment]}
        <code>{garment}</code>
      </p>
      <div className="el-swatch garment-seek" data-garment={garment}>
        <div className="garment-slider el-swatch-slider">
          <div className="garment-segments">
            <div className="garment-segment" data-garment={garment} style={{ '--fill': `${fill}%` } as CSSProperties}>
              <span className="garment-material garment-material-ahead" />
              <span className="garment-material garment-material-done" />
            </div>
          </div>
          <span className="garment-thumb el-swatch-thumb" style={{ left: `${fill}%` }} aria-hidden="true">
            <Hardware garment={garment} />
          </span>
          <input
            className="el-swatch-range"
            type="range"
            min={0}
            max={100}
            value={fill}
            aria-labelledby={id}
            aria-valuetext={`${fill}% finished`}
            onChange={(event) => setFill(Number(event.target.value))}
          />
        </div>
      </div>
      <dl className="el-material-notes">
        <div>
          <dt>Ahead</dt>
          <dd>{notes.ahead}</dd>
        </div>
        <div>
          <dt>Behind</dt>
          <dd>{notes.done}</dd>
        </div>
        <div>
          <dt>Playhead</dt>
          <dd>{notes.tool}</dd>
        </div>
      </dl>
    </li>
  );
}

function Tools() {
  return (
    <Section
      id="tools"
      title="Playhead tools"
      lede={
        <>
          <code>{'<Hardware garment="shirt" />'}</code> in <code>src/video/garments/hardware.tsx</code>. Drawn on a 28 × 36
          box in charcoal line with pearl, silver and soft gold, so they read on light and dark materials alike.
        </>
      }
    >
      <ul className="el-tools media-skin" {...SKIN}>
        {GARMENTS.map((garment) => (
          <li key={garment}>
            <span className="el-tool">
              <Hardware garment={garment} />
            </span>
            <span>{MATERIALS[garment].tool}</span>
            <code>{garment}</code>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function SwingTags() {
  return (
    <Section
      id="tags"
      title="Swing tags"
      lede={
        <>
          <code>{'<LookTag />'}</code> hangs the piece on screen; <code>{'<TagFace look={look} />'}</code> is its face, in{' '}
          <code>src/video/shop/look-tag.tsx</code>. One per look in the shop's config.
        </>
      }
    >
      <ShopProvider shop={SPRING_EDIT}>
        <ul className="el-tags media-skin" {...SKIN}>
          {SPRING_EDIT.looks.map((look) => (
            <li key={look.id}>
              <span className="atelier-tag el-tag">
                <TagFace look={look} />
              </span>
            </li>
          ))}
        </ul>
      </ShopProvider>
    </Section>
  );
}

function IconSet() {
  return (
    <Section
      id="icons"
      title="Icons"
      lede={
        <>
          One fine-line set on a 24px grid, in <code>src/video/atelier/icons.tsx</code>, and garment flats in{' '}
          <code>src/video/garments/garment-icons.tsx</code>. All decorative: every control carries its own label.
        </>
      }
    >
      <ul className="el-icons">
        {ICONS.map(([name, Icon]) => (
          <li key={name}>
            <Icon aria-hidden="true" />
            <code>{name}</code>
          </li>
        ))}
        {GARMENTS.map((garment) => (
          <li key={garment}>
            <GarmentIcon garment={garment} />
            <code>{`GarmentIcon ${garment}`}</code>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Tokens() {
  return (
    <Section
      id="tokens"
      title="Colour and type"
      lede={
        <>
          Tokens live on <code>.media-skin[data-skin="atelier"]</code> in <code>src/video/atelier/atelier.css</code>. Set{' '}
          <code>--media-accent-color</code> to recolour play, the bag button and the chosen size.
        </>
      }
    >
      <ul className="el-palette">
        {PALETTE.map(([name, token, hex, use]) => (
          <li key={token}>
            <span className="el-chip" style={{ background: hex }} />
            <strong>{name}</strong>
            <code>
              {token} {hex}
            </code>
            <span>{use}</span>
          </li>
        ))}
      </ul>
      <div className="el-type">
        <p className="el-type-serif">Cormorant Garamond, for names: Linen Maxi Dress</p>
        <p className="el-type-label">Jost in small capitals, for labels · Look 05</p>
        <p className="el-type-body">Jost for everything functional. Times and prices use tabular numerals: 0:18 · €280.</p>
      </div>
    </Section>
  );
}
