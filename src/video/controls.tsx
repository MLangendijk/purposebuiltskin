/** @jsxImportSource react */

import { Controls, Tooltip, useTranslator } from '@videojs/react';

import { FullscreenButton, MuteButton, PlayButton } from './atelier/buttons';
import { TopBar } from './atelier/top-bar';
import type { Layout } from './atelier/use-layout';
import { GarmentSeek } from './garments/garment-seek';
import { DryerVolume } from './garments/dryer-volume';
import { TapeMeasure } from './garments/tape-measure';
import { SettingsMenu } from './shared/settings-menu';
import { VideoBufferingIndicator } from './shared/video-feedback';
import { LookSkip } from './shop/look-skip';

/**
 * Atelier's control layouts. The Scaffold layout classes (`video-controls-*`) are kept for positioning and the idle hide.
 *
 * - regular: brand, ticker and bag on top; the garment strip with its department rail, then one row of controls.
 * - compact (phones, either way up): sound, time, settings and bag on top; play and the hangers in the middle, where a
 *   thumb lands; the garment strip and fullscreen along the bottom, so the strip gets nearly the full width. The
 *   picture keeps most of the frame.
 */
export function VideoControls({ layout }: { layout: Layout }) {
  return (
    <Controls.Root>
      <Controls.Backdrop className="video-controls-backdrop atelier-scrim" />
      <VideoBufferingIndicator />
      <Controls.Content className="video-controls-content">
        <Tooltip.Provider>{layout === 'compact' ? <CompactControls /> : <RegularControls />}</Tooltip.Provider>
      </Controls.Content>
    </Controls.Root>
  );
}

function RegularControls() {
  const t = useTranslator();
  return (
    <>
      <Controls.Group className="video-controls-top atelier-top">
        <TopBar />
      </Controls.Group>

      <div className="video-controls-bottom video-controls-video-bottom atelier-bottom">
        <GarmentSeek />
        <Controls.Group className="atelier-row" aria-label={t('atelier.playbackControls', { default: 'Playback controls' })}>
          <div className="atelier-group">
            <PlayButton className="atelier-play" />
            <LookSkip direction="prev" />
            <LookSkip direction="next" />
            <DryerVolume />
            <TapeMeasure />
          </div>
          <div className="atelier-group">
            <SettingsMenu />
            <FullscreenButton />
          </div>
        </Controls.Group>
      </div>
    </>
  );
}

function CompactControls() {
  const t = useTranslator();
  return (
    <>
      <Controls.Group className="video-controls-top atelier-top">
        <TopBar
          start={
            <>
              <MuteButton />
              <TapeMeasure />
            </>
          }
          settings={<SettingsMenu side="bottom" />}
        />
      </Controls.Group>

      <Controls.Group className="atelier-center" aria-label={t('atelier.playback', { default: 'Playback' })}>
        <LookSkip direction="prev" />
        <PlayButton className="atelier-play atelier-play-center" />
        <LookSkip direction="next" />
      </Controls.Group>

      <div className="video-controls-bottom video-controls-video-bottom atelier-bottom">
        <Controls.Group className="atelier-row atelier-row-compact" aria-label={t('atelier.playbackControls', { default: 'Playback controls' })}>
          <GarmentSeek />
          <FullscreenButton />
        </Controls.Group>
      </div>
    </>
  );
}
