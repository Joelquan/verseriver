/* Checkpointed verse fill: fetches each chapter ONCE from bible-api.com (KJV),
   extracts the needed verse texts, and fills every verse:"" in js/data-*.js.
   Progress is saved to tools/verse-fill-cache.json after every chapter, and the
   script resumes from that cache on restart, so a stall never loses progress.
   Run: node tools/fill-verses-checkpoint.js  (from the verse-games folder) */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');
const CACHE_FILE = path.join(__dirname, 'verse-fill-cache.json');
const ALT_NAMES = { 'Song of Solomon': 'Song of Songs' };
// Single-chapter books: bible-api.com parses "Jude 1" as verse 1, so request a
// verse range instead to get the whole chapter.
const SINGLE_CHAPTER_VERSES = { 'Obadiah': 21, 'Philemon': 25, 'Jude': 25, '2 John': 13, '3 John': 14 };
const REQUEST_DELAY_MS = 6000;          // slowed after bible-api.com rate limits (Sept 20)
const RATE_LIMIT_BACKOFF_MS = 180000;   // 3 min per-chapter retry backoff on 429

const files = fs.readdirSync(path.join(base, 'js'))
  .filter(f => f.startsWith('data-') && f.endsWith('.js'))
  .sort()
  .map(f => 'js/' + f);

const sleep = ms => new Promise(r => setTimeout(r, ms));
const clean = t => t.replace(/\s+/g, ' ').trim(); // proven cleanup
const esc = t => t.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

function parseRef(r){
  const m = r.match(/^(.+?) (\d+):(\d+)$/);
  return m ? { book: m[1], ch: +m[2], v: +m[3] } : null;
}

async function fetchChapter(book, ch){
  const names = [book].concat(ALT_NAMES[book] ? [ALT_NAMES[book]] : []);
  for(const nm of names){
    // single-chapter books need a range request: "Jude 1:1-25"
    const req = SINGLE_CHAPTER_VERSES[nm] ? nm + ' 1:1-' + SINGLE_CHAPTER_VERSES[nm] : nm + ' ' + ch;
    let res;
    try{
      res = await fetch('https://bible-api.com/' + encodeURIComponent(req) + '?translation=kjv');
    }catch(e){
      return { error: 'network: ' + e.message };
    }
    if(res.status === 429) return { rateLimited: true };
    if(!res.ok) continue;
    let j;
    try{ j = await res.json(); }catch(e){ continue; }
    const verses = {};
    for(const v of (j.verses || [])) verses[v.verse] = clean(v.text || '');
    if(Object.keys(verses).length) return { verses };
  }
  return { failed: true };
}

async function main(){
  const chapters = new Map(); // "Book|ch" -> {book, ch, refs:Set}
  let unparseable = 0;
  for(const f of files){
    const s = fs.readFileSync(path.join(base, f), 'utf8');
    for(const m of s.matchAll(/ref:"([^"]+)", ?verse:""/g)){
      const p = parseRef(m[1]);
      if(!p){ console.log('UNPARSEABLE REF', f, m[1]); unparseable++; continue; }
      const key = p.book + '|' + p.ch;
      if(!chapters.has(key)) chapters.set(key, { book: p.book, ch: p.ch, refs: new Set() });
      chapters.get(key).refs.add(m[1]);
    }
  }

  let cache = {};
  try{ cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); }catch(e){}
  const save = () => fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
  console.log('chapters with empty refs:', chapters.size, '| cached refs:', Object.keys(cache).length, '| unparseable:', unparseable);

  const missing = [];
  let chaptersFetched = 0, rateLimitHits = 0;
  for(const [key, c] of chapters){
    const need = [...c.refs].filter(r => !cache[r]);
    if(!need.length) continue;
    let r = await fetchChapter(c.book, c.ch);
    while(r.rateLimited){
      rateLimitHits++;
      save();
      console.log('RATE LIMITED (429) at', c.book, c.ch, '- hit #' + rateLimitHits + '; backing off 3 min and retrying same chapter.');
      await sleep(RATE_LIMIT_BACKOFF_MS);
      r = await fetchChapter(c.book, c.ch);
    }
    if(r.failed || r.error){ missing.push(c.book + ' ' + c.ch + (r.error ? ' (' + r.error + ')' : ' (fetch failed)')); await sleep(REQUEST_DELAY_MS); continue; }
    for(const ref of need){
      const v = parseRef(ref).v;
      const t = r.verses[v];
      if(t) cache[ref] = t;
      else missing.push(ref + ' (verse not in chapter response)');
    }
    chaptersFetched++;
    save();
    if(chaptersFetched % 50 === 0) console.log('progress: chapters fetched this run:', chaptersFetched, '| cached refs:', Object.keys(cache).length);
    await sleep(REQUEST_DELAY_MS);
  }
  console.log('chapters fetched this run:', chaptersFetched, '| total cached refs:', Object.keys(cache).length, '| 429 hits this run:', rateLimitHits);
  console.log('missing:', missing.length);
  missing.forEach(m => console.log('  MISS', m));

  // Write filled verses back into the data files. Already-filled text is never altered.
  let total = 0, left = 0;
  for(const f of files){
    const fp = path.join(base, f);
    let s = fs.readFileSync(fp, 'utf8');
    s = s.replace(/ref:"([^"]+)", ?verse:""/g, (m, r) => {
      const t = cache[r];
      if(!t){ left++; return m; }
      total++;
      return 'ref:"' + r + '",verse:"' + esc(t) + '"';
    });
    fs.writeFileSync(fp, s);
  }
  console.log('verses written:', total, '| still empty:', left);

  // integrity scan: em/en dashes in verse text would break the no-dash rule
  let dash = 0;
  for(const f of files){
    const s = fs.readFileSync(path.join(base, f), 'utf8');
    for(const m of s.matchAll(/verse:"((?:[^"\\]|\\.)*)"/g)){
      if(/[\u2013\u2014]/.test(m[1])){ console.log('DASH in verse:', f, m[1].slice(0, 60)); dash++; }
    }
  }
  if(!dash) console.log('no em/en dashes in verse text');
}

main().catch(e => { console.error('FATAL', e.message); process.exit(1); });
