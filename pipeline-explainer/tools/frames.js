const { chromium } = require('playwright');
(async () => {
  const ts = process.argv.slice(3).map(Number), out = process.argv[2];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/test.html'); await p.evaluate(() => window.ready);
  console.log('fonts', await p.evaluate(() => document.fonts.check('700 28px "Space Grotesk"') && document.fonts.check('600 28px "Inter"')));
  for (const t of ts) {
    const ms = await p.evaluate((t) => { const a = performance.now(); seek(t); return performance.now() - a; }, t);
    await p.locator('#c').screenshot({ path: `${out}/f_${t.toFixed(2)}.png` }); console.log(t, ms.toFixed(1) + 'ms');
  }
  console.log(errs.join('\n')); await b.close();
})();
