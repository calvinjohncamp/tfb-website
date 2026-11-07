# Favicon an App-Symbol angepasst – v301

Browser-Favicon verwendet exakt das bestehende App-Quellmotiv: schwarzes TFB ohne
Ball/Unterzeile auf hellem Hintergrund (#efefef). Quadratische, vollständig deckende
Ecken; keine eingebackene Rundung. PNG 64 × 64 und ICO 16/32/48/64/128/256 neu erzeugt.
Favicon-Quelle wird künftig im bestehenden Icon-Build mit demselben Motiv erzeugt.
Index und Präsentationsseite referenzieren PNG mit v301 gegen alten Browsercache;
Service-Worker-Cache v301. App-Icons und freigegebene Karussell-Version v300 unverändert.

Validierung: identische Quellbytes zum App-Motiv, vier deckende helle Ecken, dunkles
TFB, PNG-Größe und alle ICO-Größen geprüft; 64px-Bild visuell kontrolliert.
