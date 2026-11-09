# Release v352

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

