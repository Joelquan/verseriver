"""Inline img/* references in a built HTML file as base64 webp data URIs.

Usage: python3 tools/inline-images.py <html-file> <max-width> <quality>
Run after tools/build-dist.js. Keeps the single-file bundle portable.
"""
import base64
import io
import re
import sys
from pathlib import Path

from PIL import Image

def main():
    html_path = Path(sys.argv[1])
    max_w = int(sys.argv[2])
    quality = int(sys.argv[3])
    base = Path(sys.argv[4]) if len(sys.argv) > 4 else html_path.parent.parent  # project root holding img/
    html = html_path.read_text(encoding='utf-8')

    refs = sorted(set(re.findall(r'img/[A-Za-z0-9_.-]+\.(?:webp|jpg|jpeg|png)', html)))
    if not refs:
        print('no img references found')
        return
    total = 0
    for ref in refs:
        src = base / ref
        if not src.exists():
            print(f'WARNING: missing {src}, leaving reference as-is')
            continue
        im = Image.open(src).convert('RGB')
        if im.width > max_w:
            im = im.resize((max_w, int(im.height * max_w / im.width)), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, 'WEBP', quality=quality, method=6)
        data = base64.b64encode(buf.getvalue()).decode('ascii')
        uri = 'data:image/webp;base64,' + data
        html = html.replace(ref, uri)
        total += len(buf.getvalue())
        print(f'inlined {ref}: {len(buf.getvalue())//1024} KB webp')
    html_path.write_text(html, encoding='utf-8')
    print(f'done: {len(refs)} images, {total//1024} KB webp -> {html_path.stat().st_size//1024} KB file')

if __name__ == '__main__':
    main()
