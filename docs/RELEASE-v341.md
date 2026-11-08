# Release v341

## Kompakte Verwaltung und quadratische Kalender · v341 · 08.11.2026

Globale Admin-Leiste verkleinert: Kühle/Warme Welt kompakter, daneben Splash,
Home, Partner, Mitglieder, Statistik, Kiosk und ein SVG-Sicherungssymbol mit
zugänglichem Namen/Tooltip Datensicherung. Bearbeiten-/Verwalten-Zusätze und
App-Anleitung entfernt; die Anleitung im Account bleibt. Eine Zeile bei
verfügbarem Platz, auf kleinen Displays natürliche Umbrüche. Kioskseite enthält
keine doppelte Kiosk-Abrechnungs-/Artikelarchiv-Leiste mehr. Artikelarchiv bleibt
innerhalb der Abrechnung unter Weitere Zeiträume und Verwaltung erreichbar.

Jahres- und Monatskalender sind gleich große quadratische Blätter im TFB-Look:
links große Jahreszahl, Jahressumme und zwölf typografische Monatsfelder in
3x4-Anordnung. Nach Monatswahl rechts derselbe Rahmen mit großem Monatsnamen,
Monatssumme und Tagesraster. Unter 761px untereinander. Vor der Auswahl wird nur
das Jahresblatt angezeigt. Signature-Blau/Gelb oder Rot/Weiß; ausgewählter
Monat und Tag bleiben hervorgehoben. Buchungen und Namensdarstellung erhalten.

Suche: nur zusammenhängende Teilzeichenfolgen, ohne Beachtung der Schreibweise;
Suchfeld ohne Browser-Autokorrektur. Zusätzlich wird auch die native
Mitgliedsauswahl auf Treffer eingeschränkt, solange ein Suchtext vorliegt.
Die gesamte Auswahl bleibt nach Löschen des Suchtextes wieder verfügbar.
Kiosk-Mitgliedsauswahl und Mitgliederverwaltung sortieren mit deutscher
Telefonbuch-Kollation: ä wie ae, daher Kämper vor Kaufmann.

Chromium/WebKit: KE/Jan mit gezielten passenden und unpassenden Testnamen,
Kämper/Kaufmann-Reihenfolge, Rollen, kompakte Admin-Leiste auf allen Bereichen,
Kalenderquadrate/-gleichheit nebeneinander bei 834/1440px sowie untereinander
bei 390px, Textbegrenzungen und mobile Überläufe geprüft. Abrechnungsabläufe,
Korrekturen, CSV und Archive weiter erfolgreich. Keine Backendänderung,
Migration, Datenbereinigung, echte Zahlung oder E-Mail in dieser Version.
Service Worker v341.

