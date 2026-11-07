# Ruhigere Kartenübergänge und klare Wiedergabesymbole – v297

Home-/Aktuell-Karussells einschließlich Vollbild verwenden beim Wechsel der
vordersten Karte nur noch eine kurz ausblendende Kopie dieser einzelnen Karte.
Die bisher bei jeder Tiefensortierung geklonte komplette Bühne entfällt: Ihre
hinteren Karten konnten durchscheinen und die ursprüngliche Collage sichtbar
wieder aufbauen. Die übrigen Karten werden direkt und stabil sortiert; Positionen,
900-ms-Bewegung und längere Standzeiten bleiben erhalten. Noch nicht positionierte
Karten werden beim ersten Aufbau verborgen. Übergangskopie ist inert und wird
nach 360 ms sowie beim Abbau oder Wechsel der Bewegungseinstellung entfernt.

Play/Pause verwenden feste SVG-Symbole statt Schriftzeichen. Foto-Diashows haben
einen eigenen kompakten Button mit hellem Symbol auf dunklem Viewer-Hintergrund;
das generische helle Button-Styling entfällt dort. Home-/Aktuell-Steuerung und
Video-Overlays verwenden dieselben SVG-Formen. Unveränderte Wiedergabezustände
ersetzen das SVG nicht bei Fokusereignissen, damit Touch-/Mausklickziele erhalten
bleiben.

Der Nutzer hat den iPad-Autostart nach Abschalten von „Bewegung reduzieren“ und
App-Neustart bestätigt. Keine neue Autostart-Ausnahme oder Gerätespeicherung:
Systempräferenz bleibt berücksichtigt, explizites Play weiter möglich.

Validierung: Chromium und WebKit mit fünf farblich unterscheidbaren Testkarten,
Screenshot-Pixelprüfung der vordersten Karte, maximal einer einzelnen Übergangskopie
und keiner doppelten Bühne. Play/Pause-SVG, Kontrast und Klicks im Foto-Viewer.
Bestehende Home-Medien-, Chat-Karussell-, Vollbild-, Standzeit- und iPad-Touchtests.
WebKit ist Browser-Emulation; keine eigene Prüfung auf physischem iPad.
Nur Frontend-Veröffentlichung, keine CMS-Inhalte oder Serverdaten geändert.
