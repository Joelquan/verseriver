/* Verse Games hub: the study desk.
   Mirrors verseriver.com: Knowledge Arena, shelves, honest rooms. */
(function(){
"use strict";

var APPS = [
  {href:"../verse-wall.html", title:"Verse Wall",
   kicker:"KJV · 1,000 verses",
   desc:"A living wall of Scripture: a still mosaic that breathes verse by verse, and a river that flows them past. Tap any card to read.",
   meta:"Mosaic · River · Share"},
  {href:"confessions/index.html", title:"365 Daily Confessions",
   kicker:"KJV · Daily",
   desc:"A confession for every day of the year, six hundred Bible promises, and the full KJV to read and flow through.",
   meta:"Confess · Read · Flow"},
  {href:"app-store/index.html", title:"Verse River App Store",
   kicker:"Directory",
   desc:"The shelf of Verse River web apps: free and faithful, all in one place.",
   meta:"All apps"}
];

function appCard(a){
  var inner = '<div class="vg-card-body">'
    +'<div class="vg-gkicker">'+VG.esc(a.kicker)+'</div>'
    +'<h3>'+VG.esc(a.title)+'</h3>'
    +'<p class="vg-gdesc">'+VG.esc(a.desc)+'</p>'
    +'<div class="vg-gmeta"><span class="vg-gtag">'+VG.esc(a.meta)+'</span>'
    +'<span class="vg-play">Open &rarr;</span>'
    +'</div></div>';
  return '<a class="vg-card vg-game" href="'+a.href+'">'+inner+'</a>';
}

var COMING_NARRATIVE = [
  {id:null, title:"Esther: For Such a Time as This",art:"img/card-esther.webp",
   kicker:"KJV · Esther",
   desc:"A Jewish orphan becomes queen, and one feast becomes a nation's deliverance.",
   meta:"Being prepared"},
  {id:null, title:"Daniel: Faith in Exile",art:"img/card-daniel.webp",
   kicker:"KJV · Daniel",
   desc:"Lions' dens and fiery furnaces: integrity in Babylon, from youth to old age.",
   meta:"Being prepared"}
];

var COMING_KNOWLEDGE = [
  {id:null, title:"The Tabernacle",art:"img/card-tabernacle.webp",
   kicker:"KJV · Exodus 25–40",
   desc:"Every curtain, court, and vessel: the pattern of worship God gave Moses on the mount.",
   meta:"Being prepared"},
  {id:null, title:"Days of Creation",art:"img/card-creation.webp",
   kicker:"KJV · Genesis 1–2",
   desc:"Six days of making and one of rest: what God made, in order, and the verse.",
   meta:"Being prepared"},
  {id:null, title:"Jesus' Earthly Ministry",art:"img/card-ministry.webp",
   kicker:"KJV · Gospels",
   desc:"Galilee to Jerusalem: the places, the people, and the works of Christ's ministry.",
   meta:"Being prepared"},
  {id:null, title:"Kings of Judah",art:"img/card-kings-judah.webp",
   kicker:"KJV · Kings · Chronicles",
   desc:"The good, the evil, and the mixed: every king of Judah weighed by the verse.",
   meta:"Being prepared"},
  {id:null, title:"Kings of Israel",art:"img/card-kings-israel.webp",
   kicker:"KJV · Kings",
   desc:"Nineteen kings of the northern kingdom, from Jeroboam to Hoshea, and what each did.",
   meta:"Being prepared"},
  {id:null, title:"Judges of Israel",art:"img/card-judges.webp",
   kicker:"KJV · Judges",
   desc:"Deliverers raised up in dark days: Othniel to Samson, deed by deed.",
   meta:"Being prepared"},
  {id:null, title:"Clean and Unclean",art:"img/card-clean.webp",
   kicker:"KJV · Leviticus 11",
   desc:"The creatures of Leviticus 11: what was clean, what was not, and the verse.",
   meta:"Being prepared"}
];

function artHtml(g){
  if(g.art) return '<div class="vg-card-art"><img src="'+g.art+'"></div>';
  if(g.artCss === "plagues") return '<div class="vg-card-art vg-art-plagues" aria-hidden="true"></div>';
  return "";
}

function card(g){
  var playable = !!g.id;
  var inner = artHtml(g)
    +'<div class="vg-card-body">'
    +'<div class="vg-gkicker">'+VG.esc(g.kicker)+'</div>'
    +'<h3>'+VG.esc(g.title)+'</h3>'
    +'<p class="vg-gdesc">'+VG.esc(g.desc)+'</p>'
    +'<div class="vg-gmeta"><span class="vg-gtag">'+VG.esc(g.meta)+'</span>'
    +(playable ? '<span class="vg-play">Play &rarr;</span>'
               : '<span class="vg-soon">Being prepared</span>')
    +'</div></div>';
  if(playable)
    return '<button class="vg-card vg-game" data-game="'+g.id+'">'+inner+'</button>';
  return '<div class="vg-card vg-game" aria-disabled="true">'+inner+'</div>';
}

function render(){
  var app = document.getElementById("vg-app");
  app.className = "";
  var all = VG.order().map(function(id){ return VG.games()[id]; });
  var shelf1 = all.filter(function(g){ return g.shelf === "narrative"; }).map(card).join("")
    + COMING_NARRATIVE.map(card).join("");
  var shelf2 = all.filter(function(g){ return g.shelf === "knowledge"; }).map(card).join("")
    + COMING_KNOWLEDGE.map(card).join("");
  var shelfMix = all.filter(function(g){ return g.shelf === "mix"; }).map(card).join("");
  var shelfMixHtml = shelfMix
    ? '<section class="vg-shelf"><div class="vg-shelf-head"><h2>The game mix</h2><span class="vg-count">Campaign Games</span></div>'
      +'<p class="vg-shelf-note">Full campaigns that play by their own rules: levels, rounds, unlocks, and records that keep.</p>'
      +shelfMix+'</section>'
    : "";
  var shelf3 = "";
  if(window.VG && VG.bibleOpen){
    shelf3 = '<section class="vg-shelf"><div class="vg-shelf-head"><h2>Shelf three</h2><span class="vg-count">The Whole Counsel</span></div>'
    +'<p class="vg-shelf-note">Every chapter of every book of the Bible, twenty questions each (ten for the shortest chapters), each book in its own visual world.</p>'
    +'<button class="vg-card vg-game" data-bbooks="1">'
    +'<div class="vg-card-art"><img src="img/card-wholecounsel.webp"></div>'
    +'<div class="vg-card-body">'
    +'<div class="vg-gkicker">KJV · 66 books</div>'
    +'<h3>The Whole Counsel</h3>'
    +'<p class="vg-gdesc">The entire Bible as a game: every chapter a level, twenty questions each (ten for the shortest chapters), "Did you know?" breaks between stages, and a leaderboard that keeps the whole record of play. Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther and Job are open; the other forty-eight books are being prepared.</p>'
    +'<div class="vg-gmeta"><span class="vg-gtag">18 books · 478 chapters</span><span class="vg-play">Enter &rarr;</span></div>'
    +'</div></button></section>';
  }
  var shelfApps = '<section class="vg-shelf"><div class="vg-shelf-head"><h2>The app shelf</h2><span class="vg-count">More from Verse River</span></div>'
    +'<p class="vg-shelf-note">The rest of what we have built: each one opens in full.</p>'
    + APPS.map(appCard).join("") + '</section>';
  app.innerHTML = '<div class="vg-anim">'
    +'<header class="vg-house">'
    +'<span class="vg-kicker">A formation house</span>'
    +'<h1>Verseriver Games<br><em>Knowledge Arena · Master Scripture</em></h1>'
    +'<p class="vg-sub">A cream study desk for narrative journeys and citation-deep knowledge missions, not arcade trivia.</p>'
    +'<div class="vg-badges">'
    +'<span class="vg-badge">KJV · Scripture-first</span>'
    +'<span class="vg-badge">Answers cite the text</span>'
    +'<span class="vg-badge">Formation over flash</span>'
    +'<span class="vg-badge">No streak guilt</span>'
    +'</div></header>'
    +'<div class="vg-card vg-portion">'
    +'<span class="vg-gkicker">Today&rsquo;s portion</span>'
    +'<h3>One question, no streak, no guilt.</h3>'
    +'<p>A single question from the desk, drawn fresh each day. Come as you are; the text does the forming.</p>'
    +'<button class="vg-btn" data-act="daily">Receive today&rsquo;s portion</button>'
    +'</div>'
    +'<section class="vg-shelf"><div class="vg-shelf-head"><h2>Shelf one</h2><span class="vg-count">Narrative Journeys</span></div>'
    +'<p class="vg-shelf-note">Multi-level story arcs with a Scripture quiz gate after every level.</p>'
    +shelf1+'</section>'
    +'<section class="vg-shelf"><div class="vg-shelf-head"><h2>Shelf two</h2><span class="vg-count">Knowledge Games</span></div>'
    +'<p class="vg-shelf-note">Citation-native missions: multi-stage questions, text depth, and three-strike challenges.</p>'
    +shelf2+'</section>'
    +shelfMixHtml
    +shelf3
    +shelfApps
    +'<p class="vg-shelf-note" style="margin-top:18px">Four shelves: Narrative, Knowledge, the Game Mix, and the Whole Counsel, plus the app shelf. The Hidden Treasure attention game stays off this hub until it is a full Matthew text journey.</p>'
    +'<footer class="vg-foot"><div class="vg-kjv">KJV · Public Domain</div>'
    +'Every answer opens the verse it came from.<br>Shelves warming; the house stays honest.</footer>'
    +'</div>';
  window.scrollTo(0,0);
  if(window.VGSound) window.VGSound.welcome();
}

window.VGHub = {render:render};
document.addEventListener("DOMContentLoaded", function(){
  if(window.VG) render();
});
})();
