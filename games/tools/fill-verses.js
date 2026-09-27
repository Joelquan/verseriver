/* Fill every verse:"" in the data files with exact KJV text from bible-api.com.
   Run: node tools/fill-verses.js  (from the verse-games folder) */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');
const files = fs.readdirSync(path.join(base, 'js'))
  .filter(f => f.startsWith('data-') && f.endsWith('.js'))
  .sort()
  .map(f => 'js/' + f);

async function main(){
  let refs = new Set();
  for(const f of files){
    const s = fs.readFileSync(path.join(base, f), 'utf8');
    for(const m of s.matchAll(/ref:"([^"]+)", ?verse:""/g)) refs.add(m[1]);
  }
  console.log('unique refs to fetch:', refs.size);
  const cache = {};
  const failed = [];
  for(const r of [...refs]){
    let done = false;
    for(let attempt = 0; attempt < 5 && !done; attempt++){
      try{
        const url = 'https://bible-api.com/' + encodeURIComponent(r) + '?translation=kjv';
        const res = await fetch(url);
        if(res.status === 429){
          await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
          continue;
        }
        if(!res.ok){ failed.push(r + ' (http ' + res.status + ')'); done = true; continue; }
        const j = await res.json();
        const t = (j.text || '').replace(/\s+/g, ' ').trim();
        if(!t){ failed.push(r + ' (empty)'); done = true; continue; }
        cache[r] = t; done = true;
      }catch(e){
        await new Promise(r => setTimeout(r, 2000));
        if(attempt === 4) failed.push(r + ' (' + e.message + ')');
      }
    }
    if(!done && !failed.some(f => f.startsWith(r + ' '))) failed.push(r + ' (gave up)');
    await new Promise(r => setTimeout(r, 900));
  }
  console.log('fetched:', Object.keys(cache).length, 'failed:', failed.length);
  failed.forEach(f => console.log('  FAIL', f));

  let total = 0;
  for(const f of files){
    const fp = path.join(base, f);
    let s = fs.readFileSync(fp, 'utf8');
    s = s.replace(/ref:"([^"]+)", ?verse:""/g, (m, r) => {
      const t = cache[r];
      if(!t) return m;
      total++;
      return 'ref:"' + r + '",verse:"' + t.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    });
    fs.writeFileSync(fp, s);
  }
  console.log('verses written:', total);

  // integrity scan: em/en dashes in verse text would break the no-dash rule
  for(const f of files){
    const s = fs.readFileSync(path.join(base, f), 'utf8');
    for(const m of s.matchAll(/verse:"([^"]*)"/g)){
      if(/[\u2013\u2014]/.test(m[1])) console.log('DASH in verse:', f, m[1].slice(0, 60));
    }
  }
}
main();
