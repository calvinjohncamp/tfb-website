# Gemeinsamer Kiosk ab 09.11.2026

TFB und Padel laden dieselbe unveränderliche Kiosk-Version unter
`https://joern-kaemper.de/assets/shared-kiosk/20261109-shared-1/`.
Die bearbeitete gemeinsame Quelle liegt im Padel-Projekt unter
`01 Software/shared/club-kiosk`; der Ordner `assets/shared-kiosk` hier ist ein
Veröffentlichungsartefakt mit Hashmanifest. Änderungen am gemeinsamen Modul
nur dort bearbeiten und anschließend beide App-Einstiege auf dieselbe neue
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
