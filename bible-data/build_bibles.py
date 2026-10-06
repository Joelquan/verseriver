#!/usr/bin/env python3
"""Build kjv.json, web.json, asv.json, bbe.json in the Verse Wall reader format.

Format: {"translation":"KJV","books":[{"n":"Genesis","c":[["v1","v2",...],[...]]}]}

KJV/WEB/ASV are built from the official eBible.org USFM (public domain),
with verse text verified 100% against eBible.org's own readaloud rendering.
BBE is built from scrollmapper/bible_databases (public domain).

Every word comes from the sourced files; nothing is invented.
"""
import json, re, os, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))

BOOK_ORDER = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua",
"Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles",
"2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
"Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel",
"Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk",
"Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John",
"Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians",
"Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy",
"2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John",
"2 John","3 John","Jude","Revelation"]

# scrollmapper uses Roman numerals and "Revelation of John" (BBE only)
ROMAN_FIX = {"I ": "1 ", "II ": "2 ", "III ": "3 "}
def sm_name(n):
    for r, d in ROMAN_FIX.items():
        if n.startswith(r):
            n = d + n[len(r):]
            break
    if n == "Revelation of John":
        n = "Revelation"
    return n

WS = re.compile(r"\s+")
def clean(t):
    """Normalize whitespace only: collapse runs, strip. Keep punctuation."""
    return WS.sub(" ", t.replace("\xa0", " ")).strip()

WS_KEEP_NBSP = re.compile(r'[ \t\n\r\f\v]+')
def clean_keep_nbsp(t):
    # normalize runs of ordinary whitespace, but leave U+00A0 untouched
    return WS_KEEP_NBSP.sub(' ', t).strip(' \t\n\r\f\v')

BLOCK_MARKERS = {"p", "q1", "q2", "q3", "qr", "qc", "m", "mi", "pi1", "pi2",
                 "pi3", "li1", "li2", "b", "nb", "d", "pb", "r", "s1", "s2",
                 "s3", "ms1", "ms2", "iot", "io1"}

def strip_usfm_verse(t):
    # Speaker labels (WEB Song of Solomon): the official text drops a
    # trailing \sp (end of verse) but keeps a mid-verse \sp inline.
    t = re.sub(r'\\sp [^\n\\]*(?:\s|\\\+?[a-z]+\d*\*?)*$', '', t)
    t = re.sub(r'\\sp ([^\n\\]*)', r'\1', t)
    # Section headings (\ms BOOK 1..5, \s1: KJV Ps 119 acrostic headings and
    # epistle subscriptions) and \tl titles are dropped by the official text.
    # \qc centered paragraphs (ASV Ps 119 acrostics) are dropped as well.
    t = re.sub(r'\\ms\d* [^\n\\]*', '', t)
    t = re.sub(r'\\s\d*\b[^\n]*', '', t)
    t = re.sub(r'\\qc\b[^\n]*', '', t)
    t = re.sub(r'\\tl\b.*?\\tl\*', '', t, flags=re.S)
    # Square brackets are dropped by the official text (ASV [Selah],
    # [John 7:53-8:11]; KJV 1JN 2:23 [but]).
    t = t.replace('[', '').replace(']', '')
    # Drop footnotes, cross-references, figures entirely (no space added).
    t = re.sub(r'\\f[ +].*?\\f\*', '', t, flags=re.S)
    t = re.sub(r'\\x[ +].*?\\x\*', '', t, flags=re.S)
    t = re.sub(r'\\fig\b.*?\\fig\*', '', t, flags=re.S)
    # Word markers: keep the surface word, drop Strong/morph data.
    t = re.sub(r'\\\+?w ([^|\\]+)\|.*?\\\+?w\*', r'\1', t, flags=re.S)
    t = re.sub(r'\\\+?w ([^\\]*?)\\\+?w\*', r'\1', t, flags=re.S)
    # Paired inline markers (\wj \qt \nd \add \qs \bk ...): drop the markers.
    # Content is kept literally, except inside \wj and \add where boundary
    # whitespace is trimmed (official: '\wj ”' -> '”', 'first-\add fruits'
    # -> 'first-fruits'; but '\qs Selah—' keeps its space: '— Selah—').
    def _pair(m):
        n1 = m.group(1).lstrip('+')
        if n1 != m.group(3).lstrip('+'):
            return m.group(0)  # mismatched; leave for the generic pass
        if n1 in ('wj', 'add'):
            return m.group(2).strip()
        return m.group(2)
    prev = None
    while prev != t:
        prev = t
        t = re.sub(r'\\(\+?[a-z]+\d*)\b([^\\]*?)\\(\+?[a-z]+\d*)\*', _pair, t)
    # Remaining markers: block-level -> space, anything else -> removed.
    def _sub(m):
        return ' ' if m.group(1).lstrip('+') in BLOCK_MARKERS else ''
    t = re.sub(r'\\(\+?[a-z]+\d*)\*?', _sub, t)
    t = clean_keep_nbsp(t)
    # No ordinary space before closing punctuation / closing quotes.
    # U+00A0 is exempt: the translators' non-breaking space is kept.
    t = re.sub(r' ([,.;:;!?)\]}%’”])', r'\1', t)
    return clean(t)

