# Gelb/Blau und schließbare E-Mail-Vorschau – v302

Gelbe Farbwelt: aktive Navigation mit gelbem Unterstrich und neutraler Schrift,
ohne farbigen Flächenrahmen. Splash-Zweitzeile im Logo-Blau #001D3D. Dunkle
Datumsfelder in Logo-Blau mit durchgehend gelber Schrift; gelbe Datumsfelder
unter Aktuell mit blauer Schrift. Vorhandene Mannschaftsporträts/News erhalten
einen gelben Rahmen und schwarze Beschriftung, Zähler bleiben gelb mit blauer
Zahl. Clubarchiv gelb/blau, Beschriftungen gelber Aktionsbuttons auch bei Hover
blau. Verabreden-Kacheln mit blauer Beschriftung. Dabei-Status mit neutraler
Schrift und gelbem Rahmen, bestätigte Initialen gelb/blau.
Alle Farbregeln sind auf die gelbe Farbwelt begrenzt.

Die Muster-Mail öffnet sich innerhalb der App in einem Dialog mit Kreuz oben
rechts. Die responsive HTML-Ansicht stammt aus derselben Vorlage wie das
bisherige PDF, damit auch Browser ohne eingebetteten PDF-Betrachter die Mail
anzeigen. Kein echter Bestätigungslink. Kreuz, Hintergrund und Escape schließen;
der Fokus kehrt zum Auslöser zurück. PDF bleibt als Link-Fallback erhalten.
Service-Worker-Cache auf v302 angehoben; Vorschau und Logo offline aufgenommen.

Validierung: JavaScript-Syntaxprüfungen erfolgreich. Gezielte lokale Chromium-
Prüfung bei 390 und 1440 px: Aktuell, Sport, Club, Verabreden ohne horizontalen
Überlauf; berechnete Farben inklusive bedingter Sport-/Dabei-Zustände,
Navigation, Mail öffnen/schließen und Fokus-Rückkehr erfolgreich. Screenshots
von Aktuell, Club und geöffneter Mail visuell kontrolliert. Rückwechsel zur roten
Farbwelt geprüft. Vorhandener Test test-browser-design-preview.mjs scheitert
am nicht mehr vorhandenen Editor-Auslöser .home-tools [data-action="site-edit"].
Veröffentlichungspaket aus dem isolierten Live-Stand v301 erstellt.
Die gezielte Browserprüfung gegen dieses Paket besteht ebenfalls bei 390 und
1440 px; rote Bestandsfarbe #C4553A bleibt erhalten. Nur die neuen gelben Regeln
und der Maildialog ergänzen das bestehende öffentliche Stylesheet.

Live veröffentlicht am 07.11.2026: Commit 43bddb5f206e446ec8b7c7a05829a549ce611977.
GitHub Pages: https://github.com/calvinjohncamp/tfb-website/actions/runs/42400393672
Sechs geänderte Webdateien inklusive neuer Mailvorlage live bytegleich zum
Prüfpaket; Browserprüfung auf https://joern-kaemper.de/ bei 390/1440 px bestanden.
Nachweis: .private/release-v302/live-proof.json.
