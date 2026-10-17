"""Extract public editorial pages and only their images from a LOCAL browser backup.

Usage: python3 tools/export-public-content.py /path/to/TFB-Sicherung.json
The input backup must never be committed or copied into the website directory.
"""
import base64
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_KEYS = {'version', 'pages', 'teams', 'applied', 'chatText', 'homeLook',
               'nav', 'stories', 'homeColorMode', 'focusStrip', 'splash'}
PAGE_KEYS = {'home', 'aktuell', 'sport', 'verein', 'satzung', 'impressum'}
IMAGE_TYPES = {'image/jpeg': ('.jpg', b'\xff\xd8\xff'),
               'image/png': ('.png', b'\x89PNG\r\n\x1a\n'),
               'image/webp': ('.webp', b'RIFF'), 'image/gif': ('.gif', b'GIF8')}


def extract(backup):
    if backup.get('format') != 'tfb-sicherung' or backup.get('version') != 1:
        raise ValueError('Keine unterstützte TFB-Sicherung.')
    source = backup['db']['site']
    site = {key: value for key, value in source.items() if key in PUBLIC_KEYS}
    site['pages'] = {key: value for key, value in site['pages'].items() if key in PAGE_KEYS}
    if not site['pages'].get('home', {}).get('blocks'):
        raise ValueError('Keine öffentlichen Home-Inhalte vorhanden.')
    files = {}
    references = {}

    def image_file(data):
        match = re.fullmatch(r'data:(image/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=\s]+)', data)
        if not match:
            raise ValueError('Nicht unterstütztes Bildformat.')
        raw = base64.b64decode(re.sub(r'\s', '', match[2]), validate=True)
        ext, signature = IMAGE_TYPES[match[1]]
        if not raw.startswith(signature):
            raise ValueError('Bildinhalt stimmt nicht mit Dateityp überein.')
        name = 'assets/content/' + hashlib.sha256(raw).hexdigest() + ext
        files[name] = raw
        return name

    def clean(value):
        if isinstance(value, dict):
            # Website people are public editorial records, never member accounts.
            result = {key: clean(item) for key, item in value.items()
                      if key not in {'memberId', 'passwordHash', 'accounts', 'members', 'community'}
                      and not (key == 'email' and not value.get('publishEmail', False))
                      and not (key == 'phone' and not value.get('publishPhone', False))}
            return result
        if isinstance(value, list):
            return [clean(item) for item in value if not isinstance(item, dict) or not item.get('_new')]
        if isinstance(value, str):
            if value.startswith('img:'):
                if value not in references:
                    references[value] = image_file(backup['images'][value])
                return references[value]
            if value.startswith('data:image/'):
                return image_file(value)
        return value

    site = clean(site)
    # Include framing only for images used by public content, never all backup images.
    def used_paths(value):
        if isinstance(value, dict):
            return set().union(*(used_paths(item) for item in value.values())) if value else set()
        if isinstance(value, list):
            return set().union(*(used_paths(item) for item in value)) if value else set()
        return {value} if isinstance(value, str) and value.startswith('assets/') else set()

    paths = used_paths(site)
    site['photoFrames'] = {references.get(ref, ref): frame
                           for ref, frame in source.get('photoFrames', {}).items()
                           if references.get(ref, ref) in paths}
    return site, files


def main():
    backup_path = Path(sys.argv[1]).resolve()
    backup = json.loads(backup_path.read_text())
    site, files = extract(backup)
    output = ROOT / 'assets/data/public-content.js'
    # Public content is data only. Never serialize backup.db or backup.extra.
    output.write_text('// Öffentliche Seiteninhalte und Gestaltung, ohne Konten oder Chats.\n'
                      'window.TFB = window.TFB || {};\nTFB.publicSite = '
                      + json.dumps(site, ensure_ascii=False, separators=(',', ':')) + ';\n')
    for name, data in files.items():
        target = ROOT / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    print(f'{len(site["pages"])} öffentliche Seiten und {len(files)} Bilddateien extrahiert.')


if __name__ == '__main__':
    main()
