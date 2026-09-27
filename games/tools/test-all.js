/* Full flow test for Verse Games. Stubs the DOM, drives every screen by clicks.
   Run: node tools/test-all.js [path/to/file.html]  (from the verse-games folder; defaults to dist/verse-games.html) */
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
global.window = { hatchWidget:{getState:d=>d, setState:()=>{}}, addEventListener:()=>{}, scrollTo:()=>{} };
global.document = DOC;

const target = process.argv[2] || path.join('dist', 'verse-games.html');
const slim = /preview|slim/i.test(target);
const GEN_CH = slim ? 10 : 50;  // slim widget preview ships Genesis 1-10 only
const html = fs.readFileSync(path.join(base, target), 'utf8');
const scripts = [...html.matchAll(/<script>\n([\s\S]*?)\n<\/script>/g)].map(m => m[1]);
if(scripts.length < 5) throw new Error('expected at least 5 scripts, got ' + scripts.length);
eval(scripts[0]);            // engine defines window.VG
global.VG = window.VG;       // in a browser, window.VG is the global VG
scripts.slice(1).forEach(s => eval(s));

function click(attrs){
  const node = { getAttribute: n => (attrs[n] !== undefined ? attrs[n] : null), parentNode: DOC };
  clickHandlers.forEach(f => f({target: node}));
}
function has(t){ return htmlOut.v.indexOf(t) >= 0; }
function must(t, label){
  if(!has(t)) throw new Error('MISSING [' + label + ']: ' + t.slice(0, 60));
  if(/undefined/.test(htmlOut.v)) throw new Error('undefined leaked in [' + label + ']');
}
const G = () => window.VG.games();

/* data integrity: every question has 4 options, a valid answer, a real verse */
let nq = 0;
for(const id of window.VG.order()){
  const g = G()[id];
  const qs = [];
  (g.stages || []).forEach(s => (s.questions || []).forEach(q => qs.push(q)));
  (g.journey || []).forEach(j => (j.gate || []).forEach(q => qs.push(q)));
  qs.forEach((q, i) => {
    nq++;
    if(!q.options || q.options.length !== 4) throw new Error(id + ' q' + i + ' options');
    if(q.a < 0 || q.a > 3) throw new Error(id + ' q' + i + ' answer index');
    if(!q.verse || q.verse.length < 20) throw new Error(id + ' q' + i + ' verse missing: ' + q.ref);
    if(!q.insight || q.insight.length < 10) throw new Error(id + ' q' + i + ' insight');
    if(/[\u2013\u2014]/.test(q.q + q.insight)) throw new Error(id + ' q' + i + ' dash in copy');
  });
  if(g.seal && (!g.seal.verse || g.seal.verse.length < 20)) throw new Error(id + ' seal verse missing');
}
console.log('data integrity OK:', nq, 'questions');

/* hub */
domReady.forEach(f => f());
must('Knowledge Arena', 'hub title');
must('data-game="tribes"', 'tribes card');
must('data-game="plagues"', 'plagues card');
must('data-game="joseph"', 'joseph card');
if(!slim) must('data-game="who-said-it"', 'who said it card');
if(!slim) must('data-game="king-solomon"', 'king solomon card');
must('Being prepared', 'honest soon state');
must('Today', 'portion card');
console.log('hub OK');

/* tribes full stage flow */
click({'data-game':'tribes'});
must('Choose your pace', 'intro');
click({'data-diff':'scribe'});
must('Scribe', 'difficulty select');
click({'data-diff':'seeker'});
click({'data-act':'begin'});
must('Unstable as water', 'q1');
let q0 = G().tribes.stages[0].questions[0];
click({'data-opt': String((q0.a + 1) % 4)});
must('Not quite', 'wrong feedback');
must('Genesis 49:4', 'verse cite');
const lampsOut = (htmlOut.v.match(/vg-lamp out/g) || []).length;
if(lampsOut !== 1) throw new Error('expected 1 lamp out, got ' + lampsOut);
click({'data-act':'next'});
for(let i = 1; i < 13; i++){
  const q = G().tribes.stages[0].questions[i];
  must(q.q.slice(0, 24), 'stage1 q' + (i + 1));
  click({'data-opt': String(q.a)});
  must('Well answered', 'correct feedback q' + (i + 1));
  click({'data-act':'next'});
}
must('Stage sealed', 'complete');
must('Genesis 49:28', 'seal verse');
click({'data-act':'nextStage'});
must('Stage 2', 'stage 2 begins');
console.log('tribes stage flow OK');

/* lamps out path */
click({'data-act':'hub'});
click({'data-game':'tribes'});
click({'data-act':'begin'});
for(let k = 0; k < 3; k++){
  const q = G().tribes.stages[0].questions[k];
  click({'data-opt': String((q.a + 1) % 4)});
  click({'data-act':'next'});
}
must('lamps have gone out', 'out screen');
click({'data-act':'retryStage'});
must('Unstable as water', 'retry restarts');
console.log('lamps-out OK');

/* hints: seeker has hints, scribe has none */
click({'data-act':'hub'});
click({'data-game':'plagues'});
click({'data-diff':'pilgrim'});
click({'data-act':'begin'});
must('Reveal the verse', 'hint button');
click({'data-act':'hint'});
must('The answer is found in', 'hint reveals ref');
console.log('hints OK');

