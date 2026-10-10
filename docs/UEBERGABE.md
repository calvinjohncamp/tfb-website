# TFB – Übergabe für die nächste Sitzung

**Zuerst lesen.** Diese Datei ist kurz und wird bei jedem Sitzungsende neu
geschrieben. Ausführliche Entscheidungen und den Verlauf enthält
[`PROJEKTGEDAECHTNIS.md`](PROJEKTGEDAECHTNIS.md).

Stand: **10.10.2026** · Branch `main` · letzter eingefrorener Stand: Tag `stand-2026-10-09`

## In einem Satz

Eigenständige Handy-App der **Tennisfreunde Bielstein** mit Kiosk/Strichliste
(Startseite), Vereinswebsite (Aktuell · Sport · Verein) und der Vorführung
**Treffen**. Sie läuft im **Demo-Modus**, alle Daten bleiben im Browser.
Ziel ist eine Vorführung vor dem Vorstand.

## Starten

- Per Doppelklick: `9. TFB-Kiosk/TFB-Kiosk öffnen.html` (öffnet `#kiosk`)
- Vorschau-Server: `.claude/launch.json` → „tfb-kiosk“ (Port 5180)
- Demo-Zugang: `max@tfb-demo.de` (Admin), Passwort beim ersten Anmelden frei wählen
- Nach Änderungen an JS/CSS die Cache-Version in `sw.js` hochzählen (aktuell `tfb-kiosk-v41`)

## Feste Regeln (nie brechen)

1. **Strikt getrennt von Padel.** Die Padel-Kopie im Elternordner nur lesen.
   Ihr Push-Ziel ist absichtlich `KEIN_PUSH_padel-vorlage`. Die Padel-Supabase
   (`hioaqcwqzeqcvvikollq`) niemals beschreiben.
2. **Keine Mitgliederdaten ins Repo** (`.gitignore`: `*.xlsx`, `*.csv`, `.env*`),
   keine Kontaktdaten einzelner Personen von der alten Vereinsseite.
3. Abrechnung **monatlich per SEPA-Lastschrift des Vereins, kein Stripe.**
4. Muss unter `file://` laufen: kein Build und keine Ressourcen, die CORS brauchen.
5. Hit Journey Player: nur ansehen, nichts verändern.
6. Downloads nur nach Zustimmung des Nutzers.

## Aufbau in 30 Sekunden

| Datei | Aufgabe |
|---|---|
| `assets/js/config.js` | Einstellungen, Schalter `features.treffen` |
| `assets/js/demo-backend.js` | Datenschicht `TFB.api` (localStorage). Wird später durch Supabase ersetzt |
| `assets/js/app.js` | Gerüst, Kopf/Menü, Kiosk, Strichliste, Abrechnungen, Verwaltung, `TFB.ui` |
| `assets/js/site.js` | Website-Seiten aus Bausteinen, Bearbeiten, Foto-Upload, Mannschaften |
| `assets/js/meet.js` | Treffen (eigenständig und entfernbar), Speicher `tfb_meet_demo_v1` |
| `assets/js/art.js` | gezeichnete Produktsymbole |
| `assets/js/partner-rotation.js` | Partner-Duo je Seite (Logik aus Padel) |
| `assets/data/*` | Partner, Mannschaften (nuLiga), Startinhalte der Website |
| `assets/css/app.css` | gesamte Gestaltung inkl. Raster (640 / 1024 / 1280 px) |
| `tools/update-teams.py` | Mannschaften aus nuLiga holen |
| `tools/build-brand.sh` | Logo-Varianten erzeugen |

## Wo wir gerade stehen

- Kiosk, Website-Gerüst und Raster für alle Geräte sind fertig und abgenommen.
- **Treffen**: Die Vorführung steht (Einladung → WhatsApp-Link → Zusage per Tipp).
  Ehrliche Bewertung vom 10.10.: Als reiner WhatsApp-Link ist das eine Krücke.
  Für eine einzelne Gruppe ist die WhatsApp-Umfrage besser.
  Der Nutzer will die Idee trotzdem behalten und weiterdenken als
  **Gruppen-Verabredung in der installierten App** (Tabelle mit allen
  Teilnehmern, Zugesagt / Abgesagt / Offen, Push-Mitteilungen).
  **Als Vorführung umgebaut (10.10.):** Gruppen, Training/Einzel/Doppel,
  Teilnehmer-Tabelle, Ersatzbank mit Nachrücken, Mitteilungs-Vorschau.
  Details siehe Projektgedächtnis, Abschnitt „Treffen 2.0“. Echte Push-Mitteilungen
  brauchen Supabase, Veröffentlichung und Web-Push.

## Nächste Schritte (Vorschlag)

1. Feedback des Nutzers zu Treffen 2.0 einarbeiten.
2. Foto der Papier-Strichliste → echtes Sortiment und Preise.
3. Ab ca. Ende Oktober 2026: Supabase (eigenes Projekt), Veröffentlichung auf
   `kiosk.joern-kaemper.de`, Mitglieder-Import, Monatsabschluss/SEPA.

## Arbeitsweise mit dem Nutzer

- Deutsch, klare und ehrliche Einschätzungen statt Schönfärberei.
- Gestaltung in kleinen Schritten, jede Änderung im Browser prüfen und mit Screenshot belegen.
- Bei Aussagen wie „erst Feedback, nicht programmieren“ wirklich nur beraten.
- Am Sitzungsende diese Datei und den Verlauf im Projektgedächtnis aktualisieren, dann committen.
