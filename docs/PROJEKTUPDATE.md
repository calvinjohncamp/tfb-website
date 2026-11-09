# TFB – Projektupdate vom 09.11.2026

## Trainer-E-Mails in Signature-Farben · v364 · 09.11.2026

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


## Abgestimmter Zwischenstand · 08.11.2026 · live v349

Der Nutzer hat den aktuellen Zwischenstand ausdrücklich bestätigt. Maßgeblich
ist diese Zusammenfassung; die folgenden Release-Abschnitte dokumentieren den
Weg dorthin und enthalten teilweise inzwischen ersetzte Darstellungen.

- Schlanke, überall gleiche Admin-Leiste: kleine Welt-Auswahl, dreifacher
  Gruppenabstand, Splash, Home, Partner, Mitglieder, Statistik, Kiosk und
  Sicherungssymbol. Aktiver Bereich in Signature-Farben. App-Anleitung bleibt
  im Account; doppelte Kiosk-Verwaltungsbuttons sind entfernt.
- Clubweite Kiosk-Abrechnung direkt über Admin → Kiosk; persönliche Abrechnung
  getrennt im Account. Alle Mitglieder vorausgewählt, exakte Umlautsuche,
  E-Mail-Suche und deutsche Telefonbuch-Sortierung. Leere Kämper-Dublette
  entfernt, aktiver Zugang und Buchungen erhalten.
- Profilbilder/Initialen vor Namen; vorhandene Bilder per Klick oder Tastatur
  vergrößerbar. Suchfeld ohne Beispieltext.
- Zwei gleich große Kalender: links Jahr und zwölf Monatsbeträge, rechts der
  ausgewählte Monat mit vollem Namen und Tagesraster. Laufender Monat öffnet
  direkt; mobil untereinander. Umsatz-Tage sind farbig unterstrichen.
- Kompakte Buchungszeilen, älteste Buchung zuerst. Rücknahmen/Korrekturen zeigen
  Buchungsperson, handelnde Person, Zeitpunkt und Grund. Technische Metadaten
  sind im Admin separat aufklappbar; fehlende alte Kategorien werden nicht
  als Warnung dargestellt oder aus heutigen Produktdaten rekonstruiert.
- Sichtbare Vorjahres-Pills. Vorjahr öffnet Jahresabschluss mit zwölf Monaten,
  ohne Heute und ohne rechten Monatskalender; Monat bleibt gezielt anwählbar.
  Großer Jahresbetrag in der roten Welt schwarz, in der gelben Welt gelb.
- Drei CSV-Wege: Monat, Jahr kumuliert bis gewähltes Monatsende/heute,
  Jahresabschluss ab 31.12. Jahresabschluss-CSV: Auswahl/Datenstand, zwölf
  Monatswerte, Jahressumme, danach chronologische Buchungen/Korrekturen.

