// Records a page to MP4 through Chrome's screencast: sharp frames at device resolution, encoded by ffmpeg.
// Playwright's own video recorder is low bitrate; this keeps the materials and type crisp.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Runs `action` while recording `page`, then writes `file` (H.264, 30 fps) at `size` ({ width, height }).
 * `filter` is an optional ffmpeg filter applied before scaling (a crop, say).
 */
export async function record(page, file, size, action, { filter } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'atelier-rec-'));
  const cdp = await page.context().newCDPSession(page);
  const frames = [];

  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const name = join(dir, `${String(frames.length).padStart(6, '0')}.jpg`);
    writeFileSync(name, Buffer.from(data, 'base64'));
    frames.push({ name, time: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });

  const viewport = page.viewportSize();
  const scale = await page.evaluate(() => devicePixelRatio);
  await cdp.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 95,
    maxWidth: viewport.width * scale,
    maxHeight: viewport.height * scale,
  });
  await action();
  const end = Date.now() / 1000;
  await cdp.send('Page.stopScreencast');
  await cdp.detach();

  // The screencast only sends a frame when something changes, so each frame lasts until the next one.
  const list = frames.map((frame, i) => {
    const next = frames[i + 1]?.time ?? end;
    return `file '${frame.name}'\nduration ${Math.max(next - frame.time, 1 / 60).toFixed(4)}`;
  });
  list.push(`file '${frames.at(-1).name}'`);
  writeFileSync(join(dir, 'frames.txt'), list.join('\n'));

  const scaleTo = `scale=${size.width}:${size.height}:flags=lanczos`;
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'concat', '-safe', '0', '-i', join(dir, 'frames.txt'),
    '-vf', [filter, scaleTo, 'fps=30', 'format=yuv420p'].filter(Boolean).join(','),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-movflags', '+faststart',
    file,
  ]);
  rmSync(dir, { recursive: true, force: true });
  return frames.length;
}
