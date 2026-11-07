# Themenabhängige Mailvorschau, History-Button und klare Hervorhebung – v306

History im Club verwendet einen dezenten Home-artigen Textbutton: transparent,
38 px Mindesthöhe, 1 px Rahmen, 8 px Radius, kein Pfeil und keine Markerfläche.
In Gelb ist der Rahmen gelb und die Schrift Signature-Blau; in Rot ist der Rahmen
Signature-Rot. Home-Artikelbuttons haben in Rot explizit den Rahmen #C4553A.
Archiv und Route planen behalten ihre stärkere Gestaltung.

Die Mitgliedsantrags-Muster-Mail wählt beim Öffnen anhand der aktiven Farbwelt
die passende statische Vorlage. Die rote Referenz bleibt bytegleich erhalten.
Die abgeleitete gelbe Variante zeigt das blau-gelbe Logo, gelbe Akzentlinie und
gelben Bestätigungsbutton mit blauer Schrift sowie eine blaue Überschrift.
Erzeugung: node tools/build-membership-mail-variants.mjs. Nur Vorschau, keine
Änderung am tatsächlichen Mailversand. Beide Vorlagen sind im Offline-Paket.

Im Editor gibt es einen gemeinsamen Hervorheben-Befehl: „Textmarker“ in Gelb,
„Rot“ in Rot. Doppelte alte Farb-/Marker-Werkzeuge entfallen. Alte Auszeichnungen
werden weiterhin gelesen; der gemeinsame Knopf erkennt sie auch als aktiv und
kann sie entfernen. Rote Hervorhebung bedeutet rote Schrift ohne Marker oder
Unterstreichung, auch für ältere {marker}-Auszeichnungen. Neue Hervorhebungen
werden nicht automatisch fett. Fett ist in beiden Farbwelten separat schaltbar.
Die vorhandenen beiden Hervorhebungen auf Home unter h-padel enthalten bereits
explizite Fettformatierung. Es wurden keine redaktionellen Daten geändert.

Validierung: 24 Inhaltstests bestanden. Isolierter Browser-Test in WebKit und
Chromium: Rahmen-/Textfarben, History in 390/834 px ohne Überlauf, beide Mail-
Varianten, Editor auf Home/Aktuell, unabhängiges Ein-/Ausschalten von Fett,
Speichern des Markups und ältere rote Markierungen geprüft. Service Worker v306.
