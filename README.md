# TFB-Website

## v211 – Konto verschlankt, 17.10.2026

Technische Übergangshinweise und „Bisherige Browserdaten übernehmen“ samt
Bedienaktion aus dem Konto entfernt. Name/Profilbild bleiben; danach folgt direkt
die Mitgliedschaft. Daten und zentraler Abgleich bleiben erhalten. Cache v211.

## Veröffentlicht: v210 – 17.10.2026

Auf Nutzerauftrag: Splash und schlanke zentrale Partnerpflege veröffentlicht,
Zählung ausdrücklich **ausgeschaltet** lassen. Der rote Ball der Splash führt
für angemeldete Admins zu `#partner`; keine neue große Admin-Navigation.
Logo, Marke/Firma, Website, Kontakte, Vertragsstand und Jahresbeitrag pflegen;
300 Euro als Standard, echte Zahlungseingänge pro Beitragsjahr separat erfassen.
Padel-Namen/Logos sind Testbestand ohne übernommene Vertrags-/Zahlungszusagen.

Splash-Texte und Partner werden ab dieser Version zentral gespeichert und sind
nach dem Speichern auf allen Geräten sichtbar. Andere redaktionelle TFB-Seiten
behalten ihren bisherigen lokalen Exportweg. Partnerkontakte und Finanzangaben
werden niemals in die öffentliche Konfiguration übernommen.

**Rotation:** Alle sichtbaren Partner erscheinen einmal pro vollständigem Umlauf,
ohne Gewichtung oder bevorzugte Position. Premium wird ausschließlich zusätzlich
auf der Splash hervorgehoben (maximal zwei aktive Premium-Partner).

**Drei Schritte:** Jetzt Veröffentlichung zum Feinschliff; danach als Vorschlag
an den Vorstand gemeinsamer Betriebsstart TFB/Padel am 01.01.2027 und dann ein
volles Messjahr. Kein automatisches Anschalten am Datum. Nach den ersten drei
Padel-Betriebsjahren gemeinsames Folgekonzept prüfen: nur Padel oder Padel+TFB;
TFB-Banden separat oder Gesamtpaket bleibt offen. Details im Projektgedächtnis.

Nur Migration `0005-partner-management.sql` ist für diesen Live-Schritt nötig.
`0004-partner-visibility.sql` und der Messcode bleiben für Schritt 2 vorbereitet.
`PARTNER_MEASUREMENT_ENABLED=0` schützt auch serverseitig vor vorzeitiger Zählung.
Live-Nachweis und Sicherung liegen privat unter `.private/release-v210/`.

## Lokale Weiterentwicklung v209 – 17.10.2026

Auf neuen Nutzerauftrag umgesetzt, noch nicht veröffentlicht: kühle TFB-Splash
ohne Aktionsbutton, vertraute Textpflege per Stift, roter Ball als ausschließlich
für angemeldete Admins verfügbarer Zugang zur kompakten Partner-Auswertung.
Der bestehende Konto-Adminbereich enthält nur den Textlink „Einstiegsseite ansehen“.
Partnerformate entsprechen jetzt Padel (Inhalt maximal 560 px, auch auf iPads).

Statistik: Seitenaufrufe, geladene Logos, Sichtkontakte (50 % / 1 Sekunde im
aktiven Tab) und Partnerklicks; keine Admin-/Editor-/Präsentationsaufrufe.
Jahresauswahl, CSV und Drucken/PDF, kein zusätzlicher Admin-Menübaum. Die lokale
Vorschau erzeugt keine Besucherzahlen und zeigt keine erfundenen Jahreswerte.
Der zuletzt veröffentlichte Stand bleibt v208, siehe folgenden Abschnitt.

Vor Veröffentlichung der Zählung: TFB-D1 sichern, anschließend ausschließlich
`server/cloudflare/migrations/0004-partner-visibility.sql` auf die TFB-Datenbank
anwenden (nicht das vollständige Schema oder Setup erneut ausführen), Worker
und danach Website veröffentlichen. Einspielung ist additiv und wiederholbar.
Die öffentliche Datenschutzinformation muss die konkrete Statistik beschreiben;
mit diesem lokalen Auftrag wurde kein Tracking live geschaltet.

Neue Prüfungen: `npm run test:partners`, `npm run test:browser:partners`.
Der Browsertest nutzt isolierte synthetische Daten und einen abgefangenen
Test-Ursprung; niemals echte Besuche oder Konten. Weitere technische Details
stehen am Ende des Projektgedächtnisses.

