# Chat-Karussell v278 – 07.11.2026

Deutlichere Pfeile: farbige runde 44-Pixel-Schaltflächen mit kräftigen
SVG-Pfeilen, Hover-/Fokusdarstellung. In der Großansicht schaltet ein Klick auf
das Foto zum nächsten Bild. Pfeile, Tastatur und Wischgesten blättern endlos
weiter; vom letzten zum ersten Bild und umgekehrt. Kein Autoplay.

Nach einer Wischgeste wird ein unmittelbar folgender Touch-Klick auf das Foto
unterdrückt, damit nicht doppelt weitergeschaltet oder die Großansicht geöffnet
wird. Abgebrochene und Mehrfinger-Gesten setzen den Wischzustand zurück.

Nur Frontend: chat-media.js, chat-media.css und Service-Worker-Cache v278.
Kein Worker-Deployment, keine Migration oder Änderung gespeicherter Beiträge.
Bereits veröffentlichte Karussells erhalten die Bedienverbesserung automatisch.

Geprüft: 91 Fachtests, erweiterter isolierter Karussell-Browsertest mit Upload,
Reload, neun aufeinanderfolgenden Bildklicks, Umlauf in beide Richtungen,
Pfeiltasten, Vollbild, Wischen ohne Doppelklick, Collage und Diashow.
Desktop, Mobilansicht und Großansicht mit synthetischen Bildern visuell geprüft.
