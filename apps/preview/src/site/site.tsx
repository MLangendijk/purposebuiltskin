import { GarmentIcon } from '@/video/garments/garment-icons';
import { GARMENT_LABEL } from '@/video/garments/garments';

import { DROP_004 } from '../frame/drop-004';
import { Player } from '../frame/player';

const KEYS: [string, string][] = [
  ['Space / K', 'Play or pause'],
  ['← / →', 'Back or forward 10s'],
  ['↑ / ↓', 'Volume'],
  ['M', 'Mute'],
  ['F', 'Fullscreen'],
  ['0–9', 'Jump to 0–90%'],
  ['Esc', 'Close the product sheet, bag or menu'],
];

const format = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

/** Seeks the player on this page to a look and plays it. */
function watchLook(start: number) {
  const video = document.querySelector<HTMLVideoElement>('.site-player video');
  if (!video) return;
  video.currentTime = start;
  void video.play();
  document.querySelector('.site-player')?.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'center',
  });
  document.querySelector<HTMLElement>('.site-player .media-container')?.focus({ preventScroll: true });
}

export function Site() {
  return (
    <>
      <a className="site-skip" href="#player">
        Skip to the player
      </a>

      <header className="site-header">
        <span className="site-logo">
          NØ SIGNAL<sup>®</sup>
        </span>
        <span className="site-header-note">Drop · a shoppable fashion skin for Video.js v10</span>
        <a className="site-header-link" href="./workbench.html">
          Workbench ↗
        </a>
      </header>

      <main>
        <section className="site-hero" aria-labelledby="hero-title">
          <p className="site-kicker">
            <span className="site-sticker">{DROP_004.drop}</span>
            <span className="site-sticker site-sticker-paper">{DROP_004.season}</span>
          </p>
          <h1 id="hero-title" className="site-title">
            Shop the <em>film</em>.
          </h1>
          <p className="site-lede">
            Six pieces, forty-two seconds. Watch the seek bar turn into each garment, then hit the swing tag to shop
            it without leaving the film.
          </p>
          <div className="site-player" id="player">
            <Player />
          </div>
        </section>

        <section className="site-looks" aria-labelledby="looks-title">
          <h2 id="looks-title" className="site-h2">
            The looks
          </h2>
          <ol className="site-look-grid">
            {DROP_004.looks.map((look) => (
              <li key={look.id} className="site-look">
                <img className="site-look-image" src={look.image} alt="" loading="lazy" width="360" height="480" />
                <div className="site-look-body">
                  <span className="site-look-id">
                    <GarmentIcon garment={look.garment} />
                    {GARMENT_LABEL[look.garment]} · {look.id}
                  </span>
                  <h3 className="site-look-name">{look.name}</h3>
                  <span className="site-look-price">{format.format(look.price)}</span>
                  <button type="button" className="site-look-watch" onClick={() => watchLook(look.start)}>
                    Watch look {look.id} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="site-about" aria-labelledby="about-title">
          <h2 id="about-title" className="site-h2">
            Controls cut from the clothes
          </h2>
          <div className="site-about-grid">
            <article>
              <h3>The seek bar is the wardrobe</h3>
              <p>
                Each chapter of the bar is cut from the garment on screen: a button placket for the shirt, selvedge
                denim with orange double stitching, a zipper for the leather jacket, a drawstring through rib knit, laces
                for the sneakers, printed pleats for the dress. Whatever has played is finished: buttoned, zipped,
                laced. The playhead is the tool doing the work: a button doing up the shirt, a needle sewing the seam,
                the zip pull, a safety pin threading the drawstring, the aglet lacing the shoe, an iron pressing the
                pleats.
              </p>
            </article>
            <article>
              <h3>Every control has a job in the wardrobe</h3>
              <p>
                Mute is a zipper: open lets the sound out, zipped shuts it in. Volume is a size run, so turning it up is
                going up a size. Time is a tailor's tape measure, and replay rewinds it to zero. Pause pins the moment.
                Hangers move you along the rail to the next look, scissors open the alterations. Prices hang on kraft
                swing tags, and fabric and care sit on a label like the one inside a collar.
              </p>
            </article>
            <article>
              <h3>Shop without leaving</h3>
              <p>
                The swing tag stays up while the controls hide. Tap it and a sheet slides in, pauses the film, takes your
                size (W30 for jeans, EU 42 for sneakers), and picks playback back up when it closes. Skip buttons jump
                piece to piece like flipping a lookbook.
              </p>
            </article>
            <article>
              <h3>Legible and accessible</h3>
              <p>
                Every control is a real button, slider or radio with a label, set on solid fills with a black keyline,
                so it holds over a white sneaker or a black leather jacket. Focus is a black, volt and black ring.
                Targets are 40–44px, the layout follows the player's own width, motion stops under reduced motion,
                and high-contrast and forced-colors modes are covered.
              </p>
            </article>
          </div>

          <div className="site-keys">
            <h3>Keyboard</h3>
            <dl>
              {KEYS.map(([key, action]) => (
                <div key={key}>
                  <dt>
                    <kbd>{key}</kbd>
                  </dt>
                  <dd>{action}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          Drop is a skin for the <a href="https://videojs.org">Video.js v10</a> player, licensed Apache-2.0. NØ SIGNAL is a
          fictional label and the shop is a demo: nothing is sold or charged.
        </p>
        <p>
          Footage and music from <a href="https://mixkit.co">Mixkit</a> under the Mixkit License. Type: Archivo and Space
          Mono (SIL OFL).
        </p>
      </footer>
    </>
  );
}
