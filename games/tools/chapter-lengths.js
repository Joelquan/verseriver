/* Chapter verse counts from bible-api.com, cached.
   Usage: node tools/chapter-lengths.js "Hosea" 14
   Prints JSON: {"1":11,"2":23,...} and caches in tools/chapter-lengths-cache.json.
   Used by the 66-book pipeline to apply the short-chapter rule (<10 verses
   means 10 questions) from verified data, never from memory. */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');
const cacheFile = path.join(__dirname, 'chapter-lengths-cache.json');
let cache = {};
try { cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8')); } catch(e){}

async function fetchCount(book, ch){
  const key = book + ' ' + ch;
  if(cache[key] !== undefined) return cache[key];
  let done = false, count = null;
  for(let attempt = 0; attempt < 5 && !done; attempt++){
    try{
      const url = 'https://bible-api.com/' + encodeURIComponent(book + ' ' + ch) + '?translation=kjv';
      const res = await fetch(url);
      if(res.status === 429){
        await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
        continue;
      }
      if(!res.ok) throw new Error('http ' + res.status);
      const j = await res.json();
      count = (j.verses || []).length;
      if(!count) throw new Error('empty verses');
      done = true;
    }catch(e){
      await new Promise(r => setTimeout(r, 2000));
      if(attempt === 4) throw new Error(key + ': ' + e.message);
    }
  }
  cache[key] = count;
  return count;
}

async function main(){
  const book = process.argv[2];
  const n = parseInt(process.argv[3], 10);
  if(!book || !n){ console.error('usage: node tools/chapter-lengths.js "Book" <chapters>'); process.exit(1); }
  const out = {};
  for(let ch = 1; ch <= n; ch++){
    out[ch] = await fetchCount(book, ch);
    if(ch % 10 === 0 || ch === n){
      fs.writeFileSync(cacheFile, JSON.stringify(cache));
    }
  }
  fs.writeFileSync(cacheFile, JSON.stringify(cache));
  console.log(JSON.stringify(out));
}
main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
