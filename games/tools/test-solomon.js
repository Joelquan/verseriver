/* King Solomon series test: data integrity against the original app's
   case files plus driven playthroughs of all three scrolls: gentle path,
   discipline path (consequence, standing loss, proverb memorization gate,
   retry), unlocks, persistence, and seal guards.
   Run: node tools/test-solomon.js [path/to/file.html]  (from verse-games/) */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');

const htmlOut = {v:''};
const clickHandlers = [];
const domReady = [];
const panelEls = {};
const blankInputs = [];
function fakeEl(){
  return {
    _html:'',
    set innerHTML(v){ this._html = v; },
    get innerHTML(){ return this._html; },
    textContent:'',
    classList:{toggle(){}},
    getAttribute(){ return null; }
  };
}
const DOC = {
  getElementById: id => {
    if(id === 'vg-app') return { set innerHTML(v){ htmlOut.v = v; } };
    if(!panelEls[id]) panelEls[id] = fakeEl();
    return panelEls[id];
  },
  querySelectorAll: sel => sel === '.sol-blank' ? blankInputs : [],
  addEventListener: (t, f) => { if(t === 'click') clickHandlers.push(f); else if(t === 'DOMContentLoaded') domReady.push(f); }
};
global.window = { hatchWidget:null, addEventListener:()=>{}, scrollTo:()=>{} };
global.document = DOC;

const target = process.argv[2] || path.join('dist', 'verse-games.html');
const html = fs.readFileSync(path.join(base, target), 'utf8');
const scripts = [...html.matchAll(/<script>\n([\s\S]*?)\n<\/script>/g)].map(m => m[1]);
if(scripts.length < 5) throw new Error('expected at least 5 scripts, got ' + scripts.length);
eval(scripts[0]);
global.VG = window.VG;
scripts.slice(1).forEach(s => eval(s));

function click(attrs){
  const node = { getAttribute: n => (attrs[n] !== undefined ? attrs[n] : null), parentNode: DOC };
  clickHandlers.forEach(f => f({target: node}));
}
function has(t){ return htmlOut.v.indexOf(t) >= 0; }
function panelHas(t){ return (panelEls['solAppealPanel'] && panelEls['solAppealPanel']._html.indexOf(t) >= 0); }
function must(t, label){
  if(!has(t)) throw new Error('MISSING [' + label + ']: ' + t.slice(0, 70));
  if(/undefined/.test(htmlOut.v)) throw new Error('undefined leaked in [' + label + ']');
}
function mustPanel(t, label){
  if(!panelHas(t)) throw new Error('MISSING panel [' + label + ']: ' + t.slice(0, 70));
}
const G = () => window.VG.games()['king-solomon'];
function srcCase(n){
  return JSON.parse(fs.readFileSync(
    path.join(base, '..', 'ts-spaces', 'king-solomon', 'assets', 'cases',
      'adult-' + String(n).padStart(2, '0') + '.json'), 'utf8'));
}
/* option rotation used by the engine for scrolls 2-3: displayed[j] holds
   canonical options[(id%3 + j) % 3] */
function displayedCorrectIdx(gcase){
  const ci = gcase.options.findIndex(o => o.correct);
  const sc = gcase.id > 20 ? 3 : gcase.id > 10 ? 2 : 1;
  if(sc === 1) return ci;
  const turn = gcase.id % 3;
  for(let j = 0; j < 3; j++) if((turn + j) % 3 === ci) return j;
  throw new Error('rotation failed for case ' + gcase.id);
}
function allCases(){
  return [0,1,2].flatMap(s => captured.scrolls[s].cases);
}
/* the dist bundle must also register the game */
if(!G()) throw new Error('king-solomon not registered in dist');
if([0,1,2].flatMap(s => G().scrolls[s].cases).length !== 30)
  throw new Error('dist king-solomon != 30 cases');
