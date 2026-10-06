# Bible Data Sources

Four complete public domain English Bible translations, built 2026-10-06
for the Verse Wall Bible reader. Output files: `kjv.json`, `web.json`,
`asv.json`, `bbe.json`, each in the format
`{"translation":"KJV","books":[{"n":"Genesis","c":[["verse 1", ...], ...]}]}`.

## KJV (King James Version)

- Source URL: https://eBible.org/Scriptures/eng-kjv_usfm.zip
  (official USFM, "standardized text of 1769", downloaded 2026-10-06;
  kept locally as `src-KJV-usfm.zip`)
- License: public domain. Basis: eBible.org details page states the 1769
  text is "firmly in the Public Domain" outside the UK (where a royal
  printing patent applies only to print).
- Verification: every verse mechanically compared against eBible.org's own
  readaloud rendering of the same text: 31,102 of 31,102 verses match
  exactly (100.00%).

## WEB (World English Bible)

- Source URL: https://eBible.org/Scriptures/eng-web_usfm.zip
  (official USFM, "2020 stable text edition", downloaded 2026-10-06;
  kept locally as `src-WEB-usfm.zip`)
- License: public domain (no copyright). Basis: worldenglish.bible and
  eBible.org both state "The World English Bible is in the Public Domain.
  That means that it is not copyrighted."
- Verification: every verse mechanically compared against eBible.org's own
  readaloud rendering of the same text: 31,098 of 31,098 verses match
  exactly (100.00%).
- Note: an earlier candidate source (TehShrike/world-english-bible JSON,
  parsed from older HTML) was rejected after comparison showed about 20%
  of its verses differ from the official 2020 stable text.

## ASV (American Standard Version, 1901)

- Source URL: https://eBible.org/Scriptures/eng-asv_usfm.zip
  (official USFM, downloaded 2026-10-06; kept locally as `src-ASV-usfm.zip`)
- License: public domain. Basis: eBible.org details page labels it
  "public domain"; first published 1901.
- Verification: every verse mechanically compared against eBible.org's own
  readaloud rendering of the same text: 31,086 of 31,086 verses match
  exactly (100.00%).

## BBE (Bible in Basic English)

- Source URL: https://github.com/scrollmapper/bible_databases
  (`formats/json/BBE.json` on master, downloaded 2026-10-06;
  kept locally as `src-BBE.json`)
- License: public domain. Basis: the repository README states "All
  included Bible translations are in the public domain" (MIT licensed
  project); the BBE (1949/1964) is treated as public domain by the source
  project and by this task's own license determination.
- Verification: chapter by chapter verse counts match the KJV exactly
  (same versification, 1,189 chapters); the 16 empty verses are exactly
  the verses this translation omits (same set as the ASV).

## Build notes

- Built with `build_bibles.py` from the sources above. USFM sources are
  converted with footnote, cross reference, Strong's number, and
  formatting markup stripped; only the verse text is kept, with the
  official rendering (section headings, speaker labels, acrostic titles,
  and epistle subscriptions handled exactly as eBible.org renders them).
- `verify_bibles.py` checks: 66 books in canonical order, 1,189 chapters,
  spot verse counts (Genesis 1 = 31, Psalm 117 = 2, Psalm 119 = 176,
  Jude = 25 in 1 chapter, Revelation 22 = 21), no empty chapters,
  whitespace normalized, JSON parses cleanly.
- `crosscheck.py` replays the 100% readaloud comparison for KJV/WEB/ASV.

## Known empty verses (faithful to the translations, not data gaps)

- ASV and BBE omit 16 verses entirely (their printed text has no text for
  them; each is kept as an empty string so verse N stays at index N-1):
  Matthew 17:21, 18:11, 23:14; Mark 7:16, 9:44, 9:46, 11:26, 15:28;
  Luke 17:36, 23:17; John 5:4; Acts 8:37, 15:34, 24:7, 28:29; Romans 16:24.
- WEB has 5 such verses (the official text carries only a footnote there):
  Luke 17:36; Acts 8:37, 15:34, 24:7; Romans 16:25. (The WEB places the
  Romans doxology at 14:24-26, which is why its total is 31,103 verses,
  one more than the KJV's 31,102.)
- BBE keeps its own "***" marks where the Hebrew text has a gap
  (7 occurrences); these are the translation's own notation, kept as is.
