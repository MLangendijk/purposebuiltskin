// Small helpers that drive one Atelier player on the showcase page, by its section id (#player, #vertical-film).
// `scope` is a Playwright page or frame.

export const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Scrolls the player to the middle of the view. */
export async function centre(scope, id) {
  await scope.locator(id).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await pause(400);
}

/** Starts the film from its start screen and waits until it plays. */
export async function start(scope, id) {
  await centre(scope, id);
  await scope.locator(`${id} .atelier-start-play`).click();
  await scope.locator(`${id} .media-container[data-played]`).waitFor();
  await scope.locator(`${id} video`).evaluate((v) => (v.readyState >= 3 ? null : new Promise((r) => v.addEventListener('canplay', r, { once: true }))));
}

/** Seeks to `time` seconds, then plays or pauses, and waits for the frame. */
export async function seek(scope, id, time, { play = false } = {}) {
  await scope.locator(`${id} video`).evaluate(
    async (video, [time, play]) => {
      video.currentTime = time;
      await new Promise((resolve) => video.addEventListener('seeked', resolve, { once: true }));
      if (play) await video.play();
      else video.pause();
    },
    [time, play]
  );
  await pause(500);
}

/** The centre of an element on the page, for mouse moves. */
export async function centreOf(locator, { x = 0.5, y = 0.5 } = {}) {
  const box = await locator.boundingBox();
  return { x: box.x + box.width * x, y: box.y + box.height * y };
}

/** Moves the mouse over the player, so its controls come up and stay up. */
export async function wake(page, scope, id) {
  const { x, y } = await centreOf(scope.locator(`${id} .media-container`), { y: 0.4 });
  await page.mouse.move(x - 4, y);
  await page.mouse.move(x, y, { steps: 4 });
  await pause(350);
}

/** Glides the mouse along the seek strip from `from` to `to` (0–1), showing the preview as it goes. */
export async function scrub(page, scope, id, from, to, ms = 2500) {
  const strip = scope.locator(`${id} .garment-slider`);
  const a = await centreOf(strip, { x: from });
  const b = await centreOf(strip, { x: to });
  const steps = Math.round(ms / 33);
  await page.mouse.move(a.x, a.y, { steps: 6 });
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(a.x + ((b.x - a.x) * i) / steps, a.y);
    await pause(33);
  }
}
