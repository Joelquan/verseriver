/* Build dist/verse-games.html: single-file bundle for review and drop-in.
   Run: node tools/build-dist.js  (from the verse-games folder) */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');

let html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(base, 'css/verse-games.css'), 'utf8');
html = html.replace(
  '<link rel="stylesheet" href="css/verse-games.css">',
  '<style>\n' + css + '\n</style>'
);
const dataFiles = fs.readdirSync(path.join(base, 'js'))
  .filter(f => f.startsWith('data-') && f.endsWith('.js'))
  .sort()
  .map(f => 'js/' + f);
// VG_SLIM=1: widget preview build, ships only Genesis chapters 1-10 to stay
// under the 1MB widget cap (the full book ships in the site bundle).
let files = dataFiles;
if(process.env.VG_SLIM === '1'){
  // slim build: keep only Genesis 1-10 chapter data (plus meta) and drop the
  // 500-quote Who Said It campaign and the King Solomon series; the full
  // campaigns ship in the site bundle. This keeps the widget preview under
  // the 1MB cap.
  files = dataFiles.filter(f =>
    /data-bible-genesis-0[12]\.js$/.test(f) ||
    (!/data-bible-.+-\d+\.js$/.test(f) && f !== 'js/data-who-said-it.js' && f !== 'js/data-solomon.js'));
}
const order = ['js/engine.js', 'js/bible.js', 'js/sound.js', ...files, 'js/hub.js'];
for(const f of order){
  const js = fs.readFileSync(path.join(base, f), 'utf8');
  if(js.includes('</script>')) throw new Error('unsafe </script> inside ' + f);
  html = html.replace('<script src="' + f + '"></script>', '<script>\n' + js + '\n</script>');
}
if(process.env.VG_SLIM === '1'){
  // slim build: drop the excluded data tags entirely (chapters beyond
  // Genesis 1-10 and the Who Said It campaign ship in the site bundle)
  html = html.replace(/<script src="js\/data-[^"]+"><\/script>\n?/g, '');
}
if(html.includes('src="js/')) throw new Error('unreplaced script src remains');
fs.mkdirSync(path.join(base, 'dist'), {recursive:true});
const outName = process.argv[2] || 'verse-games.html';
const out = path.join(base, 'dist', outName);
fs.writeFileSync(out, html);
console.log('dist built:', out, html.length, 'bytes');
