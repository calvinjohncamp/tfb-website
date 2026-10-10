#!/usr/bin/env python3
"""Mannschaften der Tennisfreunde Bielstein aus nuLiga (TVM) in assets/data/teams.js schreiben.

Aufruf (aus dem Ordner tfb-kiosk):  python3 tools/update-teams.py
Später übernimmt das ein täglicher Serverdienst; bis dahin ist dies der Datenstand der Demo.
Es werden nur Mannschaft, Liga, Mannschaftsführer, Platz und Punkte übernommen –
Spielerlisten bleiben bei nuLiga (verlinkt).
"""
import html, http.cookiejar, json, re, sys, urllib.request
from datetime import datetime
from pathlib import Path

BASE = 'https://tvm.liga.nu/cgi-bin/WebObjects/nuLigaTENDE.woa/wa/'
CLUB = '35703'  # TFB Bielstein (Vereinsnummer 4203)
ENTRY = BASE + f'clubInfoDisplay?federation=TVM&region=DE.WE.TVM.40&targetFed=TVM&club={CLUB}&tab=4'

def fetch():
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    opener.addheaders = [('User-Agent', 'Mozilla/5.0 (TFB-Kiosk Prototyp)')]
    opener.open(ENTRY, timeout=20).read()          # nuLiga braucht eine Sitzung
    return opener.open(BASE + f'clubTeams?club={CLUB}', timeout=20).read().decode('utf-8', 'ignore')

def text(fragment):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', fragment))).strip()

def parse(page):
    seasons, season, league = [], None, None
    for row in re.findall(r'<tr[^>]*>(.*?)</tr>', page, re.S):
        cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.S)
        plain = [text(c) for c in cells]
        team_link = re.search(r'href="([^"]*teamPortrait[^"]*)"', row)
        if team_link and len(cells) >= 5 and season is not None:
            group_link = re.search(r'href="([^"]*groupPage[^"]*)"', row)
            season['teams'].append({
                'name': re.sub(r'\s+', ' ', plain[0]), 'captain': plain[1], 'group': plain[2],
                'rank': plain[3], 'points': plain[4], 'league': league,
                'teamUrl': html.unescape(BASE + team_link.group(1).split('/wa/')[-1]),
                'groupUrl': html.unescape(BASE + group_link.group(1).split('/wa/')[-1]) if group_link else '',
            })
        else:
            h2 = re.search(r'<h2>(.*?)</h2>', row, re.S)
            strong = re.search(r'<strong>(.*?)</strong>', row, re.S)
            if h2:                                   # z. B. "Sommer 2026"
                season = {'season': text(h2.group(1)), 'teams': []}
                seasons.append(season)
                league = None
            elif strong and season is not None:      # z. B. "Rechtsrheinisch Sommer 2026"
                league = text(strong.group(1))
    return [s for s in seasons if s['teams']]

if __name__ == '__main__':
    seasons = parse(fetch())
    if not seasons:
        sys.exit('Keine Mannschaften gefunden – nuLiga-Layout geändert? Datenstand bleibt unverändert.')
    out = Path(__file__).resolve().parent.parent / 'assets/data/teams.js'
    data = {'source': BASE + f'clubTeams?club={CLUB}', 'updated': datetime.now().strftime('%d.%m.%Y'), 'seasons': seasons}
    out.write_text('// Automatisch erzeugt von tools/update-teams.py – nicht von Hand bearbeiten.\n'
                   'window.TFB = window.TFB || {};\nTFB.teams = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    print(f"{sum(len(s['teams']) for s in seasons)} Mannschaften in {len(seasons)} Wettbewerben → {out}")
