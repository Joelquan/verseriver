/* Verse Games engine: stages, lamps, hints, difficulty, journey gates, storage.
   Works in the site, and inside the Muse chat widget when present. */
(function(){
"use strict";

var DIFFS = {
  seeker:  {name:"Seeker",  desc:"Gentle pace. The verse hint stays open, so every question becomes a reading."},
  pilgrim: {name:"Pilgrim", desc:"Steady pace. One verse hint per stage. Read carefully."},
  scribe:  {name:"Scribe",  desc:"Strict mode. No hints. For those who know the text well."}
};
var HINTS = {seeker:99, pilgrim:1, scribe:0};

/* ---------- storage ---------- */
var mem = {};
var store = {
  get:function(k, d){
    try{
      if(window.hatchWidget && window.hatchWidget.getState){
        var s = window.hatchWidget.getState({});
        return (s && s[k] !== undefined) ? s[k] : d;
      }
      var v = localStorage.getItem("vg_"+k);
      return v === null ? d : JSON.parse(v);
    }catch(e){ return mem[k] !== undefined ? mem[k] : d; }
  },
  set:function(k, v){
    try{
      if(window.hatchWidget && window.hatchWidget.setState){
        var s = window.hatchWidget.getState({}) || {};
        s[k] = v; window.hatchWidget.setState(s); return;
      }
      localStorage.setItem("vg_"+k, JSON.stringify(v));
    }catch(e){ mem[k] = v; }
  }
};

function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function cleanVerse(t){
  return String(t||"").replace(/\s+/g," ").trim();
}

/* ---------- registry ---------- */
var games = {};
var order = [];
function register(g){ games[g.id]=g; order.push(g.id); }

/* ---------- session state (not persisted) ---------- */
var S = null;
function newSession(gameId){
  return {
    gameId:gameId, diff:"seeker", screen:"intro",
    stage:0, qi:0, lamps:3, hintsLeft:0, hintOpen:false,
    picked:-1, correct:0, stageCorrect:0, stageTotal:0,
    jstage:0, gateQi:0
  };
}

/* ---------- progress (persisted) ---------- */
function prog(){
  return store.get("progress", {});
}
function saveProg(p){ store.set("progress", p); }
function gameProg(id){
  var p = prog();
  if(!p[id]) p[id] = {stagesDone:0, jDone:0, plays:0};
  return p[id];
}

/* ---------- rendering ---------- */
var app = null;
function el(){ if(!app) app = document.getElementById("vg-app"); return app; }
function render(html){
  el().innerHTML = '<div class="vg-anim">'+html+'</div>';
  var t = el(); if(t && t.scrollIntoView) window.scrollTo(0,0);
}

function lampSVG(out, lost){
  return '<svg class="vg-lamp'+(out?' out':'')+(lost?' lost':'')+'" viewBox="0 0 24 24" aria-hidden="true">'
    +'<path class="flame" d="M12 2c1.8 2.6 3.4 4.6 3.4 7a3.4 3.4 0 01-6.8 0c0-1.2.5-2.1 1.1-3 .3 1 1 1.7 1.4 1.7.3-1.2.4-3.4.9-5.7z"/>'
    +'<path class="body" d="M8 13h8l-1.2 6a2 2 0 01-2 1.6h-1.6a2 2 0 01-2-1.6L8 13z"/>'
    +'<path class="body" d="M10 22.5h4"/></svg>';
}
function lamps(n, justLost){
  var h = '<div class="vg-lamps" role="img" aria-label="'+n+' of 3 lamps lit">';
  for(var i=0;i<3;i++) h += lampSVG(i>=n, justLost && i===n);
  return h+'</div>';
}

/* ---------- hub data ---------- */
function allQuestions(){
  var out = [];
  order.forEach(function(id){
    var g = games[id];
    if(!g.playable) return;
    (g.stages||[]).forEach(function(st){
      (st.questions||[]).forEach(function(q){ out.push({game:id, q:q}); });
    });
    (g.journey||[]).forEach(function(j){
      (j.gate||[]).forEach(function(q){ out.push({game:id, q:q}); });
    });
  });
  return out;
}

/* ---------- screens ---------- */
function vHub(){
  S = null;
  if(window.VGHub && window.VGHub.render) window.VGHub.render();
}

function vIntro(){
  var g = games[S.gameId];
  var ds = Object.keys(DIFFS).map(function(k){
    return '<button class="vg-dopt'+(S.diff===k?' sel':'')+'" data-diff="'+k+'">'
      +'<b>'+DIFFS[k].name+'</b><span>'+DIFFS[k].desc+'</span></button>';
  }).join("");
  var p = gameProg(g.id);
  var resume = "";
  if(g.journey && p.jDone>0 && p.jDone<g.journey.length)
    resume = '<p class="vg-ddesc">You rest at stage '+(p.jDone+1)+' of '+g.journey.length+'. The map remembers.</p>';
  if(!g.bibleBreak && g.stages && p.stagesDone>0 && p.stagesDone<g.stages.length)
    resume = '<p class="vg-ddesc">You have sealed '+p.stagesDone+' of '+g.stages.length+' stages. The desk remembers.</p>';
  render(
    '<div class="vg-topbar"><button class="vg-back" data-act="hub">&larr; Study desk</button>'
    +'<span class="vg-stage">'+esc(g.kicker)+'</span></div>'
    +'<div class="vg-card"><div class="vg-gkicker">'+esc(g.kicker)+'</div>'
    +'<h3 style="font-family:var(--serif);font-size:24px;margin:0 0 8px">'+esc(g.title)+'</h3>'
    +'<p class="vg-gdesc">'+esc(g.desc)+'</p>'
    +'<p class="vg-gtag" style="font-size:12px;color:var(--ink-faint)">'+esc(g.meta)+' &middot; KJV</p>'
    +resume+'</div>'
    +'<div class="vg-card"><span class="vg-gkicker">Choose your pace</span>'
    +'<div class="vg-diff">'+ds+'</div>'
    +'<p class="vg-ddesc" id="vg-ddesc">'+DIFFS[S.diff].desc+'</p></div>'
    +'<div class="vg-btnrow"><button class="vg-btn" data-act="begin">'
    +(g.journey ? "Open the journey" : "Begin")+'</button></div>'
  );
}

function curStage(){ return games[S.gameId].stages[S.stage]; }

function vQuestion(){
  var g = games[S.gameId];
  var st = curStage();
  var q = st.questions[S.qi];
  var total = st.questions.length;
  var canHint = S.hintsLeft>0 && !S.hintOpen;
  var opts = q.options.map(function(o,i){
    return '<button class="vg-opt" data-opt="'+i+'">'+esc(o)+'</button>';
  }).join("");
  render(
    '<div class="vg-topbar"><button class="vg-back" data-act="hub">&larr; Study desk</button>'
    +'<span class="vg-stage">Stage '+(S.stage+1)+' &middot; '+(S.qi+1)+' of '+total+'</span></div>'
    +lamps(S.lamps,false)
    +'<div class="vg-card"><div class="vg-progress"><i style="width:'+Math.round(S.qi/total*100)+'%"></i></div>'
    +'<p class="vg-q">'+esc(q.q)+'</p>'
    +'<div class="vg-opts">'+opts+'</div>'
    +(S.hintOpen
      ? '<div class="vg-hintshow">The answer is found in <b>'+esc(q.ref)+'</b>.</div>'
      : (HINTS[S.diff]>0
        ? '<button class="vg-hintbtn" data-act="hint"'+(canHint?"":" disabled")+'>'
          +'<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 2a6 6 0 00-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0010 2z"/><path d="M8.5 17.5h3"/></svg>'
          +(canHint ? "Reveal the verse ("+S.hintsLeft+" left)" : "Hint used")+'</button>'
        : ""))
    +'</div>'
  );
}

function vPick(i){
  var st = curStage();
  var q = st.questions[S.qi];
  S.picked = i;
  if(i===q.a){ S.correct++; S.stageCorrect++; }
  else { S.lamps--; }
  S.screen = "feedback";
  vFeedback(i===q.a);
}

function vFeedback(ok){
  if(window.VGSound) window.VGSound[ok ? "right" : "wrong"]();
  var g = games[S.gameId];
  var st = curStage();
  var q = st.questions[S.qi];
  var total = st.questions.length;
  var opts = q.options.map(function(o,i){
    var cls = "vg-opt";
    if(i===q.a) cls += " right";
    else if(i===S.picked) cls += " wrong";
    return '<button class="'+cls+'" disabled>'+esc(o)+'</button>';
  }).join("");
  render(
    '<div class="vg-topbar"><span class="vg-stage">Stage '+(S.stage+1)+' &middot; '+(S.qi+1)+' of '+total+'</span></div>'
    +lamps(S.lamps, !ok)
    +'<div class="vg-card">'
    +'<div class="vg-verdict '+(ok?'good':'gentle')+'">'+(ok?"Well answered.":"Not quite.")+'</div>'
    +'<p class="vg-q" style="font-size:16px">'+esc(q.q)+'</p>'
    +'<div class="vg-opts">'+opts+'</div></div>'
    +'<div class="vg-card"><div class="vg-verse">&ldquo;'+esc(cleanVerse(q.verse))+'&rdquo;</div>'
    +'<div class="vg-ref">'+esc(q.ref)+' &middot; KJV</div>'
    +'<p class="vg-insight">'+esc(q.insight)+'</p></div>'
    +'<div class="vg-btnrow"><button class="vg-btn" data-act="next">'
    +(S.lamps<=0 ? "Rest" : (S.qi+1<total ? "Next" : "Seal this stage"))+'</button></div>'
  );
}

function vNext(){
  if(S.lamps<=0){ vOut(); return; }
  var st = curStage();
  S.qi++; S.picked=-1; S.hintOpen=false;
  if(S.qi < st.questions.length){ S.screen="question"; vQuestion(); }
  else{
    var p = prog(); var gp = gameProg(S.gameId);
    if(S.stage+1 > gp.stagesDone){ gp.stagesDone = S.stage+1; }
    gp.plays = (gp.plays||0)+1;
    saveProg(p);
    var gg = games[S.gameId];
    if(gg.bibleBreak && S.stage+1 < gg.stages.length && window.VG.bibleBreak){ window.VG.bibleBreak(); return; }
    S.screen = "complete"; vComplete();
  }
}

function vComplete(){
  if(window.VGSound) window.VGSound.chapter();
  var g = games[S.gameId];
  var more = S.stage+1 < g.stages.length;
  if(g.bibleBreak && !more && window.VG.bibleDone){ window.VG.bibleDone(S); }
  var sealVerse = g.seal || {ref:"Psalm 119:105", verse:"Thy word is a lamp unto my feet, and a light unto my path."};
  var big = g.bibleBreak ? "Chapter sealed." : "Stage sealed.";
  var sub = g.bibleBreak
    ? esc(g.title)+' is complete. '+S.correct+' of 20 answered well, and every answer opened the text.'
    : esc(curStage().name)+' is complete. '+S.stageCorrect+' of '+curStage().questions.length+' answered well, and every answer opened the text.';
  render(
    '<div class="vg-center"><div class="vg-seal"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.2 4.8 5.3.6-3.9 3.6 1 5.2-4.6-2.6-4.6 2.6 1-5.2L4.5 8.4l5.3-.6z"/></svg></div>'
    +'<div class="vg-big">'+big+'</div>'
    +'<p>'+sub+'</p>'
    +'<div class="vg-card" style="text-align:left"><div class="vg-verse">&ldquo;'+esc(cleanVerse(sealVerse.verse))+'&rdquo;</div>'
    +'<div class="vg-ref">'+esc(sealVerse.ref)+' &middot; KJV</div></div>'
    +'<div class="vg-btnrow" style="justify-content:center">'
    +(more ? '<button class="vg-btn" data-act="nextStage">Enter stage '+(S.stage+2)+'</button>' : "")
    +'<button class="vg-btn ghost" data-act="hub">Study desk</button>'
    +'</div></div>'
  );
}

function vNextStage(){
  S.stage++; S.qi=0; S.picked=-1; S.lamps=3;
  S.hintsLeft = HINTS[S.diff]; S.hintOpen=false;
  S.stageCorrect=0; S.screen="question"; vQuestion();
}

function vOut(){
  render(
    '<div class="vg-center"><div style="margin:10px 0">'+lamps(0,false)+'</div>'
    +'<div class="vg-big">The lamps have gone out.</div>'
    +'<p>No shame in it. Even the wise rest and return. This stage will be here when you are ready, and the text has not moved.</p>'
    +'<div class="vg-btnrow" style="justify-content:center">'
    +'<button class="vg-btn" data-act="retryStage">Return to this stage</button>'
    +'<button class="vg-btn ghost" data-act="hub">Study desk</button>'
    +'</div></div>'
  );
}

function vRetry(){
  S.lamps=3; S.qi=0; S.picked=-1;
  S.hintsLeft = HINTS[S.diff]; S.hintOpen=false;
  S.stageCorrect=0; S.screen="question"; vQuestion();
}

/* ---------- journey ---------- */
function vJourney(){
  var g = games[S.gameId];
  var p = gameProg(g.id);
  var items = g.journey.map(function(j, i){
    var locked = i > p.jDone;
    var done = i < p.jDone;
    var cls = "vg-jstage" + (locked?" locked":"") + (done?" done":"");
    return '<button class="'+cls+'" data-j="'+i+'"'+(locked?" disabled":"")+'>'
      +'<span class="vg-jdot">'+(done?"&#10003;":(i+1))+'</span>'
      +'<span><h4>'+esc(j.title)+'</h4><p>'+esc(j.teaser)+'</p>'
      +'<span class="vg-jtag">'+(done?"Walked":(locked?"A quiz gate seals the way":"Open"))+' &middot; '+esc(j.ref)+'</span></span></button>';
  }).join("");
  render(
    '<div class="vg-topbar"><button class="vg-back" data-act="hub">&larr; Study desk</button>'
    +'<span class="vg-stage">'+esc(g.kicker)+'</span></div>'
    +'<div class="vg-card"><div class="vg-gkicker">'+esc(g.kicker)+'</div>'
    +'<h3 style="font-family:var(--serif);font-size:24px;margin:0 0 8px">'+esc(g.title)+'</h3>'
    +'<p class="vg-gdesc">'+esc(g.desc)+'</p></div>'
    +items
    +'<p class="vg-shelf-note" style="margin-top:14px">Each stage ends at a Scripture quiz gate. Pass the gate to walk on.</p>'
  );
}

function vStory(){
  var g = games[S.gameId];
  var j = g.journey[S.jstage];
  var paras = j.text.split("\n\n").map(function(p){ return "<p>"+esc(p)+"</p>"; }).join("");
  var art = j.img ? '<div class="vg-stage-art"><img src="'+j.img+'"></div>' : "";
  render(
    '<div class="vg-topbar"><button class="vg-back" data-act="journey">&larr; The journey</button>'
    +'<span class="vg-stage">Stage '+(S.jstage+1)+' of '+g.journey.length+'</span></div>'
    +art
    +'<div class="vg-card"><div class="vg-gkicker">'+esc(j.ref)+'</div>'
    +'<h3 style="font-family:var(--serif);font-size:22px;margin:0 0 12px">'+esc(j.title)+'</h3>'
    +'<div class="vg-story">'+paras+'</div></div>'
    +'<div class="vg-btnrow"><button class="vg-btn" data-act="gate">Face the quiz gate</button></div>'
  );
}

function vGate(){
  S.screen = "gate";
  var g = games[S.gameId];
  var j = g.journey[S.jstage];
  var q = j.gate[S.gateQi];
  var total = j.gate.length;
  var opts = q.options.map(function(o,i){
    return '<button class="vg-opt" data-opt="'+i+'">'+esc(o)+'</button>';
  }).join("");
  render(
    '<div class="vg-topbar"><button class="vg-back" data-act="journey">&larr; The journey</button>'
    +'<span class="vg-stage">Quiz gate &middot; '+(S.gateQi+1)+' of '+total+'</span></div>'
    +lamps(S.lamps,false)
    +'<div class="vg-card"><p class="vg-q">'+esc(q.q)+'</p>'
    +'<div class="vg-opts">'+opts+'</div></div>'
  );
}

function vGatePick(i){
  var g = games[S.gameId];
  var j = g.journey[S.jstage];
  var q = j.gate[S.gateQi];
  if(i===q.a){
    S.gateQi++;
    if(S.gateQi < j.gate.length){ vGateFeedback(true, q); }
    else{
      var p = prog(); var gp = gameProg(g.id);
      if(S.jstage+1 > gp.jDone) gp.jDone = S.jstage+1;
      saveProg(p);
      vGateFeedback(true, q, true);
    }
  }else{
    S.lamps--;
    if(S.lamps<=0){ vOutJourney(); return; }
    vGateFeedback(false, q);
  }
}

function vGateFeedback(ok, q, finished){
  if(window.VGSound) window.VGSound[ok ? "right" : "wrong"]();
  var opts = q.options.map(function(o,i){
    var cls = "vg-opt";
    if(i===q.a) cls += " right";
    else if(!ok && i!==q.a && false) cls += "";
    return '<button class="'+cls+'" disabled>'+esc(o)+'</button>';
  }).join("");
  render(
    '<div class="vg-topbar"><span class="vg-stage">Quiz gate</span></div>'
    +lamps(S.lamps, !ok)
    +'<div class="vg-card">'
    +'<div class="vg-verdict '+(ok?'good':'gentle')+'">'+(ok?"The gate opens.":"Not quite.")+'</div>'
    +'<div class="vg-opts">'+opts+'</div></div>'
    +'<div class="vg-card"><div class="vg-verse">&ldquo;'+esc(cleanVerse(q.verse))+'&rdquo;</div>'
    +'<div class="vg-ref">'+esc(q.ref)+' &middot; KJV</div>'
    +'<p class="vg-insight">'+esc(q.insight)+'</p></div>'
    +'<div class="vg-btnrow"><button class="vg-btn" data-act="gateNext">'
    +(finished ? "Walk on" : (ok ? "Next" : "Try again"))+'</button></div>'
  );
  S._gateFinished = !!finished;
  S._gateOk = ok;
}

function vGateNext(){
  if(S._gateFinished){ S.lamps=3; S.gateQi=0; S.screen="journey"; vJourney(); return; }
  if(S._gateOk){ vGate(); }
  else { vGate(); }
}

function vOutJourney(){
  render(
    '<div class="vg-center"><div style="margin:10px 0">'+lamps(0,false)+'</div>'
    +'<div class="vg-big">The lamps have gone out.</div>'
    +'<p>No shame in it. Read the passage again slowly, then face the gate once more. The story will wait.</p>'
    +'<div class="vg-btnrow" style="justify-content:center">'
    +'<button class="vg-btn" data-act="retryGate">Face the gate again</button>'
    +'<button class="vg-btn ghost" data-act="journey">The journey</button>'
    +'</div></div>'
  );
}

/* ---------- today's portion ---------- */
function vDaily(){
  var pool = allQuestions();
  if(!pool.length){ vHub(); return; }
  var now = new Date();
  var day = Math.floor(now.getTime()/86400000);
  var pick = pool[day % pool.length];
  var q = pick.q;
  S = {gameId:pick.game, diff:"seeker", screen:"daily", lamps:3, picked:-1, _daily:q};
  var opts = q.options.map(function(o,i){
    return '<button class="vg-opt" data-opt="'+i+'">'+esc(o)+'</button>';
  }).join("");
  render(
    '<div class="vg-topbar"><button class="vg-back" data-act="hub">&larr; Study desk</button>'
    +'<span class="vg-stage">Today&rsquo;s portion</span></div>'
    +'<div class="vg-card"><div class="vg-gkicker">One question &middot; no streak &middot; no guilt</div>'
    +'<p class="vg-q">'+esc(q.q)+'</p>'
    +'<div class="vg-opts">'+opts+'</div></div>'
  );
}
function vDailyPick(i){
  var q = S._daily;
  var ok = i===q.a;
  if(window.VGSound) window.VGSound[ok ? "right" : "wrong"]();
  var opts = q.options.map(function(o,j){
    var cls = "vg-opt";
    if(j===q.a) cls += " right";
    else if(j===i) cls += " wrong";
    return '<button class="'+cls+'" disabled>'+esc(o)+'</button>';
  }).join("");
  render(
    '<div class="vg-topbar"><button class="vg-back" data-act="hub">&larr; Study desk</button>'
    +'<span class="vg-stage">Today&rsquo;s portion</span></div>'
    +'<div class="vg-card"><div class="vg-verdict '+(ok?'good':'gentle')+'">'
    +(ok?"A good portion for today.":"A portion to sit with today.")+'</div>'
    +'<div class="vg-opts">'+opts+'</div></div>'
    +'<div class="vg-card"><div class="vg-verse">&ldquo;'+esc(cleanVerse(q.verse))+'&rdquo;</div>'
    +'<div class="vg-ref">'+esc(q.ref)+' &middot; KJV</div>'
    +'<p class="vg-insight">'+esc(q.insight)+'</p></div>'
    +'<div class="vg-btnrow"><button class="vg-btn ghost" data-act="hub">Study desk</button></div>'
  );
}

/* ---------- actions ---------- */
function act(name, arg){
  if(name==="hub"){ vHub(); return; }
  if(!S) return;
  if(games[S.gameId] && games[S.gameId].mode === "whosaidit"){ wsiAct(name); return; }
  if(games[S.gameId] && games[S.gameId].mode === "solomon"){ solAct(name); return; }
  switch(name){
    case "begin":
      S.hintsLeft = HINTS[S.diff]; S.hintOpen=false;
      S.stage=0; S.qi=0; S.lamps=3; S.picked=-1; S.stageCorrect=0;
      S._t0 = Date.now(); S._hintsUsed = 0;
      if(games[S.gameId].journey){ S.screen="journey"; vJourney(); }
      else { S.screen="question"; vQuestion(); }
      break;
    case "hint":
      if(S.hintsLeft>0 && !S.hintOpen){ S.hintsLeft--; S._hintsUsed=(S._hintsUsed||0)+1; S.hintOpen=true; vQuestion(); }
      break;
    case "next": vNext(); break;
    case "nextStage": vNextStage(); break;
    case "retryStage": vRetry(); break;
    case "journey": S.lamps=3; S.gateQi=0; S.screen="journey"; vJourney(); break;
    case "gate": S.lamps=3; S.gateQi=0; vGate(); break;
    case "gateNext": vGateNext(); break;
    case "retryGate": S.lamps=3; vGate(); break;
    case "daily": vDaily(); break;
  }
}

function openGame(id){
  if(!games[id] || !games[id].playable) return;
  S = newSession(id);
  S.screen = "intro";
  if(games[id].mode === "whosaidit"){ wsiHub(); return; }
  if(games[id].mode === "solomon"){ solHub(); return; }
  vIntro();
}

/* transient game: played through the engine but kept out of the hub registry
   (used for Whole Counsel chapters) */
function openTransient(g){
  g.id = "__bible"; g.playable = true;
  games["__bible"] = g;
  openGame("__bible");
}

/* delegated clicks */
document.addEventListener("click", function(e){
  var t = e.target;
  while(t && t!==document){
    if(t.getAttribute){
      var a = t.getAttribute("data-act");
      if(a){
        if(window.VGSound){
          if(a==="begin") window.VGSound.confirm();
          else if(a!=="mute") window.VGSound.click();
        }
        act(a); return;
      }
      var g = t.getAttribute("data-game");
      if(g){ if(window.VGSound) window.VGSound.click(); openGame(g); return; }
      var j = t.getAttribute("data-j");
      if(j!==null && S){ if(window.VGSound) window.VGSound.click(); S.jstage = parseInt(j,10); vStory(); return; }
      var df = t.getAttribute("data-diff");
      if(df!==null && S){ if(window.VGSound) window.VGSound.confirm(); S.diff = df; vIntro(); return; }
      var lv = t.getAttribute("data-level");
      if(lv!==null && S){ if(window.VGSound) window.VGSound.click(); wsiOpenLevel(parseInt(lv,10)); return; }
      var sc2 = t.getAttribute("data-scroll");
      if(sc2!==null && S && games[S.gameId] && games[S.gameId].mode==="solomon"){ if(window.VGSound) window.VGSound.click(); solOpenScroll(parseInt(sc2,10)); return; }
      var cs = t.getAttribute("data-case");
      if(cs!==null && S && games[S.gameId] && games[S.gameId].mode==="solomon"){ if(window.VGSound) window.VGSound.click(); solOpenCase(parseInt(cs,10)); return; }
      var o = t.getAttribute("data-opt");
      if(o!==null && S){
        var i = parseInt(o,10);
        if(S.screen==="question") vPick(i);
        else if(S.screen==="gate") vGatePick(i);
        else if(S.screen==="daily") vDailyPick(i);
        else if(S.screen==="wsiQ") wsiPick(i);
        else if(S.screen==="solQ") solPick(i);
        return;
      }
    }
    t = t.parentNode;
  }
});

/* ---------- who said it: campaign mode (own flow, own rules) ----------
   10 levels x 50 quotes, played as ten rounds of five. Five speaker
   choices per question, 10 points per correct answer, no penalties.
   Completing a level unlocks the next. Progress persists via the
   engine store: unlocked level, per-level best, campaign total. */
function wsiGame(){ return games[S.gameId]; }
var wsiP = null;
function wsiProg(){
  if(!wsiP){
    wsiP = prog();
    if(!wsiP["who-said-it"] || !wsiP["who-said-it"].wsi)
      wsiP["who-said-it"] = {wsi:{unlocked:1, best:{}, total:0, plays:0}};
  }
  return wsiP["who-said-it"].wsi;
}
function wsiSave(){ if(wsiP) saveProg(wsiP); }
function wsiTotal(w){
  var t = 0;
  for(var k in w.best){ if(w.best.hasOwnProperty(k)) t += w.best[k]; }
  return t;
}
function wsiLockup(){
  return '<div class="wsi-lockup">'
    +'<a href="https://verseriver.com" target="_blank" rel="noopener" aria-label="Verse River">'
    +'<img src="img/vr-logo.jpg" alt="Verse River logo"></a>'
    +'<span class="wsi-lockup-t">Product of Verse River<br>'
    +'<a href="https://verseriver.com" target="_blank" rel="noopener">See more at verseriver.com</a></span>'
    +'</div>';
}
function wsiHub(){
  var g = wsiGame();
  var w = wsiProg();
  S.screen = "wsiHub";
  var cards = g.levels.map(function(L, i){
    var n = i + 1;
    var locked = n > w.unlocked;
    var best = w.best[n];
    return '<button class="wsi-lvl'+(locked?' locked':'')+'" data-level="'+n+'"'+(locked?' disabled':'')+'>'
      +'<b>Level '+n+'</b><span>'+esc(L.name)+'</span>'
      +'<em>'+(locked ? 'Locked' : (best !== undefined ? 'Best '+best+' / 500' : 'Open'))+'</em></button>';
  }).join("");
  render(
    '<div class="vg-topbar"><button class="vg-back" data-act="hub">&larr; Study desk</button>'
    +'<span class="vg-stage">Who Said It</span></div>'
    +wsiLockup()
    +'<div class="vg-card"><div class="vg-gkicker">'+esc(g.kicker)+'</div>'
    +'<h3 style="font-family:var(--serif);font-size:24px;margin:0 0 8px">Who Said It</h3>'
    +'<p class="vg-gdesc">'+esc(g.desc)+'</p>'
    +'<p class="vg-gtag" style="font-size:12px;color:var(--ink-faint)">'+esc(g.meta)+' &middot; KJV</p>'
    +'<p class="wsi-total">Campaign total: <b>'+wsiTotal(w)+'</b> of 5,000</p></div>'
    +'<div class="wsi-levels">'+cards+'</div>'
    +'<p class="vg-shelf-note">Finish a level to unlock the next. Ten points for every voice named aright; no penalties.</p>'
  );
}
function wsiOpenLevel(n){
  var w = wsiProg();
  if(n < 1 || n > 10 || n > w.unlocked) return;
  S.lvl = n; S.round = 0; S.qi = 0;
  S.score = 0; S.roundScore = 0; S.picked = -1;
  wsiQ();
}
function wsiQ(){
  S.screen = "wsiQ";
  var L = wsiGame().levels[S.lvl-1];
  var q = L.questions[S.round*5 + S.qi];
  var longCls = q.q.length > 160 ? " wsi-long" : "";
  var opts = q.options.map(function(o, i){
    return '<button class="vg-opt wsi-opt" data-opt="'+i+'">'+esc(o)+'</button>';
  }).join("");
  render(
    '<div class="wsi-screen"><div class="vg-topbar"><button class="vg-back" data-act="wsiLevels">&larr; Levels</button>'
    +'<span class="vg-stage">Level '+S.lvl+' &middot; Round '+(S.round+1)+' of 10 &middot; '+(S.qi+1)+' of 5</span></div>'
    +'<div class="wsi-score">Level score <b>'+S.score+'</b> &middot; Round <b>'+S.roundScore+'</b> of 50</div>'
    +'<div class="vg-card wsi-qcard'+longCls+'"><p class="vg-q wsi-q">&ldquo;'+esc(q.q)+'&rdquo;</p>'
    +'<p class="wsi-ask">Who said it?</p>'
    +'<div class="vg-opts wsi-opts">'+opts+'</div></div></div>'
  );
}
function wsiPick(i){
  var q = wsiGame().levels[S.lvl-1].questions[S.round*5 + S.qi];
  var ok = i === q.a;
  S.picked = i;
  if(ok){ S.score += 10; S.roundScore += 10; }
  S.screen = "wsiFb";
  wsiFeedback(ok);
}
function wsiFeedback(ok){
  if(window.VGSound) window.VGSound[ok ? "right" : "wrong"]();
  var q = wsiGame().levels[S.lvl-1].questions[S.round*5 + S.qi];
  var opts = q.options.map(function(o, i){
    var cls = "vg-opt wsi-opt";
    if(i===q.a) cls += " right";
    else if(i===S.picked) cls += " wrong";
    return '<button class="'+cls+'" disabled>'+esc(o)+'</button>';
  }).join("");
  var lastQ = S.qi === 4, lastR = S.round === 9;
  render(
    '<div class="wsi-screen"><div class="vg-topbar"><span class="vg-stage">Level '+S.lvl
    +' &middot; Round '+(S.round+1)+' of 10 &middot; '+(S.qi+1)+' of 5</span></div>'
    +'<div class="vg-card"><div class="vg-verdict '+(ok?'good':'gentle')+'">'
    +(ok?'Well answered. +10':'Not quite.')+'</div>'
    +'<p class="vg-q wsi-q">&ldquo;'+esc(q.q)+'&rdquo;</p>'
    +'<div class="vg-opts wsi-opts">'+opts+'</div></div>'
    +'<div class="vg-card"><div class="vg-ref">'+esc(q.ref)+' &middot; KJV</div></div>'
    +'<div class="vg-btnrow"><button class="vg-btn" data-act="wsiNext">'
    +(lastR && lastQ ? 'Finish level' : (lastQ ? 'Next round' : 'Next'))+'</button></div></div>'
  );
}
function wsiNext(){
  S.qi++; S.picked = -1;
  if(S.qi < 5){ wsiQ(); return; }
  wsiRoundDone();
}
function wsiRoundDone(){
  S.screen = "wsiRd";
  var lastR = S.round === 9;
  render(
    '<div class="wsi-screen"><div class="vg-center">'
    +'<div class="vg-big">Round '+(S.round+1)+' complete</div>'
    +'<p><b>'+S.roundScore+'</b> of 50 points &middot; Level score <b>'+S.score+'</b> of 500</p>'
    +'<div class="vg-btnrow" style="justify-content:center">'
    +(lastR
      ? '<button class="vg-btn" data-act="wsiFinish">See the level result</button>'
      : '<button class="vg-btn" data-act="wsiNextRound">Begin round '+(S.round+2)+'</button>')
    +'</div></div></div>'
  );
}
function wsiFinish(){
  var w = wsiProg();
  var lvl = S.lvl, score = S.score;
  if(score > (w.best[lvl] || 0)) w.best[lvl] = score;
  if(lvl < 10 && w.unlocked < lvl + 1) w.unlocked = lvl + 1;
  w.plays = (w.plays || 0) + 1;
  w.total = wsiTotal(w);
  wsiSave();
  S.screen = "wsiDone";
  var msg = lvl < 10
    ? 'Level '+(lvl+1)+' is now open.'
    : 'The whole campaign stands complete. Every voice, named.';
  render(
    '<div class="wsi-screen"><div class="vg-center">'
    +'<div class="vg-seal"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.2 4.8 5.3.6-3.9 3.6 1 5.2-4.6-2.6-4.6 2.6 1-5.2L4.5 8.4l5.3-.6z"/></svg></div>'
    +'<div class="vg-big">Level '+lvl+' complete</div>'
    +'<p><b>'+score+'</b> of 500 &middot; Best <b>'+w.best[lvl]+'</b>'
    +' &middot; Campaign <b>'+w.total+'</b> of 5,000</p>'
    +'<p>'+msg+'</p>'
    +'<div class="vg-btnrow" style="justify-content:center">'
    +(lvl < 10 && lvl + 1 <= w.unlocked
      ? '<button class="vg-btn" data-act="wsiEnterNext">Enter level '+(lvl+1)+'</button>' : '')
    +'<button class="vg-btn" data-act="wsiReplay">Replay level '+lvl+'</button>'
    +'<button class="vg-btn ghost" data-act="wsiLevels">Levels</button>'
    +'</div></div></div>'
  );
}
function wsiAct(name){
  switch(name){
    case "wsiLevels": wsiHub(); break;
    case "wsiNext": wsiNext(); break;
    case "wsiNextRound": S.round++; S.qi = 0; S.roundScore = 0; S.picked = -1; wsiQ(); break;
    case "wsiFinish": wsiFinish(); break;
    case "wsiReplay": wsiOpenLevel(S.lvl); break;
    case "wsiEnterNext": wsiOpenLevel(S.lvl + 1); break;
  }
}

/* ---------- king solomon: judgment series (own flow, own rules) ----------
   30 cases in 3 scrolls of 10. Sit as judge; three judgments per case.
   Scroll One is gentle: no failure effects. Scrolls Two and Three: a wrong
   judgment shows its consequence in the story, costs 5 wisdom and 1
   standing, and the player must memorize the proverb word for word to
   appeal and retry. Progress persists via the engine store. */
var SOL_SCROLL_META = [
  null,
  {kicker:"The first scroll", title:"Cases of the court",
   desc:"Cases open in order. Complete a judgment to break the next seal."},
  {kicker:"The second scroll", title:"Training in Proverbs",
   desc:"The easy answer is gone. Test flattering counsel, partial truths, and legal disguises. A wrong judgment now carries a cost."},
  {kicker:"The third scroll", title:"Wisdom in the Gates",
   desc:"Judge matters that can steady a kingdom or wound a nation. Every counsel carries weight."}
];
function solGame(){ return games[S.gameId]; }
var solP = null;
function solProg(){
  if(!solP){
    solP = prog();
    if(!solP["king-solomon"] || !solP["king-solomon"].sol)
      solP["king-solomon"] = {sol:{score:0, standing:5, plays:0,
        done:{1:[],2:[],3:[]}, unlocked:{1:1,2:0,3:0}}};
  }
  return solP["king-solomon"].sol;
}
function solSave(){ if(solP) saveProg(solP); }
function solScrollOf(id){ return id > 20 ? 3 : id > 10 ? 2 : 1; }
function solCase(id){
  var sc = solScrollOf(id);
  return solGame().scrolls[sc-1].cases[id - (sc-1)*10 - 1];
}
function solScrollOpen(w, sc){
  if(sc === 1) return true;
  if(sc === 2) return w.done[1].length === 10;
  return w.done[2].length === 10;
}
function solSyncUnlocks(w){
  if(w.done[1].length === 10 && w.unlocked[2] < 11) w.unlocked[2] = 11;
  if(w.done[2].length === 10 && w.unlocked[3] < 21) w.unlocked[3] = 21;
}
function solDisplayed(c){
  var sc = solScrollOf(c.id);
  if(sc === 1) return c.options;
  var turn = c.id % 3;
  return c.options.slice(turn).concat(c.options.slice(0, turn));
}
function solProverbHtml(anchor){
  return '<blockquote class="sol-proverb"><p>&ldquo;'+esc(anchor.quote)+'&rdquo;</p>'
    +'<cite>'+esc(anchor.ref)+' &middot; KJV</cite></blockquote>';
}
function solHub(){
  var w = solProg(); solSyncUnlocks(w); solSave();
  S.screen = "solHub";
  var cards = [1,2,3].map(function(sc){
    var m = SOL_SCROLL_META[sc];
    var open = solScrollOpen(w, sc);
    var done = w.done[sc].length;
    var state = !open ? "Sealed" : (done === 10 ? "Complete" : "Open");
    return '<button class="sol-scroll'+(open?'':' locked')+'" data-scroll="'+sc+'"'+(open?'':' disabled')+'>'
      +'<span class="sol-scroll-k">'+esc(m.kicker)+'</span>'
      +'<strong>'+esc(m.title)+'</strong>'
      +'<small>'+esc(m.desc)+'</small>'
      +'<span class="sol-scroll-state">'+state+(open && done<10 ? ' · '+done+' of 10' : '')+'</span></button>';
  }).join("");
  render(
    '<div class="sol-screen"><div class="vg-topbar"><button class="vg-back" data-act="hub">&larr; Study desk</button>'
    +'<span class="vg-stage">King Solomon</span></div>'
    +'<div class="vg-center"><h2 class="sol-title">King Solomon</h2>'
    +'<p class="sol-sub">Three scrolls. Thirty causes. Sit as judge, and let the proverbs train your ear.</p>'
    +'<p class="sol-score">Wisdom <b>'+w.score+'</b> &middot; Standing <b>'+w.standing+'</b></p></div>'
    +'<div class="sol-scrolls">'+cards+'</div>'
    +wsiLockup()
    +'</div>'
  );
}
function solOpenScroll(sc){
  var w = solProg(); solSyncUnlocks(w);
  if(!solScrollOpen(w, sc)) return;
  S.scroll = sc; S.screen = "solCases";
  var first = (sc-1)*10 + 1, last = sc*10;
  var tiles = [];
  for(var id = first; id <= last; id++){
    var c = solCase(id);
    var done = w.done[sc].indexOf(id) >= 0;
    var locked = id > w.unlocked[sc];
    var ap = S.appeals && S.appeals[id];
    tiles.push('<button class="sol-case'+(done?' done':'')+'" data-case="'+id+'"'+(locked?' disabled':'')+'>'
      +'<span class="sol-case-n">'+(done?'\u2713':String(id).padStart(2,"0"))+'</span>'
      +'<span class="sol-case-t"><span class="sol-case-meta">Case '+String(id).padStart(2,"0")+' &middot; '+(c.kind==="SCRIPTURE"?"Scripture":"Story")+'</span>'
      +'<strong>'+esc(c.title)+'</strong></span>'
      +'<span class="sol-case-s'+(ap?' appeal':'')+'">'+(ap?'Appeal':(locked?'\uD83D\uDD12':'Open'))+'</span></button>');
  }
  var m = SOL_SCROLL_META[sc];
  render(
    '<div class="sol-screen"><div class="vg-topbar"><button class="vg-back" data-act="solHub">&larr; Scrolls</button>'
    +'<span class="vg-stage">'+esc(m.kicker)+'</span></div>'
    +'<div class="vg-center"><h2 class="sol-title">'+esc(m.title)+'</h2>'
    +'<p class="sol-score">Wisdom <b>'+w.score+'</b> &middot; Standing <b>'+w.standing+'</b></p></div>'
    +'<div class="sol-cases">'+tiles.join("")+'</div>'
    +wsiLockup()
    +'</div>'
  );
}
function solOpenCase(id){
  var w = solProg();
  var sc = solScrollOf(id);
  if(id > w.unlocked[sc]) return;
  S.caseId = id; S.scroll = sc; S.picked = -1; S.screen = "solQ";
  if(!S.appeals) S.appeals = {};
  var c = solCase(id);
  var opts = solDisplayed(c);
  var btns = opts.map(function(o, i){
    return '<button class="vg-opt sol-opt" data-opt="'+i+'"><b>'+String.fromCharCode(65+i)+'</b><span>'+esc(o.text)+'</span></button>';
  }).join("");
  render(
    '<div class="sol-screen"><div class="vg-topbar"><button class="vg-back" data-act="solCases">&larr; Cases</button>'
    +'<span class="vg-stage">Scroll '+sc+' &middot; Case '+String(id).padStart(2,"0")+'</span></div>'
    +'<div class="sol-casegrid"><div class="sol-img"><img src="'+c.image+'" alt="'+esc(c.alt)+'">'
    +'<div class="sol-cap"><span>Case '+String(id).padStart(2,"0")+'</span><strong>'+esc(c.setting)+'</strong></div></div>'
    +'<div class="sol-paper"><div class="sol-tag">'+(c.kind==="SCRIPTURE"?"Scripture &middot; "+esc(c.reference):"Original story &middot; Not Scripture")+'</div>'
    +'<h3>'+esc(c.title)+'</h3><p class="sol-story">'+esc(c.story)+'</p>'
    +'<p class="sol-q">'+esc(c.question)+'</p>'
    +'<div class="vg-opts">'+btns+'</div></div></div>'
    +'<div id="solReveal"></div></div>'
  );
  var ap = S.appeals[id];
  if(sc > 1 && ap){
    var chosen = c.options[ap.chosenIdx], wise = c.options.filter(function(o){return o.correct;})[0];
    solDiscipline(c, chosen, wise, ap, true);
  }
}
function solPick(i){
  var c = solCase(S.caseId);
  var sc = S.scroll;
  var w = solProg();
  var turn = sc === 1 ? 0 : c.id % 3;
  var ci = (turn + i) % 3;
  var chosen = c.options[ci];
  var wise = c.options.filter(function(o){return o.correct;})[0];
  var already = w.done[sc].indexOf(c.id) >= 0;
  S.picked = i;
  if(window.VGSound) window.VGSound[chosen.correct ? "right" : "wrong"]();
  if(sc === 1){
    if(!already){
      w.done[sc].push(c.id);
      w.score += chosen.correct ? 10 : 3;
      var end = 10;
      w.unlocked[sc] = Math.max(w.unlocked[sc], Math.min(end, c.id + 1));
      solSyncUnlocks(w); solSave();
    }
    solGentle(c, chosen, wise, already);
    return;
  }
  if(already){ solReview(c, chosen, wise); return; }
  if(chosen.correct){
    w.done[sc].push(c.id);
    w.score += sc === 3 ? 18 : 14;
    var last = sc === 3 ? 30 : 20;
    w.unlocked[sc] = Math.max(w.unlocked[sc], Math.min(last, c.id + 1));
    solSyncUnlocks(w); solSave();
    solStrong(c, chosen, wise);
    return;
  }
  if(!S.appeals) S.appeals = {};
  S.appeals[c.id] = {chosenIdx: ci, granted: false};
  w.score -= 5;
  w.standing = Math.max(0, w.standing - 1);
  solSave();
  solDiscipline(c, chosen, wise, S.appeals[c.id], false);
}
function solRevealHead(c, verdict, verdictCls){
  return '<div class="vg-card sol-reveal"><div class="vg-verdict '+verdictCls+'">'+verdict+'</div>';
}
function solGentle(c, chosen, wise, already){
  S.screen = "solFb";
  var wiserLine = chosen.correct ? '' : '<p class="vg-insight"><strong>The wiser judgment:</strong> '+esc(wise.text)+'</p>';
  var last = c.id === 10;
  render(
    '<div class="sol-screen"><div class="vg-topbar"><span class="vg-stage">Scroll 1 &middot; Case '+String(c.id).padStart(2,"0")+'</span></div>'
    +solRevealHead(c, chosen.correct ? 'A wise judgment' : 'Wisdom corrects the court', chosen.correct ? 'good' : 'gentle')
    +'<p class="vg-insight">'+esc(chosen.feedback)+'</p>'+wiserLine
    +solProverbHtml(wise.anchor)+'</div>'
    +'<div class="vg-btnrow"><button class="vg-btn ghost" data-act="solCases">Cases</button>'
    +'<button class="vg-btn" data-act="solNext">'+(last ? 'Complete Scroll One' : 'Open next case')+'</button></div></div>'
  );
}
function solStrong(c, chosen, wise){
  S.screen = "solFb";
  var last = c.id === 20 || c.id === 30;
  render(
    '<div class="sol-screen"><div class="vg-topbar"><span class="vg-stage">Scroll '+S.scroll+' &middot; Case '+String(c.id).padStart(2,"0")+'</span></div>'
    +solRevealHead(c, 'A discerning judgment', 'good')
    +'<p class="vg-insight">'+esc(chosen.feedback)+'</p>'
    +solProverbHtml(wise.anchor)+'</div>'
    +'<div class="vg-btnrow"><button class="vg-btn ghost" data-act="solCases">Cases</button>'
    +'<button class="vg-btn" data-act="solNext">'+(last ? 'Complete Scroll '+(S.scroll===2?'Two':'Three') : 'Open next case')+'</button></div></div>'
  );
}
function solReview(c, chosen, wise){
  S.screen = "solFb";
  var wiserLine = chosen.correct ? '' : '<p class="vg-insight"><strong>The wiser judgment:</strong> '+esc(wise.text)+'</p>';
  render(
    '<div class="sol-screen"><div class="vg-topbar"><span class="vg-stage">Scroll '+S.scroll+' &middot; Case '+String(c.id).padStart(2,"0")+'</span></div>'
    +solRevealHead(c, chosen.correct ? 'A discerning judgment' : 'Review the wiser judgment', chosen.correct ? 'good' : 'gentle')
    +'<p class="vg-insight">'+esc(chosen.feedback)+'</p>'+wiserLine
    +solProverbHtml(wise.anchor)+'</div>'
    +'<div class="vg-btnrow"><button class="vg-btn ghost" data-act="solCases">Cases</button>'
    +'<button class="vg-btn" data-act="solNext">'+((c.id===10||c.id===20||c.id===30) ? 'Scroll result' : 'Open next case')+'</button></div></div>'
  );
}
function solDiscipline(c, chosen, wise, appeal, reentered){
  S.screen = "solFb";
  var panel = '<section class="sol-appeal" id="solAppealPanel"><h3>Memorize the proverb.</h3>'
    +'<p>Learn the verse, then fill in the missing words. When you remember it correctly, you can judge the case again.</p>'
    +'<div class="sol-study">'+solProverbHtml(wise.anchor)+'</div>'
    +'<button class="vg-btn" data-act="solBeginAppeal">Practice the verse</button>'
    +'<div class="sol-note" id="solAppealNote"></div></section>';
  render(
    '<div class="sol-screen"><div class="vg-topbar"><span class="vg-stage">Scroll '+S.scroll+' &middot; Case '+String(c.id).padStart(2,"0")+'</span></div>'
    +solRevealHead(c, 'The court bears the cost', 'wrong')
    +'<div class="sol-consequence"><strong>What followed</strong><p>'+esc(c.consequence)+'</p></div>'
    +'<div class="sol-loss"><span class="sol-chip">Wisdom -5</span><span class="sol-chip">Standing -1</span></div>'
    +'<p class="vg-insight">'+esc(chosen.feedback)+'</p>'
    +'<p class="vg-insight"><strong>The wiser judgment:</strong> '+esc(wise.text)+'</p>'
    +solProverbHtml(wise.anchor)+'</div>'
    +panel
    +'<div class="vg-btnrow"><button class="vg-btn ghost" data-act="solCases">Cases</button></div></div>'
  );
  if(appeal.granted) solGrantedAppeal();
  else if(reentered) solBeginAppeal();
}
function solGrantedAppeal(){
  var panel = document.getElementById("solAppealPanel");
  if(!panel) return;
  panel.innerHTML = '<h3>Verse memorized</h3>'
    +'<p>You remembered the proverb correctly. Now judge the case again.</p>'
    +'<button class="vg-btn" data-act="solRetryAppeal">Retry this judgment</button>';
}
function solBlanks(quote){
  var parts = quote.split(/\s+/), eligible = [];
  parts.forEach(function(word, i){
    if(i > 0 && word.replace(/[^A-Za-z\u2019']/g, "").length > 3) eligible.push(i);
  });
  var take = Math.min(5, Math.max(3, Math.ceil(parts.length / 5)));
  var step = Math.max(1, Math.floor(eligible.length / take));
  var chosen = [];
  for(var i = 0; i < eligible.length && chosen.length < take; i += step) chosen.push(eligible[i]);
  return {parts: parts, chosen: chosen};
}
function solBeginAppeal(){
  var c = solCase(S.caseId);
  var wise = c.options.filter(function(o){return o.correct;})[0];
  var b = solBlanks(wise.anchor.quote);
  var line = b.parts.map(function(word, i){
    if(b.chosen.indexOf(i) < 0) return esc(word);
    var lead = (word.match(/^[^A-Za-z]*/) || [""])[0];
    var tail = (word.match(/[^A-Za-z\u2019']*$/) || [""])[0];
    return esc(lead)+'<input class="sol-blank" data-word="'+i+'" aria-label="Missing word" autocomplete="off">'+esc(tail);
  }).join(" ");
  var panel = document.getElementById("solAppealPanel");
  if(!panel) return;
  panel.innerHTML = '<h3>Remember the verse</h3><p>Fill in every missing word.</p>'
    +'<div class="sol-memory">'+line+'</div>'
    +'<button class="vg-btn" data-act="solCheckAppeal">Check my verse</button>'
    +'<div class="sol-note" id="solAppealNote"></div>';
}
function solNormWord(s){
  return String(s).trim().toLowerCase().replace(/[\u2019']/g, "'");
}
function solCheckAppeal(){
  var c = solCase(S.caseId);
  var wise = c.options.filter(function(o){return o.correct;})[0];
  var b = solBlanks(wise.anchor.quote);
  var inputs = document.querySelectorAll(".sol-blank");
  var good = true;
  for(var k = 0; k < inputs.length; k++){
    var input = inputs[k];
    var idx = parseInt(input.getAttribute("data-word"), 10);
    var expected = solNormWord(b.parts[idx].replace(/[^A-Za-z\u2019']/g, ""));
    var got = solNormWord(input.value || "");
    var ok = got === expected && got !== "";
    if(input.classList && input.classList.toggle){ input.classList.toggle("ok", ok); input.classList.toggle("no", !ok); }
    if(!ok) good = false;
  }
  var note = document.getElementById("solAppealNote");
  var ap = S.appeals && S.appeals[S.caseId];
  if(good && ap){
    if(window.VGSound) window.VGSound.right();
    ap.granted = true;
    solGrantedAppeal();
  } else {
    if(window.VGSound) window.VGSound.wrong();
    if(note) note.textContent = "Not yet. Read the proverb again and try the missing words.";
  }
}
function solNext(){
  var id = S.caseId, sc = S.scroll;
  var last = (sc === 1 && id === 10) || (sc === 2 && id === 20) || (sc === 3 && id === 30);
  if(last){ solDone(sc); return; }
  solOpenCase(id + 1);
}
function solDone(sc){
  var w = solProg();
  w.plays = (w.plays || 0) + 1;
  solSyncUnlocks(w); solSave();
  S.screen = "solDone";
  var meta = [
    {kicker:"The court rises", title:"Wisdom has spoken.",
     copy:"You heard every cause in the first scroll. The strongest judgment was not the loudest or quickest. It listened, searched, protected, and did what was right."},
    {kicker:"The discipline of wisdom", title:"Your judgment has deepened.",
     copy:"You learned to look beneath flattery, legal cover, and partial truth. When judgment failed, Proverbs became the way back."},
    {kicker:"Wisdom in the gates", title:"The gates stand firm.",
     copy:"You judged tribute, estates, officials, war counsel, national debt, public grain, bribery, alliances, and mercy. The weight of rule was met with wisdom."}
  ][sc-1];
  var nextOpen = sc < 3 && solScrollOpen(w, sc + 1);
  render(
    '<div class="sol-screen"><div class="vg-center">'
    +'<div class="vg-seal"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.2 4.8 5.3.6-3.9 3.6 1 5.2-4.6-2.6-4.6 2.6 1-5.2L4.5 8.4l5.3-.6z"/></svg></div>'
    +'<div class="vg-stage">'+esc(meta.kicker)+'</div>'
    +'<div class="vg-big">'+esc(meta.title)+'</div>'
    +'<p>'+esc(meta.copy)+'</p>'
    +'<p class="sol-score">Wisdom <b>'+w.score+'</b> &middot; Standing <b>'+w.standing+'</b></p>'
    +'<div class="vg-btnrow" style="justify-content:center">'
    +(nextOpen ? '<button class="vg-btn" data-act="solEnterNext">Enter Scroll '+(sc+1)+'</button>' : '')
    +(sc === 3 ? '' : '<button class="vg-btn ghost" data-act="solReplay">Replay this scroll</button>')
    +'<button class="vg-btn ghost" data-act="solHub">Scrolls</button>'
    +'</div></div></div>'
  );
}
function solAct(name){
  switch(name){
    case "solHub": solHub(); break;
    case "solCases": solOpenScroll(S.scroll); break;
    case "solNext": solNext(); break;
    case "solEnterNext": solOpenScroll(S.scroll + 1); break;
    case "solReplay": solOpenScroll(S.scroll); break;
    case "solBeginAppeal": solBeginAppeal(); break;
    case "solCheckAppeal": solCheckAppeal(); break;
    case "solRetryAppeal":
      if(S.appeals) delete S.appeals[S.caseId];
      solOpenCase(S.caseId); break;
  }
}

window.VG = {
  register:register, games:function(){ return games; }, order:function(){ return order; },
  openGame:openGame, openTransient:openTransient, daily:vDaily, hub:vHub, allQuestions:allQuestions,
  store:store,
  DIFFS:DIFFS, esc:esc, cleanVerse:cleanVerse
};
})();
