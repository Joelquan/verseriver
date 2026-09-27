# The 66 Books Game: Plan

## The vision

One game covering the whole Bible. All 66 books. Every chapter is a level. Twenty questions per chapter, every answer carried by the exact KJV verse. Each book has its own visual world: palette, texture, motif, artwork, and features that fit the book. A leaderboard tracks the journey.

Working title: **The Whole Counsel** (Acts 20:27).

## The scale, honestly

The Bible has 1,189 chapters. At 20 questions per chapter, that is about 23,780 questions. This is the largest thing we have planned, and it gets built book by book, not all at once. Every question holds the same bar as the library: real reference, exact KJV text, insight drawn from the verse, no invented citations.

## How it plays

- **Enter a book.** Each book opens with its own themed cover: art, colors, texture, and a short introduction to the book.
- **Pick a chapter.** Chapters appear as a grid. Finished chapters show their seal; unfinished ones wait quietly. No streak pressure, no shaming.
- **Play the chapter.** Twenty questions in four stages of five, following the library pattern: three lamps, Seeker/Pilgrim/Scribe pace, Scripture hints. Between stages, a "Did you know?" break serves a Bible fact or trivia tied to the chapter. Finish the chapter to earn its seal verse.
- **Finish a book.** Complete every chapter to earn the book badge and unlock its closing passage.
- **Progress saves** per chapter, per book, across sessions.

## The theme system

The engine gains a per-book theme. Inspiration comes from two places: the existing library's visual language (cream study desk, cartoon art, Scripture-first), and BibleProject's approach of giving every Bible book its own signature illustrated identity, one key visual per book with its own palette and motifs. All artwork stays original; the inspiration is the idea of a distinct visual identity per book, never copied images. Each theme carries: CSS palette variables, a background texture or motif, the book's cover art, and optional book-specific features. Examples of where this goes:

- Genesis: creation skies, star fields, "beginnings" motif.
- Exodus: desert sand texture, Red Sea motif, deliverance features.
- Psalms: stringed-instrument motif, garden textures, a recite-aloud feature.
- Proverbs: daily saying feature, scroll textures.
- Revelation: throne-and-glory palette, heavenly motifs.
- The Gospels: each with its own accent within a shared family.

Sixty-six original illustrations in the library's cartoon style, one per book, plus motif art. All original, nothing copied.

## The content pipeline

Per book, in this order:

1. Draft 20 questions per chapter from the KJV text, with references.
2. Fill and verify every verse through bible-api.com, exactly as the library does.
3. Review pass: every question checked for a real reference, a fair correct answer, and an insight drawn from its verse.
4. Theme the book: art, palette, texture, features.
5. Ship the book into the library; the hub picks it up automatically.

Genesis is the pilot: one book end to end, for approval before the pipeline runs wide.

## The leaderboard

- **Phase 1 (with the game):** on-device leaderboard carrying the full record of play: scores, accuracy, chapters and books completed, seals earned, difficulty played, hints used, lamps remaining, and time. Personal, private, no pressure loops.
- **Phase 2 (with the site):** a true global leaderboard needs the verseriver.com backend, so it ships with the repo integration. Scores sync, friends compare, the site hosts the tables.

## Build phases

1. **Engine:** chapter select, per-chapter progress, per-book theme system, local leaderboard.
2. **Pilot:** Genesis, all 50 chapters, fully themed, for your approval.
3. **Pipeline:** the remaining 65 books, batched, reviewed, and themed.
4. **Art:** 66 book illustrations plus motifs, all original.
5. **Global leaderboard:** with the verseriver repo integration.

## Decisions (locked with Kojo)

1. **Chapter length:** twenty questions per chapter in stages of five (ten questions for chapters with fewer than 10 verses). Stage breaks carry "Did you know?" Bible facts and trivia tied to the chapter, a second content stream alongside the questions.
2. **Pilot book:** Genesis.
3. **Leaderboard:** the full record of play: scores, accuracy, chapters and books completed, seals, difficulty, hints used, lamps remaining, time.