# eBible.org USFM book codes -> names (66 canonical books)
USFM_BOOKS = {"GEN":"Genesis","EXO":"Exodus","LEV":"Leviticus","NUM":"Numbers",
"DEU":"Deuteronomy","JOS":"Joshua","JDG":"Judges","RUT":"Ruth","1SA":"1 Samuel",
"2SA":"2 Samuel","1KI":"1 Kings","2KI":"2 Kings","1CH":"1 Chronicles",
"2CH":"2 Chronicles","EZR":"Ezra","NEH":"Nehemiah","EST":"Esther","JOB":"Job",
"PSA":"Psalms","PRO":"Proverbs","ECC":"Ecclesiastes","SNG":"Song of Solomon",
"ISA":"Isaiah","JER":"Jeremiah","LAM":"Lamentations","EZK":"Ezekiel",
"DAN":"Daniel","HOS":"Hosea","JOL":"Joel","AMO":"Amos","OBA":"Obadiah",
"JON":"Jonah","MIC":"Micah","NAM":"Nahum","HAB":"Habakkuk","ZEP":"Zephaniah",
"HAG":"Haggai","ZEC":"Zechariah","MAL":"Malachi","MAT":"Matthew","MRK":"Mark",
"LUK":"Luke","JHN":"John","ACT":"Acts","ROM":"Romans","1CO":"1 Corinthians",
"2CO":"2 Corinthians","GAL":"Galatians","EPH":"Ephesians","PHP":"Philippians",
"COL":"Colossians","1TH":"1 Thessalonians","2TH":"2 Thessalonians",
"1TI":"1 Timothy","2TI":"2 Timothy","TIT":"Titus","PHM":"Philemon",
"HEB":"Hebrews","JAS":"James","1PE":"1 Peter","2PE":"2 Peter","1JN":"1 John",
"2JN":"2 John","3JN":"3 John","JUD":"Jude","REV":"Revelation"}

USFM_SOURCES = {
    "KJV": {"zip": "src-KJV-usfm.zip", "dir": "usfm-kjv", "tag": "eng-kjv"},
    "WEB": {"zip": "src-WEB-usfm.zip", "dir": "usfm-web", "tag": "eng-web"},
    "ASV": {"zip": "src-ASV-usfm.zip", "dir": "usfm-asv", "tag": "eng-asv"},
}

def build_from_usfm(label):
    cfg = USFM_SOURCES[label]
    usfm_dir = os.path.join(HERE, cfg["dir"])
    if not os.path.isdir(usfm_dir):
        os.makedirs(usfm_dir, exist_ok=True)
        with zipfile.ZipFile(os.path.join(HERE, cfg["zip"])) as z:
            z.extractall(usfm_dir)
    books = []
    for fname in BOOK_ORDER:
        code = [c for c, n in USFM_BOOKS.items() if n == fname][0]
        pat = re.compile(r'\d+-' + code + cfg["tag"] + r'\.usfm')
        matches = [p for p in os.listdir(usfm_dir) if pat.fullmatch(p)]
        assert len(matches) == 1, f"{label} {fname}: {matches}"
        raw = open(os.path.join(usfm_dir, matches[0]), encoding="utf-8").read()
        chs = []
        chunks = re.split(r'\\c (\d+)\b', raw)
        for i in range(1, len(chunks), 2):
            vs = re.split(r'\\v (\d+)\b', chunks[i + 1])
            # \d descriptive title before the first verse leads verse 1
            # (e.g. "A Psalm of David..."); section headings are dropped.
            pre = strip_usfm_verse(vs[0])
            ordered = []
            for j in range(1, len(vs), 2):
                n = int(vs[j])
                # a trailing \d stanza title attaches to the end of its verse
                # (WEB Ps 119: v8 ends "...forsake me. BETH"; ASV Hab 3:19
                # ends "...high places. For the Chief Musician, on my
                # stringed instruments.").
                segs = re.split(r'\\d\b', vs[j + 1])
                vtext = strip_usfm_verse(segs[0])
                tail = " ".join(x for x in
                                (strip_usfm_verse(s) for s in segs[1:]) if x)
                if tail:
                    vtext = (vtext + " " + tail).strip()
                ordered.append((n, vtext))
            nums = [n for n, _ in ordered]
            assert nums == list(range(1, max(nums) + 1)), \
                f"{label} {fname} ch {chunks[i]} verse gap: {nums[:8]}"
            verses = [v for _, v in ordered]
            if pre:
                verses[0] = (pre + " " + verses[0]).strip()
            chs.append(verses)
        books.append({"n": fname, "c": chs})
    return {"translation": label, "books": books}

def build_bbe():
    d = json.load(open(os.path.join(HERE, "src-BBE.json"), encoding="utf-8"))
    books = []
    for b in d["books"]:
        name = sm_name(b["name"])
        chs = []
        for ch in b["chapters"]:
            chs.append([clean(v["text"]) for v in ch["verses"]])
        books.append({"n": name, "c": chs})
    names = [b["n"] for b in books]
    assert names == BOOK_ORDER, [n for n in names if n not in BOOK_ORDER]
    return {"translation": "BBE", "books": books}

def main():
    out = {
        "kjv.json": build_from_usfm("KJV"),
        "web.json": build_from_usfm("WEB"),
        "asv.json": build_from_usfm("ASV"),
        "bbe.json": build_bbe(),
    }
    for fname, data in out.items():
        p = os.path.join(HERE, fname)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        print("wrote", p, os.path.getsize(p), "bytes")

if __name__ == "__main__":
    main()
