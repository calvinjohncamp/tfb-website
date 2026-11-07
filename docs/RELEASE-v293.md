# Chat: Medienauswahl und Videos – v293

Die direkt anklickbaren Anzeigearten stehen in der Reihenfolge Collage,
Diashow, Karussell. Neue Fotobeiträge beginnen mit Collage. Bestehende
Fotobeiträge behalten beim Bearbeiten ihre gespeicherte Anzeigeart.

Sobald ein Video enthalten ist, auch in gemischten Foto-/Video-Beiträgen,
bleiben die drei Optionen sichtbar, aber Collage und Diashow sind deaktiviert
und optisch zurückgenommen. Karussell ist ausgewählt und wird auch so gespeichert.
Videos behalten ihren eigenen Play-Start. Beim Entfernen des letzten Videos
werden die Fotooptionen wieder aktiv; eine zuvor bewusst gewählte Fotoanzeige
wird im selben Entwurf wiederhergestellt, andernfalls gilt Collage.
Hoch-/Querformat und der bestehende Videoimport werden nicht verändert.

Validierung: bestehender Chat-Karussell-Browsertest inklusive neuer Reihenfolge,
Tastatursteuerung, Collage-Standard, Speichern/Neuladen und bisherigen Darstellungen.
Neuer Browsercheck: Hoch- und Querformatvideo, deaktivierte Fotooptionen,
Karussell-Speicherung und Wechsel Foto → gemischt → Foto. Der unveränderte
Videokonverter wird im neuen UI-Test durch einen synthetischen Import ersetzt;
keine Produktionsdaten werden für diese Schreibtests verwendet.
