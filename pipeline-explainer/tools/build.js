// Inlines lib + src scripts into the self-contained HTML deliverables.
const fs = require('fs'), path = require('path'), R = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const libs = ['lib/harness.js', 'lib/sound.js', 'src/style.js'].map(R).join('\n').replace(/<\/script/gi, '<\\/script');
for (const [src, out] of [['src/storyboard.src.html', 'storyboard.html'], ['src/player.src.html', 'pipeline-explainer.html']]) {
  if (!fs.existsSync(path.join(__dirname, '..', src))) continue;
  fs.writeFileSync(path.join(__dirname, '..', out), R(src).replace('/*@@LIBS@@*/', () => libs)); console.log('wrote', out);
}
