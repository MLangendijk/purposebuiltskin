/** @jsxImportSource react */

import { Controls, Time, Tooltip } from '@videojs/react';

import { FullscreenButton, PlayButton } from './drop/buttons';
import { TopBar } from './drop/top-bar';
import { BeltVolume } from './garments/belt-volume';
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
                <BeltVolume />
                <Time.Group className="media-time-group drop-time care-label">
                  <Time.Value className="media-time-toggle" type="current" toggle />
                  <Time.Value className="media-time-current-value" type="current" />
                  <Time.Separator className="media-time-separator" />
                  <Time.Value className="media-time-duration-value" type="duration" />
                </Time.Group>
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
