# Release v351

## Jahresabschluss erst nach Jahresende, sichtbar gesperrter Button · v351 · 09.11.2026

Nutzer hinterfragt Freigabe des Jahresabschlusses während des noch laufenden
Jahrs und Bedeutung des Korrekturstands. Geklärt: Export ist eine Datei zum
Downloadzeitpunkt; spätere berechtigte Gegenbuchungen können einen neuen
Export verändern, die bereits gespeicherte Datei bleibt unverändert.
Herunterladen selbst verändert oder sperrt keine Buchung. Kein neuer Auftrag
für buchhalterische Sperren, Zahlungsaktivierung oder Datenbereinigung.

Jahresabschluss-Button bleibt sichtbar, ist aber deutlich grau und deaktiviert.
Unter dem Button steht mobil/desktop sichtbar Ab 01.01.[Folgejahr] verfügbar;
für 2026 also 01.01.2027. Die bisherige Freigabe am 31.12. wurde ersetzt:
Auch am 31.12. bleibt das laufende Jahr gesperrt, erst ab 1. Januar folgt der
volle Jahresabschluss. UI und Exportplan erzwingen dieselbe Grenze anhand
des Berliner Tages aus dem Serverbericht. Vorjahre weiterhin sofort verfügbar.
Bis dahin steht Jahr kumuliert für den jeweiligen aktuellen Stand zur Verfügung.

Die dezente graue Sperrdarstellung gilt auch für einen nicht ausgewählten
Monat und während eines laufenden Exportabrufs. Aktive Exportbuttons und die
restliche Kalendergestaltung bleiben unverändert.

Vier Exportprüfungen inklusive 31.12.-Sperre und 01.01.-Freigabe bestanden.
Chromium/WebKit prüfen graue Darstellung, sichtbaren Verfügbarkeitshinweis,
aktuelle Sperre, aktivierte Vorjahre ohne Sperrhinweis und alle bisherigen
CSV-/Abrechnungsabläufe. Keine Backendänderung, Migration, Buchungsänderung
oder Bankaktion. Service Worker v351.

Veröffentlicht: Commit 3582393, Pages-Workflow 42570750828 erfolgreich.
Live-Dateien mit sichtbarem Sperrhinweis, 01.01.-Freigabe und Service Worker
v351 auf joern-kaemper.de bestätigt.
