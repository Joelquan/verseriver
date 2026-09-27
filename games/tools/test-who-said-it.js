/* Who Said It campaign test: data integrity against the verified bank plus a
   full driven playthrough (level 1, all 50 quotes), scoring, unlocks,
   persistence, and a wrong-answer check.
   Run: node tools/test-who-said-it.js [path/to/file.html]  (from verse-games/) */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');

const htmlOut = {v:''};
const clickHandlers = [];
const domReady = [];
const DOC = {
  getElementById: id => ({ set innerHTML(v){ htmlOut.v = v; } }),
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
function must(t, label){
  if(!has(t)) throw new Error('MISSING [' + label + ']: ' + t.slice(0, 70));
  if(/undefined/.test(htmlOut.v)) throw new Error('undefined leaked in [' + label + ']');
}
const G = () => window.VG.games()['who-said-it'];

/* 1. data integrity against the bank (independent read) */
const bank = JSON.parse(fs.readFileSync(
  path.join(base, '..', 'who-said-it-levels', 'quote-bank-500.json'), 'utf8'));
const g = G();
if(!g) throw new Error('who-said-it not registered');
if(g.shelf !== 'mix' || g.mode !== 'whosaidit') throw new Error('wrong shelf/mode');
if(g.levels.length !== 10) throw new Error('expected 10 levels');
let nq = 0;
g.levels.forEach((L, li) => {
  if(L.questions.length !== 50) throw new Error('level ' + (li+1) + ' != 50 questions');
  L.questions.forEach((q, qi) => {
    nq++;
    const b = bank.levels[String(li+1)][qi];
    if(q.q !== b.quote) throw new Error('quote text differs at L' + (li+1) + ' q' + qi);
    if(q.ref !== b.ref) throw new Error('ref differs at L' + (li+1) + ' q' + qi);
    if(!q.options || q.options.length !== 5) throw new Error('options != 5 at L' + (li+1) + ' q' + qi);
    if(new Set(q.options).size !== 5) throw new Error('dup options at L' + (li+1) + ' q' + qi);
    if(q.a < 0 || q.a > 4) throw new Error('bad answer index at L' + (li+1) + ' q' + qi);
    if(q.options[q.a] !== b.speaker) throw new Error('correct speaker wrong at L' + (li+1) + ' q' + qi);
    if(/[\u2013\u2014]/.test(q.q)) throw new Error('dash in quote L' + (li+1) + ' q' + qi);
  });
});
console.log('data integrity OK:', nq, 'questions, quotes byte-identical to bank');

/* 2. hub card + campaign panel */
domReady.forEach(f => f());
must('data-game="who-said-it"', 'hub card');
must('The game mix', 'mix shelf');
click({'data-game':'who-said-it'});
must('Product of Verse River', 'brand lockup');
must('See more at verseriver.com', 'website link');
must('https://verseriver.com', 'website href');
must('alt="Verse River logo"', 'logo art');
const engSrc = fs.readFileSync(path.join(base, 'js', 'engine.js'), 'utf8');
if(engSrc.indexOf('img/vr-logo.jpg') < 0) throw new Error('engine missing logo reference');
must('Campaign total', 'campaign total');
must('data-level="2" disabled', 'level 2 locked');
console.log('campaign panel OK');

/* 3. locked level guard: clicking level 3 does nothing */
const before = htmlOut.v;
click({'data-level':'3'});
if(htmlOut.v !== before) throw new Error('locked level opened!');
console.log('lock guard OK');

/* 4. full level 1 playthrough, all correct */
click({'data-level':'1'});
must('Round 1 of 10', 'round 1 header');
for(let r = 0; r < 10; r++){
  for(let k = 0; k < 5; k++){
    const q = G().levels[0].questions[r*5+k];
    must(q.q.slice(0, 30), 'L1 r' + (r+1) + ' q' + (k+1));
    click({'data-opt': String(q.a)});
    must('Well answered. +10', 'correct feedback');
    must(q.ref, 'ref shown');
    click({'data-act':'wsiNext'});
  }
  if(r < 9){
    must('Round ' + (r+1) + ' complete', 'round done');
    must((r+1)*50 + '', 'round score ' + ((r+1)*50));
    click({'data-act':'wsiNextRound'});
    must('Round ' + (r+2) + ' of 10', 'next round');
  }
}
must('See the level result', 'level result button');
click({'data-act':'wsiFinish'});
must('Level 1 complete', 'level complete');
must('500', 'level score 500');
must('Level 2 is now open', 'unlock message');
console.log('level 1 full playthrough OK: 500/500, level 2 unlocked');

/* 5. persistence: progress survived via the engine store */
const p = window.VG.store.get('progress', {});
const w = p['who-said-it'] && p['who-said-it'].wsi;
if(!w) throw new Error('no persisted wsi progress');
if(w.unlocked !== 2) throw new Error('unlocked != 2, got ' + w.unlocked);
if(w.best['1'] !== 500) throw new Error('best[1] != 500');
if(w.total !== 500) throw new Error('total != 500');
console.log('persistence OK: unlocked=2, best=500, total=500');

/* 6. level 2 opens, best score shown, wrong answer scores nothing */
click({'data-act':'wsiLevels'});
must('Best 500 / 500', 'best shown on level 1');
if(has('data-level="2" disabled')) throw new Error('level 2 still locked');
click({'data-level':'2'});
const wq = G().levels[1].questions[0];
click({'data-opt': String((wq.a + 1) % 5)});
must('Not quite.', 'wrong feedback');
click({'data-act':'wsiNext'});
must('Level score <b>0</b>', 'no points for wrong');
console.log('wrong-answer check OK');

/* 7. quit to hub cleanly */
click({'data-act':'hub'});
must('Knowledge Arena', 'back at study desk');
console.log('ALL WHO-SAID-IT TESTS PASSED');
