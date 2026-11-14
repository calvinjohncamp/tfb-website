# Home-Mediencollage v282 – 07.11.2026

Neuer Home-Themenbaustein mit bewegtem Kartenkarussell auf Anthrazit im
vorhandenen Home-Look. Alle Bilder des ersten Beitrags erscheinen als Karten;
Anordnung und Zählung folgen ihrer tatsächlichen Zahl. Jede Karte, Überschrift
und der Themenlink öffnen die Unterseite. Weicher elliptischer Umlauf nach
2 Sekunden, weitere Wechsel alle ca. 2 Sekunden. Pause-Schaltfläche,
Maus-/Tastaturpause, reduzierte Bewegung und Sichtbarkeit werden beachtet.
Entfernte Ansichten lösen Observer, Timer und Animations-Frames wieder auf.

Die Unterseite verwendet das bestehende manuelle Chat-Karussell inklusive
Großansicht, Tastatur, Wischen und Umlauf. Zusätzliche Miniaturen navigieren
zu den Bildern. Titel, Datum, Unterüberschrift, Text und optionaler externer
Instagram-Link je Beitrag. Bei mehr als sechs Beiträgen zunächst sechs,
dann Alle N Beiträge anzeigen. Bilder laden verzögert.

Admin: Medien-Collage hinzufügen im Home-Editor. Startseite und Beiträge
separat pflegen; Bilder/Beiträge umsortieren, hinzufügen und entfernen;
vier Formate 4:5, 9:16, 16:9, 5:4. Upload in Originalqualität bis 10 MB je Bild.
Normale Home-Themen und Chat unverändert. Sammlung liegt als mediaCollection
im bestehenden Feature-Block und wird über die vorhandene zentrale Redaktion
mit Revisionsschutz, Inhaltsständen und Medienzuordnung gespeichert.
Kein neues Schema, kein Worker-Deployment, keine neue Berechtigung.

Geprüft: 91 Fachtests, neuer Home-Browsertest mit Admin-Upload/Speichern/Reload,
Textänderung von der Unterseite, Rotation/reduzierte Bewegung, Kartenlinks,
Miniaturen/Großansicht, Mobilansicht und mehr als sechs Beiträgen. Bestehende
Browsertests der zentralen Redaktion (echter isolierter Worker, Konflikte,
Snapshot/Export/Import/Restore/offline) und Chat-Karussell erfolgreich.
Frontend-Cache v282. Freigegebenen Umkleidebeitrag erst nach Code-Veröffentlichung
über den normalen Adminbereich anlegen; andere Home-Inhalte erhalten.

Live-Abschluss: Commit eb30c292c0541cbde62e0bd23ed9089f7618763a, Pages-Lauf
42348456842 erfolgreich. Neuer Home-Block b-mw61khx5 über normalen
Admineditor mit Original-PNGs angelegt, CMS-Revision 36. Alle fünf Dateien
bytegleich zu den 1080×1350-Upload-PNGs, richtige Reihenfolge. Vorige fünf
Home-Blöcke identisch, andere CMS-Dokumentrevisionen unverändert. Live-Prüfung
Desktop/Mobil, Bewegung, Kartenziele, Miniaturen, Umlauf/Großansicht erfolgreich.
