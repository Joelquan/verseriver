#!/usr/bin/env python3
"""Mechanical verification of kjv.json, web.json, asv.json, bbe.json."""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BOOKS = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua",
"Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles",
"2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
"Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel",
"Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk",
"Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John",
"Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians",
"Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy",
"2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John",
"2 John","3 John","Jude","Revelation"]

FILES = {"kjv.json": "KJV", "web.json": "WEB", "asv.json": "ASV", "bbe.json": "BBE"}
KNOWN_EMPTY = {("Matthew",17,21),("Matthew",18,11),("Matthew",23,14),
("Mark",7,16),("Mark",9,44),("Mark",9,46),("Mark",11,26),("Mark",15,28),
("Luke",17,36),("Luke",23,17),("John",5,4),("Acts",8,37),("Acts",15,34),
("Acts",24,7),("Acts",28,29),("Romans",16,24)}
# WEB (2020 stable text, verified against official eBible.org USFM): these
# verses contain only a footnote in the official text, no verse text.
WEB_EMPTY = {("Luke",17,36),("Acts",8,37),("Acts",15,34),("Acts",24,7),
("Romans",16,25)}

ok = True
def check(cond, msg):
    global ok
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond: ok = False

for fname, label in FILES.items():
    p = os.path.join(HERE, fname)
    raw = open(p, encoding="utf-8").read()
    d = json.loads(raw)  # parses cleanly
    check(d["translation"] == label, f"{fname}: translation label = {label}")
    books = d["books"]
    check(len(books) == 66, f"{fname}: 66 books (got {len(books)})")
    check([b["n"] for b in books] == BOOKS, f"{fname}: book names/order correct")
    nch = sum(len(b["c"]) for b in books)
    check(nch == 1189, f"{fname}: 1189 chapters (got {nch})")
    nv = sum(len(ch) for b in books for ch in b["c"])
    nev = sum(1 for b in books for ch in b["c"] for v in ch if v == "")
    print(f"     {fname}: total verses = {nv}, empty strings = {nev}")
    check(all(len(ch) > 0 for b in books for ch in b["c"]), f"{fname}: no empty chapter")
    bad_empty = []
    empty_allowed = KNOWN_EMPTY | (WEB_EMPTY if label == "WEB" else set())
    for b in books:
        for ci, ch in enumerate(b["c"], 1):
            for vi, v in enumerate(ch, 1):
                if v == "" and (b["n"], ci, vi) not in empty_allowed:
                    bad_empty.append((b["n"], ci, vi))
    check(not bad_empty, f"{fname}: no unexpected empty verses {bad_empty[:5]}")
    check(all(v == v.strip() and "  " not in v for b in books for ch in b["c"] for v in ch if v),
          f"{fname}: whitespace normalized")
    # spot checks
    g = lambda bn, c, v: books[BOOKS.index(bn)]["c"][c-1][v-1]
    check(len(books[0]["c"][0]) == 31, f"{fname}: Genesis 1 = 31 verses")
    check(len(books[BOOKS.index("Psalms")]["c"][116]) == 2, f"{fname}: Psalm 117 = 2 verses")
    check(len(books[BOOKS.index("Psalms")]["c"][118]) == 176, f"{fname}: Psalm 119 = 176 verses")
    jude = books[BOOKS.index("Jude")]
    check(len(jude["c"]) == 1 and len(jude["c"][0]) == 25, f"{fname}: Jude = 25 verses, 1 chapter")
    check(len(books[BOOKS.index("Revelation")]["c"][21]) == 21, f"{fname}: Revelation 22 = 21 verses")
    print(f"     {fname} Genesis 1:1: {g('Genesis',1,1)[:90]}")
    print(f"     {fname} John 1:1:    {g('John',1,1)[:90]}")

print("\nALL CHECKS PASSED" if ok else "\nSOME CHECKS FAILED")
