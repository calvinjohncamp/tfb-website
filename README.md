# TFB-Kiosk

Digitale Strichliste und Kiosk der Tennisfreunde Bielstein – als App auf dem Handy.

- Kiosk als Startseite, Shop-Bereich oben
- Persönlicher Bierdeckel, monatliche Abrechnung per SEPA-Lastschrift des Vereins
- Strichliste der letzten 7 Tage für eingeloggte Mitglieder
- Meine Abrechnungen: offener Monatsbetrag und abgeschlossene Monate
- Admin-Bereich: Produkte, Gestaltung, Mitgliederliste (Excel-Upload), Monatsabschluss

Eigenständiges Projekt, strikt getrennt von Padel Bielstein.
Mitgliederdaten gehören niemals in dieses Repository.

## Stand

Schritt 1 (Oberfläche im Demo-Modus) ist umgesetzt:

- Anmeldung per E-Mail aus der Mitgliederliste, Passwort beim ersten Mal festlegen
- Einmalige Zustimmung (Kioskordnung, Lastschrift, Sichtbarkeit der Strichliste)
- Kiosk als Startseite mit Bierdeckel, Vereinsshop-Vorschau („bald“) und Sortiment
- Anschreiben mit Anzahl (Runde), Rücknahme innerhalb von 60 Sekunden
- Strichliste: letzte 7 Kalendertage, alphabetisch nach Nachname, Fünferbündel
- Meine Abrechnungen: laufender Monat und abgeschlossene Monate
- Als App installierbar (Manifest, Service Worker, vorläufiges Symbol)

Im Demo-Modus liegen alle Daten nur im Browser des Geräts. Die gesamte
Datenhaltung läuft über `TFB.api` (`assets/js/demo-backend.js`); für Supabase
wird nur diese Schicht ersetzt.

## Lokal starten

```bash
python3 -m http.server 5180
```

Dann http://localhost:5180 öffnen. Demo-Zugang: `max@tfb-demo.de`
(Passwort beim ersten Mal frei wählen).

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Gerüst |
| `assets/js/config.js` | Vereinsdaten, Fristen, Einwilligungstext |
| `assets/js/demo-backend.js` | Datenschicht Demo-Modus inkl. Beispieldaten |
| `assets/js/art.js` | Gezeichnete Produktbilder und Striche |
| `assets/js/app.js` | Oberfläche und Abläufe |
| `assets/css/app.css` | Gestaltung |
| `sw.js`, `manifest.webmanifest` | Installation als App |

## Nächste Schritte

1. Admin-Bereich: Produkte und Gestaltung, Mitgliederliste per Excel-Upload,
   Monatsabschluss mit Export für den Kassenwart (Liste und SEPA-Datei)
2. Supabase-Projekt (sobald ein freier Platz da ist) und Veröffentlichung
   unter einer Subdomain von joern-kaemper.de
