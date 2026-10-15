# TFB-Website

Repository: https://github.com/calvinjohncamp/tfb-website · Zieladresse:
https://joern-kaemper.de. Lokaler Arbeitsordner weiterhin `tfb-kiosk/`.

Veröffentlichungsvorbereitung vom 15.10.2026, Cache `tfb-kiosk-v184`.
Die Anwendung bleibt eine Demo mit gerätebezogener Browser-Speicherung.
Im Browser bearbeitete Inhalte/Fotos werden durch einen Git-Push nicht übertragen.
Vor der ersten Veröffentlichung müssen die gewünschten öffentlichen Inhalte und
Bilder aus einer aktuellen Nutzersicherung gezielt übernommen werden. Ein frischer
Browser zeigt sonst eine weitgehend leere Home-Seite. Vollständige Browsersicherungen
mit Konten, Chats oder Mitgliederdaten dürfen nicht ins öffentliche Repository.

## GitHub Pages

Unter Settings → Pages → Build and deployment die Source **GitHub Actions** wählen.
Danach unter Actions den Ablauf **TFB-Website veröffentlichen** mit **Run workflow**
auf `main` starten. Er veröffentlicht ausschließlich die geprüften Webdateien aus
`tools/prepare-pages.py`. Dokumentation, Server, Werkzeuge und Sicherungen werden
nicht in die Website übernommen. Weitere Veröffentlichungen werden ebenfalls
bewusst per Knopf ausgelöst. Die Domain erst nach erfolgreicher GitHub-Vorschau
unter Settings → Pages eintragen und bei IONOS verbinden.

Funktionsprüfungen: `node --test tools/test-backups.mjs tools/test-board-photos.mjs
tools/test-catalog.mjs tools/test-home-features.mjs tools/test-photo-drop.mjs
tools/test-photo-viewer.mjs` sowie `npm run test:browser`.

Die folgenden Abschnitte beschreiben die Entwicklung des Projekts.

Digitale Strichliste und Kiosk der Tennisfreunde Bielstein – als App auf dem Handy.

- Kiosk als Startseite, Shop-Bereich oben
- Persönlicher Bierdeckel, monatliche Abrechnung per SEPA-Lastschrift des Vereins
- Strichliste der letzten 7 Tage für eingeloggte Mitglieder
- Meine Abrechnungen: offener Monatsbetrag und abgeschlossene Monate
- Admin-Bereich: Produkte, Gestaltung, Mitgliederliste (Excel-Upload), Monatsabschluss

Eigenständiges Projekt, strikt getrennt von Padel Bielstein.

**Aktueller Stand, Entscheidungen und offene Punkte:** [`docs/PROJEKTGEDAECHTNIS.md`](docs/PROJEKTGEDAECHTNIS.md)
Mitgliederdaten gehören niemals in dieses Repository.

## Stand

Lokaler Vorführstand vom 13.10.2026, Cache `tfb-kiosk-v183`: Desktop-Fokus,
Galerien/Beitragsübersichten und Wochentagsauswahl für Einladungen. Öffentliche
App-Installation zurückgestellt; kein F auf iPhone/iPad/Android. Letzte eingefrorene
Git-Fassung weiterhin `stand-2026-10-12-v160`; spätere Änderungen uncommittet.
Aktueller Einstieg: [`docs/UEBERGABE.md`](docs/UEBERGABE.md), ausführliches
[`Projektgedächtnis`](docs/PROJEKTGEDAECHTNIS.md).

Im Demo-Modus liegen alle Daten nur im Browser des Geräts. Die gesamte
Datenhaltung läuft über `TFB.api` (`assets/js/demo-backend.js`); für Supabase
wird nur diese Schicht ersetzt.

## Lokal starten

```bash
python3 -m http.server 5180
```

Dann http://localhost:5180 öffnen. Demo-Zugang: `max@tfb-demo.de`
(Passwort beim ersten Mal frei wählen).

## Fokus-Vorführung

Für die Vorstandsvorführung sind der Home-Streifen, seine Bearbeitung und die
Installationsangebote im Konto ausgeblendet. Gespeicherte `site.focusStrip`-Werte
bleiben erhalten, erzeugen aber keinen Streifen mehr. Auch der Fokus-Knopf im
Konto ist entfernt. Die vorhandenen Desktop-Startknöpfe bleiben bestehen.
Desktop-Browser haben stattdessen ein kleines F links neben der Klingel in der
Kopfzeile (auch ohne Anmeldung verfügbar). Es öffnet Fokus bzw. beendet ihn
in der eingebetteten Ansicht. Auf iPhone/iPad/Android und bei primärer
Touch-Bedienung bleibt es ausgeblendet.

