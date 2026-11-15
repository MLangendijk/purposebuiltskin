/** @jsxImportSource react */

'use client';

import '@fontsource-variable/jost/wght.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '../styles/video/scaffold.css';
import './skin.css';
import './atelier/atelier.css';
import './garments/garments.css';
import './atelier/compact.css';
import { Container as ContainerPrimitive, Poster as PosterPrimitive } from '@videojs/react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/resolve-class-name';

import { VideoGestures } from './behaviors/gestures';
import { VideoHotkeys } from './behaviors/hotkeys';
import { VideoControls } from './controls';
import { StartScreen } from './atelier/start-screen';
import { useHasPlayed } from './atelier/use-has-played';
import { useLayout } from './atelier/use-layout';
import { ErrorDialog } from './shared/error-dialog';
import { Indicators } from './shared/indicators';
import { SeekIndicator } from './shared/seek-indicator';
import { StatusAnnouncer } from './shared/status-announcer';
import { Poster } from './shared/video-feedback';
import { LookChapters } from './shop/look-chapters';
import { LookTag } from './shop/look-tag';
import { ProductSheet } from './shop/product-sheet';
import { ShopProvider } from './shop/shop-context';
import type { ShopConfig } from './shop/types';

export type { BagItem, Look, ShopConfig } from './shop/types';

export interface VideoSkinProps extends Omit<ContainerPrimitive.Props, 'children'> {
  children?: ReactNode;
  /** The looks, products and brand the collection sells. Without it the skin is a plain player. */
  shop?: ShopConfig;
  renderPoster?: PosterPrimitive.ImageProps['render'];
}

/**
 * Atelier: a skin for shoppable fashion video, built from the clothes themselves. The seek bar is cut from each garment's
 * material and finished as it plays, by the tool that does the job (button, needle, zip pull, safety pin, aglet, iron).
 * Volume is a hairdryer and its airflow, time a tape measure, and the shop hangs off swing tags. It builds on the
 * Scaffold skin's behavior.
 */
export function VideoSkin({ children, className, shop, renderPoster, ...props }: VideoSkinProps = {}) {
  const [{ layout, portrait }, measure] = useLayout();
  const played = useHasPlayed();

  return (
    <ShopProvider shop={shop}>
      <ContainerPrimitive
        ref={measure}
        className={cn('media-skin', 'media-container', 'media-video', className)}
        data-theme="scaffold"
        data-preset="video"
        data-skin="atelier"
        data-layout={layout}
        data-shape={portrait ? 'portrait' : 'landscape'}
        data-played={played ? '' : undefined}
        {...props}
      >
        {children}
        <Poster renderImage={renderPoster} />
        <StartScreen />
        <ErrorDialog />
        <VideoControls layout={layout} />
        <LookTag />
        <ProductSheet />
        <LookChapters />

        <VideoHotkeys />
        <VideoGestures />
        <StatusAnnouncer />
        <Indicators>
          <SeekIndicator />
        </Indicators>
      </ContainerPrimitive>
    </ShopProvider>
  );
}
