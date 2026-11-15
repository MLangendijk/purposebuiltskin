#!/usr/bin/env node
// Captures the challenge entry's media from the live showcase: 4:3 stills (3200×2400 PNG) and demo videos
// (1600×1200 MP4). It drives its own headless Chrome, so the screen and mouse are left alone.
//
// Usage: node scripts/capture-media.mjs [out dir] [site url]
//   ONLY=desktopStills,phoneVideo … runs some of the jobs. The plain-player jobs read the dev-only page, so they need
//   `pnpm dev` running (PLAIN_URL overrides where).
// Needs: Google Chrome, ffmpeg, and playwright-core (a dev dependency).

import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

import { centre, centreOf, pause, scrub, seek, start, wake } from './capture/player.mjs';
import { record } from './capture/record.mjs';

const OUT = process.argv[2] ?? join(homedir(), 'Desktop', 'Atelier submission');
const SITE = process.argv[3] ?? 'https://mlangendijk.github.io/purposebuiltskin/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SIZE = { width: 1600, height: 1200 };
const FILM = '#player';
const VERTICAL = '#vertical-film';
const PHONE = { width: 393, height: 852 };
const PLAIN = process.env.PLAIN_URL ?? 'http://localhost:5199/plain.html';
const PLAIN_PLAYER = '#root';

const out = (name) => join(OUT, name);

async function openSite(browser, { url = SITE, touch = false } = {}) {
  const context = await browser.newContext({ viewport: SIZE, deviceScaleFactor: 2, hasTouch: touch });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator(`${FILM} .atelier-start-play`).waitFor();
  await page.evaluate(() => document.fonts.ready);
  return page;
}

/** A 4:3 frame around a player, in CSS pixels, with a margin of page around it. */
async function frameAround(page, id) {
  const box = await page.locator(`${id} .media-container`).boundingBox();
  const width = box.width + 160;
  const height = (width * 3) / 4;
  return { x: box.x + box.width / 2 - width / 2, y: box.y + box.height / 2 - height / 2, width, height };
}

/** Hides the page around a player, so a framed shot shows the player alone on the page's ivory. Returns an undo. */
async function isolate(page, id) {
  const tag = await page.addStyleTag({ content: `body * { visibility: hidden; } ${id}, ${id} * { visibility: visible; }` });
  return () => tag.evaluate((el) => el.remove());
}

/** An ffmpeg crop to a frame, as a share of the view, so it holds whatever size Chrome sends the frames at. */
function cropTo(frame) {
  const share = (value, of) => (value / of).toFixed(5);
  const w = share(frame.width, SIZE.width);
  const h = share(frame.height, SIZE.height);
  return `crop=iw*${w}:ih*${h}:iw*${share(frame.x, SIZE.width)}:ih*${share(frame.y, SIZE.height)}`;
}

/** Saves a still: the whole view, or (`around` a player id) a 4:3 frame around that player. */
async function shot(page, name, { around } = {}) {
  const clip = around ? await frameAround(page, around) : undefined;
  const undo = around ? await isolate(page, around) : null;
  await page.screenshot({ path: out(`${name}.png`), clip });
  await undo?.();
  console.log(`  ${name}.png`);
}

/** Brings the controls up, then clicks one of them, as a viewer would. */
async function press(page, id, selector) {
  await wake(page, page, id);
  await page.locator(`${id} ${selector}`).click();
}

/** Drops keyboard focus, so no tooltip hangs over a still. */
const blur = (page) => page.evaluate(() => document.activeElement?.blur());

/** Adds the piece on screen to the bag through its swing tag, in the given size. */
async function shop(scope, id, size, { tap = false } = {}) {
  const tag = scope.locator(`${id} .atelier-tag`);
  await (tap ? tag.tap() : tag.click());
  const sheet = scope.locator(`${id} .atelier-sheet`);
  const choice = sheet.locator('.atelier-size', { hasText: new RegExp(`^${size}$`) });
  await choice.waitFor();
  await pause(700);
  await (tap ? choice.tap() : choice.click());
  await pause(500);
  return sheet;
}

// ---------------------------------------------------------------- Desktop stills

