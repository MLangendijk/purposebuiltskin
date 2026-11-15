/** @jsxImportSource react */

import { Controls, Tooltip } from '@videojs/react';

import { FullscreenButton, PlayButton } from './drop/buttons';
import { TopBar } from './drop/top-bar';
import { SizeVolume } from './garments/size-volume';
import { TapeMeasure } from './garments/tape-measure';
import { GarmentSeek } from './garments/garment-seek';
import { SettingsMenu } from './shared/settings-menu';
import { VideoBufferingIndicator } from './shared/video-feedback';
import { LookSkip } from './shop/look-skip';

/**
 * Drop's control layout: brand, ticker and bag on top; the garment seek strip and one row of controls below. The
 * Scaffold layout classes (`video-controls-*`) are kept for positioning and the idle hide.
 */
export function VideoControls() {
  return (
    <Controls.Root>
      <Controls.Backdrop className="video-controls-backdrop drop-scrim" />
      <VideoBufferingIndicator />
      <Controls.Content className="video-controls-content">
        <Tooltip.Provider>
          <Controls.Group className="video-controls-top drop-top">
            <TopBar />
          </Controls.Group>

          <div className="video-controls-bottom video-controls-video-bottom drop-bottom">
            <GarmentSeek />
            <Controls.Group className="drop-row" aria-label="Playback controls">
              <div className="drop-group">
                <PlayButton className="drop-play" />
                <LookSkip direction="prev" />
                <LookSkip direction="next" />
                <SizeVolume />
                <TapeMeasure />
              </div>
              <div className="drop-group">
                <SettingsMenu />
                <FullscreenButton />
              </div>
            </Controls.Group>
          </div>
        </Tooltip.Provider>
      </Controls.Content>
    </Controls.Root>
  );
}
