import { MuxVideo } from '@videojs/react/media/mux-video';
import { VideoPlayer } from '@videojs/react/video';

import { MuxChapters } from '@/video/mux/mux-chapters';
import { VideoSkin } from '@/video/skin';

import type { PlaybackProps } from '../shell/params';
import { SPRING_EDIT } from './spring-edit';

/**
 * What the player plays: the 40-second lookbook (built by `scripts/build-media.sh`), hosted on Mux. Mux serves the
 * stream, the poster, the timeline storyboard (MuxVideo adds it itself) and, once `scripts/mux-add-tracks.sh` has run,
 * the chapters and captions.
 */
const PLAYBACK_ID = 'iYNPL02029CpHpmg2Hc21G9hWsj3LEYq9bTqf02ipLkW02k';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=34&width=1280`;

/** The Mux chapters track, printed by `scripts/mux-add-tracks.sh`. Until it is set, the local WebVTT file is used. */
const MUX_CHAPTERS_TRACK: string | undefined = undefined;

/** `media` carries the workbench's playback options: autoplay, muted, loop, and preload. */
export function Player({ media }: { media?: PlaybackProps }) {
  return (
    <VideoPlayer poster={POSTER}>
      <VideoSkin shop={SPRING_EDIT}>
        <MuxVideo {...media} src={SRC} playsInline crossOrigin="anonymous">
          {!MUX_CHAPTERS_TRACK && (
            <track kind="chapters" label="Looks" srcLang="en" src="./media/chapters.vtt" default />
          )}
          {!MUX_CHAPTERS_TRACK && (
            <track kind="captions" label="English (sound)" srcLang="en" src="./media/captions.vtt" />
          )}
        </MuxVideo>
        {MUX_CHAPTERS_TRACK && <MuxChapters playbackId={PLAYBACK_ID} trackId={MUX_CHAPTERS_TRACK} />}
      </VideoSkin>
    </VideoPlayer>
  );
}
