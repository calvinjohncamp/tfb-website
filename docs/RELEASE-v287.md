# Karussell-Lupe und Übernahme in beide Richtungen – v287, 07.11.2026

Home-, Aktuell- und Archiv-Karussells erhalten unten eine reduzierte weiße Lupe,
zentriert zwischen Beschriftung und Pause. Sie öffnet das laufende Karussell in
einem nativen bildschirmfüllenden Dialog. Bildstand und expliziter Pause-Zustand
werden übernommen und beim Schließen zurückgegeben. Escape und Schließen-Kreuz
beenden die Ansicht; Bild-/Beschriftungsklick führt wie bisher zur Unterseite.
Kein Browser-Fullscreen-Recht nötig. Tastaturfokus bleibt im Dialog und kehrt zur
Lupe zurück. Hintergrundanimation pausiert, reduzierte Bewegung bleibt beachtet.
Dialog, Observer und Animationen werden bei Schließen/Navigation aufgeräumt.
Auf Hochformat-Bildschirmen erhält das vordere Motiv mehr Breite; normale
Home-/Aktuell-Anordnung bleibt erhalten. Einzelbilder ebenfalls vergrößerbar.

Admin: „Karussell kopieren / verschieben“ in Aktuell; im Home-Editor zusätzlich
„Karussell aus Aktuell übernehmen“ und je Karussell „Kopieren / verschieben“.
Die Auswahl bietet pro Quelle Nach Home/Aktuell verschieben sowie kopieren.
Verschieben speichert beide Seiten in einem revisionsgeschützten Commit.
Kopieren erhält die Quelle, erzeugt eine neue ID und tief kopierte Inhaltsdaten;
Bilder werden als bestehende Referenzen wiederverwendet. Beide Beiträge lassen
sich unabhängig bearbeiten. Ein Home-Ziel wird erstes Thema; Nummerierung und
Bildseitenfolge folgen automatisch. In Aktuell bestimmt das gewählte Datum die
Position. Zehn-Themen-Grenze auf Home bleibt erhalten. Alte Home-/News- und
Archiv-Adressen bleiben bei Umzügen nutzbar. Keine automatischen Live-Umzüge.

Geprüft: 36 Fachtests inkl. bidirektionaler Übernahme/Kopien, unabhängiger
verschachtelter Daten, Platzgrenze und bestehender Worker-Transaktion/Konflikt.
Neue Browsertests für Vollbild (Bewegung, Pause/Bildstand, Escape/Fokus,
Hintergrundpause, mehrfaches Öffnen, Bildnavigation, reduzierte Bewegung,
Mobil, Navigation, Einzelbild) und bidirektionale Kopien/Umzüge inkl. echter
Editoränderung, Nummerierung und alter News-/Archiv-Links. Home- und Newsroom-
Regressionstests grün; rein lesende Vorschau mit echten Motiven geprüft.
Frontend-Cache v287. Kein Worker-/Schemawechsel und kein CMS-Schreibzugriff
bei Veröffentlichung. Quellarchiv-Upload weiterhin ohne neue Zustimmung ausgesetzt.