„Fokus“ öffnet die aktuelle Seite vor Anthrazit in einer mittigen Ansicht.
Die Geräteauswahl am unteren Rand wählt Desktop/iPad/iPhone; an den seitlichen
Rändern lässt sich die Breite ziehen. Escape oder das Kreuz beendet Fokus.

App-Name: **TF Bielstein**. Alle Website-App-Symbole kommen aus
`assets/brand/tfb-app-icon-source.png` (TFB ohne Ball auf Signature-Anthrazit).
`tools/build-brand.sh` erzeugt daraus PNG-Symbole, Favicon und Windows-Icon.

Der zurückgestellte Installationsentwurf enthält lokale Startknöpfe für Mac/Windows.
Diese benötigen den bestehenden Websiteordner und Chrome (Mac) oder Chrome/Edge
(Windows). Der Mac-Startknopf ist für Apple Silicon gebaut; der Windows-Startknopf
wurde auf diesem Mac nicht ausgeführt. Beide installieren keinen eigenständigen
Website-Datenbestand. Sie öffnen den ausgewählten Websiteordner im Browserprofil.
Die ZIP und CMD liegen unter `assets/downloads/`.
Der Mac-Paketbau erfolgt mit `bash ../Präsentationsmodus/build-tf-bielstein.sh`.
Er signiert das fertige Bundle ad hoc und prüft auch die entpackte ZIP mit
`codesign --verify --deep --strict`. Die App verändert ihr eigenes Bundle beim
Start nicht. Der aktuelle Download heißt `tf-bielstein-mac-v2.zip`.
Ad-hoc-Signatur ist keine Developer-ID-Signatur oder Apple-Notarisierung:
Gatekeeper kann einen Browser-Download weiterhin blockieren. Für öffentliche
native Mac-Downloads sind Developer ID und Notarisierung erforderlich;
die Browser-Installation der Web-App braucht diesen nativen Startknopf nicht.

Der zurückgestellte Entwurf verwendet auf HTTPS bzw. localhost das Web-App-Manifest und,
wenn Chrome/Edge ihn anbieten, den nativen Installationsdialog. Safari bekommt
die Anleitung „Zum Dock hinzufügen“. Ein neues Browserprofil oder eine andere
Adresse übernimmt keine lokalen Demo-Daten automatisch.

Fokus-Test: Vorschau auf `127.0.0.1:5180` starten, dann `npm run test:browser:focus`.
Der Test verwendet ein separates Browserprofil mit Beispieldaten.

## Aufbau

Einladungen: Mo–So vor dem Datum wählen; der nächste passende Termin wird
vorbelegt (heute nur, wenn die gewählte Uhrzeit noch bevorsteht). Bei wöchentlichen
Serien muss ein späteres Startdatum denselben Wochentag haben. In den Seriendetails
steht der Wochentag als eigenes Feld. Einzel/Doppel verwenden dieselbe Datumshilfe,
lassen aber ein beliebiges Datum zu. Prüfung: `npm run test:browser:meet-weekdays`
bei laufender Vorschau auf `127.0.0.1:5180`.

| Datei | Inhalt |
|---|---|
| `index.html` | Gerüst |
| `assets/js/config.js` | Vereinsdaten, Fristen, Einwilligungstext |
| `assets/js/demo-backend.js` | Datenschicht Demo-Modus inkl. Beispieldaten |
| `assets/js/brand-data.js` | Weißes TFB.-Zeichen für Symbole (erzeugt) |
| `assets/js/art.js` | Gezeichnete Produktbilder und Striche |
| `assets/js/app.js` | Oberfläche und Abläufe |
| `assets/css/app.css` | Gestaltung |
| `assets/css/brand.css` | Logo-Bausteine als einfärbbare Masken (erzeugt) |
| `tools/build-brand.sh` | Erzeugt Logo-Bausteine und App-Symbol aus dem Original |
| `sw.js`, `manifest.webmanifest` | Installation als App |

## Nächste Schritte

1. Admin-Bereich: Produkte und Gestaltung, Mitgliederliste per Excel-Upload,
   Monatsabschluss mit Export für den Kassenwart (Liste und SEPA-Datei)
2. Supabase-Projekt (sobald ein freier Platz da ist) und Veröffentlichung
   unter einer Subdomain von joern-kaemper.de
