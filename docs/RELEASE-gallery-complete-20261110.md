# Vollständige Galerien und einheitliche Adminbuttons · 10.11.2026

Adminmenü: aktive Seitenaktionen jetzt in beiden Farbwelten Schwarz #171717 mit
weißer Schrift, entsprechend dem bestehenden Gestaltungsschalter. Letzte Aktion
Datensicherung / Time Machine behält die getrennte Position, wird in gelber Welt
Signature-Blau #001D3D und in roter Welt Signature-Rot #C4553A, jeweils weißer Text.
Höhe, Schriftgröße, Zeilenhöhe und Padding exakt wie übrige Adminbuttons (30px).
Keine mehrzeiligen Buttonbeschriftungen; nötiger Umbruch erfolgt zwischen Buttons.

Galerie: Jahrgangs-Pills öffnen jetzt #club/galerie/{jahr} ohne Albumfilter und
zeigen sämtliche Bilder des Jahres, jahresweit dedupliziert. Erste Unterpille
Alle Bilder kehrt zur vollständigen Jahresansicht zurück. Bestehende Albumlinks
/{jahr}/{nummer} bleiben gültig und zeigen sämtliche Bilder des jeweiligen Albums.
Nicht mehr auf fünf Vorschaubilder begrenzt, keine +N-Abdeckung und kein Mehr-Laden.
Ein dichtes responsives Mosaik mit 4/3/2 Spalten zeigt alle Thumbnail-Elemente;
Bilder außerhalb des sichtbaren Bereichs laden nativ lazy. Jeder Bildklick öffnet
das bestehende Vollbildalbum am korrekten Index. Tastatur/Weiter/Zurück bleiben.
Vorhandene Jahr-/Album-Pillfarben Blau/Gelb bzw. Rot/Schwarz erhalten.

Zwei Inventar-/Routingtests erfolgreich. Chromium/WebKit: vollständige 10 Jahre,
23 Albumfilter, 1935 Jahresbilder sowie 1935 Album-Bilder; alle DOM-Elemente
vorhanden, auch Foto 617/617 im Jahr 2023 korrekt geöffnet und zurückgeblättert.
320/390/834/1440px: erwartete 2/2/3/4 Rasterspalten, alle Bildflächen über 70px,
kein horizontaler Überlauf, Bilder lazy, beide Farbwelten unverändert.
Mobile/Desktop-Jahresansicht 2019 visuell geprüft. Ein ursprünglicher Versuch
zeigte mit alten globalen Collage-Spannweiten zu schmale Rasterzellen; die neue
Galerie setzt diese nun ausdrücklich zurück. Letzter vollständiger Browserlauf
beider Engines erfolgreich ohne Skriptfehler.
Vorhandene Admin-Menü-/Rollenprüfung beider Browser erfolgreich, um Messungen für
identische Höhen aller Adminbuttons und gewünschte Farben ergänzt.
Keine Backend-, Inhalts-, Mailversand- oder Mitgliederänderung.
Cache tfb-kiosk-gallery-complete-20261110-1.
