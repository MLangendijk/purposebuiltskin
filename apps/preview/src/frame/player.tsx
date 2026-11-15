import { MuxData } from '@videojs/react/extensions/mux-data';
import { MuxVideo } from '@videojs/react/media/mux-video';
import { VideoPlayer } from '@videojs/react/video';
import { useMemo } from 'react';

import { MuxChapters } from '@/video/mux/mux-chapters';
import { type ShopConfig, VideoSkin } from '@/video/skin';

import { SPRING_EDIT, VERTICAL_CUT } from './spring-edit';

/** A film on Mux, and the shop it sells from. The ids come from `scripts/films/*.conf` and the Mux scripts. */
export interface Film {
  title: string;
  playbackId: string;
  /** The Mux chapters track, printed by `scripts/mux-add-tracks.sh`. Unset, `localChapters` is used instead. */
  chaptersTrack?: string;
  /** WebVTT chapters and captions in `public/media`, for a film without chapters on Mux. */
  localChapters?: string;
  localCaptions?: string;
  /** Where the poster is taken from, in seconds. */
  posterTime: number;
  shop: ShopConfig;
}

/** The 40-second, 16:9 lookbook (built by `scripts/build-media.sh`): five looks of eight seconds. */
export const LOOKBOOK: Film = {
  title: 'The Spring Edit',
  playbackId: 'iYNPL02029CpHpmg2Hc21G9hWsj3LEYq9bTqf02ipLkW02k',
  chaptersTrack: 'HV00Uz93HFl9Ljws00NUZFQ02vMfFG6BsKsiWVWdv00sF4vEaMxEdgwJOw',
  localChapters: './media/chapters.vtt',
  localCaptions: './media/captions.vtt',
  posterTime: 34,
  shop: SPRING_EDIT,
};

/**
 * The 30-second, 9:16 cut (built by `scripts/build-vertical.sh`): three of the looks, in a new order and at different
 * lengths, leading with the shirt, whose playhead is a button doing up the placket. Same skin, same products; the chapters on Mux do the rest.
 */
export const VERTICAL: Film = {
  title: 'The Spring Edit, vertical cut',
  playbackId: '97izt5Hi6CLzpkqHhI2Az00j9MHAE301jjvKz00IXpqi4s',
  chaptersTrack: 'wg796Tv2irz3XJ6zm2A5nQW01OhjUW68LydxJqO95fXrECcsPh6LM00Q',
  posterTime: 3,
  shop: VERTICAL_CUT,
};

/**
 * What the player plays, hosted on Mux. Mux serves the stream, the poster, the timeline storyboard (MuxVideo adds it
 * itself), the captions, and the chapters, whose metadata names each chapter's garment and look, so the seek bar's
 * materials and the swing tags come from Mux.
 *
 * Mux Data reports each view under the film's title. The playback ID already ties views to the asset's environment, so
 * there's no `envKey`. Cookies stay off: the demo sets none, so it needs no consent banner.
 */
export function Player({ film = LOOKBOOK }: { film?: Film }) {
  const { playbackId, chaptersTrack, shop } = film;
  const local = !chaptersTrack;
  const muxData = useMemo(
    () => ({ player_name: 'Atelier', video_title: `${shop.brand} · ${film.title}`, video_series: shop.season }),
    [shop, film.title]
  );

  return (
    <VideoPlayer poster={`https://image.mux.com/${playbackId}/thumbnail.webp?time=${film.posterTime}&width=1280`}>
      <VideoSkin shop={shop}>
        <MuxVideo src={`https://stream.mux.com/${playbackId}.m3u8`} playsInline crossOrigin="anonymous">
          {local && film.localChapters && (
            <track kind="chapters" label="Looks" srcLang="en" src={film.localChapters} default />
          )}
          {/* Captions come with the Mux stream; this copy only covers the local fallback. */}
          {local && film.localCaptions && (
            <track kind="captions" label="English (sound)" srcLang="en" src={film.localCaptions} />
          )}
        </MuxVideo>
        <MuxData disableCookies metadata={muxData} />
        {chaptersTrack && <MuxChapters playbackId={playbackId} trackId={chaptersTrack} />}
      </VideoSkin>
    </VideoPlayer>
  );
}
