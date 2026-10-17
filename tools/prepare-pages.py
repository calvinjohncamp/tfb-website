"""Stage only versioned website assets; never publish browser backups or server data."""
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / '_site'
ENTRY_FILES = {
    'index.html', 'praesentation.html', 'mitgliedschaft-bestaetigen.html',
    'manifest.webmanifest', 'sw.js',
}
ASSET_TYPES = {'.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif',
               '.ico', '.ttf', '.woff', '.woff2', '.txt', '.zip', '.cmd'}

tracked = subprocess.check_output(
    ['git', 'ls-files', '-z'], cwd=ROOT).decode().split('\0')
# Explicit public startup asset, including during local release preparation.
tracked = sorted(set(tracked) | {'assets/js/cloud-sync.js', 'assets/js/partner-visibility.js', 'assets/js/partner-content.js', 'assets/js/partner-admin.js', 'assets/css/partner-visibility.css'})
selected = []
for name in tracked:
    path = Path(name)
    if name in ENTRY_FILES or (
        name.startswith('assets/') and path.suffix.lower() in ASSET_TYPES
        and name != 'assets/data/rosters.js'
        and not any(part.startswith('.') for part in path.parts)
    ):
        if (ROOT / path).is_symlink():
            raise RuntimeError('Symbolische Verknüpfung nicht erlaubt: ' + name)
        selected.append(name)

if not ENTRY_FILES.issubset(selected):
    raise RuntimeError('Einstiegsdateien fehlen: ' + str(ENTRY_FILES - set(selected)))

if DEST.exists():
    shutil.rmtree(DEST)
for name in selected:
    target = DEST / name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / name, target)
(DEST / '.nojekyll').touch()
# The player list is deliberately local-only; omit its optional script online.
index = DEST / 'index.html'
index.write_text(re.sub(
    r'  <!-- Spielermeldungen aus nuLiga:[^\n]*-->\n  <script src="assets/data/rosters.js"></script>\n',
    '', index.read_text()))

# Every locally referenced startup resource must be part of the publication.
for page in ENTRY_FILES & {'index.html', 'praesentation.html', 'mitgliedschaft-bestaetigen.html'}:
    for ref in re.findall(r'(?:src|href)=["\']([^"\']+)', (DEST / page).read_text()):
        if ref.startswith(('http:', 'https:', '#', 'mailto:', 'tel:')):
            continue
        local = ref.split('#')[0].split('?')[0]
        if local == 'assets/data/rosters.js':  # Optional local-only player list.
            continue
        if local and not (DEST / local).is_file():
            raise RuntimeError('Webdatei fehlt: ' + ref)
for ref in re.findall(r"'\./([^']+)'", (DEST / 'sw.js').read_text()):
    local = ref.split('#')[0].split('?')[0]
    if not (DEST / local).is_file():
        raise RuntimeError('Offline-Datei fehlt: ' + ref)
print(f'{len(selected)} Webdateien für GitHub Pages vorbereitet.')
