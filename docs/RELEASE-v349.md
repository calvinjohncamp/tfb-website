# Release v349

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

