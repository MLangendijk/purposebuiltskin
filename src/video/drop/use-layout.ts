import { useCallback, useEffect, useState } from 'react';

export type Layout = 'compact' | 'regular';

/**
 * Narrower or shorter than this and the player switches to the compact layout: phones either way up, and tablets in
 * portrait, where a 16:9 player is under 480px tall. CSS container queries only see width here, so height is measured
 * in JS.
 */
const COMPACT_WIDTH = 520;
const COMPACT_HEIGHT = 480;

/** Watches the player's own box and reports which control layout fits it. Returns a ref callback for the container. */
export function useLayout(): [Layout, (element: HTMLElement | null) => void] {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [layout, setLayout] = useState<Layout>('regular');

  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry!.contentRect;
      setLayout(width < COMPACT_WIDTH || height < COMPACT_HEIGHT ? 'compact' : 'regular');
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [layout, useCallback((node: HTMLElement | null) => setElement(node), [])];
}
