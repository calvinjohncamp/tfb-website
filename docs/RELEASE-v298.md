# iPad: Ebenenwechsel ohne temporäre Bildkopien – v298

Der Nutzer meldet nach v297 weiterhin deutliches Flackern oben links im kleinen
Karussell auf dem echten iPad, während Vollbild funktioniert; zweimaliger Neustart
hat es nicht behoben. Die bisherige Emulation hat diesen Gerätefehler nicht erfasst.

Die Animation verwendet jetzt ausschließlich die vorhandenen Karten. Ihre Reihenfolge
wechselt einmal zur Mitte jedes Schritts; zurückweichende Karten blenden davor weich
aus und danach wieder ein. Beim Ebenenwechsel sind diese Karten transparent, sodass
kein sichtbarer harter Sprung entsteht. Keine geklonte Bühne, keine temporäre
Vordergrundkopie, kein Ein-/Aushängen von Bildern während der Animation. Zweidimensionale
Transformationen ersetzen translate3d; erzwungene Compositing-Hinweise entfallen.
Alle Motive sind in den Ruhepositionen vollständig deckend. Bildpositionen, Größen,
900-ms-Bewegung, Standzeiten, Autostart/Play und reduzierte Bewegung bleiben erhalten.
Dies gilt für Home, Aktuell und Vollbild.

Neuer Screenshot-Test mit fünf farblich unterscheidbaren Motiven prüft sämtliche fünf
Reihenfolgewechsel in kleinen Home-/News-Flächen und Vollbild. Pixelvergleich direkt
vor/nach dem Wechsel prüft visuelle Kontinuität; Bühne enthält dauerhaft genau fünf
Karten und keinerlei Übergangskopien. Erfolgreich in Chromium und WebKit bei Touch,
1024 × 1366 und doppelter Pixeldichte. Bestehende Render-, Home-, Zoom-, Standzeit-
und iPad-Autostarttests prüfen die übrige Bedienung. Eigene physische iPad-Prüfung
weiterhin nicht möglich; Rückmeldung des Nutzers bleibt dafür maßgeblich.

Nur Frontend und Cache v298, keine CMS-Änderung oder Worker-Veröffentlichung.
