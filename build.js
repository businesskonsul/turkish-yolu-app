// Builds www/ from the flat repo: index.html + images.json + local fonts + native bridge.
// Also prepares assets/ for @capacitor/assets (icons and splash).
const fs = require('fs'), path = require('path'), esbuild = require('esbuild');
const ROOT = __dirname, WWW = path.join(ROOT, 'www');
fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(path.join(WWW, 'fonts'), { recursive: true });
const imgs = JSON.parse(fs.readFileSync(path.join(ROOT, 'images.json'), 'utf8'));
for (const [rel, svg] of Object.entries(imgs)) { const p = path.join(WWW, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, svg); }
let css = '';
for (const [fam, ws] of [['onest', [400, 500, 600, 700, 800]], ['unbounded', [600, 700]]]) {
  for (const w of ws) {
    const src = fs.readFileSync(path.join(ROOT, 'node_modules/@fontsource', fam, w + '.css'), 'utf8');
    for (const block of src.split('/*').slice(1)) {
      const m = block.match(/^ (\S+) \*\//); if (!m || !/-(latin|latin-ext|cyrillic)-\d+-normal$/.test(m[1])) continue;
      const file = m[1] + '.woff2';
      fs.copyFileSync(path.join(ROOT, 'node_modules/@fontsource', fam, 'files', file), path.join(WWW, 'fonts', file));
      css += '/*' + block.replace(/src: [^;]+;/, `src: url(./${file}) format('woff2');`);
    }
  }
}
fs.writeFileSync(path.join(WWW, 'fonts', 'fonts.css'), css);
esbuild.buildSync({ entryPoints: [path.join(ROOT, 'native.js')], bundle: true, format: 'iife', minify: true, outfile: path.join(WWW, 'native.js') });
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
html = html.replace(/<link rel="preconnect"[^>]*>\n?/, '').replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis[^>]*>/, '<link rel="stylesheet" href="fonts/fonts.css">');
html = html.replace('<script>', '<script src="native.js"></script>\n<script>');
const head = '<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n<meta name="format-detection" content="telephone=no">\n';
const i = html.indexOf('</style>') + '</style>'.length;
fs.writeFileSync(path.join(WWW, 'index.html'), head + html.slice(0, i) + '\n</head>\n<body>' + html.slice(i) + '\n</body>\n</html>\n');
// icons/splash sources for @capacitor/assets
const AS = path.join(ROOT, 'assets'); fs.mkdirSync(AS, { recursive: true });
for (const f of ['icon-only.png', 'icon-foreground.png', 'icon-background.png', 'splash.png']) if (fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(AS, f));
if (fs.existsSync(path.join(ROOT, 'splash.png'))) fs.copyFileSync(path.join(ROOT, 'splash.png'), path.join(AS, 'splash-dark.png'));
console.log('www built:', Object.keys(imgs).length, 'images');
