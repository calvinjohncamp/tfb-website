# Release v358

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
