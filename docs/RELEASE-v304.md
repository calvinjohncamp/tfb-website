# Freihand als einzige gelbe Textmarkierung – v304

Die bisherigen gelben Textunterstreichungen erscheinen als transparente
Freihand-Textmarkerfläche. Ein kleiner, statischer SVG-Pinselstrich wird als
nativer Hintergrund jeder einzelnen Inline-Textzeile gezeichnet. WebKit und
Chromium verwenden box-decoration-break: clone. Es gibt keine nachträglich
vermessenen oder absolut positionierten Markerflächen; der in der Entwurfsvorschau
sichtbare Versatz kann dadurch nicht entstehen. Absätze/Unterzeilen und Zitate
tragen die Fläche auf einem inneren Textspan, nicht auf dem gesamten Block.
Verschachtelte ältere/neue Auszeichnungen erzeugen keinen doppelten Farbauftrag.

Nur Freihand wird angeboten, keine Stilumschaltung. Bestehende Inhalte mit
Signaturfarbe sowie {hervorheben}…{/hervorheben} nutzen dieselbe Darstellung.
Der Editor heißt „Freihand hervorheben“, die Abschnittsauswahl
„Freihand-Markierung“. Schriftarten, Layout, Home-Nummern, Initialen und
Datums-/Clubbuttons bleiben erhalten. Chat, Dating und rote Farbwelt bleiben
visuell unverändert. Gelb umrahmte Home-/Detail-/News-/Mannschaftsbuttons tragen
Signature-Blau als Beschriftung; der Buchungslink auf der Unterseite erhält
ebenfalls den feinen gelben Rahmen. Kein CMS-/Datenbankeingriff.

Validierung: 24 Home-/Inhaltstests bestanden. Browserprüfung in Chromium und
WebKit bei 390, 768, 834 und 1024 px: Marker-Bild dekodierbar, Zeilenfragmente
mit nativer Hintergrundwiederholung, Padel-Unterzeile/Zitat/Textauszeichnungen,
Initiale, Buttonfarben, Schriftfamilien, Chat/Dating/Rot-Ansichten sowie
Editor-Speichern/Wiederöffnen bestanden. Screenshots visuell kontrolliert.
Zusätzliche lesende Vorschau mit den echten öffentlichen Inhalten bei 834 px
bestanden. Service-Worker-Cache v304; Marker-SVG im Offline-Paket.
