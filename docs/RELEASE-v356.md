# Release v356

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