async function desktopStills(browser) {
  const page = await openSite(browser);
  await start(page, FILM);
  await blur(page);

  await seek(page, FILM, 3, { play: true });
  await wake(page, page, FILM);
  await pause(900);
  await wake(page, page, FILM);
  await shot(page, '00-showcase');
  await shot(page, '01-shop-the-film', { around: FILM });

  await seek(page, FILM, 27.6);
  await wake(page, page, FILM);
  await shot(page, '02-finished-as-it-plays', { around: FILM });

  await scrub(page, page, FILM, 0.6, 0.9, 600);
  await pause(600);
  await shot(page, '03-scrub-preview', { around: FILM });

  await seek(page, FILM, 11);
  await wake(page, page, FILM);
  const sheet = await shop(page, FILM, 'S');
  await shot(page, '04-product-sheet', { around: FILM });
  await sheet.locator('.atelier-cta').click();
  await pause(600);
  await page.keyboard.press('Escape');
  await pause(800);

  await seek(page, FILM, 35);
  await wake(page, page, FILM);
  await (await shop(page, FILM, 'M')).locator('.atelier-cta').click();
  await pause(500);
  await page.keyboard.press('Escape');
  await pause(800);
  await seek(page, FILM, 35);
  await wake(page, page, FILM);
  await page.locator(`${FILM} .atelier-bag-button`).click();
  await pause(700);
  await shot(page, '05-bag', { around: FILM });
  await page.keyboard.press('Escape');
  await blur(page);

  await seek(page, FILM, 5);
  await page.locator(`${FILM} .media-captions-button`).click();
  await blur(page);
  await wake(page, page, FILM);
  await pause(600);
  await shot(page, '06-captions', { around: FILM });
  await page.locator(`${FILM} .media-captions-button`).click();

  await seek(page, FILM, 14);
  await wake(page, page, FILM);
  await page.locator(`${FILM} .media-settings-button`).click();
  await pause(700);
  await shot(page, '07-settings', { around: FILM });
  await page.keyboard.press('Escape');

  // Keyboard focus: reach the next-look hanger with Tab, so the focus ring and tooltip show as they do for real.
  await seek(page, FILM, 19);
  await page.mouse.move(5, 5);
  await page.locator(`${FILM} .atelier-play`).focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await pause(700);
  await shot(page, '08-keyboard-focus', { around: FILM });

  await page.goto(new URL('elements.html', SITE).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await pause(800);
  await shot(page, '10-elements-page');
  await page.context().close();
}

// ---------------------------------------------------------------- Phones, side by side on one 4:3 stage

/** A stage with two phone screens showing the showcase: the 16:9 film on the left, the vertical cut on the right. */
async function openPhones(browser) {
  const context = await browser.newContext({ viewport: SIZE, deviceScaleFactor: 2, hasTouch: true });
  const page = await context.newPage();
  const phone = (id) =>
    `<div class="phone"><iframe id="${id}" name="${id}" src="${SITE}" width="${PHONE.width}" height="${PHONE.height}"></iframe></div>`;
  await page.setContent(`
    <style>
      html, body { margin: 0; height: 100%; background: #f3ede4; }
      body { display: flex; align-items: center; justify-content: center; gap: 120px; }
      .phone { width: ${PHONE.width * 1.22}px; height: ${PHONE.height * 1.22}px; border-radius: 64px; overflow: hidden;
        border: 12px solid #2a2826; box-shadow: 0 30px 80px rgb(42 40 38 / 0.25); background: #fbf8f3; }
      iframe { border: 0; transform: scale(1.22); transform-origin: 0 0; }
    </style>
    ${phone('left')}${phone('right')}`);
  const left = page.frame({ name: 'left' });
  const right = page.frame({ name: 'right' });
  await left.locator(`${FILM} .atelier-start-play`).waitFor();
  await right.locator(`${VERTICAL} .atelier-start-play`).waitFor();
  await Promise.all([left, right].map((frame) => frame.evaluate(() => document.fonts.ready)));
  return { page, left, right };
}

/** The left phone shows the top of the page (title, then the film); the right one the vertical cut, edge to edge. */
async function framePhones(left, right) {
  await left.evaluate(() => scrollTo(0, 0));
  await right.locator(VERTICAL).evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY - 12));
  await pause(400);
}

async function phoneStill(browser) {
  const { page, left, right } = await openPhones(browser);
  await framePhones(left, right);
  await left.locator(`${FILM} .atelier-start-play`).tap();
  await right.locator(`${VERTICAL} .atelier-start-play`).tap();
  await pause(1500);
  await seek(left, FILM, 13, { play: true });
  await seek(right, VERTICAL, 13);
  await left.locator(`${FILM} .media-container`).tap({ position: { x: 60, y: 120 } });
  await right.locator(`${VERTICAL} .media-container`).tap({ position: { x: 60, y: 320 } });
  await pause(500);
  await shot(page, '09-phones');
  await page.context().close();
}

