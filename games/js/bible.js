/* The Whole Counsel: the 66-book Bible game.
   Book select, chapter select, "Did you know?" stage breaks between the four
   stages of five, per-chapter progress, and a local leaderboard that keeps the
   whole record of play. Chapters play through the engine as transient games. */
(function(){
"use strict";

/* ---------- registries ---------- */
var books = {};
var chaps = {};
function registerBibleBook(m){ books[m.id] = m; }
function registerBibleChapters(id, list){
  chaps[id] = (chaps[id]||[]).concat(list);
  chaps[id].sort(function(a,b){ return a.n - b.n; });
}
function bibleBook(id){ return books[id]; }
function bibleChapters(id){ return chaps[id] || []; }
function bibleChapter(id, n){
  var list = bibleChapters(id);
  for(var i=0;i<list.length;i++) if(list[i].n===n) return list[i];
  return null;
}

/* all 66 books: title and chapter count (only books with data are playable) */
var BOOKS66 = [
["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],
["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],
["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],
["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],
["Proverbs",31],["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],
["Jeremiah",52],["Lamentations",5],["Ezekiel",48],["Daniel",12],
["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],
["Micah",7],["Nahum",3],["Habakkuk",3],["Zephaniah",3],["Haggai",2],
["Zechariah",14],["Malachi",4],["Matthew",28],["Mark",16],["Luke",24],
["John",21],["Acts",28],["Romans",16],["1 Corinthians",16],["2 Corinthians",13],
["Galatians",6],["Ephesians",6],["Philippians",4],["Colossians",4],
["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],
["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],
["2 Peter",3],["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]
];
function slug(t){ return t.toLowerCase().replace(/[^a-z0-9]+/g,""); }
/* chapter-data id aliases: a few data files predate the hub slug rule */
var CHAPID = {"songofsolomon":"song"};
function chapId(id){ return CHAPID[id] || id; }

/* ---------- storage (own keys, same bridge pattern as the engine) ---------- */
var mem = {};
var bstore = {
  get:function(k,d){
    try{
      if(window.hatchWidget && window.hatchWidget.getState){
        var s = window.hatchWidget.getState({});
        return (s && s["bible_"+k] !== undefined) ? s["bible_"+k] : d;
      }
      var v = localStorage.getItem("vg_"+k);
      return v === null ? d : JSON.parse(v);
    }catch(e){ return mem[k] !== undefined ? mem[k] : d; }
  },
  set:function(k,v){
    try{
      if(window.hatchWidget && window.hatchWidget.setState){
        var s = window.hatchWidget.getState({}) || {};
        s["bible_"+k] = v; window.hatchWidget.setState(s); return;
      }
      localStorage.setItem("vg_"+k, JSON.stringify(v));
    }catch(e){ mem[k] = v; }
  }
};
var progCache = {};
function bookProg(id){
  if(progCache[id]) return progCache[id];
  var p = bstore.get("bible_prog", {books:{}});
  if(!p.books[id]) p.books[id] = {done:{}, best:{}};
  progCache[id] = p.books[id];
  return progCache[id];
}
function saveBookProg(id, bp){
  progCache[id] = bp;
  var p = bstore.get("bible_prog", {books:{}});
  p.books[id] = bp; bstore.set("bible_prog", p);
}

/* ---------- render ---------- */
function app(){ return document.getElementById("vg-app"); }
function render(html, theme){
  var a = app();
  a.className = theme ? ("vg-theme-"+theme) : "";
  a.innerHTML = '<div class="vg-anim">'+html+'</div>';
  window.scrollTo(0,0);
}
function topbar(back, label){
  return '<div class="vg-topbar"><button class="vg-back" '+back+'>&larr; '+label+'</button></div>';
}

/* ---------- book select ---------- */
function vBooks(){
  var cards = BOOKS66.map(function(b){
    var id = slug(b[0]);
    var meta = books[id];
    var playable = !!(meta && bibleChapters(chapId(id)).length>0);
    var inner = '<div class="vg-card-body">'
      +'<div class="vg-gkicker">'+VG.esc(playable?meta.kicker:("KJV · "+b[0]))+'</div>'
      +'<h3>'+VG.esc(b[0])+'</h3>'
      +'<p class="vg-gdesc">'+VG.esc(playable?meta.desc:"Being prepared.")+'</p>'
      +'<div class="vg-gmeta"><span class="vg-gtag">'+b[1]+' chapters</span>'
      +(playable?'<span class="vg-play">Open &rarr;</span>':'<span class="vg-soon">Being prepared</span>')
      +'</div></div>';
    if(playable)
      return '<button class="vg-card vg-game" data-bbook="'+id+'">'
        +'<div class="vg-card-art"><img src="'+meta.art+'"></div>'+inner+'</button>';
    return '<div class="vg-card vg-game" aria-disabled="true">'+inner+'</div>';
  }).join("");
  render(
    topbar('data-act="hub"', 'Study desk')
    +'<div class="vg-card"><div class="vg-gkicker">The 66 books · every chapter a level</div>'
    +'<h3 style="font-family:var(--serif);font-size:24px;margin:0 0 8px">The Whole Counsel</h3>'
    +'<p class="vg-gdesc">Twenty questions for every chapter of the Bible, each book in its own visual world. All sixty-six books are open now, from Genesis to Revelation: pick a book, seal its chapters one by one, and let every verse do its work.</p></div>'
    +'<div class="vg-btnrow"><button class="vg-btn ghost" data-board="genesis">Leaderboard</button></div>'
    +cards
  );
}

/* ---------- chapter select ---------- */
var curBookId = null;
function vChapters(bookId){
  var meta = books[bookId];
  if(!meta) return;
  curBookId = bookId;
  var list = bibleChapters(chapId(bookId));
  var bp = bookProg(bookId);
  var doneCount = Object.keys(bp.done).length;
  var cells = list.map(function(c){
    var done = !!bp.done[c.n];
    var best = bp.best[c.n];
    var sub = done ? (best ? best.score+"/20 · "+best.diff : "sealed") : "chapter "+c.n;
    return '<button class="vg-chap'+(done?" done":"")+'" data-bchap="'+c.n+'">'
      +'<span class="vg-chap-n">'+c.n+'</span>'
      +'<span class="vg-chap-t">'+VG.esc(c.name)+'</span>'
      +'<span class="vg-chap-s">'+(done?"&#10003; ":"")+VG.esc(sub)+'</span></button>';
  }).join("");
  render(
    topbar('data-bbooks="1"', 'The books')
    +'<div class="vg-card vg-bookhead"><div class="vg-card-art"><img src="'+meta.art+'"></div>'
    +'<div class="vg-gkicker">'+VG.esc(meta.kicker)+'</div>'
    +'<h3 style="font-family:var(--serif);font-size:26px;margin:0 0 8px">'+VG.esc(meta.title)+'</h3>'
    +'<p class="vg-gdesc">'+VG.esc(meta.intro)+'</p>'
    +'<p class="vg-gtag">'+doneCount+' of '+list.length+' chapters sealed</p></div>'
    +'<div class="vg-btnrow"><button class="vg-btn ghost" data-board="'+bookId+'">Leaderboard</button></div>'
    +'<div class="vg-chapgrid">'+cells+'</div>'
    +'<p class="vg-shelf-note">Twenty questions per chapter in stages of five (ten questions for the shortest chapters). A "Did you know?" break rests you between stages, and the lamps are restored at every stage.</p>',
    meta.theme
  );
}

/* ---------- chapter play (transient engine game) ---------- */
var cur = null;
function playChapter(bookId, n){
  var meta = books[bookId];
  var c = bibleChapter(chapId(bookId), n);
  if(!meta || !c) return;
  var stages = [];
  var stageCount = Math.max(1, Math.round(c.questions.length/5));
  for(var s=0;s<stageCount;s++)
    stages.push({name:"Stage "+(s+1)+" · "+c.name, questions:c.questions.slice(s*5, s*5+5)});
  cur = {bookId:bookId, n:n, stage:0, stages:stageCount, total:c.questions.length};
  VG.openTransient({
    title: meta.title+" "+n+" · "+c.name,
    kicker: "KJV · "+meta.title+" "+n,
    desc: c.name,
    meta: "Chapter "+n+" of "+bibleChapters(chapId(bookId)).length+" · "+c.questions.length+" questions · "+stageCount+" stages",
    shelf: "bible",
    bibleBreak: true,
    seal: c.seal,
    stages: stages
  });
}

/* engine calls this between stages; the Continue button uses data-act="nextStage" */
function bibleBreak(){
  if(!cur) return;
  if(window.VGSound) window.VGSound.stage();
  var c = bibleChapter(chapId(cur.bookId), cur.n);
  var idx = cur.stage || 0;
  var fact = (c.facts && c.facts[idx]) || "";
  cur.stage = idx + 1;
  var a = app();
  a.innerHTML = '<div class="vg-anim vg-break-screen"><div class="vg-center">'
    +'<div class="vg-break-icon" aria-hidden="true">'
    +'<svg viewBox="0 0 24 24"><path class="flame" d="M12 2c1.8 2.6 3.4 4.6 3.4 7a3.4 3.4 0 01-6.8 0c0-1.2.5-2.1 1.1-3 .3 1 1 1.7 1.4 1.7.3-1.2.4-3.4.9-5.7z"/>'
    +'<path class="body" d="M8 13h8l-1.2 6a2 2 0 01-2 1.6h-1.6a2 2 0 01-2-1.6L8 13z"/>'
    +'<path class="body" d="M10 22.5h4"/></svg></div>'
    +'<div class="vg-gkicker">Rest a moment · Did you know?</div>'
    +'<div class="vg-card vg-break"><p>'+VG.esc(fact)+'</p></div>'
    +'<div class="vg-btnrow" style="justify-content:center">'
    +'<button class="vg-btn" data-act="nextStage">Continue to stage '+(idx+2)+' of '+(cur.stages||4)+'</button>'
    +'</div></div></div>';
  window.scrollTo(0,0);
}

/* engine calls this with the session when the final stage seals */
function bibleDone(S){
  if(!cur) return;
  var total = cur.total || 20;
  var bp = bookProg(cur.bookId);
  bp.done[cur.n] = true;
  var rec = {
    score:S.correct, total:total,
    acc: Math.round(S.correct/total*100),
    diff: (VG.DIFFS[S.diff]||{}).name || S.diff,
    hints: S._hintsUsed||0, lamps: S.lamps,
    ms: Date.now() - (S._t0||Date.now()),
    date: new Date().toISOString().slice(0,10)
  };
  var prev = bp.best[cur.n];
  if(!prev || rec.score > prev.score) bp.best[cur.n] = rec;
  saveBookProg(cur.bookId, bp);
}

/* ---------- leaderboard ---------- */
function vBoard(bookId){
  var meta = books[bookId] || {title:"Genesis", theme:"genesis", kicker:"KJV"};
  var bp = bookProg(bookId);
  var list = bibleChapters(chapId(bookId));
  var totScore = 0, totQ = 0, totHints = 0;
  Object.keys(bp.best).forEach(function(k){
    totScore += bp.best[k].score; totQ += bp.best[k].total; totHints += bp.best[k].hints;
  });
  var acc = totQ ? Math.round(totScore/totQ*100) : 0;
  var rows = list.map(function(c){
    var b = bp.best[c.n];
    if(!b) return '<div class="vg-lb-row"><span class="vg-lb-c">'+c.n+'. '+VG.esc(c.name)+'</span>'
      +'<span class="vg-lb-s">not yet played</span></div>';
    return '<div class="vg-lb-row"><span class="vg-lb-c">'+c.n+'. '+VG.esc(c.name)+'</span>'
      +'<span class="vg-lb-s">'+b.score+'/'+b.total+' · '+b.acc+'% · '+VG.esc(b.diff)
      +' · '+b.hints+' hints · '+b.lamps+' lamps · '+Math.round(b.ms/1000)+'s</span></div>';
  }).join("");
  render(
    topbar('data-bbook="'+bookId+'"', VG.esc(meta.title))
    +'<div class="vg-card"><div class="vg-gkicker">The whole record of play</div>'
    +'<h3 style="font-family:var(--serif);font-size:24px;margin:0 0 8px">'+VG.esc(meta.title)+' · Leaderboard</h3>'
    +'<p class="vg-gdesc">Chapters sealed: '+Object.keys(bp.done).length+' of '+list.length
    +'. Answered well: '+totScore+' of '+totQ+' ('+acc+'%). Hints used: '+totHints
    +'. Best score kept per chapter.</p></div>'
    +rows,
    meta.theme
  );
}

/* ---------- clicks ---------- */
document.addEventListener("click", function(e){
  var t = e.target;
  while(t && t!==document){
    if(t.getAttribute){
      if(t.getAttribute("data-bbooks")!==null){ if(window.VGSound) window.VGSound.click(); vBooks(); return; }
      var bb = t.getAttribute("data-bbook");
      if(bb!==null){ if(window.VGSound) window.VGSound.click(); vChapters(bb); return; }
      var bc = t.getAttribute("data-bchap");
      if(bc!==null && curBookId){ if(window.VGSound) window.VGSound.confirm(); playChapter(curBookId, parseInt(bc,10)); return; }
      var bd = t.getAttribute("data-board");
      if(bd!==null){ if(window.VGSound) window.VGSound.click(); vBoard(bd); return; }
    }
    t = t.parentNode;
  }
});

window.VG.registerBibleBook = registerBibleBook;
window.VG.registerBibleChapters = registerBibleChapters;
window.VG.bibleBook = bibleBook;
window.VG.bibleChapters = bibleChapters;
window.VG.bibleBreak = bibleBreak;
window.VG.bibleDone = bibleDone;
window.VG.bibleOpen = vBooks;
window.VG.bibleProg = bookProg;
})();
