# Karten bleiben beim Tiefenwechsel sichtbar – v300

Nutzer bestätigt den weicheren v299-Wechsel auf Desktop, bemängelt aber, dass die
zurückweichende Karte ganz verschwindet und wieder auftaucht. Das Null-Ausblenden
wird daher durch eine Überblendung der Überlappung ersetzt.

Alle echten Karten bleiben auf Deckkraft 1. Eine persistente Canvas-Fläche zeichnet
für jede Pose zwei vollständige, deckende Kartenreihenfolgen in wiederverwendbare
Offscreen-Puffer. Nur deren Überlappungsreihenfolge wird kontinuierlich gemischt.
Premultiplizierte additive Mischung statt Source-over verhindert das Durchscheinen
des Hintergrunds in gemeinsam bedeckten Bereichen. Frei liegende Kartenteile sind
in beiden Zuständen identisch und behalten ihre volle Farbe. Keine temporären
DOM-Bildkopien, kein Auf-/Abbau einer Collage bei jedem Wechsel. Sichtbarer Canvas
ist aria-hidden/pointer-events none; die ursprünglichen Linkkarten mit Labels,
Fokusrahmen, Positionen und Tiefenreihenfolge bleiben für Bedienung/Unterseiten
bestehen. Bildformat 4:5, bestehende Geometrie, 1,6-s-Bewegung und Ladeprüfung bleiben.
Canvas zeichnet nur dekodierte Motive, ein neues Bild löst sofort Neuzeichnung aus.
Auflösung bis DPR 2, maximal drei Millionen Pixel pro Fläche; Puffer werden bei
Größenänderung angepasst und beim Abbau freigegeben. Ohne 2D-Kontext bleiben die
normalen deckenden Linkkarten sichtbar. Zoom erhält seine eigene neue Zeichenfläche
anstatt einen kopierten Bitmap-Inhalt zu übernehmen.

Validierung Chromium/WebKit: Pixelvergleich aller fünf Ebenenwechsel in kleiner
Home-, News- und Zoomansicht, kontinuierlicher Übergang. Zusätzlicher Pixelnachweis
am freiliegenden linken Rand jeder zurückweichenden Karte: volle Motivfarbe am
Mittelpunkt, kein Null-Fade. Fünf echte Karten und genau eine persistente Zeichenfläche.
Bestehende Lade-, Render-, Home-, Vollbild-, Standzeit- und iPad-Touchprüfungen.
Physisches iPad weiterhin nur durch Nutzer prüfbar. Kein CMS-/Worker-Eingriff.
