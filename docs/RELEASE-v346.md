# Release v346

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

