import { MuxData } from '@videojs/react/extensions/mux-data';
import { MuxVideo } from '@videojs/react/media/mux-video';
import { VideoPlayer } from '@videojs/react/video';

import { MuxChapters } from '@/video/mux/mux-chapters';
import { VideoSkin } from '@/video/skin';

import type { PlaybackProps } from '../shell/params';
import { SPRING_EDIT } from './spring-edit';

/**
 * What the player plays: the 40-second lookbook (built by `scripts/build-media.sh`), hosted on Mux. Mux serves the
 * stream, the poster, the timeline storyboard (MuxVideo adds it itself) and the chapters, which
 * `scripts/mux-add-tracks.sh` put on the asset. The chapter titles name each garment, so the seek bar's materials come
 * from Mux.
 */
const PLAYBACK_ID = 'iYNPL02029CpHpmg2Hc21G9hWsj3LEYq9bTqf02ipLkW02k';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=34&width=1280`;

/** The Mux chapters track, printed by `scripts/mux-add-tracks.sh`. Unset, the local WebVTT chapters are used instead. */
const MUX_CHAPTERS_TRACK: string | undefined = 'HV00Uz93HFl9Ljws00NUZFQ02vMfFG6BsKsiWVWdv00sF4vEaMxEdgwJOw';

/**
 * What Mux Data reports with each view. The playback ID already ties views to the asset's environment, so no `envKey`.
 * Cookies stay off: the demo sets none, so it needs no consent banner.
 */
const MUX_DATA = {
  player_name: 'Atelier',
  video_title: `${SPRING_EDIT.brand} · ${SPRING_EDIT.collection}`,
  video_series: SPRING_EDIT.season,
};

/** `media` carries the workbench's playback options: autoplay, muted, loop, and preload. */
export function Player({ media }: { media?: PlaybackProps }) {
  return (
    <VideoPlayer poster={POSTER}>
      <VideoSkin shop={SPRING_EDIT}>
        <MuxVideo {...media} src={SRC} playsInline crossOrigin="anonymous">
          {!MUX_CHAPTERS_TRACK && (
            <track kind="chapters" label="Looks" srcLang="en" src="./media/chapters.vtt" default />
          )}
          {/* Captions come with the Mux stream; this copy only covers the local fallback. */}
          {!MUX_CHAPTERS_TRACK && (
            <track kind="captions" label="English (sound)" srcLang="en" src="./media/captions.vtt" />
          )}
        </MuxVideo>
        <MuxData disableCookies metadata={MUX_DATA} />
        {MUX_CHAPTERS_TRACK && <MuxChapters playbackId={PLAYBACK_ID} trackId={MUX_CHAPTERS_TRACK} />}
      </VideoSkin>
    </VideoPlayer>
  );
}