/* joseph journey + gates */
click({'data-act':'hub'});
click({'data-game':'joseph'});
click({'data-act':'begin'});
must('Potiphar', 'journey map');
click({'data-j':'0'});
must('coat of many colors', 'story');
click({'data-act':'gate'});
const gate = G().joseph.journey[0].gate;
for(let i = 0; i < 3; i++){
  must(gate[i].q.slice(0, 24), 'gate q' + (i + 1));
  click({'data-opt': String(gate[i].a)});
  must(i < 2 ? 'The gate opens' : 'The gate opens', 'gate feedback');
  click({'data-act':'gateNext'});
}
must('Potiphar', 'back to map after gate');
console.log('joseph journey OK');

/* gate failure path */
click({'data-j':'1'});
click({'data-act':'gate'});
const gq = G().joseph.journey[1].gate[0];
click({'data-opt': String((gq.a + 1) % 4)});
must('Not quite', 'gate wrong');
click({'data-act':'gateNext'});
must('Quiz gate', 'gate retry');
console.log('gate failure OK');

/* today's portion */
click({'data-act':'hub'});
click({'data-act':'daily'});
must('portion', 'daily');
const dq = htmlOut.v;
click({'data-opt':'0'});
must('KJV', 'daily verse');
console.log('daily OK');

/* whole counsel: genesis pilot data integrity */
var bch = window.VG.bibleChapters("genesis");
if(bch.length !== GEN_CH) throw new Error('expected ' + GEN_CH + ' genesis chapters, got ' + bch.length);
var bnq = 0;
bch.forEach(function(c){
  if(!c.name) throw new Error('gen ch' + c.n + ' missing name');
  if(!c.facts || c.facts.length !== 3) throw new Error('gen ch' + c.n + ' facts != 3');
  if(!c.questions || c.questions.length !== 20) throw new Error('gen ch' + c.n + ' questions != 20');
  if(/[\u2013\u2014]/.test(c.name + ' ' + c.facts.join(' '))) throw new Error('gen ch' + c.n + ' dash in copy');
  c.questions.forEach(function(q, i){
    bnq++;
    if(!q.options || q.options.length !== 4) throw new Error('gen ch' + c.n + ' q' + i + ' options');
    if(q.a !== 0) throw new Error('gen ch' + c.n + ' q' + i + ' a!==0');
    if(!q.verse || q.verse.length < 20) throw new Error('gen ch' + c.n + ' q' + i + ' verse missing: ' + q.ref);
    if(!q.insight || q.insight.length < 10) throw new Error('gen ch' + c.n + ' q' + i + ' insight');
    if(!/^Genesis /.test(q.ref)) throw new Error('gen ch' + c.n + ' q' + i + ' ref not genesis: ' + q.ref);
    if(/[\u2013\u2014]/.test(q.q + ' ' + q.insight)) throw new Error('gen ch' + c.n + ' q' + i + ' dash in copy');
  });
  if(!c.seal || !c.seal.verse || c.seal.verse.length < 20) throw new Error('gen ch' + c.n + ' seal verse missing');
});
console.log('genesis pilot OK:', bnq, 'questions');

/* whole counsel flow: books -> chapters -> chapter 1 -> breaks -> seal -> board */
click({'data-bbooks':'1'});
must('The Whole Counsel', 'book select');
must('data-bbook="genesis"', 'genesis book card');
must('Revelation', '66 books listed');
click({'data-bbook':'genesis'});
must('chapters sealed', 'chapter select');
must('data-bchap="' + GEN_CH + '"', GEN_CH + ' chapters');
click({'data-bchap':'1'});
must('Choose your pace', 'chapter intro');
click({'data-act':'begin'});
var bq = window.VG.bibleChapters("genesis")[0].questions;
for(var bi = 0; bi < 5; bi++){
  must(bq[bi].q.slice(0, 24), 'gen ch1 q' + (bi + 1));
  click({'data-opt': String(bq[bi].a)});
  click({'data-act':'next'});
}
must('Did you know?', 'stage break 1');
click({'data-act':'nextStage'});
must('Stage 2', 'stage 2 begins');
for(var bj = 5; bj < 20; bj++){
  must(bq[bj].q.slice(0, 24), 'gen ch1 q' + (bj + 1));
  click({'data-opt': String(bq[bj].a)});
  click({'data-act':'next'});
  if(bj === 9 || bj === 14){
    must('Did you know?', 'break after q' + (bj + 1));
    click({'data-act':'nextStage'});
  }
}
must('Chapter sealed', 'chapter complete');
must('Genesis 1:1', 'seal verse');
var bp = window.VG.bibleProg("genesis");
if(!bp.done[1]) throw new Error('chapter 1 not marked done');
if(!bp.best[1] || bp.best[1].score !== 20) throw new Error('leaderboard best wrong');
console.log('whole counsel flow OK');

/* leaderboard screen */
click({'data-act':'hub'});
click({'data-bbooks':'1'});
click({'data-board':'genesis'});
must('Leaderboard', 'board title');
must('20/20', 'board best row');
console.log('leaderboard OK');

console.log('ALL TESTS PASSED');
