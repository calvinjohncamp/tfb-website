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

Zusätzliches Menü-/Aktuell-Finetuning aus derselben Freigabe:
- Gelbe Menülinie: ca. 8,6 px Abstand zur Textzeile in Hoch-/Querformat und am
  Desktop; rund 20 % weniger als der frühere gelbe iPad-Hochformat-Abstand.
- Beide aktiven Menüpunkte ohne Pill-Fläche oder Rahmen. Rot übernimmt in allen
  Ausrichtungen den bisherigen Desktop-Abstand von ca. 5 px. Klickflächen und
  Tastatur-Fokusringe bleiben erhalten.
- In Rot alle Datumsfelder schwarz (#171717) mit Weiß bei Zahl, Wochentag und
  Monat, ohne reduzierte Deckkraft. Gelbe Datumsfelder bleiben gelb/blau.
- Aktuell-Karussellüberschriften ohne Unterstreichung, auch bei Hover. In Rot
  Signature-Rot, in Gelb fett schwarz. Keine redaktionellen Texte geändert.

WebKit-Regressionsprüfung bei 390, 834, 1024, 1194, 1366 und 1440 px mit echten
Touch-/Ausrichtungs-Medienabfragen: Abstand, Pill-Entfall, Schrift-/Rahmenfarben,
Datumsfarben und Karussellüberschriften bestanden.