/* replicate the engine's blank-selection so the test can fill the verse */
function blanksFor(quote){
  const parts = quote.split(/\s+/), eligible = [];
  parts.forEach((word, i) => {
    if(i > 0 && word.replace(/[^A-Za-z\u2019']/g, '').length > 3) eligible.push(i);
  });
  const take = Math.min(5, Math.max(3, Math.ceil(parts.length / 5)));
  const step = Math.max(1, Math.floor(eligible.length / take));
  const chosen = [];
  for(let i = 0; i < eligible.length && chosen.length < take; i += step) chosen.push(eligible[i]);
  return {parts, chosen};
}
function normWord(s){ return String(s).trim().toLowerCase().replace(/[\u2019']/g, "'"); }
/* the engine HTML-escapes text; mirror its esc() for assertions */
function esc_q(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function fillBlanks(gcase, wrongOne){
  blankInputs.length = 0;
  const wise = gcase.options.find(o => o.correct);
  const b = blanksFor(wise.anchor.quote);
  b.chosen.forEach((idx, k) => {
    const answer = normWord(b.parts[idx].replace(/[^A-Za-z\u2019']/g, ''));
    blankInputs.push({
      getAttribute: n => n === 'data-word' ? String(idx) : null,
      value: (wrongOne && k === 0) ? answer + 'x' : answer,
      classList: {toggle(){}}
    });
  });
  return b.chosen.length;
}

/* 1. data integrity against the original case files.
   Read the SOURCE data file (js/data-solomon.js), not the inlined dist,
   so image refs are plain paths. */
let captured = null;
const srcData = fs.readFileSync(path.join(base, 'js', 'data-solomon.js'), 'utf8');
new Function('VG', srcData)({register: g => { captured = g; }});
const g = captured;
if(!g) throw new Error('king-solomon not registered');
if(g.shelf !== 'mix' || g.mode !== 'solomon') throw new Error('wrong shelf/mode');
if(g.art !== 'img/card-king-solomon.webp')
  throw new Error('card art mismatch: ' + String(g.art).slice(0, 40));
if(!fs.existsSync(path.join(base, 'img', 'card-king-solomon.webp'))) throw new Error('card art file missing');
if(g.scrolls.length !== 3) throw new Error('expected 3 scrolls');
const flat = allCases();
if(flat.length !== 30) throw new Error('expected 30 cases, got ' + flat.length);
flat.forEach((gc, k) => {
  const n = k + 1, src = srcCase(n);
  if(gc.id !== n) throw new Error('case id mismatch at ' + n);
  if(gc.title !== src.title) throw new Error('title differs at case ' + n);
  if(gc.story !== src.story) throw new Error('story differs at case ' + n);
  if(gc.setting !== src.setting) throw new Error('setting differs at case ' + n);
  if((gc.question || '') !== (src.question || 'What is your judgment?'))
    throw new Error('question differs at case ' + n);
  if(gc.consequence !== (src.consequence || '')) throw new Error('consequence differs at case ' + n);
  if(n > 10 && !gc.consequence) throw new Error('case ' + n + ' missing consequence');
  if(n <= 10 && gc.consequence) throw new Error('case ' + n + ' should have no consequence');
  if(!gc.image || !fs.existsSync(path.join(base, gc.image)))
    throw new Error('case ' + n + ' image missing: ' + gc.image);
  if(!gc.alt) throw new Error('case ' + n + ' alt missing');
  if(gc.options.length !== 3) throw new Error('case ' + n + ' options != 3');
  if(gc.options.filter(o => o.correct).length !== 1) throw new Error('case ' + n + ' correct count');
  gc.options.forEach((o, i) => {
    const so = src.options[i];
    if(o.text !== so.text) throw new Error('case ' + n + ' opt' + i + ' text differs');
    if(o.feedback !== so.feedback) throw new Error('case ' + n + ' opt' + i + ' feedback differs');
    if(o.anchor.ref !== so.anchor.ref || o.anchor.quote !== so.anchor.quote)
      throw new Error('case ' + n + ' opt' + i + ' anchor differs');
    if(!!o.correct !== !!so.correct) throw new Error('case ' + n + ' opt' + i + ' correct flag differs');
  });
  const copy = [gc.title, gc.story, gc.setting, gc.question, gc.consequence,
    ...gc.options.flatMap(o => [o.text, o.feedback, o.anchor.ref, o.anchor.quote])].join(' ');
  if(/[\u2013\u2014]/.test(copy)) throw new Error('dash in case ' + n);
  if(/<\/script/i.test(copy)) throw new Error('</script> in case ' + n);
});
console.log('data integrity OK: 30 cases byte-identical to source, images present, no dashes');

/* 2. hub card + series panel */
domReady.forEach(f => f());
must('data-game="king-solomon"', 'hub card');
must('The game mix', 'mix shelf');
click({'data-game':'king-solomon'});
must('Product of Verse River', 'brand lockup');
must('See more at verseriver.com', 'website link');
must('https://verseriver.com', 'website href');
must('alt="Verse River logo"', 'logo art');
must('Standing <b>5</b>', 'standing shown');
must('data-scroll="2" disabled', 'scroll 2 sealed');
must('data-scroll="3" disabled', 'scroll 3 sealed');
console.log('series panel OK');

/* 3. sealed scroll guard */
const before = htmlOut.v;
click({'data-scroll':'3'});
if(htmlOut.v !== before) throw new Error('sealed scroll opened!');
console.log('seal guard OK');

/* 4. scroll 1 case list + locked case guard */
click({'data-scroll':'1'});
must('data-case="1"', 'case 1 tile');
const before2 = htmlOut.v;
click({'data-case':'5'});
if(htmlOut.v !== before2) throw new Error('locked case opened!');
must('data-case="2" disabled', 'case 2 locked');
console.log('case list + lock guard OK');

/* 5. case 1, correct (gentle, +10) */
click({'data-case':'1'});
const c1 = flat[0];
must(c1.story.slice(0, 40), 'case 1 story');
must('What is your judgment?', 'judgment question');
must('alt="' , 'case image');
click({'data-opt': String(displayedCorrectIdx(c1))});
must('A wise judgment', 'gentle correct verdict');
must(c1.options.find(o=>o.correct).anchor.ref, 'proverb ref shown');
let p = window.VG.store.get('progress', {})['king-solomon'].sol;
if(p.score !== 10) throw new Error('score != 10, got ' + p.score);
if(p.done[1].join() !== '1') throw new Error('done[1] wrong');
console.log('scroll 1 correct path OK (+10)');

/* 6. case 2, wrong: gentle, +3, no consequence, standing untouched */
click({'data-act':'solNext'});
const c2 = flat[1];
const wrong2 = (displayedCorrectIdx(c2) + 1) % 3;
click({'data-opt': String(wrong2)});
must('Wisdom corrects the court', 'gentle wrong verdict');
must('The wiser judgment:', 'wiser judgment shown');
if(has('What followed')) throw new Error('consequence leaked into scroll 1!');
p = window.VG.store.get('progress', {})['king-solomon'].sol;
if(p.score !== 13) throw new Error('score != 13, got ' + p.score);
if(p.standing !== 5) throw new Error('standing changed in scroll 1!');
console.log('scroll 1 wrong path OK (+3, gentle, standing untouched)');

/* 7. finish scroll 1 (cases 3-10 correct) */
for(let n = 3; n <= 10; n++){
  click({'data-act':'solNext'});
  const gc = flat[n-1];
  must('Case ' + String(n).padStart(2, '0'), 'at case ' + n);
  click({'data-opt': String(displayedCorrectIdx(gc))});
  must('A wise judgment', 'case ' + n + ' correct');
  if(n < 10) must('Open next case', 'next button');
}
click({'data-act':'solNext'});
must('Wisdom has spoken.', 'scroll 1 complete');
must('Enter Scroll 2', 'scroll 2 entry');
p = window.VG.store.get('progress', {})['king-solomon'].sol;
if(p.done[1].length !== 10) throw new Error('scroll 1 not fully done');
if(p.unlocked[2] !== 11) throw new Error('scroll 2 not unlocked');
if(p.score !== 93) throw new Error('score != 93, got ' + p.score);
console.log('scroll 1 complete: 10/10 done, scroll 2 unlocked, score 93');

/* 8. scroll 2 case 11, wrong: discipline path */
click({'data-act':'solEnterNext'});
must('data-case="11"', 'scroll 2 case list');
click({'data-case':'11'});
const c11 = flat[10];
const wrong11 = (displayedCorrectIdx(c11) + 1) % 3;
click({'data-opt': String(wrong11)});
must('The court bears the cost', 'discipline verdict');
must('What followed', 'consequence shown');
must(c11.consequence.slice(0, 40), 'consequence text');
must('Wisdom -5', 'wisdom loss chip');
must('Standing -1', 'standing loss chip');
must('The wiser judgment:', 'wiser judgment shown');
p = window.VG.store.get('progress', {})['king-solomon'].sol;
if(p.score !== 88) throw new Error('score != 88 after discipline, got ' + p.score);
if(p.standing !== 4) throw new Error('standing != 4, got ' + p.standing);
must('Memorize the proverb.', 'appeal panel');
console.log('discipline path OK (consequence, -5 wisdom, -1 standing)');

/* 9. appeal: wrong words first, then right words, then retry */
click({'data-act':'solBeginAppeal'});
mustPanel('Remember the verse', 'memory screen');
const nBlanks = fillBlanks(c11, true);
if(nBlanks < 3) throw new Error('expected at least 3 blanks, got ' + nBlanks);
click({'data-act':'solCheckAppeal'});
if(panelEls['solAppealNote'].textContent.indexOf('Not yet.') < 0)
  throw new Error('wrong words accepted!');
console.log('memorization gate rejects wrong words OK');
fillBlanks(c11, false);
click({'data-act':'solCheckAppeal'});
mustPanel('Verse memorized', 'appeal granted');
mustPanel('Retry this judgment', 'retry button');
click({'data-act':'solRetryAppeal'});
must(esc_q(c11.question), 'case reopened for retry');
click({'data-opt': String(displayedCorrectIdx(c11))});
must('A discerning judgment', 'retry correct verdict');
p = window.VG.store.get('progress', {})['king-solomon'].sol;
if(p.score !== 102) throw new Error('score != 102 after retry, got ' + p.score);
if(p.done[2].join() !== '11') throw new Error('case 11 not marked done');
console.log('appeal + retry OK (word-for-word gate, +14 on retry)');

/* 10. replay of a done case: review, no score change */
click({'data-act':'solCases'});
click({'data-case':'11'});
click({'data-opt': String((displayedCorrectIdx(c11) + 2) % 3)});
must('Review the wiser judgment', 'review verdict');
p = window.VG.store.get('progress', {})['king-solomon'].sol;
if(p.score !== 102) throw new Error('replay changed score!');
console.log('replay review OK (no score change)');

/* 11. persistence shape */
const sol = window.VG.store.get('progress', {})['king-solomon'].sol;
if(!sol || sol.standing !== 4) throw new Error('persisted standing wrong');
if(sol.unlocked[1] !== 10 || sol.unlocked[2] !== 12) throw new Error('persisted unlocks wrong: ' + JSON.stringify(sol.unlocked));
console.log('persistence OK');

/* 12. back to hub cleanly */
click({'data-act':'hub'});
must('Knowledge Arena', 'back at study desk');
console.log('ALL SOLOMON TESTS PASSED');
