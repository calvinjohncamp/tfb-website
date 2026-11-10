# TFB – Übergabe für die nächste Sitzung

## History mit drei Karten · 10.11.2026

Live bestätigt: Programmcommit cf80f80, GitHub-Pages-Lauf 42768891785 erfolgreich.
index.html aus dem Veröffentlichungspaket, sw.js, site.js und club-history.css
öffentlich bytegleich. Chromium und WebKit live erfolgreich: Clubreihenfolge und
Farben, drei Karten mit Original-CMS-Bildern, vier Pills, Chronik-Link auf Bild und
Pill, Bericht und 33 Jubiläumsbilder erreichbar. Desktop und iPhone ohne Überlauf.
Live-Screenshots: Hauptprojekt output/TFB-History-3-Karten-live-{chromium,webkit}-{390,1440}.png.
Keine produktiven CMS-, Mitglieder- oder Finanzdaten verändert.

Clubarchiv → History → Anfahrt; gelber Zur-History- und blauer Routenbutton.
Drei Hochformatkarten mit Pills, Reihenfolge 50 Jahre / 25 Jahre / Anfangsjahre.
Details: [History-Gestaltung](RELEASE-history-layout-20261110.md).


## Direkte Veröffentlichung und Regelwerk · 10.11.2026

Veröffentlichung bestätigt: Programmcommit c8be699, GitHub-Pages-Lauf
42767411827 erfolgreich. index.html (Veröffentlichungspaket), Service Worker,
site.js, Regelwerkmodul, beide neuen Stylesheets, Chronik-PDF und Titelvorschau
öffentlich bytegleich mit dem geprüften Paket. Chromium und WebKit live mit
öffentlichen Original-CMS-Inhalten: 28 Regelwerkfragen, aktive vierte Kategorie,
History-Vorschaubilder, Anfangsjahre, vorhandener Jubiläumsbericht und 33 Fotos
mit Großansicht erfolgreich; keine Skriptfehler. Sichtprüfung live erfolgreich.
Live: https://joern-kaemper.de/#sport/regelwerk und
https://joern-kaemper.de/#club/history . Keine CMS-/Mitglieds-/Finanzdaten verändert.
Screenshots lokal im Hauptprojekt output/TFB-{Regelwerk,History}-live-{chromium,webkit}.png.

Nutzeranweisung: Websiteänderungen immer direkt veröffentlichen; Finetuning an
der Live-Version. Erneutes OK entfällt. History aus dem vorigen Auftrag wird
zusammen mit Sport → Regelwerk veröffentlicht. Vollständige Übernahme aller
28 Fragen/Antworten von tfbielstein.de, vierter Sportbereich. Details/Prüfungen:
[Release History und Regelwerk](RELEASE-history-regelwerk-20261110.md).
Veröffentlichung isoliert auf aktuellem origin/main, nur beauftragte Änderungen.


## Abrechnung mit voller Breite und zentrierter PDF-Kopf · 09.11.2026

Veröffentlichung bestätigt: e2d6527, Pages-Lauf 42713475494 erfolgreich.
index.html, statement-layout.css, court-plan.js, sw.js und alle vier PDF-/JPEG-
Dateien live bytegleich mit dem geprüften Paket. Live-Frontend mit isolierter API
in Chromium/WebKit je 834×1194 und 1194×834 in beiden Welten erneut erfolgreich.
Angemeldete persönliche Live-Abrechnung zusätzlich sichtbar kontrolliert; sauberer
Monatsrahmen und volle Inhaltsbreite bestätigt. Nur navigiert/gelesen, keine echten
Kauf- oder Korrekturaktionen ausgelöst. Die kurz unterbrochene Browserverbindung
wurde wiederhergestellt; abschließende Ansicht in normaler Browsergröße.
Nachweis: output/TFB-Abrechnung-ueberarbeitet-live.jpg. Aktualisierte Druckdateien
zusätzlich unter output/pdf/ im Hauptprojekt. Lokaler Arbeitsstand gezielt ergänzt.

Nutzer meldet geklemmte iPad-Kalender und unsauberen Monatsrahmen. Ursache:
äußere Abrechnungsansicht auf 760 px begrenzt; quadratische Kalender mit zu
knappen Monatszeilen und altem gemeinsamem Rasterrahmen. Neue hosteigene CSS
assets/css/statement-layout.css NACH dem unveränderten shared-kiosk/native.css.
Keine Änderung am gemeinsamen Kioskpaket oder an Abrechnungsberechnungen.

Persönliche und administrative Ansicht nutzen die volle Inhaltsbreite. Ab 1000 px
stehen flexible Kalender nebeneinander, darunter volle Breite untereinander;
Jahresraster im Tablet-Hochformat 4 × 3, auf kleinen Handys 3 × 4. Keine erzwungenen
Quadrate, genügend Feldhöhe, lesbare Schrift und keine Zell-Gitternetzkollisionen.
Auswahl mit gleichmäßigem inneren Rahmen in der jeweiligen Markenfarbe; getrennte
Felder und Fokusrahmen. Historische Jahre sauber in der breiten Werkzeugzeile.
Buchungstage: gut lesbare dunkle Zahlen, gelbe/rote Unterstreichung passend zur Welt.

Druckplan: beide Titelzeilen horizontal auf die Blattmitte ausgerichtet, gesamter
Titelblock vertikal exakt auf die Mitte des linken Logos. Rechtes Court-Symbol
auf dieselbe Achse und symmetrischen Abstand zur Blattmitte gesetzt. 29 Belegungen,
eine A4-Querformatseite und 300-dpi-JPEGs wie zuvor. PDFs/JPEGs samt Vorschauen neu
generiert; versionierte Download-/Bild-URLs vermeiden alte Browserkopien.

Tests: 15 Kiosk-Backendtests erfolgreich; vollständige bestehende Browserprüfung
in Chromium/WebKit mit Korrekturen, Mietartikeln, Archivierung, Monatsversionen,
Datentrennung, CSV und Tages-JPEG erfolgreich. Alte Quadrat-Erwartung an den neuen
responsiven Aufbau angepasst. Testfixture um die bereits produktiv vorhandenen
additiven Padel-Bridge-Tabellen ergänzt (nur SQLite im Speicher, kein Backendrelease).
Neue Layoutprüfung in Chromium/WebKit bei 390×844, 844×390, 768×1024, 834×1194,
1024×768, 1194×834, 1366×1024 und 1440×1000 je beide Welten erfolgreich: volle
Inhaltsbreite, sichtbare Monatsfelder, saubere Auswahl, September-Kopf ohne
Überlappung, Monats-/Tagesnavigation und unveränderte Testbuchungssummen.
Beide PDF-Seiten visuell geprüft, Titelzentrierung zusätzlich per Textkoordinaten
innerhalb 0,5 pt gemessen. 309 öffentliche Dateien im Paket geprüft.


## Fünf-Tage-Matrix und A4-Druckplan · 09.11.2026

Veröffentlichung bestätigt: a45dc73, Pages-Lauf 42711291614 erfolgreich.
index.html, Daten-/UI-JavaScript, court-plan.css, sw.js und alle vier PDF-/JPEG-
Dateien live bytegleich mit dem geprüften Paket. Live-Frontend zusätzlich mit
isolierter API in Chromium/WebKit bei 390/834 px geprüft: fünf Tage, Matrix,
Vorschau, Farbwechsel, Downloads, feste Platzspalte und Navigation erfolgreich.
Echte öffentliche Wochenmatrix zusätzlich sichtbar kontrolliert. Screenshot:
output/TFB-Platzbelegung-Wochenmatrix-2027-live.jpg. Druckdateien zusätzlich
unter output/pdf/ im Hauptprojekt. Keine produktiven Inhaltsdaten verändert.

Nutzerpräzisierung: Ganze Woche als kompakte Matrix statt gestapelter Tagespläne.
Mo–Fr als fünf Spalten, Plätze 1/2/3/4/6/7 als sechs Zeilen, 29 Belegungen mit
Mannschaft und Uhrzeit. Samstag/Sonntag auch aus Tageswahl entfernt; keine Aussage
über freie Wochenenden. Mobile Matrix horizontal scrollbar, Platzspalte bleibt
sichtbar. Tagesansicht weiterhin für schnelle mobile Nutzung.

Platzsymbol im Uhrzeigersinn statt gegen den Uhrzeigersinn geneigt (+8 Grad),
2,5-fache Größe auf Desktop und Handy. Exakte Flächenfarben #FFC300 / #C4553A;
rote Jugend-Markierung kräftiger #EAA18A statt blassem #F2E5DF. Änderungen nur
im Platzplan, keine globalen redaktionellen Textmarker verändert.

Vorschau und PDF-/JPEG-Downloads auf der Seite, automatisch passend zur Farbwelt.
assets/docs/tfb-platzbelegung-sommer-2027-{black-crail,midnight-amber}.{pdf,jpg}.
PDFs je eine echte A4-Querformatseite (841,89 × 595,28 pt), vektorielle Logos,
eingebettete Instanzen der Website-Schriften, 29 Belegungen. JPEGs direkt aus den
PDFs bei 300 dpi (3508 × 2481 px), keine separate Datenpflege. PDFs ca. 30 KB,
JPEGs unter 1 MB. Vier Dateien im Offlinecache. Reproduzierbarer Builder:
tools/build-court-plan-downloads.py mit ReportLab/fonttools/svglib/pypdf/Poppler;
Daten ausschließlich aus assets/data/court-plan.js. Keine Datenbankänderung.

Beide PDF-Seiten visuell kontrolliert; Seitenformat, Seitenzahl und Häufigkeit
aller Mannschaftsbezeichnungen und Zeiten gegen Quelldaten geprüft. Browsertests
Chromium/WebKit bei 375/390/760/834/1440 px in beiden Farbwelten erfolgreich:
fünf Tage, sechs Plätze, 29 Belegungen, feste Platzspalte bei horizontalem Scrollen,
keine Seitenüberbreite, keine abgeschnittenen Einträge, Vorschau, themenabhängige
Downloadlinks, geladene Vorschaubilder, Symbolgröße/-neigung, Tag/Woche und
Sportnavigation. 308 öffentliche Dateien im Veröffentlichungspaket validiert.


## Beitragspflege direkt im Clubbereich · 09.11.2026

Veröffentlichung bestätigt: 4f71748, Pages-Lauf 42709215859 erfolgreich. Live-Frontend mit isolierter API in Chromium/WebKit bei 834 px auf neuen Club-Zugang, fehlenden globalen Button, Speichern und Konflikte geprüft; erfolgreich. Keine produktiven Testbeträge gespeichert.

Auf Nutzerwunsch den globalen Adminbutton Beiträge entfernt. Stattdessen öffnet
der Button unter Club → Mitglied werden im Seiten-Bearbeitungsmodus direkt den
Beitragseditor und heißt dann Beiträge bearbeiten. Öffentliche Ansicht weiterhin
Mitgliedsbeiträge. Weg: Stift einschalten → Clubseite bearbeiten → Beiträge bearbeiten.
Beträge, Kategorien, Rollen und zentrale Speicherung unverändert.

Bestehende Browserprüfung auf den neuen Weg angepasst: keine globale Verknüpfung,
kontextueller Editor, 9 Eingaben, Abbrechen, Validierung, zentrales Speichern,
Gast-/Mitgliederansicht und Konfliktschutz; Chromium/WebKit je 390/834/1440 px
vollständig erfolgreich. Gezielter öffentlicher Beitragstest ebenfalls erfolgreich.


## Platzbelegung Sommer 2027 · 09.11.2026

Veröffentlichung bestätigt: Programm f2bec7c, Pages-Lauf 42708346210 erfolgreich.
index.html, site.js, court-plan.js (Daten und UI), court-plan.css und sw.js live
bytegleich mit dem geprüften Paket. Live-Frontend in Chromium/WebKit bei 390/834 px
mit isolierter API erneut erfolgreich; echter öffentlicher Plan sichtbar kontrolliert.
Screenshot: output/TFB-Platzbelegung-Sommer-2027-live.jpg. Keine produktiven CMS-
oder Geschäftsdaten verändert. Lokaler Arbeitsstand gezielt ergänzt, andere Änderungen erhalten.

Neuer dritter Sportbereich #sport/platzbelegung neben Mannschaften und Training.
29 feste Belegungen aus Platzbelegung Sommer 27.xlsx, Tabelle1, D6:K38.
Plätze 1/2/3/4/6/7 unverändert; Tagesanzahlen Mo–So 4/6/7/8/4/0/0.
Jörn bestätigt Saison 2027 (alte Unterzeile 2026 ignorieren) und Dienstag Johann
17–21 Uhr (G18:K18 endet ausdrücklich 21 Uhr). Stundenbereiche sonst aus verbundenen
Stundenzellen abgeleitet und unabhängig gegen XML abgeglichen. M9:M11 außerhalb
der Tabelle (offen, Damen 30.2, 2. Herren) ohne Zeit-/Platzzuordnung nicht eingeplant.

Responsive Tagesansicht: proportionale Platzspuren ab 760 px, lesbare Einträge
auf Handygrößen. Wochentagswahl und Ganze Woche; leere Tage ausdrücklich ohne feste
Belegung, kein Live-Buchungsversprechen. Zwei Farbwelten, bestehende Bricolage-/DM-
Sans-Typografie, Tastatursteuerung und Statusansage. Drei Sportbuttons in einer Reihe.
Daten in assets/data/court-plan.js, Darstellung assets/js/court-plan.js und
assets/css/court-plan.css. Kein CMS-/Backendwechsel und keine Reservierungsfunktion.
Die Randnotizen sind kein Ersatz für bestätigte Trainingszeiten.

Recherche: Pinterest-Suche ergab keine geeignete konkrete Sportansicht. Als
Gestaltungsreferenzen CodyHouse Weekly Schedule (responsive Tage/Zeitraster),
https://codyhouse.co/ds/components/info/weekly-schedule und Mobiscroll Day/Week,
https://demo.mobiscroll.com/scheduler/mobile-week-view. Eigenständige Umsetzung
im TFB-System, keine fremden Komponenten, Schriftarten oder Bilder übernommen.

Validiert: Daten-/Zeitgrenzentests, unabhängiger Abgleich aller 29 Excel-Zellen,
Chromium und WebKit bei 375/390/760/834/1440 px jeweils beide Farbwelten: Tag/Woche,
Wochenende, bestätigtes Ende Dienstag, Platznummern, keine abgeschnittenen Events,
kein horizontaler Überlauf, Tastatur, Neuladen und Rückkehr Training/Mannschaften.
304 öffentliche Dateien mit prepare-pages.py geprüft; versionierte Bestandsdateien
und neuer Offlinecache für die Veröffentlichung.


## Mitgliedsbeiträge ab 2027 · 09.11.2026

Veröffentlichung bestätigt: Programm 18612c5, Pages-Lauf 42706618452 erfolgreich.
Live-Dateien index.html, app.css, app.js, site.js, membership-fees.js und sw.js
bytegleich mit dem geprüften Paket. Live-Frontend zusätzlich mit isolierter API
in Chromium/WebKit bei 834 px einschließlich Speichern und Konflikten geprüft;
öffentliche echte Live-Übersicht sichtbar mit den Vorstandsbeiträgen kontrolliert.
Keine produktiven Testbeträge gespeichert. Neue Vorgaben gelten als Startwerte;
der erste Admin-Speichervorgang legt die expliziten Werte im zentralen CMS ab.

Neue Jahresbeiträge laut Vorstand: Jugend bis 14 Jahre 50 €, Jugend bis 18 Jahre
90 €, Erwachsene 210 €, Ehepartner 150 €, Azubi / Student / Schüler 110 €,
passiv 50 €, Gast- / zweite Mitgliedschaft 110 €, Schnupperjahr Erwachsene 80 €,
Jugend 50 €. Ab dem 3. Kind beitragsfrei. Öffentlich ausdrücklich ab 01.01.2027.

Adminpflege: Stift → Beiträge → Beträge bearbeiten → Beiträge speichern.
Neun Beträge veränderbar, Kategorien und Beitragsfreiheit fest. Zentrale Speicherung
im bestehenden CMS-Dokument page:verein unter membershipFees (Integer-Centbeträge),
inklusive Revisionen und Sicherungen. Ohne gespeicherten Eintrag gelten die oben
aufgeführten Vorgaben. Kein Backend-/Schemawechsel. Fremde Club-Inhalte bleiben
beim Speichern erhalten; parallele Änderungen führen zu verständlichem Konflikt.

Validiert: 4 Beitragstests und 7 CMS-Tests erfolgreich; gezielter öffentlicher
Beitragstest erfolgreich. Browserprüfung Chromium/WebKit jeweils 390/834/1440 px:
Anzeige, Adminrollen, Abbrechen, Eingabevalidierung, zentrales Speichern und Lesen
als Gast/Mitglied, Konfliktschutz und Layout erfolgreich. Vollständige alte Home-
Tests enthalten noch zwei unabhängige veraltete Erwartungen an Trainerkarten.
Antrag und Bestätigungsmail berechnen keine Beiträge und enthalten keine alten Beträge.


## Ruhiger Footer und Bierdeckel-Farbwelt · 09.11.2026

Veröffentlichung bestätigt: Programm afdd7f1, Pages-Lauf 42702239487 erfolgreich.
index.html, app.css, partner-visibility.css, app.js und sw.js live bytegleich mit
dem geprüften Paket. Abschließende Live-Frontendprüfung in iPad-Breite (834 px)
mit Chromium und WebKit, synthetischem Konto und isolierter API ebenfalls
erfolgreich: beide Ballfarben, Footerstile, Datenschutzdialog und Neuladen.
Öffentlicher Live-Footer zusätzlich sichtbar kontrolliert. Keine Server- oder
Datenbankänderung erforderlich.

Der Statistik-Datenschutzhinweis verwendet denselben dezenten Footerstil wie
Impressum und Satzung: gleiche Schriftgröße/-stärke, Farbe und Abstände; flexible
Zeilenumbrüche, gut bedienbarer Button und sichtbarer Tastaturfokus. Der vollständige
bestehende Hinweis bleibt unverändert und öffnet sich weiterhin im Dialog.

Das Bierdeckel-Symbol folgt jetzt ausdrücklich der TFB-Farbwelt: #FFC300 in Gelb,
#C4553A in Rot. Ursache war die lokal rot definierte --signal-Variable des gemeinsamen
Kioskmoduls. Gezielt nur die Ballfarbe korrigiert, ohne das gemeinsame Modul oder
andere Produkt-/Markenfarben zu überschreiben. Keine Medienabfrage: gilt auf allen
Geräten. Versionierte App-/CSS-Dateien und neuer Offlinecache sorgen für Aktualisierung.

Chromium und WebKit: je 375/390/768/834/1024/1440 px, beide Farbwelten, Ballfarbe und
Maskenfüllung, identische Footer-Linkstile, Datenschutzdialog, Farbwechsel nach Neuladen
und keine horizontale Überbreite erfolgreich. Isolierte Testkonten und Testdatenbank
mit dem produktiven additiven Padel-Kiosk-Schema; keine echten Buchungen angelegt.


## Bereinigte SVG-Logos in beiden Farbwelten · 09.11.2026

Veröffentlichung bestätigt: Programm ff0996e, Pages-Lauf 42697840167 erfolgreich.
Live-Dateien index.html, partner-visibility.css, beide SVGs und sw.js bytegleich
mit dem geprüften Paket. Öffentliche Website zusätzlich bei 390/1440 px in
Chromium geprüft: beide Farbwelten, Header/Splash, transparente Naht und
Farbumschalter erfolgreich. Sichtbare Live-Ansicht ebenfalls kontrolliert.

Kopfbereich und Einstiegsseite verwenden die vom Nutzer abgenommene Vektorversion 3:
assets/brand/tfb-logo-black-crail.svg bzw. tfb-logo-midnight-amber.svg (je ca. 11 KB).
Beide Dateien enthalten ausschließlich Pfade und bewahren transparenten Hintergrund
und transparente Ballnaht. Bisherige Rastermasken an diesen Stellen ausgeblendet;
der unsichtbare Ballbutton der Einstiegsseite bleibt als Farbweltschalter aktiv.
Geometrie/Größe unverändert, Logo-Seitenverhältnis aus der Vektorvorlage übernommen.
App-Symbole, Mailvorlagen und redaktionelle Inhalte unverändert.

Neuer Offlinecache tfb-kiosk-vector-logos-20261109-1 hält beide SVGs und die versionierte
Stylesheet-URL vor. Frontendänderung ohne Worker-/Datenbankeingriff. Veröffentlichung
isoliert auf aktuellem main vorbereitet, um den zwischenzeitlichen Shared-Kiosk-Ausbau
zu erhalten. Chromium und WebKit bei 390/834/1440 px: beide SVGs in Header und Splash,
exakte Signature-Farben, transparente Naht, Farbumschalter und gespeicherte Farbwahl,
ausgeblendete Altmasken und keine horizontale Überbreite geprüft; keine Skriptfehler.


## Absatzabstände Über uns und Trainernamen · v365 · 09.11.2026

Veröffentlicht: f639032, Pages-Lauf 42600606555 erfolgreich. Live-Dateien
bytegleich; alle sechs gespeicherten Absätze wortgleich im Dialog und mit
sichtbarem Abstand geprüft. Namensfarben beider Welten korrekt; keine Fehler.

Ursache fehlender sichtbarer Absätze: globale CSS-Regel p { margin:0 }, nicht
ein Speicherfehler. Öffentlicher Live-Text vor Änderung enthielt sechs korrekt
getrennte Absätze, inklusive der vom Nutzer ergänzten Padel-/Rabattinformation.
Gezielter Abstand 1em zwischen Fließtextabsätzen im Über-uns-Dialog; letztem
Absatz keinen unnötigen unteren Rand geben. Keine Inhaltsänderung/Speicherung.
Trainernamen jetzt Signature-Rot bzw. Signature-Gelb als reine Schriftfarbe,
ohne gelben Marker. Spezifität berücksichtigt die vorhandene redaktionelle
Schriftgestaltung, damit die rote Namensfarbe nicht wieder überschrieben wird.
Chrome/WebKit: Namensfarben beider Welten und reale Abstände zwischen Absätzen
geprüft. Bestehende E-Mail-Akzente, Kontakte und Nutzerinhalte bleiben erhalten.

## Trainer-E-Mails in Signature-Farben · v364 · 09.11.2026

Veröffentlicht: 548c0e7, Pages-Lauf 42599957102 erfolgreich. Live-Dateien
bytegleich; rote Fettschrift und gelber Marker mit dunkelblauer Schrift
auf der echten Website geprüft, keine Skriptfehler.

Trainer-E-Mail-Links in der roten Welt Signature-Rot und fett (700). In der
gelben Welt dunkelblaue Schrift (500) auf dem bestehenden gelben Freihand-
Textmarker. Markierung sitzt auf dem Textspan, mit Klonen bei Zeilenumbrüchen;
keine Unterstreichung. Handy-Links bleiben dezent. Chrome/WebKit: Farbe,
Schriftgewicht, Marker und Mail-/Telefonverknüpfungen geprüft. Keine CMS-Daten,
Nutzerergänzungen, Fotos oder Reihenfolgen geändert.

## Schlichte Trainerkontakte und App-Logo · v363 · 09.11.2026

Veröffentlicht: c498fc6, Pages-Lauf 42599609235 erfolgreich. Live-Dateien
bytegleich geprüft, keine unterstrichenen Trainerkontakte, exakter App-Iconpfad
in „Über uns“, Dialog öffnet und alle vier Porträts laden ohne Skriptfehler.

E-Mail und Handy unter den Trainerkarten ohne Unterstreichung (auch Hover/Fokus).
mailto:- und tel:-Verknüpfungen bleiben auf allen Geräten funktionsfähig;
Telefonlinks können auch am Desktop an vorhandene Telefon-/Handoff-Apps gehen.
„Über uns“ beim Vorstand verwendet exakt assets/icons/icon-180.png?v=305,
dieselbe Originaldatei wie das iPhone-Startbildschirmsymbol: Signature-Blau ohne
Ball auf dem Originalhintergrund. Bestehender runder Rahmen bleibt bestehen,
Bild zentriert/ungekürzt und unabhängig von der Farbwelt.
Chrome/WebKit geprüft: beide Welten, Links/Interaktionen, exakter Iconpfad und
Dialog. Keine CMS-Inhalte ändern: Nutzer hat Johanns bekannte Daten inzwischen
selbst ergänzt; Isabels Handynummer bleibt noch offen und folgt vom Nutzer.

## Trainerreihenfolge und Statuspflege · v362 · 09.11.2026

Veröffentlicht: Programm 328d2c4, Pages-Lauf 42597120824 erfolgreich; Worker
fd3a56f8-ec61-4b3c-abae-f0b6e30a0a95. Kontakte und gewünschte Reihenfolge
anschließend über die echte Adminpflege gespeichert, ohne bestehende Texte
oder Bildausschnitte zu ersetzen. Live-Dateien bytegleich geprüft.

Trainerpflege mit Bereichen Aktiv (immer offen), Inaktiv und Ausgeblendet
(aufklappbar). Pfeile je Person verschieben die Reihenfolge innerhalb ihres
Bereichs. Statusauswahl Aktiv/Inaktiv/Ausgeblendet; „Ausblenden“ ersetzt das
bisherige Entfernen ohne Verlust der Texte, Bilder, Kontakte oder Ausschnitte.
Jeder Eintrag lässt sich wieder aktivieren. Neue Trainer weiterhin hinzufügbar.
Änderungen werden gemeinsam mit „Trainerteam speichern“ veröffentlicht.
Öffentlich erscheinen ausschließlich aktive, nicht ausgeblendete Trainer;
auch der öffentliche CMS-Endpunkt entfernt die übrigen Personen aus der Antwort.
Adminansicht und Sicherungen behalten sämtliche Einträge. Gewünschte Livefolge:
Leon Kaufmann, Basti Manz, Johann Szakacs, Isabel Hähn.

Gezielter Mitgliederabgleich: Isabel und Sebastian/Basti eindeutig gefunden,
E-Mail-Adressen in der zentralen Trainerpflege ergänzt. Bastis Telefonnummer
aus bestehendem öffentlichen Vorstandseintrag übernommen. Johann hat weder
E-Mail noch Zweitadresse in der Mitgliederliste; keine Telefonnummern in den
importierten Mitgliedsstammdaten. Keine fremden Familienkontakte verwenden.
Isabels Handynummer und Johanns fehlende Angaben ergänzt der Nutzer manuell.
Keine privaten Mitgliedskontakte in Programmdateien oder Git hinterlegen.

Prüfung Chromium/WebKit: Sortierung, Inaktiv/Ausblenden, Wiederaktivieren ohne
Datenverlust, zwei aktive öffentliche Einträge vs. vier vollständige Admin-
einträge, erneute Gesamtfolge; bestehende Bildausschnitte/Kontakte bestehen.
Sieben CMS-/Sicherungsprüfungen ebenfalls erfolgreich.

## Trainerbilder einpassen und Kontaktfelder · v361 · 09.11.2026

Veröffentlicht: aea51d0; Pages-Lauf 42596083219 erfolgreich. Live-Dateien
bytegleich, vier Kontaktfelder und Leons Mail-/Telefonlinks sowie alle
Trainerbilder öffentlich geprüft; keine JavaScript-Fehler.

Trainerpflege: „Foto einpassen“ nutzt den vorhandenen Foto-Rahmendialog mit
Zoom, horizontaler und vertikaler Verschiebung sowie Originalansicht. Gespeichert
wird nur der Ausschnitt (trainers[].frame), Originalbild unverändert. Neues Foto
setzt den bisherigen Ausschnitt zurück. Hochformat 3:4 identisch im Dialog und
auf Desktop/Tablet/Mobil; Handy-Kontaktbereich steht unter der gesamten Karte.
Unter allen vier Trainern eigene dezente Kontaktfelder E-Mail und Handy,
anklickbar bei vorhandenen Angaben. Fehlende Angaben bleiben als Strich sichtbar.
Admin kann beide Felder in der Trainerpflege ergänzen/ändern/leeren.

Leons veröffentlichte Daten geprüft unter https://www.tfbielstein.de/trainer/:
leonkaufmann2002@icloud.com, 0176 76731093. Einmalige Standardergänzung, spätere
bewusste Änderungen/Leerung bleiben erhalten (contactDefaultsApplied). Für die
übrigen Trainer keine Kontaktdaten ergänzen: Nutzer übernimmt sie selbst.
Chrome/Safari geprüft: Kontaktfelder, Foto-Upload, gespeicherter Zoom 1,7 und
Höhenposition 80 % nach Neuladen und in öffentlicher Gastansicht.

## Trainerteam und Vorstandstext · v360 · 09.11.2026

Veröffentlichung v360 bestätigt: Programmcommit 36eca8d, GitHub-Pages-Lauf
42594868961 erfolgreich. Live-Dateien inklusive beider aufbereiteter Porträts
bytegleich geprüft. Öffentliche Live-Ansicht zeigt alle vier Trainer mit geladenen
Bildern (Leon 1200×1600, Johann/Isabel 1086×1448, Basti 944×1665) und den
„Über uns“-Dialog; keine JavaScript-Fehler. Browserprüfung enthält zusätzlich
Trainerfoto-Upload samt erneuter Darstellung nach Speicherung und Neuladen.

Sport → Training: vier Porträtkarten für Leon Kaufmann, Johann Szakacs,
Isabel Hähn und Basti Manz. Einführung aus der alten Vereins-App aufgeteilt in
Teamtext und Personenbeschreibungen; Sebastian/Basti ist dieselbe Person und
wird nicht doppelt geführt. Vorhandene Leon-/Basti-Bilder wiederverwendet;
Johann/Isabel aus den bereitgestellten Screenshots mittels Bildbearbeitung
von App-Oberfläche und Pfeilen befreit, hochauflösend rekonstruiert. Es sind
keine neu beschafften Originalfotos. Quellen: iPhone-Screenshots vom 09.11.2026.

Admin: Sport bearbeiten → Trainerbaustein bearbeiten öffnet die gemeinsame
Pflege für Überschrift, Einführung, Name, Funktion, Text, Foto, E-Mail und
Telefon je Trainer. Hinzufügen/Entfernen möglich. Kontaktdaten zunächst leer;
Nutzer ergänzt sie selbst. Eingetragene Trainerkontakte werden öffentlich
veröffentlicht (entsprechender Hinweis im Editor, publishEmail/publishPhone).
Speicherung mit bestehender zentraler CMS-Revisionsprüfung; öffentliche
Darstellung, Sicherungen und spätere Bearbeitung verwenden dieselben Felder.
Defaulttexte in club-people.js greifen ausschließlich solange die betreffenden
CMS-Felder noch fehlen; keine bestehenden Live-Seiten oder Katalogdaten ersetzen.

Club → Vorstand: achte Kachel „Über uns“ im selben Kartenraster öffnet einen
Dialog mit dem gelieferten Vorstandstext. Titel und Text in „Vorstand bearbeiten“
pflegbar. Sieben Personen bleiben unverändert. Keine neue Home-Schnellnavigation:
Die früheren Pill-Entwürfe wurden vom Nutzer zurückgestellt.

Prüfung: tools/test-browser-club-people.mjs in Chromium und WebKit; 390/834/1440 px,
beide Farbwelten, vier Bilder, persistente Texte/öffentliche Kontaktdaten,
Vorstandskachel und Textpflege, öffentliche Ansicht ohne Admin-Editoren.
Keine Finanzfunktionen, Buchungen, Statistik- oder Produktdaten verändert.

## Produkt- und Kategoriepflege vom Nutzer bestätigt · 09.11.2026

Der Nutzer hat die frühere Kategorie „Spezialitäten“ für Bockwurst, Grillfleisch
und ähnliche Speisen selbst in der App umbenannt. Gewählte Bezeichnung:
„Stärkung gefällig?“ (vom Nutzer als „Stärkung gefällig“ bezeichnet). Die
Inhaltsänderung ist laut Nutzer bereits umgesetzt; nicht erneut anlegen,
überschreiben oder auf „Spezialitäten“ zurücksetzen. Maßgeblich bleibt der in
der App gepflegte Katalog, nicht die ältere Bezeichnung im Standardkatalog.

Ausdrückliche positive Abnahme: Produkte und Kategorien lassen sich jetzt sehr
komfortabel handhaben und bearbeiten. Bibliothek mit Kiosk-Kategorien, gemeinsamer
Reihenfolge, kompakten Karten, festen Statusbereichen, schneller Statusänderung
und Kategorieverwaltung ist als Arbeitsstand akzeptiert. Kein weiterer UI-Umbau
oder Sortimentswechsel aus dieser Rückmeldung ableiten.

Aktueller veröffentlichter Programmstand bleibt v359. Diese Aktualisierung
sichert ausschließlich Projektwissen, Projektupdate und Übergabe. Bestehende
Nutzeränderungen im Live-Sortiment erhalten. Die offenen Absprachen mit Finanzwart/
Buchhalter zu tatsächlichem Einzug und Übergabedaten bleiben bestehen; echte
Abbuchungen weiterhin nicht aktiviert. Spätere Nullstellung erst bei konkretem
Auftrag, jetzt keine Daten löschen oder zurücksetzen.

## Kategoriepflege in der Produktbibliothek · v359 · 09.11.2026

Oben + Neue Kategorie, an jeder aktiven Kategorie Bearbeiten neben + Artikel.
Gemeinsamen Kiosk-Kategorieeditor direkt aus der Bibliothek erreichbar gemacht;
Bezeichnungen nun Kategorie bearbeiten/Neue Kategorie. Name, optionaler Hinweis
und Status Geöffnet/Bald bleiben pflegbar. Neue Kategorien hinten in gemeinsamer
Katalogreihenfolge, Änderungen erscheinen zugleich im Kiosk und der Bibliothek.
Beim Öffnen der Kategoriepflege Suchfilter/Rückmeldung leeren, damit neue oder
umbenannte Kategorien danach sichtbar bleiben. Neue Kategorie immer verfügbar;
bei leerem Kategorienbestand neues Produkt bis zur ersten Kategorie deaktiviert.

Leere Kategorien lassen sich nach zweitem Klick entfernen. Bei vorhandenen
Artikeln zunächst explizit Zielkategorie auswählen; dann alle aktuell zugeordneten
aktiven, inaktiven und archivierten Produkte in einem Katalog-Speichervorgang
dorthin verschieben und Ausgangskategorie entfernen. Artikelidentität, Preise,
Status und weitere Angaben bleiben erhalten. Letzte Kategorie mit Artikeln kann
ohne andere Zielkategorie nicht entfernt werden; Hinweis zur Neuanlage. Frühere
Buchungen behalten damalige Kategorie/Angaben im geschützten Journal.

Kategorieeditor verwendet jetzt ebenfalls den beim Öffnen erfassten Katalog als
Erwartungsstand: zwischenzeitliche Änderungen eines anderen Admins werden nicht
überschrieben. Vorhandene revisionsgeschützte, schnelle Speicherlogik unverändert.
Keine Live-Kategorien/Produkte verändert, kein Backend- oder Schemawechsel,
keine Buchungen zurückgesetzt. Service Worker v359.

Chromium/WebKit: Kategorie neu anlegen, umbenennen, leere Kategorie entfernen,
belegte Kategorie ohne Ziel ablehnen, aktive/inaktive/archivierte Artikel korrekt
übernehmen und vollständige historische Journalzeilen unverändert vergleichen.
Veralteten Kategorieeditor bei paralleler Adminänderung abweisen. Bestehende
Bibliotheks-, Preis-, Verleih-, responsive und Abrechnungs-/CSV-/JPG-Prüfungen
weiterhin erfolgreich. Mobile Darstellung der neuen Kategorieaktionen geprüft.

Live bestätigt: Commit 216b5e7, Pages-Workflow 42587471938 erfolgreich.
Bibliotheksmodul, App, CSS und Service Worker v359 öffentlich bytegleich mit dem
geprüften Stand. Keine Live-Kategorien oder Produktdaten vorab verändert.

## Produktbibliothek nach Kiosk-Kategorien · v358 · 09.11.2026

Aktive Artikel jetzt in denselben Kategorien wie im Kiosk, direkt aus der
bestehenden sections-Reihenfolge des gemeinsamen Katalogs. Innerhalb jeder
Kategorie dieselbe products-Reihenfolge wie im Kiosk statt alphabetischer
Sortierung. Änderungen der Reihenfolge im Kiosk gelten damit automatisch auch
für die Bibliothek; keine zweite Sortierlogik oder Kopie des Sortiments.
Benutzerdefinierte Kategorien und vorhandene Snacks-Kategorie bleiben erhalten.

Kompaktere Karten: Desktop vier, Tablet drei bzw. zwei und Mobil zwei Spalten,
mit Symbol, Name, Zusatz, Preis, Einheit, Artikelart und allen Verwaltungsaktionen.
Aktive Kategorie nur in der Gruppenüberschrift statt auf jeder Karte wiederholen;
noch nicht freigegebene Bereiche entsprechend kennzeichnen. Kategorieüberschrift
bietet + Artikel mit vorausgewählter Kategorie. Im Artikeleditor Auswahl nun
explizit Kategorie, verpflichtend und vor dem Speichern validiert. Wechsel der
Kategorie verschiebt den Artikel wie bisher an das Ende der Zielkategorie und
erscheint nach Speicherung in beiden Ansichten.

Inaktiv und Archiviert bleiben flache, alphabetisch sortierte Listen; die letzte
Kategorie steht weiterhin an jeder Karte und bleibt bei Wiederaktivierung erhalten.
Augen-Symbole, Signature-Status und unmittelbare Speicher-Rückmeldung unverändert.
Keine Änderung an Produkten, Preisen oder Kategorien der Live-Daten vorgenommen.
Historische Käufe behalten damalige Kategorie/Artikelangaben; Buchungslogik und
schneller revisionsgeschützter Katalog-Speicherablauf unverändert. Kein Backend-
Deployment und keine Datenbankmigration erforderlich. Service Worker v358.

Chromium/WebKit: Kategorien und Artikelreihenfolge gegen Kiosk-Katalog geprüft,
Neuanlage aus Kategorie mit vorausgewählter Pflichtauswahl, bereits gebuchten
Verleihartikel in andere Kategorie verschoben und Kiosk-Zuordnung kontrolliert.
Historische Einträge behalten Verleih, spätere Käufe nutzen neue Zuordnung;
Archivierung/Wiederaktivierung bewahrt letzte Kategorie. Suche, Statuswechsel,
Preiswechsel, 390/834/1440px und beide Signature-Welten sowie die vorhandenen
Abrechnungs-/CSV-/JPG-Abläufe weiterhin erfolgreich geprüft.

Live bestätigt: Commit 4724eaf, Pages-Workflow 42586541983 erfolgreich.
283 öffentliche Webdateien vorbereitet. Bibliotheksmodul, App, CSS und Service
Worker v358 öffentlich bytegleich mit dem geprüften Stand. Vorhandenes Live-
Sortiment und Buchungsdaten nicht verändert.

## Feste Produktbereiche und schneller Statuswechsel · v357 · 09.11.2026

Produktbibliothek nicht mehr nach einzelnen Tabs gefiltert. Feste Reihenfolge:
Aktiv, Inaktiv, Archiviert mit fetten Überschriften und Anzahlen. Aktiv bleibt
immer sichtbar; Inaktiv und Archiviert lassen sich über beschriftete Augen-
Symbole ein-/ausblenden. Suche gilt für alle drei Bereiche. Neuer Statuswechsel
öffnet nötigenfalls den Zielbereich und verschiebt die Karte unmittelbar dorthin.
Inaktiv-Button bleibt in Signature-Farbe: weiß auf Rot, gelb auf Signature-Blau.
Während Speicherung farbiger Status und ausdrücklicher Hinweis „Wird gespeichert“;
weitere Mutationen gesperrt, Suche und Sichtbarkeit bleiben bedienbar.

Ursache der wahrgenommenen Wartezeit: vorher vollständiger App-Neuabgleich nach
Katalogspeicherung, ggf. zusätzlich ein vorgelagerter Abgleich. Katalog-only-
Speicherung nutzt jetzt die bestehende revisionsgeschützte Schreibanfrage direkt.
Server bestätigt exakt seinen normalisierten Katalog samt neuer Datensatzrevision,
Client übernimmt diese Bestätigung ohne großen /app/state-Abruf. Der nächste
Hintergrundabgleich bleibt bestehen. Idempotente Wiederholungen ohne Katalog-
Bestätigung nutzen weiterhin den vollständigen Abgleich als sicheren Fallback.
Sonstige Speicher-/Buchungsvorgänge bleiben unverändert. Kein vorgetäuschter
Speichererfolg: bis zur Bestätigung ausdrücklich ausstehend; Fehler führt zur
letzten bestätigten Darstellung und sichtbarem Hinweis „Nicht bestätigt“.

Buchungslogik erneut geprüft: inaktive und archivierte Produkte serverseitig
nicht neu buchbar; bestehende Käufe behalten Preis und Produktangaben. Schon
vorhandener Schutz gegen veraltete Preise und parallele Adminänderungen bleibt.
Keine Änderungen an Live-Produkten, Preisen, Käufen, Zahlungswegen oder Datenbank-
Schema; ausschließlich Darstellung und Katalog-Speicherablauf geändert.

Prüfung: 15 Server-/Buchungstests plus 2 Einrichtungstests erfolgreich; 15 Tests
auch gegen das tatsächliche Worker-Bündel. Chromium/WebKit inklusive vorhandener
Abrechnungs-/CSV-/JPG-Abläufe erfolgreich. Verzögerte Antwort (800 ms) zeigt die
Karte sofort im neuen Bereich; synchrone Rückmeldung in beiden Browser-Fixtures
ca. 1 ms, keine Aussage über reale Bank-/Netzlaufzeiten. Pro erfolgreichem
Statuswechsel nur eine /app/commit-Anfrage und kein /app/state im Speichervorgang.
Gezielt abgelehnte Anfrage wird zurückgenommen, Serverstatus bleibt aktiv.
Farbwerte beider Welten, responsive Ansichten, bestehende Preis-/Historien-
absicherungen und feste Bereichsreihenfolge geprüft. Service Worker v357.

Live bestätigt: Code c0abcc1, Testnachschärfung 7a16df3. Pages-Workflow
42585860931 erfolgreich; Worker-Version 42744063-ef10-44b3-bd7e-28012e626f1d.
Bibliotheksmodul, Synchronisation, CSS und Service Worker v357 öffentlich bytegleich.
Kein Einrichtungsskript erneut ausgeführt; vorhandene Nutzeränderungen am
Sortiment und sämtliche Buchungen unverändert belassen.

## Produktbibliothek und stundenweiser Verleih · v356 · 09.11.2026

Freigabe: Produktbibliothek direkt umsetzen/veröffentlichen, Padelschläger-Verleih
zunächst 4 EUR je Stunde. Neue Adminansicht #produktbibliothek mit Suche über
Name/Zusatz/Bereich/Einheit, Status Aktiv/Inaktiv/Archiviert und Artikelkarten
in beiden Signature-Welten. Aktionen: neu, bearbeiten, duplizieren, inaktiv,
aktivieren, entfernen und archivierte Artikel wieder aktivieren. Vorhandenen
Artikeleditor wiederverwendet. Zugang im Kiosk und unter Produktverwaltung der
Kiosk-Abrechnung; bestehende globale Adminleiste bleibt kompakt. Kiosk-Menüpunkt
auch in der Bibliothek aktiv markiert. Nicht-Admins erhalten keine Verwaltung.

Verleih zeigt Abrechnungseinheit auf Kachel und im Bestelldialog. Einheit Stunde
führt zur Auswahl ganzer Stunden und nachvollziehbarem Gesamtpreis, z.B. 2 h =
8 EUR. Andere Einheiten wie Satz/Nutzung weiterhin frei möglich. Jede gewählte
Einheit wird wie bisher einzeln zum damaligen Preis ins Journal geschrieben;
keine Reservierungs-, Timer-, Rückgabe- oder Kautionsverwaltung eingeführt.

Preis-/Artikeländerung während offener Bestellung: angezeigte Konditionen werden
vor der Buchung gegen den aktuellen Katalog geprüft. Server prüft Preis, Name,
Einheit und Art, sofern vom Client geliefert. Zusätzlich Katalogrevision in der
atomaren Schreibbedingung, damit ein paralleler Preiswechsel nicht dazwischen
rutscht. Geändertes Angebot neu öffnen und erneut bestätigen, keine automatische
Buchung zum geänderten Preis. Produktpflege prüft ihren Ausgangskatalog auch
nach Hintergrundaktualisierung; veralteter Editor überschreibt keine neuere
Adminänderung. Bestehende gecachte Clients bleiben kompatibel.

Archivierung bereits gebuchter Artikel anhand des dauerhaften Journals statt
nur aktiver Mitgliedskonten. Auch Käufe inzwischen inaktiver Mitglieder bleiben
zugeordnet. Clubkatalog bleibt sichtbar, wenn sein ursprünglicher Speicherer
inaktiv wird. Historische Käufe unverändert; unbenutzte Artikel entfernbar.
Archivierte Produkte zählen nicht zur Grenze von 300 aktuellen Artikeln;
Gesamtgrenze 3000. Sortimentsverlauf und Datensicherungen bleiben wirksam.

Einrichtungstool tools/kiosk-library-catalog.mjs: idempotent alter Schlägerverkauf
archivieren, eigenen offenen Bereich Verleih und Artikel padel-schlaeger-verleih
mit 400 Cent / Stunde anlegen. Aktuellen Katalog revisionsgeschützt verändern,
Vorher-/Nachher-Stand historisieren, niemals Buchungsdaten ändern. Vorhandener
Verleihartikel wird bei Wiederholung nicht überschrieben, spätere Preisänderung
bleibt erhalten. Bälle und übriges Sortiment unverändert, über Bibliothek frei
bearbeitbar. Keine neuen Bankfunktionen, Echtabbuchungen bleiben gesperrt.

Prüfung: 13 Server-/Buchungsprüfungen und 2 Einrichtungstests erfolgreich, außerdem
13 Prüfungen gegen das gebündelte Serverartefakt. Chromium/WebKit: komplette
Bibliothek, Suche, Statuswechsel, Kopie/Löschung, gebuchte Artikel archivieren,
Stundenauswahl, Preiswechsel mit erneuter Bestätigung, veralteten Admineditor
abweisen und responsive Darstellung 390/834/1440 in beiden Welten. Bestehende
Abrechnungs-/CSV-/JPG-Abläufe in Chromium/WebKit weiterhin erfolgreich. Service
Worker v356 nimmt das neue Modul auf. Keine Schemaänderung oder Nullstellung.

Live veröffentlicht: Code d046a42, Pages-Workflow 42583324399 erfolgreich.
Worker-Version 3616fed0-d240-4d5c-91e4-62174e7c72d9. Bibliotheksmodul, App,
Synchronisation, lokales Backend, Billing, CSS, Service Worker und veröffentlichte
HTML-Fassung bytegleich geprüft. HTML wird wie vorgesehen ohne lokale rosters-
Einbindung publiziert. Öffentliche Community-Abfrage liefert aktiven Verleih mit
400 Cent und Einheit Stunde. Live-Katalog revisionsgeschützt von 11 auf 12,
Schlägerverkauf archiviert, Vorher/Nachher im Sortimentsverlauf gesichert.
Buchungsbestand vor/nach Einrichtung identisch: 49 Originale, 18.000 Cent brutto,
vier Stornos/Gutschriften mit 600 Cent. Keine künstlichen Live-Käufe angelegt.

## Nutzerbewertung und Abstimmung mit der Buchhaltung · 09.11.2026

Der Nutzer ist mit dem aktuellen Kiosk-Zwischenstand aus Sicht eines normalen
Admins ausdrücklich sehr zufrieden und hält ihn für nahezu livefähig.
Kalender, persönliche und clubweite Abrechnung, Einzelbuchungen, Stornos,
Admin-Gutschriften, CSV und Tagesumsatz als Bild sind als Arbeitsstand akzeptiert.
Kein weiterer Umbau der Oberfläche oder Ausbau zu einer vollständigen
Finanzbuchhaltung ist daraus automatisch abzuleiten.

Arbeitshypothese des Nutzers: Buchhalter/Steuerberater verbucht den Verein
voraussichtlich hauptsächlich anhand von Kontoauszügen und Lastschriftdaten
der Bank. Die App könnte ihm - wie dem Admin - vor allem als nachvollziehbare
Verbrauchsaufzeichnung und Abgleich dienen. Das ist noch keine bestätigte
Arbeitsweise oder Freigabe des Finanzverantwortlichen; der Nutzer bespricht
Rolle und benötigte Übergabedaten persönlich mit ihm.

Die neutrale Prüfung ergab eine gute Einzelbuchungs-/Korrekturhistorie. Offen
bleiben verbindliche Abrechnungsläufe und spätere Korrekturen, Zahlungsabgleich,
passendes Buchhaltungsformat/steuerliche Zuordnung, langfristige Abschluss-
unterlagen und Verfahrensbeschreibung sowie Mandat/Bankübergabe/Vorankündigung.
Zusätzlich zu klären: eingeschränkter Buchhaltungszugang und Einordnung möglicher
Kassenpflichten. Diese Punkte sind Abstimmungsgrundlage, kein Auftrag, jetzt
sämtliche Funktionen zu entwickeln. Erst tatsächlichen Bedarf mit Finanzwart
und Buchhalter klären; einfache bestehende Lösung möglichst beibehalten.

Einseitige A4-Abstimmungsunterlage im TFB-Look mit roter Logovariante erstellt
und visuell geprüft: Projektordner output/pdf/
TFB-Kiosk-Abrechnung-Abstimmung-Finanzvorstand.pdf.
Sie enthält bereits integrierte Funktionen, offene Punkte und den Vorschlag,
einen Beispielmonat von den Käufen bis zum Bankeinzug und Buchhaltungsabgleich
gemeinsam durchzugehen. PDF lokal im Projekt, nicht öffentlich veröffentlicht.

Weiterhin gilt: Echtabbuchungen noch nicht aktiviert. Geplante spätere
Nullstellung vor dem Start erst auf konkreten Auftrag; jetzt keine Buchungen,
Abrechnungen oder Statistiken löschen. Aktueller Live-Stand bleibt v355;
diese Aktualisierung betrifft ausschließlich Projektwissen und Übergabe.

## Neutrale Kiosk-Texte für die fertige Oberfläche · v355 · 09.11.2026

Auf ausdrücklichen Wunsch keine Vorführ-/Testbuchungs-Bezeichnungen mehr in
Kiosk und Abrechnung, einschließlich Vorjahre und leerer Monate. Den Hinweis
unter Meine Abrechnungen/Kiosk-Abrechnung vollständig entfernt. Auch Bierdeckel,
Kaufdialog, Accountstatus, Buchungsfragen, historische Herkunftsangabe und alte
Abrechnungs-/Belegansichten bereinigt. Abrechnungsbetrag statt Vorführbetrag,
Gesamtsumme statt Vorführsumme, keine Kennzeichnung als fiktiver Betrag.
Kiosk-Zustimmung redaktionell neutralisiert; bestehende Version bleibt, keine
zusätzliche Zahlungsfreigabe. Sie erklärt weiterhin zutreffend, dass Buchungen
allein keine automatische Abbuchung auslösen und Zahlungsfreigabe separat erfolgt.

Ausschließlich Oberflächentexte geändert. Buchungsdaten, gespeicherte Historie,
Statistik, Berechnungen und serverseitige Zahlungssperre unverändert. Die spätere
Nullstellung vor dem eigentlichen Start bleibt vorgemerkt und wird erst bei
konkretem Auftrag ausgeführt; keine Daten jetzt zurückgesetzt oder gelöscht.

Syntaxprüfung und Chromium-/WebKit-Prüfung der bestehenden Buchungs-/Export-
abläufe, eigener Abrechnungen sowie eines leeren Vorjahresmonats. Service Worker
v355 sorgt für die aktualisierten Texte.

Live bestätigt: Commit 963111c, Pages-Workflow 42575184215 erfolgreich.
App, Konfiguration, gemeinsame Abrechnung und Service Worker v355 öffentlich
bytegleich mit dem geprüften Stand.

## Klare Stornos und Tagesumsatz mit Bildvorschau · v354 · 09.11.2026

Die gemeinsame Admin-/Mitgliederansicht nennt den Bereich nun „Storno und
Korrekturen im Zeitraum“. Summenkarten: Umsatz ursprünglich, Storno / Korrekturen,
Tatsächlicher Umsatz. Selbst veranlasste 30-Sekunden-Stornos werden knapp mit
Betrag und gespeichertem Zeitpunkt gezeigt; keine importtechnischen Hinweise,
keine doppelte Person/Erfasserangabe. JPG ebenso: Storno −Betrag · Datum/Uhrzeit.
Historische Rohnotizen und Buchungsdaten bleiben unverändert gespeichert.
Bei Admin-Korrekturen bleiben Begründung und handelnde Person sichtbar.
CSV-Bezeichnungen entsprechend vereinheitlicht; bei Mitgliedsstornos keine
technischen Übernahmegründe oder doppelte Bearbeiterangabe exportieren.

Gesicherte Vorführabrechnungen aus der sichtbaren Abrechnung entfernt,
persönlichen zweiten Monatswähler entfernt. Gespeicherte Versionen, Journal,
Sicherung und Wiederherstellung nicht gelöscht oder verändert. Admin kann
weiter freie Zeiträume und Produktverwaltung nutzen; Kalender bleibt Monatswahl.

Tagesübersicht/Tagessumme heißen in der gemeinsamen Ansicht und im Bild
Tagesumsatz. JPG öffnet sofort in der Bildvorschau der App, ohne automatischen
Download. Explizit Bild speichern; Teilen nur bei unterstützter Dateifreigabe.
Keine Zusage, die native macOS-App Vorschau automatisch zu starten. CSV bleibt
Download. Bild lokal im Browser erzeugt, kein Upload oder automatisches Versenden.
Tastaturfokus umfasst Vorschauaktionen, Bildadresse beim Schließen freigegeben.
Profilbild nutzt denselben bereits gewählten Ausschnitt wie der Accountkreis,
nicht das unbeschnittene Original. Datenbild-Porträts im Vorstand zusätzlich
zentriert, feste Bilddateien mit eigenen Ausschnitten unverändert.

Bestehende rückwirkende Admin-Korrektur: Buchung öffnen → Korrektur erfassen.
Voller noch offener Betrag = vollständige Gutschrift; Teilbetrag = Reduzierung.
Ursprüngliche Buchung bleibt erhalten. Betragserhöhungen/weitere rückwirkende
Storno- und Korrekturregeln separat mit dem Nutzer besprechen; jetzt keine neue
Finanzlogik, Migration, Löschung oder echte Abbuchung eingeführt.

Prüfung: 8 Modell-/CSV-Tests, 19 Buchungs-/Fototests. Browserprüfung in Chromium
und WebKit mit Admin und Nicht-Admin: kein automatischer JPG-Download,
Bildvorschau, explizites Speichern, Tastaturbedienung, simuliertes Dateiteilen,
korrekter Fotoausschnitt statt Original, knappe Stornos, geschützte eigene
Abrechnung, responsive Kalender und bestehende Exporte. Historische Versionen
bleiben im Backend nachweisbar, obwohl der Abschnitt nicht mehr angezeigt wird.
Service Worker v354.

Veröffentlicht: Commit 108e24a, Pages-Workflow 42574830822 erfolgreich.
282 Webdateien vorbereitet. Sieben öffentliche Dateien (Billing, Tagesbild,
CSV, App, beide CSS und Service Worker v354) live bytegleich geprüft.

## Einheitliche Mitgliederansicht und Tagesübersicht als JPG · v353 · 09.11.2026

Persönliche Abrechnung war noch durch die alte .view-Regel auf 760px begrenzt.
Nur für die neue gemeinsame Abrechnung diese Begrenzung aufgehoben; Admin- und
Mitgliederrahmen jetzt beide 1120px mit identischer Kalenderbreite und Optik.
Monatsmarkierung auch bei Hover unverändert, Umsatz-Unterstriche mit festen
2px gegen Flex-Schrumpfung abgesichert. Tagesmarkierungen und Schriftgrößen
bei identischem Mitglied/Monat in beiden Ansichten gleich. Keine neue Tabelle
oder Neuberechnung; beide nutzen weiterhin denselben Renderer und Journal.

CSV-Buttons samt Erklärung nur noch in der clubweiten Admin-Abrechnung.
Meine Abrechnungen zeigt auch für einen Admin im eigenen Account keine CSV-
Auswahl. CSV-Aktion zusätzlich im Frontend auf Adminmodus und echte Adminrolle
begrenzt. Eigene Monats-/Tageswerte und andere vorhandene persönliche Funktionen
bleiben; Rücknahmen/Korrekturen, gesicherte Abrechnungen und weitere Monate wurden
inhaltlich nicht umgebaut, Nutzer möchte diese später separat besprechen.

Neuer Button Screenshot als JPG: mit Abstand neben Admin-CSV-Buttons, im
persönlichen Bereich allein. Aktiv für einen ausgewählten einzelnen Tag und ein
Einzelmitglied; Admin mit Alle Mitglieder muss zuerst eine Person wählen.
Mitglied kann nur sich selbst exportieren. Monatsansicht zeigt den Button
zunächst deaktiviert, Tagesauswahl aktiviert ihn. Kein Export einer Vereins-
Tagesliste mit mehreren Personen als vermeintlich persönlicher Screenshot.

JPG enthält Tagesübersicht, Datum, Betrag, Name, Foto/Initialen, chronologische
Positionen und Tagessumme. Rücknahmen/Gutschriften zum jeweiligen Kauf sind
mit ursprünglichem Betrag, Grund, Zeitpunkt und handelnder Person sichtbar,
auch wenn Bildschirmdetails eingeklappt waren. Keine Kalender, Buttons,
CSV-Erklärungen, technischen Buchungsnummern oder Gesprächsnachrichten im Bild.
Das Bild ist als kompakter Datenbeleg gestaltet, keine vollständige Browser-
Screenshotkopie. Normalgröße 1600px breit; dynamische Höhe, für sehr große Tage
adaptive Auflösung statt Abschneiden. Name und Datum im .jpg-Dateinamen.

Lokal im Browser per Canvas/Blob (kiosk-day-image.js), ohne Fremdbibliothek,
Upload, Speicherobjekt auf dem Server oder automatisches Versenden. Kontext,
Person, Daten und Farbwelt werden beim Klick festgehalten; vorhandenes großes
Profilbild über die bestehende geschützte Abfrage, sonst Initialen. Helfer
verweigert gemischte Mitgliedsdaten. Keine Backend-/Datenänderung, Migration
oder Zahlung. Die bestehenden serverseitigen Mitgliedsfilter bleiben wirksam.

Zwei Modellprüfungen: Berliner Tagesgrenzen, chronologische Reihenfolge,
korrigierte Summe, gemischte Mitglieder abweisen, leere Tage ohne fiktive Zeilen.
Chromium/WebKit: echte JPG-Downloads, JPEG-Dateisignatur, Name/Tagessumme und
Korrekturtexte im gezeichneten Bild ohne Bedienelemente, Admin-/Persönlich-
Geometrie 390/834/1440px, Textbegrenzungen und Umsatz-Unterstriche. Separates
Nicht-Admin-Konto mit eigenen Buchungen getestet: kein CSV, keine fremden
Buchungen, aktuelle und vergangene Monatsmarkierungen, eigener Tages-JPG.
Bestehende CSV-/Abrechnungs-/Fotoabläufe weiterhin erfolgreich. Service Worker
v353 lädt das neue Bildmodul vor.


## Buchhalterverständliche CSV ohne Vorführ-/Technikbegriffe · v352 · 09.11.2026

Nutzer hat die exportierte Tabelle in Numbers geprüft und verständliche
Bezeichnungen im echten Look verlangt. Dateiname jetzt TFB-Kiosk-[Exportart]
ohne Vorfuehrung. CSV-Titel ebenfalls ohne Demo-/Vorführkennzeichnung. Keine
Änderung an Vorführbetrieb, Zahlungsfreigabe oder zugrunde liegenden Daten.

Alle Exporte beginnen mit lesbarem Berichtskopf: Titel/Jahr, Auswahl,
Abrechnungszeitraum in deutscher Datumsschreibweise, Erstellt am mit Datum
und Uhrzeit. Uhrzeiten verwenden Europe/Berlin inklusive Sommer-/Winterzeit;
keine UTC-Abkürzung, T/Z-Kennzeichen oder Sekundenbruchteile im Bericht.
Präzise Originalzeitpunkte bleiben im Journal erhalten und bestimmen weiterhin
die Reihenfolge. Metadaten stehen einmal im Kopf, nicht mehrfach pro Buchung.

Einzelbuchungen: genau eine Zeile je Kauf, chronologisch sortiert. Neun Spalten:
Buchungsnummer, Mitglied, Datum, Uhrzeit, Artikel, Einheit, Buchungsbetrag (EUR),
Rücknahmen/Korrekturen (EUR), Abrechnungsbetrag (EUR). Letzterer ist Original
minus sämtliche Rücknahmen/Korrekturen. Gesamter Abrechnungsbetrag darunter.
Die frühere Mischliste von Buchungen und Korrekturzeilen wurde ersetzt.

Separater Nachweisabschnitt Rücknahmen und Korrekturen: Zu Buchungsnummer,
Mitglied, Datum, Uhrzeit, Artikel, Art (Stornierung/Korrektur), Korrekturbetrag,
Begründung, Bearbeitet von. Ausdrücklicher Hinweis, dass die Beträge bereits
oben berücksichtigt sind und nicht nochmals abgezogen werden dürfen.
Technische Quelle/Exportart entfallen; Grund nur noch als klare Begründung
im Nachweisabschnitt. Bearbeitet von benennt den tatsächlichen Akteur, beim
Mitgliedsstorno das Mitglied, bei Admin-Korrektur den Admin.

Jahresabschluss behält zwölf Monatswerte und Jahressumme vor Einzelbuchungen;
Betragsspalte heißt nun Abrechnungsbetrag (EUR). Alle CSV-Zeilen haben neun
Felder, auch Kopf-/Übersichtszeilen; Semikolon, BOM, deutsche Dezimalkommas,
korrekte Maskierung von Anführungszeichen/Zeilenumbrüchen und Formelschutz.
Summen-/Übersichtsteile beim maschinellen Import weiterhin von Einzelbuchungen
trennen. Bereits gespeicherte Dateien behalten ihr altes Format; neue Downloads
verwenden dieses Layout. Jahresabschluss-Freigabe bleibt 1. Januar des Folgejahrs.

Fünf Exportprüfungen erfolgreich: Winter-/Sommerzeit, keine technischen Labels,
korrekte Nettosumme ohne doppelten Korrekturabzug, separate Akteure/Begründungen,
Maskierung/mehrzeilige Texte, Rechte, Zeitgrenzen und Fehlerabbruch.
Chromium/WebKit: tatsächliche Monats-, kumulierte Jahres- und Abschlussdownloads,
Dateiname ohne Vorfuehrung, verständliche Überschriften, enthaltene Datensätze
und bisherige Bedienung geprüft. Keine Backendänderung/Migration/Datenänderung.
Service Worker v352.


## Jahresabschluss erst nach Jahresende, sichtbar gesperrter Button · v351 · 09.11.2026

Nutzer hinterfragt Freigabe des Jahresabschlusses während des noch laufenden
Jahrs und Bedeutung des Korrekturstands. Geklärt: Export ist eine Datei zum
Downloadzeitpunkt; spätere berechtigte Gegenbuchungen können einen neuen
Export verändern, die bereits gespeicherte Datei bleibt unverändert.
Herunterladen selbst verändert oder sperrt keine Buchung. Kein neuer Auftrag
für buchhalterische Sperren, Zahlungsaktivierung oder Datenbereinigung.

Jahresabschluss-Button bleibt sichtbar, ist aber deutlich grau und deaktiviert.
Unter dem Button steht mobil/desktop sichtbar Ab 01.01.[Folgejahr] verfügbar;
für 2026 also 01.01.2027. Die bisherige Freigabe am 31.12. wurde ersetzt:
Auch am 31.12. bleibt das laufende Jahr gesperrt, erst ab 1. Januar folgt der
volle Jahresabschluss. UI und Exportplan erzwingen dieselbe Grenze anhand
des Berliner Tages aus dem Serverbericht. Vorjahre weiterhin sofort verfügbar.
Bis dahin steht Jahr kumuliert für den jeweiligen aktuellen Stand zur Verfügung.

Die dezente graue Sperrdarstellung gilt auch für einen nicht ausgewählten
Monat und während eines laufenden Exportabrufs. Aktive Exportbuttons und die
restliche Kalendergestaltung bleiben unverändert.

Vier Exportprüfungen inklusive 31.12.-Sperre und 01.01.-Freigabe bestanden.
Chromium/WebKit prüfen graue Darstellung, sichtbaren Verfügbarkeitshinweis,
aktuelle Sperre, aktivierte Vorjahre ohne Sperrhinweis und alle bisherigen
CSV-/Abrechnungsabläufe. Keine Backendänderung, Migration, Buchungsänderung
oder Bankaktion. Service Worker v351.


## Monatsabschluss und Aktuelles Jahr · v350 · 09.11.2026

Vergangene Monate zeigen im rechten Kalender unter dem ausgeschriebenen
Monatsnamen fett Monatsabschluss. Vergleich erfolgt nach Berliner Kalender-
monat mit dem aktuellen Monat aus dem Serverbericht; der laufende Monat wird
nicht als abgeschlossen bezeichnet. Das gilt ebenso nach Auswahl eines
Einzeltages aus einem vergangenen Monat, für Club und persönliche Ansicht.

Passender Exportbutton: Monatsabschluss als CSV für vergangene Monate,
Monat als CSV für den laufenden Monat. Dateiname enthält bei vergangenen
Monaten ebenfalls Monatsabschluss. Inhalt, Monatsgrenzen, Auswahl der Mitglieder,
Korrekturen und Rechte bleiben unverändert. Der Download ist ein Bericht zum
aktuellen Korrekturstand und ein aufbewahrbarer Export, keine endgültige
buchhalterische Sperre und kein Ersatz für die vollständige Datenbanksicherung.
Kein Zahlungs-/Einzugsbeginn damit verbunden.

Die obere Pill Übersicht [aktuelles Jahr] heißt jetzt Aktuelles Jahr. Der
gewählte Monat bleibt daneben und die Vorjahre bleiben rechts sichtbar. Große
Jahreszahl, Jahresabschluss und die zuletzt abgestimmten Farben unverändert.

Chromium/WebKit: vergangener Monat mit Monatsabschluss, laufender Monat ohne
diesen Zusatz, passende CSV-Texte und Dateinamen samt geprüftem Downloadinhalt,
Pill Aktuelles Jahr sowie Begrenzungen/Überläufe bei 320/390/834/1440px und
bestehende Abrechnungsabläufe bestanden. Keine neue Berechnung, Backendänderung,
Migration oder Datenänderung. Service Worker v350.

Arbeitscheckout dieser Fortsetzung: /private/tmp/tfb-v350-month-closing,
frisch von origin/main (Dokumentationsstand 6231222) geklont. Die frühere
temporäre Arbeitskopie war nicht mehr verfügbar; andere Dropbox-Änderungen
wurden nicht in die Veröffentlichung übernommen.


## Sofortiger Einstieg für die nächste Sitzung · 08.11.2026 · v349

**Nutzer hat den Zwischenstand bestätigt.** Zuletzt nur Abschlussdokumentation
angefordert. Es gibt keinen offenen Programmierauftrag und keine Freigabe für
echten Einzug oder Kiosk-Reset. Die älteren Abschnitte darunter sind Verlauf;
bei Widersprüchen gilt dieser Einstieg samt aktuellem Projektgedächtnis.

### Bestätigter Live-Stand

- Website: https://joern-kaemper.de/; Club-Abrechnung: `#kioskabrechnung`.
- Letzter Code: `5517800`; Live-Nachweis-Dokumentation: `6a2d4fc`.
- GitHub-Pages-Lauf `42517049131` erfolgreich; Service Worker
  `tfb-kiosk-v349`. Kein Worker-/D1-Deployment seit den UI-/Exportänderungen.
- Schlankes Admin-Menü und aktiver Kiosk-Link; zwei Kalender, direkte aktuelle
  Monatsansicht, sichtbare Jahres-Pills; Vorjahre als Jahresabschluss.
- Fotos/Initialen und Foto-Lightbox; Umlaut-/Mail-Suche und Telefonbuch-Sortierung.
- Chronologische Buchungen, klar zugeordnete Korrekturen, vereinfachte Details.
- Drei CSV-Exporte, Jahresabschluss mit zwölf Monatswerten/Jahressumme vor Details.
- Neueste Farbkorrektur unbedingt erhalten: großer Jahresabschlussbetrag in
  roter Welt schwarz, in gelber Welt gelb auf Signature-Blau.

### Nächster sachlicher Schritt – erst nach Rückmeldung

Finanzwart/Buchhalter und zweiter Admin sollen den vorgesehenen Ablauf abstimmen.
Vorliegende einseitige PDF bleibt lokal verfügbar:
`01 Software/output/pdf/TFB-Kiosk-Abrechnung-Abstimmung.pdf`.
Benötigt: heutiger Einzugsweg/Banksoftware und Importformat, Mandatsumfang und
Zuordnung, Einzugstag/Vorankündigung, verantwortliche Freigabe und Abgleich.
Danach erst konkrete echte Zahlungslogik testen und separat aktivieren.
Bis dahin Vorführdaten und Preise/Historie erhalten; keine echten Forderungen,
Abrechnungsmails, SEPA-Dateien oder automatischen Abbuchungen erzeugen.
Geplanter Echtstart April 2027. Stichtag-X-Bereinigung noch nicht terminiert
oder beauftragt. Kein zusätzlicher Adminzugang für den Buchhalter angelegt.
Künftiger kumulierter Jahresvergleich bleibt vorgemerkt, nicht als aktueller
Umsetzungsauftrag behandeln. Padel-Zahlungsweg ebenfalls offen.

### Technischer Wiedereinstieg

Wesentliche Dateien: `assets/js/kiosk-billing.js`, `assets/css/kiosk-billing.css`,
`assets/js/kiosk-export.js`, `server/cloudflare/kiosk-billing.mjs`.
Admin-Leiste in `assets/js/app.js`/`assets/css/design-preview.css`.
Export liest bestehende geschützte Monatsberichte in Zweiergruppen; keine neue
Jahres-API. Originaljournal, Gegenbuchungen und gesicherte Abrechnungen bleiben
unveränderlich. Jahresabschluss-CSV ist ein Bericht zum aktuellen Korrekturstand,
keine buchhalterische Sperre. Übersichtsteil beim Import von Details trennen.

Prüfungen der jüngsten Version: `node --test tools/test-kiosk-export.mjs`
(vier Tests) und `node tools/test-browser-kiosk-billing.mjs` (Chromium/WebKit),
inklusive Downloads, Jahressummen, Mitgliedsrechten und 320–1440px. Nur erneut
prüfen, wenn neue Änderungen dies rechtfertigen; Dokumentationspflege ohne
Codeänderung erfordert keinen erneuten vollständigen Testlauf.

Arbeitskopie `01 Software` ist umfangreich lokal verändert und im Git-Verlauf
älter als der veröffentlichte Stand. Nicht pauschal committen/pushen. In dieser
Sitzung isoliert auf aktuellem main unter `/private/tmp/tfb-v326-analytics`
gearbeitet, geprüfte Patches gezielt in die Dropbox-Kopie zurückgespielt.
Für neue Arbeit zuerst origin/main abgleichen und isolierten aktuellen Checkout
verwenden. Nur beauftragte Dateien veröffentlichen; vorhandene andere lokale
Änderungen erhalten. Fertige Website-Änderungen direkt deployen, kein weiteres
OK anfordern. Reine Dokumentationspflege nur dokumentieren/synchronisieren.


## Vorjahre als Jahresabschluss mit Monatsübersicht im CSV · v349 · 08.11.2026

Vorjahres-Pill öffnet weiterhin nur die Jahreskachel: rechter Monats-/Tages-
kalender und Einzelbuchungen ausgeblendet, zwölf Monatsbeträge sichtbar.
Unter der großen Jahreszahl steht nun fett Jahresabschluss. Heute entfällt bei
zurückliegenden Jahren auch nach gezielter Auswahl eines historischen Monats.
Die Jahressumme ist größer; laut nachgereichter Nutzerkorrektur in der roten
Welt schwarz, in der gelben Welt gelb auf Signature-Blau. Filter Alle Mitglieder
oder Einzelmitglied gilt unverändert. Historische Monate bleiben für gezieltes
Nachsehen anklickbar; dann öffnet sich der betreffende Monat wieder rechts.

Jahresabschluss-CSV beginnt mit Titel/Jahr, Mitgliedsauswahl und Datenstand,
danach Januar bis Dezember mit jeweils korrigierter Monatssumme und einer
Jahressumme darunter. Anschließend kommen die chronologisch sortierten
Einzelbuchungen und Korrekturen im bisherigen Detailformat. Monatssummen werden
aus denselben exportierten Buchungen und ihrem aktuellen Korrekturstand gebildet,
mit Berliner Kalenderzuordnung. Keine zusätzliche Summenabfrage mit womöglich
abweichendem Stand. Auch leere Jahre enthalten zwölf Null-Monatswerte plus
Null-Jahressumme; keine fiktiven Buchungszeilen. Monats- und kumulierter CSV
behalten ihr Detailformat. Beim maschinellen Import des Jahresabschluss-CSV ist
der Abschnitt Einzelbuchungen separat vom Übersichtsteil zu lesen; Summen und
Einzelwerte sind keine gemeinsam zu addierenden Buchungszeilen.

Die Bezeichnung Jahresabschluss meint hier den Jahres-Export zum Datenstand;
keine endgültige buchhalterische Festschreibung und kein Einzug. Vorführbetrieb
bleibt unverändert. Keine Backend-/Datenänderung oder Migration.

Vier Exportprüfungen: zwölf Monatswerte, korrigierte Monats-/Jahressummen,
Übersicht vor Details, leere Jahresübersicht, bestehende Rechte und Stichtage.
Chromium/WebKit: Jahresabschluss-Titel, Heute/Monatskalender ausgeblendet,
großer Betrag in beiden Welten, responsive Kachelbegrenzungen 320–1440px,
Jahresabschluss-Download mit Auswahl/Übersicht/Gesamtsumme und bisherige
Abrechnungsabläufe erfolgreich. Service Worker v349.


## Klare CSV-Exporte für Monat, kumuliertes Jahr und Jahresabschluss · v348 · 08.11.2026

Überflüssigen Jahresübersicht-Button unter den Buchungen entfernt; die
Jahresnavigation oberhalb der Kalender bleibt. Statt Einzelposten als CSV nun
drei eindeutig beschriftete Exportoptionen: Monat als CSV, Jahr kumuliert als
CSV und Jahresabschluss [ausgewähltes Jahr] als CSV. Sie sind auch in der
Jahresübersicht verfügbar; Monat ist dort deaktiviert, bis ein Monat gewählt
wurde. Die Mitgliedsauswahl gilt für jeden Export (alle oder ein Mitglied).

Monat exportiert immer den ganzen gewählten Monat, auch bei ausgewähltem
Einzeltag; laufender Monat nur bis heute. Kumuliert: 01.01. bis Ende des
gewählten Monats, beim laufenden Monat bis heute. Ohne Monatsauswahl bis heute
im aktuellen Jahr bzw. 31.12. bei einem Vorjahr. Jahresabschluss umfasst
01.01.–31.12. und ist erst ab dem 31.12. des jeweiligen Jahrs aktiviert;
Vorjahre sofort. Genaue Auswahl/Zeiträume stehen unter den Buttons und in den
CSV-Dateinamen sowie den Datenspalten. Leere Platzhalterjahre liefern nur die
CSV-Kopfzeile und keine erfundenen Buchungen.

Die Exporte sind reine Lesevorgänge zum aktuellen Korrekturstand, kein
buchhalterisches Festschreiben/Sperren und kein Einzug. Export enthält die
Buchungen des gewählten Zeitraums einschließlich aller zugehörigen Rücknahmen
und Korrekturen zum Exportstand (auch später erfasste). CSV ordnet Buchungs-
und Korrekturzeilen nach dem tatsächlichen Zeitstempel, enthält handelnde
Person, Quelle, Exportart und Datenstand. Vorführbetrag EUR bleibt der
korrigierte Buchungswert; Korrektur EUR ist separat dokumentiert und darf nicht
nochmals vom bereits korrigierten Vorführbetrag abgezogen werden.

Jahresdaten werden nur für den Download abgerufen; keine lange Jahresliste
auf dem Bildschirm. Wiederverwendet bestehende geschützte Monatsberichte,
maximal zwei Abfragen gleichzeitig; kein neuer Server-Endpunkt oder Migration.
Ein fehlgeschlagener Monatsabruf bricht den gesamten Export ab, kein stiller
Teilexport. Fortschritt angezeigt, parallele Exportklicks abgefangen. Monats-
und Mitgliedsauswahl werden beim Klick festgehalten. CSV schützt Formelzellen,
verwendet UTF-8-BOM/Semikolon und unterscheidbare Dateinamen. Neuer Modulbaustein
assets/js/kiosk-export.js, im Service Worker v348 vorgeladen.

Vier gezielte Modul-/Integrationsprüfungen: Schaltjahr, Stichtage/31.12.,
Jahresdaten über bestehende Monats-API, Club-/Persönlichkeitsrechte, UTC/Berliner
Jahresgrenze, chronologische Korrekturen, Formelzellen und Fehlerabbruch.
Chromium/WebKit: tatsächliche Downloads für Monat, kumuliertes Jahr und
Vorjahresabschluss, korrekte enthaltene/ausgeschlossene Buchungen, drei Buttons,
Jahresabschluss vorzeitig gesperrt, keine Jahresliste, bestehende Abrechnungs-
und Fotoabläufe geprüft. Vorführbuchungen vollständig erhalten.


## Verständliche Einzelbuchungen ohne technische Warntexte · v347 · 08.11.2026

Screenshot zeigte bei einer alten übernommenen Malzbierbuchung den Hinweis
Historischer Bereich nicht gespeichert sowie Preis, UUID und Übernahmehinweis.
Gemeint war lediglich die damals nicht mitgespeicherte Sortimentskategorie;
Artikel, Datum, Zeitpunkt und Preis waren vorhanden. Keine fehlende Buchung.

Anzeige vereinfacht: Nur tatsächlich gespeicherte Produktdetails/Kategorie
werden gezeigt; fehlende Kategorie wird weder als Warnung dargestellt noch aus
dem heutigen Sortiment nachträglich erfunden. Ursprünglicher Betrag erscheint
nur bei einer Buchung mit Rücknahme/Korrektur, damit die Differenz nachvollziehbar
bleibt. Buchungsnummer und Herkunft einer übernommenen Buchung im Admin nur
unter separat aufklappbaren Buchungsdetails; persönliche Ansicht ohne technische
Metadaten. Fragen, Korrekturen, CSV und vollständige Journalwerte bleiben erhalten.

Die Buchungen sind tatsächlich gespeicherte Klicks/Vorführbuchungen; weiterhin
keine echten Forderungen oder Einzüge, gemäß vereinbartem Vorführbetrieb.
Globale Kennzeichnung Vorführung · keine Abbuchungen bleibt sichtbar.
Keine Datenrekonstruktion, Backendänderung oder Migration.

Chromium/WebKit: unkorrigierter Posten ohne ursprünglichen Betrag/technische
Texte, explizit aufklappbare Buchungsnummer im Admin, ursprünglicher Betrag
nach Korrektur, persönliche Ansicht ohne Admin-Metadaten sowie bestehende
Abrechnungsabläufe geprüft. Service Worker v347.


## Profilbild-Vergrößerung und ausgeschriebener Monat · v346 · 08.11.2026

Vorhandene Fotos im Abrechnungskopf, in clubweiten Buchungszeilen und
Suchtreffern sind vergrößerbar. Echte Buttons mit zugänglichem Namen;
Klick/Enter öffnen die bestehende Foto-Lightbox mit Personenname und, sofern
verfügbar, größerem Original über avatarOriginal. Escape/Schließen und
Fokusrückgabe entsprechen der Accountansicht. Initialen ohne Foto bleiben
inert. Suchtreffer besitzen getrennte Foto-/Namensschaltflächen, damit keine
Buttons ineinander verschachtelt werden. Fotoklick in einer Buchungszeile
öffnet die Bildansicht ohne versehentliches Aufklappen der Buchung.

Rechter Monatskalender zeigt ausgeschriebene deutsche Monatsnamen statt
Abkürzungen. Schrift reagiert auf die Kachelbreite über Containermaße, damit
Monatsname und Monatssumme auf Handy/Tablet/Desktop nebeneinander passen.
Die zwölf kleinen Monatsfelder behalten ihre kompakten Abkürzungen.

Zum Buchhalter bestätigt: Mit bestehendem freigeschaltetem Adminzugang kann er
Club-/Einzelmitgliedsmonate und Buchungen prüfen und Monats-Einzelposten als CSV
exportieren. Aktuell hat ein Admin auch alle anderen Verwaltungsrechte; keine
separate Buchhalterrolle angelegt und kein Zugang erteilt. Vorführbetrieb ohne
echte Einzüge unverändert. Diese Rückfrage war keine Freigabe für neue Konten.

Chromium/WebKit: Foto-Lightbox per Klick/Enter, Personenname, Escape/Schließen,
Profilbild/Initialen, Suchtreffer, langer Monatsname und ausreichender Abstand
zur Monatssumme bei 390/834/1440px sowie bestehende Abrechnungsabläufe geprüft.
Keine Backend-/Datenänderung, Migration oder Zahlungsaktion. Service Worker v346.


## Sichtbare Jahres-Pills statt Pfeil im Kalender · v345 · 08.11.2026

Große Jahreszahl ohne Pfeil oder Select. Jahresnavigation steht unter dem
Mitgliedsnamen oberhalb des linken Kalenderblatts: Übersicht des aktuellen
Jahrs, gewählter Monat und rechtsbündig kleinere Jahres-Pills. Aktuell 2025,
2024, 2023; schwarze Schrift und Signature-Outline, gewähltes Jahr markiert.
Klick auf ein Vorjahr zeigt dessen zwölf Monate und Jahressumme. Ohne Buchungen
bleibt alles null, mit Platzhalter-Hinweis und entsprechendem Titel/Aria-Label.
Es werden dafür keine historischen Buchungen oder Abrechnungen erzeugt.

Dynamische Logik: Alle vorhandenen zurückliegenden Buchungsjahre bleiben
anwählbar. Solange weniger als drei existieren, wird mit den jüngsten fehlenden
Vorjahren auf drei ergänzt. Beim Jahreswechsel wandert das abgeschlossene Jahr
in die Historie; echte Buchungsjahre verdrängen Platzhalter, ältere echte Jahre
bleiben erhalten. Übersicht [aktuelles Jahr] führt immer zur aktuellen
Jahresübersicht zurück. Mitgliedsfilter bleibt dabei erhalten. Persönliche und
clubweite Abrechnung verwenden dieselbe Navigation. Responsive Umbruch bei
schmalen Ansichten; Historiengruppe endet bündig mit dem linken Kalenderblatt.

VORGEMERKT, NICHT IMPLEMENTIERT: Sobald mehrere echte Umsatzjahre vorliegen,
zusätzlich grafischer Mehrjahresvergleich der kumulierten Kiosk-Umsätze von
Januar bis Ende Dezember (jede Jahreskurve startet bei null). Nur tatsächliche
Umsatzdaten vergleichen, Platzhalter nicht als reale Historie darstellen.
Dies ist eine spätere Erweiterung; jetziger Auftrag betrifft die Jahres-Pills.

Chromium/WebKit: drei Jahres-Pills, Platzhalterjahr mit zwölf Nullmonaten,
vorhandener historischer Kauf, Rückkehr zum aktuellen Jahr, Kalenderfarben,
Geometrie, Mitgliedsfilter, Profilbilder, CSV und Korrekturen geprüft.
Keine Backend-/Datenänderung oder Zahlungsaktion. Service Worker v345.


## Persönliche Abrechnung mit Profilbild und klarer Kopffarbtrennung · v344 · 08.11.2026

Vor dem ausgewählten Mitglied bzw. dem eigenen Namen steht ein runder Avatar,
bei fehlendem Foto ein Initialenkreis (z.B. JK für Jörn Kämper). Auch Suchtreffer
und Personenzuordnung bei clubweiten Buchungen verwenden den Kreis. Fotos kommen
über die bestehende geschützte memberAvatars-Abfrage; vorhandene Freigabe- und
Prüflogik bleibt erhalten. Nur die in Ansicht/Suche benötigten IDs werden geladen.
Kein Foto notwendig; bei Ladefehler bleiben Initialen sichtbar. Keine neue
Fotoablage oder Speicherung. Suchfeld ohne Beispiel-Platzhalter.

Rote Kalenderköpfe: linke Seite schwarz, rechte Summen und Beschriftungen weiß.
Blaue Kalenderköpfe: linke Jahres-/Monatsangaben weiß, rechte Angaben gelb.
Monatsbeträge auf dem hellen Jahresblatt in der gelben Welt wieder Signature-
Blau für bessere Lesbarkeit; Umsatz-Tagesmarkierungen bleiben Signature-Gelb.
Rote Monatsbeträge bleiben rot. Kalenderlogik und Buchungswerte unverändert.

Chromium/WebKit erfolgreich: Initialen DO und JK, vorhandenes Profilbild,
leeres Suchfeld, Namens-/Umlaut-/Mailtreffer nach Avatarergänzung, Kopffarbwerte,
dunkelblaue Monatsbeträge, Kalendergeometrie und bestehende Abrechnungsabläufe.
Keine Backendänderung, Migration, Datenlöschung, Zahlung oder Mail.
Service Worker v344.


## Chronologische Buchungen, transparente Korrekturen und Kalenderakzente · v343 · 08.11.2026

Buchungen in der Anzeige, im CSV-Export und in der Darstellung gespeicherter
Belege nach echtem Zeitstempel aufsteigend (älteste zuerst, gleiche Zeitstempel
stabil nach Buchungs-ID). Tagesgruppen dadurch ebenfalls chronologisch.
Datenbankabfragen und unveränderliche Originalbelege werden nicht umgeschrieben.

Rücknahmen sind serverseitig auf 30 Sekunden begrenzt. Journal hält Original
plus Gegenbuchung mit actor_id/source/reason/created_at fest; Admin-Korrekturen
haben ebenfalls Akteur und Begründung. Nun zusätzlich eine personenbezogene
Einzelliste im Bereich Rücknahmen und Korrekturen: Art, Produkt, gebuchte Person,
erfassende Person, Zeitpunkt in Berlin, Betrag und Grund. Bei importierten
Vorführ-Rücknahmen war der ursprüngliche Zeitpunkt nicht gespeichert; die
vorhandene Kennzeichnung dazu bleibt unverändert.

Für vergangene Monate lautet der Summenhinweis Monatssumme / vorgesehener
Abbuchungsbetrag. Bewusst kein tatsächlicher Einzugsstatus: Zahlungsweg und
Rhythmus sind noch offen, alle Daten bleiben Vorführung. Laufender Monat bleibt
Monatssumme. Einzelmitglied-/Clubwerte folgen denselben korrigierten Aggregaten.

Admin-Leiste: Außenabstand Weltwahl zu Verwaltungsbuttons 12px gegenüber 4px
zwischen den Verwaltungsbuttons (dreifach). Kalenderkörper: Monatsnamen und
Positionshinweise schwarz, Monatsbeträge Signature-Gelb/Rot. Umsatz-Tage mit
Signature-Zahl und Unterstrich markiert; nur positive Nettoumsätze markiert.
Auswahl weiterhin als dezenter Rahmen erkennbar. Rote Kalenderköpfe: große
Jahres-/Monatszahl und Beschriftungen schwarz, Summen weiß. Gelbe Welt behält
lesbare Akzente auf Signature-Blau.

Chromium/WebKit: frühere Buchung vor späterer, Korrekturliste mit handelnder
Person, historische Monatsbeschriftung, neue Farbwerte und Umsatz-Unterstriche,
Abstand, Rollen und bestehende Abrechnungsabläufe geprüft. Neun Serverprüfungen
zu Journal, 30-Sekunden-Rücknahme, Historie, Berechtigungen, Summen und
Wiederherstellung erfolgreich. Keine Backendänderung, Migration, Datenlöschung,
Bankaktion oder Mail. Service Worker v343.


## Aktive Admin-Kachel, Umlautsuche und direkter Monatsstart · v342 · 08.11.2026

Aktueller Admin-Seitenlink mit aria-current=page und Signature-Farben:
Kiosk/Statistik/Partner in Blau mit gelber Schrift in der gelben Welt bzw.
Signature-Rot mit Weiß in der roten Welt. Kompakte Menüstruktur bleibt.

Nach Screenshot echte Suchursache korrigiert: NFD plus Entfernen der
Akzentzeichen hatte Kä zu Ka gemacht und damit Katharina/Katja/Annika usw.
einbezogen. Suche normalisiert jetzt wie Dating 2.0 nach NFC und erhält ä/ö/ü.
Lokale Namens-Treffer sofort, zusätzlich derselbe geschützte Namenssuchdienst
wie Dating. Bei Eingaben mit @ oder Punkt werden die hinterlegten Mailadressen
über den bestehenden Admin-Lesezugang exakt als Teiltext verglichen, weil der
allgemeine Suchdienst Satzzeichen im Suchtext vereinfacht. Keine öffentlichen
Mailadressen, keine neue API oder Berechtigung. Antwortversion und Prüfung des
noch verbundenen Eingabefelds verhindern überholte Treffer nach Eingabewechsel.

Die native Jahresauswahl liegt transparent über einer sichtbaren Jahreszahl
mit eigenem Pfeil. Dadurch kein Abschneiden großer Ziffern durch native
Select-Textmaße; Auswahl und Tastaturbedienung bleiben erhalten.
Beim Öffnen der Club- und persönlichen Abrechnung sind der laufende Monat,
sein Tageskalender und seine Buchungen sofort sichtbar. Andere Monate weiterhin
anklickbar; Jahresübersicht weiterhin als Rückweg verfügbar.

Chromium und WebKit: Kä (inklusive kombiniertem Unicode-Umlaut) findet Kämper
und keine Ka-Namen; KE/Jan bleiben geprüft; vollständige E-Mail mit Punkt und @
findet den korrekten Namen. Automatischer Monatsstart in beiden Ansichten,
Jahreszahl innerhalb der Kopfbegrenzung bei Handy/Tablet/Desktop, aktives Menü
in beiden Farbwelten sowie Korrekturen, CSV und Archive erfolgreich geprüft.
Keine Backend-/Datenänderung oder echte Zahlung. Service Worker v342.


## Kompakte Verwaltung und quadratische Kalender · v341 · 08.11.2026

Globale Admin-Leiste verkleinert: Kühle/Warme Welt kompakter, daneben Splash,
Home, Partner, Mitglieder, Statistik, Kiosk und ein SVG-Sicherungssymbol mit
zugänglichem Namen/Tooltip Datensicherung. Bearbeiten-/Verwalten-Zusätze und
App-Anleitung entfernt; die Anleitung im Account bleibt. Eine Zeile bei
verfügbarem Platz, auf kleinen Displays natürliche Umbrüche. Kioskseite enthält
keine doppelte Kiosk-Abrechnungs-/Artikelarchiv-Leiste mehr. Artikelarchiv bleibt
innerhalb der Abrechnung unter Weitere Zeiträume und Verwaltung erreichbar.

Jahres- und Monatskalender sind gleich große quadratische Blätter im TFB-Look:
links große Jahreszahl, Jahressumme und zwölf typografische Monatsfelder in
3x4-Anordnung. Nach Monatswahl rechts derselbe Rahmen mit großem Monatsnamen,
Monatssumme und Tagesraster. Unter 761px untereinander. Vor der Auswahl wird nur
das Jahresblatt angezeigt. Signature-Blau/Gelb oder Rot/Weiß; ausgewählter
Monat und Tag bleiben hervorgehoben. Buchungen und Namensdarstellung erhalten.

Suche: nur zusammenhängende Teilzeichenfolgen, ohne Beachtung der Schreibweise;
Suchfeld ohne Browser-Autokorrektur. Zusätzlich wird auch die native
Mitgliedsauswahl auf Treffer eingeschränkt, solange ein Suchtext vorliegt.
Die gesamte Auswahl bleibt nach Löschen des Suchtextes wieder verfügbar.
Kiosk-Mitgliedsauswahl und Mitgliederverwaltung sortieren mit deutscher
Telefonbuch-Kollation: ä wie ae, daher Kämper vor Kaufmann.

Chromium/WebKit: KE/Jan mit gezielten passenden und unpassenden Testnamen,
Kämper/Kaufmann-Reihenfolge, Rollen, kompakte Admin-Leiste auf allen Bereichen,
Kalenderquadrate/-gleichheit nebeneinander bei 834/1440px sowie untereinander
bei 390px, Textbegrenzungen und mobile Überläufe geprüft. Abrechnungsabläufe,
Korrekturen, CSV und Archive weiter erfolgreich. Keine Backendänderung,
Migration, Datenbereinigung, echte Zahlung oder E-Mail in dieser Version.
Service Worker v341.


## Kalender-Abrechnung und leere Dublette bereinigt · v340 · 08.11.2026

Ersetzt die lange v339-Monatsliste: kompakter Kalender mit Jahresauswahl
(aktuelles Jahr vorausgewählt), zwölf Monatskacheln mit Betrag und Markierung
des laufenden Monats. Künftige Monate deaktiviert. Jahresbetrag im Kopf, Heute
als Schnellzugriff. Monatsklick zeigt Tageskalender und gruppierte Buchungen;
Tag wählt nur dessen Käufe, Ganzer Monat setzt zurück. Übersicht-Button erhält
die Jahres- und Mitgliedsauswahl. Vorjahre bei vorhandenen Daten auswählbar.

Admin: Alle Mitglieder voreingestellt, zusätzlich sofortige Namenssuche neben
der Auswahl (Teiltext, Groß-/Kleinschreibung und Umlaute normalisiert;
Tastaturauswahl über Pfeil/Enter, Escape schließt). Ausgewählter Name fett im
Signature-Kopf. Bei Einzelmitglied entfällt der wiederholte Name am Kauf,
in der Clubgesamtansicht bleibt die Zuordnung sichtbar. Datum/Uhrzeit inline
hinter dem Artikel; Details weiterhin aufklappbar. Persönliche Abrechnung nutzt
denselben Kalender. Blau/Gelb bzw. Signature-Rot/Weiß für Kalender und Rückweg.

Explizit beauftragte Live-Datenbereinigung: Der zweite Jörn-Kämper-Eintrag war
bereits inaktiv, ohne Login, Käufe, Abrechnungen, App-Datensätze, Sessions,
Zugriffsmetadaten oder Teams. Nach lokaler Sicherung und bedingter Löschung
wurde genau dieser eine leere Datensatz entfernt. Aktiver Adminzugang und seine
49 Kiosk-Einträge danach unverändert bestätigt. Keine Buchung gelöscht,
keine Zusammenlegung von Finanzdaten, kein Zahlungs-/Mailaufruf. Keine Migration
oder Backendänderung erforderlich. Die Importlogik aus v324 ordnet bereits nach
eindeutigem Name/E-Mail-Paar zu; eine fehlende Mitgliedsnummer erzeugt dort kein
neues Konto. Cloudflare-Lesezugriff funktionierte mit automatischer
Kontoerkennung; keine gespeicherte Konfiguration oder Zugangsdaten geändert.

Chromium/WebKit: Mitgliedersuche und Abwahl, persönliche/Clubansicht,
Jahreswechsel mit historischem Kauf, Monats-/Tagesfilter, Signature-Farbwerte,
Korrekturen, CSV, Monatsarchive und 320–1440px geprüft. Admin-Rollenprüfung
unverändert erfolgreich. Vorführbetrieb und alle Käufe bleiben erhalten.
Service Worker v340.


## Clubweite Kiosk-Abrechnung und klare Jahresliste · v339 · 08.11.2026

Eigene Verwaltungsseite #kioskabrechnung, von jeder Seite über die zentrale
Admin-Leiste erreichbar, direkt nach Clubstatistik. Clubstatistik zählt
Website-Nutzung; Kiosk-Abrechnung zeigt Käufe des gesamten Clubs mit
Mitgliedsfilter. Persönliche Abrechnungen bleiben davon getrennt. Direkter Link
und Neuladen erhalten die Verwaltungsseite; normale Mitglieder sehen dort keine
Clubdaten. Die bisherige Kiosk-Schaltfläche führt ebenfalls zur neuen Seite.

Für Club und Einzelmitglied: Heute als Schnellzugriff, danach Januar bis
Dezember in chronologischer Reihenfolge. Laufender Monat markiert, künftige
Monate deaktiviert, leere vergangene Monate mit 0 Euro sichtbar. Jahressumme
unter der Liste. Vorjahre nur bei vorhandenen Buchungen als eigener aufklappbarer
Bereich. Monat öffnet Tage und Einzelkäufe mit Namen im Admin, Artikeln,
Zeitpunkt, Betrag und Tagessummen. Details/Korrekturen/CSV bleiben erhalten.
Keine Backendänderung, Migration, Datenlöschung oder echte Abbuchung.
Service-Worker v339. Chromium/WebKit prüfen Navigation, Rollen, Monatsliste,
Preis-Historie, Korrekturen, Monatsversionen und CSV sowie 320–1440px Breite.


## Übersichtliche Abrechnung nach Zeitraum - 08.11.2026 · v338

Nutzer hat den flachen Abrechnungsbereich aus v337 als unübersichtlich bewertet
und den sofortigen Umbau mit gemeinsamer Hierarchie für Mitglieder und Admin
beauftragt. Diese Darstellung ersetzt die alte flache Einstiegsliste.

Startansicht: klickbare Beträge für Heute, laufender Monat, vergangener Monat,
aktuelles Jahr und Vorjahr. Darunter vergangene Monate des laufenden Jahres mit
Buchungen sowie weitere ältere Jahre bei vorhandenen Daten. Keine Einzelposten
auf der Startansicht. Jahresauswahl zeigt ausschließlich Monatsbeträge und
Jahressumme; laufendes Jahr nur bereits begonnene Monate, frühere Jahre zwölf.
Monatsauswahl zeigt nach Berliner Kalendertagen gruppierte Einzelkäufe mit
Tagessummen und Monatssumme darunter. Heute öffnet nur die Tagesbuchungen.
Übersicht-/Jahresnavigation erlaubt Rücksprung ohne verschachtelte Jahreslisten.

Admin hat dieselbe Hierarchie und zusätzlich Mitgliedsauswahl (alle oder ein
Mitglied). Erlaubnisse weiterhin serverseitig; Mitglieder sehen nur ihre Werte.
Neue reine Lese-Endpunkte /app/kiosk/overview und /admin/kiosk/overview liefern
Tages-/Monats-/Jahresaggregate aus Journal und Gegenbuchungen. Jahresansicht lädt
keine jährlichen Einzelpositionen. Berliner Tages-/Jahresgrenzen geprüft;
Korrekturen werden in allen Summen identisch berücksichtigt. Datumsformatter
serverseitig wiederverwendet. Keine neue Migration oder Datensatzänderung.

Vorführhinweis kompakt und aufklappbar. CSV und Jahresnavigation im Detail;
Original-/Korrekturbeträge und gesicherte historische Monatsversionen eingeklappt.
Versionen nach ausgewähltem Monat gefiltert. Freie Zeiträume, letzte sieben Tage,
Produktarchiv und Sortimentsverlauf unter Weitere Zeiträume und Verwaltung.
Berechtigte Korrekturen, Fragen/Antworten und druckbare Belege bleiben erhalten.
Mitgliederansicht hält die gewählte Ebene bei Neurendern; überholte parallele
Leseantworten überschreiben die aktuelle Navigation nicht.

22 Serverprüfungen für Abrechnung, Synchronisierung und Gastrechte bestanden.
Chromium/WebKit: Jahr ohne Einzelposten, Monat mit Tagesgruppen, Zurücknavigation,
Preis-/Artikelhistorie, Gutschrift, Versionsstände, Mitgliedsansicht, Rückfrage,
CSV/Beleg und 320/390/834/1440 px bestanden. Start- und Jahresansicht visuell geprüft.
Worker-Dry-Run bestanden; Service Worker v338. Details RELEASE-v338.md.

Vorführbuchungen und bestehende Abrechnungsstände bleiben ausdrücklich erhalten.
Keine echten Forderungen, Abbuchungen, Abrechnungsmails, Mandatsaktivierung oder
Reset. Offene Entscheidungen aus der Finanzwart-Abstimmung und das geplante
Startdatum April 2027 bleiben unverändert. PDF-Abstimmungsvorlage weiterhin gültig.

Live veröffentlicht: Quellstand 632e44e, Pages-Lauf 42486845376 erfolgreich,
Worker a26f8324-a658-4956-bb57-d964ff44304e, Service Worker v338.
Öffentlich ausgelieferte Hierarchie-JS, CSS und Cacheversion geprüft. Keine
Migration oder Datenänderung erforderlich; keine Live-Testbuchungen erzeugt.
Lokaler Projektordner durch gezielten Patch aktualisiert; übrige Änderungen
und die PDF-Abstimmungsvorlage erhalten.

## Tagesabschluss und nächster Einstieg - 08.11.2026

**Verbindlicher Abschlussstand:** Die Sitzung ist beendet. Kiosk und Abrechnung
laufen weiterhin ausschließlich als Vorführung. Keine echten Forderungen,
Abbuchungen, Zahlungsaktivierung oder Abrechnungsmails. Kein weiterer Reset.

### Erledigt und veröffentlicht

- Letzter App-Stand v337: Produktarchiv, Preis-/Namensschutz alter Buchungen,
  unveränderliches Journal, nachvollziehbare Rücknahmen/Gutschriften, gesicherte
  Vorführmonate mit Versionen, persönliche Historie, CSV/druckbare HTML-Belege
  und buchungsbezogene Fragen/Antworten. Zugang unter Kiosk im Admin-Modus.
- Quelle 25c12fb, Pages-Lauf 42479337447 erfolgreich, Worker
  2d83e402-b772-4348-bedd-4f34699b7d5f, Service Worker v337. Migration 0013
  installiert. Technische Einzelheiten und Prüfungen: RELEASE-v337.md.
- Letzter dokumentierter Erhaltungsabgleich: 48 vorhandene Vorführpositionen,
  16.550 Cent ursprünglicher Gesamtwert, vier bestehende Rücknahmen; unverändert
  übernommen. Dies ist ein Abnahmestand, kein laufender Live-Zähler.
- Statistik wurde separat am 08.11.2026 um 12:36:33 Uhr Berlin auf null gesetzt.
  Dies war KEIN Reset der Kiosk-/Abrechnungsdaten. Finanzdaten bleiben erhalten.

### Einseitige Vorlage zur Abstimmung

Fertiges, visuell geprüftes PDF: **TFB-Kiosk-Abrechnung-Abstimmung.pdf**.
Lokaler Projektpfad (nicht als öffentliche Website-Datei veröffentlicht):
`01 Software/output/pdf/TFB-Kiosk-Abrechnung-Abstimmung.pdf`.
Genau eine DIN-A4-Seite; TFB-Logo in Blau/Gelb. Inhalt: heutiger Vorführbetrieb,
Informationen für Mitglieder und Finanzverwaltung/Buchhalter, Schutz historischer
Buchungen bei Sortimentspflege, vorgeschlagener Monatsablauf, offene Bank- und
Mandatsfragen sowie der spätere kontrollierte Stichtag X. Nutzer will die Vorlage
mit zweitem Admin und Buchhalter/Finanzwart besprechen. Kein Versand durch uns.
Die App wurde für die PDF-Erstellung nicht geändert oder erneut deployed.

### Vorläufiger Stopp bei der echten Abrechnung

Nutzer will derzeit NICHT weiter ins Detail gehen oder den echten Bankeinzug
programmieren lassen. Zuerst beschreibt Buchhalter/Finanzwart, wie der heutige
Abbuchungsauftrag korrekt in die App übertragen werden soll. Dafür klären:

1. Bisherige Bank/Vereinssoftware und Einreichungsweg; benötigtes Import-/Bankformat
   und zuständige Person für Freigabe und Zahlungsabgleich.
2. Verwendbare SEPA-Mandate einschließlich Reichweite für Kioskkäufe und nötige
   Zahler-/Konten-/Mandatszuordnung. App-Zustimmung ist keine Bankanbindung.
3. Einzugstag, vereinbarte Vorankündigungsfrist und zulässiger Informationsweg.
   Die alte Anzeige „Einzug am 5.“ ist keine freigegebene Vorgabe mehr.
4. Benötigte Monats-/Einzelpostenexporte, Kontierungen und Aufbewahrungsregeln.

Erst nach diesen Angaben den echten Ablauf festlegen, gemeinsam testen und
separat aktivieren. Keine stillschweigende Übernahme bisheriger Demodaten als
Forderungen. Keine kostenpflichtige Zahlungs-/Mailanbindung ohne passende
Entscheidung. Padel-Zahlungsweg (Stripe oder ggf. Lastschrift) weiterhin offen.

### Späterer Stichtag X - noch nicht beauftragt

Nutzer bereinigt bis dahin das gewünschte Produktsortiment. Anschließend sollen
bisherige Vorführbuchungen und Vorführabrechnungen aus der aktiven App verschwinden,
damit ein klarer Start mit null erfolgt. Konten, Einstellungen und das bereinigte
Sortiment bleiben erhalten. Das umfasst auch abhängige Demo-Journal-/Korrektur-/
Archiv-/Fragedaten; keinen verwaisten Zustand hinterlassen. Die gesonderte
Statistik-Resetdatei ist hierfür ausdrücklich NICHT geeignet.

Kein fester Termin, kein automatischer Job und kein Kiosk-Reset ausgeführt oder
vorab freigegeben. Für die spätere Bereinigung ist ein gezielter, überprüfter
Operatorablauf mit Sicherung und ausdrücklich benanntem Stichtag erforderlich;
aktuelle Unveränderlichkeitssperren schützen das Journal. Frühere Sicherungen
werden nicht beiläufig gelöscht. Geplanter App-Start bleibt April 2027.

### Arbeitsstand für die Fortsetzung

Die veröffentlichten Änderungen und Nachweise liegen in GitHub main. Der lokale
Projektordner enthält zusätzlich ältere, unveröffentlichte Änderungen; nicht
pauschal bereinigen, überschreiben oder pushen. Bisherige isolierte Arbeitskopie:
`/private/tmp/tfb-v326-analytics`. Diese Tagesabschluss-Änderung betrifft nur
Dokumentation; keine neue App-Version, Migration oder Veröffentlichung nötig.

## Produktarchiv und vorbereitete Kiosk-Abrechnung – 08.11.2026 · v337

Nutzerfreigabe: Produktpflege und Abrechnung vorbereiten und direkt deployen.
Vorführbuchungen ausdrücklich erhalten. Echtstart April 2027; Zahlungswege und
Einzugstermin klärt der Vorstand. Keine Zahlungsaktivierung, SEPA-Datei, Stripe-
Verarbeitung, automatischen Monatsforderungen oder Abrechnungsmails implementiert.
Padel unverändert; gemeinsamer Kiosk später vorgesehen, Zahlungsadapter noch offen.

Neue additive Migration 0013: kiosk_entries, kiosk_adjustments, kiosk_statements,
kiosk_catalog_history und kiosk_messages. Originale, Gegenbuchungen, Monatsstände,
Sortimentsverlauf und Rückfragen gegen UPDATE/DELETE geschützt. Keine Löschung.
Bestehende zentrale item-Datensätze werden idempotent ins Vorführjournal übernommen,
inklusive bereits zurückgenommener Positionen. Namen/Preise/Zeitpunkte bleiben aus
dem Original; fehlende historische Kategorie/Einheit wird nicht erfunden. Legacy-
Stornozeit explizit als unbekannt dokumentiert. Neue Käufe speichern zusätzlich
Zusatztext, Kategorie, Einheit und Verkauf/Verleih. Alle Positionen mode=demo.

Artikelpflege: „Aus Sortiment entfernen“. Bereits verwendete Artikel archivieren,
unverwendete aus dem aktuellen Katalog entfernen. Bei fehlendem vorherigem
Katalog gilt der serverseitige Standardkatalog als Ausgangsstand. Archivierte
Artikel nicht bestellbar, gezielt wieder aktivierbar. Sichtbarkeit bleibt separat.
Preis-/Namensänderungen gelten nur für neue Käufe. Sortimentsstände mit Bearbeiter
und Zeit unveränderlich dokumentiert. Verleiheinheit frei benennbar, keine
Lager-/Rückgabe-/Kautionsverwaltung. Bestehendes Sortiment nicht bereinigt.

Im Kiosk unter Admin: Kiosk-Abrechnung und Archivierte Artikel. Die globale
Admin-Leiste mit sieben Buttons bleibt unverändert. Monats-/Mitgliederfilter,
letzte sieben Tage und Datumsbereich; alle Mitglieder höchstens drei Monate,
ein Mitglied bis zwei Jahre pro Abruf. Originalbetrag, Korrekturen und Nettosumme,
aufklappbare Einzelpositionen mit Buchungsnummern. Begründete Teil-/Vollgutschriften
mit Betragsgrenze und Idempotenz; Originale bleiben erhalten. Synchronisierte
Nettobeträge aktualisieren den Bierdeckel. Mitglied sieht nur eigene Daten.

Vorführmonat sichern: alle oder ausgewähltes Mitglied. Deterministische Prüfsumme
verhindert doppelte Versionen; nach finanzieller Änderung neue Version statt
Überschreiben. Persönliche Abrechnungen unter dem bestehenden Account-Zugang,
Monatswahl, gesicherte Versionen und detaillierte Belege. CSV für Einzelpositionen,
HTML-Beleg mit druckbarer Darstellung/PDF über Browser. Keine amtliche Rechnung
oder behauptetes DATEV-Format. Persönliche Fragen zur Buchung und Adminantworten
bleiben an der Position, ohne E-Mail. Nachrichten ändern keine Abrechnungsversion.
Aktuelle Verwaltung darf Finanzdaten sehen; gesonderte Kassenwartrolle noch nicht
vorhanden. Echte Bankfunktionen serverseitig ausdrücklich gesperrt.

Freigabetext tfb-kiosk-preparation-v1: Vorführbetrieb/keine echte Forderung.
Bisherige v3-Freigaben bleiben für Demo gültig; keine Umdeutung in neue Mandate.
Angekündigter Einzug am 5. aus Deckel/Account/Abrechnung entfernt. Spätere echte
Zahlungsfreigabe separat. Unbelegte lokale Demo-Monatssummen sind kein zentrales
Abrechnungsjournal; die neue Historie basiert ausschließlich auf gespeicherten
Einzelpositionen. Kein automatischer Reset und keine Umstellung alter Daten auf live.

Technische verschlüsselte Vollsicherung umfasst alle neuen Tabellen; unabhängige
Wiederherstellung mit Journal, Gutschriften und Monatsständen geprüft. Inhaltliche
Website-Snapshots sind weiterhin keine vollständige Mitglieder-/Finanzsicherung.
40 Serverprüfungen und Chromium/WebKit: Preiswechsel, Verleiheinheit, Entfernen/
Wiederherstellen, Korrektur, unveränderliche Monatsversionen, persönliches Archiv,
CSV/Beleg, Rückfrage sowie 320/390/834/1440 px bestanden. Worker-Dry-Run bestanden.
Migration zuerst, Worker danach, erneute idempotente Übernahme zum Schließen des
Deploy-Zeitfensters. Service Worker v337. Details RELEASE-v337.md.

Live veröffentlicht: Quellstand 25c12fb, Pages-Lauf 42479337447 erfolgreich,
Worker 2d83e402-b772-4348-bedd-4f34699b7d5f, Service Worker v337.
Vorführdaten lesend abgeglichen: weiterhin 308 Mitglieder, 147 App-Datensätze,
48 ursprüngliche Einzelpositionen. Neues Journal: ebenfalls 48 Positionen mit
16.550 Cent ursprünglichem Gesamtwert, vier bereits bestehende Rücknahmen.
Keine live-Einträge, keine künstlichen Vorführmonatsstände oder Fragen angelegt.
Zweite additive Migration schrieb null Zeilen: keine Doppelübernahme.
Öffentlich ausgelieferte Kiosk-JS/CSS, App, Freigabetext und Cacheversion geprüft.
Keine Live-Testkäufe, Korrekturen, Produktänderungen oder echten Mails ausgelöst.
Benutzerbrowser war nicht als Browser-Verbindung verfügbar; die vollständige
UI-Abnahme erfolgte mit echten lokalen Worker-Fixtures in Chromium/WebKit.
Bestehender Projektordner mit gezieltem Patch aktualisiert; dessen zusätzliche
Index-/Corporate-Einbindungen und sonstige unveröffentlichte Änderungen erhalten.

## Statistik-Neustart und Sicherung der Zähler – 08.11.2026 · v336

Auf ausdrücklichen Nutzerwunsch einmaliger Neustart der gesamten Clubstatistik.
Operator-Datei operations/reset-usage-2026-11-08.sql leert nur usage_nc_ und frühere
usage_-Messdaten inkl. Dedup-/Sessionstatus und setzt simple_enabled_at,
splash_started_at, audience_split_started_at und reset_at auf denselben Zeitpunkt.
Keine Migration und niemals automatisch beim Deployment ausführen. Keine Mitglieder,
Kioskdaten, Chats, CMS-Inhalte oder Partnerzahlen löschen. D1-Time-Travel-Punkt
vor Neustart: 00000123-00000058-0000511d-9bf73bb2c78154a57088a43ea8c5fd00.
Kein privater Datenbankexport. Historische Sicherungen werden nicht gelöscht.
Messbeginn in der Übersicht jetzt mit Berliner Uhrzeit, reset_at im CSV dokumentiert.
Splash/Home starten gemeinsam; direkte Home-Aufrufe, weitere Home-Besuche oder
Abbruch auf der Splash können weiterhin zu unterschiedlichen Aufrufzahlen führen.
Die technische AES-GCM-Datenbanksicherung enthält bereits sämtliche Statistik-
tabellen. Zusätzlich enthalten neue manuelle/tägliche/monatliche/safety-Snapshots
und der aktuelle Website-Download einen konsistenten anonymen Statistikstand in
statistics.tables; ein SQLite-Lesevorgang für die sieben Aggregat-/Metatabellen.
Keine Mitglieds-/Netz-/Session-HMACs oder Ereigniskennungen im Inhaltspaket.
Ältere Sicherungen werden nicht rückwirkend mit aktuellen Zählern beschriftet.
Seitenwiederherstellungen übernehmen ausschließlich Inhalte und setzen Zähler
nicht zurück; komplette Datenbankwiederherstellung bleibt Betreiberaufgabe.
Sicherungshinweis und Download-Bestätigung entsprechend ergänzt. Keine neue
Datenbankstruktur. Kiosk-Abrechnung ausdrücklich für den nächsten Schritt offen.
19 Serverprüfungen inkl. Zählerreset, CMS, Statistik, verschlüsselter Sicherung,
unabhängiger DB-Wiederherstellung und unbeeinflusster Zähler bei Inhalts-Restore
bestanden; Browser-CMS-Test mit ZIP-Export/Import inklusive Statistik bestanden.
Worker-Dry-Run erfolgreich. Service Worker v336. Details RELEASE-v336.md.

Live veröffentlicht: Quellstand 8fa13cc, Pages-Lauf 42476465818 erfolgreich,
Worker 7a6ec5bc-c923-41b4-ab3b-442c683c9e21, Service Worker v336.
Einmaliger Reset am 2026-11-08T11:36:33.765Z = 08.11.2026, 12:36:33 Berlin.
Reset-Bookmark: 00000124-00000006-0000511d-cfaf7d763af4d5175d5e46b67d94fc8b.
Lesende Live-Kontrolle bestätigt alle elf Statistik-/Dedup-Tabellen leer und
sämtliche Startmarken identisch. Vorher/nachher unverändert: 308 Mitglieder,
147 App-Datensätze, 16 CMS-Dokumente. Kein Live-Testaufruf nach dem Nullsetzen.
Öffentliche Dateien für Sicherungshinweis, genaue Startzeit und v336 bestätigt.
Die erste Kontrollabfrage nutzte zu viele UNION-Terme für D1; nach erfolgreichem
Reset nur lesend korrigiert geprüft, den Reset ausdrücklich nicht wiederholt.

## Einheitliche Admin-Leiste auf allen Seiten – 08.11.2026 · v335

Bei eingeblendeten Admin-Werkzeugen steht die Farbwelt-Auswahl immer in der ersten
Zeile. Darunter links beginnend und in fester Reihenfolge: Splash bearbeiten,
Home bearbeiten, Partner verwalten, Mitglieder verwalten, Clubstatistik,
App-Anleitung, Sicherungen. „Home bearbeiten“ ist seitenunabhängig sichtbar und
nutzt die vorhandene direkte Navigation in den Home-Editor. Flex-Umbruch der
Verwaltungsbuttons innerhalb der zweiten und weiterer Zeilen bei kleiner Breite.
Kiosk zeigt die Leiste auch vor der eigenen Lastschriftfreigabe eines Admins.
Seitenbezogene Bearbeitungsfunktionen unten bleiben auf ihrer jeweiligen Seite;
kein zusätzlicher Home-Stift unten in Kiosk/Chat usw. Keine Änderung an Rollen,
Speicherung oder API. Nach Reload bleibt die Admin-Leiste zunächst ausgeblendet.
Bestehender Admin-Test auf realistische lokale Worker-/CMS-Fixtures aktualisiert.
Chromium/WebKit: identische sieben Buttons auf Home, Kiosk, Chat, Aktuell, Sport,
Club und Dating 2.0; 390/834/1440 px, feste zweite Zeile, linksbündiger Beginn,
kein horizontaler Überlauf. Home-Editor von Dating 2.0 aus tatsächlich geöffnet;
Ein-/Ausblenden, Rolle nach Session-Refresh, Reload und gewöhnliches Mitglied
geprüft. Service Worker v335. Details RELEASE-v335.md.

Live veröffentlicht: Quellstand a5df1fa, Pages-Lauf 42475809621 erfolgreich,
Service Worker v335. Öffentlich ausgelieferte app.js, design-preview.css und
sw.js geprüft. Auch der bestehende Projektordner besteht den erweiterten
Admin-Test; dessen bereits angepasste lokale Fixture-Integration bleibt erhalten.

## Splash in der Bereichstabelle und historische Diagrammjahre – 08.11.2026 · v334

Splash steht als erste Zeile in der gemeinsamen Tabelle „Was interessiert die
Besucher?“, kein separater Splash-Block mehr. Eine Summenzeile enthält Gesamt,
Mitglieder und Externe; Mitglieder/Externe jeweils mit Prozentanteil an dieser
Tabellensumme. Die Tabellensumme enthält Splash-Anzeigen, die oberen Kennzahlen
und die kumulierten Jahreskurven bleiben unverändert reine Seitenaufrufe.
Kurzer Tabellenhinweis und Methodentext erklären den unterschiedlichen Umfang.
Hinter 30 Tage / Monate / Jahre erscheinen abgeschlossene Jahre automatisch als
Jahreszahl. Auswahl zeigt Januar bis Dezember genau dieses Jahres. 2026 erscheint
ab 2027, 2027 erst ab 2028. Server lehnt laufende/zukünftige Kalenderjahre als
historischen Diagrammfilter ab. Die oberen Zeitraumfilter bleiben unabhängig.
Keine Änderung an Erfassung, Speicherung oder CSV, keine Datenbankmigration.
12 Statistik-Servertests inkl. Jahreswechsel bestanden; Chromium/WebKit prüfen
Splash als erste Zeile, einzige Tabelle, Summen/Anteile, historische Jahreswahl,
CSV und 320/390/834/1440 px. Worker-Dry-Run erfolgreich. Service Worker v334.
Details RELEASE-v334.md.

Live veröffentlicht: Quellstand 69960d5, Pages-Lauf 42475414949 erfolgreich,
Worker b26b10d0-f74d-4319-9300-acc8d81668c8, Service Worker v334.
Öffentlich ausgelieferte JS-Datei enthält gemeinsame Tabelle/Summenzeile und
automatische historische Diagrammjahre; Cachedatei bestätigt v334.

## Splash und vollständige Statistik-Historie – 08.11.2026 · v333

Splash wird separat als sichtbare Öffnung erfasst, mit Mitglieder-/Externensplit,
nicht als zusätzlicher Seitenaufruf, Besucher oder Besuch. Initiale Anzeige nach
Session-Auflösung, erneute echte Öffnung zählt neu; Neurendern, Hintergrund und
Editor-Vorschau zählen nicht neu. Noch keine rückwirkenden Splash-Zahlen; Start
wird mit dem ersten Kontakt dokumentiert. Dies belegt die Einstiegsseite, nicht
die tatsächliche Sichtbarkeit eines einzelnen Sponsorlogos. Eigene Admins zählen.
Abgeschlossene Jahre erscheinen automatisch mit Jahreszahl (2026 ab 2027, danach
2027 ab 2028 usw.). Kein festes „Vorheriges Jahr“. Balkenverläufe: letzte 30 Tage,
letzte zwölf Monate bis zum aktuellen Monat rechts, sämtliche Jahre chronologisch
mit aktuellem Jahr rechts. Separater kumulierter Mehrjahresvergleich darunter:
Jan–Dez, nur Seitenaufrufe ohne Splash, Reset je Jahr, 2026 erst ab November,
keine zukünftigen Monate/vorgeblichen Daten vor Messbeginn. Monatswertetabelle
für genaue Werte und mobile Lesbarkeit ergänzt.
CSV lädt unabhängig von der Auswahl die gesamte verfügbare Aggregathistorie:
Jahre, Monate, Tage und Seiten inklusive Splash, alte freiwillige Messreihe
explizit separat. Sortierung nach Messreihe, Zeitraum und Bereich. Summen-/Detail-
ebenen klar benannt und dürfen nicht addiert werden. Kein Export von Mitglieder-
IDs, Schlüsseln oder Rohereignissen. Fehlerbehandlung und Berechtigungsprüfung.
Verbindliche Speicherregel ab v333: reine Tages-/Monats-/Jahreszähler bleiben für
die vollständige Historie erhalten, auch Seitenaggregate. Ersetzt die befristeten
Aggregatregeln v331/v332; die temporären HMAC-/Session-/Retry-Kennungen werden
weiterhin wie bisher gelöscht. Keine neue Browserkennung, keine Nutzerprofile.
Besucher und Besuche bleiben getrennt: ein angemeldetes Mitglied pro Zeitraum
ein Besucher, sämtliche Aufrufe zählen; Seiten pro Besuch = Aufrufe / Besuche.
Datenschutzinfo und Methodentext angepasst. Keine Schema-Migration erforderlich.
28 Servertests inkl. Splash, Wiederholungsschutz, Jahreswechsel, vollständigem
CSV und Gast-/Adminrechten bestanden. Chromium/WebKit inkl. 320/390/834/1440 px,
Splash-Einmalzählung, CSV-Inhalt und vollständiger Diagrammoberfläche geprüft;
Worker-Dry-Run erfolgreich. Service Worker v333. Details RELEASE-v333.md.

Live veröffentlicht: Quellstand 05a8c92, Pages-Lauf 42474205709 erfolgreich,
Worker 4ed904c8-3a6c-4f32-a5e4-e56f11b1ed83, Service Worker v333.
Echte Browserprüfung: sichtbare Öffnung der Einstiegsseite aus dem Profil und
anschließender Eintritt nach Home. Ergebnis: Splash 1 / Mitglieder 1 / Externe 0,
Seitenaufrufe separat von 10 auf 11, weiterhin 1 Besucher und 1 Besuch.
Kumulierte Kurve mit Novemberpunkt und dynamische Jahresauswahl sichtbar.
CSV vollständig serverseitig und mit echten Downloads in Chromium/WebKit-Fixtures
geprüft; Live-Download über Browserautomation nicht abschließend verifiziert
(Automationsverbindung abgebrochen). Keine synthetischen Live-Zähler erzeugt.

## Verständliche Statistik mit Jahresansicht – 08.11.2026 · v332

Verbindlicher Nachfolger der Statistikdarstellung v331: Seitenaufrufe, Besucher,
Besuche, Seiten pro Besuch und App-Aufrufe jeweils mit Mitglieder-/Externenanteil.
„Aktive Mitglieder“ und die missverständliche doppelte Zielgruppenkarte entfallen.
Mitglieder sind unterschiedliche verifizierte Konten pro Tag/Monat/Jahr; zehn
Aufrufe desselben Kontos sind ein Besucher. Externe = ohne verifizierte Anmeldung,
auch Mitglieder ohne Login; ihre tägliche Netzschätzung wird für längere Zeiträume
addiert und ausdrücklich als Schätzung gekennzeichnet, keine exakte Personenzahl.
Heute, Dieser Monat, Dieses Jahr, Vorheriges Jahr sowie Monats-/Jahrauswahl.
Diagramm: letzte 30 Tage, Monate des gewählten Jahres oder Jahresverlauf.
Tabelle: Gesamt / Mitglieder / Externe. CSV mit klaren Einheiten und Zeitraum.
Migration 0012 ergänzt vorhandene Zähler und Monats-/Jahres-Seitenaggregate;
keine bisherigen Aufrufe gelöscht. Historisch nicht sicher zuordenbare gemischte
Besuche/App-Aufrufe bleiben ausdrücklich nicht zugeordnet. Keine erfundenen
Werte vor Messbeginn. Aktuelle Monatsmitglieder einmalig für das Jahres-Set
übernommen. Tagesaggregate 400 Tage, Monate fünf Jahre, Jahre zehn Jahre;
Mitglieder-HMAC-Sets nur aktueller Tag/Monat/Jahr, keine Browserkennungen.
25 Serverprüfungen, Chromium/WebKit inkl. 320/390/834/1440 px, CSV, Jahreswechsel
und fehlende Vorjahresdaten bestanden; Worker-Dry-Run erfolgreich. Details:
RELEASE-v332.md. Service Worker v332.

Live veröffentlicht: Quellstand bf1b5ac, Pages-Lauf 42473335424 erfolgreich,
Worker 7da0046a-5ec1-4f9a-9c17-81705c3762ee, Service Worker v332.
Echte angemeldete Browserprüfung: Heute und Jahr zeigen 10 Seitenaufrufe,
1 Besucher (1 Mitglied, 0 Externe), 1 Mitgliedsbesuch, 10 Seiten pro Besuch.
Monatsdiagramm: zwölf Felder; Vorjahr: keine Messdaten und Striche statt Nullen.
Keine künstlichen Live-Ereignisse, Testkonten oder Kommentare erzeugt.

## Automatische Statistik und getrennte Mitglieder-/Gastaufrufe – 08.11.2026 · v331

Neue, verbindliche Festlegung: Statistik-Zustimmungsabfragen und Account-Eintrag
entfernt. Neue Reichweitenzählung automatisch ohne persistente Browserkennungen.
Tägliche serverseitige Besucherschätzung; Monatskarte „Besucher-Tage“, keine
personenbezogene Monatsreichweite vortäuschen. Seitenaufrufe bleiben die Kernzahl.
Eigene Admins werden mitgezählt. DNT/GPC und frühere ausdrückliche Ablehnungen
bleiben respektiert. Reine Datenschutzinformation im Footer, keine neue Abfrage.
Mitglieder-/Gastaufteilung nach verifizierter Anmeldung: Anzahl/Anteil, pro Seite
und CSV. „Ohne Anmeldung“ enthält auch Mitglieder ohne Login. Keine beliebigen
Button-/Chat-/Kiosk-Klicks erfassen. Alte freiwillige Reihe separat archiviert.
Migration 0011 additiv, keine bisherigen Nutzerdaten überschrieben. Details:
RELEASE-v331.md und STATISTIK-DATENMINIMIERUNG-v331.md. 27 Servertests plus
Chromium/WebKit-Prüfungen und Worker-Dry-Run bestanden; Service Worker v331.
Live: d9dafa9, Pages-Lauf 42471923925 erfolgreich, Worker
a2643c7d-1421-40ec-ab71-eb91db8576db. Beginn 08.11.2026, 11:33 Uhr Berlin.
Echt geprüft: 2 automatische Mitgliederaufrufe, keine Statistikabfrage.

## Archivierter Abschlussstand v330 – Statistik durch v331 ersetzt

Dieser Überblick beschreibt den damaligen Abschluss von v330. Für die Statistik
gilt inzwischen v331 oben: automatische tägliche Schätzmessung ohne Freigabe-UI,
mit getrennter Mitglieder-/Ohne-Anmeldung-Zählung. Die damalige Freigaberegel
ist historisch; die übrigen Featurebeschreibungen bleiben als Verlauf erhalten.

- Live-Website: https://joern-kaemper.de/ · Service Worker `tfb-kiosk-v330`.
  Frontend-Funktionsstand `01c9d17`, erfolgreicher Pages-Lauf `42470589926`.
  Worker `1bd4f53e-f079-4aee-8b9e-3a5efc1bef84`; Dokumentationsstand vor
  diesem Abschluss `99ec29e`. Die letzten Umsetzungen sind vom Nutzer positiv bestätigt.
- Kommentare: „Antworten“ steht für angemeldete Mitglieder zuerst in der
  Aktionszeile. Bezug im Composer entfernbar, veröffentlichte Antwort mit
  kompaktem Zitat und Sprung zum Original. Flache Liste bleibt erhalten.
  Nur `replyTo` speichern, keine Zitatkopien; ausgeblendete/gelöschte Originale
  werden im Zitat nicht weitergegeben. Klingelhinweis auch bei Antworten auf
  eigene Kommentare unter fremden Beiträgen. Erster Kommentar mit 14px Abstand
  unter der Trennlinie. Details: RELEASE-v329.md und RELEASE-v330.md.
- Clubstatistik unter `#clubstatistik`: Besucher (Browser), Besuche, Seiten pro
  Besuch, Seitenaufrufe, aktive Mitglieder, App-Anteil; Heute/Monat, Verlauf,
  Seitenrangfolge und CSV. Admins werden ausdrücklich wie alle anderen gezählt,
  auch bei ausgeblendeten Werkzeugen. Freiwillige Freigabe, DNT/GPC und übrige
  Schutzregeln gelten weiter. Freigabe im damaligen Testbrowser aktiviert und
  echter Live-Test mit zwei Admin-Aufrufen nachgewiesen; das ist keine globale
  Freigabe für andere Geräte/Besucher. Keine rückwirkenden Zahlen erfinden.
  Partnerstatistik bleibt ausgeschaltet. Details: RELEASE-v326.md / RELEASE-v328.md.
- App-Anleitung: nach mobiler Anmeldung über die ausblendbare Karte „Dein Club.
  Ein Fingertipp.“, dauerhaft im Account und direkt in den Admin-Werkzeugen.
  Alle drei Zugänge öffnen denselben Apple-/Android-Dialog. Auch in der bereits
  installierten App bleibt der manuelle Account-Aufruf sichtbar; nur die
  automatische Karte ist dort ausgeblendet. Account-Button so breit wie
  „Speichern“, Blau/Gelb bzw. Rot/Weiß. Details: RELEASE-v327.md.
- Präsentationsbilder aus dem echten Dialog:
  `praesentation/app-installation/TFB-App-Apple-iPhone-iPad-HD.png` (1950 × 2935px)
  und `praesentation/app-installation/TFB-App-Android-HD.png` (1950 × 2825px).
  Erneuter Export: `node tools/export-install-guide.mjs`.

Validierung des letzten Funktionsstands: 18 gezielte Servertests, neue
Chromium-/WebKit-Prüfungen für Antworten, Bezug entfernen, Farben, Sprung,
Klingel/Lesestatus, Gast-/Mitglieder-/Adminrechte und versteckte/gelöschte Zitate;
320/390/834/1440px ohne Überlauf. Bestehende umfangreiche Kommentar-/Foto-
Browserprüfung und Worker-Dry-Run ebenfalls erfolgreich. Keine produktiven
Testkommentare, E-Mails oder künstlichen Benachrichtigungen erzeugt.

## Fortsetzungshinweise

Die zuletzt beauftragten Funktionen sind umgesetzt und veröffentlicht; aktuell
ist keine offene Umsetzung aus diesem Auftrag übrig. Fachliche Änderungen nach
geeigneter Prüfung direkt deployen; der Nutzer möchte dafür kein erneutes Okay.
Reine Dokumentationsänderungen erfordern kein erneutes Website-Deployment.

Die lokale Arbeitskopie unter `01 Software` enthält zahlreiche ältere, nicht zu
diesem Auftrag gehörende Änderungen. Veröffentlichungen weiterhin aus isoliertem,
aktuellem Hauptstand vorbereiten und nur die beauftragten Änderungen übertragen.
Keine pauschale Übernahme/Veröffentlichung des gesamten lokalen Arbeitsstands.
Keine Geheimnisse in Dokumentation oder Repository schreiben.

## Antworten auf Kommentare – 08.11.2026 · v330

„Antworten“ als erste Kommentaraktion für Mitglieder. Composer und veröffentlichte
Antwort zeigen einen kompakten Zitatbezug; Tipp springt zum Original. Flache Liste
bleibt erhalten. Gespeichert wird nur die Original-ID; ausgeblendete/gelöschte
Quelltexte erscheinen nicht weiter im Zitat. Server prüft selben Beitrag,
Sichtbarkeit und unveränderlichen Bezug. Klingelhinweis auch für Kommentarautoren
unter fremden Beiträgen, vorhandener Lesestatus synchronisiert. Keine E-Mails.
18 Servertests, neue Chromium-/WebKit-Prüfungen und bestehende Kommentarprüfung
bestanden, Worker-Dry-Run erfolgreich. Details RELEASE-v330.md. Keine Migration.
Live: 01c9d17, Pages-Lauf 42470589926 erfolgreich, Worker
1bd4f53e-f079-4aee-8b9e-3a5efc1bef84, Service Worker v330.

## Chat-Kommentare: Abstand zur Linie – 08.11.2026 · v329

Erster Kommentar erhält 14px oberen Innenabstand. Avatar/TFB-Symbol und Name
stehen damit unterhalb der Trennlinie mit derselben Luft wie weitere Kommentare.
Chromium/WebKit bei 320/390/768/1440px visuell und geometrisch geprüft.
Nur CSS und Service-Worker v329; keine Daten-/Backendänderung. RELEASE-v329.md.

## Admin-Aufrufe zählen mit – 08.11.2026 · v328

Explizite Nutzerkorrektur: Admins werden ab jetzt bei normalen Websiteaufrufen
wie alle anderen mitgezählt, auch bei ausgeblendeten Werkzeugen. Frontend,
Worker und Aggregation angepasst, irreführende Ausschlusstexte entfernt.
Statistikfreigabe und übriger Datenschutz unverändert. Keine rückwirkenden Zahlen.
Vier Servertests und Chromium-/WebKit-Prüfungen mit echten Admin-Zählern bestanden.
Details RELEASE-v328.md. Keine Datenmigration, Service Worker v328.
Live geprüft: 2 echte Admin-Aufrufe, 1 Besucher, 1 Besuch, 2 Seiten/Besuch.
Freigabe im aktuellen Nutzerbrowser aktiviert. Quellstand a870aee, Pages-Lauf
42469035486, Worker 4be0e842-0142-4c9d-951a-73237d0ec54c.

## App-Anleitung dauerhaft erreichbar und HD-Bilder – 08.11.2026 · v327

Account-App-Button bleibt jetzt auch im installierten App-Modus sichtbar. Die
unveränderte Apple-/Android-Anleitung ist zusätzlich direkt über „App-Anleitung“
in den Admin-Werkzeugen erreichbar. Alle Zugänge öffnen dieselbe help()-Funktion.
Nur die automatische Installationskarte wird in der installierten App ausgeblendet.
HD-Präsentationsbilder aus der echten Oberfläche (1950px breit) liegen unter
praesentation/app-installation/. Exporttool: tools/export-install-guide.mjs.

Statistik zählt Admins absichtlich nicht; dieser Hinweis steht nun zusätzlich oben
in der Übersicht. Andere Besucher werden nur nach „Statistik erlauben“ gezählt.
Sechs gezielte Tests sowie Chromium-/WebKit-Prüfungen einschließlich direktem
Admin-Aufruf und simuliertem installierten App-Modus bestanden. Details RELEASE-v327.md.
Live: a7c0ba8, Pages-Lauf 42468674037 erfolgreich, Service Worker v327.

## Clubstatistik und App-Einstieg – 08.11.2026 · v326

Neue Admin-Ansicht #clubstatistik mit Heute/Monat, Besucher-Browsern, Besuchen,
Seiten pro Besuch, Aufrufen, unterschiedlichen Mitgliedern, App-Anteil, Tageskurve,
Seitenrangfolge und CSV. Keine rückwirkenden Zahlen; fehlende Vergleichsdaten
werden ausdrücklich benannt. Nur freiwillige Statistikfreigaben: keine IDs oder
Übertragung vor Einwilligung, keine Namen/Mails/IPs/Klickverläufe in Statistikdaten.
Monatliche Zufallskennung, 30-Minuten-Besuche, HMAC-Ableitung pro Tag/Monat,
Widerruf in Footer und Account, DNT/GPC berücksichtigt. Details RELEASE-v326.md.
Partnerstatistik bleibt deaktiviert. Migration 0010 nur neue Statistiktabellen.

Account-App-Button exakt auf Speichern-Inhaltsbreite eingerückt. Mobile Mitglieder
sehen nach Anmeldung die Installationskarte mit Apple-/Android-Anleitung;
ausblendbar, später im Account erreichbar. Im installierten App-Modus ausgeblendet.
38 Servertests bestanden; Chromium-/WebKit-Prüfungen für Statistikfreigabe,
Widerruf, Besuchsgrenzen, Adminschutz, CSV und Mobilbreiten sowie Neuanmeldung,
Profil/Kommentar und Installationshilfe erfolgreich.
Live: Worker 98f5c3de-5367-4ad8-bc3d-15b9b3a485ff, Pages-Lauf 42466162529,
Messbeginn 08.11.2026, 10:12 Uhr Berlin. Echte Admin-Ansicht geprüft.
Finales Frontend 16f3db4 / Pages-Lauf 42466428986 erfolgreich; Direktlink
#clubstatistik nach Reload ohne Splash verifiziert.

## App-Installation: farbiger Profilbutton – 08.11.2026 · v325

Account-Button jetzt Rot/Weiß in der roten Welt und Signature-Blau/Gelb in der
gelben Welt. Apple-/Android-Anleitungen und Erkennung des App-Modus geprüft.
Wichtig: Eine Installation wird beim Start als eigenständige App erkannt, nicht
zuverlässig aus einem normalen Safari-Tab. Dann sind Banner und Profilbutton
absichtlich ausgeblendet. Nur ausgeblendetes Banner: Profilhilfe bleibt verfügbar.
Aktuelle Code-Mail enthält bereits das feste gelb-blaue Logo; Nutzerbild war die
ältere Vorlage. Details und Prüfungen: RELEASE-v325.md.
Live: Quellstand 59763c3, Pages-Lauf 42464428176 erfolgreich, Service Worker v325.

## Mitgliederzuordnung und Übersicht – 08.11.2026 · v324

Eingerichtete Zugänge stehen jetzt separat oben, noch nicht gestartete Mitglieder
darunter; beide Gruppen alphabetisch nach Nachnamen/Vornamen. Der unbenutzte
Doppeleintrag des Admins wurde reversibel deaktiviert und die Mitgliedsdaten dem
bestehenden Konto zugeordnet. Ursache war ein Semikolon hinter der Import-Mail.
Import und Anmeldung bereinigen solche Trennzeichen. Eindeutiger Name plus
hinterlegte Mail verknüpfen dieselbe Person auch ohne Mitgliedsnummer; gemeinsame
Familienadressen verschiedener Personen bleiben getrennt.

Mail-Codefeld jetzt kompakt (200 × 55px), linksbündig, fest Signature-Blau auf Gelb.
32 Servertests und Chromium-/WebKit-Prüfungen bestanden. Details: RELEASE-v324.md.
Live bestätigt: 307 Mitglieder, davon 1 eingerichteter Zugang und 306 noch nicht
gestartet. Pages-Lauf 42464097341 erfolgreich; Worker
8ed65887-0de0-4db8-bb27-0f5cc8235cee; Quellstand e5a382b.

## Freischaltmail: verbindlich Gelb-Blau – 08.11.2026 · Mail-Release v323

Die tatsächliche Freischaltmail verwendet jetzt den bereits entwickelten Look
der gelb-blauen Mitgliedsanmeldungs-Mail, einschließlich Original-Logo,
Hintergrund, Typografie, gelber Linie, gelbem Codefeld mit blauen Ziffern sowie
Info-/Fußbereich. Immer Gelb-Blau, unabhängig von der Website-Farbwelt.
Keine Änderung am automatischen Zugang, Resend-Absender oder an Mitgliederdaten.

Live-Worker `3ffef93a-98d8-44d6-bbe6-0d18ea1926c8`, Quellstand `20e0b80`.
Website und Service Worker bleiben v322. Kein Pages-Deployment nötig.
Vorlage: `server/cloudflare/templates/access-mail.html`, abgeleitet aus dem
bestehenden Muster über `node tools/build-access-mail.mjs`. 19 relevante Tests,
Chromium-/WebKit-Sichtprüfung bei 320/390/760px und Worker-Dry-Run erfolgreich.
Keine zusätzliche echte Code-Mail für diesen reinen Gestaltungswechsel ausgelöst.
Details: [Mail-Release v323](RELEASE-v323.md).

---

## Automatische Freischaltung und Mitgliederverwaltung – 08.11.2026 · v322

Aktueller Live-Stand: `tfb-kiosk-v322`, Website-Code
`9b1901b9ca18eef1b7713689f9fe6b0bd4716b28`, erfolgreicher
[Pages-Lauf 42462633281](https://github.com/calvinjohncamp/tfb-website/actions/runs/42462633281).
Worker `tfb-api`: `d8352047-7169-48fa-a1de-2a33997ca6c2`. Dieser Abschnitt ersetzt
die vorherige Beschreibung der manuellen Erstfreischaltung aus v321.
Alle zuvor bestätigten Farb-/Archiv-/Bierdeckelregeln bleiben bestehen.

Verbindlicher Nutzerablauf: E-Mail aus aktiver TFB-Liste eingeben → App versendet
automatisch einen sechsstelligen Code → Code bestätigen und ein Passwort mit
mindestens zwölf Zeichen setzen → angemeldet. Danach E-Mail/Mitgliedsnummer und
Passwort. Passwort vergessen nutzt ebenfalls den automatischen Mailweg.
Keine Vorstandsgenehmigung und keine manuelle Codeanforderung nötig.
Code zehn Minuten/einmalig/fünf Versuche, Versandpause 60 Sekunden. Haupt-/Zweitmail
zulässig; bei Familienadresse zusätzliche Mitgliedsnummer. Unbekannte Adressen
bekommen keine Mail und können kein Konto eröffnen. 13 Mitglieder ohne Mail müssen
ihre Adresse über die Vereinsliste ergänzen lassen.

Resend: bestehender persönlicher Account auf ausdrücklichen Nutzerwunsch.
Separater Schlüssel `tfb-website-auth`, ausschließlich Sending access für
`padel-bielstein.de`, nach ausdrücklicher Aktionserlaubnis erzeugt und nur als
Worker-Secret gespeichert. Absender „Tennisfreunde Bielstein <tfb@padel-bielstein.de>“.
Padel-Anwendung, deren Schlüssel, Tarif und DNS unverändert. Eine echte Mail an
den eindeutig bestätigten eigenen Adminaccount wurde als Delivered verifiziert;
kein Passwort und keine Sitzung des Nutzers durch diesen Versand geändert.

Adminbereich jetzt in „Mitglieder & Zugänge“ und „Liste importieren“ getrennt.
Kennzahlen, Suche, Filter, Sortierung, Zugang eingerichtet/noch nicht gestartet,
letzter Login und letzte Aktivität. Aktiv heißt Aktion/Rückmeldung innerhalb von
fünf Minuten; Verwaltung aktualisiert alle 30 Sekunden. Früher nicht erfasste
Loginzeiten bleiben unbekannt. Produktiv mit bestehender Adminsitzung geprüft:
308 aktive Konten inkl. Verwaltung, ein Zugang eingerichtet, 307 noch nicht
aktiviert. Nicht als historische Dauerstatistik interpretieren.

Mobile App-Hilfe: kleine ausblendbare Karte nach Anmeldung, dauerhafter Link im
Profil; getrennte iPhone/iPad- und Android-Schritte. Installierte Standalone-App
zeigt keine Einladung. Normale Mitglieder können eigenes Profilbild, Chats,
Kommentare und Kiosk nutzen; Verwaltungsrechte bleiben Admins vorbehalten.

Additive Migration 0009 angelegt: nur neue Tabellen für Codes und Zugangszeiten.
Vorheriger serverseitiger D1-Wiederherstellungspunkt privat dokumentiert.
Automatischer Review lehnte lokalen Mitgliederexport ab; kein Export ausgeführt,
keine privaten Bestandsdaten oder Geheimnisse ins Repository übernommen.
29 Servertests und vollständige Chromium-/WebKit-Browserläufe mit synthetischen
Daten erfolgreich, inklusive Code+Passwort, Profilbild, Kommentar, Übersicht,
Importvorschau und App-Hilfe. Paket 276 öffentliche Dateien, sechs geänderte
Webdateien live bytegleich, automatische Registrierung und Adminübersicht live
geprüft. Keine vollständige neue npm-test-Gesamtprüfung oder native Handyinstallation.
Anleitung [Mitgliederzugang](MITGLIEDERZUGANG.md), Details [v322](RELEASE-v322.md).

---

## Mitgliederzugang geprüft und erläutert – 08.11.2026 · v321

Aktuell live: `tfb-kiosk-v321`, Code `380bc3d5ffa3a6159bbd5dfe9128d791c19edf74`,
[Pages-Lauf 42460748569](https://github.com/calvinjohncamp/tfb-website/actions/runs/42460748569)
erfolgreich. Drei Webdateien live bytegleich und Anmeldehinweise im mobilen
Live-Browser geprüft. Dieser Stand ergänzt die bestätigten Gestaltungsregeln
von v320; an den Farbentscheidungen ändert sich nichts.

Produktive Datenbank ausschließlich aggregiert gelesen: 307 aktive importierte
Mitglieder plus Verwaltungskonto; 13 importierte Mitglieder ohne E-Mail. Null
importierte Mitgliederkonten aktiviert, ein Verwaltungskonto aktiviert.
Eine beim TFB hinterlegte E-Mail ermöglicht die Anmeldung, ersetzt jedoch nicht
den persönlichen Erst-Freischaltcode vom Vorstand. Erst danach wird ein eigenes
Passwort gesetzt. Bei gemeinsamer Familienadresse ist die Mitgliedsnummer nötig;
ohne E-Mail funktioniert ebenfalls Mitgliedsnummer plus persönlicher Code.
Keine automatische Code-Mail und keine freie Registrierung.

Serverseitiger Schutz war bereits vorhanden und ist geprüft: Gäste dürfen die
öffentlichen Inhalte lesen, aber keine Beiträge/Kommentare/Medien speichern.
Aktive Mitgliedschaft und gültige Sitzung werden für geschützte Aufrufe geprüft;
deaktivierte oder gefälschte Sitzungen und externe E-Mails scheitern. Keine
Serveränderung, Migration, Mitgliederdatenänderung, echte Codeerzeugung oder
Nachrichtenversendung dieser Prüfung. Oberfläche erklärt die Beschränkung und
den ersten Zugang jetzt ausdrücklich; Gast-Kommentarknöpfe verweisen auf Anmeldung.

13 Servertests und vollständiger Chromium-/WebKit-Durchlauf mit synthetischen
Daten bestanden, einschließlich Erstaktivierung, Kommentar, Reload und Entzug
der Mitgliedschaft. Öffentliche API live 200; private/Schreibaufrufe ohne Token
und ungültige Login-/Aktivierungsversuche live 401. Keine Vollprüfung aller
Anwendungsfunktionen dieses Releases. Anleitung für den Vorstand:
[Mitgliederzugang](MITGLIEDERZUGANG.md), Nachweise [v321](RELEASE-v321.md).

---

## Aktuelle Übergabe – 08.11.2026 · Nutzerfreigabe v320

Der Nutzer bestätigt: „Alles super“. Alle Aufträge dieser Sitzung sind erledigt
und veröffentlicht. Keine daraus offene Umsetzung. Dieser Abschnitt ist der
aktuelle Stand; die darunterliegenden älteren Sitzungsberichte sind Historie.

### Live-Nachweis

Website [joern-kaemper.de](https://joern-kaemper.de/), Cache `tfb-kiosk-v320`,
Code `81b0a6d08cbd684019ca86c244e149fe69db3096`, [Pages-Lauf 42457537738](https://github.com/calvinjohncamp/tfb-website/actions/runs/42457537738) erfolgreich.
CSS und Service Worker bytegleich zum geprüften Paket. Diese Dokumentation
löst keinen neuen Website-Release aus; der Live-Stand bleibt v320.

### Bei der nächsten Sitzung beibehalten

| Element | Endgültige Entscheidung |
| --- | --- |
| Aktuell-Datumsfelder, gelbe Welt | Dunkelblau #001D3D mit Gelb #FFC300 |
| Aktuell-Datumsfelder, rote Welt | Signature-Rot #C4553A mit Weiß, nicht Schwarz |
| Bierdeckel, rote Welt | Alle Texte Schwarz #171717; nur Ball und Striche rot |
| Bierdeckelname, gelbe Welt | Signature-Blau, klein und unten zentriert |
| Karussellpfeile | Transparente Kreise mit gelber/roter Linie; Seitenpunkte weiter gelb/rot |
| TFB-Chatabsenderlogo | Blau in Gelb, Rot in Rot; sofortiger Wechsel auch bei bestehenden Kommentaren |
| Clubarchiv | Einspaltig, ohne Save the Date und Terminumschalter |

Defibrillator-Bericht mit Bild vorhanden und vom Nutzer inzwischen gefunden:
[Direktlink](https://joern-kaemper.de/#club/archiv/beitrag/start-defibrillator).
Datum 28.10.2026 anhand Bild-Upload/Startseitenänderung hergeleitet. Archivdatei
`assets/clubarchiv/bestand.json`, Foto
`assets/clubarchiv/defibrillator-2026-10.webp`. Bestehende historische Einträge
und direkte Terminadressen erhalten. Versionsparameter und Revalidierung des
Archivbestands beibehalten; ein Cacheproblem auf dem Nutzergerät ist nicht
bewiesen, die spätere Sichtbarkeit wurde jedoch bestätigt.

### Arbeitsweise und Prüfung

Fertige beauftragte Website-Änderungen ohne erneute OK-Abfrage direkt deployen.
Weiter auf aktuellem `origin/main` isoliert arbeiten: Die Dropbox-Arbeitskopie
enthält zahlreiche unabhängige Änderungen, nicht pauschal committen/deployen.
Vor dem nächsten Eingriff Remote-Stand prüfen. Keine offenen Aufträge aus
v312–v320 erfinden oder überholte Farbversuche wiederherstellen.

Gezielte Chromium-/WebKit-Prüfungen bestanden: Farbwelten, mobile und große
Ansichten, lange Bierdeckelnamen, viele Striche, Archivbild, Wegfall der
Terminspalte, mobile Aktuell-Tabs und TFB-Absenderwechsel. Live-Dateivergleiche
bestanden. Kein neuer vollständiger npm-test-Lauf; keine native erneute
Geräteprüfung dieser Sitzung. Bestehende iPad-Statuszeilenfreigabe bleibt gültig.
Keine Worker-/D1-Migration oder CMS-Schreiboperation dieser Sitzung.

Ausführliche Übersicht: [Projektupdate](PROJEKTUPDATE.md).
Dauerhafte Entscheidungen: [Projektgedächtnis](PROJEKTGEDAECHTNIS.md).
Technische Einzelheiten: Release-Dateien v312–v320.

---

## Sitzungsabschluss und iPad-Freigabe – 07.11.2026

Der Nutzer bestätigt zur veröffentlichten Korrektur v311 ausdrücklich:
„Perfekt, das hat funktioniert.“ Damit ist der gemeldete Durchschein-Effekt
hinter Uhrzeit, WLAN und Batterie **auf seinem iPad behoben und bestätigt**.
Der Statuszeilenfehler ist abgeschlossen; keine weitere Korrektur dazu offen.
Diese Bestätigung betrifft das Nutzer-iPad, keine gesonderte iPhone-Geräteprüfung.

Verbindlicher Abschlussstand: Website live v311, Cache `tfb-kiosk-v311`,
Live-Code `bad596613da318037c30c517479dc720d69d2440`, erfolgreicher
[Pages-Lauf 42412542482](https://github.com/calvinjohncamp/tfb-website/actions/runs/42412542482).
Den echten `.tfb-statusbar-shield` einschließlich 12px-Mindesthöhe beibehalten;
nicht auf die auf dem Gerät unwirksame Pseudoelement-Lösung v309 zurückgehen.

Die bisherigen Freigaben gelten weiter: Gelb-Blau als Standard, Rot umschaltbar;
Freihand-Textmarker in Gelb-Blau; ruhige News-Datierung ohne quadratische Badges
links, Datumsfelder bei Save the Date rechts; Home fest im Wechselspiel ohne
Look-Auswahl; Aktuell-Karussells im normalen Artikellook mit erhaltenen Home-
Textfeldern; bestätigte Karussell-Bewegung v300 unverändert.

Für heute sind alle beauftragten Arbeiten abgeschlossen. Diese Aktualisierung
sichert nur Dokumentation und Gerätefreigabe; kein erneutes Deployment nötig.
Für die nächste Sitzung weiterhin von GitHub main sauber ausgehen und die
zahlreichen unabhängigen Dropbox-Änderungen nicht pauschal veröffentlichen.

---

## iPad-Statuszeile: v309 auf echtem Gerät widerlegt, Korrektur v311 – 07.11.2026

Nutzer-Screenshot IMG_2762.PNG zeigt unter Uhrzeit/WLAN/Batterie weiterhin
verschwommene Seiteninhalte. **v309 war auf dem iPad nicht wirksam.** Der alte
lokale Pixeltest bewies nur eine CSS-Fläche bei manuell gesetztem positiven
Inset, nicht die native iOS-Statusleiste. Diesen Nachweis nicht als Gerätefreigabe
interpretieren; keine Vermutung, es sei allein ein Cacheproblem.

v311 ersetzt `body::before` durch ein echtes, dauerhaft außerhalb des neu
gerenderten App-Inhalts liegendes DOM-Element `.tfb-statusbar-shield` in index.html.
Auf Touch-Geräten mit grobem Zeiger ist es über die volle Viewportbreite fest bei
top:0, deckend in der aktuellen Seitenfarbe, ohne Pointer-Ereignisse. Höhe
`max(12px, var(--safe-top))`: Ein von iOS gemeldeter Null-Inset darf die Fläche
nicht mehr verschwinden lassen. Auf Desktop ausgeblendet. Kein zusätzlicher
Layoutabstand; kein Umbau der Scrollcontainer oder JavaScript-Scrollumleitung.
Meta-/Manifestfarbe und Apple-Statusstil aus v309 bleiben erhalten. Cache v311.

Begründung/Arbeitsannahme anhand des [WebKit-Quellcodes](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/LocalFrameView.cpp):
`fixedContainerEdges` ermittelt feste Container über Hit-Tests am Rand und deren
Renderer. `primaryBackgroundColorForRenderer` verwirft Flächen bis 10px Höhe;
[PageColorSampler.h](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/PageColorSampler.h)
setzt den Rand-Abtastabstand auf 4px. Ein echtes Element mit mindestens 12px Höhe
und voller Breite adressiert diese Erkennung auch bei Null-Inset. Das ist eine
begründete Korrektur, keine direkt auf dem Nutzergerät bestätigte Ursachenmessung.

`tools/test-browser-status-area.mjs` wurde entsprechend erweitert und bestanden:
echter DOM-Knoten/ARIA, WebKit für Touch und Desktop, beide Farbwelten, iPad
hoch/quer, iPhone, explizit Null-Inset und positive Insets; feste Geometrie,
Rand-Hit-Test und identische Pixel mit/ohne grellen Inhalt darunter nach Scrollen.
Native iPad-Systemleiste bleibt lokal nicht prüfbar (kein iOS-Simulator installiert).
**Gerätebestätigung liegt vor:** Nutzer am 07.11.2026: „Perfekt, das hat funktioniert.“
Live-Commit `bad596613da318037c30c517479dc720d69d2440`; erfolgreicher
[Pages-Lauf 42412542482](https://github.com/calvinjohncamp/tfb-website/actions/runs/42412542482).
Live-HTML, CSS und Service Worker per SHA-256 mit dem Paket verglichen:
identisch. Nachweis `.private/release-v311/live-proof.json` in der
Dropbox-Arbeitskopie. Die erfolgreiche Funktion auf dem Nutzer-iPad ist inzwischen bestätigt.

---

## Ruhige News-Datierung und fester Home-Look v310 – 07.11.2026

Unter Aktuell, Club und Clubarchiv entfallen die quadratischen Datums-Badges bei
News. Das ausgeschriebene Datum bzw. Archivjahr bleibt erhalten. Dies gilt für
Einzelfotos, mehrere Fotos, Galerien/Collagen im News-Bereich und Archivartikel
mit oder ohne Foto, in beiden Farbwelten. Bei Save the Date rechts bleiben die
Datumsfelder erhalten. Home-Fotomodule und Home-Artikel behalten ihre bisherige
Darstellung. Umsetzung im Rendering (`newsPost`/`postPhotos` mit standardmäßig
abgeschaltetem Badge, Home ausdrücklich eingeschaltet; Fotomodule abhängig von
Seite). Keine pauschale CSS-Regel, die auch Termine verstecken würde.

Home ist jetzt **verbindlich nur Wechselspiel (`home-look-6`)**. Der komplette
Block „Look der Startseite“, die Auswahl Klassisch/Magazin und der zugehörige
Action-/Speichercode sind entfernt. Home-Editor beginnt im Einstellungsbereich
mit „Menü oben“, danach kommen unverändert Neues Thema, Medien-Collage, Collage,
Galerie und gegebenenfalls Karussellübernahme. Auch ältere CMS-Snapshots mit
`homeLook: '1'/'3'` werden als Wechselspiel dargestellt; die Daten werden dafür
nicht in Produktion umgeschrieben. Beide Farbwelten nutzen denselben festen Look.
Bearbeitung von Themen, Unterseiten, Alben, Fotomodulen und Karussells bleibt erhalten.

Prüfung bestanden: 24 Tests in `node --test tools/test-home-features.mjs`;
`tools/test-browser-home-editor-scope.mjs` in Chromium und WebKit (fester Look
trotz altem CMS-Wert, kein Picker/Action mehr, Menü/Add-Buttons, unabhängiges
Speichern, Datumsüberschriften ohne News-Badges in Aktuell/Club/Archiv und
Archivdetail, Termin-Badges erhalten); WebKit
`tools/test-browser-navigation-dates.mjs` auf sechs Größen inklusive iPad
hoch/quer und Mobil prüft nun explizit Badges nur rechts. Alle Schreibprüfungen
verwenden isolierte lokale Testdaten. Keine CMS-/Worker-Änderung. Cache v310.
Live-Commit `65114c6d0e3ed339aadbf248e3cb2cc076248fc6`; erfolgreicher
[Pages-Lauf 42412288074](https://github.com/calvinjohncamp/tfb-website/actions/runs/42412288074).
Live-JavaScript und Service Worker per SHA-256 mit dem Paket verglichen:
identisch. Nachweis in der Dropbox-Arbeitskopie `.private/release-v310/live-proof.json`.

---

## Deckender iOS-Statusbereich v309 – 07.11.2026

Die Systemzeile für Uhrzeit/WLAN/Batterie soll beim Scrollen keine Seiteninhalte
durchscheinen lassen. `assets/css/app.css` hinterlegt den oberen Safe-Area-Inset
mit einer festen, deckenden `body::before`-Fläche in der aktuellen Seitenfarbe.
Höhe `--safe-top: env(safe-area-inset-top, 0px)`, hoher Stapelwert, keine
Touch-Ereignisse, kein zusätzlicher Layoutabstand. Auf Desktop ohne Inset Höhe 0.
Root-Hintergrund, theme-color-Meta und Manifest theme_color sind #EFEFEF;
Apple-Statusstil bleibt `default`, nicht `black-translucent`. Manifest-URL v309,
Service-Worker-Cache v309. Symbole und restliche Gestaltung bleiben erhalten.

Grundlage: [WebKit Safe-Area-Dokumentation](https://webkit.org/blog/7929/designing-websites-for-iphone-x/).
`node tools/test-browser-status-area.mjs` bestanden: beide Themen, iPad hoch/quer,
iPhone und Desktop, berechnete Deckkraft/Position, Pixelvergleich mit sichtbarem
bzw. verborgenem grellem Inhalt unter der Fläche. Die Inset-Höhen sind im lokalen
WebKit explizit simuliert; eine echte iOS-Systemleiste lässt sich damit nicht
prüfen. Abschließende Sichtprüfung auf dem iPad durch den Nutzer bleibt sinnvoll.
Live-Commit `6073382498d8933f7e944f8a2a272e7e206fb176`; erfolgreicher
[Pages-Lauf 42411944289](https://github.com/calvinjohncamp/tfb-website/actions/runs/42411944289).
HTML, CSS, Manifest und Service Worker am 07.11.2026 um 20:37 UTC per SHA-256
mit dem Paket verglichen: identisch. Nachweis in der Dropbox-Arbeitskopie
`.private/release-v309/live-proof.json`.

---

## Aktuell-Karussells im regulären Artikellook v308 – 07.11.2026

Aktuell-Karussells zeigen unter dem unveränderten Karussell nur das ausgeschriebene
Datum und eine schwarze, fette Hauptüberschrift **ohne abschließenden Punkt**.
Überüberschrift (`kicker`) und Unterüberschrift (`subtitle`) werden dort nicht
angezeigt. Es gibt weiterhin keinen Datums-Button auf dem Karussell. Datum,
Überschrift und Fließtext übernehmen dieselben Größen, Zeilenhöhen und Abstände
wie normale Aktuell-Artikel, identisch in Gelb-Blau und Rot.

Die Anpassung erfolgt ausschließlich bei der Darstellung in `mediaNewsPost`
(`assets/js/site.js`), nicht durch Löschen oder Umschreiben der gespeicherten
Felder. Home behält alle drei Texte und den originalen Titel einschließlich
Punkt. Hin-/Rückverschieben und Kopieren müssen die Werte unverändert erhalten.
Die größeren Karussell-Schriftregeln in `assets/css/home-media.css` gelten nicht
mehr für die Aktuell-Seite; Archive behalten ihre bisherige Darstellung.
Karussell-Bewegung und Detailansichten bleiben unverändert. Cache v308.

`tools/test-browser-media-transfer.mjs` prüft jetzt zusätzlich in beiden Themen
und drei Größen (834×1194, 1194×834, 1440×1050) die berechnete Typografie direkt
gegen einen normalen Artikel, fehlende Zusatzzeilen/Datums-Buttons, erhaltene
Originaldaten und wieder sichtbare Home-Überschriften nach dem Rückverschieben.
Die bestehenden Prüfungen für Kopien, unabhängige Bearbeitung, eindeutige IDs
und alte Detail-/Archivlinks bleiben enthalten. Alle Testdaten sind lokal isoliert.
Chromium und WebKit: alle Prüfungen bestanden. Live-Commit `956a8dbde2383267952a59f892e19a44e5f5ad3d`;
erfolgreicher [Pages-Lauf 42411315506](https://github.com/calvinjohncamp/tfb-website/actions/runs/42411315506).
Live-CSS, JavaScript, beide Mail-Vorschauen und Service Worker am 07.11.2026,
20:30 UTC per SHA-256 mit dem Paket verglichen: identisch. Nachweis in der
Dropbox-Arbeitskopie `.private/release-v308/live-proof.json`.

---

## Aktueller verbindlicher Stand v307 – 07.11.2026

Diese Zusammenfassung hat Vorrang vor älteren, widersprüchlichen Farb- und
Icon-Angaben weiter unten. Die freigegebene Karussell-Bewegung aus v300 bleibt
unverändert. Schriftarten, Magazinlayout und helle Hintergründe beibehalten;
die verworfenen Farb-/Schriftentwürfe nicht wieder einführen.

### Aktuelle Korrekturen

- Aktuell: „Eine Idee nimmt Gestalt an.“ und die anderen Karussell-Überschriften
  sind in **beiden Farbwelten schwarz, fett und ohne Unterstreichung**. Die
  spezielle rote Überschrift aus v306 ist aufgehoben; keine nicht editierbare
  Farbausnahme mehr einführen.
- Sport/Mannschaften: Aktive Mannschafts-/Saisonauswahl `.team-seasons button.on`
  hat in Gelb-Blau Signature-Blau (#001D3D) als Hintergrund und weiße Schrift.
  In Rot bleibt sie schwarz (#171717) mit weißer Schrift. Beim Wechsel folgt die
  Gestaltung der Auswahl. Keine globale Änderung an Dating-Pills.
- Service-Worker-Cache v307. Keine Änderung an CMS-Inhalten oder Mailversand.

### Freigegebene Farbwelt und Bearbeitung (v302–v306)

- **Gelb-Blau ist die Voreinstellung**, gespeicherte ausdrückliche Auswahl Rot
  bleibt erhalten (`tfb_brand_theme`: club/signature). Signature-Gelb #FFC300,
  Signature-Blau #001D3D; Rot #C4553A. Heller Hintergrund #EFEFEF.
- Gelbe Textbetonung ausschließlich als **Freihand-Textmarker**. Kein trockener
  Stift, keine langen gelben Unterstreichungen, keine gelbe Fließtextschrift.
  SVG `assets/brand/tfb-highlight-freihand.svg` als nativer Inline-Hintergrund mit
  `box-decoration-break: clone` (auch WebKit); keine vermessenen Overlay-Rechtecke.
  Große Initiale P und Home-Nummerierungen dürfen gelb bleiben.
- In Rot bedeutet Hervorheben weiterhin rote Schrift, ohne Textmarker oder
  automatische Unterstreichung. Fett ist eine getrennte Editorfunktion. Bestehende
  `{rot}`, `{marker}` und neue `{hervorheben}`-Auszeichnungen werden unterstützt.
  Editor zeigt themengerecht „Textmarker“ bzw. „Rot“. Home 05 enthält ausdrücklich
  fette alte Hervorhebungen bei „Frühjahr 2027“ und „COMING SOON“; gelbe Legacy-
  Darstellung bleibt wie freigegeben, neue Hervorhebungen erlauben separates Fett.
- Unter Aktuell wurden nur die damals vorhandenen Artikeltexte bereinigt:
  Jugendmeisterschaft b-mv3zxn57, 50 Jahre p-1, U18 b-mv3zr4uq. Künftige
  Hervorhebungen im Admin bleiben möglich. Ausgeschriebenes Datum bleibt betont;
  automatische Medien-Kicker sind neutral. CMS-Stand 66, Sicherung vor Bereinigung
  „Vor Aktuell-Bereinigung und blauem App-Symbol · 07.11.2026“; Nachweise unter
  `.private/release-v305/`. Keine pauschale CSS-Unterdrückung aller Markierungen.
- Datums-Buttons: Gelb-Blau gelber Hintergrund/blaue Schrift; Rot schwarzer
  Hintergrund, **alle** Teile (Wochentag, Zahl, Monat) weiß und vollständig deckend.
- Menü in beiden Welten ohne aktive Pill-Fläche, auch iPad hochkant. Gelbe Linie
  mit ca. 8,6px Textabstand über Hoch-/Querformat und Desktop (20% weniger als
  früher gelb hochkant); rote Linie mit ca. 5px wie freigegebener roter Desktop.
  Tastatur-Fokusringe bleiben erhalten.
- Home-Klickbuttons: dezenter gelber Rahmen/blaue Schrift in Gelb-Blau; expliziter
  Signature-Rot-Rahmen mit normaler dunkler Schrift in Rot.
- Club History „Mehr erfahren“: kleiner transparenter Outline-Button wie Home,
  38px hoch, 1px Rahmen, ohne Pfeil. Club-Beiträge und Archiv in Gelb-Blau blau
  mit weißer Schrift; Archiv ohne Pfeil, Route planen behält Richtungspfeil.
- Club Mitgliedsantrag: Vorschau als schließbarer Dialog (X, Escape, Hintergrund,
  Fokusrückgabe). In Gelb-Blau gelb-blaue Beispielmail, in Rot rote Beispielmail.
  `tools/build-membership-mail-variants.mjs` erzeugt die gelbe Variante aus der
  roten Vorlage. Beide HTML-Dateien sind explizit in Pages-Build und Cache erlaubt.
  **Nur Vorschau**, tatsächlicher Mailversand wurde nicht verändert.
- App-Symbole und Favicon seit v305: **Signature-Blau statt Schwarz**, gleiche
  TFB-Geometrie, deckendes quadratisches #EFEFEF, ohne Ball/Unterzeile. iOS180,
  App192/512 und maskable512; PNG64 und ICO16–256. Erzeugung über
  `tools/build-app-icons.mjs` und `tools/build-brand.sh`. Alte v301-Schwarz-Angaben
  sind historisch. Icon-URLs mit v305 sind weiterhin richtig.
- Chat und Dating bleiben gestalterisch wie freigegeben.

### Quellen, Prüfung und Veröffentlichung

Aktuelle Gestaltung: `assets/css/yellow-editorial.css` (letztes öffentliches
Stylesheet), Editor/Rendering `assets/js/site.js`, Themenstandard
`assets/js/design-preview.js`, Cache `sw.js`. Keine Änderungen an der bestätigten
Karussell-Geometrie oder Bewegung nötig.

Für v307 bestanden die isolierten WebKit-Prüfungen
`node tools/test-browser-team-pills.mjs` (390/834/1194px, beide Themen,
Auswahlwechsel, kein horizontaler Überlauf) und
`node tools/test-browser-navigation-dates.mjs` (sechs Größen von Mobil bis
Desktop, Menülücken, keine Pill, Datumsfarben, schwarze Karussell-Titel auch
bei Hover). Weitere etablierte Prüfungen: `tools/test-browser-theme-polish.mjs`,
`tools/test-browser-design-preview.mjs`, `node --test tools/test-home-features.mjs`.
Browserprüfungen verwenden isolierte lokale Fixtures, keine Produktionsschreibzugriffe.

Live: https://joern-kaemper.de/ — GitHub `calvinjohncamp/tfb-website`, main;
Veröffentlichung bewusst über Workflow `publish-website.yml`, nicht automatisch
bei jedem Push. `python3 tools/prepare-pages.py` paketiert nur öffentliche,
bereits versionierte Dateien nach `_site`. Vor dem Build neue Assets explizit
stagen; weder private Nachweise noch node_modules veröffentlichen.

**Arbeitskopie beachten:** Dropbox enthält zahlreiche ältere/unabhängige lokale
Änderungen. Nicht pauschal committen/pushen oder auf main zurücksetzen. Live-Quelle
ist GitHub main. Für weitere Releases davon sauber auschecken und nur beauftragte
Änderungen übernehmen. Dieses Release wurde isoliert in
`/private/tmp/tfb-release-yellow-blue-v302-local` vorbereitet; der temporäre Pfad
ist keine dauerhafte Quelle. Gestaltungsdateien, Tests und diese Dokumente werden
in die Dropbox-Arbeitskopie zurückgespiegelt. Letzter vorheriger Live-Stand v306:
`f9fa7133f0b8abfac65c7e3e2a0f7557ae2a69a0`, Pages-Lauf `42408618034`.
v307 ist live: Commit `8cda1c095c94b99d2f7c6f43b52a1ff66a06b629`, erfolgreicher Pages-Lauf
[`42409923819`](https://github.com/calvinjohncamp/tfb-website/actions/runs/42409923819).
Am 07.11.2026 um 20:12 UTC wurden CSS, site.js, beide Mail-Vorschauen und sw.js
per SHA-256 mit dem Release-Paket verglichen: identisch. Nachweis in der
Dropbox-Arbeitskopie `.private/release-v307/live-proof.json`. Diese Dokumentation
wird anschließend separat gesichert; dafür ist kein weiterer Pages-Lauf nötig.

---

## Favicon passend zum App-Symbol v301 – 07.11.2026

Auf Nutzerwunsch schwarzes TFB auf hellem (#efefef), vollständig quadratischem
Hintergrund ohne abgerundete Ecken, Ball oder Unterzeile. Favicon-Quelle identisch
mit bestehendem App-Quellmotiv. PNG 64px und ICO 16–256px neu erzeugt; Build-Pipeline
hält die Motive künftig synchron. Index/Präsentationsseite mit Favicon-Link ?v=301,
Cache v301. App-Icons und verbindlich freigegebenes Karussell v300 unverändert.
Live-Commit `46949041a6b7a08b82467a43510831f2630e5965`, erfolgreicher Pages-Lauf
`42381459481`. Quellvergleich, deckende helle Ecken, PNG-/ICO-Größen und visuelle
64px-Prüfung erfolgreich. Live-Dateien stimmen mit Veröffentlichungspaket überein.
Nachweise `.private/release-v301/`; Details `docs/RELEASE-v301.md`.


## Verbindlich freigegebener Karussell-Stand v300 – 07.11.2026

Der Nutzer hat die aktuelle Live-Version ausdrücklich als „mit Abstand die beste
Version bisher“ und „perfekt“ bestätigt. **v300 ist damit der freigegebene
Referenzstand für Home, Aktuell und die Vollbildansicht.** Künftige Arbeiten bauen
darauf auf; die bestätigte Bewegung und Darstellung nicht beiläufig verändern.
Die vorherigen Versuche mit vollständigem Ausblenden und Wiederauftauchen der
Karten sind verworfen.

Festgehaltene Gestaltung und Bedienung:
- Karten bleiben sichtbar und deckend; nur ihre Überlappungsreihenfolge wird weich
  überblendet. Das zurückwandernde Motiv verschwindet optisch hinter den anderen,
  statt vollständig auszublenden und erneut aufzutauchen.
- Bewegung 1,6 Sekunden; erste Ruhezeit 3 Sekunden, weitere Ruhezeiten 2,1 Sekunden.
- Persistente Zeichenfläche ohne temporäre DOM-Bildkopien; bestehende Linkkarten,
  Unterseiten, Lupe/Vollbild, Play/Pause und Escape bleiben erhalten.
- Startmodus pro Karussell im Admin: automatisch oder erst per Play. Touch-Fokus
  stoppt den Autostart nicht; reduzierte Bewegung bleibt berücksichtigt.
- Erstes Motiv priorisiert laden; leere Bildrahmen verborgen halten; Bewegung erst,
  wenn aktuelles und nächstes Motiv dekodiert sind.
- Bestehende Funktionen zum Kopieren/Verschieben zwischen Home und Aktuell sowie
  die Vermeidung doppelter Artikel im Clubarchiv bleiben Teil des Gesamtstandes.

Technische Referenz: Commit `1a7ec1804c42541ec9f227c0264964007bb94c0f`,
Pages-Lauf `42380189446`, Cache v300. Prüfungen und Live-Nachweise unter
`.private/release-v300/`; Implementierungsdetails im nachfolgenden v300-Eintrag
und in `docs/RELEASE-v300.md`. Diese Aktualisierung dokumentiert die Freigabe;
keine Änderung am Website-Code oder an veröffentlichten Inhalten.


## Karten bleiben beim Tiefenwechsel sichtbar v300 – 07.11.2026

Nutzer findet v299 weicher, aber Null-Ausblenden und Wiederauftauchen unpassend.
Ersetzt deshalb die Fade-Kurve einzelner Karten: sämtliche echten Karten auf
Deckkraft 1. Überblendung nur der Überlappungsreihenfolge, nicht des ganzen Motivs.
Live-Commit `1a7ec1804c42541ec9f227c0264964007bb94c0f`, erfolgreicher Pages-Lauf
`42380189446`, Cache v300. Kein CMS-/Worker-Eingriff.

Eine persistente, aria-hidden Canvas-Fläche zeichnet zwei deckende Kartenordnungen
in wiederverwendbare Offscreen-Puffer. Premultiplizierte additive Mischung hält
übereinstimmend bedeckte Bereiche deckend statt den Hintergrund durchscheinen zu
lassen. Frei liegende Teile der zurückweichenden Karte behalten ihre volle Farbe;
nur die Überlappung geht sanft von einer Reihenfolge in die andere über. Keine
DOM-Bildkopien und kein Schichten-Auf-/Abbau bei jedem Schritt. Ursprüngliche
Linkkarten bleiben mit Positionen, Labels, Fokusrahmen und Tiefensortierung für
Unterseiten-/Tastaturbedienung erhalten; ihre Bilder/Schatten werden bei aktiver
Zeichenfläche verborgen. Ohne Canvas-Kontext bleiben normale Karten sichtbar.
Größe/Form, 1,6-s-Bewegung, Ruhezeiten und Ladepriorität/-Bereitschaft unverändert.
Auflösung bis DPR 2, maximal 3 Mio. Pixel pro Fläche; Freigabe bei Abbau. Zoom
bekommt eigene Zeichenfläche. Nach Bild-Decoding sofortiger Neuaufbau.

Chromium/WebKit-Screenshotprüfung aller fünf Wechsel Home/News/Zoom erfolgreich.
Zusätzlicher Pixeltest des frei liegenden linken Rands jeder ausgehenden Karte
weist volle Motivfarbe am Mittelpunkt nach, kein Null-Fade. Genau fünf Original-
Linkkarten plus eine persistente Canvas-Fläche. Lade-, Render-, Zoom-, Standzeit-,
Home- und iPad-Touchprüfungen erfolgreich. Physisches iPad weiterhin nur durch
Nutzer prüfbar. Live-Dateihashes identisch, Home/Aktuell mit deckenden Karten
und genau einer Zeichenfläche fehlerfrei; CMS-Revision 63 unverändert.
Nachweise `.private/release-v300/`.


## Langsame Überblendung und Bildlade-Reihenfolge v299 – 07.11.2026

Nutzer bestätigt v298 auf echtem iPad ohne Flackern, wünscht aber langsameres
Ausblenden. Zusätzlich Ladeverzögerung mit dunkler Fläche/leeren Karten gemeldet.
Live-Commit `ab05cffb604a62dd60acd21b1f06755c98f9aaf2`, erfolgreicher Pages-Lauf
`42379613088`, Cache v299. Kein Worker-/CMS-Schreibzugriff.

Orbit-Bewegung 1600 statt 900 ms. Fade über den gesamten Schritt, nicht nur
kurz um die Mitte: ausgehendes Motiv blendet langsam aus, nächstes wird frei,
Ebenenwechsel weiterhin bei Deckkraft null und ohne temporäre Bildebenen.
Ruhezeiten 3 s initial/2,1 s wiederkehrend und Foto-Diashow unverändert.

Erstes Motiv eager/high priority; öffentliches CMS lädt es bereits vor dem
App-Rendering für die angeforderte Home-/Aktuell-Seite vor. Andere Motive lazy/low.
Karten erst nach Bild-Decoding sichtbar, dadurch keine leeren Schattenrahmen.
Animation wartet auf aktuelles und nächstes dekodiertes Motiv; erstes Bild kann
vor allen übrigen erscheinen. Originaldateien unverändert (Umkleide 8,6 MB PNG).
Keine Komprimierung zugesagt: erster Netzwerkdownload bleibt nötig, spätere
Dateigrößenoptimierung bleibt möglich. Systemische Nachfolger-Warteprüfung gilt
auch für neue Artikel; keine fest verdrahteten Artikel-/Medien-IDs.

Chromium/WebKit mit absichtlich verzögerten Antworten: Priorität, kein leerer
Rahmen, frühe Einzelbildanzeige, Halten bis Nachfolger bereit und Weiterlauf.
Screenshot-Kontinuität für alle fünf Wechsel Home/News/Zoom und halbtransparente
Karte bei Viertelschritt geprüft. Render-, Zoom-, Standzeit-, iPad-Touch-, Home-
und echte zentrale Redaktions-/Sicherungstests erfolgreich. Ungültige Desktop-
Bildfixture durch gültige SVGs ersetzt, da ungeladene Karten jetzt verborgen sind.
Live-Dateihashes identisch; Home/Aktuell animieren fehlerfrei im WebKit-Touchtest,
CMS-Revision 63 unverändert. Eigene physische iPad-Prüfung bleibt nicht möglich.
Nachweise `.private/release-v299/`.


## Kleine iPad-Karussellansicht: Überblendung ohne Kopien v298 – 07.11.2026

Live-Commit `3e80ec8842f9a5496fd94ee681fcddb03e0ac983`, erfolgreicher Pages-Lauf
`42378916645`, Cache v298. Nutzer meldet trotz v297 und zweier App-Neustarts
weiterhin Flackern oben links im kleinen Karussell; Lupe/Vollbild funktioniert.
Die v297-Emulation hat den tatsächlichen Gerätefehler nicht erfasst.

Ersetzt v297-Übergang: KEINE temporäre Vordergrundkarte und KEINE Bühnenkopie.
Nur die vorhandenen Karten werden animiert. Zurückweichende Karten blenden vor
dem mittigen Ebenenwechsel aus und danach wieder ein; Reihenfolge wechselt,
während diese Karten transparent sind. In Ruhe sind alle Motive deckend.
Zweidimensionale Transformation statt translate3d; erzwungene GPU-Hinweise weg.
Gilt Home, Aktuell und Vollbild; Größen/Positionen, Zeiten, Startmodus und
Bewegungspräferenz unverändert. Keine CMS-/Worker-Änderung.

Neuer Test `tools/test-browser-inline-carousel.mjs`: Pixelvergleich aller fünf
kritischen Ebenenwechsel in kleiner Home-, kleiner News- und großer Ansicht,
Chromium/WebKit, Touch und DPR 2. Dauerhaft fünf echte Karten, keine temporären
Bildebenen; Ruhepositionen deckend. Bestehende Render-, Zoom-, Standzeit-, Home-
und iPad-Autostarttests erfolgreich. Keine eigene physische iPad-Prüfung;
Nutzerrückmeldung zur Hardware bleibt maßgeblich. Live-Dateihashes stimmen überein,
Home/Aktuell animieren im WebKit-Touchtest fehlerfrei; CMS-Revision 63 unverändert.
Nachweise `.private/release-v298/`.


## Ruhige Karussell-Übergänge und Play/Pause v297 – 07.11.2026

Live-Commit `9cb8f0e072e883f4388cd4c8e850ff23da49fd4a`, erfolgreicher Pages-Lauf
`42367865406`. Cache v297; kein Worker- oder CMS-Schreibzugriff.

Nutzer bestätigt: iPad-Autostart läuft nach Abschalten von „Bewegung reduzieren“
und Neustart der App. Bestehende Präferenzlogik erhalten, keine neue Ausnahme.
Das Durchscheinen der ursprünglichen Fünfer-Collage wurde durch eine vollständig
geklonte, ausblendende Bühne verursacht. Jetzt wird nur die ausgehende vorderste
Karte über 360 ms ausgeblendet; übrige Karten direkt stabil sortiert. Keine
komplette Bühnenkopie mehr, weder auf Home/Aktuell noch in Vollbild. Erstaufbau
zeigt Karten erst nach Positionierung. Bewegung und längere Verweilzeiten bleiben.

Play/Pause durch SVG statt Schriftzeichen; Foto-Viewer kompakt, dunkler Button
mit weißem Symbol. Home-/Aktuell- und Video-Steuerung mit denselben SVG-Formen.
Unveränderter Zustand ersetzt das SVG nicht bei Fokus, damit Klickziele stabil
bleiben. Chromium- und WebKit-Pixelprüfung bestätigt sichtbare Vordergrundkarte;
keine doppelten Bühnen, höchstens eine einzelne Übergangskopie. Home-, Chat-,
Zoom-, Standzeit- und iPad-Touchtests erfolgreich. Keine eigene Hardwareprüfung.
Live-Hashes identisch, WebKit-Touch animiert Home und Aktuell fehlerfrei.
CMS-Revision 63 unverändert. Nachweise: `.private/release-v297/`.


## TFB-Kommentare, Moderation und längere Bildanzeige v296 – 07.11.2026

Live-Commit `818fbb272a4df640ef857de6d03557434e407826`, Pages-Lauf
`42366565974` erfolgreich. Worker-Version
`93e415fb-9d8d-433d-90da-6fc1f158a75c` veröffentlicht.

Neue Anforderung ersetzt die v294-Beschränkung auf Beiträge: Auch neue und
bearbeitete eigene Clubchat-Kommentare haben für echte Admins die Auswahl
persönlich / TFB. Gemeinsamer senderPicker mit Beiträgen; Standard pro neuem
Kommentar persönlich. Rundes TFB-Symbol und Name Tennisfreunde Bielstein wie
bei offiziellen Posts. Echte authorId/ownerId bleibt erhalten. Server prüft
Admin + Club-Scope, gefälschte Absender werden abgewiesen. Normale Mitglieder
haben keinen Umschalter. Home/Aktuell erhalten keine Absenderwahl.

Moderation: Ausblenden mit zweiter Bestätigung; danach öffentlicher Platzhalter
„Dieser Kommentar wurde von den Tennisfreunden Bielstein ausgeblendet.“
Admins können Wieder anzeigen verwenden, Originaltext/Fotos bleiben dafür
intern erhalten. Eigene Kommentare weiterhin löschbar. Fremde Kommentartexte
sind nicht umschreibbar. Moderation speichert hidden/moderatedAt/moderatedBy
serverseitig, erhält Eigentümer und prüft Revisionen sowie gelöschte Datensätze.
Kommentarinhalte werden vor Auslieferung an Gäste/Nichtadmins redigiert;
öffentlicher Medienzugriff auf ausgeblendete Kommentarbilder entfällt, außer
bei unabhängiger Veröffentlichung derselben Datei in einem sichtbaren Beitrag.
Ausgeblendete Kommentare erzeugen keine normalen Kommentarhinweise.

Gastansichten von Chat/Mannschaften übernehmen Änderungen ungefähr alle 10 s;
aktive Formulare, Login und Bildansichten werden dabei nicht unterbrochen.
Gastcache nach Speichern/Logout invalidiert. Die Moderationsaktion hält den
betroffenen Kommentar im Blick; Platzhalter zählt weiterhin als Kommentar.

Mehr Verweildauer: Foto-Diashow 3,4 statt 2,4 s je Bild; Orbit auf Home/Aktuell
inkl. Vollbild: erster Start 3 statt 2 s, wiederkehrende Ruhezeit 2,1 statt 1,1 s.
Übergang 900 ms bzw. Foto-Fade 360 ms unverändert. Manuelles Blättern bleibt
sofort, Clipdauern und explizite Textzeiten bleiben unverändert. Die v295-
Safari-/Touch-Korrektur und bewusstes Play bei reduzierter Bewegung bleiben aktiv.

15 Servertests erfolgreich: Rollen, Absenderwechsel, Besitzer, Redigierung,
Mediensperre, Moderation, Restore, Konflikte/gelöschte Kommentare. Echter Worker
im isolierten Browser: TFB/persönlicher Kommentar, Bearbeiten, Ausblenden mit
Bestätigung, öffentliche Ansicht, Wiederfreigabe, mobile Breite und automatischer
Gastabgleich. Bestehende Kommentar-/Foto-/Emoji-, Chat-Karussell-, Home-, Zoom-
und Safari-Touchprüfungen erfolgreich. Timingtest bestätigt längere Standzeiten.
268 Pages-Dateien; Worker-Dry-Run erfolgreich. Live-Dateihashes identisch; echte
öffentliche Daten lesend geprüft (5 Kommentare, keine live ausgeblendet).
Home/Aktuell animieren im WebKit-Touchprofil, keine JS-Fehler. CMS-Revision 63
und Dokumente vor/nach Release identisch; keine Live-Posts/Kommentare durch uns
umgestellt oder moderiert. Nachweise `.private/release-v296`, Details
`docs/RELEASE-v296.md`. Originaldateien gezielt synchronisiert; lokale SW-
Abweichungen erhalten und nur Cacheversion angehoben.

## Safari-/Touch-Karussellkorrektur v295 – 07.11.2026

Live-Commit `a740d922e2024fb9f45e752f95969f17bd5dbbc6`, erfolgreicher frischer
Pages-Lauf `42365432710`. Erster Lauf `42364618697` hing in syncing_files und
wurde nach 10 Minuten abgebrochen; gh run rerun erzeugte zwei github-pages-
Artefakte und schlug fehl. Daher bei solchen Publishing-Retries einen frischen
workflow_dispatch-Lauf starten, statt denselben Upload-Job erneut auszuführen.

Reproduzierter WebKit-Touchfehler: verbliebener Bildkarten-Fokus stoppte die
Animation. Fokus-Pause gilt jetzt nur nach echter Tab-Tastaturbedienung; Touch/
Pointer hebt sie auf. Hover-Pause nur bei passender Hover-/Feinzeiger-Fähigkeit.
Play wird nicht vom darüberstehenden Mauszeiger blockiert. IntersectionObserver
setzt Timer nur bei geänderter Sichtbarkeit neu. Neue Modality-Listener werden
beim Abbau entfernt. Home/Aktuell verwenden denselben Controller.

„Bewegung reduzieren“ verhindert weiterhin Autostart. Play bleibt aber verfügbar
und kann die Bewegung für diese Ansicht ausdrücklich freigeben; diese Wahl wird
ins Vollbild und zurück übernommen, nicht dauerhaft gespeichert. Neu aktivierte
Reduktionspräferenz hebt die Freigabe auf. Bestehende Admin-Startwahl bleibt gültig.

Safari/WebKit und Chromium mit simuliertem iPad-Touchprofil geprüft: Autostart,
verbliebener Touch-Fokus, manueller Start, reduzierte Bewegung, explizites Play,
Vollbild und Pause. Zusätzlicher Desktopkontext prüft erhaltene Tastaturpause.
Home-Medien-/Zoom-Browserchecks erfolgreich, 268 Pages-Dateien. Live-WebKit-Test
(1024x1366, Touch): Home und Aktuell auto animieren, keine JS-Fehler; Dateihashes
gleich zum Teststand. Kein physisches iPad ferngesteuert. Keine Backend- oder
CMS-Schreibzugriffe durch das Release. Während der langen Veröffentlichung
stieg die Live-CMS-Revision von 62 auf 63 (page:home); diese parallele Änderung
wurde erhalten. Nachweise `.private/release-v295`, Details `docs/RELEASE-v295.md`.
Originaldateien gezielt synchronisiert; lokale SW-Abweichungen erhalten.

## Offizieller TFB-Absender im Chat v294 – 07.11.2026

Live-Commit `c4368c6e7cd93cd14b34f5429fef8b48f7904d88`, Pages-Lauf
`42364047817` erfolgreich; Worker-Version
`a1df44c0-5905-4fa3-a9fa-8469f166bf10` veröffentlicht.

Nur bei Club-Chatbeiträgen erhalten tatsächliche Admins im Composer oben die
Auswahl „Veröffentlichen als“: persönlich (eigenes Profilbild/Name) oder TFB.
Die Wahl ist pro Beitrag, Standard neuer Beiträge bleibt persönlich. Bearbeiten
lädt die gespeicherte Wahl; Wechsel in beide Richtungen wird zentral gesichert.
Home/Aktuell und Kommentare erhalten keinen Absenderumschalter. Normale Mitglieder
sehen die Funktion nicht; die echte Adminberechtigung wird serverseitig geprüft.

TFB-Symbol: vorhandenes App-Asset `assets/icons/icon-512.png` (reines TFB ohne
Ball/Unterzeile), im hellen #efefef-Kreis mit 1px schwarzem Rahmen und Innenabstand.
Offizielle Posts zeigen „Tennisfreunde Bielstein“ mit diesem Symbol in Chat,
Übersicht und Gastansicht. Textbeiträge brauchen kein Bild. Datenfeld
`authorMode: tfb`; echte authorId/ownerId bleibt zur Rechteprüfung/Nachvollziehbarkeit
beim veröffentlichenden Admin. Kein gemeinsames Konto/keine Rollenänderungen.
Künftige Admins können mit ihrem eigenen Konto offiziell veröffentlichen.
Kommentare bleiben persönlich, auch unter einem offiziellen Beitrag.

Server lässt ausschließlich Admin + Club-Scope als TFB zu; unbekannte Modi und
Fälschungen werden abgewiesen. Beim Wechsel zurück wird `personal` explizit im
lokalen Änderungsauftrag geführt, zentral wieder ohne TFB-Kennzeichnung gespeichert.
Zusätzlich wird die v293-Karussellwahl bei Videos jetzt zentral erhalten (bislang
hat der Server dieses Feld bei Video-Designs verworfen); Videoimport unverändert.

13 Server-/Zugriffstests erfolgreich, einschließlich Besitz-ID, Fake-Absender,
Gastansicht, persönliche Kommentare und zweiter Admin. Isolierter Browser mit
echtem Worker: text-only veröffentlichen, Neuladen, beide Absenderwechsel,
Standard pro Beitrag, Gastansicht und fehlende Auswahl für Nichtadmins.
Desktop/390px visuell geprüft. Bestehender Chat-Karussell-Browsercheck erfolgreich.
268 Pages-Dateien, Worker-Dry-Run erfolgreich. Live-Dateien bytegleich; öffentlich
4 vorhandene Beiträge, private Admin-API anonym 401. CMS-Dokumente und Revision 62
vor/nach Release unverändert; keine bestehenden Posts umgestellt. Nachweise
`.private/release-v294`, Details `docs/RELEASE-v294.md`. Originaldateien gezielt
synchronisiert, lokale SW-Anpassungen erhalten und nur Cacheversion aktualisiert.

## Chat-Medienauswahl: Collage zuerst, Videos gezielt v293 – 07.11.2026

Live-Commit `4aa6e4027fc099be16fdd345cc9d782b088147dc`, Pages-Lauf
`42363329128` erfolgreich. Keine Backend-/CMS-Inhaltsänderung.

Chat-Composer: direkte Radios in der Reihenfolge Collage, Diashow, Karussell.
Neue Fotobeiträge beginnen mit Collage; gespeicherte Foto-Darstellung bleibt
beim Bearbeiten erhalten. Sobald mindestens ein Video enthalten ist (Hoch-,
Querformat oder mit Fotos gemischt), sind Collage und Diashow sichtbar, aber
nativ disabled und optisch reduziert. Karussell wird ausgewählt und auch im
Payload gespeichert. Videos starten weiter einzeln über Play. Wird das letzte
Video aus demselben Entwurf entfernt, werden Fotooptionen wieder aktiv und
die zuvor gewählte Fotoanzeige wiederhergestellt, sonst gilt Collage.

Zwei isolierte Browserprüfungen erfolgreich: bestehender Karussell-Ablauf mit
neuer Reihenfolge, Standard, Tastatur, Speichern/Neuladen und bisherigen
Darstellungen; Video-UI für 9:16/16:9, deaktivierte Optionen, gespeichertes
Karussell und Foto → Video → Foto. Der unveränderte Videokonverter ist im neuen
UI-Test synthetisch ersetzt, kein realer Transcoding-Test behauptet. 268 Pages-
Dateien; Live-Dateien bytegleich zum Teststand. CMS-Dokumente und Revision 62
vor/nach Release unverändert. Details `docs/RELEASE-v293.md`, Nachweise
`.private/release-v293`. Originalarbeitsstand gezielt synchronisiert; lokale
SW-Abweichungen erhalten, nur Cacheversion angepasst.

## Getrennte Home-Editoren und eindeutiges Clubarchiv v292 – 07.11.2026

Live-Commit `8000ff4d364c89bfdea191b3ff344442ee3f6353`, Pages-Lauf
`42363004023` erfolgreich. Kein Backend-Deployment, keine CMS-Inhaltsänderung.

Home-Bearbeitung: oben bleiben allgemeiner Look und Menü, darunter einzelne
Inhalte mit eigenen Werkzeugen. Normale Themen öffnen nur Startseite und
Unterseite dieses Themas. Themen-Nummernleiste, Plus und Wechsel/Speichern zu
anderen Themen im Formular entfernt. Karussell-, Galerie- und Collageneditoren
bleiben eigenständig. Bereits verknüpfte Fotokollagen haben am Thema einen
eigenen Button „Fotokollage bearbeiten“; dieses Formular enthält nur die
Fotokollage, keine Themen-/Start-/Unterseitenwechsel und keine Löschaktion für
das gesamte Thema. Speichern sichert den jeweiligen Bereich, Fertig beendet
die Seitenbearbeitung. Keine automatische Veröffentlichung beim Feldwechsel.

Clubarchiv: gleiche Karussells aus Home/Aktuell nur einmal. Bestehende Kopien
über Quell-ID und erhaltene Eintrags-IDs der Mediensammlung erkannt; neue
Transfers/Kopien tragen zusätzlich stabile `articleId`. Quellartikel bleibt
beim Kopieren unverändert. Bei zwei Platzierungen bevorzugt das Archiv Aktuell.
Alte Archiv-URLs der ausgeblendeten Kopie bleiben Aliase auf die gemeinsame
Darstellung. Unabhängige Artikel mit gleichen Fotos werden nicht zusammengelegt.
Home/Aktuell behalten ihre unabhängigen, getrennt bearbeitbaren Platzierungen.

36 Unit-Tests erfolgreich; Browser für getrennte Themen-/Unterseiten-/Album-,
Galerie-, Collagen- und Karussellbearbeitung, unabhängige Speicherungen und
Fertig. Bestehende Transfer-/Archivlinks und Home-Medien regressionsgeprüft.
268 Pages-Dateien. Live-GET-Prüfung: ausgelieferte Dateien bytegleich, bekannter
Home/Aktuell-Doppelartikel erscheint einmal, alter Kopie-Archivlink funktioniert,
keine JS-Fehler. CMS-Dokumente und Revision 62 vor/nach Release unverändert.
Nachweise `.private/release-v292`, Details `docs/RELEASE-v292.md`. Taskdateien
gezielt in den Originalarbeitsstand übernommen, lokale SW-Abweichungen erhalten.

## Karussell-Start, Gäste und Mannschaftspflege v291 – 07.11.2026

Live-Commit `5fc9fae7e11e6ceeb1f195dd12947306ada8e4e6`, Pages-Lauf
`42361989353` erfolgreich. Worker-Version
`edcbedfe-f8e8-43fd-9b60-de0c98913edb` veröffentlicht.

- Karussell-Editor Home/Aktuell: direkte Radios „Animation startet sofort“ /
  „Animation erst per Play starten“. Feld `animationStart: auto|manual`, ohne
  Feld bleibt bisheriges Auto-Verhalten. Die Wahl bleibt beim Kopieren und
  Verschieben erhalten. Play/Pause und Vollbild übernehmen den aktuellen Zustand;
  ein neuer Aufruf beginnt gemäß Startwahl. Bestehende Artikel wurden nicht umgestellt.
- Kiosk, Chat, Dating 2.0 stehen auch Gästen im Menü offen. Öffentlicher Katalog
  mit Preisen; veröffentlichte Club- und Mannschaftsbeiträge samt Kommentaren
  und zugehörigen Medien über eigene öffentliche Projektion. Verborgene oder
  gelöschte Beiträge und nicht verknüpfte Medien bleiben gesperrt. Keine Konten,
  Mitglieds-E-Mails oder geschützten Profilfotos im öffentlichen Beitrags-DTO.
- Dating zeigt Gästen Match-/Trainings-/Gruppen-Einstieg mit Anmeldung für
  Aktionen; persönliche Einladungen, Antworten und Gruppenlisten bleiben privat.
  Kiosk-Anschreiben und Chat-Schreiben erfordern Anmeldung; Strichlisten und
  Abrechnungen werden Gästen nicht ausgegeben.
- Aktive Mitglieder: Chats/Kommentare wie bisher, jetzt zusätzlich zentral
  Teamfoto, Porträt und Berichte der eigenen `member_teams`-Zuordnung pflegen.
  Server prüft jede einzelne Feldänderung; fremde Teams und Home/Aktuell bleiben
  Admins vorbehalten. Teammedien liegen im CMS; Versionskonflikte werden gemeldet.
- Keine freie Registrierung allein über beliebige E-Mail. Bestehendes aktives
  importiertes Konto (eindeutige E-Mail/Mitgliedsnummer), erstmalig Freischaltcode
  aus Mitgliederverwaltung erforderlich. Keine Mitglieder-/Adminrollen geändert.

40 Server-/Redaktions-/Sortiertests erfolgreich; isolierte Browserprüfung für
beide gespeicherten Startoptionen, Vollbild-Play, Gastnavigation, Chat, Kiosk,
Dating und mobile Breite. Home-Medien und Zoom regressionsgeprüft. Zweigeräte-
Sync inklusive Kommentaren, Anschreiben und Wiederholung nach unterbrochener
Speicherung erfolgreich. Live nur GET: 2 Home-Karussells, 4 Chatbeiträge,
25 Kioskartikel, 4 Dating-Einstiege, keine JS-Fehler; anonyme private API-Aufrufe
401. CMS-Dokumente und Revision 60 vor/nach Release identisch. 268 Pages-Dateien.
Nachweise `.private/release-v291`; technische Notiz `docs/RELEASE-v291.md`.
Originalarbeitsstand gezielt synchronisiert, lokale SW-/Testfixture-Abweichungen
erhalten. Kein erneuter Source-ZIP-Upload; die frühere Auto-Review-Sperre dafür
bleibt unverändert bestehen und war nicht Teil dieser Veröffentlichung.

## Home-Admin und schnelle Reihenfolge v290 - 07.11.2026

Live-Commit `0f16b6cfddce5de021724edc08be27bb04e2d812`, Pages-Lauf
`42360708772` erfolgreich. Home-/Aktuell-Werkzeuge stehen in einer eigenen
statischen Kopfzeile mit passend breiten Textbuttons. Home: Position ändern,
Kopieren / verschieben und Bearbeiten. Mobile Zeilen umbrechen sauber.
Die Home-Bearbeitungsleiste überdeckt keine Artikel mehr. Fertig und
Reihenfolge ändern stehen oben und unten bereit.

Kompakte Sortierübersicht für alle Home-Elemente: Ziehen, Direktposition oder
Pfeile. Mehrere Änderungen bleiben im Entwurf und werden gemeinsam in einem
Commit gespeichert. Abbrechen verwirft den Sortierentwurf. Die Liste scrollt
separat. Anschließend wird der zuletzt verschobene Inhalt gezeigt. Nummern
und Bildseiten passen sich automatisch an. Galerie-Bildfolgen bleiben erhalten.

Öffnen lädt den aktuellen Stand. Speichern übernimmt aktuelle Inhaltsfelder;
parallele Titel-/Textänderungen bleiben erhalten. Geänderte Eintragslisten oder
Reihenfolgen werden abgewiesen. Fehler lassen den Entwurf offen. Reiner Planer
newsroom.reorder, vorhandene CMS-API mit Revisionsschutz unverändert.

38 Fachtests und neuer Home-Order-Browsertest grün: Werkzeuge ohne Überlappung
bei 1440/390/320px, Direktposition/Pfeile/Ziehen, ein Commit, keine Vorab-
Speicherung, Abbruch, Fehler/Retry, parallele Felder/Eintrag, Mobil und Reload.
Home-Medien-, Galerie- und Transfer-Browserregressionen ebenfalls grün.
Echte Inhalte nur rein lesend angesehen. Live-Dateien bytegleich; CMS-Revision
56 vor/nach identisch, alle Dokumente identisch. Keine tatsächlichen Inhalte
umsortiert, kein Worker-/Schemawechsel. Arbeitsordner gezielt aktualisiert,
übrige lokale Arbeit erhalten. Nachweise `.private/release-v290/`.
Quellarchiv-Upload weiterhin ohne neue Zustimmung ausgesetzt.

## Verbindlicher Karussell-Stand – 07.11.2026

Der Nutzer hat Home-/Aktuell-Karussells einschließlich Vollbild-Lupe, Pause,
Escape, Unterseite sowie Kopieren/Verschieben in beide Richtungen und die
aufgeräumte Admin-Dialoggestaltung ausdrücklich freigegeben. Der konsolidierte
Funktions- und Gestaltungsstandard steht ganz oben im
[Projektgedächtnis](PROJEKTGEDAECHTNIS.md#freigegebener-karussell-standard-für-home-und-aktuell--07112026).
Bei Erweiterungen diesen Standard erhalten; ältere Entwürfe weiter unten sind
historisch. Aktueller bestätigter Live-Code: v289,
`1055f4b8356d454b5ddddff661db0d6c1a147e2e`.

## Karussell-Übernahmedialog v289 – 07.11.2026

Live-Commit `1055f4b8356d454b5ddddff661db0d6c1a147e2e`, Pages-Lauf
`42356119766` erfolgreich. Nutzer empfand Kopieren-/Verschieben-Buttons
im Admin-Dialog als geklemmt. Dialog jetzt mit klarer Titel-/Metadaten-
Gliederung und mehr Abstand vor den Aktionen. Desktop zwei gleich breite
Spalten mit12px Zwischenraum, Mobil bis520px volle Breite untereinander.
Mindestens46px Buttonhöhe, mindestens16px Abstand zum vorherigen Inhalt.
Titel in normaler Schreibweise, Singular „1 Beitrag“ korrigiert.

Bestehender Browserablauf für beide Übernahmerichtungen und unabhängige
Editoränderung grün; isolierte Layoutprüfung1440/390px und visuelle Kontrolle
grün. Live CSS/JS/SW bytegleich geprüft. Keine CMS-/Workeränderung.
Gezielt im lokalen Arbeitsordner übernommen; übrige Änderungen erhalten.
Belege `.private/release-v289/`. Kein Quellarchiv-Upload ohne neue Zustimmung.

## TFB-Splash-Fensterhöhe v288 – 07.11.2026

Live-Commit `3e2c1132585413467bdbcdefba3f599dafebb94c`, Pages-Lauf
`42355766117` erfolgreich. Nutzer-Mac-Screenshot zeigte unten abgeschnittenen
Premium-Partner. Reproduziert: 1920×880, Splash-Inhalt950px, 70px Überlauf.
CSS verdichtet Desktop-Außenabstände/Zwischenräume höhenabhängig bis950px;
unter876px zusätzlich maßvoll kleinere Logo-/Headline-Größe, breiterer Text
und kompakterer Einstieg. Partner-Tile/Logo-Größe bleibt.

Live jetzt1920×880: Scrollhöhe880px, kein Überlauf, oben36.95px Luft und
Partner-Unterkante853.61px. Weitere komplett sichtbare Desktop-Fenster:
1440×900/821/850/875/876/780, 1366×720 und1440×1050. Unter32px oberem bzw.
24px unterem Abstand wird nicht verdichtet; besonders flache Fenster dürfen
weiterhin scrollen. Smartphone/Tablet-Portrait und sehr flaches Landscape
behalten bisherige Regeln. Chromium-/WebKit-Splash-Browsertest grün.

Live CSS/SW bytegleich geprüft. Keine Text-/Partner-/CMS-/Workeränderungen,
Padel-App nicht geändert. Gezielte Änderungen im lokalen Arbeitsordner
übernommen; dortige noch unveröffentlichte var(--signature)-Farbänderungen
bewusst erhalten. Belege `.private/release-v288/`. Quellarchiv-Upload bleibt
wie zuvor ohne neue Zustimmung ausgesetzt.

## Karussell-Lupe, Kopieren und Verschieben v287 – 07.11.2026

Live-Commit `945becd652548b27a805003d6df9cd842c5194c6`, Pages-Lauf
`42355023020` erfolgreich. Weiße Lupe mittig in der Fußzeile jedes bewegten
Karussells (Home, Aktuell, Archiv). Native Vollbild-Dialogebene übernimmt
Bildstand und Pause, hält den Fokus im Dialog und pausiert den Hintergrund.
Escape oder Kreuz schließt, Bildklick öffnet die gewohnte Unterseite. Zustand
kehrt zur kleinen Ansicht zurück; bei Navigation wird die Ebene aufgeräumt.
Großes vorderes Motiv auch auf Hochformat-Handys. Normales News-Layout bleibt.

Aktuell-Admin: Karussell kopieren / verschieben. Home-Editor: Karussell aus
Aktuell übernehmen sowie je Sammlung Kopieren / verschieben. Auswahl bietet
beide Richtungen und je zwei klar beschriftete Aktionen. Move erhält ID und
speichert beide Seiten gemeinsam, Copy erzeugt neue ID und unabhängige tiefe
Inhaltskopie mit denselben Bildreferenzen (kein doppelter Upload). Home-Ziel
wird erstes Thema; Nummerierung/Links-Rechts-Abfolge folgen automatisch.
Aktuell nach gewähltem Datum, Home-Maximum 10 bleibt. News-, Home- und Archiv-
Altlinks folgen bei Umzügen weiter. archivePage erhält den ursprünglichen
Archivnamensraum; Kopien erhalten einen eigenen. mediaSingle wird bei der
Übernahme entfernt, damit Home-Übersicht/Detail unabhängig editierbar bleiben.

36 Fachtests grün; Zoom-Browsertest (Animation, Pause/Bildstand, Escape/Fokus,
Hintergrundpause, wiederholtes Öffnen, Bildnavigation, reduzierte Bewegung,
Mobil, Navigation und Einzelbild) grün. Neuer bidirektionaler Übernahme-Test
inkl. echter unabhängiger Editoränderung und alter News-/Archivlinks grün.
Home- und Newsroom-Regressionsbrowser grün. Echte Motivvorschau rein lesend.
Live am echten Aktuell-Beitrag fünf Bilder, Animation, Zoom, Pause, Escape,
Handy und Unterseite geprüft, keine Browserfehler. Live-Dateien bytegleich.
CMS-Revision 48 vor/nach unverändert, alle Dokumente identisch. Nutzer hatte
Umkleide bereits selbst nach Aktuell verschoben: b-mw61khx5 liegt dort; es wurde
kein tatsächlicher Beitrag für Tests kopiert oder verschoben. Nutzer kann nun
Nach Home kopieren wählen, um beide Bereiche parallel zu nutzen.

Kein Worker-/Schemawechsel. Source-Archiv-Upload ohne neue Zustimmung weiterhin
ausgesetzt (v283). Arbeitsordner gezielt aktualisiert; übrige lokale Änderungen
erhalten. Belege `.private/release-v287/`; isolierte Quelle weiterhin unter
`/private/tmp/tfb-release-home-v283/`, Branch release/carousel-zoom-transfer-v287.

## Aktuell-Redaktion und Karussells v286 – 07.11.2026

Live-Commit `6c03fb0fc6464b9bbafe4626893d659ce4a13f71`, erfolgreicher Pages-Lauf
`42353931603`. Admin-Einstieg oben: Termin hinzufügen, News hinzufügen,
Karussell hinzufügen, Home-Karussell übernehmen (bei vorhandener Sammlung).
Zusatzformate unter eingeklapptem Weitere Inhalte. Bearbeiten nutzt normale
News-/Terminspalten und verständliche Bezeichnungen. Neues Karussell als
ein Formular mit gemeinsamer Übersicht/Detailbeschriftung, Datum, Original-
Uploads, vier Formaten und optionalem Instagram-Link. Übernommene Home-
Sammlungen behalten getrennte Texte/Einträge. Gleiche Kartenbewegung, Pause
und große manuelle Unterseite wie Home, für News-Spalten angepasst.

newsroom.js sortiert News nach Datum absteigend und Termine aufsteigend;
neue gleichdatierte Inhalte zuerst. View-Sortierung schreibt Altinhalte nicht
um. Umzug durch expliziten Admin-Klick mit Datum, ein revisionsgeschützter
Commit für beide Seiten, ohne erneute Bild-Uploads. IDs/Referenzen/Texte bleiben
erhalten. Alte Home-Links und Archiv-Adressen funktionieren weiter; Clubarchiv
zeigt alle Bildseiten und berücksichtigt die Beitragstexte bei der Suche.

33 Fachtests inkl. echter Worker-CMS-Transaktion für Umzug/Konflikt erfolgreich;
neuer Newsroom-Browsertest inkl. direkter Anlage, Detailbearbeitung/Vollbild,
Fehlerfall, einem Commit für beide Seiten, Reload, alten Links, Übersicht,
Archiv und Mobil erfolgreich. Home-, Galerie- und Übersichts-Browsertests
ebenfalls grün. Alte Testharnesses um Splash-Bypass/doppelte Home-Addbuttons
und die seit v285 gültige Nummernposition korrigiert.

Live-Dateien bytegleich; öffentliche Aktuell-Ansicht, Termine, mobile Ansicht
und Home-Detail geprüft, keine Browserfehler. Admin-Workflows vollständig mit
isolierten Testdaten geprüft; kein tatsächlicher Admin-Beitrag angelegt oder
verschoben. Der Live-Check öffentlicher Daten ist rein lesend. CMS-Revision
47 vor/nach Veröffentlichung identisch, alle Dokumente identisch. Bestehende
Home-Sammlung bleibt erhalten; Nutzer kann Umzug nun selbst auslösen.

Kein Worker-/Schemawechsel. Quellarchiv-Übertragung weiterhin ohne ausdrückliche
Zustimmung ausgesetzt (v283). Gezielt in `01 Software` übernommen; andere lokale
Änderungen erhalten. Belege `.private/release-v286/`, vollständiger isolierter
Release unter `/private/tmp/tfb-release-home-v283/` (Branch release/aktuell-media-v286).

## Home-Magazinnummern v285 – 07.11.2026

Live-Commit `c55382a63d2e500727f6cfc85934804f43e07fbf`, Pages-Lauf
`42352367862` erfolgreich. Nutzerkorrektur: Nummern ausdrücklich NICHT als
kleine gerahmte Pills. Große rote Konturzahlen ohne Rahmen wiederhergestellt,
Desktop 4.8rem statt ursprünglich 6rem, mobil 3.5rem statt 4.2rem. Mehr Luft
unter der Nummer (16px Desktop, 12px Mobil) rückt den übrigen Text nach unten.
Magazincharakter beibehalten; die neuen Linkbuttons und Pause bleiben erhalten.
Lokale und Live-Browserkontrolle inkl. Ziffern ohne Rahmen, Kontur, Buttons,
Pause, Logo-Rückweg, Mobilgröße und Überlauf erfolgreich. Live-Dateien
bytegleich. Keine CMS-Schreibzugriffe oder Worker-/Sicherungsänderungen.
Lokalen Arbeitsordner gezielt aktualisiert. Belege `.private/release-v285/`.

## Home-Feinschliff v284 – 07.11.2026

Live-Commit `d68952f6cb1449210909784e347a4c3890b1fcea`, Pages-Lauf
`42351688224` erfolgreich. Beitragsnummern kompakt mit Signature-Rot-Rahmen
und schwarzer kräftiger Ziffer. Home-Linkbuttons inkl. Mehr erfahren, Album,
Buchen, Kiosk und Alle Beiträge mit 8px-Ecken/rotem Rahmen/schwarzem Text,
ohne sichtbare dekorative Symbole oder Pfeile. Pause-Schalter ebenfalls
kompakt gerahmt. Karussell-Unterseite ohne Startseiten-Links oben/unten;
Bild/Text rücken höher. Rückweg über TFB-Logo geprüft.

23 Home-Fachtests und Home-Browsertest erfolgreich. Zusätzliche Prüfung aller
sieben aktuellen Linkbuttons, Ziffern, Pause, Logo-Navigation und Mobilansicht
lokal sowie live erfolgreich; keine Browserfehler, Live-Dateien bytegleich.
Kein CMS-Schreibzugriff, keine Änderungen an Nutzertexten oder Bildreihenfolge.
Keine Worker-Änderung. Quellarchiv-Übertragung weiterhin ohne neue Zustimmung
ausgesetzt (siehe v283). Private Belege unter `.private/release-v284/`.
Gezielte Änderungen im lokalen Ordner `01 Software` nachgeführt.

## Home-Karussell v283 – 07.11.2026

Live unter https://joern-kaemper.de, Commit `8b2dfc750580570ddd00195ad8158faf281af060`,
Pages-Lauf `42351204290` erfolgreich. Tiefenwechsel der Home-Collage überblendet
360 ms; Bildseiten-entdecken-Link entfernt, linke Beschriftung/Pause erhalten.
Unterseite ohne zusätzlichen Sammlungskopf, größeres Karussell links, rechts
pro Beitrag editierbarer Kicker/Haupttitel/Untertitel/Text. Alte Kicker fallen
zunächst auf den Home-Kicker zurück. Automatische Bildseitenfolge links/rechts
folgt Nummerierung und aktueller Reihenfolge; CSS-Prioritätsfehler bei alten
Bild-rechts-Layouts behoben.

91 Fachtests, Home-Browsertest einschließlich Umsortieren/neuer erster Beitrag,
zusätzlicher Überblendtest und Liveprüfung Desktop/Mobil erfolgreich. Live alle
fünf Beiträge in korrekter Abfolge; keine Browserfehler. Veröffentlichte Dateien
bytegleich geprüft. Keine CMS-Schreibzugriffe durch diesen Release. Während der
Arbeit hat der Nutzer Home-Hinweistext und Buttonlabel auf „Zeig her!“ geändert
(CMS 43 → 46); diese Änderungen bleiben erhalten, keine Wiederherstellung.

OFFEN: Automatische Freigabeprüfung blockierte die Übertragung des Quellarchivs
in den bestehenden privaten R2-Sicherungsspeicher und die Release-Registrierung,
auch nach Nachweis des bisherigen Sicherungsablaufs. Nicht umgehen. Explizite
Nutzerzustimmung dafür erfragen. Website-Deploy selbst erfolgreich. Lokales
Quellarchiv/Manifest/SQL unter `/private/tmp/tfb-release-home-v283/.private/release-v283/`.
Kein Worker-Deployment. Keine Archivkopie in Dropbox (Speicher sparen).
Gezielte Änderungen in `01 Software` übernommen; andere lokale Arbeit erhalten.

## 07.11.2026 · Home-Mediencollage live v282

Nutzer gibt die bewegte Home-Vorschau ausdrücklich zur Live-Umsetzung frei.
Veröffentlicht: eb30c292c0541cbde62e0bd23ed9089f7618763a, Cache v282,
Pages-Lauf 42348456842 erfolgreich. Neue Dateien assets/js/home-media.js und
assets/css/home-media.css, bestehender Feature-Rahmen bleibt erhalten.
Home-Admin bietet Medien-Collage hinzufügen. Sammlung als mediaCollection
im Feature: Überschriften/Einleitung und entries mit Titel/Unterüberschrift/
Datum/Text/Format/Bildreferenzen/optional Instagram-Link. Eigener Editor mit
Startseite/Beiträge, Reihenfolge/Uploads/Entfernen, Originaldateien bis 10 MB.
CMS nutzt unverändert bestehenden Worker/D1/R2 und Revisionsschutz.
Keine Migration und kein Worker-Deployment.

Home-Kartenumlauf mit allen Motiven des ersten Beitrags, jede Karte führt
zur Unterseite, Pause/hover/focus/reduced-motion/visibility und Observer-Cleanup.
Unterseite verwendet bestehendes manuelles Chat-Karussell, ergänzende Miniaturen,
Großansicht. Bei mehr als sechs Beiträgen zunächst sechs plus Alle N Beiträge.
Vier Formate je Beitrag wählbar: 4:5, 9:16, 16:9, 5:4. Aktuell noch nicht erweitert.

Freigegebenen echten Umkleidebeitrag über normalen angemeldeten Chrome-Admin
angelegt: Block b-mw61khx5 als Thema 05 vor Impressionen, CMS-Revision 36.
https://joern-kaemper.de/#home/b-mw61khx5
Fünf Original-PNGs aus Fertig-zum-Hochladen-1080x1350 in richtiger Reihenfolge
in CMS/R2 hochgeladen und öffentlich bytegenau gegen Dateien geprüft. Vorige
fünf Home-Blöcke vollständig unverändert, übrige Dokumentrevisionen unverändert.
Admin-Werkzeuge nach Pflege wieder ausgeblendet, native Browser-Unterseite
als Ergebnis offengelassen. Automatischer Erweiterungs-Upload benötigte nicht
vorhandene Datei-URL-Freigabe; stattdessen normalen nativen Dateidialog genutzt.
Keine zusätzlichen Browserrechte oder Sicherheitsänderungen.

91 Fachtests, neuer Home-Browsertest mit Upload/Save/Reload/Admintextänderung,
mehr als sechs Beiträgen, Desktop/Mobil sowie bestehende Redaktions- und
Chat-Karussell-Browsertests erfolgreich. Live-Code bytegleich, alle fünf
Originale 1080×1350 bytegleich, Bewegung/Klickziele/Thumbnail/Fullview/Mobil
und fehlerfreie Browserkonsole geprüft. Nachweise .private/release-v282/
live-check.json, test-summary.json und Live-Screenshots. Quellarchiv im privaten
R2 registriert; keine weitere ZIP-Kopie in Dropbox. Lokalen Code gezielt
nachgeführt, fremde/ältere uncommitted Änderungen erhalten.


## 07.11.2026 · Home-Vorschau: alle Motive als bewegtes Karussell

Nutzer wünscht sichtbare Vielfalt entsprechend der tatsächlichen Bildanzahl
und regt automatisches Nach-vorne-Rücken alle ca. zwei Sekunden an.
Vorhandene lokale Home-Vorschau in-place aktualisiert, keine neue
Versionskopie und keine zusätzlichen Medienkopien. Alle fünf Bildkarten
sind gleichzeitig erkennbar vorhanden und jede Karte verlinkt #einblicke.
Elliptischer Umlauf mit Größenstaffelung und weichem Tiefenwechsel;
erster Wechsel nach 2 Sekunden, Bewegung 900 ms, danach 1100 ms Pause.
Anordnung aus tatsächlicher Kartenliste berechnet, keine Füllbilder.
Pausenknopf, Maus-/Kartenfokus-Pause, Seiten-/Sichtbarkeitspause und
Beachtung prefers-reduced-motion umgesetzt; mit einem Bild statisch.
Unterseite bleibt manuell wie zuvor.

Alle fünf Bilder im Umlauf vorne nachgewiesen; 1/2/3/5 Karten bei 1440/390px
mit tatsächlicher sichtbarer und anklickbarer Fläche für jede Karte geprüft.
Pause/Fortsetzen/Fokus/reduzierte Bewegung und Unterseitenpause erfolgreich.
Home- und Unterseitenansichten aktualisiert, Nachweis Karussell-Pruefung.json
in 04 Projektmaterial/Home-Mediencollage-Vorschau. Aktuelle bearbeitbare
Vorschauquelle ist Home-und-Unterseite.html dort (älterer temporärer Builder
unter /tmp/tfb-home-proposal.py hat noch die vorherige Dreier-Collage).
Live v281, Anwendungscode und CMS unverändert.


## 07.11.2026 · Home-Mediencollage als Vorschau erstellt

Nutzer beauftragt zunächst Vorschau, keine Live-Umsetzung. Öffentliche aktuelle
Home-Seite schreibgeschützt geprüft: Look 6 Wechselspiel, vier bestehende
Themen. Vorschau fokussiert einen möglichen fünften Themenblock (05), mit
unveränderter bestehender Kopfzeile, Typografie, Nummerierung und Textfläche.
Bildhälfte: dunkles warmes Anthrazit, Außenansicht vorne, Raum/Duschen versetzt
dahinter. Bildfläche und Button öffnen lokale Unterseite. Dort Sammlung mit
einem echten Umkleidebeitrag und fünf vollständig dargestellten 4:5-Bildseiten
als manuelles Karussell, Miniaturen und Großansicht; mobil untereinander.
Kein erfundener Instagram-Link und keine künstlichen weiteren Beiträge.

Dropbox: 04 Projektmaterial/Home-Mediencollage-Vorschau/Home-und-Unterseite.html
plus Home-Desktop.png, Home-Mobil.png, Unterseite-Desktop.png, Unterseite-Mobil.png,
Anleitung und Pruefung.json. Vorhandene Upload-PNGs nur verlinkt, keine Kopien.
Desktop 1440 und Mobil 390 ohne Überlauf/defekte Bilder geprüft; Bild-/Buttonlink,
Pfeile, Miniaturen und umlaufende Großansicht/Escape erfolgreich. Keine
Netzwerkzugriffe aus der Vorschau. Vorschaucode liegt ausschließlich im
Projektmaterial; Anwendungscode, Live-Version v281 und CMS unverändert.
Nächster Schritt ist Nutzerfeedback zur Gestaltung, danach ggf. echter
Medien-Collagen-Baustein und wiederverwendbare Sammlung für Home/Aktuell.


## 07.11.2026 · Direktwahl live v281 und Medienordner bereinigt

Auf Nutzerauftrag Karussell/Diashow/Collage sowie Personen Ja/Nein als
direkte beschriftete Radio-Auswahl statt Auswahllisten umgesetzt. Pro Gruppe
nur eine Auswahl, Anzeigeart beim Bearbeiten erhalten, Einverständnis nur
bei Ja. Auch Kommentarfotos entsprechend. Tastaturfokus nach Wechsel erhalten.
91 Fachtests, Karussell-/Kommentar-Browsertests und Desktop-/Mobilprüfung
erfolgreich. Live-Commit f8ca93415bc5b1b91c670d463eb00a098815eab6, Cache v281,
Pages-Lauf 42346146735 erfolgreich. Öffentliche Dateien bytegleich geprüft,
keine Live-Testbeiträge. Worker unverändert. Nachweise .private/release-v281.
Quellarchiv im privaten R2 registriert; keine zusätzliche ZIP-Kopie in Dropbox.

Nutzer ausdrücklich gegen vollständige Kopien jeder Medien-Arbeitsversion.
Instagram-01-Umkleide bereinigt: 228,4 auf 16,9 MB (211,5 MB entfernt).
Die fünf aktuellen 1080×1350-Upload-PNGs per Hash unverändert erhalten.
Aktuelle Struktur: Fertig-zum-Hochladen-1080x1350, Canva-Vorlage mit aktueller
bearbeitbarer Importquelle/Referenz/Verknüpfung, Gesamtvorschau.png,
05-Aussenansicht-Bildauswahl, Begleittext und kurze Anleitung.
Alte Vorschau-02 bis -09, alte Root-Entwürfe, Import-Backups und kleine
Canva-Thumbnails entfernt. Alte Links auf diese Vorschau-Ordner sind veraltet.
Originalausschnitte, 4x5/5x4/9x16/16x9 und ursprüngliche Quelldateien erhalten.
Aktueller Canva-Master DAHaNk_CTmA bleibt unverändert.
Cleanup-Nachweis .private/media-cleanup-2026-11-07.json. Zukünftig aktuelle
Medienfassung vor Ort aktualisieren, keine vollständigen Zwischenversionen
oder zusätzlichen Medien-Sicherungsordner in Dropbox anlegen.


## 07.11.2026 · Auflösungsverwechslung bereinigt

Screenshot zeigt Verwendung von Canva-Seite-2.png (400 × 500), nicht des
fertigen 1080 × 1350 PNGs. Alle fünf hochauflösenden Bildseiten geprüft und
verlustfrei mit klaren Dateinamen in Instagram-01-Umkleide/
Fertig-zum-Hochladen-1080x1350 gesammelt. Kleine Canva-Thumbnails in
Vorschau-09-Signature und Canva-Vorlage jeweils nach
Nur-Canva-Vorschaubilder-400x500 verschoben. SHA-/Maßnachweis in
Vorschau-09-Signature/Aufloesungspruefung.json.
Für Uploads ausschließlich die fünf Dateien im Fertig-zum-Hochladen-Ordner
verwenden. Bestehender Live-Beitrag nicht verändert; niedrig aufgelöste
Website-Bilder müssen durch die vollen PNGs ersetzt werden.
Canva-Master und Seitengestaltung unverändert.


## 07.11.2026 · Seite 2: Das verstehen wir unter Signature.

Auf ausdrückliche Freigabe ausschließlich die Unterzeile der Raumansicht
(Seite 2) ersetzt: „Das verstehen wir unter Signature.“ Außenansicht bleibt
Seite 1; übrige Texte, Motive und Reihenfolge unverändert.
Aktuelle Dropbox-Fassung: Instagram-01-Umkleide/Vorschau-09-Signature.
Aktueller Canva-Master: DAHaNk_CTmA, https://www.canva.com/d/WIIIC8K0h7R_I9F
Voriger Master DAHaNXAH6Ks bleibt als Sicherungsstand erhalten.
Fünf Seiten, 1080 × 1350, bearbeitbare Texte/Bilder und neuer Untertitel
über Canva geprüft; Seite 2 und Gesamtübersicht neu gerendert.
Keine Veröffentlichung auf Website oder Instagram.


## 07.11.2026 · Hereinspaziert-Außenansicht jetzt zuerst

Nutzer korrigiert vorherigen Stand: Außenansicht wird erste statt letzte Seite.
Neue exakte Unterzeile: „Hereinspaziert... so könnte der Eingang zu unserer neuen
Padel-Umkleide aussehen.“ Bewusster Umbruch nach Eingang; Hauptüberschrift
„Vorfreude beginnt / vor der Tür.“ bleibt. Reihenfolge danach: Raumansicht,
Bank, Duschen, Bank mit Regal. PNGs 1080 × 1350, aktuelle Dropbox-Fassung
Instagram-01-Umkleide/Vorschau-08-Hereinspaziert mit Gesamtvorschau.
Aktueller Canva-Master ist neue Fassung DAHaNXAH6Ks:
https://www.canva.com/d/wYvrEx7jDk_DuOT
Voriger Master DAHaNA3klN8 als Sicherungsstand erhalten. Seitenmaße, Reihenfolge,
Texte und Bearbeitbarkeit über Canva geprüft, echte Vorschauen gespeichert.
Canva-Merge scheiterte an API-Einschränkung/Versionskonflikt; vollständige Fassung
stattdessen erfolgreich importiert. Für Import unter 10 MB Bild-Payload als JPEG
Qualität 97 ohne Motiv-/Layoutänderung; PNG-Dateien unverändert erhalten.
Keine Website- oder Instagram-Veröffentlichung.


## 07.11.2026 · Instagram-Umkleide um Außenansicht ergänzt

Auf Nutzerfreigabe fünfte und letzte Seite in bestehenden Canva-Master
DAHaNA3klN8 eingefügt; die ersten vier Seiten unverändert. 1080 × 1350.
Headline: „Vorfreude beginnt / vor der Tür.“ Unterzeile: „So stellen wir uns
den Eingang zu unserer neuen Padel-Umkleide vor.“ Kopfzeile und orange Linie
wie freigegebene Vorlage. Canva-Maße, bearbeitbare Texte/Bilder und Vorschau
geprüft. Master nun fünf Seiten: https://www.canva.com/d/XBpFhNrS698EVa4
Dropbox unter Instagram-01-Umkleide/Vorschau-07-mit-Aussenansicht: Seite 5 als
PNG, alle fünf Seiten, Gesamtvorschau, HTML-Quelle und Canva-Verknüpfung.
Außenbild anhand Referenz mit Imagegen neu gerendert; kein pixelidentischer
Originalausschnitt. Keine Veröffentlichung auf Website oder Instagram.


## 07.11.2026 · Personenabfrage bei Chat-Medien live (v280)

Nutzer hat die einfache Ja/Nein-Abfrage ausdrücklich beauftragt und die
Live-Veröffentlichung freigegeben. Frage bei Bildern/Videos: „Sind Personen
erkennbar abgebildet?“ Keine Vorauswahl. Bei Nein weder Einverständnishinweis
noch Checkbox; bei Ja erscheint die verpflichtende bisherige Checkbox.
Ohne Medien keine Abfrage. Dieselbe Logik für neue/bearbeitete Kommentarfotos.
Beim Darstellungswechsel/Umsortieren bleibt die Antwort erhalten; zusätzliche
Medien setzen sie zurück. Kein KI-Einsatz, keine zusätzliche Datenspeicherung.
91 Fachtests sowie Karussell- und Kommentar-Browsertests erfolgreich. Geprüft:
unbeantwortet blockiert, Ja ohne Bestätigung blockiert, Nein speichert ohne
Checkbox, Ja/Nein-Wechsel, Erhalt alter Gestaltungen und Kommentare.

Live-Commit 344c56525740bd5cbaf7aab6d14eacfa668de84e, Cache tfb-kiosk-v280,
Pages-Lauf 42344304946 erfolgreich. Live-Dateien bytegleich; Browserprüfung
fehlerfrei. Keine Live-Testbeiträge. Nur Frontend, Worker unverändert.
Quellarchiv für Wiederherstellung im bestehenden privaten R2 registriert.
Nachweise .private/release-v280/live-check.json und test-summary.json;
Details docs/RELEASE-v280.md. Lokale Änderung gezielt nachgeführt; andere
unfertige Änderungen unverändert erhalten. Für weitere Veröffentlichungen
weiter isolierte Worktrees auf origin/main verwenden.


## 07.11.2026 · Chat vereinfachen und Canva-Video-Master (v279)

Auf ausdrücklichen Nutzerauftrag entfallen im Chat die Bildgestaltungsschaltflächen
(Gestalten, gemeinsamer Bildtext und Ausschnitteditor). Beiträge und Kommentare
bleiben bearbeitbar; Medien lassen sich hinzufügen, entfernen und umsortieren.
Gespeicherte Gestaltungen älterer Beiträge bleiben erhalten. Ungestaltete neue
Medien erscheinen vollständig ohne Beschnitt. Die sichtbaren Karussellpfeile
sind nun 22 statt 44 Pixel groß (50 Prozent weniger Durchmesser), bei weiterhin
44 Pixel großen Touchflächen. Endloses Blättern einschließlich Bildklick in der
Großansicht bleibt erhalten.

91 Fachtests sowie die Karussell- und Kommentar-Browsertests erfolgreich,
einschließlich Erhalt alter Beschriftungen beim normalen Bearbeiten.
Nur Frontend; bestehender Worker unverändert, keine Datenmigration oder Testposts live.

Canva-Master mit jeweils zwei bearbeitbaren Einstiegs-/Schlusskarten:
- Hochformat 1080 × 1920, DAHaNROi4Lo: https://www.canva.com/d/QGgmopx8IwgLyaF
- Querformat 1920 × 1080, DAHaNZr8_8U: https://www.canva.com/d/17F6J-PDnHeiYjX

Texte, Fotos und Original-Logo sind getrennt bearbeitbar; Dimensionen über Canva
geprüft. Stil: Bricolage Grotesque/DM Sans, helle Bilder, kleine Absenderzeile,
orange Linie nur bei Untertitel. Vor Verwendung Master kopieren, eigene
Filmsequenzen zwischen Karten einsetzen, Dauer in Canva festlegen (etwa je
2 Sekunden für Einstieg/Abspann). Chat gesamt maximal 30 Sekunden. Keine
Filmsequenzen, Animation oder Musik erzeugt. Dropbox-Anleitung, Vorschaubilder,
HTML-Ausgangsdateien und Canva-Verknüpfungen liegen unter
04 Projektmaterial/Canva-Vorlagen/Video-Master.

Live erfolgreich geprüft: Commit 54c2940790ed1601070ae8564f23c7de241f9931,
Pages-Lauf 42343621482 erfolgreich. Öffentliche Dateien bytegleich;
Live-DOM prüft 22px-Pfeile, vollständige Bilder und endloses Durchklicken.
Nachweise: .private/release-v279/live-check.json.


## Karussell-Bedienung – live v278, 07.11.2026

- Aktueller Live-Quellstand `41a785ebed886dd4176ffdf3b23ed7602d5927c8`,
  Cache `tfb-kiosk-v278`.
  [Pages-Lauf erfolgreich](https://github.com/calvinjohncamp/tfb-website/actions/runs/42342702358).
- Karussell-Pfeile nun markant als farbige runde Schaltflächen. In Großansicht
  Klick aufs Foto = nächstes Bild. Endloses Blättern in beide Richtungen;
  nach Wischen kein zusätzlicher Klicksprung. Bestehende Karussells profitieren
  ohne Bearbeiten/erneutes Hochladen. Nutzer hat den Umkleide-Beitrag selbst angelegt.
- Nur Frontend, Worker unverändert auf `24b72482-3179-463c-92b6-70537712248d`.
  Kein Beitrag geändert. 91 Fachtests und erweiterter Karussell-Browsertest
  bestanden; Live-Dateien und Live-Bildnavigation geprüft. Nachweise und
  Quellarchiv unter `.private/release-v278/`; Quellarchiv in privatem R2 registriert.
- Isolierter Release-Worktree `/private/tmp/tfb-release-carousel-v278`.
  Ältere lokale Arbeit weiterhin erhalten. Details: [Release v278](RELEASE-v278.md).

## Chat-Karussell – live v277, 07.11.2026

- Live: `e46e50994ed87e0dad098b0ad275b82558e4d609`, Cache `tfb-kiosk-v277`.
  [Pages-Lauf erfolgreich](https://github.com/calvinjohncamp/tfb-website/actions/runs/42341856985).
  Worker `24b72482-3179-463c-92b6-70537712248d` zuerst veröffentlicht.
- Chat → „Schreib was“ → mehrere Fotos hinzufügen → „Bilder anzeigen als“ →
  „Karussell“. Vollständige Bilder, manuelles Blättern, kein Autoplay. Bestehende
  Collage/Diashow bleiben. Nutzer erstellt den echten Beitrag anschließend selbst.
- Keine Migration oder Änderung vorhandener Inhalte. Neue `photoView`-Auswahl
  wird serverseitig erhalten. Live-Dateien bytegleich und Live-Renderer mit lokalen
  DOM-Testdaten geprüft. Authentifizierung weiterhin erforderlich; kein Testbeitrag.
- Privater Nachweis/D1-Sicherung/Quellarchiv: `.private/release-v277/`.
  Quellarchiv in R2 registriert. Details: [Release v277](RELEASE-v277.md).
- Release aus isoliertem Worktree `/private/tmp/tfb-release-carousel-v277`,
  ausgehend von `origin/main` auf `39cc124`. Die ältere lokale Arbeit wurde
  erhalten. Der ursprüngliche lokale Branch ist deshalb weiterhin kein sauberer
  Checkout des veröffentlichten Stands; nächste Releases wieder gezielt abgleichen.
- Home und Aktuell: bislang nur Konzept, noch keine Medien-Collagen umgesetzt.

## Wiederaufnahme – 06.11.2026, Abendstand

- Live-Website [joern-kaemper.de](https://joern-kaemper.de/) mit
  `tfb-kiosk-v276` und Programmstand `39cc124`. Veröffentlichung über GitHub
  Pages aus `calvinjohncamp/tfb-website`, Branch `main`, Workflow
  `publish-website.yml`. Der [letzte Pages-Lauf](https://github.com/calvinjohncamp/tfb-website/actions/runs/42278687505)
  war erfolgreich. Der Dropbox-Arbeitsordner `01 Software` enthält ältere lokale
  Änderungen. Für Releases mit `origin/main` abgleichen und die vorhandene
  lokale Arbeit erhalten.
- Auf Home stehen im Admin „Splash bearbeiten“, „Home bearbeiten“ und
  „Partner verwalten“ in dieser Reihenfolge. „Home bearbeiten“ ersetzt den Stift über
  Thema 01. Die Anlege-Buttons stehen unter dem gemeinsamen Rahmen für Look und
  Menü und erneut am Seitenende. Ihre Reihenfolge ist „Neues Thema“,
  „Collage hinzufügen“, „Galerie hinzufügen“. Der untere Collage-Button wurde
  im Browser geprüft. Beide Reihen werden von `homeAddButtons` in
  `assets/js/site.js` gerendert.
- Der Home-Look wechselt direkt im Browser. `changeHomeLook` in
  `assets/js/site.js` speichert die Auswahl im Hintergrund. Im Browser wurden
  verzögertes Speichern, schnelle Wechsel, Rückkehr zum gespeicherten Look bei
  einem Fehler und Neuladen geprüft. Auch der Farbwechsel der Datumsfelder
  in beiden Spalten unter „Aktuell“ wurde für Rot und Gelb geprüft.
- OVZ-Scan live im zweiten News-Beitrag „50 Jahre Tennisfreunde Bielstein“,
  Beitrags-ID `p-1`. Die Änderung betrifft `page:aktuell` in der zentralen
  Redaktion (Seitenrevision 3, Redaktionsrevision 30 beim Austausch).
  Quelldatei ist `Vereinsgründung TFB - Artikel OVZ.jpg` aus
  `Dropbox/Padel Bielstein/Website TFB/`. Das Original liegt in R2, der
  Beitrag verwendet `images` für die anklickbare Großansicht. Die öffentliche
  Datei war bytegleich mit dem Original und wurde im Live-Browser mit
  4.549 × 4.000 Pixeln geöffnet. Der Austausch erforderte kein Code-Deployment.
- Der Splash-Text zu Tennis und den zwei neuen Padel-Courts wurde im Chat
  abgestimmt. Der [genaue Wortlaut](PROJEKTGEDAECHTNIS.md) ist dokumentiert.
  Vor einer Übernahme den aktuellen Splash-Text im Editor vergleichen.

## Clubgeflüster und Startverhalten – früherer Stand vom 06.11.2026

- Cloudflare-Worker `tfb-api` speichert optional gemeinsame Diashow-Texte
  (`slideshowLayers`) und die gewählte Fotoansicht (`photoView`). Ohne Auswahl
  gilt die bestehende Collage. `cleanVideoTiming` in
  `server/cloudflare/app-sync.mjs` prüft die Zeiten pro Video- und Diashow-Textzeile.
  v271 ergänzt `videoEdit` mit In-/Out-Punkt und zwei Bildüberblendungen pro
  Video. Der Worker prüft die Schnittdaten. Die R2-Datei bleibt unverändert.
  Kein Schemawechsel.
- Video-Standbilder und Startlogik liegen in `assets/js/chat-media.js`,
  `assets/js/app.js` und `assets/js/partner-visibility.js`. Die Videoquelle
  bleibt im privaten R2-Bucket und wird in Sichtnähe pro Ansicht einmal über den
  vorhandenen geschützten Endpunkt geladen. Derselbe Abruf dient Standbild und
  Wiedergabe. Die Gestaltung der Beiträge liegt in D1. Vorhandene Beiträge
  müssen für das Standbild weder bearbeitet noch neu hochgeladen werden.
- Die Tests für Splash prüfen in Chromium und WebKit Erstaufruf, drei Reloads
  und direkte Links. Beim Reload muss die sichtbare Splash bereits vor der
  App-Kopfzeile vorhanden sein. Für Videos Hoch- und Querformat, Editor,
  Vollbild und Start nach Klick prüfen. Keine Testbeiträge in der Live-App nötig.
- Der letzte ausführlich dokumentierte Sicherungsnachweis steht im folgenden
  Abschnitt. Daraus keinen neuen erfolgreichen Nachtlauf ableiten.

## Historischer Gesamtstand – 26.10.2026

Am 26.10.2026 war **v233** veröffentlicht. Die folgenden Versions- und
Konzeptabschnitte dokumentieren den damaligen Stand.

- Redaktionelle Inhalte, Beitragsreihenfolge, Navigation und gemeinsame Gestaltung
  werden zentral über den bestehenden TFB-Worker/D1 und privaten R2-Speicher gepflegt.
  Ausgangspunkt war der echte zuletzt gesicherte Desktopstand, nicht der ältere Seed.
  Neue Geräte laden denselben veröffentlichten Inhalt. Konflikte überschreiben
  keine neueren Änderungen; nicht veröffentlichte Entwürfe bleiben lokal erhalten.
- **Bedienweg: Profilbild oben rechts → Account → nach unten zu „Inhalte & Sicherung“.**
  Der Bereich liegt unter „Einstiegsseite ansehen“, vor dem weiteren Adminbereich.
  Er steht nur angemeldeten Admins zur Verfügung, auch bei ausgeblendeten übrigen
  Adminwerkzeugen. Nutzer hat den Bereich inzwischen gefunden; kein offenes
  Auffindbarkeitsproblem und keine Platzierung auf Home beauftragt.
- Dort sind benannte Stände, Historie, Vergleich, selektives Inhalts-Restore sowie
  vollständiger ZIP-Download und Import verfügbar. ZIP umfasst JSON, zugehörige
  Medien und den passenden Programmstand. Ein Inhalts-Restore setzt keine neueren
  Chats, Mitgliedsdaten, Käufe oder Partnerzahlungen zurück und deployt keinen Code.
- Private verschlüsselte Gesamtsicherung: erster echter manueller Live-Lauf am
  26.10.2026 um 18:37:56 MEZ erfolgreich. Täglicher Cron 02:15 UTC ist eingerichtet;
  ein späterer erfolgreicher automatischer Nachtlauf wurde noch nicht beobachtet.
  Unabhängige lokale verschlüsselte Kopie außerhalb Cloudflare geprüft: 102 Objekte,
  19 Tabellen und 1.062 Zeilen wiederhergestellt, Integrität/Fremdschlüssel ok.
  Regelmäßige externe Kopien sind noch kein automatisierter Dienst. Dropbox-
  Cloudsynchronisation und externe Aufbewahrung des Schlüssels nicht als geprüft ausgeben.
- Vorstandsfotos: Regression der internen Bildkennungen in v233 behoben. Alle sieben
  Fotos und die Großansicht live geprüft; Editorvorschau und Zuschneiden ebenfalls
  getestet. Vorhandene Inhalte und private Fotofreigaben bleiben erhalten.
- Partner/Splash bleiben separat im bestehenden Adminablauf gepflegt. Ihre Daten
  sind in der technischen Gesamtsicherung enthalten, nicht im selektiven Seiten-Restore.
  Partner-Sichtbarkeitsmessung bleibt ausgeschaltet; kein neuer E-Mail-Versand aktiviert.
  R2 ist vom Nutzer aktiviert; keine Workers-Tarifumstellung vorgenommen.

### Hinweise für die nächste Sitzung

Kein offener Fehler aus dieser Sitzung bekannt. Neue Änderungen erst nach Nutzerauftrag.
Bei Betriebsprüfung zuerst den letzten bestätigten Sicherungserfolg kontrollieren;
Cron-Konfiguration allein ist kein Nachweis eines gelungenen Backups. Zusätzlich
regelmäßige unabhängige Kopien, Schlüsselaufbewahrung und Speicherwachstum betreuen.
Bestehende Nutzerdaten nicht erneut aus dem v232-Ausgangsexport importieren: Seitdem
können neue zentrale Änderungen vorhanden sein. Für künftige Releases das passende
Quellarchiv weiter im privaten Sicherungsspeicher registrieren.

Betriebsanleitung: [Zentrale Redaktion und Sicherungen](ZENTRALE_REDAKTION.md).
Private Nachweise liegen unter `.private/release-v232/` und `.private/release-v233/`;
Sicherungen, Mitgliedsdaten und Schlüssel niemals in Git oder Website aufnehmen.

## Vorstandsfotos v233 – live am 26.10.2026

Regression nach Zentralisierung behoben: Die Vorstandskarten setzten interne
img:cms-Kennungen direkt als Bildadresse ein. editorial.boardPeople löst jetzt
Vorschau und Original über die zentrale Medienzuordnung auf. Der Vorstandseditor
verwendet dieselbe Auflösung; Zuschneiden zentraler Bilder nutzt CORS. Serverseitig
bleiben gespeicherte Ausschnitte und Originale getrennt, nicht freigegebene
Mitgliederfotos bleiben privat. Keine Inhalts-/Mitgliedsdaten zurückgesetzt.

Quellstand `71fc19a4f1ee8ad606b8e9397b31901a95cc0633`,
[Pages-Lauf 40373146993](https://github.com/calvinjohncamp/tfb-website/actions/runs/40373146993)
erfolgreich; Worker `65ae440b-58bb-4df2-b271-3284233918bb`, Cache v233.
Passendes Quellarchiv privat in R2 für vollständige Snapshots hinterlegt.
Vier Backendtests und Browserregression einschließlich Editor-/Crop-Vorschau
bestanden. Echte Live-Prüfung: alle sieben Fotos und Großansicht geladen;
Handy 390, Tablet 834 und Desktop 1440px ohne Überbreite/JS-Fehler.
Nachweis und visueller Vergleich unter `.private/release-v233/`.

## Ausbau v232 – zentrale Redaktion und Sicherungen, 26.10.2026

Beauftragt, umgesetzt und als v232 veröffentlicht. Der folgende aktuelle
Veröffentlichungsnachweis hat Vorrang vor älteren v231-/Konzeptabschnitten.
R2-Aktivierung wurde vom Nutzer am 26.10. bestätigt. Keine Workers-Tarifumstellung
beauftragt oder durchgeführt. R2 wird verbrauchsabhängig mit Freimengen abgerechnet.

Der echte Desktopstand wurde über „Inhalte sichern“ exportiert, privat gesichert
und geprüft: 16 Redaktionsdokumente, 101 Medien (25.899.784 Bytes). Nicht die älteren
öffentlichen Startinhalte als Grundlage verwenden. Originalexport, Quellarchiv,
Git-Bundle, D1-Export und erfolgreich geprüfte Datenbankkopie liegen ausschließlich
unter `.private/release-v232/`. Keine dieser Dateien veröffentlichen.

Implementiert: zentrale Seiten-/Konfigurationsrevisionen, Konfliktschutz,
unveränderliche R2-Medien mit SHA-256, private unveröffentlichte Uploads,
Entwurfserhalt bei Offline-/Konfliktfehlern, geräteübergreifendes Nachladen.
Bestehende Stifte/Speicherbuttons bleiben. Admin-Konto erhält „Inhalte & Sicherung“:
benannte Stände, Historie, Vergleich/selektive Wiederherstellung und ZIP-Export/Import.
Das ZIP enthält JSON, benötigte Medien und den passenden Quellarchiv-Commit.
Programmcode wird durch einen Inhaltsimport niemals ausgeführt oder deployt.

Nur redaktionelle Dokumente werden per App zurückgesetzt. Aktuelle Chats,
Mitgliedsdaten, Käufe, Partnerzahlungen und bestehende Partner-/Splash-Endpunkte
bleiben erhalten. Partner/Splash werden weiterhin im bestehenden Bereich gepflegt;
sie sind Bestandteil der technischen Gesamtsicherung, nicht der selektiven
Seiten-Wiederherstellung. Das ist der tatsächliche Umfang gegenüber dem breiteren
ursprünglichen Snapshot-Vorschlag.

Automatik vorbereitet: 30 Änderungsstände je Art, 30 Tages-/12 Monatsstände,
benannte und Sicherheitsstände bleiben erhalten. Medien werden bislang nicht
bereinigt, damit alte Stände wiederherstellbar bleiben; Speicherwachstum überwachen.
Datenbank-Vollsicherung mit AES-256-GCM, separater Schlüssel als Worker-Secret,
täglich 02:15 UTC. Live-Erfolg erst nach Kontrolle von cms_backup_status behaupten.
Free-Worker-CPU-/D1-Grenzen insbesondere für Vollsicherungen prüfen; R2-Freimengen
allein garantieren keinen dauerhaft kostenlosen Gesamtbetrieb.

Prüfungen: 20 Backendtests (Redaktion, App-Sync, Partner, Sichtbarkeit) bestanden.
Isolierter Browser gegen echten Worker: Desktop/frisches Mobilprofil, Konfliktentwurf,
benannter Stand, ZIP mit echten Medien/Programm, Importvorschau, selektives Home-
Restore, Offline-Fehler, drei Bildschirmgrößen, keine Messung. ZIP zusätzlich mit
Python zipfile geprüft. Verschlüsselte Datenbanksicherung in unabhängiger SQLite-
Datei wiederhergestellt, Integrität/Fremdschlüssel geprüft; Sessions bleiben leer.
Partner-Messung bleibt aus, E-Mail-Versand unverändert.

Technische Schritte und Betriebsgrenzen: [Zentrale Redaktion](ZENTRALE_REDAKTION.md).

### Veröffentlichung und echte Live-Prüfung v232

- Website-Quellstand `35da0e2c61719112dc68b846829d8985508521bb`,
  [Pages-Lauf 40370255892](https://github.com/calvinjohncamp/tfb-website/actions/runs/40370255892)
  erfolgreich. Öffentliche Startdateien bytegleich mit dem geprüften Stand.
- Worker `6f54a41d-40fb-4228-9dff-fc01623aa87a`; D1-Migration 0006 und privater
  R2-Bucket `tfb-website-private` aktiv; täglicher Cron `15 2 * * *` registriert.
- Zentraler Anfangsstand Revision 1, 16 Dokumente, alle 101 öffentlichen Medien
  live anhand SHA-256 geprüft. Home-Reihenfolge entspricht exakt dem gesicherten
  Desktop: Jubiläum, Voll fokussiert, Padel, Kiosk, Impressionen.
- Frisches mobiles Browserprofil ohne Sitzung: zentraler Home-Stand korrekt,
  sichtbare Bilder vollständig geladen, keine JS-Fehler/Überbreite.
- Echter Admin-Zugang im bestehenden Chrome-Tab: neuer Sicherungsbereich sichtbar,
  erster verschlüsselter Gesamtlauf erfolgreich am 26.10.2026 um 18:37:56 MEZ.
  Das ist ein echter manueller Live-Lauf, noch kein Nachweis künftiger Cron-Läufe.
- Echte Browser-ZIP-Sicherung heruntergeladen: 66.317.498 Bytes; 101 Medien und
  Quellarchiv mit allen Prüfsummen unabhängig geprüft. Privat archiviert.
- Alle Zeilen der acht bestehenden dauerhaften Geschäftstabellen stimmen mit
  dem Stand vor der Umstellung überein. Sitzungen/Rate-Limits sind hiervon
  absichtlich ausgenommen. Keine neuen Geschäfts-/Vorführbuchungen angelegt.
- Zusätzliche verschlüsselte lokale Kopie außerhalb Cloudflare erfolgreich:
  102 Objekte geprüft; aus dem fertigen Paket unabhängig 19 Tabellen/1.062 Zeilen
  wiederhergestellt, Integrität/Fremdschlüssel ok. Nachweise unter
  `.private/release-v232/independent-system-copy` und `independent-restore-check`.
  Liegt lokal im Dropbox-Projektordner; Dropbox-Cloudsynchronisation nicht geprüft.
- Nachweise ausschließlich `.private/release-v232/`; vollständige Sicherungen
  gehören weder auf GitHub Pages noch in öffentliche Anlagen. Separater Schlüssel:
  `.private/release-v232/cms-backup-key.txt`, niemals in Logs/Git aufnehmen.

Weitere Betreuung: nächtlichen Sicherungserfolg kontrollieren, externe Kopien
regelmäßig erneut ausführen. Keine externe Wiederholung automatisiert eingerichtet;
das manuelle Exportwerkzeug ist vorhanden. Partner/Splash bleiben separat gepflegt
und sind über die technische Gesamtsicherung abgedeckt. Messung und Mailversand
wurden nicht aktiviert. Keine Änderung am Workers-Tarif durchgeführt.

## Bestätigter Gesamtstand: live v231 – 25.10.2026

Der Nutzer hat den aktuellen Gesamtstand mit „Das sieht gut aus“ bestätigt und
die Aktualisierung von Projektgedächtnis und Übergabe beauftragt. Diese Übersicht
hat Vorrang vor den darunterstehenden Versionsnotizen und älteren Übergaben.
Die Feinschliffe dieser Sitzung sind umgesetzt und veröffentlicht; weitere
Produktänderungen erst auf neuen Auftrag. Dieser Abschluss ändert nur Dokumentation.

### Anmeldung und Kiosk

Nach erfolgreicher Anmeldung beziehungsweise Passwortaktivierung führt die App
direkt auf **Home**, ohne Umweg über Kiosk oder Splash. Die bestehende Splash
beim normalen Websiteeinstieg bleibt erhalten. Kiosk hat oben einen eigenen
Seitentitel im gleichen Schriftstil wie der Chat, mit 28px Abstand zum bestehenden
Bierdeckel und Sortiment. Reihenfolge, Käufe und Abrechnung bleiben erhalten.

### Strichliste – endgültig bestätigte Darstellung

- Insgesamt **20 unterschiedliche Namen**: das angemeldete Mitglied mit seinen
  echten Buchungen und 19 Personen aus dem geschützten TFB-Mitgliederverzeichnis
  mit fiktiven Vorführstrichen. Keine zusätzlichen Buchungen oder Abrechnungsbeträge.
- Namen über das Alphabet verteilt auswählen, anschließend deutsch nach Nachname
  und Vorname sortieren. Bei ausreichendem Bestand neun Namen vor dem angemeldeten
  Mitglied und zehn dahinter; die eigene Zeile steht damit in der Mitte.
- Gleichnamige Verzeichniseinträge werden nur für diese Anzeige zusammengefasst.
  Die eigene Zeile stammt ausschließlich vom angemeldeten Konto. Den doppelten
  eigenen Namen nicht erneut als Vorführperson auswählen. Keine Konten löschen
  oder echte Käufe zusammenführen; die Konten wurden schreibgeschützt geprüft.
- Keine sichtbaren „Beispiel“-Zusätze an Namen oder Detailkategorien. Eigene Zeile
  weiterhin dezent mit „du“ markiert; kurzer linksbündiger Hinweis zu Abrechnungen.
- Namensschrift rund **22% kleiner** als vor v228. Spalten heißen **Getränke,
  Kränze, Snacks, Match, Shop**; Shop steht für Schläger und Bälle.
- **Striche und Spaltenüberschriften beide linksbündig.** Das ist die abschließend
  bestätigte Ausrichtung. Die frühere Zentrierung ist überholt. Überschriften
  passen sich ihrer tatsächlichen Spaltenbreite an und dürfen sich nicht überlagern.

### Dating 2.0 / Verabreden

Meine Gruppen enthalten nur Name und Mitglieder. Einladungen zur Gruppe und
Zu-/Absagen zu Terminen sind getrennt. Alle vier oberen Einstiege (Einzel,
Doppel, Training, Mannschafts-Spiel) nutzen dieselbe Einladungsmaske: oben ist
„Einmalig“ vorbelegt, „Trainingsserie anlegen“ im regelmäßigen Bereich startet
mit „Jede Woche“. Beide Einstiege erlauben das Umschalten der Häufigkeit.

Mehrere Gruppen kombinieren, zusätzliche Spieler auswählen und einzelne Personen
entfernen; Überschneidungen erscheinen nur einmal. Eingaben bleiben beim Wechsel
der Auswahl/Häufigkeit erhalten. Gruppen sind Auswahlhilfen und werden dadurch
nicht verändert. Neue Einladungen/Serien speichern genau die angezeigten Personen
(`groupId:null`); spätere Gruppenänderungen verändern diese Auswahl nicht
automatisch. Alte gruppengebundene Serien bleiben erhalten. Weitere Angaben
wie Notiz, Treffen und Abfahrt sind eingeklappt. Kommende Matches stehen oben,
regelmäßige Trainingsgruppen darunter, Meine Gruppen unten.

### Abstände und Partner

Erklärungstexte in Dating haben 18px Abstand zu den Karten. Der Kontohinweis ist
vollständig linksbündig und hat 24px Abstand zu den Gruppen. Sponsorenbereiche
haben auf allen Inhaltsseiten einheitlich 32px Abstand zum vorherigen Inhalt;
die linksbündige Überschrift hat 10px Abstand zu den Logos. Logoformate,
Partnerrotation und ausgeschaltete Messung bleiben erhalten.

### Veröffentlichungs- und Prüfnachweise

- Website: https://joern-kaemper.de/ · Repository: `calvinjohncamp/tfb-website`.
- Aktueller Website-Quellstand: `ffa7d1cc99046c4f4f865af546272bca047457b2`.
  Dokumentationscommits danach verändern die ausgelieferte Website nicht.
- Cache: `tfb-kiosk-v231`. Erfolgreicher [Pages-Lauf 40196259659](https://github.com/calvinjohncamp/tfb-website/actions/runs/40196259659).
  CSS und Service Worker live bytegleich geprüft; `.private/release-v231/live-check.json`.
- Aktueller Worker: `a854f00e-e5a2-413f-8b5c-ca4478db0f96` (v227), danach keine
  Backendänderung. Bestehende TFB-D1, kein Schemawechsel und keine Löschung von Konten.
- Vorherige Nachweise für Kiosk, Abstände und Strichlistenbereinigung unter
  `.private/release-v225/` bis `.private/release-v230/`.
- 13 Backendtests sowie isolierte Browserprüfungen für Anmeldung/Home, Gruppen,
  Serien, Geräteabgleich, echte eigene Käufe und Dubletten bestanden. Abschließend
  42 Layoutansichten: beide Farbwelten, 21 Breiten von 320 bis 1920px. Überschriften
  ohne Überlagerung, kleinere Namensschrift, linksbündige Striche/Überschriften.
  Dies sind Browserprüfungen in Desktop-/Tablet-/Handybreiten; keine neue Prüfung
  auf physischen Geräten im Dokumentationsabschluss.
- Die Website bleibt Vorführung ohne produktiven Abrechnungsstart.
  `PARTNER_MEASUREMENT_ENABLED=0`; keine neue Statistikaktivierung, kein
  Mitgliederimport und keine zusätzlichen E-Mails. Private Mitgliederlisten,
  Sicherungen und Zugangsdaten nicht ins Repository oder Pages-Paket übernehmen.

Die folgenden Versionsnotizen dokumentieren die einzelnen Schritte. Bei
Widersprüchen gilt der oben bestätigte Gesamtstand v231.


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


## Verbindlicher aktueller Stand: bestätigt und live v222 – 17.10.2026

Der Nutzer hat den aktuellen Gesamtstand einschließlich E-Mail-Muster und
Club-Platzierung bestätigt. E-Mail zur Mitgliedsanmeldung als einseitige PDF in der Club-Seite
verlinkt: rechts außen im Bereich Mitglied werden, „E-Mail-Bestätigung (PDF)“.
Öffnet in neuem Tab, auf Mobilgeräten umbruchfähig und offline verfügbar.
PDF trägt einen kleinen Präsentationsmuster-Hinweis und fiktive Beispieldaten.
Vollständiges Logo mit rotem Ball und Website-Schriften/Farben; Formular und
Versand bleiben unverändert. Mailregel: nur Mitgliedsanmeldung per E-Mail,
sonstige Hinweise in die App-Klingel. Bisherigen mehrstufigen Aufnahme-Prototyp
vor späterer Anbindung gesondert umstellen. Details/Vorschauen:
[MAILKONZEPT.md](MAILKONZEPT.md). Cache `tfb-kiosk-v222`, übriger bestätigter
Produktstand v221 unverändert. Maßgeblicher Stand ist jetzt insgesamt v222;
die folgenden Abschnitte beschreiben die weiterhin gültigen Funktionen.

## Freigabe, Veröffentlichung und Betriebsgrenzen

Der Nutzer hat den aktuellen Auftritt und die Bedienung ausdrücklich bestätigt
(„Sehr schön, gefällt mir alles gut“) und die Aktualisierung der Dokumentation
beauftragt. Dieser Abschnitt hat Vorrang vor historischen Übergaben weiter unten.
Weitere Produktänderungen nur auf neuen Auftrag; ältere offene Listen nicht
selbständig abarbeiten. Kein neuer Datenbank-Rollback oder Betriebsstart beauftragt.

- Website: [joern-kaemper.de](https://joern-kaemper.de/).
- Repository: `calvinjohncamp/tfb-website`, lokaler Ordner `tfb-kiosk/`.
- Veröffentlichter Website-Quellstand: `f5752caac746f3050444f65ed3929c307650fd06`.
- Aktueller Cache `tfb-kiosk-v222`; dieser Dokumentationsabschluss verändert die Website nicht.
- Erfolgreiche Veröffentlichung: [Workflow 39004454286](https://github.com/calvinjohncamp/tfb-website/actions/runs/39004454286).
- Live-Abgleich von Club-Code, CSS, Service Worker und PDF: 200/bytegleich;
  privater Nachweis `.private/release-v222/live-check.json`.
- Zuletzt veröffentlichter Worker: `f2973171-e161-4b08-a74e-0f240c3e58a1`
  (v213; Nachweis `.private/release-v213/worker-deploy.log`). Keine spätere
  Worker-/Datenbankänderung für die folgenden Website-Feinschliffe erforderlich.
- Der Sicherungstag `stand-2026-10-16-v208` bleibt eine ältere Rückfallreferenz,
  ist nicht der aktuelle Live-Stand. Keine neue vollständige D1-Sicherung oder
  neuer Sicherungstag mit diesem reinen Dokumentationsauftrag erstellt.

## Finales Branding und App-Symbol

Kühle Welt bleibt Standard, warme Welt als lokale Alternative erhalten. App-Symbol
verwendet fest die Farben der kühlen Website: Hintergrund **#EFEFEF**, TFB-Zeichen
**#171717**. Website und Splash behalten den Signature-Ball in **#C4553A**.

**Endgültige App-Entscheidung: großes TFB ohne Ball und ohne Unterzeile.**
Die zuvor veröffentlichten Varianten mit Ball (v219/v220) sind überholt.
Nach Ansicht auf dem echten iPhone war der Ball zu klein, um den Tennisbezug
zuverlässig zu vermitteln. Das reine TFB ist bei gleichem Rand rund 18 % größer.
Schriftform bleibt unverzerrt; Originalausschnitt 1524×664 ab (92,78).
Apple 180px, PWA 192/512px, maskable 512px und 1024px-Quelle sind erneuert;
maskable erhält die eigene Sicherheitszone. Browser-Favicons PNG/ICO bleiben
unverändert ohne Ball. Keine erneute Umstellung auf die frühere dunkle Kachel.

`tools/build-app-icons.mjs` liest --bg/--logo direkt aus den Website-CSS-Dateien.
`tools/build-brand.sh` nutzt diesen Build und die separate unveränderte
`assets/brand/tfb-favicon-source.png`. Apple-/Manifest-Icon-URLs sind mit `v=221`
versioniert. Auf bestehenden iPhones kann erneutes Hinzufügen zum Home-Bildschirm
nötig sein; Seitenneuladen allein garantiert keine Aktualisierung installierter Icons.

## Splash, Navigation und Account

- Eine Einstiegsseite mit Original-TFB-Logo und rotem Ball, ohne zusätzlichen
  Aktionsbutton. Der einzige Einstiegsbutton führt **immer nach #home**, auch
  bei zuvor geöffnetem Kiosk oder nach erneutem Öffnen aus der Partnerverwaltung.
- Als angemeldeter Admin: Konto → „Einstiegsseite ansehen“ → roter Ball auf der
  Splash → zentrale Partnerpflege `#partner` (alter Alias `#partnerzahlen`).
  Gäste erhalten diesen Verwaltungszugang nicht; Server prüft die Adminrolle.
- Stift auf der Splash öffnet die vertraute TFB-Textpflege. „Einstiegsseite anzeigen“
  steht oben; die zwei unabhängigen Schalter für kleine Zeilen oberhalb der
  Überschrift und unterhalb des Einstiegsbuttons stehen direkt unter ihrem Textfeld.
  Kleine quadratische Auswahlfelder, schwarzer Rahmen/schwarzes Häkchen auf hellem
  Grund. Ausblenden erhält den Text; zentral speichern wirkt auf allen Geräten.
- Menü **Dating 2.0**, Seitenüberschrift **Verabreden**, Route weiterhin `#treffen`.
- Kiosk hat keine dauerhafte rote Sondermarkierung mehr. Nur der tatsächliche
  aktive Bereich wird hervorgehoben; spätere Menüaktualisierung erhält diesen Zustand.
- Konto verschlankt: Übergangshinweise und „Bisherige Browserdaten übernehmen“
  entfernt. Profil und Mitgliedschaft bleiben, zentrale Bestandsdaten bleiben erhalten.

## Partnerpflege und vorbereitete Auswertung

TFB-Partnerpflege ist zentral und unabhängig von Padel. Schlanke gemeinsame Seite
für Logos, Firma/Marke, Website, Kontakt, Vertragsstand, vereinbarten Jahresbeitrag
und tatsächlich eingegangene Zahlungen pro Beitragsjahr. Kontakt-/Finanzfelder
bleiben ausschließlich für Admins sichtbar. Kategorien: **Premium-Partner** und
**Partnerbandenwerbung** (ohne trennenden Punkt).

Regulärer Beitrag standardmäßig 300 Euro/Jahr. Alle aktiven Partner rotieren
**gleichberechtigt**, keine finanzielle Gewichtung. Premium bekommt ausschließlich
zusätzliche Sichtbarkeit auf der Splash (maximal zwei aktive Premium-Partner).
Zwei Logos je Partnerzeile; Formate/Platzierung wie bei Padel über Geräteklassen.
Ursprünglich 38 Padel-Partner als austauschbarer Testbestand übernommen, ohne
Finanzzusagen/Zahlungen. Echte TFB-Partner nach und nach in dieser Pflege ersetzen;
keine erneute Initialisierung oder Überschreibung inzwischen gepflegter Datensätze.

**Messung bleibt ausgeschaltet:** Frontend `partnerVisibility.enabled=false`,
Worker `PARTNER_MEASUREMENT_ENABLED=0`. Keine Besucherzahlen sammeln, keine
Testwerte als Jahresstatistik anzeigen und kein automatisches Anschalten am Datum.

Vorbereitet sind zwei Ebenen pro Jahr/Seite: (1) Seitenaufrufe, (2) davon Aufrufe
mit Partner-Sichtbarkeit. Gemeinsame Partnerzeile ab mindestens 50 % Sichtbarkeit
für **0,5 Sekunden** im aktiven Tab; vorhandene Logos müssen geladen sein,
bekannte Überlagerungen unterbrechen den Zeitraum. Eine sichtbare Zweierzeile
zählt einmal als `partner_view` und je Partner einmal als `visible`.
Die ältere 1-Sekunden-Definition ist überholt. Bildschirmkontakt ist kein Nachweis
bewusster Wahrnehmung. Ausspielungen/Rotation und gemessene Sichtkontakte getrennt
behandeln. Admin-, Editor-, Präsentations- und lokale Vorschauaufrufe ausschließen.
Jahresübersicht/CSV/Druck sind vorbereitet, noch kein produktives Messjahr.

Schritte: (1) jetziger Live-Auftritt zum Feinschliff, (2) Vorstandsvorschlag für
TFB und Padel ab **01.01.2027**, danach ein volles Jahr auswerten; dazu eigene
Freigabe, Sicherung, Statistikmigration 0004 und Betriebsprüfung erforderlich.
Migration 0005 für Partnerpflege ist bereits eingespielt; 0004 bisher nicht.
Padel-Messung später ins dortige MIS übertragen, gemeinsame Übersicht langfristig
auf TFB vorsehen. (3) nach drei Padel-Betriebsjahren Partnerkonzept nur Padel oder
Padel+TFB prüfen; TFB-Bandenwerbung separat oder gemeinsames Paket bleibt offen.

## Aktuell · Save the Date

Originalanhänge für Oktoberfest und Weihnachtsfeier wieder sichtbar, mit Großansicht
und Download auf Smartphone/Tablet/Desktop. Die gesicherten Originale sind **JPG/JPEG**,
keine PDFs. Sie waren bereits veröffentlicht; die Anzeige akzeptierte zuvor nur
Browser-Uploads. Öffentliche `assets/content/`-Anhänge werden jetzt in Anzeige,
Viewer und Editor unterstützt; statische PDFs sind ebenfalls möglich.

Offene Inhaltsklärung: Weihnachtsflyer nennt **05.12.2026, 18 Uhr**, veröffentlichter
Termineintrag **07.11.2026, 11 Uhr**. Im Rahmen der Wiederherstellung wurden keine
Terminangaben geändert. Auf neuen Auftrag beziehungsweise nach Inhaltsfreigabe klären.

## Prüfungen und Betriebsgrenzen

Für die Änderungen v210–v221 wurden isolierte Backend-/Browserprüfungen eingesetzt:
Adminzugang, Partner-/Logo-/Zahlungspflege, zentrale Splash-Texte, responsive
Darstellung, Home-Einstieg samt Kiosk-Reload, Menütitel und aktive Markierung.
Originalflyer in Großansicht und bytegleiche Downloads geprüft. App-Symbole nach
Abmessungen, exakten Farbwerten, Ballentfernung und Maskable-Sicherheitszone geprüft;
Manifest, Apple-Verknüpfung und Offline-Icons mit echtem Service Worker geprüft.
Die v221-Auslieferung aller Icons, des Manifests und des Service Workers
wurde bytegenau gegen die geprüfte lokale Fassung verglichen. Für v222 zusätzlich
PDF-Seite gerendert und visuell kontrolliert, 24 Seitentests erfolgreich, PDF-Link
in beiden Farbwelten bei 320/390/834/1194/1440px geprüft, Öffnen in neuem Tab und
Offline-Zugriff getestet sowie die finale Live-Auslieferung bytegenau verglichen.

Zentrale Profile/Kiosk/Chats seit v203, Gruppen/Verabredungen seit v204;
Touch-Optimierung seit v205 weiter aktiv. Kiosk bleibt Vorführung ohne produktive
Abbuchung. Übrige redaktionelle Seiten bleiben im bisherigen lokalen Pflege-/Exportweg;
Splash-Texte und Partnerpflege sind die zentralen Ausnahmen. Private Sicherungen,
Mitgliederdaten und Schlüssel niemals veröffentlichen; Browserdaten nicht als
Reparatur löschen. Frühere Wiederherstellungen sind abgeschlossen, nicht erneut
als offene Migration behandeln. Technische Details in
[GERAETEUEBERGREIFENDE_DATEN.md](GERAETEUEBERGREIFENDE_DATEN.md),
[DESIGNVERGLEICH.md](DESIGNVERGLEICH.md) und
[Server-README](../server/cloudflare/README.md).

Die folgenden älteren Abschnitte sind historische Übergaben.

**Verbindlicher Stand: 16.10.2026, veröffentlichte Vorführversion v208.**
Der Nutzer hat Gestaltung und Bedienung ausdrücklich bestätigt und das Einfrieren
beauftragt. Letzte freigegebene Korrektur: ausschließlich die iPad-Partnerflächen
bei gleicher Breite um 20 Prozent höher. Erst auf einen neuen Nutzerauftrag
weiterentwickeln; ältere offene Listen nicht selbständig abarbeiten.

Sicherungstag: `stand-2026-10-16-v208`. Website-Quellstand `4781aca`, Cache
`tfb-kiosk-v208`; Dokumentationsabschluss ist ebenfalls im Sicherungstag enthalten.
Dieser Kurzstand hat Vorrang vor allen historischen Abschnitten weiter unten.

## Live-System und Projektgrenze

- Website: [joern-kaemper.de](https://joern-kaemper.de/).
- Repository: [calvinjohncamp/tfb-website](https://github.com/calvinjohncamp/tfb-website),
  Arbeitsordner `tfb-kiosk/` innerhalb von `9. TFB-Website`. Der Elternordner enthält
  auch eine getrennte Padel-Kopie und fremde Übergaben; diese nicht bearbeiten.
- Website v208 veröffentlicht über
  [Pages-Lauf 38957773956](https://github.com/calvinjohncamp/tfb-website/actions/runs/38957773956).
  Ausgelieferte CSS-Datei und Service Worker bytegenau mit den geprüften Quellen verglichen.
- Cloudflare-Worker `tfb-api`, Version `ec3b353d-216f-42ac-87ab-7881f9cb30c4`,
  D1 `tfb-website`. Diese iPad-/Gestaltungsabschlüsse ändern weder Worker noch Schema.
  Nur bestehende TFB-Dienste verwenden; Padel bleibt ein separates System.

## Bestätigte Gestaltung und Bedienung

- Kühle Welt als Standard, warme Alternative erhalten. Signature-Rot `#C4553A`.
- Alle sieben Menüpunkte in einer Zeile, auch auf dem iPhone: Kiosk, Chat, Aktuell,
  Sport, Club, Dating, Padel. Keine zweizeilige Navigation. „Dating“ ersetzt den
  bisherigen Standard-Menünamen „Verabreden“; die Route bleibt `#treffen`.
- iPhone etwas kleinere, gut lesbare Schrift; iPad hochkant größere Schrift,
  erste/letzte Beschriftung bündig zu den Inhaltskanten, gleichmäßige Abstände.
- Dezente rote aktive Pill, optisch 32 px hoch bei 44 px Tippfläche. Strich näher
  am Begriff, 2,25 statt 3 px. Auf Desktop bleibt die ruhige einzeilige Kopfzeile.
- Partner: zwei gleich breite, mittig eingepasste Logos. Auf iPhone/iPad zusammen
  volle Inhaltsbreite, auf Desktop ab 1024 px zusammen halbe Inhaltsbreite.
  iPhone 100 px Höhe, Desktop 115 px. Tablet mit primärer Touch-Bedienung und
  mindestens 640 × 640 CSS-Pixeln: 132 px statt 110, ab 1024 px Breite 138 statt
  115 px. Das sind jeweils exakt 20 Prozent mehr Höhe; Breiten und Logo-Zentrierung
  bleiben erhalten. iPhone quer und Desktop bekommen diese zusätzliche Erhöhung nicht.
- Roter Ball schaltet vorhandene Admin-Werkzeuge ein/aus; nach Neuladen ausgeblendet.
  Desktop-Fokus über F bleibt auf primäre Maus/Trackpad-Bedienung beschränkt.
- Touch-Optimierung v205 beibehalten: Ansichten lesen bestätigten Cache sofort,
  keine vollständigen Chat-/Bildabfragen bei jedem Seitenwechsel; bekannte Namen/
  Vorschaubilder wiederverwenden, unveränderte Chatbilder nicht erneut schreiben.
  Verspätete Ansichten überschreiben keine später gewählte Seite. Auf Touch entfällt
  die künstliche 480-ms-Bierdeckel-Wartezeit. Nutzer bestätigt die flüssigere Bedienung.

## Zentral gespeicherte Vorführdaten

- Anmeldung, Profilfoto, Kiosk-Einträge, Chatbeiträge/Kommentare/Anhänge und Katalog
  sind seit v203 zentral. Seit v204 zusätzlich Gruppen, Verabredungen, wöchentliche
  Trainingsserien, Teilnehmerantworten und Postfach-Lesestatus.
- Gleicher Account auf iPhone/iPad/Desktop lädt denselben berechtigten Datenbestand.
  Eigene frühere Daten wurden übernommen und anhand privater Sicherungen auf Erhalt
  geprüft. Diese Wiederherstellung ist erledigt, nicht als neue offene Aufgabe ausgeben.
- Geöffnete Apps prüfen alle zehn Sekunden einen Änderungsmarker und beim Zurückkehren.
  Schreibbestätigung erst nach Servererfolg; Revisionen und dauerhafte Vorgangskennungen
  schützen vor Überschreiben und Duplikaten. Unterbrochene Übernahmen werden fortgesetzt.
- Teilnehmer antworten im zentral angemeldeten Modus selbst; keine erfundenen Zusagen.
  Wöchentliche Termine materialisieren beim Öffnen/Abgleich, nicht über einen Cronjob
  oder E-Mail-Versand. Abgesagte Termine werden nicht neu erzeugt.
- Original-Profilbilder öffnen unbeschnitten in hoher gespeicherter Auflösung;
  Vorschau und große Quelle bleiben getrennt. Fotozugriffe bleiben serverseitig geprüft.
- Details und Betriebsgrenzen: [GERAETEUEBERGREIFENDE_DATEN.md](GERAETEUEBERGREIFENDE_DATEN.md).

## Sicherungen und Wiederherstellung

- Private Browser-/D1-Sicherungen und Erhaltungsvergleiche liegen ausschließlich unter
  `.private/release-v203/` und `.private/release-v204/`. Fotos, Chats, Kioskeinträge
  sowie ursprüngliche Planungsfelder und Antworten wurden damals exakt verglichen.
- Zum Einfrieren neuer D1-Export `.private/release-v208/d1-frozen-2026-10-16.sql`,
  in SQLite wiederhergestellt und `PRAGMA integrity_check` erfolgreich geprüft.
  Prüfbericht und Bildschirmvorschauen liegen im selben privaten Ordner.
- Zusätzliche Quellstand-Sicherung als geprüftes Git-Bundle:
  `.private/release-v208/tfb-website-stand-2026-10-16-v208.bundle`.
  Sie enthält den Sicherungstag einschließlich Dokumentationsabschluss, keine lokalen Browserdaten.
- Eine Datenbanksicherung enthält keine browserlokalen Website-Editor-Entwürfe.
  Diese weiterhin bei Bedarf über die vorhandene vollständige Browser-Sicherung sichern.
- Browserdaten/Safari-Cache niemals als vermeintliche Reparatur löschen. Neue Website-
  Fassung durch vollständiges Schließen und Wiederöffnen der App laden.
- Private Exporte, Mitgliederdaten und Zugangsschlüssel niemals committen/veröffentlichen.
  `tools/prepare-pages.py` veröffentlicht nur öffentliche Webdateien und schließt
  Server, Dokumentation, Werkzeuge und Sicherungen aus.
- Zum Quellvergleich den Git-Tag verwenden; eine spätere Wiederherstellung der
  Datenbank ist ein eigener Auftrag. Kein pauschales `git reset --hard`, kein
  Zurückspielen alter Browserdaten über neuere zentrale Daten.

## Prüfung und nächste Sitzung

- Abschluss v208: isolierte Chromium-Ansichten mit Testkonto, beide Farbwelten,
  acht Breiten von 320 bis 1440 px einschließlich großem iPad hochkant und quer.
  Eine Menüzeile, bündige Kanten, keine Überlappung/Überbreite, Partnerbreiten,
  exakte Tablet-Höhen und mittige Logos erfolgreich geprüft. Drei Prüfungen des
  öffentlichen Pakets und `git diff --check` erfolgreich.
- Letzter Funktionsstand v207: Farbwelt-Browsertest und Touch-Performance-Test
  erfolgreich (Profil/Verabredungen etwa 60–75 ms bei künstlicher API-Latenz).
  Zuvor v205: 73 Node-Tests, Zwei-/Vier-Profil-Synchronisierung, Sicherungen,
  Gruppen/Serien/Zusagen/Käufe und unterbrochene Speicherung geprüft.
  Diese Funktionsprüfungen wurden für die reine iPad-Höhenänderung nicht alle wiederholt.
- Der Nutzer hat iPhone-Bedienung und Gestaltung praktisch bestätigt. Automatisierte
  Größenprüfungen sind keine vollständige physische iOS-Geräteabnahme. Weitere
  Detailbeobachtungen des Nutzers erst auf neuen Auftrag bearbeiten.
- Website bleibt eine Vorführung. Produktive Abbuchung/SEPA, zentrale Monatsabschlüsse,
  E-Mail/Push-Zustellung und fertiger Vereinsbetrieb sind nicht freigegeben.
  Website-Editor/CMS und direkter Datei-/localhost-Modus bleiben lokal.
- Möglicher späterer Vereinsumzug zu Supabase ist eine getrennte Entscheidung;
  keine Zusammenlegung mit Padel eigenständig beginnen. Digitale Aufnahme bleibt
  ein separater vorbereiteter Dienst, kein durch diesen Abschluss gestarteter Versand.
- Für Nachprüfungen: `node tools/test-browser-touch-performance.mjs`,
  `node tools/test-browser-meet-sync.mjs`, `node tools/test-browser-cloud-sync.mjs`,
  `node --test tools/test-app-sync.mjs tools/test-meet-sync.mjs tools/test-cloudflare-directory.mjs`
  bzw. gezielt die jeweils betroffenen Tests. `python3 tools/test-public-content.py` vor Veröffentlichung.
  Browser-Tests verwenden isolierte synthetische Daten, keine privaten Chrome-Sitzungen.

## Freigabestand

Stand eingefroren. Neue Änderungen, Veröffentlichungen oder Migrationen erst auf
neuen konkreten Nutzerauftrag. Bestehende Daten und lokale Nutzeränderungen erhalten.

## Historischer Stand bis v203 – nur Verlauf

Die folgenden Aussagen gelten ausschließlich für ihren damaligen Zeitpunkt.
Maßgeblich ist der Abschluss v208 oben.

**Aktueller Stand: 16.10.2026, veröffentlichte Vorführversion v203.**
Datenbankerweiterung, Worker und Website wurden vom Nutzer ausdrücklich freigegeben
und veröffentlicht. Profilfoto, Bierdeckel und Chats/Kommentare/Bildanhänge werden
bei geschützter Anmeldung geräteübergreifend gespeichert. Der Kiosk bleibt eine
Vorführung ohne produktive Abbuchung. Verabredungen/Gruppen und Websitebearbeitung
bleiben lokal. Ausführlicher Verlauf: [PROJEKTGEDAECHTNIS.md](PROJEKTGEDAECHTNIS.md).
Die folgende Zusammenfassung hat Vorrang vor historischen Zwischenständen.

## Veröffentlichung 16.10.2026 abgeschlossen

- Additive Migration `0003-app-sync.sql` erfolgreich; vorhandene Mitglieder-/
  Zugangstabellen erhalten. Private D1-Sicherung vor Migration wiederhergestellt
  und auf Integrität geprüft.
- Worker `26195ded-5951-4e21-b8cf-f1c170af1e09` online; neue Endpunkte verweigern
  anonyme Foto-/App-Zugriffe mit 401. Health-Check 200.
- Website-Quellstand `e775447`, Cache `tfb-kiosk-v203`, erfolgreicher Workflow
  [38945364365](https://github.com/calvinjohncamp/tfb-website/actions/runs/38945364365).
  Ausgelieferte Programmdateien bytegenau mit der lokalen Fassung verglichen.
- Aktuellen Browserbestand vor Umstellung über die bestehende Sicherungsfunktion
  exportiert und privat kopiert. Eigene Daten über die veröffentlichte Oberfläche
  übernommen; zweite D1-Sicherung anschließend wiederhergestellt und Bilddateien,
  Texte sowie Kioskeinträge mit der ersten Browsersicherung exakt verglichen.
- Private Sicherungen, Vergleichsbericht und Bildschirmnachweis ausschließlich
  unter `.private/release-v203/`, ignoriert von Git und Websitepaket.
- Nutzer braucht am iPhone nur die App neu zu öffnen und sich ggf. mit demselben
  Konto anzumelden. Safari-Daten nicht löschen. Die eigene Übernahme ist bereits
  erledigt und darf nicht als noch offener Schritt dargestellt werden.

## Umsetzung v203 (vor Veröffentlichung vorbereitet)

- Profilbilder öffnen die gespeicherte große, unbeschnittene Quelle in Chat,
  Mannschaftsbeiträgen und Verabreden. Großbilder werden beim Anklicken geladen.
- `cloud-sync.js` ergänzt die vorhandene Cloudflare-Anmeldung: Profilfoto,
  Kiosk-Striche, Chats samt Kommentaren/Anhängen und Kiosk-Sortiment werden
  zentral gespeichert. Server prüft Sitzung, Eigentum und Mannschaftsrechte.
- Änderungen verwenden Versionsprüfungen und eine wiederholbare Vorgangskennung.
  Ein lokales IndexedDB-Protokoll erhält unterbrochene Speicherungen. Beim
  Wiederöffnen wird derselbe Vorgang wiederholt, ohne doppelte Striche/Beiträge.
- Vor dem ersten Serverabgleich wird der bisherige Browserbestand samt Bildern
  in einer separaten lokalen IndexedDB gesichert. Account → „Bisherige Browserdaten
  übernehmen“ zeigt eine Vorschau und übernimmt eigene Daten nach Bestätigung.
  Admins können dabei ausdrücklich eigene Inhalte des alten m-demo-Kontos zuordnen.
- Geöffnete Seiten prüfen alle zehn Sekunden einen kleinen Änderungsmarker;
  bei Änderungen wird aktualisiert. Rückkehr zur App stößt ebenfalls einen
  Abgleich an. Ein offener Editor wird nicht neu gerendert.
- Direkter HTML-/localhost-Vorführmodus bleibt lokal. Verabredungen/Gruppen und
  Websitebearbeitung werden mit diesem Ausbau noch nicht zentral gespeichert.
- Neuer SQL-Bestand: `0003-app-sync.sql`, nur neue Tabellen. Worker muss vor der
  Website aktualisiert werden. Diese Reihenfolge wurde inzwischen abgeschlossen.
- Veröffentlichungsschritte und genaue Grenzen:
  [GERAETEUEBERGREIFENDE_DATEN.md](GERAETEUEBERGREIFENDE_DATEN.md).

## Veröffentlichung und Projektgrenze

- Website: https://joern-kaemper.de/ – DNS-Prüfung erfolgreich, HTTPS erzwungen.
  `www` zeigt per CNAME auf `calvinjohncamp.github.io`; Mail-Einträge bleiben erhalten.
- Vorheriger Online-Stand: `a31c60b`, Cache `tfb-kiosk-v201`, Lauf `38775995321`.
  Dieser wurde durch den oben dokumentierten Release v203 ersetzt.
- Repository `calvinjohncamp/tfb-website`, lokaler Projektordner `tfb-kiosk`.
  GitHub ist öffentlich; private Mitgliederdaten, Meldelisten, Sicherungen und
  Schlüssel gehören niemals in Git oder das Pages-Paket.
- Die separate Padel-App wird durch diesen Abschluss nicht verändert.
  Das anschließende Thema Profilbilder und Synchronisierung ist oben dokumentiert.

## Bestätigte Bedienung und Funktionen

- Kühle Gestaltung ist Standard, warme Gestaltung bleibt als Alternative erhalten.
- Roter Ball: Admin-Werkzeuge sind nach Neuladen ausgeblendet; ein Klick blendet
  sie ein, der nächste wieder aus. Das gilt auch bei Cloudflare-Anmeldung.
  Serverseitige Berechtigungen bleiben unabhängig davon geprüft. Eigene Beiträge
  und Kommentare bleiben für Mitglieder bearbeitbar. Sichern/Laden im Profil
  wird für die Verwaltung ebenfalls über diesen Schalter sichtbar.
- Kiosk: Zustimmungstexte gemäß letzter Nutzerfassung, Version `tfb-kiosk-v3`.
  Die bekannte Strichliste zeigt angemeldeten Mitgliedern die vergangenen sieben
  Tage mit Namen und Strichen, ohne Beträge. Monatsabrechnungen sind für das
  Mitglied und den Kassenwart vorgesehen. Namen umbrechen zwischen Nach- und
  Vorname. In Listen bis 639px stehen Nachname und Vorname untereinander in
  einer linken Namensspalte; alle fünf Kategorien bleiben rechts daneben.
  Getränkestriche sind wie alle anderen Striche mittig unter der Überschrift.
  Getränke bleiben breiter; auf Handybreite umbrechen Bündel innerhalb der
  Spalte, ohne zusammengequetscht zu werden. Überschriften: Getränke ausgeschrieben, Kränze (auch auf Desktop),
  Snacks, Spiel, Equip. Mobile Spielernamen um 2px größer (15,6px bzw.
  14,8px auf den kleinsten Displays). Sehr lange Namen dürfen innerhalb ihrer Spalte umbrechen.
  Alte, widersprüchliche Strichlisten-Regeln in app.css zusammengeführt.
  Prüflauf: `node tools/test-browser-tally-layout.mjs`, 15 Displaybreiten von
  320 bis 1920px, 1/6/15/18 Striche, Zentrierung der tatsächlichen Strichgruppen,
  Namen/Spaltenüberschriften und Zeilendetails; Browseraufnahmen Desktop,
  700px, 430px, 390px, 320px visuell geprüft. Bestehender Browsertest
  `tools/test-browser-chat-recovery.mjs` ebenfalls erfolgreich.
- Abrechnungs-Vorführung: In der eigenen Abrechnungsansicht von Admins werden
  im Demo-Backend die beiden Vormonate mit 34,80 € bzw. 23,50 € ergänzt, als
  „eingezogen“ und „Beispiel · fiktiver Betrag“. Nur Anzeige, keine Speicherung
  der Beispiele, keine Änderung an laufenden Käufen. Bereits vorhandene eigene
  Monatsabrechnungen haben Vorrang; andere Mitglieder erhalten keine Beispiele.
  Nutzer betont ausdrücklich: veröffentlichte Website ist eine Vorführung,
  der fertige Vereinsbetrieb ist noch nicht freigegeben.
  Prüfung: `node tools/test-browser-statement-preview.mjs` erfolgreich;
  Desktop und Handy visuell geprüft, auch 320px ohne horizontalen Überlauf.
- Verabreden: Einladende können direkt im Spiel weitere Mitglieder einladen.
  Zusagen über die Spielerzahl hinaus erscheinen auf der sichtbaren Ersatzbank.
  Jeder Teilnehmer einschließlich Einladendem kann mit „Kann nicht“ später absagen,
  bleibt unter „abgesagt“ sichtbar; der erste Ersatz rückt automatisch nach.
- Chat: freiwilliges Überschriftenfeld dauerhaft sichtbar, Nachricht zuerst.
  „Auch in meiner Mannschaft anzeigen“ bietet nur die eigenen Mannschaften an;
  bei mehreren sind diese einzeln wählbar. Bestehende Beitragszuordnungen bleiben
  beim Bearbeiten erhalten. Keine beliebige Admin-Mannschaftsauswahl im Editor.
- Vollständiger Beitrag mit flachen Kommentaren über „Kommentieren“/Kommentarzahl.
  Eigene Kommentare bearbeiten/löschen, Verwaltung kann fremde entfernen.
  Bis zu drei Bilder pro Kommentar, auch reine Bildantworten, mit Galerie,
  Bildbearbeitung im Sinne von Entfernen/Ergänzen und Einwilligung für Personenfotos.
- Neue Kommentare anderer Mitglieder werden beim Beitragsautor je Beitrag in der
  Klingel gebündelt. Lesen/Entfernen bleibt gespeichert; spätere Kommentare melden
  sich erneut. Zusätzliche Hinweise auf Gruppenbeiträge bleiben freiwillig.
- Die drei wiederhergestellten eigenen Chat-Beiträge einschließlich aller acht
  Fotos sind laut Nutzer wieder vollständig vorhanden. Nicht erneut importieren
  oder den aktuellen Browserstand durch eine ältere Sicherung ersetzen.

## Was online ist und was lokal bleibt

Cloudflare-Worker `https://tfb-api.calvinjohncamp.workers.dev` mit D1 `tfb-website`,
Binding `DB`: geschützter Mitgliederzugang, Verwaltung, Mitgliedersuche und eigene
Mannschaftszuordnung. Zugang ist eingerichtet. `member_teams`-Migration ist bereits
angewendet; bei anderen bestehenden Datenbanken vor dem Worker-Update ausführen.
Private Zuordnungen: 313 für 138 Konten; 38 Meldungszeilen ohne eindeutigen Abgleich
bleiben offen. Neue Saison/neue Mitglieder erfordern einen vertrauenswürdigen
privaten Abgleich; Zuordnungen nicht erraten.

**Weiterhin lokale Vorführung je Browser:** Kiosk-Käufe und Abrechnungen,
Chat-Beiträge/Kommentare/Bilder, Verabredungen/Gruppen/Einladungen/Antworten,
Ersatzbank und Klingelzustand. Keine gemeinsame geräteübergreifende Speicherung
oder echte Zustellung; automatische Demo-Antworten bleiben aktiv. Kein echter
SEPA-Einzug oder E-Mail-Versand. Öffentlich erreichbare Website bedeutet hier
noch keinen produktiven Vereinsbetrieb.

Lokale Daten und Bilder gehören in den vollständigen privaten JSON-Export.
Browserdaten nicht pauschal löschen. Die gezielte Chat-Wiederherstellung ist von
„Sicherung laden“ zu unterscheiden, das den vollständigen Stand ersetzt.
Dieser Dokumentationsabschluss erstellt keinen neuen Browserdaten-Export.

## Verbindliche Richtung für den späteren Vereinsbetrieb

Cloudflare im vorhandenen persönlichen Konto bleibt für die Vorführung.
Bei Vereinsentscheidung wird Supabase im bereits vorhandenen Vereinsumfeld
bevorzugt, da die Padel-App es bereits nutzt. Kein zusätzliches Cloudflare-
Vereinskonto planen. Noch keine Migration oder Zusammenlegung mit Padel beauftragt.

Vor echtem Betrieb gemeinsame Speicherung samt Zugriffsrechten, Medien,
Einladungen/Ersatzbank und Benachrichtigungen umsetzen und abnehmen;
Mannschaftspflege, Sicherung/Wiederherstellung und Zuständigkeiten festlegen.
Die Klingel als zentrales Postfach ohne E-Mail bleibt gewünscht; Handy-Push ist
nur eine mögliche spätere Ergänzung, noch nicht umgesetzt.

## Prüfung und Weiterarbeit

Die letzten Funktionsänderungen wurden mit isolierten Browserprüfungen für
Admin-Umschaltung, Kommentare/Bilder/Mannschaften, Wiederherstellung und schmale
Ansichten sowie den zugehörigen Backend-/Sicherungsprüfungen geprüft. Keine echte
iPhone-/iPad-Geräteabnahme behaupten. Für diesen Abschluss nur Dokumentation
geändert; keine neue Website-Veröffentlichung oder Datenmigration erforderlich.

Nächste Sitzung: auf diesem bestätigten Stand aufbauen und das vom Nutzer noch
zu benennende Thema zu TFB-Website und Padel aufnehmen. Keine alte offene Liste
ungeprüft abarbeiten und keine privaten Vorführdaten zurücksetzen.

## Historischer Verlauf – frühere Zwischenstände

Die folgenden Abschnitte dokumentieren frühere Sitzungen. Versionsnummern,
Veröffentlichungsstatus und Bedienhinweise dort gelten nur für den jeweiligen
Zeitpunkt; der Stand v196 oben ist maßgeblich.

## Kühle Welt als Standard, zwei Admin-Optionen (v183)

Nutzer bevorzugt neue Typografie/Menü und aufgeräumten Kiosk; kühle Welt mit neuen
Schriften ist jetzt Standard. Warme ursprüngliche Welt bleibt Nummer zwei.
Zwischenvariante kühl/alte Schriften aus UI und CSS entfernt. Neuer lokaler Key
`tfb_design_world_v2` ignoriert ältere Testpräferenzen, fehlender Wert = cool.
Auf Home links in der Bleistift-Zeile „Kühle Welt“/„Warme Welt“, aktiv markiert,
nur sichtbar wenn derselbe Admin-Zustand auch den Bleistift zeigt. Keine Anzeige
für Gäste/Mitglieder; Demo-Admin blendet über roten Ball ein. Logo-Schriftzug bleibt
auf allen Seiten als Zweierwechsel verfügbar, auch in Fokus/Präsentation.
Auswahl lokal je Browser gespeichert, nicht als zusätzliche globale Site-Einstellung.
Tests erfolgreich: Default/Legacy-Auswahl/Reload, Admin-Sichtbarkeit/Ausrichtung,
alle Routen und Desktop/Mobilbreiten, unveränderte Daten, Offline-Datei, Fokus-Wechsel.
Keine Veröffentlichung; Dokumentation der aktuellen Entscheidung in DESIGNVERGLEICH.md.
v182 und früher unten historisch.

## Drei Welten und Dating-Texte (v182)

Aktueller lokaler Cache v182. Klick auf Logo-Schriftzug überall:
warm (Original/Standard) → kühle Flächen mit EXAKT bisherigen Schriften und
Schriftfarben → vollständige kühle Welt mit Bricolage/DM Sans → warm.
Mittlere Variante eigene CSS-Klasse `editorial-colors-only`, nur Flächen/Farben
für Hintergründe/Linien, keine Font-/Textfarb-Overrides. Auswahl `colors` zusätzlich
zum bisherigen `cool` unter gleichem Preference-Key. Logo-Home und Ball unverändert.
Menüpunkt weiterhin „Verabreden“; darin H1 „Dating 2.0“, Abschnitte
„Einladungen für mich“ und „Meine kommenden Matches“. Logik/Inhalte sonst identisch.
Erweiterter Design-Test prüft alte Font-/Farbwerte auf allen Routen/Breiten,
Dreierzyklus, Reload, neue Texte und Rückkehr. Details: DESIGNVERGLEICH.md.
Keine Veröffentlichung/Designentscheidung; zentrale Admin-Auswahl weiterhin später.

## Designvergleich erweitert: alle Seiten (v181)

Aktuell v181, weiterhin Experiment ohne Entscheidung zwischen warm/kühl.
Nutzer mag die warme Welt weiterhin und möchte nun alle TFB-Seiten vergleichen.
Logo-Schriftzug schaltet auf jeder internen Seite/Unterseite um; Account und Dialoge
folgen der Auswahl. Basis/Inhalte unverändert, keine zweite Datenkopie.
Kühle Zahlen auf Home wieder feine rote Konturen (1.25px, Bricolage 600), Menü
etwas größer, DM Sans 700, dunklerer Sekundärton. Neutrale Flächen auch in Kiosk,
Abrechnungen, Sport/Training/Mannschaften, Club, Verabreden und Rechtstexten.
Kühle Verabreden-Arten auf schmalen Geräten als 2x2, kein Textüberlauf.
Warmer Look bleibt unverändert; beide Welten als spätere Admin-Option nur vorgemerkt.
Ausführliche Quellen/Prüfung in DESIGNVERGLEICH.md. v180-Scope unten historisch.

## Design-Experiment 13.10.2026: Home/Chat (v180)

Nach dem Tagesabschluss bittet der Nutzer um einen reversiblen Vergleich zur
Foks-Vorlage. Aktueller lokaler Cache v180, keine Design-Freigabe oder Veröffentlichung.
Vorheriger warmer v179-Look bleibt Basis/Standard. Kleiner Schriftzug unter dem
TFB-Zeichen schaltet auf Home/Chat zwischen warm und kühl; Zeichen bleibt Home-Link,
Ball bleibt Admin-Gimmick. Inhalte/Fotos/Daten identisch, keine zweite Kopie.
Getrennte Preview-CSS/JS, lokaler Preference-Key, außerhalb Home/Chat inaktiv.
Originalfonts der aktuellen Hersteller-Demo identifiziert und lokal lizenziert:
Bricolage Grotesque (Titel), DM Sans (Fließtext/Kategorien). Screenshotfläche
gemessen #EFEFEF, neutrales Preview-Anthrazit #171717, TFB-Rot bleibt erhalten.
Details, Quellen, Farbabweichungen und Rückbau: [DESIGNVERGLEICH.md](DESIGNVERGLEICH.md).
Tests: Design-Umschaltung/offline/Dateiseite/Mobilbreiten, Fokus-Regression;
Screenshots nur isolierte Testdaten. HTTP-Vorschau separat von bisherigen file-Daten.

## Tagesabschluss 13.10.2026: freigegebener Stand v179

Der Nutzer hat die Umsetzung der optionalen Chat-Hinweise ausdrücklich bestätigt
(„gefällt mir genau so“) und die Arbeit für heute beendet. Aktueller lokaler Stand:
`tfb-kiosk-v179`. Die folgenden Ergänzungen dokumentieren die Entwicklung;
Versionsangaben v178 und früher sind historische Zwischenstände.

- Fokus bleibt ausschließlich für Desktop; Installation für weitere Nutzer bleibt zurückgestellt.
- Account: nächstes zugesagtes Match mit feinem Anthrazit-Rahmen; Kiosk-Umsätze
  mit Details-Link zu Einzelposten/Monatsabrechnungen und Heute-Link zum Bierdeckel.
- Laufende Abrechnung zeigt unter dem Betrag nur „Einzug am [Datum]“.
- Klingel: optional bestehende Beiträge von Mannschafts-/Trainingsgruppenmitgliedern,
  je Autor gebündelt, direkt verlinkt, nach Ansicht dauerhaft als gelesen entfernt.
  Kein neuer Gruppenchat und keine Änderungen am Einladungsablauf.
- Auswahl im eigenen Account unter Benachrichtigungen → Klingel. Standard:
  „Nur Einladungen“; Opt-in: „Einladungen und Gruppenbeiträge“. Keine alten Beiträge
  nachmelden, keine Personen-Followliste, keine Mails/Push/Banner.

Zum Abschluss erfolgreich ausgeführt: `test:browser:chat-notices`,
`test:browser:next-match`, `test:browser:overview`, `test:browser:meet-weekdays`.
Schmale Account-Darstellung visuell kontrolliert; `git diff --check` erfolgreich.
Nicht die gesamte Testsuite erneut ausgeführt; keine echte iPhone-/iPad-Geräteprüfung.
Keine Veröffentlichung, kein Commit/Tag/Push und kein neuer JSON-Sicherungsexport.
Separate Padel-Anwendung unverändert. Nächste Sitzung baut auf diesem Stand auf.

## Ergänzung 13.10.2026: optionale Chat-Hinweise (v179)

Aktueller lokaler Cache v179. Nutzer hat den zunächst besprochenen Gruppenchat
ausdrücklich verworfen: KEIN neuer Chat unter Verabreden/Trainingsgruppen.
Stattdessen bestehende Chat-/Insider-Beiträge nach Verfasser berücksichtigen:
gemeinsame nuLiga-Mannschaft (bestehende rosterOf-Logik) oder bestätigte gemeinsame
Verabreden-Gruppe. Pending zählt nicht. Account-Auswahl unter Benachrichtigungen:
„Nur Einladungen“ (Standard) / „Einladungen und Gruppenbeiträge“.
Beim Einschalten keine alten Beiträge nachmelden; beim erneuten Einschalten
ebenfalls neuer Start. Eigene/verborgene/gelöschte/fremde Beiträge ausgenommen.
Maximal sieben Tage, je Verfasser gebündelt und bei Mehrfachzuordnung nicht doppelt.
Klingel-Link öffnet neuesten Beitrag direkt unter `#chat/beitrag/<id>`; nur dieser
wird gelesen und verschwindet, weitere bleiben im Bündel. Öffnen aus Chat-Übersicht
markiert ebenfalls gelesen. Entfernen/Alle Hinweise entfernen bestätigt alle
Beiträge des jeweiligen Bündels; Einladungslogik unverändert.
Account-speichernde APIs: chatNotices/readChatPosts; keine Mails, Push oder Banner.
Weiterhin lokale Demo, keine geräteübergreifende Zustellung vor Backend-Anbindung.
Neuer isolierter Test: `npm run test:browser:chat-notices` mit localhost:5180.
Erfolgreich geprüft: Standard/Opt-in/Opt-out, Autor-Zuordnung, Bündelung,
Ausschlüsse, Direktlink, dauerhaft gelesen nach Reload, Entfernen und 1100/390/320px.

## Ergänzung 13.10.2026: Abrechnungshinweis (v178)

Aktueller lokaler Cache v178. Im laufenden Monat unter „Meine Abrechnungen“
steht unter dem Gesamtbetrag nur noch „Einzug am [Datum]“, ohne Strichanzahl
und ohne den Zusatz „per SEPA-Lastschrift“. Einzelposten und Berechnung unverändert.

## Ergänzung 13.10.2026: Account-Gliederung (v177)

Aktueller Cache `tfb-kiosk-v177`, nur lokal. Nächstes Match jetzt mit feinem
1px-Signature-Anthrazit-Rahmen und 16px-Rundung passend zu den Account-Feldern.
Über den drei Beträgen steht „Kiosk-Umsätze“. Darunter führt „Details ansehen“
zu `#abrechnungen` (laufender Monat mit Einzelposten und abgeschlossene Monate),
schließt den Account; der Heute-Betrag führt weiterhin zum Bierdeckel im Kiosk.
Keine Änderungen an Umsatz- oder Match-Berechnung. Der erweiterte isolierte
Account-Browsertest ist erfolgreich; v176 unten beschreibt den vorherigen Stand.

## Ergänzung 13.10.2026: nächstes Match im Account (v176)

Aktueller Cache `tfb-kiosk-v176`, weiterhin nur lokal. Im Account unter den beiden
Bestätigungen und über Kiosk-Beträgen/Angaben ein ungerahmter Hinweis mit Datum,
Uhrzeit, Titel/Ort und Direktlink zum nächsten zugesagten Verabreden-Termin.
Gemeinsame `lineup`-Logik: nur tatsächliche Spieler; offene Einladungen, Absagen,
Ersatzplätze und bereits gestartete Termine ausgeschlossen. Auch Training enthalten,
keine automatische Zusage für noch nicht verschickte Serien. Ohne Termin kurzer
Leerhinweis. Quelle ausschließlich lokale TFB-Verabreden, keine Padel-Buchungsanbindung.
Padel-Vorbild in `8. Padel Bielstein 2027` nur gelesen, nicht verändert.
Read-only `TFB.meet.nextMatch(memberId)` in `meet.js`; Account in `app.js`, CSS
`.acct-next-match`. Test `npm run test:browser:next-match` mit localhost:5180 und
isolierten Daten erfolgreich: Sortierung/Zusagen/Ersatz/Absagen, Training, leer,
Position/Direktlink und 1100/834/390/320px. Keine neue Veröffentlichung oder Sicherung.

## Verbindliche Übergabe 13.10.2026: lokaler Stand v175

**Dieser Abschnitt ist aktuell; v165 und frühere Abschlüsse unten sind historisch.**
Nur die TFB-Website in `tfb-kiosk` wurde weiterentwickelt, nicht die separate
Padel-Anwendung in `01 Software`. Fokus-Darstellung wurde vom Nutzer mehrfach
praktisch bestätigt; letzter Auftrag ist die Dokumentationsaktualisierung.

### Einstieg und Vorführung

- Website: `/Users/jk/Dropbox/9. TFB-Website/tfb-kiosk/index.html`, lokal in Chrome;
  gespeicherte Nutzerinhalte liegen im bisherigen Browserprofil und Bildspeicher.
- Desktop `TFB.app`: eigener Hintergrundschalter, reines `#1C1A17`, ohne Logo/Text;
  zweiter Doppelklick stellt den bisherigen Hintergrund samt Darstellung wieder her.
- Desktop `TFB Vorführung.app`: lokale Website als Chrome-App-Fenster. Bei Bedarf
  Ctrl+Cmd+F für Browser-Vollbild; Cmd+W schließt. Apps/Swift-Quellen und Hinweise
  liegen neben dem Repository in `../Präsentationsmodus`, nicht im Website-Git.
- F in der Kopfzeile öffnet Fokus auch ohne Installation/Anmeldung. Links neben
  Klingel, unterkantenbündig; 21,6px-Kreis/1,15px-Anthrazitrand, F 90% Menügröße,
  Gewicht 600, 15,4px Abstand. Auf iPhone/iPad/Android NICHT sichtbar, unabhängig
  von Orientierung, Breite oder Browser-/App-Nutzung. Desktop braucht primären
  Maus-/Trackpad-Zeiger. Keine mobile Freigabe beauftragt.
- Fokus: dunkler Rahmen, mittige Breite 1440/834/390px oder seitlich ziehen;
  versteckte Steuerung am unteren Rand, Alt+1/2/3 für Breiten, Alt+P für Steuerung.
  Das sind Layoutsimulationen, keine iOS-Emulation. X/Escape beendet; eingebettetes
  Desktop-F beendet ebenfalls. macOS-Hintergrund bleibt durch F unverändert.
- Die normale Homepage enthält keinen Installations-/Fokus-Streifen mehr und
  keine entsprechende Bearbeitung. Auch aus dem Konto entfernt. Alte
  `site.focusStrip`-Daten erhalten, aber nicht gerendert.
- Öffentliche App-Installation ausdrücklich bis zur grundsätzlichen Zustimmung
  des Vorstands zurückgestellt. Nicht wieder aktivieren oder aus alten Wünschen
  als offener aktueller Implementierungsauftrag ableiten.

### Technischer Stand und Grenzen

- Cache `tfb-kiosk-v175`, letzte eingefrorene Git-Fassung `d8d7762` / Tag
  `stand-2026-10-12-v160`. Alle späteren Änderungen lokal/uncommittet; kein neuer
  Commit/Push/Tag/Deployment/JSON-Export bei diesem Abschluss. Nutzerdateien,
  vorhandene Änderungen und `.claude/` nicht zurücksetzen.
- `praesentation.html`, `assets/js/presentation.js`, `presentation-bridge.js`,
  `focus.js`, `assets/css/focus.css`: Fokus-Rahmen, Gerätebreiten, Brücke und Einstieg.
  Vollbild benötigt Nutzerklick und Browserfreigabe; sonst Fokus im Browserfenster.
- `demo-backend.js` lädt bei Fokus-Rückkehr lokale Daten frisch; `site.js` kann
  Bildcache erneuern, `app.js` aktualisiert Profilbilder. `autosave.js` pausiert
  das ausgeblendete Elternfenster, damit es keine alten Daten über neue schreibt.
- TFB-Signature-Kachel ohne Ball als gemeinsames App-Symbol, Name `TF Bielstein`;
  Quelle `assets/brand/tfb-app-icon-source.png`, Erzeugung `tools/build-brand.sh`.
- Native Test-App `TF Bielstein.app` / ZIP `assets/downloads/tf-bielstein-mac-v2.zip`:
  Paketfehler repariert, ganze App ad hoc signiert und entpackte ZIP verifiziert.
  Trotzdem keine Developer-ID/Apple-Notarisierung; Gatekeeper blockiert den
  heruntergeladenen Test-Installer weiterhin. Kein freigegebener öffentlicher
  Installationsweg, keine Sicherheitsumgehung. Build `../Präsentationsmodus/build-tf-bielstein.sh`.
  Mac-Launcher Apple Silicon/Chrome/lokaler Websiteordner; Windows-CMD nicht auf
  Windows getestet. Die Dateien bleiben als zurückgestellter Entwurf erhalten.
- `site.js`/`app.css`: Feature-Titel aus nicht trennbaren Wortspannen, Schrift
  bei Bedarf anhand des längsten Worts einpassen; ResizeObserver plus Render-/Font-
  Reaktion. Screenshotfehler „Tennisfreund / e“ behoben, ohne Inhaltsänderung.
- Foto-Randfix in `app.css`: `.gal-single` und Foto maximal verfügbare Bühnenbreite,
  kein horizontaler Fotoüberlauf. `tfb-presentation-page` versteckt nur die äußere
  Fokus-Scrollleiste und sperrt Root-Scroll bei Modal; iframe-Hintergrund Anthrazit.
  Normale Website bleibt scrollbar, Galerie/Foto-Wechsel unverändert bedienbar.
- `meet.js`: Wochentag Mo–So vor Datum/erstem Termin, nächster passender Tag nach
  lokaler Kalenderrechnung (auch über Zeitumstellung). Heute nur bei bevorstehender
  gewählter Uhrzeit. Bei Serien späterer Start desselben Tags; Abweichung wird
  beim Speichern zurückgewiesen. Einzel/Doppel: freie Datumswahl aktualisiert
  Wochentagsknöpfe. Seriendetails oben schreibgeschütztes Feld Wochentag.
  Datenmodell bleibt `from` als Quelle des Serientags, kein redundantes neues Feld,
  keine Migration bestehender Serien/verschickter Termine. Demo-Verabreden bleibt
  lokaler Speicher `tfb_meet_demo_v2`; echter automatischer Versand braucht weiterhin
  einen Serverdienst, nicht durch diese Oberfläche implementiert.

### Prüfnachweise und Weiterarbeit

Nach den letzten Codeänderungen erfolgreich: Fokus-Test einschließlich Foto-Rand,
Wortumbruch/F-Layout/Mobilausschluss; Wochentagstest einschließlich Speichern,
Seriendetails/Einzel/Doppel/Zeitumstellung; Galerie- und Übersichts-Regression.
Screenshots visuell geprüft. Alle Browserläufe in isolierten Testprofilen mit
synthetischen Inhalten, nicht mit den privaten Nutzerinhalten. iPhone/iPad-Größen
und Kennungen simuliert, kein vollständiger Safari-/echter Gerätetest.

Aus `tfb-kiosk`, Vorschau für Fokus-/Einladungstest starten:

```sh
python3 -m http.server 5180 --bind 127.0.0.1
npm run test:browser:focus
npm run test:browser:meet-weekdays
npm run test:browser:gallery
npm run test:browser:overview
```

Auf diesem Mac liefen Tests mit
`TFB_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`.
Die lokale HTML-Vorführung selbst braucht keinen Server. Vorschau über localhost
hat getrennte Demodaten; nicht mit den gespeicherten file:-Inhalten verwechseln.
`npm run test:browser` enthält weiterhin Übersicht/Galerie/Backups; die neuen
Fokus-/Wochentagstests separat. Backup-/Node-Nachweise aus früheren Abschlüssen
nicht als jetzt erneut ausgeführt ausgeben. Im Dokumentationsauftrag keine Tests
erneut ausgeführt und keine neue Inhalts-/Bildsicherung erstellt.

Nur auf neuen Nutzerauftrag weiterarbeiten. Bekannte Folgeaufgaben vom 12.10.2026
(Jugendschutz/Rechte, Buchungsspeicherung, echter Mehrbenutzerbetrieb/Lastschrift,
Sicherungsabgrenzungen und Wartbarkeit) bleiben offen; diese Vorführung ist keine
Produktivfreigabe. Projektgedächtnis oben und aktuelle Umsetzung haben Vorrang
vor den nachfolgenden historischen Zwischenständen.

## Früherer Abschluss dieses Chats 13.10.2026 (v165, historisch)

**Verbindlicher Einstieg: aktueller lokaler Stand vom Nutzer abgenommen.** Nutzer:
„Gefällt mir sehr gut alles jetzt“, aktuell keine weiteren Anpassungen. Dieser
Abschnitt enthält die letzte Button-Platzierung und Playwright-Einrichtung; die
früheren Abschnitte v161 bis v165 darunter sind historische Zwischenstände.
Bei diesem Abschluss wurden ausschließlich diese beiden Dokumentationsdateien aktualisiert.

- Projektordner: `/Users/jk/Dropbox/9. TFB-Website`, eigentliche Anwendung und Git-Repository:
  `/Users/jk/Dropbox/9. TFB-Website/tfb-kiosk`. Die andere Padel-Kopie im Projektordner
  ist nicht diese Anwendung und darf nicht mit ihr verwechselt werden.
- Startdatei: `tfb-kiosk/index.html`, vom Nutzer in Chrome als lokale Datei geöffnet.
  Kein Entwicklungsserver erforderlich. Cache aktuell `tfb-kiosk-v165`.
- Fertig implementiert: gemeinsame Galerie/Collage für Home und Aktuell mit Datum,
  Überschrift, optionalem Text oben/unten und bestehendem Vollbild-Blättern; direkte
  Maus-/Touch-Fotosortierung mit sofortiger Entwurfsanzeige; oberer/unterer Bleistift;
  durchsuchbare Beitragsübersichten und zuletzt korrigierte Button-Platzierung.
- Home: Im Standard-Look Wechselspiel sitzt „Alle Beiträge“ in der ersten Themenkachel
  bei Breiten unter 900px rechts untenbündig mit der 01; Zahl bleibt links, Kicker darunter.
  Die Desktop-Position bleibt oben rechts. Rückfall ohne Home-Themenkachel ist vorhanden.
- Aktuell: Abstand oberhalb der Spalten von 8 über 12 auf 16px erhöht. Hauptüberschrift,
  Einleitung und Desktop-Button nicht verschoben. Ab 1024px bleibt der Button rechts
  im Seitenkopf untenbündig mit der Einleitung; News/Save the Date auf gleicher Höhe.
  Unter 1024px sitzt genau ein sichtbarer Button rechts neben der aktiven Überschrift,
  untenbündig mit deren rotem Strich und unterhalb der mobilen Tab-Auswahl. Funktioniert
  bei News und Save the Date; die Zielübersicht enthält trotzdem nur News, keine Termine.
  Ohne erste Strukturüberschrift bleibt ein mobiler Zugang oberhalb der Inhalte erhalten.
- Letzte Layoutänderungen automatisiert und anhand isolierter Screenshots geprüft,
  anschließend vom Nutzer ausdrücklich bestätigt. Keine weiteren Änderungen ohne neuen Auftrag.
- Aktuelle Prüfnachweise: alle drei vorhandenen Browser-Tests erfolgreich (Übersicht,
  Galerie/Collage, Foto-Sicherung). Positionsprüfung bei 1280/500/390/320px, beide mobilen
  Aktuell-Tabs, Home-Nummer/Button-Unterkante und kein horizontaler Überlauf; Beitragsfilter,
  Sprungziele, Zurück/Neuladen, Chat-Regression sowie Live-Maus-/Touch-Fotosortierung geprüft.
  Fotoexport/-wiederherstellung und Ablehnung ungültiger Sicherungen geprüft.
  Nach letzter rein optischer Home-Korrektur Übersichtstest erneut erfolgreich;
  `git diff --check` erfolgreich. Frühere 51 Node-Tests auf v164 und 23 gezielte Tests
  auf v165 bleiben historische Nachweise; in diesem Chat nicht erneut ausgeführt.
- Änderungen seit v160 liegen lokal und uncommittet vor. Es wurde weder neu committet,
  getaggt noch veröffentlicht. Bestehender Sicherungstag `stand-2026-10-12-v160` bleibt.
  Geändert: `assets/css/app.css`, `assets/js/app.js`, `assets/js/demo-backend.js`,
  `assets/js/site.js`, `sw.js`, `tools/test-home-features.mjs` und beide Gedächtnisdateien.
  Neue Tests: `tools/test-browser-gallery.mjs`, `tools/test-browser-overview.mjs`.
  Neu in diesem Chat: `package.json` und `package-lock.json` für Playwright und Testbefehle.
  Vorbestehendes untracked `.claude/` erhalten, nicht bereinigen oder zurücksetzen.
- Browser-Tests verwenden ausschließlich isolierte Testdaten; persönliche Chrome-Daten,
  gespeicherte Inhalte und JSON-Sicherungen des Nutzers wurden dadurch nicht verändert.
  Die Dokumentationsaktualisierung erzeugt keine neue JSON-Inhaltssicherung.
- Nächster Arbeitsauftrag noch offen: erst die neue Nutzeranfrage aufnehmen. Keine
  weiteren Funktionen oder Umgestaltungen aus älteren Gesprächsteilen eigenständig beginnen.

## Frühere Playwright-Einrichtung (v165, historischer Prüfstand)

Playwright **1.64.0** als Entwicklungsabhängigkeit im Unterordner `tfb-kiosk` installiert;
Chromium-Testbrowser lokal vorhanden. Kostenlos, kein zusätzlicher Download für Besucher.
`node_modules/` ist bereits ignoriert. Die lokale HTML-Seite bleibt ohne Build nutzbar.

Aus dem Anwendungsordner:

```sh
npm run test:browser
```

Einzeln: `npm run test:browser:overview`, `npm run test:browser:gallery`,
`npm run test:browser:backups`. Bei neuer Einrichtung zuerst `npm ci`, danach
`npx playwright install chromium`. Auf diesem Mac benötigten die Testläufe außerhalb
der Codex-Sandbox die native Freigabe, weil der Chromium-Start darin von macOS blockiert
wurde. Das war eine Umgebungsbeschränkung, kein fehlgeschlagener Anwendungstest.
Screenshots entstehen unter `/tmp/tfb-*.png` und sind temporäre Prüfergebnisse.

Cache-Bezeichnung weiterhin `tfb-kiosk-v165`; in diesem Chat nicht erhöht. Die hier
geprüfte direkte HTML-Nutzung lädt die lokalen Dateien. Für einen späteren Betrieb
mit aktivem Service Worker die Cache-Version gemäß den Arbeitsregeln aktualisieren.

## Frühere Platzierung von Alle Beiträge 13.10.2026 (historisch)

Aktueller lokaler Arbeitsstand **v165**, Cache `tfb-kiosk-v165`, nicht committet oder
veröffentlicht; Sicherungstag v160 unverändert.

- Home: Button innerhalb der ersten Themenkachel oben rechts auf der Text-/Hintergrundfläche.
  Kein zusätzlicher Buttonstreifen oberhalb der Kacheln. Ohne Themenkachel bleibt der
  bisherige separate Zugang als Rückfall erhalten. Nicht im Baustein-Bearbeitungsmodus.
- Aktuell: Button rechts im Seitenkopf, unten bündig mit dem Einleitungstext, oberhalb
  von Save the Date. Er zeigt weiterhin ausschließlich News-Inhalte, keine Termine.
  Aus News-Spalte entfernt; News/Save the Date beginnen auf Desktop auf gleicher Höhe.
  Abstand zwischen Seitenkopf und Spalten auf 8px reduziert; mobile Kopfzeile darf umbrechen.
- Isolierter Browsercheck bei 1280/390/320px: Home-Button innerhalb der Textfläche und
  ohne Überdeckung der Nummer, keine zusätzliche Home-Zeile, bündige Desktop-Überschriften
  und Einleitung/Button-Unterkante, kein horizontaler Überlauf. Screenshots kontrolliert.
  Übersichtssuche, Filter, Rückkehr/Neuladen und Chat-Regression ebenfalls erfolgreich.
  23 gezielte Home-/Aktuell-Tests bestanden. Keine Inhalts- oder Sicherungsdaten geändert.

## Alle Beiträge für Home und Aktuell 13.10.2026

Aktueller lokaler Arbeitsstand **v164**, Cache `tfb-kiosk-v164`, nicht committet oder
veröffentlicht. Sicherungstag v160 bleibt unverändert.

- Home erhält „Alle Beiträge“ oberhalb der Inhalte. Bei Aktuell sitzt der Schalter
  ausschließlich in der linken News-Spalte, nicht bei „Save the Date“.
- Eigene Übersichten `#home/alle` und `#aktuell/alle` im kompakten Chat-Look, mit
  Titeln, Datum sofern vorhanden, Foto-Vorschau und Textauszug. Suche nach Titel/Text,
  Filter nach Beitragsart sowie „Nur mit Fotos“; Anzahl und leere Trefferanzeige.
- Themen, Beiträge, Texte, Fotos, gefüllte Galerien und Collagen in Seitenreihenfolge.
  Termine, Strukturüberschriften und ungespeicherte neue Bausteine bleiben draußen.
  Ausgeblendeter Galerie-/Collagentext erscheint auch nicht in Suche oder Vorschau.
- Klick springt über `#home/beitrag/<id>` bzw. `#aktuell/beitrag/<id>` zum bestehenden
  Inhalt auf der Seite, ohne neue Daten oder Kopien. Fokus folgt dem Ziel, Aktuell
  aktiviert dabei die mobile News-Ansicht. Bestehende Home-Artikel-/Albumrouten bleiben.
- 51 Node-Tests erfolgreich. Isolierter Browsercheck mit 20 Beiträgen plus Galerie
  und Collage je Seite: Desktop/Handy, Suche/Filter, direkte Sprünge, Zurück/Neuladen,
  keine Termine in der Übersicht sowie unveränderte Chat-Filter geprüft.
- Zusätzlicher Browser-Test: `tools/test-browser-overview.mjs`; nur isolierte Testdaten,
  kein Zugriff auf persönliche Chrome-Daten und keine Änderung der gespeicherten Seite.

## Unterer Bleistift und direkte Live-Sortierung 13.10.2026

Aktueller lokaler Arbeitsstand **v163**, Cache `tfb-kiosk-v163`, nicht committet oder
veröffentlicht. Sicherungstag v160 bleibt unverändert.

- Seiten mit vorhandenem Bearbeiten-Bleistift bekommen denselben Bleistift zusätzlich
  am Seitenende. Gemeinsame Montage in `app.js`; Home, Aktuell, Club, Sport, Chat, Kiosk
  sowie entsprechende Artikel-/Album-/Porträtansichten. Nur bei sichtbaren Admin-Werkzeugen.
  Der untere Seitenschalter erhält die Scrollposition statt nach oben zu springen.
- Fotos im Baustein-Editor direkt am Bild oder optional am Griff verschieben, mit Maus
  und Touch. Kein nativer Drag-Schatten über dem unveränderten Ziel: Die Vorschaubilder
  rücken bereits während des Ziehens in die neue Reihenfolge, Pfeile/Indizes werden angepasst.
- Galerie/Collage auf der Seite zeigt denselben Entwurf sofort, ohne Speicherung beim
  Ziehen. „Speichern“ übernimmt ihn; Editor schließen stellt den gespeicherten Stand wieder her.
  Abgebrochene Touch-Gesten stellen die Reihenfolge vor dem Ziehen wieder her.
- Foto einpassen/Löschen bleiben getrennt bedienbar. Auf den Sortierbildern dient die
  Touch-Geste dem Verschieben; außerhalb der Bilder bleibt der Editor scrollbar.
- Nachweis: 49 Node-Tests erfolgreich, Syntaxcheck und isolierter Browsercheck auf
  Desktop/Handy. Untere Bleistifte auf Home/Aktuell/Club/Sport/Chat/Kiosk, Scrollposition,
  Umordnung vor Loslassen ohne Griff, passende Seitenvorschau, Speicherung/Neuladen
  und Rücksetzen einer abgebrochenen Touch-Geste geprüft.

## Galerie und Collage flexibel platzieren 13.10.2026

Aktueller lokaler Arbeitsstand **v162**, Cache `tfb-kiosk-v162`; nicht committet oder
veröffentlicht. Sicherungstag v160 bleibt unverändert.

- Collage als eigener Baustein auf Home und Aktuell, neben Galerie. Galerie mit gleichgroßen
  Bildern, Collage mit wechselnden Bildgrößen im vorhandenen Unterseiten-Stil.
- Beide mit Überschrift, optionalem Artikel-Datum und ausblendbarem Fließtext.
  Textposition wählbar: unter der Überschrift oder unter den Bildern. Bestehende Galerien
  ohne Positionsangabe behalten ihren Text unter den Bildern. Ausblenden löscht keinen Text.
- Seitenposition beider Module über die bisherigen Hoch-/Runter-Pfeile im Bearbeitungsmodus;
  Home hat separate Hinzufügen-Knöpfe, Aktuell beide Typen im Baustein-Auswahlmenü.
- Bildgriff im Fotoeditor für direktes Verschieben, auch per Touch. Ziel wird hervorgehoben;
  Scrollen am Rand der Seitenleiste beim Ziehen. Zusätzlich Bildpfeile und Pfeiltasten am Griff.
- Beide öffnen das angeklickte Foto im selben vorhandenen Collagen-Betrachter.
  Je Modul höchstens 100 Fotos, Upload- und Speicherprüfung auf beiden Typen.
- 49 Node-Tests erfolgreich. Erweiterter Browsercheck unter `tools/test-browser-gallery.mjs`
  erfolgreich: Home/Aktuell auf Desktop/Handy, Bildbetrachter, Modul-Pfeile, Textposition,
  gespeicherte Reihenfolge nach Maus- und echtem Touch-Ziehen sowie Neuladen.
  Griff oben mittig, Kamera links und Löschen rechts; drei Vorschaubilder pro Zeile,
  damit die Bedienelemente auch auf dem Handy nicht überlappen.

## Galerie für Home und Aktuell 13.10.2026

Aktueller Arbeitsstand **v161**, Cache `tfb-kiosk-v161`; noch nicht eingefroren,
committet oder veröffentlicht. Der Sicherungstag v160 unten bleibt unverändert erhalten.

- Gemeinsamer Galeriebaustein auf Home und Aktuell, auf Home über „Galerie hinzufügen“
  neben dem bisherigen Themen-Hinzufügen verfügbar. Keine neuen Beispielgalerien in den Nutzerdaten.
- Klick auf beliebiges Foto öffnet direkt dieses Foto im bestehenden Collagen-Betrachter,
  identisch zur Home-Unterseite: Klick aufs Bild, Pfeile, Pfeiltasten, Wischen,
  umlaufendes Blättern und „Alle Fotos“. Kein separater neuer Viewer.
- Optionales Datum mit bestehender Artikel-Datumsplakette und ausgeschriebenem Datum;
  optionaler formatierter Fließtext unter den Fotos. „Text unter der Galerie anzeigen“
  blendet nur die Darstellung aus, gespeicherter Text bleibt erhalten. Datum kann leer bleiben.
- Fotos sortieren, entfernen und einpassen wie bisher. Höchstens 100 Fotos;
  Uploadprüfung und `saveSite` sichern die Grenze auch für Galeriebausteine ab.
  Bestehende Galerieinhalte bleiben erhalten, keine Datenmigration erforderlich.
- 48 Node-Tests erfolgreich. Isolierter Chrome-Test auf Desktop/Handy prüft Home/Aktuell,
  Klick/Pfeile/Tastatur, Rückkehr zur Übersicht, Neuladen, Editor-Datum, Textausblendung
  ohne Datenverlust und Anlegen einer neuen Home-Galerie. Private Browserdaten unverändert.
  Werkzeug: `tools/test-browser-gallery.mjs` (Laufzeitvariablen wie andere Browsertests).
- Praktisch: Seite neu laden, Admin-Werkzeuge bei Bedarf über roten Ball einblenden;
  Home bearbeiten → Galerie hinzufügen. Auf Aktuell: Baustein hinzufügen → Galerie.

## Tagesabschluss 12.10.2026

**EINGEFROREN: v160**, Cache `tfb-kiosk-v160`, Katalogversion 13.
Lokaler Sicherungstag: **`stand-2026-10-12-v160`**. Nicht veröffentlicht und nicht gepusht.
Nutzer hat den fertigen Kiosk bestätigt: „Das sieht alles top aus.“ Heute keine weiteren
Änderungen; Weiterarbeit erst auf ausdrücklichen Auftrag. Ältere Abschnitte unten sind Verlauf.

- Home: Standard `#F5F0E6`, genau eine individuelle bunte Fassung; Umschalten per
  Themennummer funktioniert auch mit ausgeblendeten Stiften und wurde vom Nutzer bestätigt.
  Keine erfundenen Ersatzfarben. Roter TFB-Ball bleibt der Vorführschalter für Admin-Werkzeuge.
- Foto-Sicherung und Wiederherstellung abgesichert; Nutzer bestätigt die praktische Funktion.
- Kiosk: echtes Vereinsangebot und Listenpreise übernommen, Produktzeichnungen vom Nutzer
  abgenommen. Endgültige Reihenfolge: Alkoholfreie Getränke, Bier, Aperol & Wein,
  Spezialitäten, Spielbetrieb, Snacks, Vereinsshop (weiterhin zukünftig).
- Spezialitäten: nur die drei Speisen. Spielbetrieb: Flutlicht (1 h) 5,00 € und Gastspieler
  für eine Stunde 8,00 €. Snacks einschließlich Eis unverändert erhalten.
- Letzter Prüflauf: 46 Node-Tests erfolgreich; Kiosk und erweiterte Strichliste auf
  1280×900 und 390×844 mit synthetischen Daten geprüft, ohne horizontale Überbreite.
- Der Git-Sicherungspunkt enthält Software, Dokumentation und Tests, nicht den privaten
  Browserinhalt. Eigene Fotos, Farben, Mitglieder und Buchungen benötigen weiterhin eine
  vollständige JSON-Sicherung über die vorhandene Sicherungsfunktion.
- Bekannte Folgeaufgaben bleiben unten vorgemerkt: Jugendschutz beim Import, bestätigte
  Buchungsspeicherung, Bereinigung alter Bildbestände, echter Mehrbenutzerbetrieb,
  Lastschriftabschluss und Wartbarkeit. Keine davon ist durch diesen Tagesabschluss erledigt.

## Spielbetrieb und getrennte Snacks (12.10.2026, Cache v160)

- Reihenfolge jetzt Getränke → Bier → Aperol & Wein → Spezialitäten → Spielbetrieb
  → Snacks → zukünftiger Vereinsshop. Spezialitäten nur Bockwurst, Grillwurst, Grillfleisch;
  bestehende Süßigkeiten, Chips und Eis unter Snacks, unveränderte Preise und Symbole.
- Spielbetrieb: Flutlicht (1 h), Eine Stunde, 5,00 €; Gastspieler, Eine Stunde, 8,00 €.
  Preise vom Listenfoto, Stundenbezeichnung für Gastspieler ausdrücklich vom Nutzer.
  Neue Symbole: Flutlichtmast und Tennisspieler mit Schläger.
- Einmalige Migration 12 → 13: Bereichstrennung und neue Gebühren, bestehende Preise,
  Produktkennungen, individuelle Artikel und Buchungshistorie bleiben erhalten.
- Strichliste mit eigener Spielbetrieb-Spalte; Speisen zählen weiterhin unter Snacks.
- Dies sind buchbare Gebühren im bisherigen Kiosk, keine Platz-/Zeitreservierung.
  Frühere offene Einordnungsfrage zu Flutlicht/Gastspieler damit vom Nutzer entschieden.
- Nachweis: 46 Tests erfolgreich; neue Bereiche und Strichliste auf Desktop und Handy
  im getrennten Testbrowser mit synthetischen Buchungen geprüft.

## Apfel und Cornetto verfeinert (12.10.2026, Cache v159)

Apfelsymbol samt Blatt/Stiel um 25 % verkleinert, um dieselbe Etikettmitte skaliert;
Flasche und Etikett unverändert. Cornetto ohne breite Welle, mit feinem gleichmäßigem
Waffelmuster und schlichter Eiskugel. Alle übrigen Produkte, Preise und Daten unverändert.

## Produktname Wein ergänzt (12.10.2026, Cache v158)

„Grauburgunder Wein“ statt „Grauburgunder“. Gezielte Migration 11 → 12 ersetzt nur
den bisherigen Standardnamen, erhält individuelle Namen und alle übrigen Produktdaten.

## Aperol und Apfelschorle nach Nutzerreferenz (12.10.2026, Cache v157)

- Aperol-Dose bei gleicher Breite höher, ohne TO GO. Orange mit blauem Band,
  gelbem APEROL und weißem SPRITZ nach dem gelieferten Screenshot; weiterhin stilisiert.
- Apfelschorle jetzt mit unveränderter eigener Produktfarbe in der Wasserflaschenform;
  quadratisches weißes Etikett mit mittigem Apfel statt senkrechtem APFEL, Stern oder Welle.
  Wasser selbst und alle übrigen Produkte unverändert.
- FASS-Buchstaben senkrecht um die Etikettmitte zentriert, gleicher Abstand oben/unten.
- Nur Zeichnungen geändert, keine neue Katalogmigration und keine Änderungen an Preisen
  oder gespeicherten Buchungen. 44 Node-Tests und Desktop-/Handyprüfung erfolgreich.

## Kiosk-Symbole verfeinert (12.10.2026, Cache v156)

- Zunft-Flasche und Fassbrause verwenden jetzt die Sportsfreund-/Malzbier-Flaschenform.
  Zunft-Flasche goldfarben wie das Glas (`#E9B949`), Fassbrause mit bisherigem hellem
  Akzent (`#B6C85D`). Fassbrause und Apfelschorle mit senkrechten FASS-/APFEL-Etiketten.
- Weizen dunkler orange (`#D88A2E`), Radler heller goldfarben (`#E9CD70`), Form unverändert.
  Aperol-Dose mit größerer APEROL-/SPRITZ-/TO-GO-Beschriftung, weiterhin stilisiert:
  keine bestätigte Nachbildung der im Verein angebotenen Verpackung.
- Bockwurst ohne Streifen, Grillwurst mit vier Grillstreifen und eigenem Symbol;
  Grillfleisch mit unregelmäßiger Kontur. Grauburgunder unverändert.
- Strichliste: „Kränze“ statt „Kranz“, ausdrücklich vom Nutzer bestätigt.
- Einmalige Katalogmigration 10 → 11 betrifft nur diese Produktfarben/-symbole;
  Preise, Buchungshistorie und nachfolgende individuelle Änderungen bleiben erhalten.
- Herstellerprüfung: Zunft Fassbrause gilt als alkoholfrei, enthält aber <0,5 % vol;
  normales Zunft Radler enthält 2,4 % vol. Tatsächliche Radler-Variante im Verein noch
  nicht anhand einer Verpackung bestätigt. Quellen: Erzquell-Sortimentsseiten
  [Fassbrause](https://www.erzquell.de/zunft-koelsch/zunft-koelsch-sortiment/zunft-fassbrause/),
  [Radler](https://www.erzquell.de/zunft-koelsch/zunft-koelsch-sortiment/zunft-radler/).
- Nachweis: 43 Node-Tests erfolgreich; isolierte Browserprüfung auf Desktop und Handy
  mit synthetischen Daten. Keine Original-Browserdaten verändert, nicht veröffentlicht.

## Erster Kiosk-Vorschlag nach echter Liste (12.10.2026, Cache v155)

Nutzer bestätigt Foto-Sicherung als funktionierend. Anschließend echte Getränkeliste als Foto
geliefert und erste Anpassung beauftragt. Lokal vorbereitet, nicht veröffentlicht:

- Reihenfolge: Alkoholfreie Getränke → Bier → Aperol & Wein → Spezialitäten → Vereinsshop.
  Spezialitäten enthält Essen, bestehende Snacks und Eis, ist offen und vorletzter Bereich.
  Vereinsshop samt bisherigen Artikeln bleibt als zukünftiges Angebot erhalten.
- Wasser/Apfelschorle/Cola/Fanta jeweils Flasche 0,25 l, 1,50 €;
  Fassbrause/Sportsfreund/Malzbier/Radler jeweils Flasche 0,33 l, 2,10 €.
- Zunftkölsch: Flasche 0,33 l 2,20 €, Glas 0,2 l 1,80 €, Kranz mit neun Kölsch 14,50 €.
  Weizen Flasche 0,5 l 3,50 €; keine unbelegte Kennzeichnung als alkoholfrei.
- Aperol Büchse 0,25 l 3,50 €; Grauburgunder Flasche 0,75 l 10,00 €.
- Bockwurst mit Brot 2,50 €, Grillwurst mit Brot 3,00 €, Grillfleisch mit Brot 4,00 €.
  Bestehende Snacks-/Eispreise bleiben erhalten. Red Bull nicht auf der Liste: im bestehenden
  Katalog deaktiviert statt gelöscht, bei Neustart nicht mehr als neues Angebot vorbelegt.
- Neue Illustrationen im vorhandenen SVG-Stil: Kölsch-/Weizenflasche, Apfelschorle,
  Fassbrause, Aperol-Dose, Weinflasche, Wurst/Brot und Grillfleisch/Brot. Illustrationen sind
  ein erster Vorschlag, keine fotografisch oder markengetreu bestätigten Verpackungen.
  Wasser heißt neutral „Wasser“; bisherige Gerolsteiner-Zeichnung vorläufig beibehalten.
- Einmalige Katalogmigration 9 → 10, bestehende Produktkennungen bleiben erhalten.
  Alte Striche/Buchungen und ihre Preise werden nicht geändert; individuelle Snacks-/Shopdaten
  und spätere Admin-Preisänderungen bleiben erhalten. v8 → v9 bleibt ein eigener Zwischenschritt.
- Flutlicht 5,00 €/Stunde und Gastspieler 8,00 € sind auf dem Foto, aber noch nicht als
  Kioskartikel übernommen: Entscheidung zur Einordnung/Abwicklung weiterhin offen.
- Nachweis: zwei Katalogtests zu Liste, Symbolen, Reihenfolge, Migration und Historie;
  Browserprüfung mit synthetischen Daten auf 1280×900 und 390×844, keine horizontale
  Überbreite oder leeren Symbole; Screenshots visuell geprüft. Werkzeug: `tools/preview-catalog.mjs`.
- Nutzer soll neu laden und den Vorschlag im Kiosk prüfen. Kein Reset und keine manuelle
  Übertragung privater Browserdaten erforderlich. Listenänderung wird beim Laden gespeichert.

## Foto-Sicherung lokal abgesichert (12.10.2026, Cache v154)

Auf ausdrücklichen Auftrag vor den Kiosk-Inhalten bearbeitet. Beim Tagesabschluss in den
lokalen Sicherungspunkt v160 aufgenommen; nicht gepusht oder veröffentlicht.

- Export wartet auf den vollständigen Bildspeicher-Leseabschluss. Fehler, blockierter Speicher
  und Zeitüberschreitung brechen die Sicherung ab; keine leere Ersatz-Fotosammlung.
  Für die reine Seitenanzeige bleibt der bisherige kurze Fallback erhalten.
- Foto-/PDF-Einträge und verknüpfte Kennungen werden vor Export/Import geprüft. Fehlende oder
  ungültige Einträge werden nicht stillschweigend übersprungen.
- Import schreibt sämtliche Fotos in eine neue, getrennte Bilddatenbank. Erst nach erfolgreichem
  Transaktionsabschluss wird der vollständige Inhaltsstand samt Bilddatenbank-Kennung aktiviert.
  Bei Abbruch, Timeout oder vollem Gerätespeicher bleibt der bisherige aktive Stand erhalten.
- Die bisherige Bilddatenbank wird bei erfolgreichem Import bewusst nicht gelöscht. Das erlaubt
  sichere Aktivierung auch bei Unterbrechung, benötigt aber zusätzlichen Browserspeicher.
  Bereinigung alter Bilddatenbanken ist ein separater zukünftiger Job; nicht unbesehen löschen,
  insbesondere wenn andere TFB-Tabs noch geöffnet sind.
- Automatische Sicherung erstellt zuerst den vollständigen Export und öffnet erst danach die
  Zieldatei. Schreibfehler führen zum Abbruch der temporären Schreibfassung. Läufe sind serialisiert;
  Fehlerstatus und Wiederholungsoption sichtbar, Erfolg nur nach abgeschlossenem Schreiben.
- Automatische Sicherung funktioniert auch mit per Logo ausgeblendeten Admin-Stiften.
  Fotoänderungen werden zusätzlich über eine Laufzeit-Revisionskennung erkannt.
- Nachweis: 40 Node-Tests erfolgreich; separater Chrome-Test mit echtem IndexedDB und rein
  synthetischen Daten erfolgreich. Bestehende JSON-Sicherungen nur lesend geprüft:
  automatisch 117 Foto-/PDF-Einträge, manuell 51; keine ungültigen Einträge oder fehlenden
  referenzierten Kennungen. Nutzerbrowser und Originaldateien nicht verändert.
- Nächster praktischer Schritt: Seite neu laden, automatische Sicherung im Konto auf Status/Erlaubnis
  prüfen, zusätzlich eine datierte manuelle Sicherung erstellen. Keine alte Datei testweise in den
  echten aktuellen Browserstand laden. Zusätzliche Browserstände `extra` werden weiterhin vom
  bisherigen App-Import verarbeitet; keine geräteübergreifende oder tabübergreifende Transaktion.

Testaufrufe: `node --test tools/test-backups.mjs tools/test-board-photos.mjs tools/test-home-features.mjs tools/test-photo-drop.mjs tools/test-photo-viewer.mjs`.
Optionaler echter Browsercheck: `tools/test-browser-backups.mjs` mit Playwright;
`TFB_PLAYWRIGHT_MODULE` und `TFB_CHROME_PATH` können lokale Laufzeitpfade vorgeben.

Historischer Stand: **12.10.2026 – EINGEFROREN** als Git-Tag **`stand-2026-10-12-v152`** (v152, Cache `tfb-kiosk-v152`;
frühere Tags heute: `stand-2026-10-12-v151`, `stand-2026-10-12-v150`, `stand-2026-10-12-v149`, `stand-2026-10-12` = v138, `stand-2026-10-12-abend` = v141). Alles lokal committet,
4 Node-Tests grün. Nicht veröffentlicht, nicht zu GitHub gepusht – nur auf Wunsch des Nutzers pushen.
Nutzer: „Ansonsten alles jetzt eins A. Und so einfrieren bitte.“

## Offene Aufgaben aus der Prüfung vom 12.10.2026

Auf Wunsch des Nutzers für spätere Arbeiten vorgemerkt; hier noch nicht umgesetzt:

- **Jugendschutz beim Mitgliederimport:** Geburtsdatum/Altersstatus gehen beim bisherigen Import
  verloren. Unbekanntes Alter darf keine Erwachsenenfreigabe für Beiträge und öffentliche Fotos bedeuten.
  Import, bestehende Mitglieder und elterliche Freigaben gemeinsam prüfen.
- **Kiosk-Buchungen bei Speicherfehlern:** `addToTab` meldet bislang Erfolg, auch wenn `save(db)`
  scheitert. Erfolg erst nach bestätigter Speicherung; Fehler und Wiederholungen gezielt testen.
- **Vollständige Sicherung und sichere Wiederherstellung:** Kernkorrektur lokal erledigt (siehe oben).
  Später: sichere Bereinigung alter Bilddatenbanken und übergreifende Behandlung zusätzlicher
  Browserstände (`extra`), insbesondere bei mehreren geöffneten Tabs.
- **Echter Mehrbenutzerbetrieb/Supabase:** Direkte Browser-Speicherung und simulierte Antworten
  (insbesondere Verabreden) ersetzen; Identitäten, Rollen, Mannschaftszuordnung und Zugriffsrechte
  serverseitig absichern. Ein bloßer Austausch von `TFB.api` reicht nicht.
- **Monatliche Lastschriftabrechnung:** Den vollständigen Ablauf samt Mandaten, Abschluss,
  Fehlerfällen und Verantwortlichkeiten vor echtem Kioskbetrieb fertigstellen und abnehmen.
- **Wartbarkeit und Dokumentation:** Große Dateien `site.js`/`app.js` schrittweise mit Tests
  strukturieren; veraltete README-Texte und verbliebene Padel-Dokumentation klar abgrenzen.

**Aktueller Auftrag Home-Farben:** Keine neuen Farben erfinden. Standard bleibt `#F5F0E6`;
die bunte Fassung verwendet ausschließlich die vom Nutzer per Pipette festgelegten Werte.
In den beiden gelesenen Sicherungen im Projektwurzelordner
(`TFB-Sicherung_2026-10-11_15-23.json`, `TFB-Sicherung-automatisch.json`) enthalten die drei
Home-Themen keine `bg`-/`linkBg`-Werte. Neuere Sicherung bzw. aktueller Browserstand noch
zu prüfen; daraus folgt ausdrücklich nicht, dass die Farben überall verloren sind.
Die anschließend gelieferten Screenshots belegen vorhandene Farben im laufenden Editor
(unter anderem Hintergrund `#99C6FD`, Link-Knöpfe `#C4E3FF`). Keine Neuanlage erforderlich.

**Lokale Korrektur nach v152 (Cache v153, noch nicht committet/veröffentlicht):**
Die Home-Nummern sind echte Schaltflächen über die gemeinsame Aktionssteuerung,
mit Handzeiger und Tastaturbedienung, bei unveränderter Zahlengestaltung.
Ein nachgewiesener Konflikt wurde behoben: Die offene Themenvorschau erzwingt nicht mehr
bunte Farben gegen einen ausdrücklichen Nummernklick; bereits der erste Klick zeigt Standard.
34 Node-Tests bestehen, einschließlich beider Admin-Ansichten, aller drei Nummern,
Neuladen und unveränderter Speicherung beim Vorführen.
Der Klick in der bereits geöffneten lokalen Chrome-Seite konnte wegen der Browser-Zugriffsgrenze
nicht direkt geprüft werden. Nutzer soll nach Neuladen prüfen; Ursache des zuvor gemeldeten
Verhaltens bei geschlossenem Editor ist damit nicht abschließend nachgewiesen.

## Wie es weitergeht

- **Nächster Job (Nutzer):** Der Nutzer hat die echte **Getränkeliste der Tennisfreunde** fotografiert und
  reicht das Foto als nächsten Schritt ein (heutiges Kiosk-Angebot
  mit Preisen). Damit den Kiosk rund machen: exakt die heutigen Artikel, Bereiche, Preise und Symbole
  übernehmen (Sortiment liegt in `demo-backend.js` → `DEFAULT_CATALOG`, Änderungen bestehender Daten über
  `catalogVersion`-Migration wie bisher; Admin kann auch direkt am Kiosk über den Stift pflegen).

- **Pause für Änderungen.** Der Nutzer spricht zuerst mit dem Vorstand, ob und wie es mit der
  neuen Website weitergeht. Bis dahin **nichts an der App ändern**, außer der Nutzer bittet ausdrücklich.
- Nutzer findet den Stand präsentationsreif („Das gefällt mir alles. Sehr gut.“).
- iPhone/iPad-Test vorerst verworfen: Nutzer präsentiert am Mac (Chrome, Hochformat per Fensterbreite
  bzw. Geräte-Ansicht der Entwicklertools); echte Geräte erst mit der späteren echten App.

## Was am 12.10.2026 dazukam (Details im Projektgedächtnis)

- **nuLiga-Abgleich wöchentlich automatisch:** GitHub Actions `.github/workflows/update-teams.yml`,
  montags 04:00 UTC, schreibt `assets/data/teams.js` und committet („Stand“-Datum). Kosten: im
  Freikontingent (Billed 0 $). Spielerlisten (`rosters.js`, Namen) bleiben bewusst lokal.
- **Sport:** „Mannschaftsporträt“ bzw. „News“ einzeln rot, sobald Porträt gespeichert / News da (v121).
- **Insider News:** Clubgeflüster-Beitrag nur aus einer Mannschaft entfernen, ohne ihn im Chat zu
  löschen („Aus dieser Mannschaft entfernen“, v122).
- **Verabreden rund (v123–v135):** Kacheln Einzel · Doppel · Training · Mannschafts-Spiel;
  „Einmalig“ oder „Jede Woche“ (bis-Datum, Einladung 1–7 Tage vorher); Treffen-/Abfahrtszeit;
  „Wartet auf deine Antwort“; Gruppen mit Bestätigung im Postfach (Gruppe = alle Hinzugefügten,
  unbestätigt heißt nur „noch nicht in deren Meine Gruppen“); Gruppen als Pillen beim Einladen
  (Häkchen); Namen alphabetisch nach Nachname; „Wo“ = Tennisanlage Bielstein vorbelegt.
  **Keine Historie** – Vergangenes verschwindet spurlos. Beispielgruppen entfernt.
- **Postfach (Glocke neben dem Profilbild):** nur Einladungen und Gruppen, keine E-Mails, kein
  Aufploppen; Hinweise mit × oder „Alle Hinweise entfernen“, sonst nach 7 Tagen weg; offene
  Einladungen bleiben bis zur Antwort. Chat/Insider News bewusst ohne Postfach.
- **Kopf:** Glocke 27 px, 31 px Abstand zum Profilbild, unten bündig; Desktop-Menü 15 % enger, mittig.
- **Fenster ruhiger:** `openSheet` tauscht bei offenem Fenster nur den Inhalt (kein Neu-Einblenden).
- **Mitgliederliste aus Excel/CSV** (Konto → Admin): nur Nr., Vorname, Name, E-Mail(s); Vorschau
  neu/geändert/weg; Beispielmitglieder werden beim ersten Import ausgeblendet. Echte Liste liegt
  unter `90 Archiv/Altbestand/Mitgliederliste TFB_2026.xlsx` (307 Personen) – nie ins Repo.
- **Automatisch sichern** (Konto → Admin): Ordner wählen → `TFB-Sicherung-automatisch.json`
  (max. 1×/Min. bei Änderung). Empfehlung: Ordner außerhalb von Git-Repos, z. B. `Dropbox/TFB-Sicherungen`.
- **Admin aufgeräumt (v137):** Seite „Verwaltung“ entfällt; Stift auf allen Seiten (neu auch Kiosk);
  Admin-Teil im Konto-Fenster (Mitgliederliste, Sichern & Laden, Foto-Freigaben). Schrift fest
  **Avenir Next**, Farbe fest **Anthrazit #2A2D2E**. „E-Mail-Benachrichtigungen vom Club“ (an);
  „Einladungen von allen“ (an) ist mit der Namenssuche beim Verabreden verknüpft.
- **Foto-Freigaben (Admin)** als Karten mit Status und Pillen (v138).
- **Vorführ-Schalter (v148, nur Demo):** Klick auf den roten Ball im Logo blendet Admin-Stifte aus/ein.
- Menü: Padel (externer Link) reagiert beim Überfahren wie die anderen Punkte (v149).
- **Farben Home: Standard | Bunt (v150):** genau eine bunte Fassung (Farben je Thema), Umschalter im
  Home-Bearbeiten-Modus; versteckter Vorführ-Schalter: Klick auf die große „01“ (nur Demo/Admin, nicht gespeichert).
- **Beim Laden (Demo):** Admin-Werkzeuge ausgeblendet und Home-Farben „Standard“ (beige) – für die Präsentation.
  Einblenden per rotem Ball im Logo, bunte Fassung per Klick auf eine Themennummer 01/02/03 … (v152, in jeder Ansicht).
- Kopf: Profilbild/Glocke per Messung 4 px unter der Menü-Grundlinie (optischer Ausgleich, v147 – abgenommen).
- Anmeldung: Auge im Passwortfeld (v143), Demo-Kasten entfernt (v144).
- **v139–v141 (nachmittags ergänzt):** Farben je Home-Thema (Textseite + Link-Knöpfe), Link-Abstände (Standard 26/14 px, je Thema ▲/▼) –
  Farbfeld, Pipette, Farbcode, „Standard“ (#F5F0E6); dunkler Grund → helle Schrift. Rückfallpunkt: Tag `stand-2026-10-12`.
- **Entscheidung:** Kiosk-Freigabe wird **nicht** in der App zurückgenommen; Ausstieg per E-Mail an den Vorstand.
- **Supabase-Plan:** Verein bekommt einen bezahlten Supabase-Account; darin zwei Projekte `padel`
  und `tfb` (strikt getrennt). Nutzer plädiert für **einen** gemeinsamen Lastschrift-Kiosk für
  Tennis und Padel (dann im TFB-Projekt, Padel verlinkt) – Vorstand entscheidet. Mitgliederliste
  wird außerhalb als Excel gepflegt und in beide Apps hochgeladen.

## Auf iPhone/iPad testen (Stand 12.10.)

- Doppelklick-Datei aus der Dropbox läuft auf iOS nicht (Dropbox zeigt nur eine Vorschau ohne JavaScript).
- Möglich: Mac als kleiner Webserver im WLAN (`python3 -m http.server 5180` im Ordner `tfb-kiosk`),
  auf iPhone/iPad `http://<IP des Macs>:5180` öffnen. Jedes Gerät hat **eigene** Demo-Daten.
- Haken: Über `http://` im WLAN fehlt `crypto.subtle`; das Demo-Passwort wird dann anders
  verschlüsselt als auf dem Mac (`file://`). Eine Sicherung vom Mac lässt sich laden, die Anmeldung
  mit dem Mac-Passwort klappt dann aber nicht. Lösung bräuchte eine kleine Änderung (einheitliche
  Prüfsumme) oder eine Veröffentlichung unter HTTPS – erst nach Freigabe durch den Nutzer.

---

## Ältere Stände (11.10.2026 und früher)

## Eingefrorener Stand (vom Nutzer abgenommen: „das gefällt mir sehr gut alles jetzt“)

- **Home:** Look „Wechselspiel“ (Standard; Klassisch/Magazin im Admin), bis 10 Themen,
  Themen-Leiste im Editor, feste Typografie, Fließtext Fett/Kursiv/Rot/Link, zwei Links.
- **Unterseiten und Mannschaftsporträts:** gleiche Bedienung – 1 Fotos oben (1 breit,
  2–4 Quadrate, im Seitenformat einpassbar), 2 Überschrift (3 Zeilen), 3 Inhalt aus
  Abschnitten (Text · Überschrift · Zitat, rotes ⊕, Pfeile), 4 Fotos unten (Kollage).
- **Aktuell:** Beiträge kurz und knackig ohne Unterseiten, 1–4 Fotos (breit/Quadrate),
  schlanke Werkzeugleiste.
- **Chat:** Seite „Clubgeflüster“, Beiträge mit freiwilliger roter Überschrift.
- **Menü oben** im Admin pflegbar (Namen, Ziel App-Seite/Website, Reihenfolge, sichtbar).
- **Leitziel:** Mitglieder und Jugendliche ohne EDV-Erfahrung pflegen alles selbst –
  einfach, WYSIWYG, nichts verstecken, was auf der Seite sichtbar ist.

## Nachtrag nach dem Einfrieren (v117)

- Kollagen unten (Unterseiten, Mannschaftsporträts, Fotoseiten) und Titelfotos oben
  öffnen beim Antippen die blätterbare Galerie direkt beim angeklickten Foto: weiter per
  Klick aufs Foto, Pfeilknöpfe, Pfeiltasten, Wischen; „Alle Fotos“ zur Übersicht.
  Bis zu 100 Fotos (`openGallery(..., start)`; vorher nur Einzelbild).

- v118: **Club → History**: neuer Abschnitt neben Kooperationen/unter Anfahrt
  (Block `v-history`, per Seed-Update `club-history-2026-10-11` mit `insertAfter: 'v-koop'`
  in bestehende Daten eingefügt). Überschrift (rot beim Überfahren) und „Mehr erfahren“
  führen zu `#club/history` – Magazin-Seite mit demselben Editor wie das
  Mannschaftsporträt (Fotos oben, 3 Überschriftszeilen, Abschnitte, Galerie bis 100 Fotos,
  blätterbar). Ablage `site.stories.history`; Konfiguration `STORY_PAGES` in site.js –
  weitere solche Seiten lassen sich dort ergänzen. Kurztext im Club-Admin, Unterseite über
  „+ History anlegen“ bzw. Stift (nur Admins).

- v119: History **ohne Fotos oben** (`STORY_PAGES.history.noHero`): Editor 1 Überschrift ·
  2 Inhalt · 3 Fotos – Galerie unter dem Text (bis 100). Früher oben abgelegte Fotos
  wandern automatisch an den Anfang der Galerie (`mergeHeroIntoGallery`).

- v120: Speichern der History-Seite geprüft (Texte + Fotos, Neuladen, zweites Speichern) –
  funktioniert; Meldung heißt jetzt „History gespeichert“. Nutzer: „Sehr schön. Bitte so einfrieren.“

## Nächster großer Job: Verabreden

- Nutzer: „Verabredungen aufdröseln und rund machen – im Moment noch nicht optimal.“
- Vorgehen wie bisher: erst gemeinsam mit echten Daten ansehen und bewerten, dann
  Plan, dann umsetzen. Code: `assets/js/meet.js` (Route `#treffen`, Menüname „Verabreden“).


## Neu: Ordner heißt jetzt „9. TFB-Website“

- Projektordner umbenannt: `Dropbox/9. TFB-Kiosk` → **`Dropbox/9. TFB-Website`**.
  Der App-Unterordner heißt weiterhin `tfb-kiosk/` (Repository-Name).
- Start nur noch per Doppelklick auf **`TFB-Website öffnen.html`**;
  `TFB-Kiosk öffnen.html` wurde auf Wunsch gelöscht.
- Inhalte liegen im Browser (Chrome, Ursprung `file://`), nicht im Ordner. Falls nach
  der Umbenennung etwas fehlt: Verwaltung → Inhalte laden mit der letzten Sicherung.

## Neu in v100 (Aufräumen Stufe 1)

- Alte „vier Info-Knöpfe“ (Club) samt Editor und CSS entfernt – waren ein
  Missverständnis; gewünscht waren fünf Kennzahlen (vorhanden).
- Aktuell: Hinweis „Vorführversion: Termine und Beiträge sind Beispiele.“ entfernt.
- Chat: nur noch ein Titel; „Clubgeflüster“ (editierbar) steht als rote Zeile über
  „Chat“. Partnerzeile heißt „Der Chat wird dir präsentiert von“.
- Handy-Menü: sieben Punkte passen bis 320 px in eine Zeile (Schrift wächst mit Breite).
- **Vorstand wird NICHT automatisch sortiert** – Reihenfolge wie auf der heutigen
  TFB-Website, pflegt der Nutzer selbst im Admin.
- Vorstandsfotos und -kontakte sind bewusst im Repository (wie auf der heutigen
  Vereinswebsite veröffentlicht; Entscheidung des Nutzers).
- Tippfehler „TFB GOES DIGTAL“ ist Nutzerinhalt → im Home-Editor selbst korrigieren.

## Neu in v101 (Aufräumen Stufe 2)

- Mannschaftsporträt-Editor in nummerierten Schritten: 1 Fotos oben, 2 Überschrift,
  3 Text, 4 weitere Fotos (Kollage). Alles andere (Darstellung, kleine Zeile,
  Unterzeile, Großer Textanfang, Textgröße, Zitat, Kollage im Originalformat) liegt
  eingeklappt unter **„Mehr Gestaltung“**; bleibt beim Bearbeiten offen/zu.
- Handy/iPad: Knopf „Vorschau ansehen“ / „Weiter bearbeiten“; Hinweistext passt
  sich an (Desktop: „Links siehst du jede Änderung sofort“).
- Beim Wegschieben bleibt die Kopfzeile sichtbar („antippen zum Weiterbearbeiten“),
  Rückkehr an dieselbe Stelle – gilt auch für den Home-Themen-Editor (`togglePeek`).

## Neu in v116: Menü oben im Admin pflegbar

- Ziel des Nutzers: Seite so vorbereiten, dass Mitglieder/Jugendliche ohne EDV-Erfahrung
  sie selbst pflegen können.
- Home → Stift → Karte „Menü oben“ → „Menü bearbeiten“: je Punkt Name, Ziel (Seite der
  App aus Liste oder Website in neuem Fenster), Pfeile zum Sortieren, „zeigen“;
  „+ Menüpunkt“, eigene Punkte löschbar, „Auf Standard zurücksetzen“. Höchstens
  8 sichtbare Punkte. Umschalten App ↔ Website merkt sich das vorige Ziel.
- Ablage `site.nav` = [{id, label, target, hidden?, custom?}]; ohne Eintrag Standard
  (`TFB.defaultNav` in app.js: Kiosk, Chat, Aktuell, Sport, Club, Verabreden, Padel →
  padel-bielstein.de). Menü wird in app.js aus `TFB.navItems()` gebaut,
  `TFB.refreshNav()` nach Laden/Speichern. Aktiv-Markierung nach Zielseite.
- Seitenliste (`appTargets`) ergänzt um Sport · Training, Impressum, Satzung.

## Neu in v115: Aktuell bleibt ohne Unterseiten

- Entscheidung des Nutzers: Aktuell-Beiträge werden komplett auf der Seite gezeigt,
  kurz und knackig – **keine** Unterseiten, kein „Mehr erfahren“ (v114 zurückgenommen).
- Beitragstext mit schlanker Werkzeugleiste (Fett · Kursiv · Rot · Link · Schlicht).

## Neu in v113: Aktuell-Beiträge mit 1–4 Fotos

- Beiträge (`post`) zeigen 1 Foto breit (16:9) oder 2–4 als gleich große Quadrate
  nebeneinander (`postPhotos`), Datum-Plakette unten links; mehr als 4 alte Fotos →
  „+N“ auf dem vierten, Klick öffnet alle. Unregelmäßige Kollage bei Beiträgen entfällt.
- Editor: Feld „Fotos (1 bis 4)“ (`postPhotosField`, Upload max. 4); Kamera-Symbol
  passt im Seitenformat ein (`news` 16:9 bzw. `square`). Einzelfoto (`image`) wird beim
  Öffnen in die Fotoliste übernommen.

## Neu in v112: Titelfotos im Seitenformat einpassen

- „Foto einpassen“ (Kamera-Symbol) an den Titelfotos von Unterseite und Porträt
  öffnet im Format der Seite: 1 Foto = breit (21:9, `wide`), 2–4 = quadratisch.
  Keine Formatwahl, Hinweis „Ausschnitt genau wie auf der Seite“; breiter Dialog.
- Ohne eigene Titelfotos zeigt Schritt 1 das Ersatzfoto (Teamfoto bzw. Startseitenfoto)
  mit „Foto einpassen“ (vorher nicht erreichbar → abgeschnittene Köpfe).
- Gespeichert werden nur Mittelpunkt/Zoom; das bisherige Format des Fotos bleibt
  (`photo-frame.js`, Option `format`), damit Teamfoto/Home-Foto an anderen Stellen ihr
  Format behalten. Hinweis: Mittelpunkt/Zoom gelten pro Foto überall.
- Anzeige: `.story-photo` behält 16:10 / 2:1 / 21:9, `.story-square` 1:1; das
  eingepasste Foto füllt den Rahmen.

## Neu in v111: Chat-Überschriften, Porträt-Editor = Unterseiten-Editor

- Chat: Seite heißt groß „Clubgeflüster“ (`chatText.feedTitle`), kleine rote Zeile
  darüber entfällt; Feld „Seitentitel“ im Chat-Texteditor bearbeitet jetzt feedTitle.
- Beiträge haben eine freiwillige **Überschrift** (`post.title`, max. 90 Zeichen) im
  Schreibfenster über dem Text; erscheint rot über dem Text im Feed und ersetzt in
  „Alle Beiträge“ das rote „Clubgeflüster“ (ohne Überschrift bleibt der Bereich).
  Suche findet auch Überschriften.
- Mannschaftsporträt-Editor exakt wie Unterseite: 1 Fotos oben (1 breit, 2–4
  automatisch Quadrate), 2 Überschrift (Kleine Zeile darüber / Überschrift /
  Unterzeile darunter sichtbar), 3 Inhalt (Abschnitte), 4 Fotos unten. Darstellung:
  2–4 eigene Titelfotos immer als Quadrate (auch in der Anzeige).

## Neu in v109: Unterseite und Mannschaftsporträt aus Abschnitten

- Inhalt = Liste `sections` aus **Text** (Fließtext, nur Fett/Kursiv/Rot/Link),
  **Überschrift** (immer rot, groß – `.story-h`) und **Zitat** (immer roter Strich,
  große Schrift, optional „von“). Pfeile verschieben, × löscht (mit Rückfrage bei
  Inhalt), unten „+ Text / + Überschrift / + Zitat“. Keine Schriftgrößen mehr
  (Textgröße aus Unterseite und Porträt entfernt; `textSize` wird ignoriert).
- Ablage: Home-Thema `more.sections`, Porträt `portrait.sections`. Alter Stand
  (`text` mit `## …` + `quote` nach dem 2. Absatz) wird beim Öffnen automatisch
  umgewandelt (`legacySections`); zusätzlich werden `text`/`quote` abgeleitet
  gespeichert (`sectionsDerived`) für „hat Unterseite“-Erkennung.
- Editor-Felder sehen aus wie die Seite: Überschrift rot/fett, Zitat mit rotem Strich.
- Getestet mit Padel-Unterseite: Umwandlung 1:1, Verschieben/Hinzufügen live,
  Speichern + Neuladen.
- v110: Rotes ⊕ vor jedem Abschnitt öffnet „Text · Überschrift · Zitat“ und fügt genau
  dort ein (`data-sec-at`); Leiste unten „Abschnitt hinzufügen“ in Signalrot. Fotos
  oben/unten bleiben unverändert (Nutzer einverstanden).

## Neu in v108: Home-Editor so einfach wie möglich

- Festlegung des Nutzers: Auf Home sehen Kleine Zeile, Überschrift, Unterzeile (rot)
  und Fließtext immer gleich aus – keine Größenwahl. „Textgröße“ aus Home entfernt,
  Home-Fließtext ignoriert `textSize` (Unterseite nutzt es weiter).
- Kurzer Text auf Home mit schlanker Werkzeugleiste (`field(..., { simple: true })`):
  Fett · Kursiv · Rot · Link · Schlicht. Unterseite behält die volle Leiste.
- Werkzeugknöpfe leuchten auf, wenn der markierte Text schon fett/kursiv/rot … ist
  (`selectionchange`). Fett/Kursiv/Unterstrichen ohne Markierung → Hinweis statt
  stillem Nichts (vermutete Ursache für „Fett geht nicht“; mit echter Markierung
  funktionierte Fett in allen Tests).
- Link-Text erscheint jetzt auch beim dezenten Link (vorher immer die Adresse, z. B.
  „Hier buchen“ war gespeichert, aber unsichtbar); ohne Text die Adresse. Tooltip
  zeigt die Adresse. Umschalten Website ↔ App behält das runde Linkbild.

## Neu in v107: Home-Editor – Themen-Leiste, Überschriften, zwei Links

- Themen-Leiste oben im Editor „Thema 01 02 03 … +“: Wechsel speichert das aktuelle
  Thema und öffnet das gewählte (Reiter bleibt); „+“ legt ein neues an (max. 10).
  Leeres neues Thema wird beim Wegwechseln verworfen.
- Reiter „Startseite“: 1 Foto · 2 Überschrift (Kleine Zeile darüber, Überschrift,
  Unterzeile darunter – wieder sichtbar, lagen seit v102 unter „Mehr“) · 3 Kurzer
  Text · 4 Links: Link 1 und **Link 2** (`block.link2`, z. B. Seite der App/Unterseite).
  „Mehr erfahren“ erscheint automatisch bei Unterseiten-Inhalt.
- Umschalten Website ↔ Seite der App löscht den Link nicht mehr; der vorige Wert wird
  gemerkt (`link.memo`) und beim Zurückschalten wiederhergestellt.
- Link 2 übernimmt Darstellung/Platz von Link 1, ist per Ziehen verschiebbar (Schlüssel
  `second` in `featureLinks`/`moveLink`).

## Neu in v106: Unterseite im Editor wie auf der Seite

- Reiter „Unterseite“ in Seitenreihenfolge: 1 Fotos oben (1–4; ohne eigene Fotos
  das Startseitenfoto; 1 Foto breit, 2–4 automatisch Quadrate), 2 Text, 3 Zitat,
  4 Fotos unten (Kollage). „Mehr Gestaltung“: Darstellung bei 1 Foto
  (Breit/Original + Ausrichtung), Großer Textanfang, Grundschrift, Kollage-Original.
  (Fehler aus v102 behoben: Titelfotos/Zitat lagen versteckt unter „Mehr“.)
- Werkzeugleiste in Gruppen: Schrift (F K U) · Farbe (Rot, Grau, Marker, „Farbe
  entfernen“) · Größe (sehr klein, klein, normal, groß, sehr groß) · Absatz
  (Überschrift, Link, Schlicht). Neue Zeichen `{klein}`, `{sehrklein}`; Farben und
  Größen ersetzen sich gegenseitig statt zu verschachteln (`SPAN_GROUPS`).
- Editor-Text sieht aus wie die Seite: Zwischenüberschriften groß/fett statt grauer
  Großbuchstaben (globale `h3`-Regel überschrieben), Schriftgröße/Zeilenabstand wie
  `.story-text`.
- Mannschaftsporträt gleich geordnet: 1 Fotos oben, 2 Überschrift, 3 Text, 4 Zitat,
  5 Fotos unten.

## Neu in v105: Home bearbeiten im gewählten Look, bis zu 10 Themen

- WYSIWYG: Der Bearbeiten-Modus von Home zeigt den gewählten Look (Wechselspiel,
  Klassisch oder Magazin). Look oben umschalten → Seite darunter wechselt sofort.
  Dafür tragen Themen die Klassen `feature-first`/`feature-even` (statt
  `:nth-child`, das durch die Bearbeiten-Rahmen nicht mehr stimmte).
- Unten im Bearbeiten-Modus: **„+ Neues Thema (n von 10)“** legt direkt ein Thema an
  (kein Bausteinkatalog). Ab 10 Themen Hinweis statt Knopf; `saveSite` lehnt mehr
  als 10 ab. Abbrechen verwirft das leere Thema.
- Prüfhinweis: Bei Tests im Browser JS-Dateien ohne Zwischenspeicher laden
  (`fetch(..., {cache:'reload'})`), sonst läuft alter Code.

## Neu in v104: Home-Look festgelegt

- **Standard: Look 6 „Wechselspiel“** (Foto/Text je halb, Seiten wechseln, große
  Ziffer) – Nutzer: ruhig, gut lesbar; Fotos komplett per Klick ansehbar.
- Im Admin (Home → Stift → oben „Look der Startseite“) umschaltbar: Wechselspiel ·
  Klassisch (bisheriger Look 1) · Magazin (Look 3). Gespeichert in `site.homeLook`
  (gilt für alle Besucher, in „Sichern & Laden“ enthalten).
- Looks 2/4/5 und der vorübergehende Schalter unten auf Home sind entfernt.

## Neu in v103: sechs Home-Looks zur Auswahl (historisch, ersetzt durch v104)

- Auf Home unten ein schwarzer Schalter „Look · 1–6“ (nicht im Bearbeiten-Modus).
  Gleiche Inhalte, andere Gestaltung; Wahl im Browser (`localStorage tfb_home_look`).
  1 Heute · 2 Zeitung (Haarlinien, Serifen, Aufmacher + 2 Spalten) · 3 Magazin
  (zentrierte Serifen-Überschriften, gerahmte Fotos, rote Trenner) · 4 Bühne
  (Überschrift auf dem Foto; Hoch/Quadrat mit Text daneben) · 5 Kacheln (Karten,
  Aufmacher quer, Text gekürzt) · 6 Wechselspiel (Foto/Text je halb, Seiten wechseln,
  große Ziffer).
- Looks 2–6 geben das Bildformat vor; ein mit „Foto einpassen“ gesetzter Ausschnitt
  (Mittelpunkt + Zoom) bleibt dabei erhalten. Serifenschrift nur in Look 2/3
  (`--look-serif`, Systemschriften, offline).
- Code: `homeLook()`, `lookSwitch()`, Aktion `home-look` in `site.js`; CSS-Block
  „Home-Looks“ am Ende von `app.css`. Nach der Entscheidung: gewählten Look fest
  machen, Schalter und übrige Looks entfernen.

## Neu in v102 (Aufräumen Stufe 3)

- Home-Themen-Editor nach gleichem Muster: Reiter **Startseite** = 1 Foto,
  2 Überschrift, 3 Kurzer Text, 4 Link (Ziel + Link-Text); Reiter **Unterseite** =
  1 Ausführlicher Text, 2 Fotos. Alles Weitere (Anordnung, kleine Zeile, Unterzeile,
  Textgröße, Klickziel, Link-Platz/-Darstellung/-Symbol/-Vorschau, Titelbild der
  Unterseite, Großer Textanfang, Zitat, Originalformat) unter „Mehr Gestaltung“.
  Wird eine Fotokollage statt Einzelfoto genutzt, steht sie in Schritt 1.
- Reiter „Startseite · Unterseite · Fotokollage“ in einer Zeile (auch Handy).
- Einheitliche Knöpfe: Sport-Umschalter Mannschaften/Training im selben
  Segment-Look wie Aktuell; Filter (Saison) bleiben Pillen; „Zum Anmeldeformular“
  rot mit weißer Schrift; „Foto ersetzen/entfernen“ als gleich große kleine Knöpfe.
- Verabreden-Untertitel: „Training, Einzel, Doppel – wer ist dabei?“
- Alle drei Aufräum-Stufen erledigt. Nächster Schritt: Nutzer prüft, dann Arbeit
  an der Live-Seite.

## Neu in v99

- `photo-viewer.js`: Einzelfotos auf den Inhaltsseiten, Mannschaftslisten und
  Porträtseiten sowie sichtbare Teilnehmer-/Chat-Profilfotos öffnen per Klick oder
  Enter/Leertaste die gemeinsame Vollbildansicht. Bildklicks in Mannschafts-/Home-
  Links öffnen das Foto; Text und übrige Linkfläche behalten die Navigation.
- Vorhandene Galerie-/Collage-Viewer, Vorstands-Originalbilder, Link-Vorschaubilder,
  Logo/Partnerlinks und Upload-/Ausschnitt-Editoren bleiben in ihrer bisherigen
  Funktion. Es werden nur bereits sichtbare Fotoquellen verwendet, keine weiteren
  Mitgliederdaten geladen und keine Foto-Freigaben verändert.
- Vollbild zeigt die unbeschnittene Quelle bis 1600px/84vh. X, Hintergrundklick und
  Escape schließen; Bildklick schließt nicht. Scrollzustand und Fokus werden
  wiederhergestellt; Escape schließt nicht gleichzeitig das darunterliegende Formular.
- 32 Tests bestanden, Mannschaftsbild-Klick und Trainerfoto auf Desktop und
  Smartphone-Größe in isolierter Browservorschau geprüft.

## Neu in v98

- Unveränderte Beispiel-News `p-1` bis `p-3` und ungepflegte Home-Themen werden beim
  Laden entfernt. Geänderte Texte, eigene Fotos und Alben bleiben erhalten. Keine
  pauschale Löschung anhand des Autors; Bereinigung auch nach älteren Backups.
- Home-Themen und News-Bausteine können statt eines Einzelbildes bis zu 100 Bilder
  in `block.images` enthalten. Admin-Fotoliste mit Entfernen, Sortieren, Foto einpassen
  und vorhandener Drag-and-Drop-Upload-Funktion. Bestehendes Einzelbild wird beim
  ersten Collage-Upload übernommen; Texte und Links bleiben.
- Vorschau: fünf Fotos im Magazin-Raster plus Restanzahl. Klick: komplette,
  scrollbar große Collage, dann Original-Einzelbilder mit Pfeilen, Klick und Wischen.
- Training: Kalender-Knopf ersetzt durch Textbaustein `s-schnupper-dates`, Titel
  „Termine für Schnuppertraining demnächst“. Über den Seiten-Stift Termintext mit
  Datum/Uhrzeit/Treffpunkt pflegen; keine erfundenen Termine, kein Kalender.
- 30 automatisierte Tests bestanden; neue Collage und Editor in isolierter lokaler
  Browservorschau geprüft, Smartphone-Breite ohne horizontalen Überlauf.

## Ziel und Betriebszustand

Vereinswebsite der **Tennisfreunde Bielstein**, inklusive Kiosk. Nutzer hat echte
Inhalte und eigene Flüsternachrichten gepflegt und ist sehr zufrieden.
Nächstes Ziel: Vorstellung beim Vorstand. **Noch nicht veröffentlicht.**
Mitglieder, Chats, Kiosk und Verabredungen nutzen lokale Browserdaten,
keine gemeinsame produktive Vereinsdatenbank.

## Öffnen und Sichern

- Doppelklick auf `TFB-Website öffnen.html` im Ordner `9. TFB-Website`; Startseite Home. Nach Änderungen Chrome neu laden.
- Daten gehören zum jeweiligen Browser/Ursprung. Direkter HTML-Start und lokale
  Vorschau-Server haben getrennte Datenbestände; Testdaten sind nicht Nutzerinhalte.
- Regelmäßig **Verwaltung → Sichern & Laden**: JSON mit Daten und Fotos sichern.
  Browserdaten niemals als vermeintliche Lösung für Layout-/Cacheprobleme löschen.
- Demo-Admin: `max@tfb-demo.de`; Passwort beim ersten Anmelden frei wählen.
- Aktuelle direkte HTML-Browserprüfung durch Browserrichtlinie nicht möglich.
  Frühere Offline-Prüfungen sind historische Nachweise, keine neue Abnahme.

## Aktueller Funktionsstand

- **Menü:** Logo → Home; Kiosk · Chat · Aktuell · Sport · Club · Verabreden · Padel.
  Dezente globale Fußzeile mit Impressum (`#impressum`), Satzung (`#satzung`) und
  dynamischem Copyright-Jahr. Unterseiten ohne Werbung, einspaltig und im Admin
  bearbeitbar (Stift oder Verwaltung). Rechte Dritter bleiben ausdrücklich erhalten.
  Satzung vom Nutzer wortgetreu übernommen: 17 Paragraphen, Stand 20.03.2015.
  Impressum: Amtsgericht Köln, VR 600693, USt-ID DE330174727 aus dem öffentlichen
  Padel-Impressum; Kai Eichmann als Vorsitzender vom Nutzer ausdrücklich bestätigt.
  Sebastian Manz und Daniel Pollmann, gemeinschaftliche Vertretung; Sebastian Manz
  als inhaltlich Verantwortlicher übernommen. Keine Änderung am Padel-Projekt.
- **Home:** Themen mit Detailseite, direktem Link oder ohne Ziel. „Mehr erfahren“
  unabhängig ausblendbar. Kiosk-Titel/Link führen direkt zum Kiosk; echte Einzelfotos
  öffnen seit v99 ihre Vollbildansicht. Verlinkte Titel
  werden bei Hover Signature-Rot. Links, Symbole und Reihenfolge editierbar.
  Separate Foto-Unterseite mit bis zu 100 Bildern, Collage und Großansicht.
  Zusätzlich Collage statt Titelbild direkt im Home-/News-Feld: bis zu 100 Fotos,
  sortierbar, fünfteilige Vorschau mit Restanzahl, Klick öffnet die gesamte Collage.
  Home-Beispielhinweis und unveränderte Beispiel-News entfernt; gepflegte Inhalte bewahren.
- **Aktuell:** News links 2/3, Save the Date rechts 1/3. Mobil umschaltbar.
- **Chat:** `#chat` zeigt neueste Beiträge zuerst, groß und linksbündig (max. 760px).
  „Alle Beiträge“ → `#chat/alle` mit Suche/Filtern. Alte `#gefluester`-Links gültig.
  Admin-Stift auf Haupt-/Unterseite: 24 Texte editierbar (`site.chatText`).
  Mannschafts-Insider-News und bisherige Rechte bleiben erhalten.
- **Chat-Fotos:** bis zu sechs pro Beitrag; responsive Collage. Erster Klick öffnet
  gesamte Collage groß, danach Einzelbilder mit Pfeilen, Klick und horizontalem Wischen.
  Keine persönlichen Direktnachrichten implementiert.
- **Beispiel-Chats:** exakt `p-s1` bis `p-s4` und `p-t1` bis `p-t3` werden beim
  Laden entfernt und nicht mehr erzeugt, auch nach Import eines alten Backups.
  Eigene Beiträge, Bildreferenzen und Bildspeicher bleiben erhalten.
- **Club:** fünf editierbare/sortierbare Zahlen; unerwünschter „Vier Knöpfe“-Block
  entfernt. Schwarzer Beitragsbutton vor rotem Aufnahmebutton mit schwarzem Text.
  Beitragstabelle als Fenster mit X. Editierbarer Hinweis daneben:
  „TFB-Mitglieder erhalten 10 Prozent Rabatt auf alle Padel-Buchungen.“
  Dieser Text allein implementiert keine Rabattberechnung im getrennten Padel-System.
- **Vorstand:** sieben veröffentlichte Personen mit Kontakten und lokalen Fotos.
  Runde Bilder mit Originalansicht; Basti/Marco aufgehellt, Originale erhalten.
  Rollen, Namen, Kontakte, Reihenfolge und Fotoausschnitt im Admin editierbar.
  Mitgliedssuche nach Name/E-Mail mit Auswahl bei Familienadressen. Verknüpfte
  Profilbilder erscheinen nur mit öffentlicher Freigabe.
- **Sport:** Porträt-/Newsbutton ab 640px zwischen linkem Informationsbereich und
  rechter Platzierung zentriert; mobile kompakte Darstellung bleibt erhalten.
  Zwei Reiter: Mannschaften (`#sport`) und Training (`#sport/training`). Training
  mit Leon Kaufmann, Originalfoto, Funktion, Text und anklickbaren Kontakten,
  Schnuppertraining sowie „Termine für Schnuppertraining demnächst“ mit frei
  bearbeitbarem Termintext (Datum, Uhrzeit, Treffpunkt); kein Kalender-Link mehr.
  Trainerfoto, Funktion, Kontakte und Texte im vorhandenen Admin-Editor bearbeitbar.
  Eigene abweichende Trainingstexte werden bei der Migration nicht überschrieben.
- **Foto-Drop:** Dateibatches auf bestehende Bildfelder ziehen; gleicher Weg wie
  Datei-Upload, interne Sortierung bleibt erhalten. Tatsächliche Übergabe macOS
  Fotos → Chrome noch nicht geprüft. Unaufgelöste Dateiversprechen erhalten eine
  Meldung mit JPEG-Export als Ausweichweg.
- **Foto einpassen:** gemeinsamer Admin-Editor in Bildfeldern, Galerie-/Hero-/Album-
  Vorschaubildern, Chat-Komposition und Bildanhängen. Hochformat (3:4), Querformat
  (3:2), Quadrat; Zoom 1–4, Verschieben per Maus/Finger, horizontale/vertikale Regler.
  Einstellungen als `site.photoFrames[ref]`, gelten für alle Verwendungen derselben
  Bildreferenz. Originaldatei unverändert, Einzelbild-Großansicht bleibt unbeschnitten.
  „Originalansicht“ entfernt nur die Rahmeneinstellung. Kollagen und kleine/runde
  Vorschaurahmen behalten ihr Raster; darin werden Zoom/Position angewendet.
  Eigene Profil-/Vorstandsfotos behalten ihren bisherigen runden Ausschnitt-Editor.
  Übernehmen speichert den Ausschnitt sofort, ohne offene Textentwürfe zu schließen.
- **Foto-Vollbild:** gemeinsame Ansicht für Einzelfotos, auch Mannschaftslisten,
  Porträt-/Trainerfotos und sichtbare Chat-/Teilnehmerbilder. Originalquelle ohne
  Rahmenzuschnitt; X, Hintergrundklick oder Escape schließen. Collagen, Fotoeditoren
  und funktionale Link-Vorschaubilder behalten ihre bisherigen Aktionen.
- **Kiosk/Verabreden:** bestehende lokale Funktionen erhalten. Kiosk-Abrechnung
  vorgesehen als monatliche Vereins-SEPA, nicht Stripe. Push/automatische Antworten
  bei Verabredungen bleiben Vorführung, kein echter Mitgliederbetrieb.

## Aufnahme und Foto-Freigaben

Details: [digitale-aufnahme.md](digitale-aufnahme.md).

- Öffentlicher Aufnahmeantrag ohne Fotoeinwilligung. Lokaler HTML-Start simuliert nur:
  keine Antragsdaten gespeichert oder versendet, keine Mitgliedschaft angelegt.
- Separater Python-/SQLite-Dienst vorbereitet: Bestätigung durch Antragsteller/
  Sorgeberechtigte und ggf. abweichende Kontoinhaber, geschützter Club-Posteingang,
  SMTP-Warteschlange. Versand deaktiviert; keine echten E-Mails versendet.
- Vor Livebetrieb: Satzung, Beitrags-/Datenschutztexte und digitales SEPA-Verfahren
  durch Club/Bank freigeben; HTTPS, Hosting, SMTP und geschützte Datenablage einrichten.
  Software ersetzt keine Rechts-/Bankfreigabe. Keine automatische Übernahme
  bestätigter Anträge in die Mitgliederliste implementiert.
- Freiwillige Foto-Freigaben nach Aufnahme. Minderjährige: Foto für andere erst
  nach dokumentierter Elternzustimmung sichtbar; neues Foto benötigt neue Freigabe.
  Echte Elternverifikation für Produktion noch umzusetzen.

## Wichtige Dateien

| Datei | Aufgabe |
|---|---|
| `assets/js/demo-backend.js` | lokale Daten/Rechte, Sicherung, gezielte Beispiel-Chat-/News-Bereinigung |
| `assets/js/app.js` | Menü, Kiosk, Account, Verwaltung, eigener Fotoausschnitt |
| `assets/js/site.js` | Website, Chat, Collagen, Seiten-/Texteditoren |
| `assets/js/board.js`, `member-photos.js` | Vorstand und Foto-Freigaben |
| `assets/js/membership.js`, `server/` | Aufnahmevorschau und vorbereiteter Server |
| `assets/js/photo-drop.js` | gemeinsame Drag-and-drop-Anbindung |
| `assets/js/photo-frame.js` | nichtdestruktiver Rahmen-/Zoom-/Positionseditor |
| `assets/js/photo-viewer.js` | gemeinsame Vollbild-Einstiege für Einzelfotos |
| `assets/js/meet.js` | lokale Verabredungen |
| `assets/data/site-seed.js` | Startinhalte und gezielte Migrationen |
| `assets/data/legal-pages.js` | Satzungswortlaut und Impressum-Startdaten |
| `assets/data/board-photo-data.js` | lokale Vorstandsquellen für HTML-Fotoausschnitt |
| `assets/css/app.css`, `sw.js` | Gestaltung und Cache-Version |

## Prüfstand und Weiterarbeit

**32 Node-Tests im letzten Implementierungslauf bestanden**: Vorstand/Fotorechte,
Home/Chat/Galerien, News-Collagen bis 100 Bilder, gezielte Beispiel-Bereinigung,
Sport, Rechtstexte, Foto-Drop/-Rahmen und Vollbild-Klick/Keyboard/Schließen.
Bei diesem reinen Dokumentationsupdate nicht erneut ausgeführt.
Foto-Editor: Format, Zoom, Drag, Übernehmen und Fortbestand nach Neuladen im Browser
geprüft. Quadrat im Seitenlayout exakt 360×360px; Smartphone-Dialog ohne Überlauf.
Satzungswortlaut per SHA-256 nach reiner Leerraum-/Paragraphenformatierung abgeglichen.
Fußzeilenlinks, Unterseiten und Smartphone-Layout ohne Überlauf im Browser geprüft.
Neue Trainingsansicht auf Desktop/390px geprüft: Foto geladen, kein horizontaler
Überlauf; Trainer-Editor mit Foto-, Funktions- und Kontaktfeldern geprüft.
Aus dem Projekt-Elternordner:

```sh
node --test tfb-kiosk/tools/test-board-photos.mjs tfb-kiosk/tools/test-home-features.mjs tfb-kiosk/tools/test-photo-drop.mjs tfb-kiosk/tools/test-photo-viewer.mjs
```

Aufnahme-Tests separat aus `tfb-kiosk/server`:
`python3 -B -m unittest -v test_membership.py`.
Bei diesem Dokumentationsupdate nicht erneut ausgeführt.
Frühere Desktop-/Mobilprüfungen in isolierter Vorschau; echte Fotos-App-Übergabe
und aktuelle direkte HTML-Prüfung bleiben offen.

1. Vor Vorstandsvorführung Nutzer-Sicherung erstellen und in seinem Chrome
   nach Neuladen kontrollieren, dass nur gewünschte echte Chats und News erscheinen.
2. Fotos-App-Drop am Mac praktisch ausprobieren; iPhone/iPad nach HTTPS-Veröffentlichung prüfen.
3. Veröffentlichung und eigene TFB-Datenbank separat planen. Aufnahme-Freigaben,
   Mitgliederimport, SEPA-Abschluss und echte Benachrichtigungen noch offen.
   Satzung von 2015 nennt in § 1 Gummersbach und in § 3 schriftliche Aufnahme;
   historische Angaben nicht eigenmächtig korrigiert. Aktuelle Satzungsfassung,
   Vertretungsregel, Impressum und Datenschutz vor Veröffentlichung durch Club prüfen.

## Verbindliche Arbeitsregeln

- Nur `tfb-kiosk/` bearbeiten. Padel-Kopie und deren Dokumentation sind ein anderes
  Projekt; keine Padel-Datenbank oder Veröffentlichung verändern.
- Aktuelle Software und Nutzerinhalte sind maßgeblich. Historische Gedächtnistexte
  nicht als Anlass für Rücksetzungen nehmen. Migrationen eng auf bekannte IDs begrenzen.
- Keine privaten Mitgliederlisten, Geheimnisse, Browserexporte oder echten
  Aufnahmedaten ins Repository. Übernahme veröffentlichter Vorstandsdaten ausdrücklich
  beauftragt; erforderliche Rechtsgrundlage/Information muss der Club sicherstellen.
- Lokaler HTML-Start ohne Build erhalten. JS/CSS-Änderungen mit neuer Cache-Version.
  Signature-Rot `#C4553A`; Gestaltung in kleinen Schritten.
- Deutsch, kurz und ehrlich. Nicht still veröffentlichen, versenden oder committen.
  Bestehende lokale Änderungen nicht zurücksetzen oder ungefragt insgesamt committen.

## Nächster Ausbaustand v232: zentrale Redaktion und Website-Snapshots (Vorschlag 26.10.2026)

Status: Nutzer beauftragt einen Vorschlag für zentrale geräteübergreifende
Inhaltspflege und wiederherstellbare Sicherungsstände. Noch keine Umsetzung,
keine Live-/Datenbankänderung und keine bestehende lokale Datei als vermeintlich
aktueller Desktopstand übernommen. Live bleibt bestätigte v231. Dieser Abschnitt
ist der nächste Entwicklungsauftrag und kein Hinweis auf bereits aktive Funktionen.

### Diagnose und vorhandene Grundlage

Am 26.10.2026 öffentlich ausgelieferten demo-backend.js, cloud-sync.js,
public-content.js und sw.js schreibgeschützt mit dem lokalen Stand verglichen:
Dateien identisch, Cache v231. api.saveSite schreibt redaktionelle Inhalte nur
in db.site/localStorage; cloud-sync ersetzt site/saveSite nicht. Ein frisches
Gerät startet mit TFB.publicSite, Änderungen eines Desktop-Browsers sind dort
nicht enthalten. Kein durch Neuinstallation lösbares Cacheproblem.

Bereits zentral: Mitglieder-/Anmeldung, Profile, Kiosk, Chats/Kommentare,
Verabredungen/Gruppen sowie Partner/Splash. Vorhandene TFB-Infrastruktur:
Cloudflare Worker tfb-api und separate D1 tfb-website. Kein Neubau der Anmeldung
und keine Migration sämtlicher TFB-Daten nach Supabase nötig. Padel verwendet
andere technische Datenhaltung; bewährte Abläufe/Backupprinzipien übernehmen,
TFB und Padel organisatorisch und in ihren Datenbeständen getrennt halten.

Bestehendes exportAll/importAll: Format tfb-sicherung v1 mit db, Bildern und
zusätzlichen Browserständen. Das ist eine lokale Komplettsicherung, kein
vollständiges Backup der zentralen Dienste oder des Programmcodes. Die lokale
Automatik benötigt einen geöffneten/berechtigten Browser und schreibt dieselbe
TFB-Sicherung-automatisch.json fort. Keine Historie unveränderlicher Einzelstände.
Alte Komplettimporte nicht als Wiederherstellung einer einzelnen Website-Seite
verwenden, sonst drohen ungewollte Rücksetzungen anderer Bereiche.

### Zentrale Inhaltspflege

Die bestehenden Stifte und Speicherknöpfe behalten. Seiteninhalte, Blockreihenfolge,
Navigation, Galerien/Anhänge, Bildausschnitte und gemeinsame Gestaltungsoptionen
über serverseitig geprüfte Redaktions-Endpunkte speichern. Jeder bestätigte Save
veröffentlicht einen zentralen, versionierten Inhaltsstand. Andere Geräte laden
diesen beim Öffnen, Zurückkehren und über eine kleine Revisionsprüfung; lokale
Daten dienen als Offline-/Entwurfscache und überschreiben den Server nie automatisch.
„Gespeichert“ erst nach erfolgreicher zentraler Bestätigung; offline bleibt ein
sichtbarer Entwurf und wird nicht als veröffentlicht ausgegeben.

Revisionen pro Seite bzw. gemeinsamer Konfiguration erlauben parallele Pflege.
Bei veraltetem Ausgangsstand Konflikt anzeigen und Entwurf erhalten, keine
stille letzte-Schreiboperation-gewinnt-Regel. Revision, Autor, Zeitpunkt und
Änderungsgrund protokollieren. Partner-/Splash-Endpunkte sinnvoll integrieren,
aber keine widersprüchlichen zweiten Wahrheitsquellen aufbauen.

Für öffentliche redaktionelle Bilder/PDFs zentralen Medienspeicher vorsehen,
bevorzugt eigener R2-Bereich im bestehenden Cloudflare-Konto. Medien unveränderlich
unter geprüften IDs/Hashes ablegen; erst nach vollständig hochgeladenen Medien
den Seitenstand atomar freigeben. Private Profil-/Chatbilder nicht automatisch
öffentlich machen oder in redaktionelle Sicherungen aufnehmen. Medienfreigaben
und Aufbewahrung bei Rücknahmen ausdrücklich berücksichtigen.

### Drei getrennte Sicherungsumfänge

1. **Website-Inhaltssnapshot:** Seiten, Reihenfolge, redaktionelle Texte und Medien,
   Navigation, Designwerte/Look, Bildausschnitte, öffentliche Partner-/Splash-Darstellung.
   Nicht enthalten: Sitzungen, Passwörter, Mitgliederliste, Käufe/Abrechnungen,
   neuere Chats oder Verabredungen. Interne Partnerkontakte/-zahlungen separat.
2. **Programm-/Designrelease:** exakter Git-Commit, Quellarchiv und Git-Bundle,
   Schriften, Logos, CSS/JS, Schema-/Migrationsstand und nicht geheime Konfiguration.
   Keine Secrets in JSON/Git/PDF. Programm-Rollback benötigt einen technischen
   Deployment-Schritt und Prüfung der Datenbankkompatibilität; kein Ausführen
   beliebigen Programmcodes aus einer hochgeladenen JSON-Datei im Admin.
3. **Vollständige Betriebssicherung:** geschützter Datenbankexport plus zugehörige
   Medienkopie und Konfigurations-/Secret-Wiederanlaufplan. Nur berechtigte Betreiber,
   verschlüsselte externe Kopie und unabhängige Aufbewahrung. Eigenständige
   Wiederherstellungsproben; nicht mit dem Inhalts-Zurücksetzen vermischen.

### JSON als Snapshot-Verzeichnis, Paket für vollständige Portabilität

Vorgeschlagenes Exportpaket TFB-Website-Snapshot_<Datum-Uhrzeit>.zip:
- snapshot.json: Format/Schema-Version, Projektkennung, Snapshot-ID, Datum,
  Inhaltsrevisionen, Inhalt/Look, Medienmanifest mit SHA-256-Prüfsummen,
  Programmrelease/Commit und benötigter Schema-Stand.
- medien/: tatsächlich benötigte Bild-/PDF-Dateien in den geprüften Versionen.
- programm/: bei vollständigem Stand Quellarchiv/Git-Bundle des passenden Releases.

Eine JSON mit bloßen Medienlinks oder Commitnummer ist keine eigenständig
vollständig wiederherstellbare Kopie. Für kleine Inhaltssicherungen zusätzlich
Ein-Datei-JSON mit eingebetteten Medien anbieten; bei vielen Fotos ZIP verwenden,
keine künstlich riesige JSON mit gesamten Programmdateien und privaten Daten.
Gemeinsamer Snapshot-Zeitpunkt/Revisionsschnitt; referenzierte Medien vollständig
prüfen und während der Sicherung gegen vorzeitiges Löschen schützen.

Sicherungsvorschlag: automatisch vor/nach Inhaltsänderungen versionieren,
benannte manuelle Stände (z.B. Vorstandsfreigabe), regelmäßige serverseitige
Exportpakete unabhängig vom geöffneten Browser. Als zu beschließende Startwerte:
letzte 30 Änderungsstände, 30 Tagesstände und 12 Monatsstände; bewusst benannte
Stände bis zur ausdrücklichen Aufhebung behalten. Aufbewahrungsfristen und
personenbezogene Inhalte gesondert abstimmen. Sicherungen außerhalb öffentlicher
Website-Dateien und zusätzlich außerhalb des primären Datenspeichers aufbewahren.

D1 Time Travel ist eine zusätzliche Notfallhilfe, kein Ersatz für Medien-/Code-
Sicherungen und keinenfalls die normale Inhalts-Zurück-Funktion: vollständige
Datenbankwiederherstellung setzt auch andere Datenbereiche zurück. Dokumentation:
https://developers.cloudflare.com/d1/reference/time-travel/
Export: https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/export/
R2-Aufbewahrung: https://developers.cloudflare.com/r2/buckets/object-lifecycles/
Tarif-/Kontozustand und tatsächliche Sicherungsverfügbarkeit vor Implementierung prüfen.

### Einfache Admin-Bedienung und Rechte

Ein kompakter Bereich „Inhalte & Sicherung“ im vorhandenen Konto-Adminbereich,
kein großer zusätzlicher Verwaltungsbaum. Aktionen: „Stand sichern“, „Frühere
Stände“, „Sicherung herunterladen“. Wiederherstellen zeigt zuerst eine Vorschau
und eine verständliche Änderungsliste. Wahlweise einzelne Seite oder gesamte
redaktionelle Website zurückholen; unmittelbar davor automatisch einen neuen
Sicherheitsstand anlegen. Wiederherstellung erzeugt eine neue Revision, löscht
keine Historie. Fehlende Medien/inkompatible Formate sperren die Übernahme.

Mitglieder pflegen ihre zulässigen Chat-/Sportbeiträge, Vereinsadministratoren
bzw. gezielt berechtigte Redakteure die offiziellen Seiten und Gestaltung.
Keine automatische Vergabe von Adminrechten an alle Mitglieder. Rollenprüfung
serverseitig; keine privaten Daten aus dem Redaktions-Endpunkt für Gäste ausliefern.

### Sichere Reihenfolge für Umsetzung und Vereinsdomain

1. Tatsächlich zuletzt gepflegten Desktop-Browserstand samt Bildern, Dokumenten
   und Look vollständig sichern und seine Home-Reihenfolge mit dem Nutzer abgleichen.
   Nicht stattdessen einfach public-content.js als neuesten Inhalt übernehmen.
2. Aktuelle zentrale TFB-Daten sichern; additive CMS-/Snapshot-Strukturen und
   geschützte Medienablage vorbereiten, vorhandene Bereiche unverändert erhalten.
3. Desktop-Inhalte einmalig geprüft übernehmen. Desktop/iPhone/iPad und Gastprofil
   müssen denselben veröffentlichten Inhalt samt Bildquellen sehen. Gleichzeitige
   Bearbeitung, Offline-Verhalten und fehlerhafte Uploads gezielt prüfen.
4. Inhaltsrestore in getrenntem Testbestand erproben: neuere Chats/Käufe bleiben
   erhalten, vorheriger Look/Reihenfolge/Fotos werden exakt wiederhergestellt.
   Zusätzlich vollständigen Wiederanlauf aus Exportpaket testen, nicht nur Dateiexistenz.
5. Nach Freigabe bestehende Anmeldung, Partnerverwaltung, Klingel und später die
   Aufnahme passend integrieren. Keine Freischaltung der Mailstrecke oder
   Partner-Sichtbarkeitsmessung allein durch diesen Ausbau.
6. Vereinsdomain erst bei tatsächlichem Umzug festlegen/verifizieren. DNS/HTTPS,
   erlaubte Ursprünge, öffentliche Links, Mail-/Bestätigungslinks, Manifest/PWA
   und Weiterleitung der Übergangsadresse anpassen. Zentrale Inhalte bleiben
   erhalten; lokale Sitzungen/App-Installationen wechseln nicht automatisch
   auf einen neuen Ursprung. Keine unnötige gleichzeitige Datenbankmigration.

Für die erste Umstellung ist der lokale aktuelle Desktopstand die kritische
Quelle. Zugangsdaten oder neue Dienste erst prüfen/einrichten, wenn die Umsetzung
beauftragt ist; für diesen Vorschlag keine Accounts/Kosten/Automatiken aktiviert.
