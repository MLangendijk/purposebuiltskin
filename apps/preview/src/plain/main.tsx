// Dev-only page: the skin as a plain player. No shop, and a film with no chapters, so the strip is cut whole from one
// garment picked at random.
import { Video, VideoPlayer } from '@videojs/react/video';
import { createRoot } from 'react-dom/client';

import { VideoSkin } from '@/video/skin';

createRoot(document.getElementById('root')!).render(
  <VideoPlayer>
    <VideoSkin>
      <Video src="./media/lookbook.mp4" poster="./media/poster.jpg" playsInline />
    </VideoSkin>
  </VideoPlayer>
);
