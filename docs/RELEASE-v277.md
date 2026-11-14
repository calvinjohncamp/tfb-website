# Chat-Karussell v277 – 07.11.2026

Clubgeflüster: „Schreib was“ → mehrere Fotos hinzufügen → „Bilder anzeigen als“
→ „Karussell“. Vollständige Bilder ohne Autoplay, mit Pfeilen, Punkten,
Tastatur, Wischgesten und Großansicht. Collage/Diashow bleiben verfügbar.

Der Worker erhält `photoView: 'carousel'` über Gerätewechsel und Bearbeitungen.
Kein Schemawechsel. Worker zuerst, danach Frontend veröffentlichen.
Home, Aktuell, vorhandene Inhalte und Benutzerbeiträge werden nicht verändert.

Release basiert auf dem veröffentlichten Stand 39cc124. Ältere lokale Änderungen
im ursprünglichen Dropbox-Arbeitsordner wurden nicht übernommen.

Prüfung: zehn App-Sync-Tests und acht Foto-Tests bestanden; isolierter
Karussell-Browsertest einschließlich Upload/Reload, vollständigem 4:5,
Autoplay-Abwesenheit, Navigation, Großansicht, Touch und bestehenden Modi
bestanden. Kommentar-Browsertest und vier Public-Export-Tests bestanden.
Breiter Fachlauf: 90/91 bestanden. Der ältere Test „chat gallery opens the whole
collage“ erwartet eine Collage statt Einzelbild nach Fotoaufruf; derselbe Fehler
ist auf unverändertem 39cc124 reproduziert. Nicht Teil dieses Releases.

Vor Veröffentlichung private D1-Sicherung und Worker-Versionsstand festgehalten.
Passendes Git-Quellarchiv für die redaktionelle Gesamtsicherung registrieren.
Keine echten Testbeiträge oder Mitgliedsdaten für die Funktionsprüfung anlegen.

## Veröffentlichung bestätigt

Live geprüft am 07.11.2026: Cache `tfb-kiosk-v277`, Quellstand
`e46e50994ed87e0dad098b0ad275b82558e4d609`, Worker-Version
`24b72482-3179-463c-92b6-70537712248d`.
[Erfolgreicher Pages-Lauf](https://github.com/calvinjohncamp/tfb-website/actions/runs/42341856985).
Fünf Live-Dateien bytegleich, Live-Karussell mit lokalen DOM-Testdaten geprüft,
geschützter Endpunkt anonym weiterhin 401. Kein Live-Beitrag angelegt.
Private D1-Sicherung, Quellarchiv und Nachweise unter `.private/release-v277/`.

## Veraltete Galerieprüfung anschließend bereinigt

Nur Test und Dokumentation korrigiert, Repository-Commit `9432a54`.
Direkter Einstieg beim angeklickten Foto sowie „Alle Fotos“, Motivauswahl,
Tastatur, Pfeile und Wischen werden geprüft. Alle 91 Fachtests bestanden.
Live-Anwendungsstand bleibt e46e509 / v277; kein erneutes Deployment erforderlich.
