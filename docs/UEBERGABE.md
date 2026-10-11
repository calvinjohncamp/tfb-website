# TFB – Übergabe für die nächste Sitzung

**Zuerst lesen.** Diese Datei ist kurz und wird bei jedem Sitzungsende neu
geschrieben. Ausführliche Entscheidungen, Konzepte und den Verlauf enthält
[`PROJEKTGEDAECHTNIS.md`](PROJEKTGEDAECHTNIS.md).

Stand: **10.10.2026, Sitzungsende** · Branch `main` · eingefroren: Tag `stand-2026-10-10-abend`
(früher: `stand-2026-10-09`, `stand-2026-10-10`)

## In einem Satz

Eigenständige Handy-App und Vereinswebsite der **Tennisfreunde Bielstein (TFB)** –
Startseite **Home**, **Kiosk** mit digitaler Strichliste, **Aktuell · Sport (mit
Team-Seiten) · Club**, **Verabreden** und Link zu **Padel**. Läuft im **Demo-Modus**
(alle Daten im Browser). Ziel: Vorführung vor dem Vorstand. Der Nutzer ist sehr
zufrieden („richtig schicke Seite“) und will als Nächstes **echte Bilder und Texte** einpflegen.

## Starten

- Per Doppelklick: `9. TFB-Kiosk/TFB-Website öffnen.html` oder `TFB-Kiosk öffnen.html` –
  beide öffnen **Home**. Jeder neue Aufruf landet auf Home (Ausnahmen: Neu laden, Links wie `#treffen/<id>`).
- **Offline getestet** (echtes Chrome, `file://`, ohne Internet): Texte und Fotos bleiben
  nach Neustart erhalten. Daten liegen nur in diesem Browser auf diesem Mac →
  regelmäßig **Verwaltung → Sichern & Laden** (eine JSON-Datei mit allem inkl. Fotos, in die Dropbox legen).
  Nach dem Speichern Chrome nicht sofort hart beenden (localStorage schreibt verzögert).
- Präsentieren: vom Mac offline möglich; auf dem iPad erst nach Veröffentlichung.
- Vorschau-Server: `.claude/launch.json` → „tfb-kiosk“ (Port 5180) – hat **eigene** Daten, nicht die aus Chrome.
- Demo-Zugang: `max@tfb-demo.de` (Admin), Passwort beim ersten Anmelden frei wählen.
- Nach Änderungen an JS/CSS die Cache-Version in `sw.js` hochzählen (aktuell `tfb-kiosk-v45`).

## Feste Regeln (nie brechen)

1. **Strikt getrennt von Padel.** Die Padel-Kopie im Elternordner nur lesen.
   Ihr Push-Ziel ist absichtlich `KEIN_PUSH_padel-vorlage`. Die Padel-Supabase
   (`hioaqcwqzeqcvvikollq`) niemals beschreiben.
2. **Keine Mitgliederdaten ins Repo** (`.gitignore`: `*.xlsx`, `*.csv`, `.env*`),
   keine Kontaktdaten einzelner Personen von der alten Vereinsseite.
3. Abrechnung **monatlich per SEPA-Lastschrift des Vereins, kein Stripe.**
4. Muss unter `file://` laufen: kein Build und keine Ressourcen, die CORS brauchen.
5. Hit Journey Player: nur ansehen, nichts verändern.
6. Downloads nur nach Zustimmung des Nutzers; keine Bilder fremder Seiten verwenden.

## Aufbau in 30 Sekunden

| Datei | Aufgabe |
|---|---|
| `assets/js/config.js` | Einstellungen, Schalter `features.treffen` |
| `assets/js/demo-backend.js` | Datenschicht `TFB.api` (localStorage + IndexedDB für Fotos), Sichern/Laden, Profil. Wird später durch Supabase ersetzt |
| `assets/js/app.js` | Gerüst, Kopf/Menü, Kiosk, Strichliste, Abrechnungen, Account-Karte, Verwaltung (Schrift, Farbe, Sichern), `TFB.ui` |
| `assets/js/site.js` | Home (Themen + Unterseiten), Aktuell/Sport/Club aus Bausteinen, Bearbeiten, Foto-Upload, Mannschaften, Team-Seiten |
| `assets/js/meet.js` | Verabreden (eigenständig, abschaltbar), Speicher `tfb_meet_demo_v2` |
| `assets/js/art.js` | gezeichnete Produktsymbole |
| `assets/js/partner-rotation.js` | Partner-Duo je Seite (Logik aus Padel) |
| `assets/data/*` | Partner, Mannschaften (nuLiga), Startinhalte der Website (`site-seed.js`) |
| `assets/home/` | Padel-Vorschaubild für den Link |
| `assets/css/app.css` | gesamte Gestaltung inkl. Raster (640 / 1024 / 1280 px) |
| `tools/update-teams.py` | Mannschaften aus nuLiga holen |
| `tools/update-rosters.py` | Spielermeldungen aus nuLiga → `assets/data/rosters.js` (nur lokal, nicht im Repo) für den Abgleich Spieler ↔ Mitglieder |
| `tools/build-brand.sh` | Logo-Masken erzeugen (u. a. Logo ohne Ball + Ball einzeln) |

