# TFB-Website

## Zentrale Redaktion v232 – Freischaltung in Arbeit

Geräteübergreifende Inhalte, versionierte Stände und portable ZIP-Sicherungen sind
lokal implementiert und getestet. Live-Nachweis folgt nach Backend-Initialisierung.
Details und Betriebsanleitung: [Zentrale Redaktion](docs/ZENTRALE_REDAKTION.md).


## Linksbündige Spaltenüberschriften v231 – 25.10.2026

Überschriften der Strichliste passend zu den Strichen ebenfalls linksbündig.
Unveränderte Spalten und Buchungen. Cache v231. Beide Farbwelten bei 21 Breiten
von 320 bis 1920px geprüft: Überschriften und Striche linksbündig,
keine überlappenden Überschriften; Desktop/Handy visuell kontrolliert.
v231 veröffentlicht: Quellstand `ffa7d1cc99046c4f4f865af546272bca047457b2`,
[Pages-Lauf 40196259659](https://github.com/calvinjohncamp/tfb-website/actions/runs/40196259659)
erfolgreich. CSS und Service Worker live bytegleich;
Nachweis `.private/release-v231/live-check.json`.


## Linksbündige Striche v230 – 25.10.2026

Alle Striche innerhalb ihrer Kategorien linksbündig statt zentriert.
Spaltenüberschriften bleiben unverändert. Cache v230. 42 Ansichten in beiden
Farbwelten geprüft: gleicher linker Beginn pro Spalte, unveränderte Überschriften
und kleinere Namensschrift; Desktop/Handy visuell kontrolliert.
v230 veröffentlicht: Quellstand `9c20c5d11f625bfa42b9078f04e4694235f9e1dc`,
[Pages-Lauf 40196125709](https://github.com/calvinjohncamp/tfb-website/actions/runs/40196125709)
erfolgreich. CSS und Service Worker live bytegleich;
Nachweis `.private/release-v230/live-check.json`.


## Strichlisten-Begriffe v229 – 25.10.2026

Spaltenüberschriften heißen jetzt „Match“ und „Shop“ (Schläger/Bälle),
jeweils als vollständiger Begriff ohne Abkürzung und auch in den zugänglichen
Spaltenbezeichnungen. Unveränderte Kategorien und Buchungen. Cache v229.
v229 veröffentlicht: Quellstand `d1a912463d1119fc112e69c1bf29e031d6efcfff`,
[Pages-Lauf 40195817149](https://github.com/calvinjohncamp/tfb-website/actions/runs/40195817149)
erfolgreich. App und Service Worker live bytegleich; 42 Ansichten auf passende
Spaltenüberschriften geprüft. Nachweis `.private/release-v229/live-check.json`.


## Strichlisten-Typografie v228 – 25.10.2026

Namensschrift auf allen Größen um rund 22% reduziert: .875rem Desktop,
.76rem schmal, .72rem sehr schmal. Die Spaltenüberschriften wählen Lang-/Kurzform
jetzt anhand ihrer tatsächlichen Spaltenbreite statt nur der gesamten Liste.
Schrift passt sich der Spalte an; Umbruch bleibt als Absicherung möglich.
„Spiel“/„Equip.“ bei wenig Platz, vollständiger Name als Titel. Mobile Spalten
für kurze Überschriften ausbalanciert; Striche und Überschriften bleiben bündig.
Keine Daten-/Funktionsänderung. Cache v228. In beiden Farbwelten bei 21 Breiten
von 320 bis 1920px geprüft: Textrechtecke innerhalb der eigenen Spalte,
Abstand zwischen allen Überschriften, kein horizontaler Überlauf und
Schriftreduktion im gewünschten Bereich. Desktop/Handy visuell kontrolliert.
v228 veröffentlicht: Quellstand `bc6a0cd1de8fc4656b0203fffe87c25172e3c958`,
[Pages-Lauf 40195511185](https://github.com/calvinjohncamp/tfb-website/actions/runs/40195511185)
erfolgreich. App, CSS und Service Worker live HTTP 200/bytegleich geprüft;
Nachweis `.private/release-v228/live-check.json`.


## Bereinigte Strichliste v227 – 25.10.2026

Doppelte Namen aus unterschiedlichen Verzeichniseinträgen werden für die
Vorführliste zusammengefasst (Unicode, Groß-/Kleinschreibung und Leerzeichen
normalisiert). Der Name des angemeldeten Mitglieds wird vollständig aus den
Vorführzeilen ausgeschlossen: Nur die echte eigene Buchungszeile bleibt stehen.
Weiter 20 unterschiedliche Namen, alphabetisch gemischt und mit eigener Zeile
in der Mitte. Keine Konten gelöscht, keine Buchungen geändert. Sync-Kennung tally3.

„Beispiel“ aus Namensmarkierungen und Detailkategorien entfernt; der lange
Vorführhinweis ist durch einen kurzen Abrechnungshinweis ersetzt. Einheitliche
Namensschrift, etwas mehr Zeilenabstand, dezente eigene Markierung, linksbündiger
Hinweis. Cache v227. 13 Backendtests und isolierter Browser mit gezielten
Dubletten, 20 unterschiedlichen Namen, echten Käufen/Beträgen sowie Darstellung
bei 320/390/834/1100px und Reload erfolgreich; Desktop/Handy visuell geprüft.
v227 veröffentlicht: Quellstand `f8473c250197b72633e7183f0d4c8d7dd552f1fd`,
[Pages-Lauf 40195167099](https://github.com/calvinjohncamp/tfb-website/actions/runs/40195167099)
erfolgreich. Worker `a854f00e-e5a2-413f-8b5c-ca4478db0f96` veröffentlicht.
App, CSS und Service Worker live HTTP 200/bytegleich geprüft;
Nachweis `.private/release-v227/live-check.json`.


## Kiosk-Seitentitel v226 – 25.10.2026

Oben im Kiosk steht jetzt „Kiosk“ im selben Seitentitel-Stil wie der Chat
(`view-head page-head`), mit 28px Abstand zum bestehenden Bierdeckel/Sortiment.
Reihenfolge und Funktionen unverändert. Cache v226. Schriftfamilie, Größe und
Gewicht gegen Chat bei 320/390/834/1100/1440px verglichen; Desktop/Handy visuell
geprüft. v226 veröffentlicht: Quellstand `190402fe2cb3664a13b692e2aea871b066691e64`,
[Pages-Lauf 40194972087](https://github.com/calvinjohncamp/tfb-website/actions/runs/40194972087)
erfolgreich; App, CSS und Service Worker live HTTP 200/bytegleich geprüft.
Nachweis `.private/release-v226/live-check.json`.


## Strichlisten-Mix – 25.10.2026

Die 19 Beispielpersonen werden jetzt über das gesamte Alphabet verteilt gewählt:
neun alphabetisch vor dem angemeldeten Mitglied, zehn dahinter (bei ausreichendem
Bestand auf beiden Seiten). Innerhalb beider Bereiche gleichmäßig verteilte Namen
statt der ersten 19 Einträge. Dadurch steht Jörn alphabetisch korrekt in der Mitte
der 20 Personen. Eigene Zeile weiter ausschließlich echte Buchungen; keine
Beispielbuchungen in Abrechnungen. Neue Sync-Kennung aktualisiert die Auswahl auch
in bereits geöffneten Sitzungen. Nur Backendänderung; Website-Cache bleibt v225.
13 Backendtests und isolierter Browser mit alphabetischer Streuung, eigener Zeile
an Position 10, echten Käufen/Beträgen und Reload erfolgreich.
Veröffentlicht: Worker `3a67e467-d4ad-467c-97e1-28fcadc4f3d5`,
Quellstand `71eb12a`. Bestehendes D1-Binding erhalten, Messung weiterhin aus.
Keine erneute Pages-Veröffentlichung für diese Backendkorrektur erforderlich.


## Abstände v225 – 25.10.2026

Sponsorenüberschriften haben auf allen Inhaltsseiten einheitlich 32px Abstand
zum vorherigen Inhalt, linksbündige Ausrichtung und 10px Abstand zu den Logos.
Die gemeinsame Partner-CSS ersetzt die bisherige enge 8px-Desktopregel.
Dating-Erklärungstexte stehen mit 18px Abstand vor den Karten; der Kontohinweis
ist linksbündig und hat 24px Abstand zu den Gruppen. Keine Funktionsänderung.
Cache v225. Prüfung: Sponsorenplatzierung in 10 Ansichten (Home, Kiosk,
Strichliste, Abrechnung, Chat, Aktuell, Sport, Sport/Training, Club, Dating)
bei 320/390/834/1100/1440px ausgemessen; Dating auf Desktop/Handy visuell geprüft.
v225 veröffentlicht: Quellstand `a5a4d52ffb5c2d1f1f99068d8ed38b99411b5e0f`,
[Pages-Lauf 40194476494](https://github.com/calvinjohncamp/tfb-website/actions/runs/40194476494)
erfolgreich. Dating-Code, beide CSS-Dateien und Service Worker live HTTP 200 und
bytegleich geprüft. Nachweis `.private/release-v225/live-check.json`.


## Einheitliches Verabreden v224 – 25.10.2026

Alle vier oberen Einstiege (Einzel, Doppel, Training, Mannschafts-Spiel) verwenden
jetzt dieselbe Einladungsmaske, standardmäßig einmalig. „Trainingsserie anlegen“
im regelmäßigen Bereich öffnet dieselbe Maske mit „Jede Woche“. Die Häufigkeit
bleibt in beiden Richtungen umschaltbar. Keine automatisch ausgewählte erste Gruppe.
Der Gruppen-Dialog bietet „Diese Gruppe zum Training einladen“ mit dieser Gruppe
als vorausgewählter Spielerliste. Gruppen selbst enthalten weiter nur Name/Mitglieder.

Alle Einladungsarten erlauben mehrere Gruppen und zusätzliche Einzelspieler.
Überlappende Spieler erscheinen nur einmal. Manuell hinzugefügte Personen bleiben
beim Abwählen einer Gruppe erhalten; einzelne Gruppenmitglieder können aus der
Einladung entfernt werden. Namen, Ort, Zeiten und weitere Angaben bleiben beim
Wechsel der Auswahl/Häufigkeit erhalten. Sekundäre Angaben (Treffen, Abfahrt,
Notiz und optionale Mannschafts-Platzzahl) sind unter „Weitere Angaben“ eingeklappt.
Gruppenknöpfe haben mindestens 44px Höhe und zeigen bei Auswahl die gewählte
Personenzahl innerhalb dieser Gruppe. Gruppenbestätigung und Terminzusage sind
auch sprachlich getrennt.

Neue Termine/Serien speichern die ausdrücklich angezeigte Personenauswahl mit
`groupId:null`; Gruppen dienen als Auswahlhilfe und werden beim Einladen nicht
verändert. Damit überschreibt die alte Bindung an genau eine Gruppe beim Erzeugen
der Serientermine keine zusätzlichen Spieler oder individuellen Ausschlüsse mehr.
Die Auswahl gilt für die angelegte Einladung/Serie; spätere Gruppenänderungen
verändern sie nicht automatisch. Alte gruppengebundene Serien bleiben erhalten.
Kein Backend-/Schema-/Datenupdate erforderlich; v223-Worker bleibt bestehen.
Cache v224. Kiosk und Home-Anmeldung unverändert.

Prüfungen: 13 Backendtests; vorhandene Browserprüfungen für Geräteabgleich,
Gruppenbestätigung, Wochentage/Serienstart/Zeitumstellung und v223-Feinschliff.
Neue Prüfung `node tools/test-browser-invitation-ux.mjs`: alle vier Arten,
einmaliger und wöchentlicher Einstieg, überlappende Gruppen, zusätzliche/entfernte
Spieler, erhaltene Eingaben, unveränderte Gruppen, zentral erzeugte Termine und
Neuladen sowie Darstellung von 320 bis 1100px. Ausschließlich synthetische Daten.
Veröffentlicht: Quellstand `f81a13c1dbfb0107a8c57a7368d5288fc0f8f2f5`,
[Pages-Lauf 40194126066](https://github.com/calvinjohncamp/tfb-website/actions/runs/40194126066)
erfolgreich. Dating-Code, CSS und Service Worker live HTTP 200/bytegleich geprüft;
Nachweis `.private/release-v224/live-check.json`. Worker unverändert v223.


## Feinschliff v223 – 25.10.2026

Nach erfolgreicher Anmeldung immer direkt Home. Gruppen in Dating 2.0 enthalten
bei Neuanlage nur Name und Mitglieder. Alte Trainingsvorgaben bleiben kompatibel
erhalten, werden aber in den Gruppen nicht mehr angezeigt. Der immer sichtbare
Bereich „Regelmäßige Trainingsgruppen“ bietet „Training anlegen“; Trainings haben
einen eigenen Namen, Anlage, Wochentag/Uhrzeit und den bestehenden Zeitraum/Vorlauf.
Reihenfolge von oben: kommende Matches, regelmäßige Trainingsgruppen, meine Gruppen.
Einladungen, Antworten und zentrale Speicherung bleiben erhalten.

Die geschützte Strichliste zeigt das angemeldete Mitglied mit ausschließlich seinen
echten Buchungen und 19 alphabetisch ausgewählte aktive Mitglieder aus dem
zentralen Verzeichnis mit markierten Beispielstrichen. Namen werden nicht in
öffentliche Dateien kopiert. Beispielzeilen sind eine reine Anzeige im Vorführbetrieb
und erzeugen weder Buchungsdatensätze noch Abrechnungsbeträge. Auch bei null eigenen
Buchungen bleibt die eigene Zeile sichtbar. Sortierung: Nachname, Vorname (Deutsch).
Kein Mitgliederimport oder Datenbankschemawechsel. Cache v223.

Prüfung: 13 bestehende Backendtests; neue isolierte Browsertests
`node tools/test-browser-finetuning.mjs` (Gruppe, Training, Login/Home, 320–1100 px)
und `node tools/test-browser-tally-examples.mjs` (echter Worker mit Wegwerf-SQLite,
20 Zeilen, 19 Beispiele, echte eigene Buchungen/Betrag auch nach Reload).
Worker-Build erfolgreich; Messung bleibt ausgeschaltet.
Veröffentlicht und geprüft: Website-Quellstand `cc9836e7aae97d1785b27904937e9343db877f8d`,
[Pages-Lauf 40193735376](https://github.com/calvinjohncamp/tfb-website/actions/runs/40193735376)
erfolgreich; Worker `3d57dda8-c68b-481a-b60c-2a8824f00b2e` veröffentlicht.
App, Dating, Sync-Adapter und Service Worker live HTTP 200/bytegleich geprüft;
anonymer Zugriff auf `/app/state` bleibt 401. Privater Nachweis:
`.private/release-v223/live-check.json`. Automatische nuLiga-Aktualisierung
`fcaf08a` übernommen; sonstige lokale Entwürfe unverändert belassen.



## Bestätigter Live-Stand v222 – 17.10.2026

Club → Mitglied werden → rechts „E-Mail-Bestätigung (PDF)“. Einseitiges Muster
mit vollständigem TFB-Logo, Website-Schriften/-Farben und fiktiven Daten; neuer
Tab und Offline-Verfügbarkeit. Kein Mailversand aktiviert. Cache v222, sonstiger
bestätigter Funktionsstand v221. Nutzer bestätigt den gesamten Stand.
Live-Quellstand `f5752ca`, Veröffentlichung [39004454286](https://github.com/calvinjohncamp/tfb-website/actions/runs/39004454286)
erfolgreich und ausgelieferte Dateien bytegenau geprüft. Dieser Abschluss
aktualisiert ausschließlich die Dokumentation. Entwurf/Versandvorgabe: [MAILKONZEPT.md](docs/MAILKONZEPT.md).

## Weiterhin gültige Funktionsbasis v221 – 17.10.2026

Nutzer bestätigt den Gesamtstand. Verbindlicher Einstieg:
[Übergabe](docs/UEBERGABE.md), ausführliches
[Projektgedächtnis](docs/PROJEKTGEDAECHTNIS.md).
Basisveröffentlichung v221: Quellstand `ed9d9db`, Cache `tfb-kiosk-v221`.
Aktuelle Veröffentlichung v222 siehe oben; die folgenden Funktionen bleiben gültig.

- Finales App-Symbol: größeres **TFB ohne Ball**, Website-Farben #EFEFEF/#171717.
  Website-/Splash-Logo behalten Ball #C4553A; Browser-Favicons unverändert.
- Splash führt immer auf Home; zentrale Textpflege mit zwei unabhängig schaltbaren
  kleinen Zeilen. Adminzugang zur Partnerpflege über Konto → Einstiegsseite → Ball.
- Partnerarten Premium-Partner/Partnerbandenwerbung, gleiche Rotation, standardmäßig
  300 Euro/Jahr, tatsächliche Zahlungen separat. Premium zusätzlich auf Splash.
- Messung bleibt aus; vorbereitet sind Seitenaufrufe und Sichtbarkeit der gemeinsamen
  Logozeile ab 50 % / 0,5 Sekunden. 01.01.2027 ist ein Vorschlag, keine automatische
  Aktivierung. Padel-MIS und Folgekonzept sind spätere Schritte.
- Menü Dating 2.0, Seitentitel Verabreden; keine dauerhafte rote Kiosk-Markierung.
  Konto verschlankt; Originalflyer unter Aktuell/Save the Date wieder verfügbar.

Die folgenden Versionsabschnitte sind historisch; bei Widersprüchen gilt v221.

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
