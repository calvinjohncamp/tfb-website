#!/usr/bin/env python3
"""Spielermeldungen aller TFB-Mannschaften aus nuLiga in assets/data/rosters.js schreiben.

Aufruf (aus dem Ordner tfb-kiosk):  python3 tools/update-rosters.py
Die App gleicht die Namen („Nachname, Vorname“) mit der Mitgliederliste ab: Wer gemeldet ist,
darf in den Insider News und im Mannschaftsporträt seiner Mannschaft schreiben.

Datenschutz: Die Datei enthält Namen und bleibt deshalb LOKAL (steht in .gitignore).
Im Echtbetrieb übernimmt ein Serverdienst den Abgleich; die Namen landen nur in der Datenbank.
"""
import html, http.cookiejar, json, re, sys, time, urllib.request
from datetime import datetime
from pathlib import Path

BASE = 'https://tvm.liga.nu/cgi-bin/WebObjects/nuLigaTENDE.woa/wa/'
ENTRY = BASE + 'clubInfoDisplay?federation=TVM&region=DE.WE.TVM.40&targetFed=TVM&club=35703&tab=4'
ROOT = Path(__file__).resolve().parent.parent

def team_key(name):
    """Gleicher Schlüssel wie in der App (site.js teamKey): ohne „(4er)“, Umlaute umschreiben."""
    k = re.sub(r'\(.*?\)', '', name).strip().lower()
    for a, b in (('ä', 'ae'), ('ö', 'oe'), ('ü', 'ue'), ('ß', 'ss')):
        k = k.replace(a, b)
    return re.sub(r'[^a-z0-9]+', '-', k).strip('-')

def main():
    teams = json.loads((ROOT / 'assets/data/teams.js').read_text().split('TFB.teams = ', 1)[1].rstrip().rstrip(';'))
    jar = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    op.addheaders = [('User-Agent', 'Mozilla/5.0 (TFB-Kiosk Prototyp)')]
    op.open(ENTRY, timeout=20).read()                     # nuLiga braucht eine Sitzung
    rosters = {}
    for season in teams['seasons']:
        for t in season['teams']:
            page = op.open(t['teamUrl'], timeout=20).read().decode('utf-8', 'ignore')
            names = [html.unescape(x).strip() for x in re.findall(r'rel="ibox[^"]*"[^>]*>([^<]+)</a>', page)]
            key = team_key(t['name'])
            rosters[key] = sorted(set(rosters.get(key, [])) | set(names))
            time.sleep(0.3)
    out = ROOT / 'assets/data/rosters.js'
    out.write_text('// Automatisch erzeugt von tools/update-rosters.py – NICHT ins Repository (enthält Namen).\n'
                   'window.TFB = window.TFB || {};\nTFB.rosters = ' + json.dumps(
                       {'updated': datetime.now().strftime('%d.%m.%Y'), 'teams': rosters}, ensure_ascii=False, indent=1) + ';\n')
    print(f'{len(rosters)} Mannschaften, {sum(len(v) for v in rosters.values())} Meldungen → {out}')

if __name__ == '__main__':
    main()
