# Produktpflege und Kiosk-Abrechnung im Vorführbetrieb – v337

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


D1-Time-Travel-Punkt vor Migration: 00000125-0000009e-0000511d-b4bdfab986d93a0d622d6665f0cef047. Kein Datenbankexport. Vorher: 308 Mitglieder, 147 App-Datensätze, 48 Vorführpositionen mit 16.550 Cent ursprünglichem Gesamtwert.
