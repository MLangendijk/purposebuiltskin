import { GarmentIcon } from '@/video/garments/garment-icons';
import { GARMENT_LABEL } from '@/video/garments/garments';

import { Player, VERTICAL } from '../frame/player';
import { DESCRIBED_VERSION, SPRING_EDIT } from '../frame/spring-edit';

const KEYS: [string, string][] = [
  ['Space / K', 'Play or pause'],
  ['← / →', 'Back or forward 10 seconds'],
  ['↑ / ↓', 'Volume'],
  ['M', 'Mute'],
  ['F', 'Fullscreen'],
  ['0–9', 'Jump to 0–90%'],
  ['C', 'Captions on or off'],
  ['Esc', 'Close the product sheet, bag or menu'],
];

/** A soft background per card, cycling through the collection's pastels. */
const PASTELS = ['butter', 'powder', 'blush', 'lilac', 'sage'];

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
        Skip to the film
      </a>

      <header className="site-header">
        <nav className="site-nav" aria-label="Sections">
          <a href="#player">The film</a>
          <a href="#vertical">Vertical cut</a>
          <a href="#pieces">The pieces</a>
          <a href="#about">The skin</a>
        </nav>
        <span className="site-logo">{SPRING_EDIT.brand}</span>
        <span className="site-header-links">
          <a className="site-header-link" href="./elements.html">
            Elements
          </a>
          <a className="site-header-link" href="./workbench.html">
            Workbench
          </a>
        </span>
      </header>

      <main>
        <section className="site-hero" aria-labelledby="hero-title">
          <p className="site-kicker">
            <abbr title={SPRING_EDIT.seasonName}>{SPRING_EDIT.season}</abbr> · {SPRING_EDIT.collection}
          </p>
          <h1 id="hero-title" className="site-title">
            Shop the <em>film</em>
          </h1>
          <p className="site-lede">
            Five pieces, forty seconds. Watch the seek bar turn into each garment as it plays, then open the swing tag
            to choose your size without leaving the film.
          </p>
          <div className="site-player" id="player">
            <Player />
          </div>
          <p className="site-player-note">
            There is no dialogue; the music is captioned (Scissors, then Captions, or press C).{' '}
            <a href="#described">Read the described version</a>.
          </p>
        </section>

        <section className="site-vertical" id="vertical" aria-labelledby="vertical-title">
          <div className="site-vertical-copy">
            <h2 id="vertical-title" className="site-h2">
              The vertical cut
            </h2>
            <p>
              Cut for phones: 9:16, thirty seconds, a separate film on Mux. It opens on the oxford shirt, where the
              playhead is a pearl button doing up the placket as the film plays, then the dress and the skirt.
            </p>
            <p>
              Nothing in the skin changes. Each chapter on Mux names its garment and its look, so the seek bar re-cuts
              itself around them, the hangers follow the new order, and every swing tag finds its product.
            </p>
            <ol className="site-vertical-chapters">
              <li>Shirt · 0:00</li>
              <li>Dress · 0:10</li>
              <li>Skirt · 0:18</li>
            </ol>
          </div>
          <div className="site-player site-player-vertical" id="vertical-film">
            <Player film={VERTICAL} />
          </div>
        </section>

        <section className="site-looks" id="pieces" aria-labelledby="looks-title">
          <h2 id="looks-title" className="site-h2">
            The pieces
          </h2>
          <ol className="site-look-grid">
            {SPRING_EDIT.looks.map((look, i) => (
              <li key={look.id} className="site-look" data-pastel={PASTELS[i % PASTELS.length]}>
                <img className="site-look-image" src={look.image} alt="" loading="lazy" width="360" height="480" />
                <div className="site-look-body">
                  <span className="site-look-id">
                    <GarmentIcon garment={look.garment} />
                    {GARMENT_LABEL[look.garment]}
                  </span>
                  <h3 className="site-look-name">{look.name}</h3>
                  <span className="site-look-price">
                    {look.color} · {format.format(look.price)}
                  </span>
                  <button type="button" className="site-look-watch" onClick={() => watchLook(look.start ?? 0)}>
                    Watch in the film
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="site-described" id="described" aria-labelledby="described-title">
          <h2 id="described-title" className="site-h2">
            Described version
          </h2>
          <ol className="site-described-list">
            {DESCRIBED_VERSION.map((scene, i) => (
              <li key={scene.time}>
                <span className="site-described-time">{scene.time}</span>
                <p>
                  <strong>{SPRING_EDIT.looks[i]?.name}.</strong> {scene.text}
                </p>
              </li>
            ))}
          </ol>
          <p className="site-described-sound">
            Sound: a hazy, mellow instrumental throughout, with no vocals, fading out over the last three seconds.
          </p>
        </section>

        <section className="site-about" id="about" aria-labelledby="about-title">
          <h2 id="about-title" className="site-h2">
            Atelier, a skin cut from the cloth
          </h2>
          <div className="site-about-grid">
            <article>
              <h3>The seek bar is the wardrobe</h3>
              <p>
                Each chapter is a swatch of the garment on screen, and what has played is finished: the jumper knitted,
                the shirt buttoned, the blazer seam sewn along its chalk line, the skirt's pleats pressed, the dress
                zipped. The playhead is the tool doing the work: a knitting needle, a button, a needle and thread, an
                iron, a fine gold zip pull.
              </p>
            </article>
            <article>
              <h3>Every control has a job in the atelier</h3>
              <p>
                Volume is a salon hairdryer sending out sound waves: more arcs light up the louder the film plays, and
                switching the dryer off mutes it. Time is a tailor's tape measure that pulls out as the film plays, and replay rewinds
                it. Pause pins the moment. Hangers
                move along the rail to the next piece, and scissors open the alterations.
              </p>
            </article>
            <article>
              <h3>Shop without leaving</h3>
              <p>
                An ivory swing tag follows the piece on screen and stays while the controls rest. Open it and a sheet
                slides in, pauses the film, shows fabric and care, takes your size, and resumes playback when it
                closes.
              </p>
            </article>
            <article>
              <h3>Quiet, legible, accessible</h3>
              <p>
                Ivory and linen surfaces with warm charcoal type and pastel accents, at 7:1 contrast or better. Controls
                float on soft panels so they hold over bright and dark footage. Every control is a labelled button,
                slider or radio, at least 44px, with a visible focus ring. Phones get a compact layout, and motion rests
                under reduced motion.
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
          Atelier is a skin for the <a href="https://videojs.org">Video.js v10</a> player, licensed Apache-2.0.{' '}
          {SPRING_EDIT.brand} is a fictional house and the shop is a demo: nothing is sold or charged.
        </p>
        <p>
          Footage and music from <a href="https://mixkit.co">Mixkit</a> under the Mixkit License. Type: Cormorant
          Garamond and Jost (SIL Open Font License).
        </p>
      </footer>
    </>
  );
}
