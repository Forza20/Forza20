// Renders pipeline-explainer.html to MP4: frames via window.explainer at 30 fps, audio via SOUND.renderOffline.
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'pipeline-explainer.mp4'), FPS = 30;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.join(__dirname, '..', 'pipeline-explainer.html')); await p.evaluate(() => window.ready);
  const D = await p.evaluate(() => window.DURATION);
  await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 1280; c.height = 720; window.__rc = c; window.__rx = c.getContext('2d'); });
  // audio
  const audio = await p.evaluate(async (D) => { const r = await SOUND.renderOffline(window.scoreSound, D, 48000, { voiceover: false });
    const u8 = new Uint8Array(r.inter.buffer); let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return { b64: btoa(s), peak: r.peak }; }, D);
  const wav = path.join(path.dirname(OUT), 'audio.f32'); fs.writeFileSync(wav, Buffer.from(audio.b64, 'base64')); console.log('audio peak', audio.peak.toFixed(3));
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-f', 'f32le', '-ar', '48000', '-ac', '2', '-i', wav,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(D * FPS); let worst = 0;
  for (let i = 0; i < N; i++) {
    const r = await p.evaluate((t) => { const a = performance.now(); const x = window.__rx; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, 1280, 720);
      explainer(x, 1280, 720, t); const ms = performance.now() - a; return { ms, d: window.__rc.toDataURL('image/png') }; }, i / FPS);
    worst = Math.max(worst, r.ms);
    if (!ff.stdin.write(Buffer.from(r.d.split(',')[1], 'base64'))) await new Promise((res) => ff.stdin.once('drain', res));
  }
  ff.stdin.end(); await new Promise((res) => ff.on('close', res)); fs.unlinkSync(wav);
  console.log('frames', N, 'worst draw ms', worst.toFixed(1), errs.length ? errs : 'no errors'); await b.close();
})();
