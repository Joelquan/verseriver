/* Whole Counsel sound: fully synthesized Web Audio tones, no audio files.
   Plays on the study desk: welcome, difficulty confirm, clicks, answer
   chimes, stage flourishes, chapter fanfare, timer ticks. Sound on by
   default; one tap on the speaker toggle silences, choice persists. */
(function(){
"use strict";

var ctx = null, master = null;
var unlocked = false, welcomePlayed = false;
var muted = false;
var toggleBtn = null;

/* mute persists through the engine store (bridge aware, same as progress) */
function loadMuted(){
  try{ if(window.VG && VG.store) muted = !!VG.store.get("muted", false); }catch(e){}
}
function saveMuted(){
  try{ if(window.VG && VG.store) VG.store.set("muted", muted); }catch(e){}
}

/* iOS Safari keeps audio locked until a user gesture: build and resume the
   context inside gesture handlers so the first tap wakes the sound. */
function ensure(){
  try{
    if(!ctx){
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if(ctx.state === "suspended") ctx.resume();
    unlocked = true;
    return true;
  }catch(e){ return false; }
}

function tone(freq, delay, dur, type, vol){
  if(muted || !ensure() || !ctx) return;
  try{
    var t0 = ctx.currentTime + delay;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }catch(e){}
}

var S = {
  welcome:function(){           /* home screen open: soft welcoming tone */
    tone(329.63, 0, 1.2, "sine", 0.10);
    tone(440.00, 0.15, 1.4, "sine", 0.08);
    tone(554.37, 0.30, 1.6, "sine", 0.05);
  },
  confirm:function(){           /* difficulty chosen, chapter opened: warm */
    tone(523.25, 0, 0.25, "triangle", 0.13);
    tone(659.25, 0.09, 0.35, "triangle", 0.13);
  },
  click:function(){              /* ordinary button tap: quiet click */
    tone(880, 0, 0.06, "sine", 0.05);
  },
  right:function(){              /* right answer: warm harp-like chime */
    tone(880.00, 0, 0.5, "triangle", 0.15);
    tone(1318.50, 0, 0.4, "sine", 0.07);
    tone(1174.66, 0.12, 0.6, "triangle", 0.13);
  },
  wrong:function(){              /* wrong answer: soft low tone, gentle */
    tone(196.00, 0, 0.5, "sine", 0.11);
    tone(146.83, 0.05, 0.6, "sine", 0.07);
  },
  stage:function(){              /* "Did you know?" break: rising flourish */
    var n = [523.25, 659.25, 783.99, 1046.50];
    for(var i = 0; i < n.length; i++) tone(n[i], i * 0.11, 0.32, "triangle", 0.12);
  },
  chapter:function(){            /* chapter sealed: the signature motif */
    var n = [392.00, 523.25, 659.25, 783.99, 1046.50];
    for(var i = 0; i < n.length; i++) tone(n[i], i * 0.12, 0.4, "triangle", 0.13);
    tone(523.25, 0.66, 1.1, "sine", 0.08);
    tone(659.25, 0.66, 1.1, "sine", 0.08);
    tone(783.99, 0.66, 1.1, "sine", 0.08);
  },
  tick:function(){               /* timer: subtle tick, last seconds only */
    tone(1567.98, 0, 0.04, "sine", 0.045);
  }
};

function paintToggle(){
  if(toggleBtn) toggleBtn.textContent = muted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
}
function toggleMute(){
  muted = !muted;
  saveMuted();
  paintToggle();
  if(!muted) S.confirm();
}

function makeToggle(){
  try{
    if(typeof document.createElement !== "function" || !document.body) return;
    if(document.querySelector(".vg-sound-toggle")) return;
    var b = document.createElement("button");
    b.className = "vg-sound-toggle";
    b.setAttribute("type", "button");
    b.setAttribute("data-act", "mute");
    b.setAttribute("aria-label", "Mute or unmute game sounds");
    document.body.appendChild(b);
    toggleBtn = b;
    paintToggle();
  }catch(e){}
}

/* wake audio on the first user gesture anywhere (capture: runs before the
   game click handlers). On unlock, if the study desk is showing and the
   welcome has not played, greet the player. */
function onGesture(){
  var was = unlocked;
  if(ensure() && !was && !welcomePlayed){
    try{
      if(document.querySelector && document.querySelector(".vg-house")){
        welcomePlayed = true;
        S.welcome();
      }
    }catch(e){}
  }
}
if(typeof document.addEventListener === "function"){
  document.addEventListener("pointerdown", onGesture, true);
  document.addEventListener("keydown", onGesture, true);
  /* mute toggle: intercept before the game handlers see it */
  document.addEventListener("click", function(e){
    var t = e.target;
    while(t && t !== document){
      if(t.getAttribute && t.getAttribute("data-act") === "mute"){
        if(e.preventDefault) e.preventDefault();
        if(e.stopPropagation) e.stopPropagation();
        ensure();
        toggleMute();
        return;
      }
      t = t.parentNode;
    }
  }, true);
}

loadMuted();
if(typeof document.addEventListener === "function"){
  if(document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", makeToggle);
  else makeToggle();
}

window.VGSound = {
  ensure:ensure, welcome:S.welcome, confirm:S.confirm, click:S.click,
  right:S.right, wrong:S.wrong, stage:S.stage, chapter:S.chapter, tick:S.tick,
  toggle:toggleMute, isMuted:function(){ return muted; }
};
})();
