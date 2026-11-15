import { Video, VideoPlayer } from '@videojs/react/video';

import { VideoSkin } from '@/video/skin';

import type { PlaybackProps } from '../shell/params';
import { DROP_004 } from './drop-004';

// What the preview plays: a 42-second garment lookbook built by `scripts/build-media.sh` into `apps/preview/public/media`.
const SRC = './media/lookbook.mp4';
const POSTER = './media/poster.jpg';

/** `media` carries the workbench's playback options: autoplay, muted, loop, and preload. */
export function Player({ media }: { media?: PlaybackProps }) {
  return (
    <VideoPlayer poster={POSTER}>
      <VideoSkin shop={DROP_004}>
        <Video {...media} src={SRC} playsInline crossOrigin="">
          <track kind="chapters" label="Looks" srcLang="en" src="./media/chapters.vtt" default />
          <track kind="metadata" label="thumbnails" src="./media/storyboard.vtt" default />
        </Video>
      </VideoSkin>
    </VideoPlayer>
  );
}