// ---------------------------------------------------------------- Videos

async function desktopVideo(browser) {
  const page = await openSite(browser);
  await centre(page, FILM);
  await pause(1500);
  await isolate(page, FILM);
  const filter = cropTo(await frameAround(page, FILM));
  const frames = await record(page, out('demo-desktop.mp4'), SIZE, async () => {
    await pause(1500);
    await start(page, FILM);
    await blur(page);
    await wake(page, page, FILM);
    await pause(3500);
    await scrub(page, page, FILM, 0.15, 0.92, 3500);
    await pause(400);
    await press(page, FILM, '.atelier-skip-next');
    await pause(2200);
    await press(page, FILM, '.atelier-skip-next');
    await pause(2500);
    const sheet = await shop(page, FILM, 'S');
    await pause(900);
    await sheet.locator('.atelier-cta').click();
    await pause(1600);
    await sheet.locator('.atelier-sheet-close').click();
    await pause(1200);
    await press(page, FILM, '.atelier-bag-button');
    await pause(2500);
    await page.keyboard.press('Escape');
    await pause(1000);
    await page.mouse.move(20, 20, { steps: 8 });
    await pause(5000);
  }, { filter });
  console.log(`  demo-desktop.mp4 (${frames} frames)`);
  await page.context().close();
}

async function phoneVideo(browser) {
  const { page, left, right } = await openPhones(browser);
  await framePhones(left, right);
  await pause(1500);
  const frames = await record(page, out('demo-phones.mp4'), SIZE, async () => {
    await pause(1200);
    await left.locator(`${FILM} .atelier-start-play`).tap();
    await pause(600);
    await right.locator(`${VERTICAL} .atelier-start-play`).tap();
    await pause(4500);
    await right.locator(`${VERTICAL} .media-container`).tap({ position: { x: 60, y: 320 } });
    await pause(1800);
    await right.locator(`${VERTICAL} .atelier-skip-next`).tap();
    await pause(3500);
    const sheet = await shop(right, VERTICAL, 'M', { tap: true });
    await pause(900);
    await sheet.locator('.atelier-cta').tap();
    await pause(1600);
    await sheet.locator('.atelier-sheet-close').tap();
    await pause(5000);
  });
  console.log(`  demo-phones.mp4 (${frames} frames)`);
  await page.context().close();
}

// ---------------------------------------------------------------- Plain player: no shop, no chapters

async function openPlain(browser) {
  const context = await browser.newContext({ viewport: SIZE, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(PLAIN, { waitUntil: 'networkidle' });
  await page.locator(`${PLAIN_PLAYER} .atelier-start-play`).waitFor();
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function plainStill(browser) {
  const page = await openPlain(browser);
  await start(page, PLAIN_PLAYER);
  await blur(page);
  await seek(page, PLAIN_PLAYER, 16);
  await wake(page, page, PLAIN_PLAYER);
  await shot(page, '11-plain-player', { around: PLAIN_PLAYER });
  await page.context().close();
}

async function plainVideo(browser) {
  const page = await openPlain(browser);
  await pause(1000);
  const filter = cropTo(await frameAround(page, PLAIN_PLAYER));
  const frames = await record(page, out('demo-plain-player.mp4'), SIZE, async () => {
    await pause(1800);
    await start(page, PLAIN_PLAYER);
    await blur(page);
    await wake(page, page, PLAIN_PLAYER);
    await pause(4000);
    await scrub(page, page, PLAIN_PLAYER, 0.2, 0.85, 3000);
    await pause(500);
    await wake(page, page, PLAIN_PLAYER);
    await pause(2500);
    await page.mouse.move(20, 20, { steps: 8 });
    await pause(4000);
  }, { filter });
  console.log(`  demo-plain-player.mp4 (${frames} frames)`);
  await page.context().close();
}

// ---------------------------------------------------------------- Run

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'],
});
try {
  const only = process.env.ONLY?.split(',');
  const jobs = { desktopStills, phoneStill, plainStill, desktopVideo, phoneVideo, plainVideo };
  for (const [name, job] of Object.entries(jobs)) {
    if (only && !only.includes(name)) continue;
    console.log(name);
    await job(browser);
  }
} finally {
  await browser.close();
}
console.log(`Saved to ${OUT}`);
