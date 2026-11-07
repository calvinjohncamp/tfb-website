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
