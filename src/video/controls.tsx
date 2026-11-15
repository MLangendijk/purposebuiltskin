/** @jsxImportSource react */

import { Controls, Tooltip } from '@videojs/react';

import { FullscreenButton, MuteButton, PlayButton } from './drop/buttons';
import { TopBar } from './drop/top-bar';
import type { Layout } from './drop/use-layout';
import { GarmentSeek } from './garments/garment-seek';
import { DryerVolume } from './garments/dryer-volume';
import { TapeMeasure } from './garments/tape-measure';
import { SettingsMenu } from './shared/settings-menu';
import { VideoBufferingIndicator } from './shared/video-feedback';
import { LookSkip } from './shop/look-skip';

/**
 * Drop's control layouts. The Scaffold layout classes (`video-controls-*`) are kept for positioning and the idle hide.
 *
 * - regular: brand, ticker and bag on top; the garment strip with its department rail, then one row of controls.
 * - compact (phones, either way up): settings and bag on top; play and the hangers in the middle, where a thumb
 *   lands; a single bottom row of mute, the garment strip, time and fullscreen. The picture keeps most of the frame.
 */
export function VideoControls({ layout }: { layout: Layout }) {
  return (
    <Controls.Root>
      <Controls.Backdrop className="video-controls-backdrop drop-scrim" />
      <VideoBufferingIndicator />
      <Controls.Content className="video-controls-content">
        <Tooltip.Provider>{layout === 'compact' ? <CompactControls /> : <RegularControls />}</Tooltip.Provider>
      </Controls.Content>
    </Controls.Root>
  );
}

function RegularControls() {
  return (
    <>
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
            <DryerVolume />
            <TapeMeasure />
          </div>
          <div className="drop-group">
            <SettingsMenu />
            <FullscreenButton />
          </div>
        </Controls.Group>
      </div>
    </>
  );
}

function CompactControls() {
  return (
    <>
      <Controls.Group className="video-controls-top drop-top">
        <TopBar settings={<SettingsMenu side="bottom" />} />
      </Controls.Group>

      <Controls.Group className="drop-center" aria-label="Playback">
        <LookSkip direction="prev" />
        <PlayButton className="drop-play drop-play-center" />
        <LookSkip direction="next" />
      </Controls.Group>

      <div className="video-controls-bottom video-controls-video-bottom drop-bottom">
        <Controls.Group className="drop-row drop-row-compact" aria-label="Playback controls">
          <MuteButton />
          <GarmentSeek />
          <TapeMeasure />
          <FullscreenButton />
        </Controls.Group>
      </div>
    </>
  );
}
