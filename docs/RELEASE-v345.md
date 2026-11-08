# Release v345

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

Veröffentlicht: Commit a52dc9c, Pages-Workflow 42515227876 erfolgreich.
Live-Dateien mit Jahres-Pills, Null-Platzhaltern und Service Worker v345
auf joern-kaemper.de bestätigt.
