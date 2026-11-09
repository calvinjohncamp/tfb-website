# TFB-Kiosk – Projektgedächtnis und Übergabe

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


## Verbindlicher Stand nach Nutzerfreigabe · 08.11.2026 · v349

Der Nutzer ist mit dem Zwischenstand sehr zufrieden. Kalender, Menü und
Abrechnungslogik als abgestimmt behandeln; künftig gezielt darauf aufbauen.
Diese Zusammenfassung hat Vorrang vor überholten Varianten in älteren Logs.

### Festgelegte Darstellung und Bedeutung

Admin-Menü: Welt-Auswahl klein; 12px Gruppenabstand gegenüber 4px zwischen
Verwaltungsbuttons. Reihenfolge Splash, Home, Partner, Mitglieder, Statistik,
Kiosk, Sicherungssymbol. Kiosk ist clubweite Abrechnung, Clubstatistik bleibt
Website-Nutzung. App-Anleitung im Account. Berechtigung bleibt serverseitig.

Kiosk: gleiche Jahr-/Monat-/Tag-Logik für Verein und Einzelmitglied. Jahresblatt
links, Monatskalender rechts, gleich große Quadrate; mobil untereinander.
Aktueller Monat direkt sichtbar; historische Jahre über Pills. Platzhalter
2025/2024/2023 können Nullübersichten zeigen, aber erzeugen keine Daten. Echte
historische Buchungsjahre bleiben erhalten und verdrängen Platzhalter.
Vorjahresansicht: Jahresabschluss fett unter der Jahreszahl, kein Heute und
kein Monatskalender bis zur gezielten Monatswahl. Jahresbetrag größer:
**rote Welt schwarz; gelbe Welt gelb** (ausdrückliche Nutzerkorrektur).

Rote Kalenderköpfe links schwarz/rechts weiß, blaue links weiß/rechts gelb;
Jahresabschlussbetrag ist die eben genannte Ausnahme. Monatsnamen/Positionen
im hellen Raster schwarz, Monatsbeträge in gelber Welt Signature-Blau und
in roter Welt rot. Umsatz-Tage behalten Signature-Zahl und Unterstrich.
Profilfotos bzw. Initialenkreise vor Namen, Foto vergrößerbar. Suchfeld leer;
Umlaute erhalten (Kä ist nicht Ka), Mailabgleich, Telefonbuch-Kollation.

Buchungen chronologisch aufsteigend. Originalpreis/-name bleiben erhalten.
Rücknahmen innerhalb 30 Sekunden und spätere Admin-Korrekturen sind getrennte
Gegenbuchungen mit Akteur und Grund. Keine erfundenen historischen Kategorien.
Ursprünglicher Betrag nur bei Korrekturen; technische Daten nicht im normalen
Mitgliederfluss. Die leer gebliebene inaktive Kämper-Dublette wurde gezielt
entfernt; keine Buchungen des aktiven Kontos gelöscht.

### Exporte und offene Finanzentscheidungen

CSV: Monat, kumuliertes Jahr bis gewähltes Monatsende (laufender Monat bis
heute), Jahresabschluss 01.01.–31.12. ab 31.12. des Jahres. Filter gilt überall.
Abschluss-CSV hat zuerst zwölf korrigierte Monatswerte und Jahressumme,
danach chronologische Details. Übersicht und Detailwerte nicht doppelt addieren.
Export entspricht aktuellem Korrekturstand, keiner endgültigen buchhalterischen
Festschreibung. Monats-/Jahreswerte bilden denselben bereinigten Datenbestand ab.

**Weiterhin Vorführbetrieb.** Keine echte Forderung, SEPA-Aktivierung,
Abbuchung oder Abrechnungsmail freigegeben. Vorstand/Finanzwart klären Bank-/
Vereinssoftware, Export-/Einreichungsformat, verantwortliche Freigabe, Mandate,
Einzugstermin, Vorankündigung und Zahlungsabgleich. Geplanter Echtstart April
2027. Die App-Zustimmung allein löst keinen Bankeinzug aus. Buchhalter kann mit
Adminzugang Monate vergleichen/CSV ziehen, hätte damit aber sämtliche
Adminrechte. Kein Buchhalterkonto oder besondere Finanzrolle angelegt.

Vorführdaten bleiben bis zu einem später ausdrücklich bestimmten Stichtag X
bestehen. Kein Termin, automatischer Reset oder Finanzdatenreset beauftragt.
Vorher Sortiment bereinigen; Reset später kontrolliert mit Sicherung und ohne
verwaiste Journal-/Korrektur-/Archivdaten. Padel-Übernahme des Looks/der Logik
bleibt Ziel; Stripe oder Lastschrift dort noch offen.

Vorgemerkt: Bei mehreren echten Umsatzjahren grafischer Vergleich der von
Januar bis Dezember kumulierten Jahresumsätze, jede Jahreskurve beginnt bei
null. Noch nicht implementieren, solange nur die vorgemerkte Erweiterung gilt.

Nachweise: [Release v349](RELEASE-v349.md), Code `5517800`, Service Worker v349,
Pages-Lauf `42517049131`. Direkte Deployments fertiger beauftragter Änderungen
bleiben autorisiert. Diese Dokumentationspflege benötigt keinen Website-Rollout.


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

