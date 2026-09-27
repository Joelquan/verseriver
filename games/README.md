# Verse Games · Study Desk

A cream study desk for narrative journeys and citation-deep knowledge missions,
built to match verseriver.com: KJV Scripture-first, answers cite the text,
formation over flash, no streak guilt.

## What is playable now

- **Tribes** (knowledge): 50 questions in 5 stages, Genesis 49 through Revelation.
  Multi-stage, three-strike (three oil lamps), Seeker / Pilgrim / Scribe paces.
- **The Ten Plagues** (knowledge): 15 questions in 5 stages, Exodus 7–12.
- **Joseph: From Pit to Palace** (narrative): 5 story stages, each sealed by a
  3-question Scripture quiz gate. Progress is remembered between visits.
- **Today's Portion**: one fresh question a day. No streaks, no guilt.

The hub also lists the site's full catalog (Tabernacle, Creation, Seven Churches,
Sevens, Twelves, Kings of Judah/Israel, Judges, Clean & Unclean, plus Esther and
Daniel journeys) as honest "Being prepared" cards, matching the house voice:
"Shelves warming; the house stays honest."

## Structure

```
index.html            Hub + player shell
css/verse-games.css   Theme: cream, sage, gold, KJV serif
js/engine.js          Stages, lamps, hints, difficulty, journey gates, storage
js/data-tribes.js     50 questions
js/data-plagues.js    15 questions
js/data-joseph.js     5 story stages + 15 gate questions
js/hub.js             Study desk hub, full catalog
dist/verse-games.html Single-file build (review + drop-in)
tools/fill-verses.js  Fetch exact KJV text for every citation (bible-api.com)
tools/build-dist.js   Rebuild the single-file bundle
tools/test-all.js     Full flow test: 80 questions, every screen
```

## Verse accuracy

Every citation's verse text is fetched verbatim from the KJV via bible-api.com
and baked into the data files. Re-run `node tools/fill-verses.js` after adding
questions; it only fills empty `verse:""` fields. The test suite fails the build
if any question lacks a real verse.

## Adding a game

1. Copy `js/data-plagues.js` as a template.
2. `VG.register({id, title, kicker, source, desc, meta, shelf, playable:true,
   stages:[{name, questions:[{q, options:[4], a, ref, verse:"", insight}]}]})`
   or `journey:[{title, teaser, ref, text, gate:[...]}]` for narrative.
3. Add the card to the catalog in `js/hub.js`.
4. Run fill-verses, build-dist, test-all.

## Drop into the verseriver repo

- Either serve this folder as `/games/` or copy `dist/verse-games.html` to the
  route that renders "Enter the study desk".
- Storage uses `localStorage` (`vg_*` keys), so progress survives visits.
  No backend needed. No tracking, no ads, no cookies beyond progress.

## Design tokens

Cream `#f8f4e9`, paper `#fffdf7`, ink `#2c2620`, sage `#6f7d5c`,
gold `#a97e2f`. Scripture in Georgia serif, UI in system sans.
House rules: no em/en dashes in copy, gentle failure language, the verse is
the reward.