Live-Stand: Code-Commit `5517800`, Dokumentationsnachweis `6a2d4fc`,
Service Worker `tfb-kiosk-v349`, Veröffentlichung [42517049131](https://github.com/calvinjohncamp/tfb-website/actions/runs/42517049131)
erfolgreich und Live-Dateien bestätigt. Chromium/WebKit und vier gezielte
Exportprüfungen erfolgreich. Es gab keine Aktivierung von Zahlungen oder
Löschung von Vorführbuchungen. Diese Abschlussaktualisierung ändert nur die
Dokumentation, nicht den bestätigten Live-Code.

Offen bleiben die Finanzwart-/Vorstandsabstimmung zum echten Einzug, der später
explizit festzulegende Stichtag X und ein künftiger kumulierter Mehrjahresvergleich.
Details und Fortsetzungsregeln stehen am Anfang von Projektgedächtnis/Übergabe.


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

Der Nutzer bestätigt den Abschluss mit „Alles super“. Alle in dieser Sitzung
beauftragten Website-Änderungen sind veröffentlicht. Es sind daraus keine offenen
Umsetzungsaufgaben bekannt. Die folgenden Angaben beschreiben den Endstand und
haben Vorrang vor älteren Farbversuchen und Release-Zwischenständen.

## Verifizierter Live-Stand

Website: [joern-kaemper.de](https://joern-kaemper.de/). Programm-/Cachestand v320,
Service Worker `tfb-kiosk-v320`, Live-Code `81b0a6d08cbd684019ca86c244e149fe69db3096`.
[Pages-Lauf 42457537738](https://github.com/calvinjohncamp/tfb-website/actions/runs/42457537738) erfolgreich; zuletzt geänderte CSS-Datei und Service Worker
live bytegleich mit dem geprüften Release. Die Dokumentationsaktualisierung
ändert diesen Website-Stand nicht.

## Abgestimmte Gestaltung

| Bereich | Gelbe Welt | Rote Welt |
| --- | --- | --- |
| Datumsfelder unter Aktuell, News und Save the Date | Signature-Blau #001D3D, Schrift Signature-Gelb #FFC300 | Signature-Rot #C4553A, Schrift Weiß #FFFFFF |
| Bierdeckel: Name | Signature-Blau, klein und unten zentriert | Schwarz #171717, gleiche Größe und Position |
| Bierdeckel: übrige Texte | Bisherige Gestaltung | Sämtliche Texte Schwarz #171717, einschließlich Betrag, Datum und Abrechnungshinweis |
| Bierdeckel: Ball und Striche | Signature-Gelb | Signature-Rot |
| Karussell-Zurück-/Weiterkreise | Transparente Fläche, gelbe Kontur | Transparente Fläche, rote Kontur |
| Aktive Karussell-Seitenanzeige | Gelb | Rot |
| TFB-Absenderlogo im Chat | Signature-Blau | Signature-Rot |

Der Bierdeckel zeigt Vor- und Nachnamen des angemeldeten Mitglieds in dezenter
Schrift. Lange Namen dürfen auf zwei Zeilen umbrechen. In Rot steht der
Abrechnungshinweis mit voller Deckkraft, damit auch er schwarz erscheint.
Das TFB-Absenderlogo folgt der Welt sofort, auch in bestehenden Beiträgen,
Kommentaren, Übersichten und der Absenderauswahl. Persönliche Avatare bleiben
unverändert. Keine Änderungen an Autorendaten oder Berechtigungen.

## Clubarchiv

- Der vollständige Bericht „Gemeinsam Leben retten – Defibrillator bei den
  Tennisfreunden Bielstein“ ist mit allen acht Originalabsätzen und Bild enthalten:
  [Bericht öffnen](https://joern-kaemper.de/#club/archiv/beitrag/start-defibrillator).
- Einordnung 28.10.2026: Bild-Upload und letzte Änderung der alten Startseite
  liegen an diesem Tag. Ein separates Beitragsdatum ist nicht vorhanden; die
  Herleitung ist im Archivdatensatz dokumentiert. Der Nutzer hat inzwischen
  bestätigt, dass der Bericht bei ihm erschienen ist.
- Das Foto liegt eigenständig im öffentlichen Paket unter
  `assets/clubarchiv/defibrillator-2026-10.webp`.
- Kein „Save the Date“, keine Terminspalte und kein News-/Terminumschalter im
  Clubarchiv. Der Beitragsstrom ist einspaltig, bis maximal 900px breit. Bereits
  vorhandene historische Termin-Detailadressen bleiben lesbar.
- Der Archivbestand wird mit Versionsparameter und `cache: no-cache` geladen;
  auch der Service Worker revalidiert ihn. Ein Client-Cache war eine plausible,
  nicht auf dem Nutzergerät nachgewiesene Ursache der verzögerten Sichtbarkeit.

## Prüfung und Veröffentlichungen

Die Änderungen wurden gezielt in Chromium und WebKit geprüft: beide Welten,
Handy/Tablet/Desktop, Datumsfelder bei 390/834/1440px; Bierdeckel zusätzlich bei
320px mit normalem/langem Namen und vielen Strichen. Archiv samt Bild und
Absenderdarstellung wurden im Browser geprüft; keine beobachteten Browserfehler
oder Überläufe. Keine neue vollständige npm-test-Gesamtprüfung dieser Sitzung.
Release-Details stehen in [v312](RELEASE-v312.md) bis [v320](RELEASE-v320.md).
Die zuletzt erprobte schwarze Datumsschrift auf Rot (v318) wurde mit v320
zugunsten weißer Schrift verworfen. Schwarze Bierdeckeltexte aus v319 bleiben.

## Vereinbarte Arbeitsweise

Fertige beauftragte Website-Änderungen immer direkt veröffentlichen; kein
zusätzliches OK zum Deployment erfragen. Releases isoliert auf dem aktuellen
`origin/main` vorbereiten und nur die beauftragten Änderungen übernehmen.
Die Dropbox-Arbeitskopie enthält zahlreiche andere Änderungen und ist kein
pauschal freigegebenes Veröffentlichungspaket. Diese Sitzung änderte Frontend
und statische Archivdaten; keine Worker-/D1-Migration oder CMS-Schreiboperation.

Weiterführend: [Projektgedächtnis](PROJEKTGEDAECHTNIS.md) und
[Übergabe](UEBERGABE.md).
