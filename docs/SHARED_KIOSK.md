# Gemeinsamer Kiosk ab 09.11.2026

## Veröffentlichter Stand vom 13.11.2026

TFB-Commit `a236b41` ergänzte die Produktsymbol-Auswahl in der veröffentlichten
`assets/shared-kiosk/20261109-shared-1/kiosk.js`. Der TFB-Einstieg lädt die Datei
mit `?v=20261113-kiosk-signature`. Das lokale Padel-Template bindet denselben
Dateipfad ohne Query-Parameter ein. Der TFB-Adapter in `assets/js/app.js`
übergibt `signatureArt` mit den benannten Motiven und ihren Farben. Ohne
diese Option verwendet der gemeinsame Editor die bisherige Symbolauswahl.
JAKO-Sichtbarkeit, Produktbibliothek und ihre zusätzlichen Stile liegen im
TFB-Adapter beziehungsweise in separaten TFB-Dateien.

Die freigegebene TFB-Datei hat SHA-256
`9a6d5a55cba04b19aff1ec42ffc513a0ff173cdc399555e3742e35e85d102802`.
Die Padel-Quelle unter `01 Software/shared/club-kiosk/kiosk.js` und das
Manifest des Veröffentlichungsordners entsprechen weiterhin dem ursprünglichen
Hash `9ace9711943313ca61aeda1e721d137639ebdb9062cbd8aacce0690b5222606a`.
Für die nächste gemeinsame Veröffentlichung die freigegebene Änderung in
die Padel-Quelle übernehmen, ein neues Paket samt aktualisiertem Manifest
erzeugen und beide Einstiege mit ihrer jeweiligen Adapter-Konfiguration prüfen.
Fachlicher Stand und offene Key-Account-Abnahme im
[Projektgedächtnis](PROJEKTGEDAECHTNIS.md#gemeinsamer-kiosk-mit-padel).

## Ursprüngliche Paketstruktur vom 09.11.2026

Für TFB und Padel wurde ursprünglich dieselbe Kiosk-Version ausgeliefert unter
`https://joern-kaemper.de/assets/shared-kiosk/20261109-shared-1/`.
Die bearbeitete gemeinsame Quelle liegt im Padel-Projekt unter
`01 Software/shared/club-kiosk`; der Ordner `assets/shared-kiosk` hier ist ein
Veröffentlichungsartefakt mit Hashmanifest. Änderungen am gemeinsamen Modul
gehören in die gemeinsame Quelle. Danach beide App-Einstiege auf dieselbe neue
Versionskennung setzen. Der vorhandene TFB-Kiosk war die Extraktionsgrundlage.

`assets/js/app.js` enthält keine eigene Implementierung mehr für Bierdeckel,
Kacheln, Picker, Strichliste, Storno, Produkteditor und Monatsansichten. Die
kleinen bisherigen Art-/Billing-Dateien bleiben als Ladeanschlüsse für
zwischengespeicherte ältere HTML-Seiten erhalten. Export und Tagesbild werden
auf die gemeinsame Implementierung weitergeleitet.

Die Plattformanschlüsse bleiben getrennt: TFB-Anmeldung und Buchungsdienste
hier, Supabase-/Stripe-Anschluss im Padel-Projekt. Die Server bestimmen den
Tarif. TFB-Mitgliederkäufe aus beiden Eingängen stehen im persönlichen
TFB-Journal; ihre Herkunft `padel_app` bleibt erhalten. Externe Käufe werden
im Padel-Journal geführt. Padel-Kontoabfragen übertragen niemals TFB-Adminrechte.
Kalendertage und Strichlistenkategorien sind ebenfalls ein gemeinsames Modul.

Historische Journale, Belege und offene Zahlungsereignisse bleiben erhalten.
Technische Zahlungsfreigaben wurden bei dieser Umstellung nicht verändert.
Prüfungen und Veröffentlichungsnachweise liegen im Padel-Projekt unter
`output/shared-kiosk-20261109/`.
