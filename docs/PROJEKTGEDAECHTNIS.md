# TFB-Kiosk – Projektgedächtnis und Übergabe

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


## Verbindlicher Kurzstand – 17.10.2026 · bestätigter Live-Stand v222

**Vom Nutzer bestätigter Stand v222:** E-Mail-Muster zur Mitgliedsanmeldung als PDF
auf der Club-Seite rechts neben den bestehenden Aktionen verfügbar. Einseitige
Präsentationsansicht mit fiktiven Daten, Logo, Website-Farben/-Schriften und
Musterhinweis. Details in [MAILKONZEPT.md](MAILKONZEPT.md). Cache v222;
keine Versandaktivierung, sonstiger bestätigter Produktstand v221 bleibt Basis.

Der Nutzer hat Gestaltung und Bedienung ausdrücklich bestätigt und diesen Stand
zur Dokumentation freigegeben. Maßgeblich für die nächste Sitzung ist die aktuelle
[Übergabe](UEBERGABE.md). Dieser Kurzstand hat Vorrang vor dem historischen Verlauf.
Weitere Produktänderungen nur auf neuen Auftrag; ältere offene Listen nicht
selbständig abarbeiten. Keine zusätzliche Betriebsfreigabe oder Datenrücksetzung.

- Live: [joern-kaemper.de](https://joern-kaemper.de/), Quellstand
  `f5752caac746f3050444f65ed3929c307650fd06`, Cache `tfb-kiosk-v222`.
  Veröffentlichung [39004454286](https://github.com/calvinjohncamp/tfb-website/actions/runs/39004454286)
  erfolgreich. Club-Code, CSS, Service Worker und PDF live bytegenau geprüft;
  Nachweis `.private/release-v222/live-check.json`. Dieser Abschluss ändert nur
  Dokumentation, keine neue Websiteversion.
- Finales App-Symbol: **großes dunkles TFB ohne Ball/Unterzeile auf hellem Grund**;
  Schrift rund 18 % größer. Website-Farben exakt: #EFEFEF / #171717, automatisch
  aus CSS übernommen. Website und Splash behalten den roten Ball #C4553A.
  Browser-Favicons bleiben unverändert. App-Entwürfe mit Ball sind überholt.
- Kühle Welt ist Standard, warme Welt bleibt lokale Alternative. Menü Dating 2.0,
  Seitentitel Verabreden. Kiosk nur als tatsächlich aktiver Bereich hervorgehoben.
- Splash-Einstieg führt immer auf Home. Textpflege per Stift, kleine quadratische
  schwarze Auswahlfelder; zwei kleine Textzeilen unabhängig an-/ausblendbar.
  Admin: Konto → Einstiegsseite ansehen → roter Ball → kompakte Partnerpflege.
- Partner zentral/separat für TFB: Premium-Partner und Partnerbandenwerbung,
  Standard 300 Euro/Jahr, gleiche Rotation für alle; Premium zusätzlich Splash.
  Verträge und tatsächliche Jahreszahlungen getrennt. Keine Testbestände erneut einspielen.
- Messung **ausgeschaltet** in Frontend und Worker. Zweistufig vorbereitet:
  Seitenaufrufe und davon Partner-Sichtbarkeit; gemeinsame Zweierzeile mindestens
  50 % sichtbar für **0,5 Sekunden**. Vorschlag 01.01.2027 braucht eigene Freigabe,
  keine automatische Aktivierung. Padel-MIS und gemeinsames Konzept nach drei
  Padel-Jahren sind spätere Schritte.
- Oktoberfest-/Weihnachtsflyer als originale JPG-Anhänge wieder sichtbar, mit
  Großansicht/Download. Weihnachtsdatum auf Flyer und Termineintrag widerspricht
  sich weiterhin; siehe Übergabe, keine unbeauftragte Inhaltsänderung.
- Letzter Worker: `f2973171-e161-4b08-a74e-0f240c3e58a1` (v213).
  Aktuelle Version benötigt keine weitere Datenbank-/Workeränderung.
  Migration 0005 eingespielt, Statistikmigration 0004 noch nicht.
- Sicherungstag `stand-2026-10-16-v208` ist eine historische Rückfallreferenz,
  nicht mehr der Live-Stand. Private Exporte unverändert behalten; kein neuer
  D1-Export oder Sicherungstag mit diesem Dokumentationsauftrag erstellt.

Die folgenden Abschnitte dokumentieren ältere Entscheidungen und Zwischenstände.
Aussagen wie „Live bleibt v208“, „noch nicht veröffentlicht“ und frühere Symbol-
oder Messvarianten gelten nur für ihren damaligen Stand.

## Entscheidung: Kühle Welt voreingestellt (v183)

Nutzer bevorzugt die neue kühle Welt, insbesondere Menütypografie und einheitliche
Kiosk-Hintergründe. Verbindlich: zwei Welten, cool als Standard, warm als erhaltene
Alternative. Zwischenvariante mit alten Schriften entfernt (auch CSS).
Home-Admin-Zeile links „Kühle Welt“/„Warme Welt“, rechts vorhandener Bleistift;
gleiche Höhe und Sichtbarkeitsbedingung, im Demo-Modus gemeinsam ein-/ausgeblendet.
Logo-Schriftzug wechselt weiterhin auf allen internen Seiten und in der Präsentation.
Lokale Auswahl mit neuem Key `tfb_design_world_v2`; alte Dreier-Testauswahl ignoriert.
Kein zweiter Inhaltssatz, keine globale Backend-Konfiguration, keine Veröffentlichung.
Tests: Default/gespeicherte Wahl/Legacy, Admin/Gast/Mitglied, exakte Ausrichtung,
alle Seiten bei schmalen/ großen Breiten, Dateiseite/Fonts, Focus-Wechsel erfolgreich.
Aktuelle Bedienung und Quellen in DESIGNVERGLEICH.md. Ältere drei Welten historisch.

## Drei Vergleichswelten und Dating 2.0 (v182)

Auf Nutzerwunsch dritter Zustand zum Trennen von Farb- und Schriftpräferenz:
warm → kühle Farben mit alten Schriften UND Schriftfarben exakt → neue kühle
Schrift-/Farbwelt → warm. Logo-Schriftzug als Schalter für alle internen Seiten.
Originalstandard und Inhaltsdaten unverändert; mittlere CSS-Schicht ändert nur
Hintergründe/Linien/Flächen, kein Branding-Text oder Typografie. Vorhandene neue
kühle Variante erhalten. Lokale Preference `colors` zusätzlich zu `cool`.
Verabreden-Menü unverändert, Seitentitel „Dating 2.0“, neue Abschnittstitel
„Einladungen für mich“ und „Meine kommenden Matches“. Keine Funktionsänderung.
Design-Test erweitert um Font-/Farbgleichheit der Mittelvariante auf allen
Seiten/Breiten und Dreierfolge/Reload/Texte. Details in DESIGNVERGLEICH.md.
Cache v182; keine Veröffentlichung, endgültige Weltwahl oder Admin-Weltenverwaltung.

## Designvergleich auf alle Seiten erweitert (v181)

Nutzer noch unentschieden; warme Farbwelt gefällt weiterhin. Auftrag: gesamte TFB-
Website in kühler Welt vergleichbar machen, Logo-Schriftzug überall zum Umschalten.
Umgesetzt ohne Änderung der warmen Basis: alle internen Seiten/Unterseiten, Account,
Dialoge. Konturzahlen auf Home (neue Schrift, transparent/1.25px rot), deutlicheres
Menü mit größeren DM-Sans-Zeichen/700 und dunklerem Grau. Neutrale Farben/Flächen
für Kiosk, Aktuell, Sport, Club, Verabreden, Abrechnungen und Rechtstexte.
Bei schmalen Geräten kühle Verabreden-Auswahl 2x2 gegen Textüberlauf.
Admin-Auswahl/regelmäßiger Wechsel der Welten nur zukünftige Option, nicht programmiert.
Keine Design-Freigabe, Veröffentlichung oder Datenmigration. Cache v181.
Details/Quellen/Prüfumfang: DESIGNVERGLEICH.md. Ältere Home/Chat-Begrenzung aufgehoben.

## Neues Experiment 13.10.2026: kühle Home/Chat-Vorschau (v180)

Nutzer möchte nach dem Tagesabschluss die Schriften/Farben seines Foks-Screenshots
auf Home/Chat vergleichen, ohne die bisherige warme Gestaltung aufzugeben.
Umgesetzt als separate, lokal umschaltbare CSS-Schicht über denselben Inhalten:
Klick auf kleinen Logo-Schriftzug wechselt, TFB-Zeichen/roter Ball behalten Funktionen.
Nur Home/Chat betroffen, kein Admin-Welten-Setup (dies wäre späterer Step 2).
Schriften per Hersteller-CSS identifiziert: Bricolage Grotesque/DM Sans; beide lokal
und frei lizenziert, keine Online-Abhängigkeit. Screenshotfläche #EFEFEF gemessen,
Preview-Anthrazit #171717 neutraler/dunkler als Markenbasis #2A2D2E. Signalrot bleibt.
Warme Basis unverändert; Vergleich enthält keine endgültige Designfreigabe.
Ausführliche Recherche/Abgrenzung/Bedienung/Rückbau in [DESIGNVERGLEICH.md](DESIGNVERGLEICH.md).
Cache v180, kein Commit/Push/Deployment. Daten-/Inhaltsgleichheit und Umschaltung
isoliert geprüft, inklusive file-Schriften, schmaler Ansichten und Fokus-Regression.

## Tagesabschluss 13.10.2026: vom Nutzer bestätigt (v179)

Nutzer bestätigt die aktuelle Klingel-Umsetzung („Hervorragend, gefällt mir genau so“)
und beendet die Sitzung. Verbindlicher aktueller lokaler Stand: `tfb-kiosk-v179`.
Ältere Versionsstände in den folgenden Ergänzungen beschreiben den Verlauf.

Abgeschlossen: Desktop-Fokus; nächstes zugesagtes Match im Account mit feinem
Anthrazit-Rahmen; Kiosk-Umsätze mit Details-Link; vereinfachter Einzugshinweis.
Klingel ergänzt ausschließlich vorhandene Chat-/Insider-Beiträge von Verfassern aus
eigener Mannschaft oder bestätigter Trainingsgruppe, keinen neuen Gruppenchat.
Eigene Account-Auswahl mit ruhigem Standard „Nur Einladungen“; Opt-in für
„Einladungen und Gruppenbeiträge“. Je Autor gebündelt, Direktlink zum neuesten
Beitrag, gelesen dauerhaft entfernt, weitere Beiträge bleiben erreichbar.
Installation für weitere Nutzer und Personen-Followlisten bleiben zurückgestellt.

Abschließend erfolgreich: Browserprüfungen Chat-Hinweise, nächstes Match/Account,
Home/Aktuell/Chat-Übersicht und Wochentage/Einladungen. Schmale Account-Ansicht
visuell geprüft, `git diff --check` ohne Fehler. Keine gesamte Testsuite erneut,
keine echte Mobilgeräteprüfung. Übergabe ist aktualisiert. Keine Veröffentlichung,
kein Commit/Tag/Push oder neuer JSON-Export; separate Padel-Anwendung unverändert.

## Ergänzung 13.10.2026: optionale Chat-Hinweise (v179)

Verbindliche Nutzerkorrektur: keinen neuen Chat bei Trainingsgruppen/Einladungen
anlegen. Nur vorhandene Beiträge von Personen aus eigener Mannschaft oder bestätigter
Trainingsgruppe in Klingel aufnehmen. Account-Auswahl „Nur Einladungen“ standardmäßig,
alternativ „Einladungen und Gruppenbeiträge“. Beim Einschalten nur künftige Beiträge,
keine eigenen/verborgenen/gelöschten Beiträge, pending Gruppenmitglieder ausgeschlossen.
Je Autor gebündelt, Überschneidungen dedupliziert. Klick öffnet neuesten Beitrag
direkt; nach dem Ansehen verschwinden dessen Hinweis/ungelesener Status dauerhaft,
weitere bleiben erreichbar. Auch Einzelansicht aus Chat-Übersicht markiert gelesen.
Hinweise nach sieben Tagen ausblenden, Entfernen bestätigt Bündel. Einstellungen
und gelesene IDs je Account gespeichert. Keine Mails/Push und keine Personen-Followliste.
Nur lokale Demo, keine Online-Zustellung implementiert. Cache v179; keine Veröffentlichung.
Isolierter Test `test:browser:chat-notices` erfolgreich: Zuordnung/Bündelung,
Opt-in/Opt-out, Ausschlüsse, Link/gelesen/Reload/Entfernen und schmale Ansichten.

## Ergänzung 13.10.2026: Abrechnungshinweis (v178)

Auf Nutzerwunsch im laufenden Monat unter „Meine Abrechnungen“ nur
„Einzug am [Datum]“ anzeigen. Strichanzahl dort entfernt, da ein Strich
einzelne Getränke oder einen Kranz darstellen kann. Einzelposten/Beträge unverändert.
Lokaler Cache v178; keine Veröffentlichung.

## Ergänzung 13.10.2026: Account-Gliederung (v177)

Der nächste Match-Hinweis erhält auf Nutzerwunsch einen feinen schwarzen/
Signature-Anthrazit-Rahmen (1px, 16px-Rundung wie Account-Felder).
„Kiosk-Umsätze“ steht über den Beträgen, „Details ansehen“ darunter öffnet die
Abrechnungen mit Einzelposten und Monatsübersicht und schließt den Account.
Der Heute-Betrag bleibt der Direktweg zum Bierdeckel. Bestehende Berechnungen
unverändert. Isolierter Browsertest inklusive Link und 1100/834/390/320px erfolgreich.
Cache v177, keine Veröffentlichung und kein neuer Commit.

## Ergänzung 13.10.2026: Account mit nächstem Match (v176)

Neuester lokaler Cache `tfb-kiosk-v176`. Nach Vorbild der Padel-Account-Titelseite
ein kompakter, ungerahmter Hinweis unter den beiden Account-Bestätigungen, über
Kiosk-Beträgen und eigenen Angaben. Nur nächster noch nicht gestarteter Termin,
bei dem das Mitglied laut bestehender Zusage-/Nachrücklogik tatsächlich mitspielt.
Offene/abgesagte Einladungen und Ersatzplätze ausgeschlossen, Training eingeschlossen.
Datum/Uhrzeit/Titel/Ort, gegebenenfalls noch freie Plätze, Direktlink zu Details;
ohne zugesagten Termin dezenter Leerhinweis. Read-only `TFB.meet.nextMatch`, kein
Versand oder neue Zusage beim Öffnen des Accounts. Keine Anbindung an Padel-Buchungen.
Padel-Original im separaten Ordner nur als Vorlage gelesen. Isolierter Browser-Test
`test-browser-next-match.mjs` einschließlich Logik/Position/Details/Training/leerem
Zustand und schmalen Ansichten erfolgreich. Frühere Entscheidungen unten unverändert;
keine Veröffentlichung, kein Commit/Tag/JSON-Export.

## Aktueller Abschluss 13.10.2026: Fokus und Einladungen (v175)

Verbindlicher lokaler Stand: Cache `tfb-kiosk-v175`. Anwendung/Repository ist
`/Users/jk/Dropbox/9. TFB-Website/tfb-kiosk`; Padel Bielstein bleibt getrennt.
Die folgenden Entscheidungen ersetzen die früheren Fokus-/Installationsentwürfe.
Keine Veröffentlichung, kein Commit/Push/neuer Sicherungstag oder JSON-Export
in diesem Abschluss. Letzter Git-Commit weiterhin `d8d7762`, eingefrorener Tag
`stand-2026-10-12-v160`. Vorbestehende Änderungen und `.claude/` erhalten.

### Verbindliche Entscheidungen

- Vorstandsvorführung zuerst: Website ist ein Vorschlag zur Zusammenführung und
  Modernisierung. Eine öffentliche App-Installation erst nach grundsätzlicher
  Zustimmung des Vorstands weiterentwickeln, nicht eigenständig wieder aktivieren.
- Home-Installationsstreifen samt Position-/Höhenbearbeitung entfernt. Auch im Konto
  kein Fokus-/Installationsangebot. Alte `site.focusStrip`-Werte bleiben ungenutzt
  erhalten; sie dürfen den Streifen nicht wieder sichtbar machen.
- Stattdessen kleines F links neben der Klingel in der Kopfzeile, nur Desktop mit
  primärer Maus/Trackpad-Bedienung. iPhone, iPad (auch Desktop-Kennung mit Touch)
  und Android ausgeschlossen: weder Hoch-/Querformat noch Browser-/App-Nutzung
  ändern diese Regel. Nutzer hat ausdrücklich zugestimmt. Breite allein ist kein Kriterium.
- F-Kreis 21,6px, unten bündig mit der 27px-Klingel, Rand 1,15px Signature-Anthrazit
  `#1C1A17`, weiße Fläche. F-Schrift 90% der jeweils tatsächlichen Menüschrift,
  Gewicht 600 (mittelfett), Abstand zur Klingel 15,4px. Hinweis beim Hover/Tastaturfokus.
- F öffnet eine dunkle Browser-Vollbildfläche mit mittigem Inhalt, keine Änderung
  des macOS-Schreibtischhintergrunds und keine Installation. Desktop/iPad/iPhone-
  Breiten 1440/834/390px, seitlich ziehbar; Steuerung unten blendet aus. Escape/X
  bzw. F in der eingebetteten Desktop-Ansicht beendet Fokus. Bei nicht freigegebenem
  Vollbild bleibt die Ansicht innerhalb des Browserfensters mit entsprechendem Hinweis.
- Für Mobilgeräte ist Fokus nicht beauftragt. Später wäre eine Entscheidung nach
  Browser-Unterstützung/Standalone-Modus möglich; iPhone-Webseiten haben nicht
  dieselbe Vollbild-Unterstützung wie Desktop, iPad oder Android-Chrome. Nicht umgesetzt.

### Fertig und geprüft

- Lokale Mac-Startknöpfe außerhalb des Website-Repositorys in `../Präsentationsmodus`:
  `TFB.app` schaltet rein anthrazitfarbenen Desktop ein/aus und stellt das vorherige
  Hintergrundbild samt Darstellungsoptionen wieder her. `TFB Vorführung.app` startet
  die vorhandene lokale Seite als Chrome-App-Fenster ohne Tabs/Adresszeile.
  TFB-Symbol ohne Ball; bisherige Desktop-Knöpfe unverändert beibehalten.
- Der zusätzliche Download `TF Bielstein.app` hatte zunächst eine ungültige
  Bundle-Signatur. Paketbau repariert, komplettes Bundle ad hoc signiert und auch
  nach Entpacken geprüft (`build-tf-bielstein.sh`, `tf-bielstein-mac-v2.zip`).
  Trotzdem blockiert macOS den nicht Apple-beglaubigten Browser-Download:
  kein öffentlich freigegebener Installer, keine Developer-ID/Notarisierung.
  Keine Quarantäne-/Gatekeeper-Umgehung. Windows-CMD nur vorbereitet, nicht getestet.
- Website-App-Symbol/Manifest verwenden die TFB-Signature-Kachel ohne Ball,
  App-Name `TF Bielstein`, Quelle `assets/brand/tfb-app-icon-source.png`.
- Rückkehr aus Fokus lädt lokale Daten/Bilder frisch; der ausgeblendete Elternbereich
  schreibt währenddessen keine veralteten automatischen Sicherungen.
- Feature-Überschriften halten einzelne Wörter zusammen. Resize-/Render-/Font-Laden
  passt die Schrift nur bei Bedarf an das längste Wort an. „Tennisfreunde“ wird nicht
  mehr vor dem letzten e getrennt, auch bei engen Desktop-Spalten und mobilen Größen.
- Foto-Randfix: Galerie-Einzelfoto nach tatsächlich verfügbarer Bühnenbreite statt
  `94vw`, kein horizontaler Überlauf. Nur eingebettete Fokus-Seite blendet die äußere
  Scrollleiste aus; Browser-Fokusrahmen hat dunklen Hintergrund. Foto-Wechsel bleibt.
- Einladungen: Mo–So vor dem Datum, nächstes passendes Kalenderdatum automatisch
  (heute nur bei noch bevorstehender gewählter Uhrzeit). Späterer Serienstart muss
  denselben Wochentag haben; explizite Prüfung auch beim Speichern. Einzel/Doppel
  nutzen die Datumshilfe, erlauben aber jedes manuell gewählte Datum und synchronisieren
  die Tagesauswahl. Seriendetails zeigen oben ein eigenes schreibgeschütztes Feld
  Wochentag, z. B. Mittwoch; Rhythmustext bleibt. Uhrzeit/Ort/Vorlauf bleiben erhalten,
  bestehende Serien und bereits verschickte Termine werden nicht migriert.

Letzte erfolgreiche Prüfungen: `test-browser-focus.mjs` (einschließlich Fokus-Fotos,
F-Schrift/Abstände, iPhone/iPad-Ausschluss und Wortumbruch), `test-browser-meet-weekdays.mjs`
(Serienstart/Details/Speichern, Einzel/Doppel, Mobil, Zeitumstellung),
`test-browser-gallery.mjs` und `test-browser-overview.mjs`. Isolierte Chromium-Profile,
synthetische Daten; keine Änderung privater Chrome-Inhalte. Größenprüfung ist keine
vollständige Prüfung echter iOS-Geräte. Frühere Backup-/Node-Prüfstände unten bleiben
historisch, wurden beim abschließenden Dokumentationsauftrag nicht erneut ausgeführt.

Nächster Schritt ausschließlich auf neuen Nutzerauftrag. Technische Folgeaufgaben
aus der Prüfung vom 12.10. bleiben offen; keine Livefreigabe dadurch. Praktische
Startwege, Dateien und Testbefehle: `docs/UEBERGABE.md` ganz oben.

## Früherer Chatabschluss 13.10.2026 (v165, historisch)

Auf Nutzerwunsch Projektgedächtnis und Übergabe nach ausdrücklicher Abnahme der
letzten Anpassungen aktualisiert: „Gefällt mir sehr gut alles jetzt.“ Aktueller
lokaler Stand enthält die nachfolgenden Layoutkorrekturen und Playwright-Einrichtung;
Cache-Bezeichnung weiterhin `tfb-kiosk-v165`. Nur Dokumentation bei diesem Abschluss.
Die konsolidierte Übergabe steht ganz oben in
`docs/UEBERGABE.md` und hat Vorrang vor den historischen Zwischenständen weiter unten.

Fertig: Galerie/Collage auf Home/Aktuell, optionaler Text oben/unten, Datum,
gemeinsames Vollbild-Blättern, direktes Foto-Verschieben mit Live-Entwurfsanzeige,
Bleistifte oben/unten sowie „Alle Beiträge“ mit Suche/Filtern und direktem Sprungziel.
Letzte Korrekturen: Abstand oberhalb der Aktuell-Spalten von 8 auf 12 und schließlich
16px erhöht; Überschrift, Einleitung und Desktop-Button bleiben an ihrer Position.
Mobil steht „Alle Beiträge“ rechts neben der jeweils sichtbaren Überschrift News
oder Save the Date, untenbündig mit dem roten Strich. Auf Home im Standard-Look
Wechselspiel sitzt der Button rechts untenbündig mit der 01. Desktop-Platzierung
beibehalten. Automatisiert und visuell geprüft, vom Nutzer ausdrücklich abgenommen.
Aktuell keine weiteren Anpassungen beauftragt; erst auf neue Nutzeranfrage weiterarbeiten.

Playwright 1.64.0 und Chromium installiert; Entwicklungsabhängigkeit in `package.json`
und `package-lock.json`. Alle drei Browser-Tests bestanden: Seitenübersicht,
Galerie/Collage und Foto-Sicherung. Positionsprüfung auf 1280/500/390/320px, beide
mobilen Aktuell-Tabs und Home-Nummer/Button-Unterkante eingeschlossen.
Aus `tfb-kiosk`: `npm run test:browser`; Einzelbefehle siehe Übergabe.

Anwendung liegt im Unterordner `tfb-kiosk`, nicht in der separaten Padel-Kopie.
Arbeitsänderungen seit Sicherungstag v160 sind lokal uncommittet; keine neue
Veröffentlichung, kein neuer Git-Sicherungstag und keine neue JSON-Inhaltssicherung
bei diesem Abschluss. Vorhandene Nutzeränderungen und `.claude/` bleiben erhalten.
Prüfstände und betroffene Dateien sind in der konsolidierten Übergabe aufgeführt.

## Frühere Weiterarbeit 13.10.2026 (historische Zwischenstände)

**Layoutkorrektur v165:** Home-Übersichtsbutton oben rechts innerhalb der ersten
Themenkachel auf der Hintergrund-/Textfläche statt in zusätzlicher Zeile davor.
Aktuell-Button rechts im Seitenkopf, bündig unten mit der Einleitung; News und
Save the Date beginnen wieder auf gleicher Höhe, Abstand zum Kopf reduziert.
Übersicht weiterhin ausschließlich News, keine Termine. Desktop/Handy/320px anhand
von Browser-Screenshots und Positionsprüfungen kontrolliert; 23 gezielte Tests bestanden.
Keine Änderung gespeicherter Inhalte; lokaler uncommitteter Stand, Cache v165.

**Erweiterung v164:** „Alle Beiträge“ für Home und ausschließlich die linke News-Spalte
von Aktuell. Kompakte Übersicht im Chat-Look, in Seitenreihenfolge, mit Titel/Datum,
Foto/Textauszug, Suche sowie Art-/Fotofilter. Gefüllte Galerien und Collagen eingeschlossen;
Termine/Save the Date, Strukturüberschriften und ungespeicherte neue Bausteine ausgeschlossen.
Ausgeschalteter Fotomodultext bleibt auch in der Übersicht unsichtbar. Klick springt
direkt zum vorhandenen Seiteninhalt und aktiviert bei Aktuell die mobile News-Ansicht.
Keine Änderung der Inhalte, Preise oder Sicherungsdaten. 51 Node-Tests und isolierter
Desktop-/Handycheck mit 22 Einträgen pro Seite sowie Chat-Regression erfolgreich.
Lokaler Stand, nicht committet/veröffentlicht; Sicherungstag v160 unverändert.

**Erweiterung v163:** Bleistift zusätzlich am Seitenende, mit derselben Aktion wie oben
und ohne Sprung nach oben beim unteren Seitenschalter. Direkte Foto-Sortierung am Bild
oder Griff: Live-Umordnung bereits während des Ziehens, auch per Touch. Galerie/Collage
zeigt auf der Seite sofort denselben ungespeicherten Entwurf. Erst „Speichern“ übernimmt
die neue Reihenfolge; abgebrochene Gesten setzen sie zurück. Details in der Übergabe.

**Erweiterung v162:** Eigenständige Collage zusätzlich zur Galerie auf Home/Aktuell.
Beide Module mit Datum, Überschrift und optionalem Text oberhalb oder unterhalb der Bilder;
Pfeile verschieben die Module auf der Seite. Bilder im Editor am Griff mit Maus/Touch
direkt sortieren, zusätzlich Pfeile und Tastatur. Bestehende Galerien behalten Textposition
unten, Daten unverändert. 49 Tests sowie isolierter Desktop-/Handycheck erfolgreich,
einschließlich Maus-/Touch-Ziehen und gespeicherter Modulreihenfolge. Details in der Übergabe.

Auf neuen Nutzerauftrag lokaler Arbeitsstand **v161**: Galeriebaustein für Home und Aktuell
mit optionalem Datum im Artikel-Look und ausblendbarem Fließtext darunter. Ausblenden
erhält den gespeicherten Text. Home bekommt einen eigenen Galerie-Hinzufügen-Knopf;
vorhandener Aktuell-Baustein wird erweitert. Klick öffnet das gewählte Foto im gleichen
blätterbaren Betrachter wie die Home-Unterseiten/50-Jahre-Kollage. Genau bestehendes
Klick-/Pfeil-/Tastatur-/Wischverhalten, keine zweite Viewer-Implementierung.
48 Tests erfolgreich sowie isolierte Desktop-/Handyprüfung mit Speicher-/Neuladetest.
Kein Commit/Push; Sicherungstag v160 bleibt der letzte eingefrorene Stand.

## Verbindlicher Tagesabschluss 12.10.2026

Aktueller freigegebener Stand **v160**, Katalogversion 13, lokaler Sicherungstag
**`stand-2026-10-12-v160`**. Nutzer: „Das sieht alles top aus“ und ausdrücklich für heute
Schluss sowie einfrieren. Keine weiteren Änderungen ohne neuen Auftrag; kein Push und
keine Veröffentlichung. Details zum aktuellen Stand stehen oben in `UEBERGABE.md`.
Die älteren Zwischenstände und damaligen offenen Bestätigungen unten sind historisch.

Home-Farbumschaltung und Foto-Sicherung vom Nutzer praktisch bestätigt. Kiosk mit echten
Listenpreisen und verfeinerten Symbolen abgenommen. Reihenfolge: alkoholfrei, Bier,
Aperol/Wein, Spezialitäten (drei Speisen), Spielbetrieb (Flutlicht/Gastspieler), Snacks
einschließlich Eis, zukünftiger Vereinsshop. 46 Tests erfolgreich, Desktop und Handy
mit isolierten Testdaten geprüft. Private Browserdaten werden nicht durch Git gesichert;
dafür bleibt die vollständige JSON-Sicherung erforderlich. Bekannte technische Folgejobs
bleiben erhalten und werden nicht als erledigt angesehen.

## Ergänzung 12.10.2026 – Folgeaufgaben und verbindliche Farbentscheidung

**Spielbetrieb ergänzt (Cache v160):** Nutzer ordnet Flutlicht (1 h), 5,00 €, und
Gastspieler, Eine Stunde, 8,00 €, zwischen Spezialitäten und Snacks ein. Spezialitäten
nur die drei Speisen, Süßigkeiten/Chips/Eis wieder eigener Snacks-Bereich. Neue Symbole
für Flutlicht und Tennisspieler. Gezielte Migration 12 → 13 ohne alte Preis-/Historienänderung;
eigene Spielbetrieb-Spalte in der Strichliste. Gebührenbuchung, keine Platzreservierung.

**Illustrationen nach Nutzerreferenz (Cache v157):** Aperol höher bei gleicher Breite,
blaues Band und gelbe/weiße Beschriftung nach Screenshot, ohne TO GO. Apfelschorle in
Wasserflaschenform mit quadratischem Apfeletikett, eigene Farbe beibehalten. FASS vertikal
zentriert. Alle übrigen Produkte unverändert; reine Zeichenänderung ohne Datenmigration.
44 Tests und Desktop-/Handyansicht geprüft.

**Kiosk-Verfeinerung (Cache v156):** Einheitliche Flaschenform für Zunft, Fassbrause und
Apfelschorle, senkrechte FASS-/APFEL-Etiketten; Zunft-Flasche wie Glas goldfarben,
Weizen orange, Radler heller goldfarben. Aperol besser lesbar, weiterhin stilisiert und
nicht als exakte Vereinsverpackung bestätigt. Bockwurst ohne Streifen, Grillwurst mit
vier Grillstreifen, Grillfleisch unregelmäßiger. Strichliste „Kränze“ vom Nutzer bestätigt.
Gezielte einmalige Migration 10 → 11 ohne Preis-/Historienänderungen. 43 Tests grün,
Desktop-/Handyansicht mit synthetischen Daten geprüft. Herstellerangaben zu Alkohol
und verbleibende Verpackungsfrage stehen im aktuellen Abschnitt der `UEBERGABE.md`.

**Erster Kiosk-Vorschlag nach dem Listenfoto (Cache v155):** Nutzer bestätigt Sicherungsfix;
Getränke und Preise aus Vereinsliste übernommen. Reihenfolge alkoholfrei, Bier, Aperol/Wein,
Spezialitäten (Essen, bestehende Snacks und Eis), zuletzt bisheriger zukünftiger Vereinsshop.
Neue Zeichnungen ergänzen den vorhandenen Illustrationsstil. Einmalige Katalogmigration 9 → 10
erhält alte Buchungen und individuelle Snacks-/Shopdaten. Red Bull als nicht gelistetes Getränk
deaktiviert. Flutlicht/Gastspieler noch nicht übernommen, Entscheidung offen. Mengen/Preise,
Prüfnachweise und Abgrenzungen stehen im neuesten Abschnitt der `UEBERGABE.md`.

**Folgeauftrag Foto-Sicherung umgesetzt (lokal, Cache v154):** Strikter Fotoexport mit
Transaktionsabschluss und Zeitbegrenzung; fehlende verknüpfte Fotos/PDFs oder ungültige
Einträge verhindern Export/Import. Wiederherstellung baut einen getrennten Bildbestand
auf und aktiviert ihn erst nach vollständiger Speicherung. Alter aktiver Bestand bleibt
bei Fehlern erhalten. Automatische Sicherung exportiert vor dem Öffnen der Datei,
bricht fehlerhafte Schreibfassungen ab, zeigt Fehler an und verhindert parallele Läufe.
Sie funktioniert jetzt auch bei ausgeblendeten Admin-Stiften und erkennt reine Bildänderungen.
40 Node-Tests und isolierter echter Chrome-/IndexedDB-Test erfolgreich. Keine Originaldaten
oder Sicherungsdateien verändert; nicht veröffentlicht. Details, Speicherbedarf durch
beibehaltene alte Bildbestände und verbliebene Abgrenzungen stehen oben in `UEBERGABE.md`.

Die technische Prüfung wurde auf Wunsch des Nutzers als offene Aufgaben in
`UEBERGABE.md` unter „Offene Aufgaben aus der Prüfung vom 12.10.2026“ festgehalten:
Altersstatus/Jugendschutz, bestätigte Buchungsspeicherung, vollständige Bildsicherungen,
Mehrbenutzerbetrieb mit serverseitigen Rechten, Lastschriftabschluss und Wartbarkeit.
Dies sind zukünftige Jobs, keine bereits umgesetzten Korrekturen.

Für Home ausdrücklich bestätigt: Standard-Hintergrund `#F5F0E6` unverändert lassen.
Die individuellen bunten Farben hat der Nutzer bereits selbst per Pipette festgelegt
und gesichert. Keine erfundenen Ersatzfarben oder neuen Vorgabepaletten einsetzen.
Klick auf 01/02/03 soll nur zwischen Standard und dieser bestehenden bunten Fassung
wechseln, unabhängig von den sichtbaren Admin-Stiften. Prüfung noch offen; die beiden
gelesenen JSON-Sicherungen im Projektwurzelordner enthalten diese Farbwerte nicht.
Eine neuere Sicherung bzw. der aktuelle Browserstand muss dafür geprüft werden.
Nachfolgende Screenshots zeigen die bestehenden individuellen Farben im Editor;
die Aussage über fehlende Werte gilt nur für die gelesenen Sicherungsdateien.
Lokal korrigiert (Cache v153): Nummern als echte Schaltflächen über die gemeinsame
Aktionssteuerung, Handzeiger und Tastaturbedienung. Die Editor-Vorschau darf einen
ausdrücklichen Farbwechsel nicht mehr übergehen; erster Klick im farbigen Editor
zeigt Standard. Vorhandene Farbwerte bleiben unangetastet. 34 Node-Tests bestanden,
einschließlich Vorschau, beider Admin-Ansichten und Neuladen. Der echte lokale Chrome-Tab
ist über den Browserzugriff nicht prüfbar; Bestätigung durch Nutzer nach Neuladen offen.
Die echte Getränkeliste liegt dem Nutzer inzwischen als Foto vor; Inhalt erst nach
Erhalt des Fotos übernehmen.

## Nachtrag 11.10.2026 abends – Review mit echten Daten, Aufräumen Stufe 1 (v100)

- Claude hat ChatGPTs Stand v99 mit der echten Sicherung des Nutzers geprüft.
  Bewertung: Chat/Clubgeflüster, Mannschaftsseiten mit Insider News, Club mit fünf
  Kennzahlen und Vorstand wirken wie ein echtes Clubmagazin. Schwachstelle:
  Editoren (Porträt 10 Felder + Optionen, Home 33 Felder) zu komplex für Laien.
- **Leitidee des Nutzers:** „Lass die Mitglieder für Inhalte sorgen“ – Beitragen
  muss so einfach wie möglich sein.
- Nutzer-Entscheidungen: linksbündig ist gewollt; Button „Mannschaftsporträt + News“
  bleibt wie er ist; fünf Kennzahlen statt vier Knöpfe; Vorstand nicht umsortieren
  (Reihenfolge wie heutige Vereinswebsite); Vorstandsdaten dürfen ins Repository.
- Umgesetzt (Stufe 1): siehe UEBERGABE.md „Neu in v100“. Commits `f8e6c90`
  (Sicherungspunkt v99), `1d0b829`, `02f8fb3`.
- Ordner umbenannt in `9. TFB-Website`, `TFB-Kiosk öffnen.html` gelöscht.
- Stufe 2 erledigt (v101): Porträt-Editor in Schritten 1–4 + „Mehr Gestaltung“,
  Handy-Vorschau-Knopf. Stufe 3 erledigt (v102): Home-Editor in Schritten +
  „Mehr Gestaltung“, einheitliche Umschalter/Knöpfe. Danach: Live-Seite.
- v103: Nutzer will Home hochwertiger/abwechslungsreicher (Vorlagen: Art Newspaper,
  Stutterheim, Gazette, Tablet, Vanity Fair, Foks). Sechs Looks per Schalter zum
  Vergleichen; Editor bleibt gleich. Danach: Mannschaftsporträt/Unterseiten mit
  flexiblen Hoch-/Querformat-Fotos (Wunsch des Nutzers, noch offen).
- v104: Entscheidung – Look 6 „Wechselspiel“ ist Standard; Klassisch und Magazin im
  Admin umschaltbar (`site.homeLook`). Zeitung/Bühne/Kacheln verworfen.
- v105: Nutzer will im Admin WYSIWYG im jeweils gewählten Look bearbeiten → umgesetzt;
  Home bis 10 Themen über Plus-Knopf „Neues Thema“.
- v106: Unterseiten-Look (4 Quadrate oben, Text, Zitat, Kollage) gilt für alle
  Unterseiten (Nutzer: „nicht zu kompliziert“). Editor folgt der Seitenreihenfolge;
  Textgrößen inkl. Verkleinern, Farben, WYSIWYG-Überschriften.
- v107: Home-Editor: Themen-Leiste für bis zu 10 Themen, Kleine Zeile/Unterzeile
  sichtbar, zweiter Link, Link bleibt beim Umschalten erhalten. Lehre: beim Vereinfachen
  nichts verstecken, was auf der Seite sichtbar ist.
- v108: Home-Typografie fest (keine Größen), Fließtext nur Fett/Kursiv/Rot; Link-Text
  sichtbar. Nutzer: „nicht mehr so weit weg von einer guten Seite eins“.
- v109: Idee des Nutzers umgesetzt – Unterseiten aus Abschnitten (Text · Überschrift ·
  Zitat) mit Pfeilen und Plus, feste Gestaltung, nur zwei Schriftgrößen (Text/Überschrift).
- v111: Nutzer zufrieden mit Unterseiten-Editor („genau so lassen“); gleiche Bedienung im
  Mannschaftsporträt. Chat-Beiträge mit freiwilliger Überschrift; Chat-Seite heißt „Clubgeflüster“.
- v112–v115: Titelfotos im Seitenformat einpassen; Aktuell-Beiträge 1–4 Fotos (breit/Quadrate);
  Aktuell ohne Unterseiten (Nutzer: „kurz und knackig“), Texteditor überall gleich schlank.
- v116: Leitziel bestätigt – Laien (Mitglieder, Jugendliche) sollen alles selbst pflegen.
  Menü oben (Namen, Ziele intern/extern, Reihenfolge, sichtbar) im Admin bearbeitbar.
- **11.10.2026 abends eingefroren** als Tag `stand-2026-10-11-abend` (v116), vom Nutzer
  abgenommen. Nächster großer Job: **Verabreden** aufdröseln und rund machen.
- **11.10.2026 spät erneut eingefroren** als Tag `stand-2026-10-11-spaet` (v120): zusätzlich
  blätterbare Galerien, Club → History (Galerie bis 100 Fotos unter dem Text).

## Verbindlicher Stand 11.10.2026 – Projekt-Update

Diese Zusammenfassung und die aktualisierte `UEBERGABE.md` haben Vorrang vor
älteren Abschnitten. Maßgeblich bleiben aktuelle Software und Nutzerinhalte.
**Nicht veröffentlicht**, lokale Browser-Datenschicht; Cache **v99**.
Der Nutzer ist sehr zufrieden und hat genügend eigene Flüsternachrichten für
die Vorstellung beim Vorstand gepflegt. Kein neuer Commit, Tag oder Release.

- **Navigation/Home:** Home ist Startseite. Kiosk · Chat · Aktuell · Sport · Club ·
  Verabreden · Padel. Home-Themen mit Detailseite/direktem Link/ohne Ziel;
  „Mehr erfahren“ separat abschaltbar, verlinkte Titel mit rotem Hover. Links und
  Symbole editierbar/sortierbar; Foto-Unterseiten mit bis zu 100 Bildern.
  Home-Beispielhinweis entfernt; bestehende Inhalte bewahren.
  Neu v98: ungepflegte Beispiel-News bereinigt, Home-/News-Bilder als sortierbare
  Collage bis 100 Fotos, fünfteilige Vorschau, volle Collage vor Einzelbildern.
  Schnupper-Kalenderlink durch bearbeitbare Terminüberschrift/-text ersetzt.
  Neu v99: gemeinsame Vollbildfunktion für Einzelfotos, auch in Mannschaftsliste,
  Porträt, Training und weiteren Inhaltsseiten. Foto zeigt Originalquelle, X/Klick
  daneben/Escape schließen; Collagen und Fotoeditoren behalten ihre Bedienung.
  32 Tests bestanden, Desktop-/Smartphone-Browserprüfung erfolgreich.
- **Aktuell:** News 2/3, Save the Date 1/3; mobil umschaltbar. Clubgeflüster ausgelagert.
- **Chat:** großer linksbündiger Feed, neueste Beiträge zuerst; `#chat/alle` mit Suche
  und Filtern. Alte `#gefluester`-Adressen gültig. 24 Texte per Admin-Stift bearbeitbar
  (`site.chatText`). Mannschaftsrechte erhalten. Bis zu sechs Bilder pro Beitrag;
  erst große Gesamtcollage, dann Einzelbilder mit Pfeilen, Klick und horizontalem
  Wischen. Keine persönlichen Direktnachrichten implementiert.
- **Keine künstlichen Chats mehr:** Startbestand leer. Beim Laden werden nur sieben
  bekannte Seed-IDs (`p-s1`–`p-s4`, `p-t1`–`p-t3`) entfernt, auch nach alten Backup-Imports.
  Eigene Nachrichten, Bildreferenzen und Fotos bleiben erhalten. Nutzer-Chrome-Daten
  nicht direkt verändert: Bereinigung erfolgt beim nächsten Laden der neuen Software.
- **Club:** fünf sortierbare/editierbare Zahlen, unerwünschter Zusatzblock entfernt.
  Schwarzer Beitragsbutton vor rotem Aufnahmebutton mit schwarzem Text; Beitragsfenster
  mit X. Editierbarer Hinweis auf 10 Prozent Padel-Rabatt, keine Änderung der getrennten
  Padel-Rabattberechnung. Sieben echte veröffentlichte Vorstandskontakte/Fotos übernommen;
  runde Profilbilder mit Originalansicht. Basti/Marco aufgehellt, Originale erhalten.
  Rollen, Kontakte, Mitgliedssuche mit Auswahl bei gemeinsamen E-Mails, Reihenfolge
  und eigener Vorstands-Fotoausschnitt bearbeitbar.
- **Foto-Freigaben:** freiwillig nach Aufnahme statt im Antrag. Öffentliche Anzeige
  nur mit Freigabe, Minderjährige erst nach dokumentierter Elternzustimmung. Neues
  Foto braucht neue Freigabe; echte Elternverifikation für Produktion noch offen.
- **Sport:** Porträt-/Newsbutton ab 640px zwischen Informationen und Platzierung
  zentriert; mobile kompakte Darstellung erhalten. Zwei Reiter: Mannschaften
  (`#sport`) und Training (`#sport/training`). Training mit Leon Kaufmanns
  Originalfoto und Kontakten, Schnuppertraining und „Termine für Schnuppertraining
  demnächst“ als frei bearbeitbarer Termintext. Kalender-Link und Kalenderverweis
  entfernt. Über Admin-Stift bearbeitbar, einschließlich Trainerfoto/Funktion/Telefon/E-Mail.
- **Foto-Drop:** Dateibatches auf bestehenden Bildfeldern über denselben Uploadweg,
  interne Sortierung erhalten. Tatsächliches Ziehen aus macOS Fotos nach Chrome
  noch nicht geprüft; unaufgelöste Dateiversprechen mit JPEG-Export-Hinweis.
- **Foto-Rahmen:** gemeinsamer Admin-Editor für Website-Fotos, Galerievorschauen,
  Chat-Fotos und Bildanhänge: Hochformat/Querformat/Quadrat, Zoom und Position.
  Pro Bildreferenz als `site.photoFrames` gespeichert, Original unverändert.
  Kollageraster und runde Profil-/Vorstandsrahmen bleiben erhalten.
- **Digitale Aufnahme:** lokal Simulation ohne Speicherung/Versand. Separater
  Python-/SQLite-/SMTP-Prozess vorbereitet, Versand deaktiviert. Club-/Bankfreigaben,
  Rechts-/Datenschutztexte, HTTPS und geschützter Betrieb nötig. Keine automatische
  Mitgliedsanlage. Details in `digitale-aufnahme.md`; keine echten E-Mails versendet.
- **Fußzeile:** Impressum und Satzung als eigene bearbeitbare Unterseiten, plus
  Copyright-Jahr und Vereinsrechte an Inhalten, Gestaltung und App-Konzept.
  Satzung vollständig/wortgetreu, Stand 20.03.2015. Register Köln VR 600693 und
  USt-ID aus öffentlichem Padel-Impressum; Kai Eichmann vom Nutzer bestätigt.
- **Prüfstand:** 32 Node-Tests im letzten Implementierungslauf bestanden
  (Vorstand/Fotorechte, Home/Chat/Galerien, News-Collagen, Beispiel-Bereinigung,
  Sport/Rechtstexte/Fotorahmen, Foto-Drop und Vollbild). Bei diesem reinen
  Dokumentationsupdate keine Tests erneut ausgeführt, auch keine Aufnahme-Tests. Frühere
  Desktop-/Mobilprüfungen in isolierter Vorschau; aktuelle direkte HTML-Prüfung
  durch Browserrichtlinie nicht möglich.

Vor Vorstandsvorstellung eigene Daten über Sichern & Laden sichern und im Nutzer-
Chrome nach Neuladen kontrollieren. Veröffentlichung, eigene TFB-Datenbank,
Mitgliederimport, SEPA und echte Push-Mitteilungen separat vorbereiten.
Padel-Kopie samt deren Dokumentation bleibt unangetastet.

## Historischer Stand am Ende des 10.10.2026

Ältere Abschnitte beschreiben Zwischenstände (z. B. „Kiosk ist Startseite“, „Reiter Verein“,
Garamond-artige Überschriften) – **überholt** durch:

- **Startseite = Home** (`#home`) für alle Besucher; Logo führt dorthin; neue Aufrufe landen
  immer auf Home (Ausnahme: Neu laden, Deep-Links mit `/`). Manifest `start_url ./#home`.
- Menü: **KIOSK** (immer Signal-Rot) · AKTUELL · SPORT · **CLUB** (Adresse `#club`, intern
  Seite `verein`) · **VERABREDEN** (intern `treffen`) · PADEL. Aktiver Bereich: dunkle Schrift + roter Strich.
- **Logo:** Ball in Signal-Rot (Masken `tfb-logo-noball` + `tfb-logo-ball`, Position in
  `.tfb-logo-split`: left 84.53 %, top 47.95 %, Breite 15.53 %, Höhe 34.78 %).
- **Home-Themen** (Baustein `feature`): `layout` wide/portrait/square, `kicker`, `title`,
  `subtitle`, `text`, `link {url, label, style chip|button|card, title, text, image}`,
  `more {text, quote, quoteBy, images}` → Unterseite `#home/<id>`.
- **Fließtext-Auszeichnung** überall in Text-Bausteinen: `[Text](https://… | #seite)`, `**fett**`, `## Zwischenüberschrift`.
- **Team-Seiten** `#team/<schlüssel>`, Inhalte in `site.teams[schlüssel] = {photo, posts[≤10]}`.
- **Account-Karte** nach Padel-Vorbild; `api.updateProfile` (Handynummer, Info-Mails, Einladungen).
- **Sichern & Laden:** `api.exportAll()` / `api.importAll()`; Datei enthält `db`, `images`
  und `extra` (`tfb_kiosk_look_v3` = Farbe/Schrift, `tfb_meet_demo_v2` = Verabredungen).
- Offline unter `file://` in Chrome geprüft (Texte + Fotos überstehen Neustart).

## Gestaltungssystem: Schriften und Farben (Stand 10.10.2026)

**Schriften – drei Rollen**

| Rolle | Schrift | Einsatz |
|---|---|---|
| Grundschrift `--font` (fest) | Systemschrift: SF Pro (Apple), Segoe UI (Windows), Roboto (Android) | Fließtext, Menü, Knöpfe, Formulare, Kacheln, Versal-Beschriftungen |
| Auszeichnung `--serif` (in der Verwaltung wählbar, Standard „Modern (System)“) | Test: System, Avenir Next, Futura, DIN, Klassisch (offline) · Inter Tight, Manrope, Outfit, Plus Jakarta Sans, DM Sans, Sora, Space Grotesk, Bricolage Grotesque, Syne, Unbounded, Barlow Condensed (Google Fonts, nur Test) | Seitentitel, Themen-Überschriften, Zwischenüberschriften, Datumszahlen, Bierdeckel-Betrag, Zitate, Initiale, Nummern |
| Handschrift `--hand` (fest) | Bradley Hand (Windows: Segoe Print) | Bierdeckel-Datum/-Monat, Strichlisten-Namen |

Der Schriftzug „TENNISFREUNDE BIELSTEIN“ ist Teil des Logos (Bild), keine Schrift.
Entscheidung offen: 1–2 Favoriten wählen, Google-Schrift dann selbst ausliefern (Datenschutz/offline).

**Farben**

| Farbe | Wert | Einsatz |
|---|---|---|
| Kreideweiß | `#FBFBF8` | Hintergrund (fest) |
| Anthrazit (Markenfarbe `--brand`) | `#2A2D2E` | Logo, Bierdeckel, dunkle Knöpfe, Datumsfelder; wählbar (Schwarz, Sandplatz-Rot, 4 freie Felder) |
| Sandplatz-Rot (Signal `--signal`) | `#C4553A` | Logo-Ball, KIOSK, Aktiv-Strich, Strich unter Zwischenüberschriften, Unterzeilen, „Mehr erfahren“, Initiale, Zitat, Zusagen, Platz 1 (fest) |
| Weiß | `#FFFFFF` | Karten |
| Schrift dunkel / grau | `#1C2520` / `#6A7069` | Text / Nebentext |
| Linien, Flächen | `#E5DDCD`, `#E6E1D6`, `#EFEDE7`, `#F6F3EC` | Rahmen, Platzhalter, gesperrte Felder |
| Menügrau | `#8A8F8A` | inaktive Menüpunkte |
| Verabreden | Schwarz `#111111` (Absage), Grau `#8C918E` (offen), Rot hell 8 %/45 % | Status |
| WhatsApp-Grün | `#25D366` | nur Teilen-Knopf |

Aufräumen geplant: Altlasten `--green*`, `--cardboard*`, `--cream` u. a. entfernen, auf ~10 feste Werte reduzieren.

## Konzept „Treffen 2.0“: Verabreden in der installierten App

**Vorführung gebaut am 10.10.2026** (`assets/js/meet.js`, Speicher `tfb_meet_demo_v2`):
Arten **Training** (Gruppe, wöchentlich), **Einzel** (2 Plätze), **Doppel** (4 Plätze),
**Anderes** (Plätze frei wählbar). Einzel/Doppel: beliebig viele fragen, **wer zuerst
zusagt, spielt**, spätere Zusagen kommen auf die **Ersatzbank** und rücken bei einer
Absage automatisch nach. Einladung = Tabelle aller Teilnehmer (✓ dabei · Ersatz n ·
○ offen · ✗ abgesagt), Status oben („Doppel steht“ / „Noch 1 Platz frei“) mit
Platz-Punkten, eigene Notiz je Zusage, Organisator kann per Tipp auf einen Namen für
andere eintragen, Erinnerung nur an Offene, Hinweis bei Überschneidung mit einer
anderen Zusage zur selben Zeit, Gruppen anlegen/bearbeiten (Name, Trainingstag,
Uhrzeit, Ort, Mitglieder), WhatsApp nur noch als Rückfallweg „Für alle ohne App“.
Mitteilungen erscheinen als iPhone-artiges Banner oben (Vorschau auf echte Push).
In der Demo antworten die anderen nach ein paar Sekunden von selbst.


Stand 10.10.2026. Der Nutzer hält an der Idee fest. Ehrliche Bewertung:
Der WhatsApp-Link allein ist eine Krücke, weil Umfrage und Veranstaltung in
WhatsApp für eine einzelne Gruppe besser sind. Sinnvoll wird es erst, wenn
**alle der Gruppe die App installiert haben**.

- **Installation ohne App Store:** Die App ist eine PWA. Auf dem iPhone
  „Teilen → Zum Home-Bildschirm“. Seit iOS 16.4 gibt es dort **Push-Mitteilungen**,
  und genau die sind der Schlüssel. Eine echte App-Store-App (99 $/Jahr,
  Prüfung durch Apple) ist nicht nötig.
- **Kern:** Gruppen (z. B. Herren 40) mit festen Mitgliedern. Jedes Treffen
  zeigt eine **Tabelle aller Teilnehmer** mit ✓ zugesagt / ✗ abgesagt / ○ offen,
  oben der Status („4 von 4 – Doppel steht“). Antworten mit einem Tipp, auch
  direkt aus der Mitteilung heraus.
- **Was es besser macht als WhatsApp:** feste Trainings wiederholen sich
  automatisch, Erinnerung geht nur an die Offenen, Teilnehmergrenze mit
  Warteliste und Nachrücker-Mitteilung, kurze Notiz je Zusage („komme 15 min
  später“), Ersatz aus anderen Gruppen anfragen, später Platzbelegung und
  Mannschaftsaufstellung (nuLiga), nach dem Training ein Kranz über den Kiosk.
- **Ehrliche Grenze:** Den WhatsApp-Chat für Quatsch, Fotos und Sprüche
  ersetzt es nicht. Realistisch ersetzt es die **Organisation** („wer kommt?“).
  Machen zwei von zehn nicht mit, muss der Organisator doppelt pflegen, und das
  Ganze stirbt. Gegenmittel: Der Organisator kann für andere eintragen
  („hat im Chat zugesagt“), und der WhatsApp-Link bleibt als Rückfallweg.
- **Verbreitung:** Der **Kiosk ist das Zugpferd**. Wer anschreiben will, braucht
  die App ohnehin, und Treffen gibt es dann gratis dazu.
- **Voraussetzungen:** Supabase (gemeinsame Daten, Echtzeit), Veröffentlichung
  unter HTTPS, Web-Push (VAPID-Schlüssel + Edge Function). Im Demo-Modus lässt
  sich nur die Oberfläche zeigen, kein echter Push.

## Neu ab 10.10.2026: Vereinswebsite im selben Projekt (Vorführversion für den Vorstand)

- **Kopfzeile (10.10.):** nur komplettes Vereinslogo (81 px hoch) und rechts das
  Profilbild (58 px), unten bündig mit „TENNISFREUNDE BIELSTEIN“ – kein Bereichswort,
  kein Demo-Hinweis. Darunter ein ruhiges **Schrift-Menü ohne Symbole**
  (Großbuchstaben, gesperrt), aktiver Bereich in Signal-Rot. KIOSK beginnt bündig
  mit dem Schriftzug im Logo, das „L“ von PADEL endet bündig mit dem Profilbild,
  gleiche Abstände dazwischen. Abstand Logo → Menü = Menü → Inhalt (30 px).
- **Kiosk-Kopf (10.10.):** kein Umschalter mehr. Bierdeckel links (Breite
  ≈ 0,615 × Inhaltsbreite − 5 px, Inhalt wächst mit), rechts quadratische Knöpfe
  (84 × 84 px, rechtsbündig) **Strichliste** und **Abrechnungen**
  (Symbol über Beschriftung). Diese Seiten schließen mit dem Kreuz.
- **Raster für alle Geräte (10.10.):** Handy < 640 px wie bisher. iPad hochkant
  640–1023 px: bis 880 px breit, Sortiment 3 Spalten, Beiträge 2 Spalten, Vorstand
  3 Spalten, Mannschaftsführer sichtbar. Ab 1024 px (iPad quer/Desktop): bis 1200 px,
  Kopf in einer Zeile (Logo · Menü · Profilbild; Menü mittig zwischen Logo-Ende
  und Profilbild, Grundlinie = Unterkante Schriftzug = Unterkante Profilbild), Kiosk mit feststehendem Deckel
  links und Sortiment rechts (4 Spalten), Vereinsseiten mit Terminspalte rechts,
  Texte zweispaltig, Vorstand 4 Spalten. Bearbeiten ab 640 px als Fenster in der Mitte.
- Partner-Duo auf allen Geräten **linksbündig** (Text und Logos).
- Menüschrift Desktop/iPad quer **20 % größer** (.96rem); 1024–1279 px etwas enger gesetzt.
- **Treffen (Vorführung, 10.10.):** Menüpunkt zwischen Verein und Padel. Einladungen
  mit Vorlagen (z. B. „Training Herren 40, Di 19:00“ = ein Tipp), Mitgliedersuche über
  Echtname und E-Mail-Teil (nur Namen sichtbar), „Per WhatsApp senden“ (fertiger Text
  + Link; mit freiwilliger Handynummer direkt an Einzelpersonen), Zusage/Absage mit
  einem Tipp, Übersicht Dabei/Abgesagt/Offen, Erinnerung an Offene. In der Demo
  antworten Eingeladene automatisch. **Schnell entfernbar:** `features.treffen: false`
  in config.js, oder `assets/js/meet.js` + Abschnitt „Treffen“ in app.css löschen.
  WhatsApp kann Gruppen nicht automatisch übernehmen; Links funktionieren erst nach
  Veröffentlichung (`publicUrl`).
- **Startseite ist immer der Kiosk** (auch für Gäste); beide Startdateien
  („TFB-Kiosk öffnen.html“, „TFB-Website öffnen.html“) öffnen den Kiosk. Menüpunkt heißt wieder **Aktuell**. Bleibt beim Scrollen sichtbar. Partner stehen
  auf jeder Seite **ganz unten**.
- Reiter: **Kiosk · Aktuell · Sport · Verein · Padel**. Kiosk zuerst; nur der
  Kiosk-Bereich braucht Anmeldung (Umschalter Kiosk · Strichliste · Abrechnungen).
  Gäste landen auf „Aktuell“, Mitglieder im Kiosk. Wort neben dem Logo = Bereich.
- Verwaltung jetzt über das Profilbild (unten ist kein Platz mehr); dort auch
  „Website bearbeiten“. Admins sehen auf jeder Seite einen Stift.
- Seiten aus **Bausteinen** (`assets/js/site.js`, Startinhalte `assets/data/site-seed.js`):
  Beitrag (Foto, Datum, Text), Termin, Text, Zwischenüberschrift, Foto, Galerie,
  Ansprechpartner, Zahlen, Knopf, Mannschaften. Direkt auf der Seite bearbeiten,
  Pfeile zum Sortieren. Fotos werden beim Hochladen auf max. 1600 px verkleinert
  und im Browser-Bildspeicher (IndexedDB) abgelegt.
- **Partner:** zwei Logos je Seite, Gestaltung und Rotation 1:1 aus der Padel-App
  (`assets/js/partner-rotation.js`, Daten `assets/data/partners.js`, Logos
  `assets/partners/`, 38 Partner, Gewichte Premium 3 · Partner 3 · Regional 1).
- **Mannschaften** aus nuLiga (TVM, Verein 35703): `python3 tools/update-teams.py`
  schreibt `assets/data/teams.js`. nuLiga braucht dafür eine Sitzung (Cookie);
  später als täglicher Serverdienst. Spielerlisten werden nur verlinkt.
- Inhalte: Termine/Beiträge sind Beispiele; Vorstand mit Platzhaltern
  (keine Kontaktdaten Einzelner übernommen).

## Worum es geht

Eigenständige Handy-App für die **Tennisfreunde Bielstein (TFB)**: Kiosk und
digitale Strichliste für Getränke und Snacks auf der Tennisanlage. Ziel ist die
Präsentation vor dem Vorstand; bei Zustimmung wird daraus der Echtbetrieb.

- Ersetzt die Papier-Strichliste. Abgerechnet wird **monatlich per
  SEPA-Lastschrift des Vereins** (Mandate bestehen bereits). **Kein Stripe.**
- Abgeleitet aus der Padel-Bielstein-App, aber **strikt getrennt** von ihr:
  eigener Code, eigenes Repository, später eigene Datenbank.

## Wo was liegt

| Was | Wo |
|---|---|
| App (dieser Ordner) | `9. TFB-Website/tfb-kiosk/` (Ordner bis 11.10.2026: `9. TFB-Kiosk`) |
| Repository | https://github.com/calvinjohncamp/tfb-kiosk (privat) |
| Starten per Doppelklick | `9. TFB-Website/TFB-Website öffnen.html` |
| Logo-Original | `assets/brand/tfb-logo-original.png` → neu erzeugen mit `zsh tools/build-brand.sh` |
| Padel-Kopie (nur Nachschlagen) | `9. TFB-Website/01 Software/` u. a. – Push dorthin ist gesperrt |

## Festgelegte Gestaltung (Stand 09.10.2026)

- **Indie-Look mit gezeichneten Symbolen**, keine Produktfotos (die Fotowelt
  bleibt der Padel-App vorbehalten).
- **Hintergrund Kreideweiß** (fest).
- **Markenfarbe** färbt Logo, Bierdeckel und Akzente. Standard **Anthrazit**.
  Fest: Schwarz, Anthrazit, Sandplatz-Rot; dazu vier freie Felder (Farbwähler/
  Pipette, mit × leerbar). Liegt im Reiter „Verwaltung“.
- **Bierdeckel „Stapel“**: zwei eckige Deckel, hinten die Markenfarbe. Zeigt das
  **heutige Datum** und die Striche/Summe **von heute**; darunter Monatssumme
  und Einzugstermin.
- Kopfzeile: großes „TFB.“-Logo, rechts daneben „KIOSK“; der originale Schriftzug
  „Tennisfreunde Bielstein“ steht rechtsbündig vor dem Profilbild (Abstand 14 px
  wie Ball↔KIOSK). Alles exakt auf der Grundlinie von „TFB.“. Ist zu wenig Platz,
  bricht „TENNISFREUNDE“ über „BIELSTEIN“ um.
- Unterseiten (Strichliste, Abrechnungen, Verwaltung) haben oben rechts ein
  Schließen-Kreuz zurück zum Kiosk; das TFB.-Logo führt ebenfalls zum Kiosk.
- **Signalfarbe Sandplatz-Rot `#C4553A`** (CSS `--signal`): „KIOSK“, Striche, „bald“.
  Bleibt fest, auch wenn die Markenfarbe geändert wird.
- Reiter für alle: **Kiosk · Strichliste · Abrechnungen · Padel** (Link zur
  Padel-Buchungs-App). Admins sehen zusätzlich **Verwaltung**.
- Profilbild hochladen; Antippen im Profil zeigt es groß (ganzes Originalbild).

## Funktionen, die stehen (Demo-Modus)

- Anmeldung über E-Mail aus der Mitgliederliste, Passwort beim ersten Mal,
  einmalige Zustimmung (Kioskordnung, Lastschrift, Sichtbarkeit Strichliste).
- Anschreiben mit Anzahl (Runde). Danach: kurze Bestätigung (2,5 s), Seite
  scrollt zum Deckel, dezenter **Storno-Stempel** (hellgrau, ohne Außenrand,
  anthrazit Ring) auf der rechten oberen Deckelecke, **30 Sekunden**
  (`undoSeconds` in config.js). In der Abrechnung heißt es „stornieren“.
  Deckel bleibt bewusst zentriert.
- Erzquell-Flasche als gemeinsame Form für Malzbier, Sportsfreund und Radler
  (`erzquell()` in art.js) – nur die Farben unterscheiden sich.
- **Strichliste**: letzte 7 Kalendertage, alphabetisch nach Nachname, nur Striche.
- **Meine Abrechnungen**: laufender Monat, abgeschlossene Monate.
- **Verwaltung → Kiosk bearbeiten** (direkt am Kiosk, wie ihn Mitglieder sehen):
  Artikel anlegen/ändern/löschen/ausblenden (Name, Zusatzzeile, Preis, Bereich,
  Symbol, Farbe), Artikel und **Bereiche** per Pfeil sortieren, Bereiche
  anlegen/umbenennen/löschen, Status „Geöffnet“ oder „Bald (nur Vorschau)“.
- Sortiment übernommen aus dem bisherigen Padel-Kiosk (ohne Padel-Artikel).
  Reihenfolge: Alkoholfrei, Bier, Snacks & Eis, Vereinsshop („bald“) ganz unten.

Im Demo-Modus liegen alle Daten nur im Browser des Geräts. Demo-Zugang:
`max@tfb-demo.de` (ist Admin). Datenschicht: `assets/js/demo-backend.js`
(`TFB.api`), für Supabase wird nur diese Schicht ersetzt.

## Offene Punkte – bewusst auf später verschoben

*(Ergänzt 10.10. abends:)* echte Inhalte einpflegen (Nutzer), Schrift entscheiden und
selbst ausliefern, CSS-Farben aufräumen, Verabreden-Details, automatische Link-Vorschau
(Serverdienst), Mannschaftsführer-Rechte für Team-Seiten, echte Push-Mitteilungen,
Präsentation auf dem iPad (braucht Veröffentlichung + Sicherung laden).


1. **Supabase-Projekt** anlegen, sobald ein kostenloser Platz frei ist (Padel
   zieht ca. Ende Oktober 2026 zum Verein um). Bis dahin Demo-Modus.
   Nicht die Padel-Datenbank mitbenutzen.
2. **Mitgliederliste importieren** (Excel-Upload im Admin): Vorschau „neu /
   geändert / nicht mehr dabei“, erst nach Bestätigung übernehmen; Ausgetretene
   nur deaktivieren. Spaltenüberschriften der Vereinsliste stehen noch aus.
3. **Monatsabschluss** für den Kassenwart: Beträge einfrieren, Liste je
   Mitglied, optional SEPA-Datei (pain.008) fürs Online-Banking.
   Klären: Wie lädt der Kassenwart die Lastschriften heute hoch?
4. **Rollen**: nur Admin oder zusätzlich Kassenwart/Vorstand mit eigenen Rechten?
5. **Echtes Sortiment** vom Foto der Papier-Strichliste übernehmen (Foto folgt).
6. Markenfarbe und Sortiment gelten im Demo-Modus nur auf dem eigenen Gerät;
   mit Supabase für alle.
7. **Veröffentlichung** unter einer Subdomain von joern-kaemper.de (z. B.
   `kiosk.joern-kaemper.de`); Domain des Vereins später.
8. Passwort-vergessen per Mail, Datenschutzhinweis/Kioskordnung als Text.
9. Optional: Logo als Vektordatei (SVG/PDF) für Druck und große Flächen.

## Eingefrorener Stand 09.10.2026 (Git-Tag `stand-2026-10-09`)

Gestaltung für heute abgeschlossen und vom Nutzer abgenommen. Ausgangspunkt
für die nächste Sitzung:

- Startseite: Bierdeckel „Stapel“ mit Tagesdatum, Kipp-/Wackel-Effekt und
  dezentem Storno-Stempel (30 s); darunter Alkoholfrei, Bier, Snacks & Eis,
  Vereinsshop („bald“, volle Kacheln).
- Kopfzeile: TFB. · KIOSK (Signal-Rot) · Schriftzug Tennisfreunde Bielstein ·
  Profilbild (mit Vergrößerung).
- Reiter: Kiosk · Strichliste · Abrechnungen · Padel (Link) · Verwaltung (Admin).
- Verwaltung: Kiosk direkt bearbeiten (Artikel, Bereiche, Reihenfolge, Symbole,
  Farben), Markenfarbe (Schwarz, Anthrazit, Sandplatz-Rot + 4 freie Felder).
- 25+ eigene Indie-Symbole, u. a. Kölschstange/-kranz, Erzquell-Flasche
  (Malzbier, Sportsfreund, Radler), Riegel, Hanuta, Goldbär, Hotdog, Basecap/Shirt
  mit TFB-Logo, Padel-Schläger.
- Weiterhin Demo-Modus (Daten im Browser). Offene Punkte siehe oben.

**Nächste Schritte (Vorschlag):** Foto der Papier-Strichliste → echtes Sortiment
und Preise (u. a. Malzbier-Preis prüfen); danach Supabase, Mitgliederimport,
Monatsabschluss.

## Verlauf

- **09.10.2026** – Projektstart aus der Padel-Kopie. Demo-Oberfläche, neues
  TFB-Logo, Indie-Look festgelegt (Kreideweiß, Anthrazit, Stapel-Deckel mit
  Tagesdatum), Profilbild mit Vergrößerung, Verwaltung mit Kiosk-Bearbeitung
  und sortierbaren Bereichen, echtes Startsortiment mit neuen Symbolen.
  Gestaltung damit grob abgeschlossen.
- **09.10.2026** – Kölsch-Kranz (10 Gläser, 20,00 € wie im Padel-Kiosk) mit
  eigenem Symbol direkt neben dem Kölsch (2,00 €). Ein Kranz zählt auf der
  Strichliste als ein Strich „Kölsch-Kranz“.
- **09.10.2026** – Symbole nachgeschärft: Snickers/Mars als längliche Riegel in
  Originalfarben, Hanuta quadratisch, Goldbär, Bockwurst als Hotdog, Pringles mit
  Mr. P, Red Bull mit Karo, Sonne und Bullen. Alkoholfrei steht jetzt vorne:
  Gerolsteiner, Coca-Cola, Fanta, Sportsfreund, Red Bull.
- **09.10.2026** – Symbole reduziert: Goldbär als reine Silhouette, Hanuta als
  quadratische Waffel mit Nusscreme-Schicht, Snickers/Mars mit schrägem
  Logo-Feld, Red Bull nur noch blau-silbernes Karo. Hotdog und Pringles bleiben.
  Gummibär final im klassischen Gummibärchen-Stil (Vorlage vom Nutzer, eigene
  Zeichnung): runde Ohren mit Glanz, Gesicht, Ärmchen/Beinchen als helle Bögen.
- **09.10.2026** – Bierdeckel lebendig: mit der Maus darüber kippt der vordere
  Deckel leicht nach rechts und zurück; beim Antippen wackelt er kurz, dann
  öffnet sich die Abrechnung. Bei „Bewegung reduzieren“ ohne Animation.
- **09.10.2026** – Vereinsshop mit gleich großen Kacheln (Preis + „bald“ statt
  Plus). Neu: Padelbälle (9 €) und Padel-Schläger (159 €) neben den
  Tennisbällen. Vereinsshirt und navyblaue Basecap tragen das echte TFB.-Logo in
  Weiß (`assets/js/brand-data.js`, erzeugt von `tools/build-brand.sh`).
  Danach: Kappe ohne Glanzstreifen am Schirm, Overgrip-Linien innerhalb der Rolle,
  Tennisbälle gelb, Padelbälle orange.
- **09.10.2026** – Kopfzeile: originaler Schriftzug „Tennisfreunde Bielstein“
  (aus dem Logo, `tfb-tagline`) über „KIOSK“. Neuer Reiter **Padel** öffnet
  padel-bielstein.de in neuem Fenster (`padelUrl` in config.js). Malzbier
  (Golden Malz aus Bielstein, eigenes Symbol, 2,00 € vorläufig) bei Alkoholfrei.
- **10.10.2026** – Gerolsteiner als eigenes Symbol nach dem Produktfoto aus dem
  Padel-Kiosk: schlanke Gourmet-Glasflasche, dunkle Kappe wie bei Cola, weißes Etikett
  mit rotem Stern und türkiser Welle.
- **10.10.2026** – Vereinswebsite-Gerüst im Kiosk-Look: Aktuell, Sport, Verein,
  Bausteine mit Bearbeitung und Foto-Upload, Galerie mit Großansicht,
  Mannschaften aus nuLiga, Partner-Duo mit Rotation wie in der Padel-App.
- **10.10.2026** – Treffen als Vorführung (WhatsApp-Link + Zusage per Tipp).
  Danach ehrlich bewertet: allein eine Krücke. Konzept „Treffen 2.0“ (Gruppen-
  Tabelle in der installierten App mit Push) festgehalten, Entscheidung offen.
  Kurze Übergabedatei `docs/UEBERGABE.md` angelegt.
- **10.10.2026** – Treffen 2.0 als Vorführung umgebaut: Gruppen, Training/Einzel/
  Doppel/Anderes, Teilnehmer-Tabelle, Ersatzbank mit automatischem Nachrücken,
  Mitteilungs-Vorschau.
- **10.10.2026** – Eingefroren (Tag `stand-2026-10-10`). Menüpunkt „Treffen“ heißt jetzt
  **Verabreden**. Farben: Zusage Signal-Rot, Absage Schwarz, offen Anthrazit-Grau.
  Profilbilder links in der Teilnehmer-Tabelle, Doppel-Symbol als zwei Paare,
  Enter übernimmt den ersten Namensvorschlag. Desktop-Menüschrift wieder .74rem
  (wie im Hochformat), dafür größere Abstände.
- **10.10.2026 (abends)** – **Home-Seite** als Einstieg für alle Besucher (`#home`, Baustein
  `feature`: Bild breit/hoch/quadratisch, Kicker mit roter Nummer, Überschrift, Unterzeile,
  Text, Link mit Vorschau-Karte; Vorschau im Demo-Modus von Hand, später automatisch per
  Serverdienst). Startmotive gezeichnet (Padel-Court, Kiosk-Symbole, „50“); Padel-Vorschaubild
  aus der Padel-Kopie (`assets/home/padel-bielstein-vorschau.jpg`). **Verein → Club**.
  **Signal-Rot** stärker: Ball im Logo (eigene Masken `tfb-logo-noball`/`tfb-logo-ball` aus
  `tools/build-brand.sh`), KIOSK im Menü, Strich unter Zwischenüberschriften, Wochentag im
  Datumsfeld, Unterzeilen und Link-Knöpfe. **Schrift-Test** in der Verwaltung (System,
  Avenir Next, Inter Tight, Manrope – Google Fonts nur zum Testen, im Echtbetrieb selbst
  ausliefern wegen Datenschutz – oder Klassisch); Standard jetzt „Modern (System)“.
  **Team-Seiten** `#team/<schlüssel>` (Schlüssel ohne „(4er)“, Sommer/Winter teilen sich
  die Seite): Teamfoto (auch klein in der Mannschaftsliste), Platz/Punkte/Mannschaftsführer,
  nuLiga-Link, bis zu 10 Beiträge (beim elften fällt der älteste weg). Inhalte in `site.teams`.
- **10.10.2026 (spät)** – Offline-Test unter `file://` in echtem Chrome (eigenes Profil,
  ohne Netz): Texte und Fotos überstehen Neustart (localStorage wird verzögert geschrieben –
  nach dem Speichern nicht sofort hart beenden). **Sichern & Laden** in der Verwaltung
  (`api.exportAll/importAll`, Datei `TFB-Sicherung_<Datum>.json` inkl. Fotos, Farbe, Schrift,
  Verabredungen). Start immer auf **Home** (auch Startdateien und Manifest). **Dezente Links**,
  Fließtext-Auszeichnungen, **Unterseiten** der Home-Themen mit Kollage (`more: {text, quote,
  quoteBy, images}`; `ph:`-Bilder = Beispiel-Platzhalter). **Account-Karte** nach Padel-Vorbild
  (`api.updateProfile`: Handynummer, Info-Mails, Einladungen). Mehr Testschriften.
- **10.10.2026 (Sitzungsende)** – Übersicht Schriften/Farben erstellt (Abschnitt
  „Gestaltungssystem“). Stand eingefroren als Tag `stand-2026-10-10-abend`. Nutzer:
  „Mir gefällt das alles sehr, sehr gut“ – nächster Schritt: echte Bilder und Texte einpflegen.
- **11.10.2026** – Padel-Text überarbeitet („Padel kommt nach Bielstein.“, ab Mai 2027 im
  Freibad, 365 Tage, Buchungsticket = Freibad-Eintritt, Slogan „Hit. Run. Padel-Fun.“ als Zitat).
  Neu: **einmalige Text-Updates** (`TFB.siteSeed.updates`, erledigte IDs in `site.applied`) –
  damit lassen sich Texte auf bereits gepflegten Geräten ersetzen, ohne Fotos/Links anzufassen.
  Breite Home-Ansicht: Kicker/Überschrift/Unterzeile links dicht gestapelt, Text + Links rechts.
- **11.10.2026** – Link in Home-Themen **verschiebbar**: `link.position` = `left` (unter der
  Unterzeile) oder `right` (unter dem Text, Standard). Im Bearbeiten-Modus mit der Maus ziehen
  (HTML5 Drag & Drop) oder „Link hierher“ tippen; zusätzlich im Editor unter „Platz“. Feste
  Ablageplätze statt freier Pixel, damit es auf allen Geräten sauber bleibt. Dezenter Link
  zeigt jetzt fett die **echte Adresse** (z. B. padel-bielstein.de ↗); der Link-Text gilt nur
  noch für Knopf und Vorschau-Karte. Links öffnen im Bearbeiten-Modus nicht.
- **11.10.2026** – Home-Themen in **linke/rechte Spalte** getrennt (`.feature-left`, `.feature-right`),
  dadurch sitzt der Link rechts direkt unter dem Text. Link-Plätze jetzt fein: `left`, `right-<n>`
  (vor Absatz n) und `right` (unter dem Text) – immer linksbündig. Beim Ziehen erscheinen nur die
  Ablagelinien des eigenen Themas; „Link hierher“-Knöpfe links und rechts für Touch; im Editor
  Auswahlliste „Platz“. Linke Spalte mit mehr Abstand zwischen Kicker, Überschrift, Unterzeile.
- **11.10.2026** – **WYSIWYG-Texteditor** (contenteditable) für Home-Themen, Unterseiten, Texte und
  Beiträge: Fett, Kursiv, Unterstrichen, Rot, Grau, Textmarker, Größer (A+), Sehr groß (A++), Link,
  Zwischenüberschrift, Format entfernen. Gespeichert wird als Text mit Zeichen (`**`, `*`, `__`,
  `{rot}…{/rot}`, `{grau}`, `{marker}`, `{gross}`, `{sehrgross}`, `[Text](url)`, `## `) –
  Umwandlung über `toMarkup()`/`inline()` in site.js; Einfügen nur als reiner Text.
  Textgröße je Thema (`textSize: normal|gross`). Abstand Text → Link = Absatzabstand.
  Unterseite: Häkchen **„Fotos im Originalformat“** (`more.original`, Kollage ohne Zuschnitt).
  Interne Links (z. B. Zum Kiosk) als Pille mit **rundem Symbol** der Zielseite (oder eigenem Bild).
  Einmal-Update: hochgeladenes Titelfoto des Kiosk-Themas auf die Unterseite verschoben
  (Original-Format an), Startseite zeigt wieder das gezeichnete Motiv.
  Gelernt: `.field span { display:block }` störte execCommand im Editor → für `.rich-area` zurückgesetzt.
- **11.10.2026** – **Link-Ziel** im Editor wählbar: „Website“ (Adresse, ohne https:// wird ergänzt)
  oder „Seite der App“ (Auswahl: Home, Kiosk, Strichliste, Abrechnungen, Aktuell, Sport, Club,
  Verabreden und Home-Unterseiten). **Unterseite** im Look der Startseite: Foto oben ohne Schrift,
  darunter links Kicker/Überschrift/Unterzeile/Link (Desktop mitlaufend), rechts Text, Zitat –
  alles linksbündig; Bearbeiten/Schließen über dem Foto.
- **11.10.2026** – **Themen-Editor neu:** Seitenleiste rechts (ab 1100 px, 440 px breit) mit
  **Live-Vorschau** links – die Seite zeigt bei jeder Eingabe genau den bearbeiteten Bereich
  (`preview`-Zustand in site.js, `homeBlocks()` setzt den Entwurf ein; Abbrechen stellt den
  gespeicherten Stand wieder her). Zwei Reiter **„Startseite“** und **„Unterseite „Mehr
  erfahren““** mit je eigenen Feldern und Hinweis, was woher kommt. Handy/iPad: Blatt mit
  „Vorschau ansehen“ (schiebt es weg, Kopfzeile antippen holt es zurück). Von der Unterseite aus
  öffnet der Stift direkt den Reiter „Unterseite“.
  **Titelbild der Unterseite:** `more.heroSource` (`same` | `own`), `more.heroImages` (1–3),
  `more.heroMode` (`wide` | `original` | `squares`). Ist das Startseitenbild hoch-/quadratisch
  und „Breit“ gewählt, steht es links über der Überschrift statt quer zugeschnitten.
- **11.10.2026** – Titelbild der Unterseite: bis zu **4 eigene Fotos**, „2–4 Quadrate nebeneinander“
  (4 Quadrate: Desktop in einer Reihe, Handy 2 × 2).
- **11.10.2026** – Fotos im Editor **sortierbar**: Titelfotos der Unterseite, Fotokollage und
  Galerie-Bausteine – Pfeile ‹ › auf jedem Vorschaubild oder per Maus ziehen (Griff ⠿);
  `thumbEdit()` / `moveInList()` in site.js. Live-Vorschau zeigt die neue Reihenfolge sofort.
- **11.10.2026** – **Ausrichtung von Fotos im Originalformat** (Links/Mitte/Rechts, Standard Mitte):
  Titelbild der Unterseite (`more.heroAlign`), Fotokollage (`more.collageAlign`; Fotos max. 80 %
  Bildschirmhöhe) und Foto-Baustein (neu `original` + `align`). Auswahl erscheint im Editor nur,
  wenn „Originalformat“ aktiv ist – bei zugeschnittenen Fotos füllt das Bild ohnehin die Breite.
- **11.10.2026** – **Großer Textanfang** auf Unterseiten einstellbar: Aus / 1 / 2 / 3 Zeichen
  (`more.dropcap`, Standard 1). Umgesetzt als `<span class="lead-letters">` statt `::first-letter`,
  damit z. B. „50“ komplett groß steht; Leerzeichen am Ende werden nicht mitgenommen.
- **11.10.2026** – **Anhang an Terminen** (Aktuell): Bild oder PDF (`block.attachment = {ref, kind, name}`).
  Bilder werden auf 2400 px verkleinert (Flyer bleiben lesbar), PDFs als `doc:<id>` im
  Bildspeicher (`api.putFile`, max. ca. 10 MB; Sichern & Laden nimmt sie mit). Im Termin ein
  kleines Vorschaubild bzw. PDF-Symbol rechts. **Großansicht** (`openViewer` in site.js): Bild in
  Seitengröße, Klick aufs Bild = Lesegröße (volle Breite, scrollbar) und zurück; PDF im
  eingebauten Betrachter (Blob-URL, „In neuem Tab öffnen“). Schließen mit ×, Klick außerhalb oder Esc.
- **11.10.2026** – **Clubgeflüster & Insider News (erster Entwurf).** Mitglieder schreiben selbst.
  - **Aktuell** in drei Spalten (ab 1024 px): News · **Clubgeflüster** (Mitte) · Save the Date;
    Handy: Umschalter News · Clubgeflüster · Termine (Standard Clubgeflüster).
  - **Sport → Team-Seite:** „Insider News“ (Spielberichte, Touren, Training); Mannschaftsliste zeigt
    „n Insider News“. Neue Insider News erscheinen auch im Clubgeflüster (roter Rand, Link zum Team).
  - Beitrag: Text (max. 2000 Zeichen, Links werden klickbar) + bis zu 4 Fotos (sortierbar);
    erstes Foto im Beitrag, „+n“; Klick → Kollage → Einzelansicht zum Blättern (Pfeile, Wischen,
    Tasten), schließen mit ×, Klick daneben, Esc. Neueste oben, „Ältere anzeigen“ ab 10.
  - **Rechte:** Lesen öffentlich. Schreiben: Clubgeflüster alle angemeldeten Mitglieder; Insider
    News nur gemeldete Spieler der Mannschaft (`community.rosters`, im Echtbetrieb aus nuLiga-
    Spielermeldung + Abgleich Mitgliederliste) und Admins. Eigene Beiträge bearbeiten/löschen;
    Admins: ausblenden/löschen; andere: „Melden“.
  - Einmalig **Clubregeln** bestätigen; bei Fotos Häkchen „Abgebildete sind einverstanden“.
  - **Jugendliche** (unter 18, `birthYear` in der Mitgliederliste): einmal **Einverständnis der
    Eltern** (Name eines Elternteils + Häkchen; Echtbetrieb zusätzlich Bestätigungsmail).
    Anzeige nur „Vorname N.“. Demo-Jugendliche: Paul Jung (Junioren 15), Mia Kramer.
  - Daten: `db.community = { rosters, posts[] }`; API `posts`, `addPost`, `editPost`, `deletePost`,
    `hidePost`, `reportPost`, `canWrite`, `acceptFeedRules`, `setParentConsent`, `putMemberImage`,
    `teamPostCounts`, `teamRoster`. Für echten Betrieb über mehrere Geräte: Supabase.
- **11.10.2026** – Feinschliff Mitmach-Funktionen:
  - **Accountkarte:** Vorname, Nachname, E-Mail, Handy selbst änderbar (auch Admin). Name/E-Mail
    sind die Daten der Mitgliederliste: neue E-Mail = neue Club-Adresse und Login (Prüfung auf
    Format und Dopplung). Jede Änderung in `db.changeLog` für den Vorstand (Anzeige in der
    Verwaltung steht noch aus; Echtbetrieb: Bestätigungsmail an die neue Adresse).
  - **Mannschaftsliste:** links Name (+ „4er“-Kennzeichen), Mitte Teamfoto + „n Insider News →“
    (Handy: roter Zähler am Foto), rechts Platz und Punkte; Mannschaftsführer nur noch auf der Team-Seite.
  - **Team-Seite:** Teamfoto groß + Infokarte (Platz, Punkte, Mannschaftsführer, Liga, Links
    „Spielplan & Mannschaft“ / „Tabelle der Gruppe“ bei nuLiga), darunter mit Abstand Insider News.
    **Teamfoto ändern dürfen jetzt die Spieler der Mannschaft** (`api.setTeamPhoto`).
  - **Clubgeflüster:** Spieler sehen beim Schreiben „Auch in den Insider News · <Team> zeigen“
    (`post.alsoTeams`); dort mit Hinweis „auch im Clubgeflüster“.
  - **Termine:** Anhang als 76-px-Quadrat unter dem Text (überlagert keine Überschrift mehr).
- **11.10.2026** – Feinschliff 2:
  - Home-Themen: Bild auch **rechts** (`layout: portrait-right | square-right`).
  - Lange Überschriften werden automatisch getrennt (`hyphens: auto`, `lang="de"`).
  - **Save the Date:** Anhang als Quadrat in Größe des Datumsfelds direkt darunter (`.event-side`),
    Text mit voller Breite und gleicher Größe wie News/Clubgeflüster; Aktuell-Spalten gleich breit.
  - **Mannschaftsliste:** Teamfoto links, Name, Knopf „Insider News (n) →“, Platz rechts
    (Handy: Zähler am Foto).
  - **Admins** können beim Schreiben im Clubgeflüster jede Mannschaft für die Insider News
    wählen (Spieler weiterhin nur ihre eigenen). Ursache des Nutzer-Problems: Demo-Max ist nur
    Herren 40 1 zugeordnet, gemeint war Herren 55.
  - **Übersicht aller Beiträge** `#gefluester` (bzw. `#gefluester/<team>`): kleiner Pfeil-Knopf
    neben „Schreib was“; kompakte Karten (Desktop 4 Spalten, Handy 2), Suche nach Name/Stichwort,
    Bereich (Clubgeflüster / Insider News / einzelne Mannschaft), Zeitraum (7/30 Tage), nur mit Fotos;
    Karte antippen öffnet den Beitrag.
- **11.10.2026** – Feinschliff 3: roter Strich unter Zwischenüberschriften mit mehr Luft
  (12 px Strich, 20 px darunter). **Einheitliche Typografie** in News · Clubgeflüster · Save the Date
  (Fließtext .95rem/1.55, Kartenüberschriften 1.15rem Auszeichnungsschrift, 16 px Kartenabstand).
  Automatische Silbentrennung wieder aus. Clubgeflüster-Kopf: Überschrift volle Breite, darunter
  Hinweis links + „Schreib was“ und Pfeil rechts. Beiträge mit **Datum und Uhrzeit** („11. Okt. · 08:38“).
  Bearbeiten/Löschen nur Verfasser; Admin nur „Ausblenden (Admin)“.
  **Profilbild-Ausschnitt** (`openAvatarCropper` in app.js): verschieben + zoomen im Kreis, gespeichert
  wird nur das kleine Bild (320 px), Original bleibt; „Ausschnitt anpassen“ in der Accountkarte.
  **Kopf:** Profilbild oben bündig mit „TFB“, Name dezent rechtsbündig darunter.
- **11.10.2026** – Name unter dem Profilbild wieder entfernt (Nutzer: vorherige Version edler);
  Profilbild wie zuvor unten bündig. **Strichliste in vier Spalten: Getränke · Kranz · Snacks ·
  Equipment** (`tally()` liefert `cats`; Kranz = Artikel mit Symbol „kranz“, Snacks = Bereich
  `snacks`, Equipment = Bereich `shop`, alles andere Getränke). Kranz-Striche in Signal-Rot.
  Handy: Name in eigener Zeile, darunter die vier Spalten; Desktop: Name links, 4 × 84 px.
  Ab 10 Strichen pro Feld „+n“. Demo: einmalig einige Kränze/Snacks ergänzt (`db.demoTallyMix`).
- **11.10.2026** – **Mannschaftsporträt.** Mannschaftsliste: Knopf „Mannschaftsporträt + News“
  mittig zwischen Infos und Platz. Team-Seite: gut sichtbare Porträt-Karte (dunkel, Foto, Titel,
  „Porträt ansehen →“) bzw. „+ Porträt anlegen“ für Spieler/Admins; Insider News bleiben.
  Porträt-Seite `#team/<key>/portraet` im Look der Home-Unterseiten (gemeinsamer Baustein
  `storyHtml()` in site.js): 1–4 Titelfotos (breit/Original/Quadrate, ohne eigene Fotos das
  Teamfoto), Kicker/Überschrift/Unterzeile, Text mit großem Anfang, Zitat, Kollage (Original +
  Ausrichtung). Editor als Seitenleiste mit Live-Vorschau; Fotos per ‹ › sortierbar.
  Daten: `site.teams[key].portrait`, `api.setTeamPortrait` (Admins + Spieler der Mannschaft).
- **11.10.2026** – Strichliste optimiert: Getränke-Spalte breiter, Platz für **15 Striche**
  (drei Bündel), danach „+n“ in derselben Zeile; andere Spalten bis 10 Striche. Linker Rand
  des Notizzettels schmaler (Handy 34 px, Desktop 42 px) – Zettel-Look bleibt.
- **11.10.2026** – **Echter Mannschaftsabgleich aus nuLiga.** `python3 tools/update-rosters.py` liest
  die Spielermeldungen aller Mannschaften (Spielerliste der nuLiga-Mannschaftsseite, Namen im Link
  `rel="ibox…"`) und schreibt `assets/data/rosters.js` – **nur lokal, in .gitignore** (Namen =
  personenbezogene Daten). Die App gleicht „Nachname, Vorname“ (Umlaute normalisiert) mit der
  Mitgliederliste ab (`rosterOf()` in demo-backend.js; Demo-Zuordnung kommt dazu). Ergebnis
  für den Nutzer: Jörn Kämper → Herren 55 1 und Herren 50 1 (Achtung: es gibt auch Jens Kämper –
  immer Vor- UND Nachname abgleichen). Einmal-Korrektur: Admin-Konto aus der Demo-Zuordnung
  Herren 40 1 entfernt, Beiträge mit falscher Mannschaft umgehängt („Ü55“ → Herren 55 1).
  Fehlt rosters.js (z. B. frischer Checkout), läuft die App mit der Demo-Zuordnung.
- **11.10.2026** – Partner-Logos auf allen Seiten um ein Drittel kleiner (Kacheln, Logos und Breite des Duos × 2/3).
- **11.10.2026** – Partner-Duo jetzt auch unter **Verabreden** (Übersicht, Einzelansicht, Anmelde-Hinweis), Seitenschlüssel `treffen`, gleiche Rotation.
- **11.10.2026** – Aktuellen Vorstand von https://www.tfbielstein.de/vorstand-ansprechpartner/
  übernommen: sieben Personen in Originalreihenfolge, veröffentlichte Funktionen, Fotos,
  Telefonnummern und E-Mails. Kai Eichmann nutzt laut direkt abgerufener aktueller Seite
  `kai.eichmann.tennis@gmail.com` (Suchmaschinenkopie veraltet). Bilder lokal unter
  `assets/images/board/`; zentrale Startdaten `TFB.boardSeed` in `assets/data/site-seed.js`.
  Einmaliges Update `club-vorstand-import-2026-10-11` ersetzt auch gespeicherte Platzhalter;
  spätere Änderungen bleiben erhalten. Vorstandseditor bewahrt importierte Bilder und
  ergänzt Telefon/Veröffentlichungsschalter. Keine erfundenen Mitgliedsverknüpfungen;
  bei späterer Verknüpfung gilt ausschließlich die öffentliche Profilfoto-Freigabe.
  Desktop/Smartphone geprüft; sechs Vorstand-/Fototests bestanden. Cache v82.
- **11.10.2026** – Vorstandsfotos als runde Profilbilder (88 px Desktop, 80 px Handy),
  gleicher feiner Rand wie das persönliche Profilbild. Klick öffnet unbeschnittenes Original
  in bestehender Lightbox; bei Mitgliedsverknüpfung sind Vorschau und Original gleichermaßen
  durch öffentliche Foto-Freigabe geschützt. Originaldateien für Kai und Katja nachgeladen.
  Basti und Marco haben separate aufgehellte Vorschauen unter
  `assets/images/board/sebastian-manz-aufgehellt.png` und `marco-hennes-aufgehellt.png`;
  unveränderte Originale bleiben für die Großansicht erhalten. Zuordnung über
  `TFB.boardPhotoPreviews`, ohne gespeicherte Vorstandsangaben zu überschreiben.
  Integriertes image_gen für beide Bearbeitungen; Vorgabe: Gesichtsschatten behutsam aufhellen,
  Identität, Gesichtszüge, Ausdruck, Hautstruktur, Kleidung, Hintergrund, Bildausschnitt und
  Schwarz-Weiß-Stil erhalten, keine Verschönerung oder neuen Details. Ausschnitte und
  Originalansicht auf Desktop/Handy geprüft; sechs Tests bestanden. Cache v83.
- **11.10.2026** – Vorstandseditor: je Foto „Ausschnitt anpassen“, gleicher Editor
  wie im eigenen Profil (Verschieben/Zoom). Speichert nur einen 320-px-Ausschnitt in
  `person.photoCrop` samt Zoom/Position und Quellkennung; Original und persönliches
  Mitgliedsfoto unverändert. Neuer Quellstand/Fotowiderruf macht verknüpfte Ausschnitte
  ungültig; öffentliche `site()`-Antwort entfernt Roh-Ausschnitte, `boardPeople()` prüft
  Foto-Freigabe. `openAvatarCropper` über `TFB.ui` wiederverwendbar, optional mit
  Startposition und Abbrechen-Rückkehr. Board-Änderungen erst mit „Vorstand speichern“
  dauerhaft. Lokale HTML-Vorschau lädt bei Bedarf `assets/data/board-photo-data.js`
  (mechanisch eingebettete sieben Quelldateien), um file://-Canvas-Beschränkungen zu
  vermeiden. Datei bei Änderung der Quelldateien neu erzeugen. Vorschau: Verschieben,
  Zoom, Übernehmen, Speichern, erneutes Öffnen und Handy-Layout geprüft. Direkte
  file://-Browserprüfung durch Browserrichtlinie nicht möglich. Cache v84.
- **11.10.2026** – Home-Themen: `navigation` = `detail` / `link` / `none` steuert
  Bild/Überschrift unabhängig vom CTA. `showMore` blendet „Mehr erfahren“ bei einer
  Detailseite aus, ohne vorhandene Detailtexte/Fotos zu löschen. Kiosk per einmaligem
  Update auf direkten bestehenden Link umgestellt; Padel unverändert. Link-Symbol
  auswählbar, eigenes rundes Link-Foto weiterhin möglich. Home-Vorführhinweis entfernt.
  Jedes Thema kann eine separate `album`-Fotoseite unter `#home/<id>/fotos` erhalten,
  ohne Artikeltext, mit bis zu 100 Fotos, optional Originalformat, Bildsortierung und
  bestehender Großansicht. Reiter „Fotokollage“ im WYSIWYG-Editor; für `h-50` leer
  vorbereitet, keine Testbilder in die eigentlichen Startdaten übernommen.
  Hauptlink und Fotolink separat positionierbar/ziehbar; Pfeile ändern Reihenfolge am
  gleichen Platz. Limit vor Upload und beim Speichern geprüft. Texte, Bilder und Links
  bestehender Home-Beiträge bleiben erhalten. Vier neue Home-Tests und neun bestehende
  Vorstand-/Fototests bestanden; Upload, Speichern, Großansicht, Reihenfolge und mobile
  Kollage in isolierter Vorschau geprüft. Cache v85.
- **11.10.2026** – Signature-Rot beim Hover auf Home-Überschriften gilt auch
  für direkte Seitenlinks, nicht nur für Beiträge mit Detailseite. Tastaturfokus
  erhält denselben Effekt. Cache v86.
- **11.10.2026** – Club: schwarzer Button „Mitgliedsbeiträge“ vor dem Aufnahmebutton
  (Signature-Rot mit schwarzem Text). Beitragsfenster mit Schnuppermitgliedschaft,
  Jahresbeiträgen und Familien-/Aufnahmehinweisen aus der vom Nutzer gelieferten
  Beitragsübersicht. Bestehendes Schließen-X und Escape bleiben nutzbar. Cache v87.
- **11.10.2026** – Club-Aufnahmebuttons: optionaler, frei editierbarer Hinweis `note`
  daneben; einmalig vorbelegt mit „TFB-Mitglieder erhalten 10 Prozent Rabatt auf alle
  Padel-Buchungen.“ Im Knopf-Editor ändern oder leeren. Clubgeflüster und Insider News
  akzeptieren sechs Fotos beim Schreiben/Bearbeiten; mehr als sechs werden abgewiesen,
  nicht still gekürzt. Vorschau und Beitragsübersicht zeigen responsive Collagen:
  bei sechs Fotos ein großes Bild, zwei rechts, drei darunter. Klick auf ein Beitragsfoto
  öffnet direkt dessen Einzelansicht mit Navigation. Eigene persönliche Nachrichten sind
  im aktuellen Projekt nicht implementiert; Collage-CSS ist wiederverwendbar.
  Desktop-/Mobilvorschau und Einzelbildwechsel geprüft; 16 Tests bestanden. Cache v88.
- **11.10.2026** – Chat-Galerie: erster Klick auf die Vorschau öffnet immer die
  große vollständige Collage. Klick auf ein Collagefoto öffnet die Einzelansicht;
  erst dort erscheinen Pfeile. Klick auf das Einzelbild blättert weiter, horizontales
  Wischen vor/zurück ist möglich. Vertikales Scrollen und Mehrfingergesten lösen
  keinen Bildwechsel aus; Folge-Klick nach einem Wischen wird unterdrückt.
  Browser-Klickablauf geprüft, Wischlogik automatisiert getestet. 17 Tests, Cache v89.
- **11.10.2026** – Neuer Hauptmenüpunkt **Chat** zwischen Kiosk und Aktuell.
  `#chat` zeigt Clubgeflüster plus bisherige Team-Beiträge/Teaser als großen,
  chronologischen Feed, neuester Beitrag zuerst. Schreiben und „Alle Beiträge“
  stehen oben. `#chat/alle` bietet die bestehende Übersicht mit Suche und Filtern;
  alte `#gefluester`-Links bleiben gültig und markieren Chat im Menü.
  Aktuell enthält nur noch News (2/3) und Termine (1/3), mit jeweils einer
  zusammenhängenden Spalte. Mobil: News / Save the Date umschaltbar, News als Start.
  Bestehende Inhalte, Redaktionsbearbeitung und Mannschaftsrechte bleiben erhalten.
  Chat kann auch als Linkziel im Home-Editor gewählt werden. Desktop und Smartphone
  geprüft; 18 Tests bestanden. Cache v90.
- **11.10.2026** – Chat-Feed linksbündig an derselben Kante wie die Seitenüberschrift,
  weiterhin auf gut lesbare 760px begrenzt. Sportliste ab 640px mit vier Spalten:
  Foto, Name, freier mittlerer Bereich, Platzierung. Porträt-/Newsbutton ist innerhalb
  des freien Bereichs zentriert statt innerhalb der gesamten Zeile. Buttonbreite
  passt sich schmalen Zeilen an. Ausrichtung auf Desktop und Tablet per Geometrie
  überprüft (0px Abweichung, keine Überlappung). Cache v91.
- **11.10.2026** – Chat-Texte sind über den Admin-Stift auf `#chat` und
  `#chat/alle` editierbar. 24 Textfelder: Haupttitel, Clubgeflüster-Überschrift,
  Beschreibungen, Aktionen, Übersichtsüberschrift/-kicker, Suchfeld, Filter,
  Zeiträume, leere Zustände und Beitragszählung. Speicherung als `site.chatText`,
  fehlende Felder fallen auf `TFB.siteSeed.chatText` zurück; leere Texte bleiben leer.
  Bestehende Beiträge und Fotos werden nicht geändert. Speichern und Unterseitenstift
  in isolierter Browser-Vorschau geprüft; 19 Tests bestanden. Cache v92.
- **11.10.2026** – `photo-drop.js`: Datei-Drag-and-drop für vorhandene Bildfelder
  (Chat, Website-/Galerieeditor, Profil), inklusive Hervorhebung. Übergibt FileList
  an denselben Change-Handler wie die Dateiauswahl, ohne separate Speicherlogik.
  Interne Sortiergesten bleiben unangetastet; Mehrfach-Drops auf Einzelfelder und
  ungeeignete Dateien werden abgewiesen. Keine Datei-/Netzwerk-URLs werden aus
  Drag-Texten geladen. Unaufgelöste macOS-Dateiversprechen bekommen eine Meldung
  mit JPEG-Export als Ausweichweg. Echte Übergabe Fotos-App → Chrome nicht geprüft;
  Dateibatches und Fehlerfälle automatisiert geprüft. 24 Tests, Cache v93.
- **11.10.2026** – Die sieben automatisch erzeugten Beispielbeiträge werden nicht
  mehr angelegt. Beim Laden werden ausschliesslich die alten IDs `p-s1` bis `p-s4`
  und `p-t1` bis `p-t3` aus vorhandenen Chatdaten entfernt, auch nach dem Import
  eines alten Backups. Eigene Nachrichten, Bildreferenzen und Bildspeicher bleiben
  erhalten. Regressionstest fuer Erststart, wiederholtes Laden und Backup-Import;
  Foto-Privatsphaerentest legt jetzt einen eigenen Testbeitrag an. Cache v94.
- **11.10.2026** – Projekt-Update auf Nutzerwunsch: verbindlichen aktuellen Stand
  vor den historischen Verlauf gesetzt und `UEBERGABE.md` neu konsolidiert.
  Geänderte Navigation, Chat-/Galeriefunktionen, Club/Vorstand, Aufnahmegrenzen,
  Foto-Drop, Prüfstand und offene Veröffentlichungsschritte zusammengeführt.
  Nur Dokumentation geändert; keine Veröffentlichung, Mail, Datenlöschung oder Commit.
- **11.10.2026** – Sport in Mannschaften und Training unterteilt, vorhandene
  Bausteine bleiben im selben Seitenspeicher und Admin-Editor. Trainertext/Kontakte
  anhand https://www.tfbielstein.de/trainer/ übernommen, Originalfoto lokal als
  `assets/images/leon-kaufmann.jpg` (1200px breit), im Offline-Cache enthalten.
  Schnuppertext vom Nutzer und Vereinsseite übernommen, Kalenderlink zur bisherigen
  Website. Einmalige Inhaltsmigration ersetzt nur bekannte alte Standardtexte;
  spätere oder bereits abweichende Texte bleiben erhalten. Bestehenden Jugendblock
  bewahrt. Foto, Funktion, Telefon und E-Mail editierbar. Desktop-/Mobilvorschau und
  Trainer-Editor geprüft; 26 Tests bestanden. Cache v95, keine Veröffentlichung.
- **11.10.2026** – Globale dezente Fußzeile mit Impressum/Satzung und Copyright.
  `assets/data/legal-pages.js` enthält alle 17 Paragraphen der Nutzer-Satzung mit
  historischem Stand 20.03.2015, nur visuell gegliedert. SHA-256-Abgleich des gesamten
  Wortlauts (Leerraum und §-Abstand normalisiert) bestanden. Neue Seiten nur bei
  Fehlen ergänzt, spätere Admin-Änderungen erhalten. Eigener Stift und Verwaltung
  führen in bestehenden Editor; keine Partnerwerbung auf Rechtstext-Unterseiten.
  Registerdaten (Amtsgericht Köln, VR 600693), USt-ID DE330174727, Postanschrift und
  Verantwortlicher Sebastian Manz aus https://padel-bielstein.de/ übernommen.
  Abweichung im Vorsitz geklärt: Nutzer bestätigt Kai Eichmann, nicht den auf Padel
  genannten Jens Kämper kommissarisch. Gemeinschaftliche Vertretung mit Sebastian
  Manz und Daniel Pollmann. Rechte Dritter ausdrücklich vorbehalten.
  Satzung nennt historisch Gummersbach und verlangt schriftlichen Mitgliedsantrag;
  nicht eigenmächtig geändert. Vereinsprüfung vor Veröffentlichung bleibt nötig.
  Desktop-/390px-Vorschau und Linkwechsel geprüft, mobil kein horizontaler Überlauf;
  27 Tests bestanden, Cache v96. Keine Veröffentlichung, keine Padel-Änderung.
- **11.10.2026** – Gemeinsamer nichtdestruktiver Foto-Rahmeneditor `photo-frame.js`:
  Portrait 3:4, Landschaft 3:2, Quadrat; Zoom 1–4, normierte Position 0–1 mit
  Pointer-Drag und zwei Reglern. Startformat ohne Einstellung aus Originalmaßen.
  CSS-Cover, Position und Transform-Origin entsprechen der Drag-Geometrie; kein
  Canvas, keine Datei-/CORS-Konvertierung notwendig. Originaldatei bleibt erhalten.
  Admin-API `setPhotoFrame` prüft Rechte/Referenz/Format, begrenzt Zahlen und rollt
  bei Speicherfehlern zurück. Speicherung als `site.photoFrames[ref]`, automatisch
  Bestandteil der bestehenden Sicherung; gemeinsame Einstellung bei Wiederverwendung
  derselben Referenz. Einzelbild-Galerie zeigt das Original, Collagen bleiben im Raster.
  Foto-Felder und Galerie-/Hero-/Album-/Tile-Thumbnails, Chat-Komposition sowie
  Bildanhänge bieten Einpassen. Profil/Board weiterhin bisheriger runder Cropper.
  Separate zugängliche Dialogebene mit Fokus/Escape, darunterliegende Textentwürfe
  bleiben offen und unangetastet. Übernehmen speichert sofort, Originalansicht setzt
  nur Metadaten zurück. Desktop Drag/Zoom/Save/Reload und 390px-Dialog geprüft;
  360px-Quadrat exakt, kein mobiler Überlauf. 28 Tests bestanden, Cache v97.
- **11.10.2026, v98** – News-/Home-Felder mit `block.images` bis 100 Fotos:
  vorhandenes Einzelbild beim ersten Collage-Upload übernehmen, Sortieren/Entfernen/
  Einpassen im Admin. Serverseitige lokale API-Validierung des 100er-Limits;
  fünfteilige Magazin-Vorschau plus Restanzahl, große scrollbar vollständige Collage
  vor Original-Einzelbildern mit Klick/Pfeilen/Wischen. Keine Änderung der Chat-Grenze
  von sechs Bildern. Unveränderte Beispiel-News anhand bekannter IDs und Inhalte
  entfernen; gepflegte Texte/Fotos/Alben schützen, Bereinigung auch nach Backup-Import.
  Kalenderknopf durch `s-schnupper-dates` ersetzt: „Termine für Schnuppertraining
  demnächst“, leerer editierbarer Termintext statt erfundener Termine. Migration nur
  einmal, spätere eigene Termintexte bleiben. 30 Tests bestanden.
- **11.10.2026, v99** – Gemeinsame Einzelfoto-Vollbildfunktion `photo-viewer.js`:
  Mannschaftslisten-/Porträt-/Trainer-/Inhaltsfotos sowie sichtbare Teilnehmer- und
  Chat-Profilbilder per Klick oder Enter/Leertaste öffnen. Foto-Klick innerhalb von
  Mannschafts-/Home-Links zeigt das Original; andere Linkflächen navigieren weiter.
  Collagen/Galerien, bestehende Vorstands-Originalbilder, Link-Vorschaubilder,
  Fotoeditoren und Profil-Menü behalten ihre Bedienung. Keine zusätzliche
  Mitgliederabfrage, Freigaben unverändert. Unbeschnittenes Foto bis 1600px/84vh;
  X, Hintergrund oder Escape schließen, Bildklick bleibt offen. Fokus und vorheriger
  Scrollzustand zurück, Escape schließt kein darunterliegendes Formular. 32 Tests
  bestanden; Desktop-Mannschaftsfoto und Trainerfoto, Schließwege und mobile
  390×844-Ansicht erfolgreich in isolierter Vorschau geprüft.
- **11.10.2026, Projekt-Update auf Nutzerwunsch** – Projektgedächtnis und Übergabe
  auf v99 konsolidiert, veraltete Kalenderangaben und Testzahlen im aktuellen Stand
  korrigiert, neuer Vollbild-Testbefehl und Modulverzeichnis ergänzt. Historische
  Zwischenstände erhalten. Kein Code geändert, keine erneuten Tests, kein Commit,
  kein Versand und keine Veröffentlichung; offene Produktions-/Rechts-/Bankfreigaben
  bleiben bestehen. Padel-Projekt nicht verändert.
- **12.10.2026** – **Verabreden rund (v123).** Reihenfolge Einzel · Doppel · Training · Anderes.
  Beim Anlegen „Einmalig“ (Einladung sofort) oder „Jede Woche“ (regelmäßige Einladung: erster Termin,
  bis einschließlich, Einladung 1–7 Tage vorher; jeder Termin wird neu zu-/abgesagt; Serie in der
  Übersicht unter „Regelmäßig“, ändern/beenden nur durch den Einladenden, einzelne Termine absagbar).
  **Postfach** (Glocke neben dem Profilbild, Zahl = ungelesen): Einladungen, Zu-/Absagen an den
  Einladenden, „Runde steht“, Nachrücken, Absagen, Erinnerungen. Keine E-Mails, keine Banner mehr.
  Chat/Insider News bewusst ohne Postfach. Übersicht: „Wartet auf deine Antwort“ oben.
  Echtbetrieb: Serverdienst legt die Wochentermine an; optional später Web-Push für die Glocke.
  Außerdem 12.10.: wöchentlicher nuLiga-Abgleich per GitHub Actions (montags), Sport-Knopf färbt
  „Mannschaftsporträt“/„News“ einzeln rot (v121), Clubgeflüster-Beitrag nur aus Mannschaft
  entfernen (v122). Supabase-Plan: ein Vereins-Account, zwei Projekte (padel, tfb); ein
  gemeinsamer Lastschrift-Kiosk ist Wunsch des Nutzers, Vorstand entscheidet.
- **12.10.2026** – **Gruppen mit Bestätigung (v124).** Wer zu einer Gruppe hinzugefügt wird, steht dort
  als „unbestätigt“ und bekommt eine Einladung ins Postfach (Bestätigen / Nein danke). Erst nach
  Bestätigung erscheint die Gruppe bei ihm unter „Meine Gruppen“; Hinweise verschwinden, sobald alle
  bestätigt haben (Ersteller bekommt „Alle haben bestätigt“). Wöchentliche Gruppentrainings laden immer
  die aktuell bestätigten Mitglieder ein. Nur der Ersteller bearbeitet die Gruppe, andere können sie
  verlassen. „Anderes“ heißt jetzt **„Mannschafts-Spiel“**; beim Anlegen optional „Treffen um“ und
  „Abfahrt um“ (in Karte und Einladung sichtbar).
- **12.10.2026** – **Verabreden ohne Historie (v125).** Grundsatz des Nutzers: keine Spuren, so schlank
  wie möglich. Termine verschwinden nach ihrem Tag, Serien nach ihrem Enddatum bzw. sofort beim
  Beenden, Postfach-Einträge mit ihrem Termin; beantwortete Einladungen und gelesene Gruppen-Infos
  sofort. Aufräumen läuft bei jedem Speichern (`prune()` in meet.js). Kopf: Glocke 34 px, unten bündig
  mit dem Profilbild, 22 px Abstand; Desktop-Menü gleichmäßig zwischen Logo und Glocke verteilt.
- **12.10.2026** – **Mitgliederliste und automatische Sicherung (v132).** Admin → „Mitgliederliste“:
  Excel (.xlsx, ohne Zusatzbibliothek per DecompressionStream entpackt) oder CSV. Spalten der
  Vereinsliste: Nr., Name, Vorname, m, w, Handy, E-Mail, E-Mail – übernommen werden nur Nr., Vorname,
  Name, E-Mail(s). Vorschau neu/geändert/unverändert/nicht mehr dabei; Ausgeschiedene nur deaktiviert;
  beim ersten Import werden die erfundenen Beispielmitglieder ausgeblendet, das Admin-Konto per
  Name/E-Mail zugeordnet (Anmelde-E-Mail bleibt). Echte Mitgliederdaten nie ins Repo.
  Admin → „Sichern & Laden“ → „Automatisch sichern“: einmal Ordner wählen (File System Access API),
  dann schreibt die App `TFB-Sicherung-automatisch.json` (höchstens 1×/Min. bei Änderung, beim
  Verlassen). Ordner sollte außerhalb von Git-Repos liegen. `navigator.storage.persist()` beim Start.
- **12.10.2026** – **Gruppen: alle Hinzugefügten zählen (v133).** Eine Gruppe lädt immer alle ein, die der
  Ersteller hinzugefügt hat (bestätigt + unbestätigt); raus ist nur, wer ablehnt oder austritt.
  „Unbestätigt“ heißt nur: Gruppe erscheint bei ihm noch nicht unter „Meine Gruppen“. Karte zeigt
  „N Mitglieder · X unbestätigt“. Namen in Gruppen und Einladungen alphabetisch nach Nachname.
  Vorführung bestätigt Gruppen-Einladungen immer (keine zufälligen Absagen mehr).
- **12.10.2026** – **Postfach aufräumen (v134).** Jeder Hinweis hat ein ×; „Alle Hinweise entfernen“ lässt
  nur offene Einladungen stehen (die haben kein ×, sie gehen mit der Antwort). Hinweise verschwinden
  sonst nach 7 Tagen bzw. mit ihrem Termin. Neu: „Du bist jetzt Mitglied der Gruppe …“ für den, der bestätigt.
- **12.10.2026** – **Admin aufgeräumt (v137).** Seite „Verwaltung“ entfällt (#verwaltung → Home). Seiten und
  Kiosk bearbeitet der Admin über den Stift oben rechts (neu auch auf der Kiosk-Seite). Im Konto-Fenster
  (nur Admins) Bereich „Admin“: Mitgliederliste laden, Sichern & Laden + Automatisch sichern,
  Foto-Freigaben prüfen. Schrift fest **Avenir Next**, Markenfarbe fest **Anthrazit #2A2D2E** – keine
  Umschalter mehr. Konto: „E-Mail-Benachrichtigungen vom Club“ (Standard an); „Einladungen von allen“
  (Standard an) ist verknüpft: ausgeschaltet findet man die Person beim Verabreden nur über gemeinsame Gruppen.
- **12.10.2026** – **Entscheidung Kiosk-Freigabe:** Kein Zurücknehmen in der App. Die Freigabe „Kiosk &
  Lastschrift“ bleibt bestehen, sonst entstehen Lücken (Konsum ohne Buchung). Wer aussteigen will,
  schreibt dem Vorstand eine E-Mail; der Vorstand nimmt die Freigabe dann zurück.
- **12.10.2026** – **Stand eingefroren als Tag `stand-2026-10-12` (v138).** Nutzer will vor weiteren
  Änderungen mit dem Vorstand sprechen, ob und wie es mit der neuen Website weitergeht. Bis dahin
  keine Änderungen an der App. Zusammenfassung des Tages: siehe UEBERGABE.md oben.
  iPhone/iPad-Test: nur über WLAN-Server des Macs möglich; Demo-Passwort-Prüfsumme unterscheidet
  sich zwischen `file://` (SHA-256) und `http://` im WLAN (Ersatz-Prüfsumme) – siehe Übergabe.
- **12.10.2026 (nach dem Einfrieren)** – **Hintergrundfarbe je Home-Thema (v139).** Im Home-Editor (Stift)
  neuer Schritt „4 · Hintergrund der Textseite“ (Links jetzt Schritt 5): Farbfeld, **Pipette**
  (Chrome-EyeDropper, nimmt Farben vom ganzen Bildschirm, auch aus anderen Fenstern), Farbcode,
  „Standard“ = Creme **#F5F0E6**. Gilt im Look „Wechselspiel“, je Thema separat (`block.bg`), Live-Vorschau.
  Auf dunklem Grund automatisch helle Schrift (`feature-dark`, Entscheidung nach WCAG-Kontrast).
  Rückfallpunkt bleibt Tag `stand-2026-10-12`.
- **12.10.2026** – **Farbe der Link-Knöpfe je Home-Thema (v140).** Schritt „4 · Farben“ im Home-Editor:
  „Hintergrund der Textseite“ (Standard #F5F0E6) und „Hintergrund der Link-Knöpfe“ (Standard #FFFFFF),
  beide mit Farbfeld, Pipette, Farbcode, „Standard“ (gemeinsamer Baustein `colorField`/`wireColorFields`
  in site.js). Gilt für Pillen und Knopf-Links des Themas (`block.linkBg`); Schrift passt sich an
  (`links-dark`/`links-light`).
- **12.10.2026** – **Abstände der Links auf Home (v141).** Standard jetzt 26 px zwischen Text und erstem
  Link (vorher 13) und 14 px zwischen zwei Links (vorher 10). Im Home-Editor unter „5 · Links“ je Thema
  einstellbar: „Abstand über den Links“ und „Abstand zwischen den Links“ mit ▲/▼ (2 px, gedrückt halten
  wiederholt), „Standard“; Live-Vorschau. Daten `block.linkTop`/`block.linkGap`, CSS-Variablen `--link-top`/`--link-gap`.
- **12.10.2026 abends** – **Eingefroren als Tag `stand-2026-10-12-abend` (v141).** Nutzer: „Perfekt. Aktuell
  keine Wünsche mehr offen.“ Nächster Schritt liegt beim Nutzer: Gespräch mit dem Vorstand, ob und wie es
  mit der neuen Website weitergeht. Bis dahin keine Änderungen an der App ohne ausdrückliche Bitte.
- **12.10.2026** – v142: Anmelde-Symbol (abgemeldet) mit demselben Ring wie das Profilbild. v143: Passwortfelder
  (Anmelden, Passwort festlegen + Wiederholung) mit Auge rechts zum Anzeigen/Verbergen (beide Felder zusammen).
  Hinweis: Demo-Kennwort zurücksetzen per Konsole (passwordHash des eigenen Kontos auf null) → beim nächsten
  Anmelden neues Passwort festlegen; „Passwort vergessen“ per Mail kommt erst mit Supabase.
- **12.10.2026** – v144: Demo-Kasten „Zum Ausprobieren: max@tfb-demo.de“ auf der Anmeldeseite entfernt.
  v145: Profilbild/Anmelde-Symbol und Glocke werden ab 1024 px per Messung (`alignHeader()` in app.js) mit ihrer
  Unterkante exakt auf die Grundlinie der Menüschrift gesetzt (fester px-Versatz aus v144 war falsch – die
  Schriftmaße unterscheiden sich zwischen Browsern/Breiten; im Chrome des Nutzers rutschten sie zu hoch).
  v146: Messung korrigiert – die Menüpunkte sind Flex-Boxen, die Sonde lag 3,6 px zu hoch. Grundlinie jetzt
  über Textzeile (Range) + Oberlänge der Schrift (Canvas). Foto- und Glocken-Unterkante = Grundlinie der Menüschrift.
  v147: optischer Ausgleich – Kreise (Profilbild, Glocke) ragen 4 px unter die Grundlinie (`OVERSHOOT` in
  `alignHeader()`), da sie sonst zu hoch wirken. Wert bei Bedarf dort anpassen. Menüschrift unverändert 11,84 px.
  Nutzer hat mit Lineal geprüft: v147 (4 px optischer Ausgleich) „sieht schick aus – genau so lassen“.
- **12.10.2026** – **Versteckter Vorführ-Schalter (v148, nur Demo):** Klick auf den **roten Ball** im TFB-Logo
  oben links blendet für Admins alle Admin-Werkzeuge aus (Stifte, Admin-Bereich im Konto, „Ausblenden (Admin)“)
  – Mitglieder-Ansicht ohne Abmelden; erneuter Klick blendet sie wieder ein. Nach dem Neuladen immer sichtbar.
  Rest des Logos führt weiter zu Home. Umsetzung: `state.member.isAdmin` vorübergehend false (`adminHidden`),
  Klasse `admin-hidden` am body; nur wenn `api.mode === 'demo'`. Im Echtbetrieb entfernen oder bewusst entscheiden.
- **12.10.2026** – v149: Menüpunkt Padel (externer Link) wird beim Überfahren dunkel wie die anderen.
  **Eingefroren als Tag `stand-2026-10-12-v149`.** Nutzer: „alles jetzt eins A“. Nächster Job: Getränkeliste der
  Tennisfreunde (heutiges Angebot) besorgt der Nutzer → Kiosk-Sortiment exakt darauf umstellen.
- **12.10.2026** – **Farbfassungen Home: Standard | Bunt (v150).** Genau **eine** bunte Fassung = die Farben je
  Thema (`block.bg`, `block.linkBg`); „Standard“ zeigt alle in Creme/Weiß, ohne die Farben zu löschen.
  Umschalter „Farben der Themen“ im Home-Bearbeiten-Modus (unter dem Look), gespeichert in `site.homeColors`.
  Farbänderung im Thema → automatisch „Bunt“; beim Bearbeiten zeigt die Vorschau das Thema immer farbig.
  **Versteckter Vorführ-Schalter (nur Demo, Admin – auch bei ausgeblendeten Stiften):** Klick auf die große
  „01“ des ersten Themas wechselt Standard ↔ Bunt, nicht gespeichert (`colorPeek`); nach Neuladen gilt die
  gespeicherte Einstellung. Mehrere bunte Fassungen bewusst verworfen (Nutzer).
- **12.10.2026** – **Vorführ-Voreinstellungen (v151, nur Demo):** Beim Laden sind die Admin-Werkzeuge
  **ausgeblendet** (Getter auf `state.member` in app.js liefert isAdmin=false/adminHidden=true, bleibt auch nach
  Profil-/Foto-Speichern bestehen); roter Ball blendet sie ein/aus. Home-Farben laden **Standard** (beige);
  Voreinstellung jetzt `site.homeColorMode` (Standard, falls nicht „Bunt“ gewählt), Klick auf „01“ zeigt Bunt.
  Farbänderung im Thema zeigt bis zum Neuladen „Bunt“, ändert aber nicht die Voreinstellung.
  Eingefroren als Tag `stand-2026-10-12-v151`.
- **12.10.2026** – v152: Vorführ-Umschalter Standard ↔ Bunt auf **jeder** Themennummer der Startseite (01, 02, 03 …)
  und in der Demo **für alle Ansichten** (Admin ein- oder ausgeblendet, auch abgemeldet). Tag `stand-2026-10-12-v152`.
- **12.10.2026 – Tagesabschluss v160:** Farbumschalter im Editor korrigiert (v153),
  vollständige Foto-Sicherung abgesichert und bestätigt (v154), Vereinsliste samt Preisen
  übernommen (v155), Symbole nach Nutzerfeedback verfeinert (v156–v159), Spielbetrieb mit
  Flutlicht/Gastspieler ergänzt und Spezialitäten/Snacks getrennt (v160). Nutzer bestätigt
  alles und beendet den Arbeitstag. Eingefroren als `stand-2026-10-12-v160`, nur lokal.
  46 Tests erfolgreich; nächste Arbeiten nur auf neuen Auftrag, offene Risiken siehe Übergabe.
- **13.10.2026 – Abschluss nach Layout-Abnahme und Playwright-Einrichtung:** Aktuell-
  Spaltenabstand schrittweise 8 → 12 → 16px. Mobile Übersichtsbuttons an die sichtbare
  Spaltenüberschrift gebunden, rechts und untenbündig mit deren rotem Strich, unterhalb
  der News/Save-the-Date-Auswahl. Home im Wechselspiel rechts untenbündig mit der 01;
  Zahl weiterhin links. Desktop-Positionen erhalten. Playwright 1.64.0 mit Chromium
  im Projekt installiert, wiederholbare Installation und Testbefehle in den neuen
  `package.json`/`package-lock.json`. Alle drei Browser-Tests erfolgreich, Screenshots
  kontrolliert; Übersichtstest um 500px sowie beide mobilen Tabs und Unterkanten ergänzt.
  Nutzer: „Gefällt mir sehr gut alles jetzt“, keine weiteren Anpassungen. Nur lokale
  Änderungen; kein Commit, Tag, Push, Deployment oder neue JSON-Sicherung. Cache-Bezeichnung
  bleibt v165, technische Folgeaufgaben aus früherer Prüfung weiterhin offen.
- **13.10.2026 – Folgeabschluss v175:** Desktop-Fokus mit dezentem F links neben der
  Klingel; auf iPhone/iPad/Android ausdrücklich kein F. Installationsstreifen und
  Kontozugänge wieder entfernt, native öffentliche Installation zurückgestellt.
  Mac-Desktop-/Vorführknöpfe lokal erstellt; ad-hoc-Paketprüfung ersetzt keine
  Apple-Notarisierung. Wortumbruch von Feature-Titeln und Fotoüberlauf/heller
  Fokus-Rand korrigiert. Wochentagsauswahl Mo–So für Einladungen, späterer Start
  desselben Serientags und eigenes Wochentagsfeld in Details. Fokus-/Einladungs-/
  Galerie-/Übersichtstests positiv. Projektgedächtnis und Übergaben aktualisiert,
  kein Commit/Push/Deployment/neuer Tag/JSON-Export. Aktueller Abschnitt oben gilt.

## Verbindliche Betriebsentscheidung 15.10.2026

Für die Vorführung bleibt der vorhandene Cloudflare-Worker mit D1 für Anmeldung
und geschützte Mitgliedersuche aktiv. Kiosk, Chat, Verabredungen und Postfächer
bleiben bislang lokale Simulationen; Veröffentlichung allein macht sie nicht
zu geräteübergreifenden Vereinsdaten.

Für einen später vom Verein beschlossenen Echtbetrieb bevorzugt der Nutzer
Supabase im Vereinsumfeld, weil Supabase bereits für die Padel-App vorhanden ist.
Kein zusätzliches Cloudflare-Konto für den Verein planen. Vor der Umstellung
Vereinsorganisation, separates Projekt und Zuständigkeiten prüfen; bestehende
Padel-Daten/Anmeldung nicht nebenbei ändern. Noch keine Migration beauftragt.
GitHub bleibt für Code/Website. Nachrichten bleiben im Klingel-Postfach ohne
E-Mail-Zustellung; persönliche Freischaltcodes dienen derzeit der Zugangshilfe.

Spieler einschließlich Einladender dürfen ihre Zusage später über „Kann nicht“
ändern, bleiben unter „abgesagt“ sichtbar und geben ihren Platz an den ersten
Ersatz weiter. Diese bestehende Funktion beibehalten. „Weitere Mitglieder einladen“
in der Terminansicht ist vom Nutzer bestätigt.

Nach Löschen der Browserdaten fehlen drei eigene Chat-Beiträge. Die private
Sicherung vom 15.10.2026 enthält sie mit acht Bildern und Mannschaftszuordnungen.
Gezielte Ergänzung vorbereiten; keine vollständige Rücksetzung, keine Sicherung
oder private Mitgliederliste ins öffentliche Repository oder Pages-Paket aufnehmen.

## Kommentare und freiwillige Überschrift – 15.10.2026

Vom Nutzer beauftragt: Nachrichtentext zuerst; Überschrift bleibt freiwillig und
wird über „Überschrift hinzufügen“ aufgeklappt. Bestehende Überschriften erhalten.
Ohne Überschrift verwendet die Beitragsübersicht einen Textanfang und durchsucht
weiterhin den gesamten Beitrag.

Eine flache Kommentarebene unter der vollständigen Chat-Beitragsansicht. In Feed
und Übersicht nur Einstieg/Anzahl; unter dem Beitrag Sprechblase mit „Kommentieren“
oder Kommentarzahl. Nur angemeldete, für den Bereich berechtigte Mitglieder dürfen
schreiben; bisherige Regeln-/Elternfreigaben gelten weiter. Eigene Kommentare
bearbeiten/löschen, Verwaltung kann andere entfernen. Text zunächst ohne Fotos,
verschachtelte Antworten oder Emoji-Reaktionen. Kommentare öffentlich wie der
zugehörige Beitrag; ausgeblendete Beiträge bleiben entsprechend geschützt.

Klingel: neue Kommentare nur für den Beitragsautor, je Beitrag gebündelt,
Selbstkommentare ausgenommen. Lesen/Entfernen dauerhaft gespeichert, neue spätere
Kommentare erzeugen erneut einen Hinweis; Bearbeitung erzeugt keinen neuen Hinweis.
Bestehende freiwillige Gruppenbeitrags-Hinweise bleiben separat. Abonnieren von
Unterhaltungen und Handy-Push sind weiterhin spätere Optionen.

Auch Kommentare und Gelesen-Status bleiben in der aktuellen Vorführung lokal.
Sie sind Bestandteil der vollständigen privaten JSON-Sicherung; für Vereinsbetrieb
zusammen mit Beiträgen/Postfach nach Supabase migrieren. Keine echte Online-
Zustellung, kein E-Mail-Versand und keine Änderung der Padel-Anwendung.

## Korrektur 15.10.2026: Überschrift sichtbar, eigene Mannschaften, Kommentarfotos (v195)

Verbindliche Nutzerkorrektur: Das freiwillige Überschriftenfeld im Chat-Editor
bleibt dauerhaft sichtbar. Kein Aufklappen mehr. Nachrichtentext bleibt zuerst.
Die Admin-Auswahl fremder Mannschaften im normalen Beitragseditor entfällt.
Stattdessen „Auch in meiner Mannschaft anzeigen“ bzw. bei mehreren Mannschaften
„Auch in meinen Mannschaften anzeigen“ mit Auswahl der eigenen Mannschaften.
Bestehende Beitragszuordnungen werden beim Bearbeiten erhalten; zusätzliche
Mannschaftsanzeige verschickt keine E-Mail und ist keine automatische Nachricht
an jedes Mannschaftsmitglied.

Bisher kam im geschützten Zugang keine Mannschaftszuordnung an. Worker ergänzt
nun ausschließlich beim eigenen Login/Sitzungsabruf das Feld `teams` aus privater
D1-Tabelle `member_teams`. Schemaänderung für bestehende Datenbanken steht unter
server/cloudflare/migrations/0002-member-teams.sql und muss vor Deployment laufen.
Private nuLiga-Meldungen wurden mit aktiven Mitgliedern abgeglichen; Namens-
Mehrdeutigkeiten nicht allgemein automatisch zuweisen. Das vom Nutzer eingerichtete
Verwaltungskonto wurde anhand des alten eigenen Kontos gesondert abgeglichen.
Vorführung: 313 Zuordnungen für 138 Konten; 38 Meldungszeilen ohne eindeutigen
Mitgliederabgleich bleiben offen. Die Zuordnungen und Abgleichdateien bleiben
unter `.private/` und in D1, niemals in Git/Pages. Neues Mitglied / neue Saison:
vertrauenswürdigen Abgleich aktualisieren; aus fehlender Zuordnung keine Mannschaft
erraten. Im späteren Supabase-Vereinsbetrieb diese Relation und Pflege übernehmen.

Kommentare unterstützen bis zu drei Fotos/Bilder, einschließlich reiner Bild-
Antworten, Galerie, Entfernen/Ergänzen beim Bearbeiten und Einwilligung zur
Veröffentlichung abgebildeter Personen. Textänderungen erhalten bestehende Bilder.
Fotos liegen weiterhin lokal in IndexedDB und werden im vollständigen privaten
JSON-Export mitgesichert. Vorhandene Beiträge/Kommentare werden nicht zurückgesetzt.

## Roter Ball wiederhergestellt – 15.10.2026 (v196)

Nutzer verlangt die alte Vorführfunktion auch mit Cloudflare-Anmeldung:
Admin-Werkzeuge beim Laden ausgeblendet, Klick auf den roten Ball zeigt sie,
erneuter Klick blendet sie aus. Ausnahme `api.secureDirectory` im UI-Getter
entfernt. Die serverseitig geprüfte Rolle bleibt unverändert; der Schalter ist
kein Rechtewechsel. Verwaltungsaktionen an fremden Beiträgen/Kommentaren folgen
ebenfalls der gewählten Ansicht. Eigene Beiträge bleiben für Mitglieder bearbeitbar.
Profil-Import/Sicherung zunächst über den Ball sichtbar machen. Regression deckt
Home/Kiosk, Sitzungsauffrischung, Neuladen und normale Mitglieder ohne Adminrechte ab.


## Bestätigter Vorstandsvorführstand und Dokumentationsabschluss – 15.10.2026 (v196)

Der Nutzer bestätigt den aktuellen Stand ausdrücklich als sehr zufriedenstellende
Grundlage für die Vorstandspräsentation und beauftragt die Aktualisierung von
Projektgedächtnis und Übergabe. Kein weiterer Funktionsumbau aus diesem Auftrag.
Quellstand `78e526e`, Cache `tfb-kiosk-v196`, Pages-Lauf `38701695501` erfolgreich;
Website unter https://joern-kaemper.de/ mit erzwungenem HTTPS erreichbar.
Die aktuelle Übergabe fasst den Stand konsolidiert zusammen und hat Vorrang vor
alten Zwischenständen, insbesondere „noch nicht veröffentlicht“, aufklappbarer
Überschrift und immer sichtbaren Admin-Werkzeugen.

Bestätigt sind Kiosk-Zustimmung v3 und saubere Namensumbrüche; weitere Einladungen
im bestehenden Spiel, sichtbare Ersatzbank und spätere Absage auch des Einladenden;
Chat mit dauerhaft sichtbarer freiwilliger Überschrift, eigenen Mannschaften,
flachen Kommentaren mit bis zu drei Bildern und gebündelten Klingelhinweisen.
Der rote Ball schaltet Admin-Werkzeuge auch bei geschütztem Login wieder ein/aus,
nach Neuladen zunächst aus. Rollenprüfung bleibt serverseitig unverändert.
Der Nutzer hat die Wiederherstellung seiner drei Chat-Beiträge mit acht Fotos
bestätigt; aktuellen Browserstand erhalten, keine alte Sicherung erneut einspielen.

Abgrenzung bleibt verbindlich: Nur Mitgliederzugang, geschützte Suche und eigene
Mannschaftszuordnung liegen online in Cloudflare/D1. Kiosk, Beiträge, Kommentare,
Bilder, Verabredungen und Klingel bleiben lokale Vorführung je Browser; keine
gemeinsame Speicherung, echte Zustellung oder SEPA-Ausführung. Demo-Antworten
bleiben aktiv. Private vollständige JSON-Sicherung schließt Bilder ein; dieser
Dokumentationsabschluss erzeugt keinen neuen Export aus dem Browser.

Cloudflare bleibt für die Vorführung im vorhandenen persönlichen Konto.
Für späteren Vereinsbetrieb bevorzugt der Nutzer Supabase im vorhandenen
Vereinsumfeld wegen der Padel-App; kein zusätzliches Cloudflare-Vereinskonto.
Keine Migration, Datenbank-Zusammenlegung oder Änderung der Padel-App beauftragt.
Klingel statt E-Mail bleibt gewünscht, Push bisher nur spätere Option.
Vor Vereinsbetrieb gemeinsame Speicherung, Zugriffsrechte, Medien, Zustellung,
Pflege, Sicherungen und Betriebszuständigkeiten gesondert umsetzen und abnehmen.
38 nicht eindeutig zugeordnete Mannschaftsmeldungen bleiben zur privaten Klärung.

Letzte Funktionsprüfungen: isolierte Browserregressionen für Admin-Schalter,
Kommentare/Bilder/eigene Mannschaften, Chat-Wiederherstellung und schmale Ansichten;
zugehörige Backend-/Sicherungsprüfungen erfolgreich. Keine physische Geräteabnahme.
Dieser Abschluss betrifft nur Dokumentation, ohne erneute Code-Veröffentlichung,
Migration oder Änderung privater Daten. Die zentralen Dateien unter `00 START HIER`
gehören zur separaten Padel-Anwendung und bleiben unverändert.
Der Nutzer kündigt ein neues Thema für beide Projekte an; Inhalt noch offen.


## Strichliste: Zentrierung und mobile Namensspalte – 15.10.2026 (v198)

Der Nutzer beanstandet v197: Getränkestriche standen weiterhin linksbündig,
auf Handybreite lagen Namen immer noch über den gesamten Strichspalten.
Jetzt stehen alle Strichgruppen mittig unter ihren Überschriften. Auf schmalen
Listen steht Nachname über Vorname links; fünf Kategorien bleiben daneben.
Getränkebündel dürfen im eigenen Feld umbrechen, ohne horizontale Stauchung.
Die mehrfachen CSS-Überlagerungen sind in einem Strichlistenblock zusammengeführt.
15 Breiten von 320–1920px sowie Chat-/Namensregression erfolgreich geprüft;
Aufnahmen bei 1440/700/430/390/320px angesehen. Quellstand 5dc6882,
Cache tfb-kiosk-v198, Pages-Lauf 38774684777.


## Strichlisten-Feinschliff – 15.10.2026 (v199)

Auf Nutzerwunsch Getränke auf allen Breiten ausgeschrieben, Kranz statt
Kränze/Kr. und mobile Spielernamen um 2px vergrößert. Equipment bleibt
mit Equip. als mobiler Kurzform erhalten. Zentrierung und Spaltenaufteilung
bleiben bestehen. Layouttest auf 15 Displaybreiten erfolgreich, 390px und
320px visuell geprüft. Quellstand 8fda7c8, Pages-Lauf 38775160695.


## Kränze wieder ausgeschrieben – 15.10.2026 (v200)

Nutzer korrigiert Kranz wieder zu Kränze, größere mobile Namensschrift bleibt.
Kränzespalte mobil minimal verbreitert, übrige Spalten entsprechend angepasst;
Namensspalte bleibt mindestens 76px breit. Layouttest auf allen 15 Breiten
bestanden, kleinste Ansicht visuell geprüft. Quellstand 9c08cc8,
Pages-Lauf 38775667650.


## Zwei abgeschlossene Beispielabrechnungen – 15.10.2026 (v201)

Nutzer wünscht für die Show zwei fiktive Monatsabrechnungen unter dem aktuellen
Monat. Im Demo-Backend ergänzt myStatements für Admins zwei fehlende Vormonate
mit 34,80 € und 23,50 €, Status eingezogen. Kleine Kennzeichnung als Beispiel
mit fiktivem Betrag. Beispiele werden nicht gespeichert; aktuelle Monatskäufe
und vorhandene Monatsabschlüsse bleiben unverändert. Normale Mitglieder sehen
keine Admin-Beispiele. Browsertest prüft Beträge/Monate, wiederholten Aufruf,
keine Speicherung, Vorrang vorhandener Daten, Trennung nach Mitglied sowie
Desktop/Handy. Quellstand a31c60b, Pages-Lauf 38775995321.
Der Nutzer betont: derzeit reine Vorführung, noch keine fertige Vereinsversion.

## 16.10.2026 – Profilbilder v202 lokal vorbereitet

Kleine Profilbilder in Chat, Mannschaftsbeiträgen und Verabreden verwenden beim
Öffnen jetzt die gespeicherte große Quelle im ursprünglichen Seitenverhältnis.
Gemeinsamer Viewer löst diese Quelle erst beim Klick auf; Freigaben werden erneut
geprüft. Account erklärt die bisherige Speicherung nur im jeweiligen Browser.
42 Node-Tests und Chromium-Test mit synthetischem Hochformat auf Desktop/390px
bestanden. Keine echten Nutzerfotos oder Browserbestände verändert. Noch nicht
committet/veröffentlicht; Online-Stand bleibt v201. Geräteübernahme von Profilfoto
und Bierdeckel fehlt weiterhin, obwohl die Anmeldung zentral ist. Konkreter Ausbau
im Dokument GERAETEUEBERGREIFENDE_DATEN.md; keine Synchronisierung behaupten.

## 16.10.2026 – Ergänzung: zentrale Vorführung v203 vorbereitet

Nutzer ergänzt ausdrücklich geräteübergreifende Chats und automatisches Laden des
Profilfotos beim Anmelden/erneuten Öffnen der iPhone-App. Ursache ist lokale
Datenhaltung trotz zentraler Anmeldung; Safari-Cache nicht löschen.

Worker + D1 additiv erweitert: zentrale Profile, einzelne Vorführ-Striche,
Chatbeiträge/Kommentare/Anhänge und verwaltetes Sortiment. Revisionen, atomare
Schreibvorgänge und Vorgangskennungen schützen vor Überschreiben/Duplikaten.
Client gleicht nach Anmeldung/erneutem Öffnen und alle zehn Sekunden ab; Bilder
werden für die Profil-Großansicht erst bei Bedarf geladen. Unterbrochene
Vorgänge und die ursprünglichen Browserdaten bleiben lokal in separater IndexedDB.
Account bietet Übernahme mit Vorschau, einschließlich ausdrücklich zu bestätigender
Zuordnung eigener m-demo-Inhalte für Verwaltungskonten. Keine automatische
Veröffentlichung privater Sicherungen oder Änderung der Padel-Anwendung.

SQLite- und Zwei-Browser-Tests mit synthetischen Daten erfolgreich, einschließlich
verlorener Serverantwort und Neustart ohne doppelten Strich. Keine produktive
Datenbankmigration, kein Commit und keine Veröffentlichung ausgeführt. Online bleibt
v201 bis zur Freigabe. Releasefolge und Grenzen im Dokument
GERAETEUEBERGREIFENDE_DATEN.md; historische Aussage „nicht implementiert“ im v202-
Abschnitt ist durch diese lokale Vorbereitung überholt, nicht durch eine Livefreigabe.

## 16.10.2026 – v203 freigegeben, veröffentlicht und Datenübernahme geprüft

Nutzer hat Datenbankerweiterung, Server und Website ausdrücklich zur Veröffentlichung
freigegeben und den Erhalt seiner bisherigen Daten verlangt. Vor Umstellung die
bestehende Browser-Sicherungsfunktion verwendet und den vollständigen Export privat
kopiert. D1 vor Migration exportiert, in SQLite wiederhergestellt, Integrität geprüft.
Additive Migration erfolgreich. Worker-Version 26195ded-5951-4e21-b8cf-f1c170af1e09
veröffentlicht; Health 200, anonyme neue Endpunkte 401.

GitHub-Quellstand e775447 gepusht, Pages-Lauf 38945364365 erfolgreich. Live-Skripte
und Service Worker v203 entsprechen bytegenau der geprüften lokalen Fassung.
Eigene Browserdaten über die veröffentlichte Account-Vorschau übernommen. Danach
D1 erneut privat gesichert/wiederhergestellt und Profilbildquellen, Chatbilddateien,
Beitragstexte, Kommentare sowie Kioskeinträge exakt mit der Browsersicherung
verglichen: alle Prüfungen erfolgreich; Mitgliederbestand vollständig erhalten.
Große Profilbildansicht aus dem Live-Chat visuell bestätigt.

Alle personenbezogenen Sicherungen und Vergleichsdaten ausschließlich in
.private/release-v203/; nichts davon in Git oder Websitepaket aufgenommen.
Safari-Daten nicht löschen. Die eigene Datenübernahme ist erledigt; am iPhone
App neu öffnen und ggf. mit demselben Konto anmelden.


## 16.10.2026 – zentraler Planungsabgleich v204 und Wiederherstellung

Gruppen, Verabredungen, regelmäßiges Training und Teilnehmerantworten auf ausdrücklichen
Nutzerwunsch zentralisiert. Eigene ursprüngliche Planung aus dem vorher gesicherten
Browserbestand übernommen. Private D1-Vorher-/Nachher-Exporte und Feld-/Antwortvergleich
bestätigen Erhalt; bestehende Profile, Fotos, Kiosk-Einträge und Chats unverändert.
Getrennte Antwortdatensätze, Rechteprüfung, abgesicherte Einladungsbestätigungen,
deterministische Serientermine und fortsetzbarer Import ohne doppelte Einträge.
Kein zusätzlicher Schemawechsel, vorhandene App-Tabellen genutzt. Details und private
Nachweisorte in GERAETEUEBERGREIFENDE_DATEN.md; keine Personendaten hier ablegen.

## 16.10.2026 – Touch-Reaktion v205, vom Nutzer bestätigt

Nutzer meldet träge Buttons/Seitenwechsel am iPhone. Vollständige Serverabfragen
vom Öffnen der Ansichten entkoppelt; bestätigten Cache und vorhandene Namen/Fotos
wiederverwenden. Unveränderte Medien nicht erneut schreiben, spätere Seitenwahl vor
alten Antworten schützen, künstliche 480-ms-Touch-Verzögerung am Bierdeckel entfernt.
Im synthetischen Test bei 250 ms API-Latenz etwa 340 → 70 ms beim Öffnen von Profil/
Verabredungsübersicht. Datenabgleich und sichere Schreibbestätigung bleiben erhalten.
Nutzer bestätigt ausdrücklich „viel eleganter und smoother“.

## 16.10.2026 – Gestaltung v206/v207 und bestätigter Abschluss v208

Padel nur als gestalterische Referenz gelesen. Partnerpaare auf Mobilgeräten über
volle Inhaltsbreite, am Desktop gemeinsam über halbe Inhaltsbreite. Erster Vorschlag
mit zwei Menüzeilen am iPhone vom Nutzer korrigiert: endgültig alle sieben Bereiche
in einer Zeile, Dating statt Verabreden, flachere rote aktive Pill und näherer,
25 Prozent dünnerer Strich. Größere Tablet-Schrift und bündige gleichmäßige Verteilung.
Partnerflächen in v207 rund 28 Prozent höher. Beide Farbwelten erhalten.

Nutzer bestätigt diesen Stand ausdrücklich („sehr guten Stand erreicht“) und beauftragt
Einfrieren/Projektgedächtnis/Übergabe. Einzige weitere Korrektur v208: iPad-Flächen bei
unveränderten Breiten nochmals exakt 20 Prozent höher (110 → 132, 115 → 138 px).
Logo-Größe/Contain-Darstellung mittig erhalten; iPhone und Desktop bleiben bei 100/115 px.
Auf Tablet-Ansichten mit primärem Touch und mindestens 640 × 640 CSS-Pixeln begrenzt.
Quellstand 4781aca, Cache tfb-kiosk-v208, Pages-Lauf 38957773956. Abschließend ausgelieferte
Dateien geprüft; aktueller privater D1-Export erfolgreich in SQLite wiederhergestellt.
Quellstand und Dokumentationsabschluss über Tag stand-2026-10-16-v208 eingefroren.
Ab jetzt nur auf neuen Auftrag weiterarbeiten; die alte offene Liste ist keine Freigabe.

## 17.10.2026 · Partner-Sichtbarkeit v209 (lokal, nicht veröffentlicht)

Nutzer hat den Entwurf bestätigt und konkret beauftragt: keine Splash-Aktion,
keine zusätzliche PNG-Aktion; nur der Einstieg zu den Tennisfreunden. Kein großer
MIS-Adminbereich. Der rote Ball auf der Splash ist der versteckte Ein-Klick-Zugang
zur Zahlenseite, ausschließlich für angemeldete Admins. Ein Stift daneben bearbeitet
die Splash-Texte. Die Demo-Mitgliederansicht versteckt zwar normale Admin-Werkzeuge,
der Splash-Ball prüft jedoch die tatsächliche, unveränderte Adminrolle. Online
stammt diese Rolle aus der verifizierten Directory-Sitzung; die Statistikabfrage
prüft die Rolle und aktive Mitgliedschaft zusätzlich immer serverseitig.

Implementierung: assets/js/partner-visibility.js, assets/css/partner-visibility.css,
Einbindung im normalen index.html und Service-Worker v209. Original-TFB-Masken und
roter Ball, vorhandene lokale Schriften und kühle Farben. Splash einmal pro Besuch
(30 Minuten Inaktivität), auf Wunsch über den schlanken Konto-Link erneut anzeigen.
Rechtsseiten und direkter Statistiklink bleiben ohne vorgeschaltete Splash.
Der bestehende Startseiten-Einstieg bleibt erhalten. Kein neuer Navigationspunkt.

Texte unter site.splash; Formular, Vorschau, Speichern über api.saveSite, vorhandene
Sicherung/Wiederherstellung und öffentlicher Export (PUBLIC_KEYS erweitert).
Lokal gespeicherte Änderungen werden weiterhin erst per gezieltem Export öffentlich.
Keine vorhandenen Seiten-, Foto-, Vereins-, Preis- oder Mitgliederdaten migriert.

Partner: gemeinsame Kachel-Markierung mit stabilen IDs, Frontendbestand und eigener
Serverkatalog. Neue CSS-Schicht überschreibt die alten iPad-/Desktop-Sondermaße:
Inhalt max. 560 px, 123 px hoch, 12 px Abstand; bis 520 px zwei Spalten, 86 px hoch,
8 px Abstand. Splash separat wie Padel: 123/92/86 px sowie 112 px bei flachem Querformat.
Farben bleiben TFB, Logos unverzerrt. Partner und Gewichtung nicht verändert.
Aktuell vorhandene Premium-Partner besetzen die Splash; keine erfundenen Leerplätze.

Statistikoberfläche: #partnerzahlen; Jahresauswahl, Home-/Unterseitenaufrufe,
Splash separat, Ausspielungen, sichtbare Kontakte und Partnerklicks pro Partner,
CSV und Browserdruck/PDF. Partner ohne Zählereignisse blähen die Tabelle nicht auf.
Messbeginn und Messdefinition sind sichtbar. Detailseiten werden als Kategorien
zusammengefasst (z.B. Home-Themen, Training, Mannschaften, Dating-Details), keine
privaten Inhalts-, Personen- oder Verabredungskennungen gespeichert. Keine eindeutige
Besucherreichweite und keine rückwirkende Schätzung. Ein Wiederaufruf zählt neu,
ein Daten-Neurendern nicht. Sichtkontakt: mindestens halbes Logo für eine volle
Sekunde im aktiven Tab, nicht hinter Splash/Modal/Überlagerung; pro Aufruf und
Partnerplatz einmal. Jeder bewusste Partnerklick zählt einzeln.

Backend vorbereitet: /public/partner-events anonym, /admin/partner-visibility nur
mit aktiver verifizierter Admin-Sitzung. Strenge Seiten-/Partner-/Feldliste und
Batchgrößen, Origin-Prüfung, Botfilter, kurzlebiges IP-Hash-Ratelimit wie beim
bestehenden Directory. Keine Mitglieds-ID, E-Mail, Inhalte oder IP im Statistik-
ereignis. Kurze zufällige Ereignis-ID dedupliziert Wiederholungsübertragung.
Atomic D1-Batch und Insert-Trigger erhöhen Tagesaggregate nur für neue IDs.
Ereignis-IDs laufen nach zwei Tagen ab und werden bei der nächsten Übertragung
bereinigt; Tagesaggregate bleiben erhalten. Begrenzte Netzwerk-Wiederholungen
nur im Arbeitsspeicher, keine Besucherprofile oder Statistik-Cookies.
Zeitzone Europe/Berlin, Quelle tfb; Schema lässt später padel als zweite Quelle zu.
Alte Partner-IDs bei zukünftigen Bestandsänderungen im Serverkatalog beibehalten.

Migration: server/cloudflare/migrations/0004-partner-visibility.sql. Ebenfalls in
schema.sql für neue Installationen enthalten; vorhandene Live-D1 wurde nicht
verändert. Vor Livefreigabe: Sicherung, additive Migration, Worker veröffentlichen,
Datenschutzinformation konkret ergänzen, Website veröffentlichen und serverseitige
401/403-Prüfungen wiederholen. Keine Änderung an Padel, keine E-Mails, kein Commit,
Push oder Deployment. Die echte Jahresmessung beginnt erst nach dieser Veröffentlichung.

Prüfstand: 57 Node-Tests (einschließlich vier neuer Statistiktests), weitere
20 Directory/App-/Meet-Synchronisationstests und vier öffentliche Exporttests
bestanden. Bestehende Browserprüfungen für Home/Aktuell, Galerien und Sicherungen
bestanden. Neuer isolierter Browsertest prüft Splash-Sichtkontakte, verdeckte
Home-Seite, Admin-Ausschluss, Stift/Vorschau/Speicherung, Ball, Auswertung/CSV,
Neurender-Deduplizierung und Maße ohne Überlauf auf 320/390/834/1194/1440 px.
Bestehender Gestaltungs-Browsertest berücksichtigt nun den Splash-Einstieg auch
beim direkten Datei-Start und besteht. Pages-Paket mit 212 Webdateien vorbereitet;
neue Assets explizit im Paket enthalten. git diff --check sauber.

## 17.10.2026 · v210 – zentrale TFB-Partnerpflege, Veröffentlichung, Drei-Schritte-Plan

Ausdrücklicher neuer Nutzerauftrag: Website jetzt live schalten, damit die Splash-
Texte feingetunt werden können. Die Zählung soll im Hintergrund gerade NICHT laufen.
Roten Splash-Ball für Admins zur Partner-Unterseite führen lassen, dort Pflege und
vorbereitete Sichtbarkeit zusammenfassen. Keine große Padel-Admin-Navigation.

Padel-Vorbild erneut im Quellcode geprüft: Stammdaten, Logo/Website, Marke/Firma,
Kontakt/Anschrift, Vertragsstand, jährlicher Beitrag. Diese allgemeinen Funktionen
übernommen; keine Court-Zuordnung, Buchungsrabatte, Aktionslogos, Vertragskampagnen,
Drei-Jahres-Multiplikation oder Akquise-/Spendenverwaltung. Padel selbst unangetastet.
38 bereits kopierte öffentliche Partnernamen/Logos/Websiteadressen als Testbestand
übernommen, Regional-Kategorie bei TFB zu normalen Partnern vereinheitlicht. Keine
privaten Padel-Kontakte, Finanzwerte, Verträge oder Zahlungseingänge kopiert.
Padel-Trackingparameter aus Partner-Links entfernt. Testbestand wird nicht als
bestätigter TFB-Umsatz ausgegeben und nimmt keine echten Zahlungseinträge an,
bevor er als echter TFB-Partner übernommen ist. Nutzer ersetzt die Einträge nach
und nach mit den bisherigen TFB-Werbepartnern.

Neue Seite #partner (alter #partnerzahlen-Link führt zur selben Seite), nur für
angemeldete Admins. Der rote Ball nutzt die tatsächliche Adminrolle auch bei in
der Vorführung ausgeblendeten Werkzeugen. Jede Admin-API prüft die aktive
serverspezifische Sitzung/Rolle, nicht nur versteckte Knöpfe. Jahresauswahl,
Suche, Hinzufügen/Bearbeiten, Logo-Upload, Website/Partnerart, Sichtbarkeit,
Testbestand, Vertragsstand, Jahresbetrag, Kontakte und CSV. Maximal zwei aktive
Premium-Partner wie auf der Padel-Splash. Kein Löschen von Historie; ausblenden
über Aktiv-Schalter. Finanz-/Kontaktfelder bleiben rein administrativ.

Beträge: Default 300 Euro pro Jahr; aktuelle mündliche/vertragliche Zusagen und
reale Zahlungseingänge sind getrennte Kennzahlen. Tatsächliche Zahlungen mit
Beitragsjahr, Zahlungsdatum und Notiz erfassen, auch Vorauszahlungen. Wiederholte
Übermittlung derselben Zahlung dupliziert nicht. Storno erhält den ursprünglichen
Eintrag. Eine Änderung des Jahresbeitrags verändert keine früheren Zahlungseingänge.
Keine Zahlung wird ausgelöst, keine Rechnung oder E-Mail verschickt.

Zentrale Pflege ist für den gewünschten Live-Text-Feinschliff erforderlich:
Splash-Konfiguration und Partner liegen getrennt in der vorhandenen TFB-D1,
mit Versionsprüfung gegen gegenseitiges Überschreiben. Logo-Dateien werden als
validierte, größenbegrenzte Rasterbilder gespeichert und über einen eigenen
öffentlichen Bildpfad ausgeliefert. Öffentliche Konfiguration enthält ausschließlich
aktive Partner mit ID, Name, Stufe, Reihenfolge, Logo und Website sowie Splash-Texte.
Andere Website-Texte bleiben bei der vorhandenen lokalen TFB-Pflege. Der Stift
bedient die Splash wie bisher; Speichern ist hier ab v210 sofort zentral sichtbar.

Rotation ersetzt: keine Gewichte 3/3/1, keine Premium-links-Regel, kein Ausschluss
zweier Premium-Partner in einem Inhalts-Paar. Zufällig gemischte vollständige
Umläufe, jeder aktive Partner einmal je Umlauf, zwei verschiedene Partner pro
Seite, vorhandenes Paar bleibt bei bloßer Datenaktualisierung stehen. Zustand
über Sitzungsspeicher fortsetzen; Einzelpartner funktioniert. Premium erhält nur
die zusätzlichen festen Splash-Plätze. Das garantiert gleiche Rotationsregeln,
nicht exakt dieselbe tatsächliche Sichtkontaktzahl bei unterschiedlichen Seitenwegen.

Drei ausdrücklich festgehaltene Schritte:
1. Jetzt: veröffentlichte Website/Splash und einfache Partnerpflege zum Feinschliff.
   Bisherige TFB-Werbung ist Bandenwerbung; App-/Websitewerbung entsteht erst mit
   diesem neuen Angebot. Keine Padel-Partnerschaften als TFB-Verträge behaupten.
2. Als Vorstandsvorschlag: gemeinsamer TFB- und Padel-Betriebsstart am 01.01.2027.
   Erst nach Beschluss/Betriebsfreigabe einschalten, nicht automatisch am Datum.
   Dann ein vollständiges Kalenderjahr als Sichtbarkeitsnachweis. Auf derselben
   TFB-Partnerseite Seitenaufrufe, Ausspielungen, sichtbare Kontakte und Klicks
   auswerten; Padel später als getrennte Quelle in die TFB-Gesamtübersicht übernehmen.
   Die Sammlung bleibt heute im Frontend und im Worker deaktiviert. Untergrund-
   Messlogik, Tagesaggregate, Deduplizierung, Definitionen und Export sind vorbereitet;
   vor Aktivierung Statistikmigration, Datenschutzinformation und Liveprüfungen
   ergänzen. Neue gepflegte TFB-Partnerkennungen sind im vorbereiteten Messcode
   bereits an den zentralen Partnerbestand angebunden. Es gibt keine erfundenen
   Nullen als Messwerte, keine Rückrechnung vor Start und keine Personen-Reichweite.
3. Nach den ersten drei Jahren Padel-Betrieb (entsprechend der dortigen Verträge)
   ein Folgekonzept für nur Padel oder Padel+TFB prüfen. Ob TFB-Bandenwerbung dann
   separat bleibt oder in ein großes Paket aufgenommen wird, ist eine spätere offene
   Entscheidung; bei Start 2027 wäre dies eine Perspektive ab 2030, kein heutiger Vertrag.

Technik/Veröffentlichung: additive Migration 0005-partner-management.sql auf genau
TFB-D1, kein bestehendes Mitglieder-/Kiosk-/Chat-Datenmodell verändern. Neue
Worker-Routen /public/partner-content, /public/partner-logo/:id und die admin-
geschützten /admin/partners, /admin/partners/save, /admin/partner-settings,
/admin/partner-payments/add und /admin/partner-payments/void. Settings und Partner
optimistisch versioniert. Statistik-API lehnt Schreibvorgänge ohne explizite
PARTNER_MEASUREMENT_ENABLED=1 ab; aktuelle Konfiguration setzt 0, Frontend ebenfalls
false. Statistikmigration 0004 wird mit diesem Auftrag nicht auf Live-D1 angewandt.
Keine Padel-Datenbank, Padel-Veröffentlichung oder Nachrichten verändert.

Prüfungen: sechs neue Backendtests für Partnerpflege/Finanzdaten/Privatsphäre und
gleiche Rotation, vier vorbereitete Statistiktests; 20 bestehende Directory-/App-/
Meet-Tests und 53 weitere Bestandstests erfolgreich, vier Exporttests. Neuer Browser-
Integrationstest verwendet den echten Worker gegen isoliertes SQLite mit zwei
Browserprofilen und synthetischer Admin-Sitzung: Gast-Sperre, Partneränderung,
Logo-Upload, zentrale Splash-Texte auf anderem Gerät, Zahlung/Beitragsjahr, Suche,
CSV und responsive Darstellung 320/390/834/1194/1440 px. Keine Erfassungsanfrage
an den Statistik-Endpunkt. Live-D1 vor Änderung privat exportiert und erfolgreich
in isoliertem SQLite wiederhergestellt (.private/release-v210/backup-check.json).

Veröffentlichung v210 abgeschlossen und live überprüft: Website-Quellstand 6c1ebda,
GitHub-Pages-Lauf https://github.com/calvinjohncamp/tfb-website/actions/runs/38995041440
erfolgreich; URL https://joern-kaemper.de. Worker-Version
980cbbd0-7f59-40da-93cb-dd20f57c045a. Live: 38 öffentliche Partner, keine privaten
Kontakt-/Finanzfelder; Admin-APIs anonym 401, fremder Origin 403, Statistik-Schreiben
409 (ausgeschaltet). Gastbrowser bestätigt Splash, geladene Logos, 560-px-Partnerblock
auf Desktop/iPad, gesperrte Partnerseite, null Messanfragen und keine Skriptfehler.
Die zentrale Admin-Text-/Partner-/Logo-/Zahlungsbedienung wurde gegen denselben
Worker-Code in isoliertem SQLite geprüft, ohne echte Live-Partnerdaten zu ändern.
Konto-Link zur Einstiegsseite ist für tatsächliche Admins auch bei ausgeblendeten
Vorführ-Werkzeugen erreichbar. Vollständige private Nachweise in .private/release-v210/.

## 17.10.2026 · v211 – Konto für die Präsentation verschlankt

Auf Nutzerwunsch Übergangs-/Abgleichhinweise, Vorführhinweis, lokale Probeversions-
meldung und den Knopf „Bisherige Browserdaten übernehmen“ oberhalb der Mitgliedschaft
aus dem Konto entfernt. Auch die zugehörige sync-import-Bedienaktion entfernt.
Der Kontokopf mit Name/Profilfoto bleibt, danach folgt direkt die Mitgliedschaft.
Vorhandene Daten und zentraler Abgleich unverändert; interne Wiederherstellungs-
werkzeuge nicht gelöscht. Admin-Rückweg zur Splash bleibt auch bei ausgeblendeten
Admin-Werkzeugen erreichbar. Browserprüfung am echten Worker mit isoliertem
SQLite bestätigt schlankes Konto und weiterhin Partnerpflege/Textänderungen.
Cache-Version tfb-kiosk-v211; ausschließlich Websiteänderung, kein Worker-/D1-Update.

## 17.10.2026 · v212 – Partnerarten und zweistufiger Auswertungsentwurf

Nutzerpräzisierung: ausschließlich Premium-Partner und Partner · Bandenwerbung.
Bezeichnungen in Liste, Editor und CSV angepasst; interne stabile Partnerart-IDs
bleiben premium/partner, keine Migration bestehender Partner oder Beiträge.
Vorbereitete Oberfläche in zwei Ebenen gegliedert: (1) Seitenaufrufe pro Seite,
(2) davon Aufrufe mit mindestens einem qualifiziert sichtbaren Partnerlogo und
Sichtbarkeitsquote. Die Messung bleibt vollständig ausgeschaltet.

Wichtige Zählregel für Schritt 2: Zwei sichtbare Logos erzeugen zwei Partnerkontakte,
aber nur EINEN Seitenaufruf mit Partner-Sichtbarkeit. Dafür einmaliges partner_view-
Ereignis in der noch deaktivierten Messvorbereitung ergänzt; Entdoppelung pro
angezeigter Seite und erneut bei Netzwerkwiederholung. Statistikmigration 0004 ist
weiterhin nicht live angewandt; neue Ereignisart vor der späteren Aktivierung
zusammen mit dem aktualisierten Worker ausliefern. Heute nur Website-Vorbereitung.

Konzept: Aufruf/Neuladen ist ein Page View, kein beliebiger Mausklick. Kein erneuter
Aufruf bei bloßen Datenaktualisierungen. Splash separat, keine Hintergrund-Home-
Zählung. Personen sind keine Kennzahl: Wiederbesuche erzeugen weitere Aufrufe.
Qualifizierte Sichtbarkeit bedeutet 50 % des geladenen Logos für mindestens eine
zusammenhängende Sekunde im aktiven Tab, bekannte Überlagerungen ausgeschlossen.
Dies ist eine technische Sichtmöglichkeit, kein Beleg bewusster Wahrnehmung und
keine zertifizierte Werbemessung. Blocker und Verbindungsabbrüche können unterzählen.

Nutzerhypothese 30–50 % Sichtbarkeit ist unbestätigt; niemals als gemessene Quote
oder garantierte Leistung behandeln. Extern können Seitenaufrufe und ausdrücklich
rechnerische Logo-Einblendungen berichtet werden. Nicht als tatsächlich gesehene
Logos bezeichnen. Intern gegen gemessene Kontakte und tatsächliche Ausspielungen
halten; letztere sind verlässlicher als eine pauschale Division bei wechselndem
Partnerbestand. Bei zwei Slots und zehn gleichberechtigten Partnern entsprechen
10.000 Seitenaufrufe rechnerisch 2.000 Ausspielungen pro Partner, unter der Annahme,
dass beide Slots bei jedem Aufruf belegt sind. Das ist keine Zusage über Sichtkontakte.

Vor Schritt-2-Freigabe die Statistik weiter verdichten: Tageszähler je Seite mit
Aufrufen und Aufrufen-mit-Partner; separate Tageszähler je Partner/Platzierungsart
mit Ausspielungen, Sichtkontakten und Klicks. Keine dauerhaften Klicklisten oder
Scrollverläufe. Beispiel 20 Seiten x 365 Tage = 7.300 Seiten-Tageszeilen, unabhängig
von der Besucherzahl; zusätzliche Partner-Tageszeilen und kurzlebige Entdoppelung
separat kalkulieren. Die bestehende mehrdimensionale Entwurfstabelle ist noch
keine finale Speicher-/Kostenoptimierung. D1-Tageskontingente anhand erwarteter
Last prüfen; Analyseschreibfehler dürfen Bedienung nie blockieren.

Platzierung erst nach Vergleich realer Quoten optimieren: z.B. kompakte Partner-
fläche nach dem ersten Home-Thema bzw. vor dem Ende langer Unterseiten testen.
Je Layoutversion/Zeitraum und grober Geräteklasse vergleichen; vorerst keine
Änderung der freigegebenen Logo-Platzierung. Padel-Messung ebenfalls erst später.

Primärquellen geprüft: MDN Intersection Observer API und Page Visibility API;
Google Ads Viewability-Definition 50 % / 1 Sekunde; Google Analytics Dokumentation
zu Seitenaufrufen; offizielle D1-Plattformlimits. Kein Google-Analytics-Dienst
installiert und keine zusätzliche Fremdverbindung in die Website eingebaut.

## 17.10.2026 · v213 – Splash-Zeilen unabhängig schalten, Partnerzeile 0,5 Sekunden

Nutzerpräzisierungen umgesetzt: Partnerart heißt durchgehend Partnerbandenwerbung
(ohne Punkt/Trennung), neben Premium-Partner. „Ausreichend lange“ aus den sichtbaren
Auswertungsformulierungen entfernt. Eigene Messdefinition nun 0,5 Sekunden statt
einer Sekunde; die Partnerzeile wird als Einheit betrachtet. Sind mindestens 50 %
der Zeile im aktiven Tab sichtbar und alle vorhandenen Logos geladen, werden beide
Partner gemeinsam gewertet; ein Seitenaufruf mit Partner-Sichtbarkeit wird weiterhin
nur einmal gezählt. Bekannte Überlagerungen/ausgeblendete Tabs brechen den Zeitraum
ab. Kein Zählen defekter Logos. Messung bleibt im Frontend und Worker ausgeschaltet.
Der isolierte Zukunftstest prüft ein Pageview-/Partner-View-Ereignis bei zwei Logo-
kontakten. Messdefinitionsversion auf 2 gesetzt; es gibt keine historischen Livewerte.

Splash-Editor erhält zwei unabhängig speicherbare Schalter: (1) kleine Vereinszeile
oberhalb der Überschrift, mit frei bearbeitbarem Text, (2) kleine Zeile unterhalb
des Einstiegsbuttons, deren Text ebenfalls bearbeitbar bleibt. Logo, Partnerüberschrift
und Rechtslinks bleiben eigenständig. Bestehende Inhalte standardmäßig weiter anzeigen;
keine gespeicherten Texte überschreiben oder bei Ausblenden löschen. Leere Texte
werden ohne leeren Absatz dargestellt. Beide Optionen zentral gespeichert, keine
Schema-/D1-Migration nötig. Bereits geöffnete alte Editoren erhalten die neuen Werte,
statt sie beim späteren Speichern auf Standard zurückzusetzen. Versionsprüfung bleibt.

Backend- und Browserprüfungen erfolgreich: Ausblenden beider Zeilen, Wiedereinblenden,
Textänderung und Sichtbarkeit in einem anderen Browserprofil; übrige Partnerpflege,
Zahlungen, CSV und responsive Ansichten weiterhin geprüft. Cache tfb-kiosk-v213.

## 17.10.2026 · v214 – dezente Splash-Auswahlfelder direkt am Text

Die drei Splash-Schalter als kleine quadratische Auswahlfelder mit schwarzem
Rahmen und schwarzem Häkchen auf hellem Grund gestaltet. Native Formularfelder
bleiben per Tastatur und Beschriftung bedienbar, mit sichtbarem Fokus und großer
Klickfläche. „Einstiegsseite anzeigen“ steht weiterhin am Anfang. Die Optionen
für die kleine Zeile über der Überschrift und unter dem Einstiegsbutton stehen
jeweils direkt unter ihrem Textfeld. Speicherlogik und Inhalte unverändert;
Messung bleibt ausgeschaltet. Cache tfb-kiosk-v214.

## 17.10.2026 · v215 – Splash-Einstieg führt immer auf Home

Bisher schloss der Einstiegsbutton die Splash-Seite und ließ die darunterliegende
Ansicht stehen (außer der Partnerverwaltung). Dadurch konnte nach einem Reload
oder beim erneuten Öffnen der Splash-Seite der Kiosk sichtbar werden. Das Ziel
ist jetzt ausdrücklich #home, unabhängig von vorheriger Ansicht und Gerätebreite.
Bei bereits geöffnetem Home wird die Splash geschlossen und nach oben gescrollt.
Die spätere Messung startet erst auf der Zielseite, ohne die alte Ansicht beim
Schließen zusätzlich zu zählen. Messung bleibt ausgeschaltet. Cache v215.
Regression im isolierten Browser: Smartphone-, Tablet- und Desktopgrößen,
Einstieg von Kiosk, Club, Partnerverwaltung und Home sowie Reload auf #kiosk.

## 17.10.2026 · v216 – Menü Dating 2.0, Seitenüberschrift Verabreden

Menüpunkt und Auswertungsbezeichnung heißen Dating 2.0. Ältere gespeicherte
Standard-Menübezeichnungen „Dating“ und „Verabreden“ werden ebenfalls entsprechend
angezeigt; individuell benannte Menüpunkte bleiben möglich. Seitenüberschrift
für angemeldete und nicht angemeldete Besucher heißt Verabreden. Route #treffen
und Funktionalität unverändert. Cache v216.

## 17.10.2026 · v217 – Save-the-Date-Anhänge wieder sichtbar

Originalflyer für Oktoberfest und Weihnachtsfeier in beiden lokalen Sicherungen
und bereits veröffentlichten Inhaltsdateien gefunden: JPG/JPEG, keine PDF-Dateien.
Die Anhangsanzeige und der Viewer prüften ausschließlich Browser-Uploads; dadurch
wurden beim Umzug als assets/content veröffentlichte Anhänge unsichtbar. Einheitliche
Quellauflösung für Vorschau, Viewer und Admin-Editor ergänzt, auch für statische
PDFs. Viewer bietet zusätzlich Herunterladen mit dem ursprünglichen Dateinamen;
PDF-Ansicht unterstützt weiterhin lokale Uploads und öffentliche Dateipfade.
Keine alten Sicherungen importiert, keine Inhalte oder Konten überschrieben.
Hinweis: Weihnachtsflyer nennt 05.12.2026, Termineintrag 07.11.2026; unverändert.
Regression für veröffentlichte Bild-/PDF-Anhänge; Browserprüfung der Originalflyer
mit Großansicht und bytegenauem Download. Cache v217.

## 17.10.2026 · v218 – Kiosk ohne dauerhafte Menü-Hervorhebung

Alte Sonderregel für immer roten und stärkeren Kiosk-Menüpunkt in beiden
Gestaltungswelten entfernt. Kiosk wird wie alle internen Menüpunkte dargestellt;
Hervorhebung und aria-current folgen weiterhin ausschließlich der aktiven Seite.
Home erhält damit keine irreführende rote Kiosk-Markierung. Cache v218.
Auch den aktiven Navigationsbereich bei Seitenwechseln aktualisiert, damit ein
späteres Neuzeichnen des Menüs keine veraltete Kiosk-Markierung zurückbringt.

## 17.10.2026 · v219 – helles App-Symbol mit Original-Ball, Favicon separat

Freigegeben: App-Symbol dunkles TFB auf hellem Grund (#F5F0E6), Ball #C4553A.
Schrift und Ball werden aus derselben Originalmaske als eine Einheit skaliert:
Original 2000×1000; Markenausschnitt ohne Unterzeile 1803×664 ab (92,78);
Ballbox 280×280 ab (1616,464). Größe, Position und Abstand unverändert gegenüber
Original. Reguläre Kachel entspricht dem bestätigten Entwurf ohne künstlichen
Außenrand; Betriebssystem übernimmt die Ecken. Maskable-Version mit eigener
Sicherheitszone. Apple-Touch-Icon 180px, PWA 192/512px und 1024px-Quelle erneuert.
Browser-Favicons (PNG/ICO) unverändert und weiterhin ohne Ball, alte Vorlage als
separate tfb-favicon-source.png gesichert. Build trennt App- und Favicon-Quelle.
Icon-URLs für Manifest/Apple versioniert; heller Manifest-Starthintergrund,
Cache v219. Bereits installierte Symbole aktualisiert das jeweilige Betriebssystem;
auf iOS kann erneutes Hinzufügen zum Home-Bildschirm nötig sein.
Geprüft: bytegleiche Browser-Favicons, Abmessungen/Farben aller App-Symbole,
Maskable-Sicherheitskreis, echter Service-Worker-Install und Offline-Aufruf der
versionierten Icons. Veröffentlichungsprüfung löst URL-Parameter wie bei HTML
nun auch bei Offline-Dateien auf.

## 17.10.2026 · v220 – App-Symbol übernimmt exakt die Website-Farben

App-Hintergrund von Creme #F5F0E6 auf #EFEFEF geändert, TFB-Zeichen von #1C1A17
auf #171717. Signature-Rot bleibt #C4553A. Diese drei Farben entsprechen der kühlen
Standardansicht der Website (design-preview.css plus geerbte Root-Farbe aus app.css).
Der Icon-Build liest die CSS-Variablen --bg, --logo und --signal direkt aus den
Website-Stilen, statt eigene Farbkonstanten zu führen. Manifest-Starthintergrund
wird ebenfalls aus --bg gesetzt. Originalproportionen und Geometrie unverändert,
Browser-Favicons bytegleich. Alle App-Formate neu erzeugt; Icon-URLs/Cache v220.
Browserprüfung: berechnete Website-Farben nach Ende des Farbwechsels mit den
PNG-Pixeln sämtlicher App-Formate verglichen; exakte RGBA-Farbwerte nachgewiesen,
Manifest-Hintergrund geprüft und beide Browser-Favicons bytegleich bestätigt.

## 17.10.2026 · v221 – App-Symbol als großes TFB ohne Ball

Nach Praxiseindruck auf dem iPhone freigegeben: Ball nur aus App-Symbol entfernen,
TFB-Zeichen größer setzen. Originalschrift unverzerrt aus 1524×664 ab (92,78)
geschnitten und gemeinsam skaliert. Gleicher Außenabstand, dadurch Schrift etwa
18 % größer gegenüber dem Symbol mit Ball. Hintergrund #EFEFEF und Zeichen
#171717 weiterhin direkt aus Website-CSS. Maskable-Sicherheitszone berücksichtigt.
Website-/Splash-Logo inklusive Signature-Ball sowie Browser-Favicons unverändert.
Alle App-Formate und Quelle erneuert; Apple-/Manifest-URLs und Cache v221.
Geprüft: alle Abmessungen, unveränderte Website-Farben, ausschließlich neutrale
Bildpixel ohne roten Ball, vollständige Markensichtbarkeit im Maskable-Sicherheitskreis,
bytegleiche Browser-Favicons und Website-Logo-Dateien. Veröffentlichungspaket geprüft.

## 17.10.2026 · Dokumentationsabschluss v221 – Nutzer bestätigt Gesamtstand

Aktuellen Auftritt, Bedienung und finales großes App-Zeichen ohne Ball bestätigt.
Verbindliche Kurzstände in Projektgedächtnis und Übergabe auf v221 umgestellt;
README, Design- und geräteübergreifende Übergabe sowie Server-README abgeglichen.
Historische v208-Freigabe und Zwischenstände erhalten, aber klar nachgeordnet.
Dokumentiert: Live-Commit/Workflow/Cache, exakte Icon-Farben, Navigation/Splash,
Partnerpflege und deaktivierte 0,5-Sekunden-Messung, dreistufige Zukunftsplanung,
Flyer-Wiederherstellung und offene Weihnachtsdatumsabweichung. Keine Website-
oder Datenbankänderung, keine Messaktivierung und kein neuer Sicherungstag.

## 17.10.2026 · Erster Mailentwurf zur Mitgliedsanmeldung

Nutzer verlangt nur eine automatische E-Mail-Art bei TFB: Mitgliedsanmeldung;
alle sonstigen Hinweise/Benachrichtigungen in die App-Klingel. Keine Padel-artige
Mailstrecke zur Partner-Sichtbarkeit. Padel-Quellen bookingMailHtml im Stripe-
Webhook, Meetup-Mails und Auth-Mailkonfiguration im benachbarten Projekt studiert.
Markenkopf, Inhaltskarte, klare Aktion und Abstände übernommen, mit TFB-Logo samt
rotem Ball, #EFEFEF/#171717/#C4553A und Bricolage/DM Sans (Arial-Fallback).

Lokaler Entwurf mit Betreff, HTML-/Textvorlage, PNG-Logo und Desktop-/Mobilvorschau.
Erstmail bestätigt Antragseingang und bietet Bestätigungsbutton; keine Behauptung
bereits erfolgter Aufnahme. Fiktive Daten, kein echter Bestätigungslink und keine
Mail versendet. Browserlayout 320–860px plus Fontfallback geprüft und visuell
kontrolliert; echte Mailclientprüfung erst vor späterer Versandfreigabe.

Neue Vorgabe in MAILKONZEPT.md, Übergabe und Aufnahme-Doku festgehalten. Bestehender
membership_server.py-Prototyp erzeugt noch mehrere Folge-/Mandats-/Vereinsmails;
keine stille Änderung seiner Abläufe. Spätere eigene Umsetzung muss diese auf
Klingelmeldungen umstellen und Sonderfälle abstimmen. Keine Live-Veröffentlichung,
keine SMTP-/Datenbankkonfiguration geändert; Website bleibt bestätigte v221.

## 17.10.2026 · v222 – Präsentations-PDF der Mitgliedsanmeldungs-Mail

Nutzer bestätigt Mailentwurf und beauftragt einen PDF-Link rechts außen neben
Beiträgen und Anmeldeformular auf der Club-Seite. Einseitige A4-PDF aus der
fertigen Vorschau erzeugt, Schriften/Logo eingebettet, dezenter Musterhinweis,
fiktive Daten und kein echter Bestätigungslink. PDF gerendert und visuell geprüft.
Responsive Textlink öffnet neuen Tab, PDF in öffentlichem assets/docs und
Offline-Shell. Build veröffentlicht .pdf nur innerhalb öffentlicher Assets;
Vorlagen, Werkzeuge, Dokumentation und private Daten bleiben ausgeschlossen.
Keine echte Mail und keine Änderung der Aufnahme-/Klingel-/Versandlogik.
Zusätzlich bei der Mobilprüfung gefundenen 320px-Menüüberlauf in der warmen
Welt durch Verzicht auf Buchstabensperrung unter 360px beseitigt. Link in beiden
Farbwelten und 320/390/834/1194/1440px geprüft, rechtsbündig auf Desktop und PDF
öffnet per Klick in neuem Tab. 24 bestehende Seitentests erfolgreich.

## 17.10.2026 · Dokumentationsabschluss zum bestätigten Live-Stand v222

Nutzer bestätigt die Präsentations-PDF samt Platzierung auf Club („Sehr schön“)
und beauftragt die Aktualisierung des aktuellen Stands und der Übergabedateien.
Verbindliche Kurzstände jetzt durchgehend v222 mit Live-Commit und erfolgreichem
Workflow, nicht mehr v221 mit nur nachgestellter Ergänzung. Veröffentlichungs-
nachweis unter .private/release-v222/live-check.json: Club-Code, CSS, Service
Worker und PDF 200 sowie bytegleich. Einseitige A4-PDF mit vollständigem TFB-Logo,
Website-Farben/-Schriften, fiktiven Daten und Musterhinweis; neuer Tab und offline.

Aktuellen Mailentwurf als Gestaltungs-/Präsentationsstand bestätigt, noch keine
Versandfreigabe. Einzige vorgesehene automatische Mailart ist Mitgliedsanmeldung;
weitere Meldungen über die App-Klingel. Bestehenden mehrstufigen Aufnahme-Prototyp
vor späterem Einsatz anpassen. App-Symbol ohne Ball, Website-/Splash-Logo mit Ball,
Partnerpflege und ausgeschaltete Sichtbarkeitsmessung unverändert. Keine weitere
Produktänderung, keine neue Migration, keine Datenrücksetzung und kein neuer
Sicherungstag mit diesem Dokumentationsabschluss. Historische Abschnitte erhalten.
