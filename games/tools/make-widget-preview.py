"""Build the chat-widget preview fragment from dist/verse-games.html.

Strips the localStorage fallback (widgets must use the hatchWidget bridge;
the site bundle keeps localStorage). Verifies structure before writing.
Run: python3 tools/make-widget-preview.py  (from verse-games/)
"""
import re
from pathlib import Path

import sys
base = Path(__file__).resolve().parent.parent
dist = Path(sys.argv[1]) if len(sys.argv) > 1 else base / 'dist' / 'verse-games.html'
out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else base / 'dist' / 'widget-preview.html'

html = dist.read_text(encoding='utf-8')

style_m = re.search(r'<style>\n(.*?)</style>', html, re.S)
body_m = re.search(r'<body>(.*?)</body>', html, re.S)
scripts = re.findall(r'<script>\n(.*?)</script>', html, re.S)

assert style_m, 'no <style> found'
assert body_m, 'no <body> found'
assert len(scripts) >= 5, f'expected at least 5 scripts, got {len(scripts)}'

style_css = style_m.group(1)
# NOTE: build-dist.js places the <script> blocks inside <body>, so strip them
# from the body HTML; the cleaned scripts are appended separately below.
body_html = re.sub(r'<script>.*?</script>', '', body_m.group(1), flags=re.S).strip()

cleaned = []
for s in scripts:
    s = s.replace(
        'var v = localStorage.getItem("vg_"+k);\n'
        '      return v === null ? d : JSON.parse(v);',
        'return mem[k] !== undefined ? mem[k] : d;')
    s = s.replace(
        'localStorage.setItem("vg_"+k, JSON.stringify(v));',
        'mem[k] = v;')
    cleaned.append(s)

frag = ('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<title>The Whole Counsel</title>\n'
        '<style>\n' + style_css + '\n</style>\n</head>\n<body>\n'
        + body_html + '\n'
        + ''.join('<script>\n' + s + '\n</script>\n' for s in cleaned)
        + '\n</body>\n</html>\n')

assert 'localStorage' not in frag, 'localStorage leaked into fragment'
assert frag.count('<script>') == len(scripts), 'script count wrong in fragment'
assert 'window.VG' in frag and 'VGHub' in frag, 'engine or hub missing'

out_path.write_text(frag, encoding='utf-8')
print(f'widget preview written: {out_path} ({len(frag)} chars, 5 scripts, no localStorage)')
