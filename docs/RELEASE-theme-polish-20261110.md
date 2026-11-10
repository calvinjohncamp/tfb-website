# Farbwelten, Club-Feinschliff und Platzordnung · 10.11.2026

Rote Welt: Clubarchiv-/Mitgliederinfos-Pills und aktive Open-Jahrespills in
Signature-Rot (#C4553A), aktive Open-Inhaltspills und Route planen in Schwarz
(#171717). Gelbe Welt unverändert Blau/Gelb (#001D3D/#FFC300). Gemeinsame
semantische CSS-Variablen richten alle diese Flächen nach der gewählten Farbwelt
aus; aktive Pillfarben auch bei Hover erhalten. Bestehende Details erhalten.

Mitgliederinfos-Pills als sauberes 2×2-Raster. Clubarchiv behält seine drei Pills.
Dezente Trennlinie zur Anfahrt; Route planen mit automatischer Inhaltsbreite und
14px-Ecken (also anders als die runden Pills), keine 50%-Breite mehr. Auf breiten
Bildschirmen Adresse links und Routenaktion rechts; auf Handys untereinander.

Sport: zusätzlicher nativer, deaktivierter Button Heimspiele TFB zwischen
Platzbelegung und Regelwerk. Ohne Link/Ziel/Unterseite, Tooltip Demnächst.
Fünf Spalten auf großen Bildschirmen, drei auf Handys, mindestens 44px Tippfläche.
Vorhandene vier Sportbereiche weiterhin nutzbar.

Ausschließlich die Platzordnung sprachlich überarbeitet, ausdrücklich vom Nutzer
beauftragt. Sechs Regeln jetzt in einheitlicher direkter Du-Form: Betritt,
Bewässere, Zieh, Mach, Stell/häng. Keine neue Regel ergänzt. Ursprünglicher
Quelltext/Original-PDF bleiben zur Nachvollziehbarkeit erhalten; autorisierte
Neufassung getrennt als approvedRevision in member-info-content.json dokumentiert.
PDF-Builder unterstützt gezielte Ausgabe einzelner Dokumente. Nur platzordnung
neu erzeugt und gegen freigegebene Textbasis geprüft, Poppler-Vorschau visuell
kontrolliert. Hausordnung, Regeln Spielbetrieb und Jugendkonzept vor/nachher
bytegleich mit HEAD verglichen, unverändert. Platzordnung weiterhin eine A4-Seite.
Nur deren PDF-Linkversion erneuert; übrige drei Links behalten ihren Stand.

Chromium und WebKit bei 320/390/834/1024/1440px, beide Farbwelten: korrekte Farben
und Hover, 2×2-Raster, Routenbutton unter 190px breit mit 14px-Radius, Sportreihenfolge,
deaktivierter Platzhalter ohne href, vorhandener Regelwerkbereich nutzbar,
kein horizontaler Seitenüberlauf und keine Skriptfehler. Farbwechselprüfung wartet
die bestehende 200ms-Buttonanimation ab. Desktop/Handy und neue PDF visuell geprüft.
Cache tfb-kiosk-theme-polish-20261110-1. Keine CMS-/Backend-/Finanzänderung.

Live veröffentlicht und geprüft: Commit 74198c8, erfolgreicher Pages-Lauf
42776285089. Zehn öffentliche Dateien einschließlich aller vier PDFs bytegleich
mit dem geprüften Veröffentlichungspaket. Chromium und WebKit live bei 390/1440px
in beiden Farbwelten erfolgreich: aktive Farben inklusive Hover, 2×2-Pills,
kompakte Anfahrt, korrekter deaktivierter Sport-Platzhalter, kein Überlauf oder
Skriptfehler. Live-Screenshots in output/TFB-Farbwelten-Club-live-*.png.
