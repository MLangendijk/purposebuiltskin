import { useCallback, useEffect, useRef, useState } from 'react';

export type Layout = 'compact' | 'regular';

/**
 * Narrower or shorter than this and the player switches to the compact layout: phones either way up, and tablets in
 * portrait, where a 16:9 player is under 480px tall. CSS container queries only see width here, so height is measured
 * in JS.
 */
const COMPACT_WIDTH = 520;
const COMPACT_HEIGHT = 480;

/** Classes that name one control, the same in both layouts. */
const CONTROL_CLASS = /^(media-(?!button$)[a-z-]+-button|atelier-skip-(prev|next)|atelier-bag-button|media-time-slider|dryer-slider)$/;

/** The player's box: which control layout fits it, and whether it's taller than wide (a 9:16 film). */
export interface Shape {
  layout: Layout;
  portrait: boolean;
}

/**
 * Watches the player's own box and reports its shape. Returns a ref callback for the container.
 *
 * The two layouts are different control trees, so a switch (going fullscreen, rotating, zooming) unmounts the focused
 * control. Focus then moves to the same control in the new layout, found by its control class (`media-play-button`)
 * or else its accessible name, so keyboard users and the player's hotkeys keep their place.
 */
export function useLayout(): [Shape, (element: HTMLElement | null) => void] {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [layout, setLayout] = useState<Layout>('regular');
  const [portrait, setPortrait] = useState(false);
  const focused = useRef<string | null>(null);

  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry!.contentRect;
      setLayout(width < COMPACT_WIDTH || height < COMPACT_HEIGHT ? 'compact' : 'regular');
      setPortrait(height > width);
    });
    const remember = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const control = [...target.classList].find((name) => CONTROL_CLASS.test(name));
      const label = target.getAttribute('aria-label');
      focused.current = control ? `.${control}` : label ? `[aria-label="${CSS.escape(label)}"]` : null;
    };
    observer.observe(element);
    element.addEventListener('focusin', remember);
    return () => {
      observer.disconnect();
      element.removeEventListener('focusin', remember);
    };
  }, [element]);

  useEffect(() => {
    const selector = focused.current;
    if (!element || !selector || element.contains(document.activeElement)) return;
    if (document.activeElement && document.activeElement !== document.body) return;
    element.querySelector<HTMLElement>(selector)?.focus();
  }, [element, layout]);

  return [{ layout, portrait }, useCallback((node: HTMLElement | null) => setElement(node), [])];
}
