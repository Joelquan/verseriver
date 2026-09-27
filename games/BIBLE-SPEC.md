# The Whole Counsel: Bible Book Data Spec

How to author chapters for the 66-book game. The pilot book is Genesis (50 chapters,
20 questions each = 1,000 questions). Later books follow the same shape.

## 1. Write the chapter files

Create `js/data-bible-<book>-<nn>.js`, five chapters per file for the pilot
(e.g. `js/data-bible-genesis-01.js` holds chapters 1-5). Register with:

```js
/* Verse Games: THE WHOLE COUNSEL · Genesis chapters 1-5
   Verse text is filled/verified from the KJV by tools/fill-verses.js */
VG.registerBibleChapters("genesis", [
{n:1, name:"The Creation",
 seal:{ref:"Genesis 1:1", verse:""},
 facts:[
  "Did you know the Hebrew word for God in Genesis 1, Elohim, is plural in form but always takes a singular verb, hinting at the Trinity from the first verse?",
  "...",
  "..."
 ],
 questions:[
  {q:"...", options:["<correct first>","<wrong>","<wrong>","<wrong>"], a:0,
   ref:"Genesis 1:3", verse:"",
   insight:"<one or two sentences, drawn from this verse, formation over flash>"},
  ... 20 total ...
 ]},
 ... 4 more chapters ...
]);
```

Rules (same bar as GAMESPEC.md, plus):
- 20 questions per chapter, in four stages of five. Chapters with fewer than 10 verses
  get 10 questions instead, in two stages of five.
- The correct answer is always `options[0]` with `a:0`. The engine shuffles at play.
- Every `ref` must be a real KJV verse **in that chapter** ("Genesis 3:15" for chapter 3).
  Never invent a reference. Never reuse a ref more than twice in one chapter.
- `verse:""` stays empty; `node tools/fill-verses.js` fills exact KJV text. Verify the fill output.
- `facts`: one per stage break, "Did you know?" style, 1 to 2 sentences each, tied to
  the chapter, interesting and accurate. That means 3 facts for full 20-question
  chapters, 1 fact for short 10-question chapters. Shown at the stage breaks.
- `seal`: the chapter's key verse, shown when the chapter is completed.
- `name`: a short chapter title ("The Fall", "The Flood", "The Call of Abram").
- No em dashes or en dashes anywhere in your copy.
- Vary question forms: who, what, where, when, how many, which, why, in what order.
  Distractors must be plausible, never silly. No "all of the above".
- Insights teach from the specific verse, never a generic moral.

## 2. Book meta (one file per book)

`js/data-bible-meta.js`:

```js
VG.registerBibleBook({id:"genesis", title:"Genesis", kicker:"KJV · Genesis 1-50",
 desc:"<formation voice, one or two sentences>",
 art:"img/book-genesis.webp", theme:"genesis",
 intro:"<two or three sentences introducing the book>"});
```

## 3. Engine notes

- Chapters play through transient games: 4 stages of 5 questions, lamps reset per stage,
  "Did you know?" break cards between stages, chapter seal verse at completion.
- Progress and the leaderboard live in `js/bible.js` storage (`vg_bible_prog`), per chapter:
  score, accuracy, difficulty, hints used, lamps left, time. Never in the main registry.
- The widget preview build (`VG_SLIM=1`) ships only the first two chapter files
  (chapters 1-10) to stay under the 1MB widget cap. The full book ships in dist.
