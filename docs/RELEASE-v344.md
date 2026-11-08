# Release v344

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

Veröffentlicht: Commit b752671, Pages-Workflow 42514809422 erfolgreich.
Live-Dateien für Profilkreise, Suchfeld, Monatsbeträge und Service Worker v344
auf joern-kaemper.de bestätigt.