## Was steht (Überblick)

- **Kopf:** TFB-Logo mit **Ball in Signal-Rot** (führt zu Home), Profilbild rechts. Menü
  KIOSK (immer rot) · AKTUELL · SPORT · CLUB · VERABREDEN · PADEL; aktiver Bereich mit rotem Strich.
  Desktop: Menüschrift .74rem wie im Hochformat, großzügige Abstände.
- **Home:** drei Themen (Padel · Kiosk · 50 Jahre) mit Bild breit/hoch/quadratisch, Kicker mit
  roter Nummer, Überschrift, rote Unterzeile, kurzer Text, **„Mehr erfahren“** und **dezenter Link**
  (Pille; wählbar Dezent/Knopf/Vorschau-Karte). Unterseite `#home/<id>` im Magazin-Stil:
  Titelbild mit Überschrift, rote Initiale, Zitat, **Fotokollage** mit Großansicht.
  Startmotive gezeichnet, bis echte Fotos da sind. Texte = Beispiele.
- **Editor (WYSIWYG):** Stift oben rechts (nur Admins), Knöpfe im Text für ↗ Link, Fett, Zwischenüberschrift.
- **Kiosk:** Bierdeckel „Stapel“, Sortiment mit eigenen Symbolen, Strichliste 7 Tage, Abrechnungen, Storno 30 s.
- **Sport:** Mannschaften aus nuLiga → eigene **Team-Seite** je Mannschaft (Teamfoto, Platz/Punkte/
  Mannschaftsführer, nuLiga-Link, bis zu 10 Beiträge; schreiben: Admins, später Mannschaftsführer).
- **Club** (früher „Verein“), **Aktuell** mit Terminen und Beiträgen.
- **Verabreden:** Gruppen, Training/Einzel/Doppel/Anderes, Teilnehmer-Tabelle (✓ rot · offen grau ·
  ✗ schwarz), Ersatzbank mit Nachrücken, Profilbilder, Mitteilungs-Vorschau. Details später.
- **Account-Karte** nach Vorbild der Padel-App: Mitgliedschaft und Kiosk-Freischaltung mit Häkchen,
  Heute/Monat/Einzug, Angaben, Benachrichtigungen, Profilbild, Verwaltung (nur Admins), Abmelden,
  „Als App aufs Handy“ ganz unten.
- **Verwaltung:** Website bearbeiten, Kiosk bearbeiten, **Schrift (Test)** mit 16 Schriften,
  Markenfarbe, **Sichern & Laden**.

## Schriften und Farben (Kurzfassung, Details im Projektgedächtnis)

- **Grundschrift** fest: Systemschrift (SF Pro / Segoe UI / Roboto) – fast alles.
- **Auszeichnungsschrift** wählbar (`--serif`): Standard „Modern (System)“ – Überschriften, Zahlen, Beträge, Zitate.
- **Handschrift** fest: Bradley Hand – Bierdeckel-Datum, Strichlisten-Namen.
- Farben: **Kreideweiß** `#FBFBF8` (Hintergrund) · **Anthrazit** `#2A2D2E` (Markenfarbe, wählbar) ·
  **Sandplatz-Rot** `#C4553A` (Signal, fest) · Schrift `#1C2520`/`#6A7069` · Linien `#E5DDCD`.

## Nächste Schritte (Vorschlag)

1. **Nutzer pflegt echte Inhalte ein** (Fotos, Texte, Unterseiten, Teamfotos) – danach Feinschliff.
2. Schrift entscheiden (1–2 Favoriten); Google-Schrift dann selbst ausliefern (Datenschutz, offline).
3. CSS aufräumen: Altlasten (`--green`, Karton-Farben) entfernen, Farben auf ~10 feste Werte.
4. Verabreden: Details nach Rückmeldung.
5. Foto der Papier-Strichliste → echtes Sortiment und Preise.
6. Ab ca. Ende Oktober 2026: Supabase (eigenes Projekt), Veröffentlichung auf
   `kiosk.joern-kaemper.de`, Mitglieder-Import, Monatsabschluss/SEPA, automatische Link-Vorschau,
   Mannschaftsführer-Rechte, echte Push-Mitteilungen.

## Arbeitsweise mit dem Nutzer

- Deutsch, klare und ehrliche Einschätzungen statt Schönfärberei.
- Gestaltung in kleinen Schritten, jede Änderung im Browser prüfen (Handy- und Desktop-Breite) und mit Screenshot belegen.
- Der Nutzer arbeitet oft mit schmalem Vorschaufenster – für Screenshots Viewport emulieren.
- Bei Aussagen wie „erst Feedback, nicht programmieren“ wirklich nur beraten.
- Am Sitzungsende diese Datei und den Verlauf im Projektgedächtnis aktualisieren, dann committen.
