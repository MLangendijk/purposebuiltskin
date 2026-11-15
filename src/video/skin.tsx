/** @jsxImportSource react */

'use client';

import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '../styles/video/scaffold.css';
import './skin.css';
import './drop/drop.css';
import './garments/garments.css';
import './drop/compact.css';
import { Container as ContainerPrimitive, Poster as PosterPrimitive } from '@videojs/react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/resolve-class-name';

import { VideoGestures } from './behaviors/gestures';
import { VideoHotkeys } from './behaviors/hotkeys';
import { VideoControls } from './controls';
import { StartScreen } from './drop/start-screen';
import { useLayout } from './drop/use-layout';
import { ErrorDialog } from './shared/error-dialog';
import { Indicators } from './shared/indicators';
import { SeekIndicator } from './shared/seek-indicator';
import { StatusAnnouncer } from './shared/status-announcer';
import { Poster } from './shared/video-feedback';
import { LookTag } from './shop/look-tag';
import { ProductSheet } from './shop/product-sheet';
import { ShopProvider } from './shop/shop-context';
import type { ShopConfig } from './shop/types';

export type { BagItem, Look, ShopConfig } from './shop/types';

export interface VideoSkinProps extends Omit<ContainerPrimitive.Props, 'children'> {
  children?: ReactNode;
  /** The looks, products and brand the drop sells. Without it the skin is a plain (loud) player. */
  shop?: ShopConfig;
  renderPoster?: PosterPrimitive.ImageProps['render'];
}

/**
 * Drop: a skin for shoppable fashion video, built from the clothes themselves. The seek bar is cut from each garment's
 * material and finished as it plays, by the tool that does the job (button, needle, zip pull, safety pin, aglet, iron).
 * Volume is a size run, time a tape measure, mute a zipper, and the shop hangs off swing tags. It builds on the
 * Scaffold skin's behavior.
 */
export function VideoSkin({ children, className, shop, renderPoster, ...props }: VideoSkinProps = {}) {
  const [layout, measure] = useLayout();

  return (
    <ShopProvider shop={shop}>
      <ContainerPrimitive
        ref={measure}
        className={cn('media-skin', 'media-container', 'media-video', className)}
        data-theme="scaffold"
        data-preset="video"
        data-skin="drop"
        data-layout={layout}
        {...props}
      >
        {children}
        <Poster renderImage={renderPoster} />
        <StartScreen />
        <ErrorDialog />
        <VideoControls layout={layout} />
        <LookTag />
        <ProductSheet />

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