## Verbindlicher Sitzungsabschluss – 08.11.2026 · v320

Nutzerfreigabe: „Alles super“. Alle Aufträge dieser Sitzung abgeschlossen und
live; keine daraus offenen Aufgaben. Dieser Abschnitt hat Vorrang vor den
historischen Abschlussständen und Gestaltungsversuchen weiter unten.
Aktuelle Zusammenfassung: [Projektupdate](PROJEKTUPDATE.md).

Live: v320 / `tfb-kiosk-v320`, Code `81b0a6d08cbd684019ca86c244e149fe69db3096`,
[Pages-Lauf 42457537738](https://github.com/calvinjohncamp/tfb-website/actions/runs/42457537738) erfolgreich. CSS und Service Worker live bytegleich geprüft.

Verbindliche Regeln:

- Aktuell-Datumsfelder in der gelben Welt: Signature-Blau #001D3D mit
  Signature-Gelb #FFC300. In der roten Welt: Signature-Rot #C4553A mit Weiß.
  Wochentag, Zahl und Monat jeweils vollständig deckend. Die zwischenzeitliche
  schwarze Schrift auf roten Datumsfeldern ist ausdrücklich verworfen.
- Bierdeckel: unten dezent und zentriert Vor-/Nachname, bisherige Größe und
  Abstände beibehalten. Name in Gelb Signature-Blau, in Rot Schwarz #171717.
  In Rot sind ALLE Texte schwarz, auch Betrag und Abrechnungshinweis; dessen
  Deckkraft ist dort 1. Nur Ball und Striche sind rot. In Gelb bleiben beide gelb.
- Karussellpfeile: transparente Kreisfläche mit dezenter gelber/roter Kontur;
  aktive Seitenpunkte bleiben gelb/rot.
- TFB-Absenderzeichen: in Gelb Signature-Blau, in Rot Signature-Rot. Gilt für
  Beiträge, Kommentare, Übersichten und Absenderauswahl, auch beim Weltwechsel.
- Clubarchiv ohne Save the Date, Terminspalte und mobile Termin-Tabs;
  einspaltiger Beitragsstrom. Historische Termin-Detailadressen bleiben erhalten.
- Defibrillator-Bericht vollständig inklusive Foto archiviert, Kennung
  `start-defibrillator`, Einordnung 28.10.2026 aus Upload-/Änderungsdatum der
  Quellstartseite, nicht aus einem separat belegten Beitragsdatum. Nutzer hat
  das Erscheinen bestätigt. Archiv-JSON wird versioniert und revalidiert.
- Veröffentlichung: fertige beauftragte Website-Änderungen direkt deployen,
  ohne zusätzliches OK. Isolierte Releases auf aktuellem origin/main;
  unabhängige lokale Änderungen nicht pauschal übernehmen.

Gezielte Chromium-/WebKit-Prüfungen und Live-Dateivergleiche bestanden;
keine neue vollständige npm-test-Gesamtprüfung. Keine Worker-/D1-Änderungen oder
CMS-Schreiboperationen. Die bestehende, am Nutzer-iPad bestätigte Statuszeilen-
korrektur bleibt erhalten. Details und Grenzen: [Projektupdate](PROJEKTUPDATE.md),
[Übergabe](UEBERGABE.md), Release-Dateien v312–v320.

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

## Freigegebener Karussell-Standard für Home und Aktuell – 07.11.2026

Vom Nutzer einschließlich der Dialoggestaltung in v289 und der finalen
Karussellbewegung in v300 ausdrücklich bestätigt. v300 ist der verbindliche
Referenzstand; frühere Fade-Varianten sind durch diesen Stand ersetzt.
Dieser zusammengefasste Stand ist die Grundlage für weitere Erweiterungen;
die folgenden Release-Notizen dokumentieren die Entstehung.

- **Darstellung:** Home und Aktuell behalten ihre bestehende Gestaltung. Auf Home
  stehen alle Motive als bewegtes Kartenkarussell auf dunklem Hintergrund, mit
  weichem Tiefenwechsel: seit v300 bleiben alle Motive deckend; nur die
  Überlappungsreihenfolge wird auf einer persistenten Zeichenfläche überblendet.
  Keine temporären Bild-/Bühnenkopien, kein Null-Fade mit Wiederauftauchen.
  1600-ms-Bewegung; erstes Motiv priorisiert, ungeladene Karten verborgen,
  Bewegung erst mit dekodiertem Nachfolger.
  Die aktuelle News-Darstellung ist ebenfalls
  freigegeben: Karussell oben, Erläuterung darunter, Termine daneben. Keine
  Umstellung auf eine neue Quadrat-/Text-Anordnung in Aktuell.
- **Bedienung:** Bildkarten und Beschriftung öffnen die zugehörige Unterseite.
  Unten bleiben Beschriftung links, reduzierte weiße Lupe mittig und Pause rechts.
  Normale Ansicht berücksichtigt Maus-/Tastaturpause und reduzierte Bewegung.
- **Archiv-Identität:** Kopien eines Karussells aus Home/Aktuell erscheinen im
  Clubarchiv einmal; Quell-/Eintrags-IDs erkennen ältere Kopien, `articleId` neue.
  Alte Archivlinks bleiben erreichbar; beide Platzierungen bleiben bearbeitbar.
- **Touch und Bewegungspräferenz:** Touch-Fokus darf die Animation nicht anhalten.
  Tastaturfokus pausiert weiterhin. „Bewegung reduzieren“ sperrt Autostart, aber
  ausdrückliches Play bleibt verfügbar und wird ins Vollbild übernommen.
- **Verweildauer seit v296:** Foto-Diashow 3,4 s/Bild; bewegtes Karussell erster
  Start nach 3 s, danach 2,1 s Ruhezeit plus unveränderter 0,9-s-Übergang.
  Manuelles Blättern bleibt ohne Verzögerung.
- **Startwahl:** Pro Artikel automatischer Start oder zunächst ruhig mit Play.
  Admin-Radios auf Home/Aktuell; Kopieren und Verschieben übernehmen die Wahl.
  Standard für bestehende Artikel bleibt automatisch.
- **Vollbild:** Die Lupe öffnet eine bildschirmfüllende Dialogebene mit demselben
  bewegten, überblendenden Karussell. Bildstand und Pause werden übernommen;
  der Hintergrund pausiert. Escape oder Kreuz schließt, ein Bildklick führt zur
  normalen Unterseite. Beim Schließen kehren Bildstand/Pause zurück. Auch auf
  dem Handy nutzbar, mit größerem vorderem Motiv und sauberer Fokusführung.
- **Unterseite:** Großes manuelles Karussell, Miniaturen, Durchklicken und
  Bild-Großansicht; daneben drei bearbeitbare Textzeilen (Themenzeile, Haupttitel,
  Untertitel) und Begleittext, mobil untereinander. Kein zusätzlicher Sammlungskopf
  und keine Startseiten-Linkzeile; Rückweg über TFB-Logo bzw. Schließen-Steuerung.
  Optionaler Instagram-Link ergänzt den auf der Website sichtbaren Inhalt.
- **Inhalte:** Die Formate 4:5, 9:16, 16:9 und 5:4 sind vorgesehen. Originalbilder
  werden über den Admin gepflegt. Die erste Canva-/Instagram-Serie verwendet
  1080 × 1350 Pixel; weitere Seitenverhältnisse nur bei inhaltlichem Bedarf.
- **Admin:** In Aktuell stehen Termin hinzufügen, News hinzufügen und Karussell
  hinzufügen direkt oben. Zusatzformate bleiben unter Weitere Inhalte. Neue
  Aktuell-Karussells verwenden ein gemeinsames Formular für Übersicht/Detail;
  übernommene Home-Sammlungen behalten ihre getrennten Texte und Einträge.
- **Home-Reihenfolge (v290):** Werkzeuge in eigener Zeile über dem Beitrag.
  Reihenfolge ändern oder Position ändern öffnet eine kompakte Übersicht
  aller Elemente: Ziehen, Direktposition und Pfeile. Mehrere Umstellungen
  gemeinsam speichern; Abbrechen verwirft den Entwurf. Nummerierung und
  Bildseiten folgen automatisch, aktuelle Inhalte bleiben geschützt.
- **Kopieren und Verschieben:** Beide Aktionen funktionieren Home ↔ Aktuell.
  Verschieben entfernt die Quelle und übernimmt den Beitrag in einem gemeinsamen,
  revisionsgeschützten Speichervorgang auf die Zielseite. Kopieren erhält die
  Quelle und erstellt eine unabhängig bearbeitbare Inhaltskopie mit neuer ID.
  Bestehende Bilddateien werden wiederverwendet, nicht doppelt hochgeladen.
- **Platzierung und Historie:** Auf Home wird der übernommene Beitrag erstes Thema;
  Nummerierung und Bildseite folgen stets der aktuellen Reihenfolge (links,
  rechts, links …), auch nach Umordnen. Home erlaubt höchstens zehn Themen.
  In Aktuell bestimmt das Veröffentlichungsdatum die Position: News absteigend,
  Termine aufsteigend. Beiträge bleiben im Clubarchiv auffindbar; alte Home-,
  Aktuell- und Archiv-Adressen bleiben nach Umzügen nutzbar.
- **Gestaltung beibehalten:** Große rote Konturzahlen ohne Rahmen geben Home den
  Magazincharakter; etwas kleiner als ursprünglich, mit Luft zum Text. Linkbuttons
  mit zurückhaltendem Signature-Rot-Rahmen, schwarzen Beschriftungen und dezenten
  Ecken, ohne dekorative Icons/Pfeile. Im Übernahmedialog gleich breite Buttons,
  ausreichende Abstände, auf dem Handy untereinander. Auch Admin-Ansichten sind
  Teil des freigegebenen Gestaltungsanspruchs.

**Technischer Anknüpfungspunkt:** `assets/js/home-media.js` und
`assets/css/home-media.css` (Darstellung, Vollbild, Medieneditor),
`assets/js/newsroom.js` (Sortierung, Kopier-/Umzugsplan), `assets/js/site.js`
(Admin-Einstiege/Routen) und `assets/js/club-archive.js` (Archiv/alte Adressen).
Aktueller bestätigter Live-Stand v289, Commit
`1055f4b8356d454b5ddddff661db0d6c1a147e2e`. Nachweise und Detailprüfungen in den
Release-Notizen v286–v289; die Kerntests umfassen Vollbild/Pause/Escape,
bidirektionale Kopien/Umzüge, unabhängige Bearbeitung, Konflikte und Mobilansicht.

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


## Medien-Collagen für Home und Aktuell – Konzept bestätigt, 07.11.2026

Status: Nutzer hat das folgende Konzept bestätigt. Home und Aktuell bleiben
Konzept; die Chat-Ergänzung „Karussell“ wurde anschließend separat beauftragt
und auf ausdrücklichen Folgeauftrag live veröffentlicht; aktueller Stand v278.
Die bestehende Gestaltung von Home und Aktuell ausdrücklich beibehalten.

### Karussell-Bedienung – live v278, 07.11.2026

Auf Nutzerfeedback die unteren Pfeile als deutlich sichtbare farbige runde
44-Pixel-Schaltflächen mit kräftigen SVG-Pfeilen gestaltet. In der Großansicht
schaltet ein Klick auf das Foto zum nächsten Bild. Bilder, Pfeile, Tastatur und
Wischen laufen endlos vom letzten zum ersten und umgekehrt. Kein Autoplay.
Nach Wischen wird ein unmittelbar folgender Touch-Klick auf dem Foto abgefangen,
damit weder doppelt geschaltet noch versehentlich die Großansicht geöffnet wird.

Live-Quellstand `41a785ebed886dd4176ffdf3b23ed7602d5927c8`, Cache `tfb-kiosk-v278`.
[Pages-Lauf erfolgreich](https://github.com/calvinjohncamp/tfb-website/actions/runs/42342702358).
Frontend-Release auf Basis `9432a54` im isolierten Worktree
`/private/tmp/tfb-release-carousel-v278`. Kein Worker-Deployment, keine Migration,
keine Änderung am bereits vom Nutzer veröffentlichten Umkleide-Beitrag.
91 Fachtests sowie erweiterter Karussell-Browsertest bestanden; Desktop, Mobil
und Großansicht visuell geprüft. Fünf Live-Dateien bytegleich, Umlauf und fünf
aufeinanderfolgende Bildklicks im Live-Modul mit lokalen DOM-Testelementen geprüft.
Privates Quellarchiv in R2 registriert; Nachweise in `.private/release-v278/`.

### Chat-Karussell – live v277, 07.11.2026

Veröffentlicht und live geprüft: Quellstand
`e46e50994ed87e0dad098b0ad275b82558e4d609`, Cache `tfb-kiosk-v277`,
Worker `24b72482-3179-463c-92b6-70537712248d`.
[Erfolgreicher Pages-Lauf](https://github.com/calvinjohncamp/tfb-website/actions/runs/42341856985).
Isolierter Release-Worktree `/private/tmp/tfb-release-carousel-v277`, Basis
`39cc124`; ältere lokale Änderungen im Dropbox-Arbeitsordner erhalten.
Private D1-Sicherung, Quellarchiv und Nachweise in `.private/release-v277/`.
Quellarchiv in privatem R2 registriert. Fünf Live-Dateien bytegleich geprüft;
Live-Modul manuell mit rein lokalen DOM-Testelementen durchgeblättert, ohne
Autoplay und mit vollständigen Bildern. Geschützter Endpunkt anonym weiter 401.
Kein echter Beitrag angelegt; Nutzer veröffentlicht seinen Beitrag selbst.

In der vorhandenen Clubgeflüster-Maske „Schreib was“ erscheint nach Hinzufügen
mehrerer Fotos unter „Bilder anzeigen als“ zusätzlich „Karussell“. Bestehende
Auswahl Collage/Diashow und deren Voreinstellung bleiben erhalten. Karussells
zeigen Bilder vollständig, ohne automatische Wiedergabe; Bedienung über Pfeile,
Punkte, Wischgesten und Pfeiltasten/Home/End. Großansicht unterstützt dasselbe
manuelle Blättern. Gemeinsame Diashow-Texte sind in diesem Modus nicht angeboten;
fertige Canva-Seiten benötigen keine weitere Gestaltung im Chat.

`photoView: 'carousel'` wird lokal und im geschützten Worker gespeichert. Für
Live-Betrieb müssen deshalb Worker und Frontend gemeinsam aktualisiert werden;
keine Datenbankmigration nötig. Quelländerungen: site.js, chat-media.js/-css,
demo-backend.js und server/cloudflare/app-sync.mjs. Worker vor Frontend
veröffentlicht; keine bestehenden Chat-, Mitglieder- oder Inhaltsdaten geändert.

Prüfung: alle zehn App-Sync-Tests bestanden (einschließlich Gerätewechsel,
Bearbeiten und Wechsel zurück zur Collage). Neuer isolierter Browsertest
`npm run test:browser:chat-carousel`: Upload über echte Maske, Speichern/Reload,
vollständiges 4:5, kein Autoplay, Pfeile/Punkte/Tastatur, Großansicht, mobile
Wischgesten und Collage-/Diashow-Regressionsprüfung erfolgreich. Bestehender
Browsertest `node tools/test-browser-comments.mjs` ebenfalls erfolgreich.
Desktop-/Mobilansichten mit synthetischen Bildern visuell geprüft; nur künstliche
Test-Ursprünge und lokale/In-Memory-Daten verwendet.
Zusätzlich Release-Prüfung: acht Foto-Fachtests und vier Exporttests bestanden.
Breiter Fachlauf 90/91 bestanden; ältere Galerie-Erwartung in
`test-home-features.mjs` scheitert unverändert auch auf der Basis `39cc124`.
Dieser nachgewiesene Bestandsfehler wurde nicht mit dem Release vermischt.

Auf weiteren Nutzerauftrag veraltete Galerie-Testerwartung anschließend
bereinigt: Chat-Fotoaufruf öffnet das angeklickte Einzelbild; „Alle Fotos“ öffnet
die Übersicht. Test prüft jetzt beide Wege mit sechs unterschiedlichen Motiven,
Tastatur, Navigation und Wischgesten ohne doppeltes Weiterschalten. Alle 91
Fachtests bestanden. Repository-Korrektur `9432a54`, nur Test und Release-Doku;
keine Änderung der Live-Galerie und kein neuer Deploymentlauf. Live bleibt
Anwendungsstand `e46e509` / Cache v277.

- Im Home-Editor einen zusätzlichen Medien-Collagen-Baustein vorsehen. Er nutzt
  den bestehenden Aufbau von „Neues Thema“: Nummerierung, obere Überschrift,
  Hauptüberschrift, Unterüberschrift, kurzer Hinweistext und Button zur Unterseite.
  Die genaue Bedienbezeichnung ist bei Umsetzung festzulegen; „Medien-Collage
  hinzufügen“ unterscheidet die Funktion von der vorhandenen Fotocollage.
- In der bestehenden Bildfläche eine gestaltete Vorschau: ein Hauptmotiv im
  Vordergrund, weitere Motive leicht versetzt dahinter, dezente Schatten und
  passende vorhandene Rundungen. Gemeinsamer Einstieg über Bildfläche und Button;
  verdeckte Karten brauchen keine einzelnen Klickziele. Film-/Karussellsymbol
  und Beitragsanzahl nach Bedarf. Auch eine Sammlung mit nur einem Beitrag muss
  funktionieren; keine erfundenen oder mehrfach duplizierten Beiträge zum Füllen.
- Als Hintergrund ist warmes dunkles Anthrazit passend zur TFB-Farbwelt
  vorgeschlagen und konzeptionell akzeptiert; genaue Farbe und Ausarbeitung erst
  in der Vorschau festlegen. Von den beiden hellen App-Flächen abheben, Signature-
  Farbe sparsam einsetzen. Kein allgemeines Redesign und kein neuer Home-Feed.
- Unterseite in der vorhandenen Themenseiten-Gestaltung: geordnete Beiträge mit
  Titel, Datum, Begleittext und vollständig dargestellten Medien. Hochformate auf
  Desktop gegebenenfalls neben Text, Querformate breit; mobil untereinander.
  Anfangs alle vorhandenen Inhalte zeigen. Bei größerer Sammlung zunächst z. B.
  sechs Beiträge und „Alle N Beiträge anzeigen“ auf derselben Unterseite anbieten.
- Unter Aktuell im News-Editor denselben Inhaltstyp ergänzen, im bestehenden
  News-Aufbau. Sammlung nur einmal pflegen und auf Home und/oder Aktuell
  verwenden; Einstiegstexte dürfen je Platzierung unterschiedlich sein.
- Vier unterstützte Formate: 4:5 (1080 × 1350), 9:16 (1080 × 1920),
  16:9 (1920 × 1080), 5:4 (1350 × 1080). Vorschaumotiv separat wählbar;
  geöffnete Grafiken/Karussells/Filme im Originalverhältnis vollständig zeigen.
  Nicht jeden Beitrag in allen vier Formaten produzieren: Formate nach Bedarf.
- Inhalte auf der Website selbst zeigen. Optional ergänzender Link „Auf
  Instagram ansehen“ zum Originalbeitrag. Ein Instagram-Link ersetzt keine
  Website-Mediendatei. Kein Instagram-Import oder automatisches Posting vereinbart.
- Geplante Pflege: Sammlung mit Überschriften/Einleitung; pro Beitrag Titel,
  Datum, Text, Medien, Format, Vorschaumotiv, optional Instagram-Link; Reihenfolge
  und Hauptmotiv wählbar. Canva-Projekt und Produktionsoriginale erhalten.

### Nächster Schritt: erster Beitrag zum Padelprojekt

Fortschritt 07.11.2026: Nutzer beginnt mit den vorhandenen Signature-Orange-
Visualisierungen der Umkleide. Erste technische Ausschnittserie nach Sichtung
auf fünf Motive je Format bereinigt: Raum Spindwand, Raum Türwand, Duschen,
Bank mit weiterem Raumkontext und Bank mit dem originalen Umkleideregal
(zwei Schläger nebeneinander pro Reihe). Enge Waschplatz-/Spinddetails und die
beiden Varianten des separaten Kiosk-Regals verworfen. Keine Gegenstände oder
Blickwinkel neu generiert; ausschließlich Zuschnitt und Skalierung. Quellauflösung
begrenzt, keine echte Detailauflösung durch Vergrößern hinzugewonnen.
20 Ausgabe-PNGs, unskalierte Ausschnitte, vier Vorschauen und aktualisierte ZIP
liegen unter `04 Projektmaterial/Umkleide-Medien-2026-11-07` im Projektstamm.
Noch kein fertiger Canva-/Instagram-Beitrag und keine Website-Umsetzung.

Anschließend erste vierseitige 4:5-Instagram-Gestaltungsvorschau erstellt:
Raum Spindwand → Bank → Duschen → Bank mit originalem Umkleideregal.
1080 × 1350 PNGs, Gesamtübersicht, Begleittext und lokale HTML-Gestaltungsvorlage
liegen im Unterordner `Instagram-01-Umkleide` des genannten Medienordners.
Leitidee „Nach dem Match. Zeit zum Wohlfühlen.“; alle Seiten mit dezentem
Planungs-/Visualisierungshinweis. Originalbilder unverändert, Text und Verläufe
darübergelegt. Vorschau visuell und auf Maße/Textüberlauf geprüft. Noch kein
Canva-Dokument, keine Veröffentlichung auf Instagram oder Website.

Zweite Vorschau auf Nutzerwunsch unter `Instagram-01-Umkleide/Vorschau-02-frischer`:
vier 4:5-PNGs, Übersicht und Vorher-/Nachher-Vergleich der Bank. Dunkle Verläufe
reduziert und örtlicher auf Schriftbereiche begrenzt; Originalbilder unverändert.
Erste Vorschau zum Vergleich erhalten. Für den ersten Instagram-Karussellbeitrag
bleibt 4:5 der Produktionsstand; zusätzliche 9:16- oder Querformatfassungen noch
nicht beauftragt. Keine Apps oder Live-Inhalte geändert.

Dritte Vorschau nach expliziter Freigabe der Textreduktion unter
`Instagram-01-Umkleide/Vorschau-03-reduziert` erstellt: heller Bildstand bleibt,
links PADEL BIELSTEIN, rechts UNSERE SIGNATURE-UMKLEIDE. Zwischenüberschriften,
CTA-Frage, Wischhinweis, wiederholte Planungsfußzeile und orange Linie unter
der Überschrift entfernt. Kleine Seitenzahl linksbündig unter jedem Textblock.
Seite 1 Unterüberschrift „So könnte unsere neue Padel-Umkleide aussehen.“;
Seite 4 „Ein Ort zum Spielen und Wohlfühlen.“; Seite 2/3 nur Hauptüberschrift.
Vier 1080 × 1350 PNGs und Übersicht visuell sowie auf Textüberlauf geprüft.
Begleittext erklärt weiterhin den Entwurfs-/Planungscharakter. Frühere Versionen
erhalten; nichts veröffentlicht und keinen Website-Code geändert.

Abgestimmter Gestaltungsstand nach weiteren Nutzerkorrekturen:
`Instagram-01-Umkleide/Vorschau-06-abgestimmt` ist der aktuelle Entwurf.
Kopfzeilen PADEL BIELSTEIN und UNSERE SIGNATURE-UMKLEIDE stehen auf derselben
Schriftgrundlinie. Keine Seitenzahlen. Ursprüngliche Akzentlinie (60 × 4 px,
#ff782e, 27 px Abstand nach oben) ausschließlich unter vorhandenen
Unterüberschriften, also auf Seite 1 und 4; Seite 2/3 ohne Linie. Frischere
Bildwirkung und reduzierte Texte beibehalten. Nutzer bestätigt, dass diese
Gestaltung zur TFB-Website passt. Vier PNGs 1080 × 1350, Übersicht, Begleittext
und lokale HTML-Vorlage vorhanden; visuell, Textgrenzen und Kopfzeilen-Grundlinie
geprüft. Noch keine Veröffentlichung oder Canva-Übertragung.

Canva-Übertragung anschließend auf Nutzerauftrag abgeschlossen. Verbindliche
Mastervorlage: `DAHaNA3klN8`, Titel „MASTER · Padel Bielstein · Instagram 4:5 ·
Umkleide“, Bearbeiten: https://www.canva.com/d/u0bPug-oCc_bA2u . Vier Seiten
1080 × 1350; einzelne Textfelder und Fotoebenen auf allen Seiten als bearbeitbar
geprüft, vier Canva-Vorschauen visuell kontrolliert. HTML-Import musste volle
Schriftnamen „Bricolage Grotesque“ / „DM Sans“ statt interner Aliase und explizite
Kopfzeilenpositionen erhalten. Vorheriger Testimport `DAHaNMKU0eU` ist nicht die
verbindliche Vorlage. Reine Prüftransaktionen jeweils ohne Änderungen geschlossen.
Unter `Instagram-01-Umkleide/Canva-Vorlage` liegen .webloc, Anleitung, Importquelle,
Referenz und echte Canva-Seitenvorschauen. Normales Masterdesign: für neue Beiträge
zuerst kopieren, dann Fotos/Texte austauschen; keine veröffentlichte Brand Template.
Keine Instagram- oder Website-Veröffentlichung.

Es gibt noch keine fertigen Beiträge. Nutzer besitzt bereits selbst erstellte
Bilder, die das geplante Padelkonzept simulieren. Daraus zuerst einen attraktiven
Auftakt entwickeln, der Lust auf das Projekt macht. Die Bilder liegen noch nicht
in den passenden Formaten vor; bei Sichtung, Auswahl, Reihenfolge, Formatadaption
und Text unterstützen. Die drei angehängten App-/Collagenreferenzen dieses Chats
sind Gestaltungsbeispiele, nicht die Padel-Projektbilder.

Empfohlener Einstieg: ein 4:5-Bildkarussell (1080 × 1350) aus geeigneten vorhandenen
Motiven, mit Titelmotiv und kurzem Begleittext. Endgültige Seitenzahl und Zuschnitte
erst nach Sichtung der Originalbilder festlegen. Simulationen als Entwurf bzw.
Visualisierung erkennbar halten; keine bereits gebauten Anlagen suggerieren.
Weitere Formate nur nach Bedarf ableiten. Website-Ausbau später anhand dieses
ersten echten Beitrags konkretisieren. Fortsetzung kann auf diesen Abschnitt
verweisen. Mit diesem Auftrag ausschließlich Projektgedächtnis aktualisiert;
keinen Website-Code, keine Live-Inhalte oder Infrastruktur geändert.

## Home, Aktuell und Clubgeflüster – 06.11.2026, Abendstand

- Live-Website [joern-kaemper.de](https://joern-kaemper.de/). Der zuletzt
  verifizierte Programmstand ist `39cc124` mit Service-Worker-Cache
  `tfb-kiosk-v276`. Die [Übergabe](UEBERGABE.md) nennt Bedienwege und Prüfungen.
- Auf Home liegen „Look der Startseite“ und „Menü oben“ in einem gemeinsamen
  Rahmen. Im Bearbeiten-Modus gibt es oberhalb und unterhalb der Inhalte dieselbe
  kompakte Reihe „Neues Thema“, „Collage hinzufügen“, „Galerie hinzufügen“.
  Die Reihenfolge ist bewusst gewählt. Collagen zeigen Bilder in verschiedenen
  Größen, Galerien in gleichmäßigen Kacheln. Beide unterstützen bis zu 100 Fotos,
  Überschrift, Datum und optionalen Text.
- Wechselspiel, Klassisch und Magazin erscheinen beim Klick sofort in der
  Vorschau. Der gewählte Look wird im Hintergrund zentral gespeichert. Bei
  mehreren schnellen Klicks zählt die letzte Auswahl. Scheitert deren Speicherung,
  zeigt die Vorschau wieder den zuletzt bestätigten Look.
- Unter Aktuell beginnen News und Save the Date jeweils mit einem schwarzen
  Datumsfeld. Jedes zweite sichtbare Datumsfeld nutzt Signature Rot mit weißer
  Schrift oder Signature Gelb mit dunkler Schrift. Datierte Fotocollagen zählen
  in der News-Spalte mit.
- Der zweite News-Beitrag „50 Jahre Tennisfreunde Bielstein“ zeigt den vollständigen
  OVZ-Originalscan aus Dropbox. Der JPEG-Scan hat 4.549 × 4.000 Pixel und ist in
  der Großansicht verfügbar. Die Redaktion verweist aus D1 auf die unveränderte
  Datei in Cloudflare R2.
- Bei Chat-Kommentaren kann man mehrere Emojis nacheinander auswählen. Zwischen
  direkt aufeinanderfolgenden Emojis steht ein Leerzeichen. Für Touch-Geräte
  wurden die Videowiedergabe und die sichtbare Zuordnung der Antworten zum Beitrag
  überarbeitet.
- Die im Chat abgestimmte Splash-Formulierung ist als redaktioneller Text
  festgehalten. Eine Veröffentlichung dieses Wortlauts ist hier nicht bestätigt.
  „Wir spielen Tennis mit Freunden. Auf sechs Plätzen unter freiem Himmel.
  Und in Kürze kommen zwei Padel-Courts dazu.“

## Clubgeflüster und Startverhalten – 06.11.2026

- Früherer Website-Stand v271 vom selben Tag. Einstieg für die Fortsetzung
  ist die [aktuelle Übergabe](UEBERGABE.md). Der folgende Stand v233 dient als
  historischer Nachweis für Redaktion und Sicherungen.
- Clubgeflüster bleibt eigenständig. „Schreib was“ ist der gemeinsame Einstieg für
  normale Beiträge und gestaltete Medien. Fotos und Clips verwenden bei Bedarf
  4:5, 16:9 oder 9:16. Die Kommentare bleiben pro Desktop-Beitrag auf dessen Höhe
  begrenzt und scrollen separat. Home und Aktuell erhalten diese Medienfunktionen
  nur bei einem neuen Auftrag.
- Clips bis 30 Sekunden werden bei Bedarf im Browser auf höchstens 5 MiB gebracht.
  Die Gestaltung speichert Überschrift, Unterüberschrift, Typografie, Verlauf,
  Ausschnitt und Logo pro Medium. Nutzbar sind TFB Signature Rot, TFB Signature
  Gelb und Padel Bielstein. Die Vorschau und die Veröffentlichung rendern dieselbe
  Gestaltung über dem Medium.
- Pro Video-Textzeile kann die Sichtbarkeit zeitgesteuert werden. Standard ist
  „Immer sichtbar“. Der Editor liest die Dauer aus dem Video und akzeptiert
  Dezimalkomma für Ein- und Ausblendzeiten. Die drei Überblendstufen sind
  0,25, 0,6 und 1,2 Sekunden je Übergang, begrenzt auf die halbe Textdauer.
- Mehrere Fotos erscheinen standardmäßig als Collage. Im Beitragseditor lässt
  sich Diashow als Ansicht wählen. Lesende können über Play auch von der
  Collage aus in die Diashow wechseln. Die Fotos laufen sichtbar in Schleife,
  mit Play/Pause und einer Überblendung von rund 0,36 Sekunden. „Text für alle
  Bilder“ steuert Überschrift und Unterüberschrift über den gesamten Durchlauf.
  Die Gesamtdauer ergibt sich aus 2,4 Sekunden je Foto.
- Play unter der Collage öffnet die Diashow in der großen Betrachtungsansicht.
  Hoch- und Querformat werden dort vollständig eingepasst. Gemeinsamer Text
  bleibt auf einer festen Textfläche, individuelle Gestaltung folgt dem Foto.
- Die Filmleiste speichert Anfang, Ende und weiches Ein- und Ausblenden des
  Bildes pro Clip. Der Schnitt ist reversibel und ändert die gespeicherte
  Videodatei nicht. Textzeiten zählen ab dem gewählten Filmanfang.
- Veröffentlichte Clips erhalten in Sichtnähe aus dem geschützten Video ein
  Standbild etwa 0,3 Sekunden nach Beginn. Das gilt auch für vorhandene Beiträge
  ohne neue Veröffentlichung. Kein Autoplay. Die Wiedergabe beginnt beim Antippen
  am Anfang. Vorschaubilder entstehen im Browser und werden nicht dauerhaft
  gespeichert. Es gibt keinen neuen öffentlichen Medienzugriff.
- Bei Start und Neuladen wird die Splash-Entscheidung vor dem App-Rahmen
  umgesetzt. Reguläre Reloads zeigen die Einstiegsseite zuerst. Bestehende
  Ausnahmen für direkte Links und die Präsentationsansicht bleiben erhalten.
- Der Browser merkt sich die Anmeldung. Eine gültige Sitzung wird beim Öffnen
  der App höchstens einmal am Tag auf 30 Tage verlängert. Abmelden beendet die
  Sitzung. Bereits abgelaufene Sitzungen erfordern eine neue Anmeldung.

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

## 26.10.2026 · Diagnose redaktioneller Speicherung und Vorschlag v232

Nutzer meldet unterschiedliche Home-Reihenfolgen/Inhalte trotz iPhone-Neuinstallation.
Live-Code schreibgeschützt gegen lokalen Stand geprüft: v231, api.saveSite weiterhin
lokales db.site/localStorage, kein zentraler CMS-Adapter. Damit Unterschied erklärt;
Anmeldung/Kiosk/Chat/Planung und Partner/Splash sind davon getrennt bereits zentral.

Auf Folgeauftrag zentrale Redaktion und Apple-artige Snapshot-Wiederherstellung
konzipiert. Bestehende lokale Komplett-JSON mit gemischten Daten und fortgeschriebener
Automatik reicht dafür nicht. Padel-Quellarchiv/Git-Bundle und Datenbank-/Medien-
Backuproutinen studiert, offizielle D1-/R2-Dokumentation überprüft. Vorschlag:
vorhandenes TFB-Worker/D1 erweitern, revisionsgesicherte Seiten und zentrale Medien,
Inhaltssnapshots getrennt von Programmrelease und vollständigem Betriebsbackup.
JSON-Manifest plus mitgelieferte Medien/Quellarchiv als portables Paket, optional
kleine Ein-Datei-JSON. Wiederherstellung mit Vorschau und vorherigem Sicherheitsstand,
keine Rücksetzung anderer Bereiche. Kompakter Adminbereich und klare Redaktionsrechte.
Ausführlicher Vorschlag/Umsetzungsreihenfolge in UEBERGABE.md am Dateiende.

Nur Konzept dokumentiert, keine echte aktuelle Desktop-Sicherung erstellt und keine
neue Migration, Automation, Dienstanmeldung, Messung oder Mailversand aktiviert.
Live bleibt v231. Erste notwendige Quelle bei Umsetzung: neuester Desktop-Browser-
stand einschließlich Bilder/Anhänge/Look, nicht bloß veröffentlichter Startbestand.


## 08.11.2026 · Direkte Veröffentlichung

Nutzerwunsch: Fertige Website-Änderungen immer direkt deployen, ohne zusätzliche OK-Abfrage. Veröffentlichungen weiter isoliert auf dem aktuellen Live-Quellstand vorbereiten.
