# Release v342

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

