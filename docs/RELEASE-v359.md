# Release v359

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