Repository: https://github.com/calvinjohncamp/tfb-website · Zieladresse:
https://joern-kaemper.de. Lokaler Arbeitsordner weiterhin `tfb-kiosk/`.

## Eingefrorener Vorführstand v208 – 16.10.2026

Vom Nutzer bestätigter Stand, Tag `stand-2026-10-16-v208`, Website-Quellstand
`4781aca`, Cache `tfb-kiosk-v208`. Website und geschützter TFB-Server sind veröffentlicht.
Verbindliche Übergabe: [docs/UEBERGABE.md](docs/UEBERGABE.md), ausführlicher Verlauf:
[docs/PROJEKTGEDAECHTNIS.md](docs/PROJEKTGEDAECHTNIS.md).
Weitere Änderungen erst auf neuen Auftrag.

Profilfoto, Bierdeckel, Chats/Kommentare/Anhänge, Gruppen, Verabredungen und
Trainingsserien werden nach Anmeldung auf iPhone/iPad/Desktop zentral abgeglichen.
Zentrale Speicherung gilt auch in der Vorführung; sie ist noch kein freigegebener
Vereins-Abrechnungsbetrieb. Websitebearbeitung und direkter Datei-/localhost-Modus
bleiben lokal. Details: [GERAETEUEBERGREIFENDE_DATEN.md](docs/GERAETEUEBERGREIFENDE_DATEN.md).

Öffentliche Websiteinhalte stammen aus dem gezielten Export in
`assets/data/public-content.js` und `assets/content/`. Ein Git-Push überträgt
keine privaten Browser-Sicherungen oder späteren lokalen CMS-Änderungen.
Vollständige Browser-/D1-Sicherungen bleiben ausschließlich privat unter `.private/`.
Neue D1-Sicherung zum Abschluss v208 erfolgreich wiederhergestellt und geprüft.

## GitHub Pages

Unter Settings → Pages → Build and deployment die Source **GitHub Actions** wählen.
Danach unter Actions den Ablauf **TFB-Website veröffentlichen** mit **Run workflow**
auf `main` starten. Er veröffentlicht ausschließlich die geprüften Webdateien aus
`tools/prepare-pages.py`. Dokumentation, Server, Werkzeuge und Sicherungen werden
nicht in die Website übernommen. Weitere Veröffentlichungen werden ebenfalls
bewusst per Knopf ausgelöst. Die Domain ist bereits verbunden; für normale
Website-Updates sind keine weiteren DNS-Änderungen erforderlich.

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

## Historischer Entwicklungsstand

Die nachfolgenden Beschreibungen dokumentieren frühere Entwicklungsphasen.
Aktuell gilt ausschließlich der eingefrorene Stand v208 in der verlinkten Übergabe.

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

## Historische Zukunftsideen – kein aktueller Arbeitsauftrag

1. Admin-Bereich: Produkte und Gestaltung, Mitgliederliste per Excel-Upload,
   Monatsabschluss mit Export für den Kassenwart (Liste und SEPA-Datei)
2. Supabase-Projekt (sobald ein freier Platz da ist) und Veröffentlichung
   unter einer Subdomain von joern-kaemper.de


## Freigegebene Gestaltung v208

Partnerflächen: auf iPhone/iPad zwei gleich breite Logos über die gesamte
Inhaltsbreite (auch auf großen iPads quer), auf dem Desktop ab 1024 px zusammen
über die halbe Inhaltsbreite. Höhen: iPhone 100 px, Desktop 115 px; iPad 132 px
bzw. auf großen iPads 138 px, nochmals 20 Prozent mehr als v207. Logos bleiben mittig
und unverzerrt eingepasst.

Navigation: alle sieben Bereiche stehen auch auf dem iPhone in einer Zeile.
Der Menüname „Verabreden“ wird zu „Dating“, einschließlich bereits gespeicherter
Standard-Menüeinträge. Individuell anders benannte Einträge bleiben erhalten.
Auf dem iPad hochkant bleiben die größeren Schriften; die Außenkanten sind bündig
und die Abstände gleichmäßig verteilt. Die dezente aktive Markierung ist nur
32 px hoch, während die Tippfläche 44 px behält. Der rote Strich liegt näher am
Begriff und ist mit 2,25 statt 3 px um 25 Prozent dünner.
Geprüft in beiden Farbwelten von 320 bis 1440 px, mit angemeldetem Testkonto.
