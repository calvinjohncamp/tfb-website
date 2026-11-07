# Home-Karussell v283 – 07.11.2026

Der Tiefenwechsel der rotierenden Home-Bilder erhält eine Überblendung über
360 ms. Stabile Tiefenränge ersetzen gerundete Z-Werte; eine kurzlebige,
nicht interaktive Ebene überblendet die bisherige Reihenfolge. Pause,
reduzierte Bewegung und Aufräumen beim Seitenwechsel bleiben berücksichtigt.

Der Hinweis „Bildseiten entdecken ↗“ entfällt auf der Bildfläche. Linke
Beitragsbeschriftung und Pause bleiben erhalten, alle Bildkarten bleiben Links.
Die Unterseite beginnt direkt mit dem größeren Karussell links und dem
Beitrag rechts. Der zusätzliche Sammlungskopf entfällt. Obere Themenzeile,
Hauptüberschrift, Unterüberschrift und Text lassen sich pro Beitrag pflegen;
bestehende Beiträge übernehmen zunächst die obere Themenzeile des Home-Themas.
Vorhandene CMS-Texte und Bilder werden bei dieser Veröffentlichung nicht geändert.

Geprüft: 91 Fachtests, Home-Browsertest (Editor, Upload, Speichern/Neuladen,
Navigation, Großansicht, mobile Ansicht, weitere Beiträge), zusätzlicher
Bewegungstest mit sechs beobachteten Tiefenwechseln: jeder überblendet,
höchstens eine Übergangsebene, keine zusätzlichen fokussierbaren Links.
Desktop-Bild und Text beginnen bündig; kein horizontaler Überlauf auf Mobil.
Frontend-Cache v283. Keine Änderung am Worker oder Datenbankschema.

Zusätzlich: Die automatische Links-/Rechts-Abfolge im Home-Look Wechselspiel
hat Vorrang vor alten Bild-rechts-Einstellungen. Bild 1 links, Bild 2 rechts
usw. folgen derselben aktuellen Reihenfolge wie die Nummerierung. Browserprüfung
mit gemischten alten Layouts, Umsortierung und neuem Beitrag an erster Stelle.
