# Langsame Überblendung und priorisiertes Laden – v299

Nutzer bestätigt: v298 beseitigt das Flackern auf dem echten iPad. Zurückweichendes
Bild verschwindet jedoch zu schnell. Zusätzlich erscheinen bei anfänglichen Downloads
zunächst leere dunkle Flächen/Bildrahmen.

Bewegungsdauer jetzt 1600 statt 900 ms. Die weiche Aus-/Einblendkurve erstreckt sich
über den ganzen Schritt statt nur einen kurzen Bereich um dessen Mitte. Ausgehende
Karten geben das nächste Motiv langsam frei, wechseln bei Deckkraft null ihre Ebene
und blenden im Hintergrund wieder ein. Keine temporären Bildkopien; Standzeiten
3 s beim ersten Start und 2,1 s zwischen Bewegungen sowie Foto-Diashow bleiben erhalten.
Der komplette Orbit-Zyklus wird durch die langsamere Bewegung entsprechend länger.

Erstes Coverbild eager + fetchpriority high statt lazy. Beim Laden des öffentlichen
CMS-Stands wird das erste Motiv der angeforderten Home-/Aktuell-Seite bereits vor
dem App-Rendering vorgeladen. Andere Motive bleiben lazy mit niedriger Priorität;
keine pauschale Vorladung sämtlicher Seiten. Karten ohne fertig dekodiertes Bild
bleiben verborgen (keine leeren Schattenrahmen). Autostart und weitere Schritte
warten auf das aktuelle und nächste dekodierte Bild; das erste Bild erscheint schon,
bevor die ganze Sammlung geladen ist. Downloads und Originaldateien unverändert:
die Umkleide enthält weiterhin fünf PNGs mit insgesamt rund 8,6 MB. Priorisierung
und Bereitschaftsprüfung ersetzen keine spätere Dateigrößenoptimierung; anfänglicher
Netzwerk-Download des ersten Motivs bleibt erforderlich. Kein Server-/CMS-Eingriff.

Validierung: künstlich verzögerte Bildantworten in Chromium/WebKit prüfen Priorität,
kein leerer Rahmen, frühe Einzelbildanzeige und Warten/Weiterlaufen bei langsamen
Nachfolgebildern. Screenshot-Vergleich aller Ebenenwechsel Home/News/Zoom weiterhin
kontinuierlich, Deckkraft 0,5 bereits bei einem Viertel des Schritts statt kurzem
Verschwinden. Bestehende Render-, Zoom-, Standzeit-, iPad-, Home- und zentrale
Redaktionschecks. Desktop-Tastaturfixture verwendet jetzt gültige Bilder statt
absichtlich ungültigem „x“, da ungeladene Karten korrekt verborgen bleiben.
