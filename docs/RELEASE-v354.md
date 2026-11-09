# Release v354

## Klare Stornos und Tagesumsatz mit Bildvorschau · v354 · 09.11.2026

Die gemeinsame Admin-/Mitgliederansicht nennt den Bereich nun „Storno und
Korrekturen im Zeitraum“. Summenkarten: Umsatz ursprünglich, Storno / Korrekturen,
Tatsächlicher Umsatz. Selbst veranlasste 30-Sekunden-Stornos werden knapp mit
Betrag und gespeichertem Zeitpunkt gezeigt; keine importtechnischen Hinweise,
keine doppelte Person/Erfasserangabe. JPG ebenso: Storno −Betrag · Datum/Uhrzeit.
Historische Rohnotizen und Buchungsdaten bleiben unverändert gespeichert.
Bei Admin-Korrekturen bleiben Begründung und handelnde Person sichtbar.
CSV-Bezeichnungen entsprechend vereinheitlicht; bei Mitgliedsstornos keine
technischen Übernahmegründe oder doppelte Bearbeiterangabe exportieren.

Gesicherte Vorführabrechnungen aus der sichtbaren Abrechnung entfernt,
persönlichen zweiten Monatswähler entfernt. Gespeicherte Versionen, Journal,
Sicherung und Wiederherstellung nicht gelöscht oder verändert. Admin kann
weiter freie Zeiträume und Produktverwaltung nutzen; Kalender bleibt Monatswahl.

Tagesübersicht/Tagessumme heißen in der gemeinsamen Ansicht und im Bild
Tagesumsatz. JPG öffnet sofort in der Bildvorschau der App, ohne automatischen
Download. Explizit Bild speichern; Teilen nur bei unterstützter Dateifreigabe.
Keine Zusage, die native macOS-App Vorschau automatisch zu starten. CSV bleibt
Download. Bild lokal im Browser erzeugt, kein Upload oder automatisches Versenden.
Tastaturfokus umfasst Vorschauaktionen, Bildadresse beim Schließen freigegeben.
Profilbild nutzt denselben bereits gewählten Ausschnitt wie der Accountkreis,
nicht das unbeschnittene Original. Datenbild-Porträts im Vorstand zusätzlich
zentriert, feste Bilddateien mit eigenen Ausschnitten unverändert.

Bestehende rückwirkende Admin-Korrektur: Buchung öffnen → Korrektur erfassen.
Voller noch offener Betrag = vollständige Gutschrift; Teilbetrag = Reduzierung.
Ursprüngliche Buchung bleibt erhalten. Betragserhöhungen/weitere rückwirkende
Storno- und Korrekturregeln separat mit dem Nutzer besprechen; jetzt keine neue
Finanzlogik, Migration, Löschung oder echte Abbuchung eingeführt.

Prüfung: 8 Modell-/CSV-Tests, 19 Buchungs-/Fototests. Browserprüfung in Chromium
und WebKit mit Admin und Nicht-Admin: kein automatischer JPG-Download,
Bildvorschau, explizites Speichern, Tastaturbedienung, simuliertes Dateiteilen,
korrekter Fotoausschnitt statt Original, knappe Stornos, geschützte eigene
Abrechnung, responsive Kalender und bestehende Exporte. Historische Versionen
bleiben im Backend nachweisbar, obwohl der Abschnitt nicht mehr angezeigt wird.
Service Worker v354.

