# Release v340

## Kalender-Abrechnung und leere Dublette bereinigt · v340 · 08.11.2026

Ersetzt die lange v339-Monatsliste: kompakter Kalender mit Jahresauswahl
(aktuelles Jahr vorausgewählt), zwölf Monatskacheln mit Betrag und Markierung
des laufenden Monats. Künftige Monate deaktiviert. Jahresbetrag im Kopf, Heute
als Schnellzugriff. Monatsklick zeigt Tageskalender und gruppierte Buchungen;
Tag wählt nur dessen Käufe, Ganzer Monat setzt zurück. Übersicht-Button erhält
die Jahres- und Mitgliedsauswahl. Vorjahre bei vorhandenen Daten auswählbar.

Admin: Alle Mitglieder voreingestellt, zusätzlich sofortige Namenssuche neben
der Auswahl (Teiltext, Groß-/Kleinschreibung und Umlaute normalisiert;
Tastaturauswahl über Pfeil/Enter, Escape schließt). Ausgewählter Name fett im
Signature-Kopf. Bei Einzelmitglied entfällt der wiederholte Name am Kauf,
in der Clubgesamtansicht bleibt die Zuordnung sichtbar. Datum/Uhrzeit inline
hinter dem Artikel; Details weiterhin aufklappbar. Persönliche Abrechnung nutzt
denselben Kalender. Blau/Gelb bzw. Signature-Rot/Weiß für Kalender und Rückweg.

Explizit beauftragte Live-Datenbereinigung: Der zweite Jörn-Kämper-Eintrag war
bereits inaktiv, ohne Login, Käufe, Abrechnungen, App-Datensätze, Sessions,
Zugriffsmetadaten oder Teams. Nach lokaler Sicherung und bedingter Löschung
wurde genau dieser eine leere Datensatz entfernt. Aktiver Adminzugang und seine
49 Kiosk-Einträge danach unverändert bestätigt. Keine Buchung gelöscht,
keine Zusammenlegung von Finanzdaten, kein Zahlungs-/Mailaufruf. Keine Migration
oder Backendänderung erforderlich. Die Importlogik aus v324 ordnet bereits nach
eindeutigem Name/E-Mail-Paar zu; eine fehlende Mitgliedsnummer erzeugt dort kein
neues Konto. Cloudflare-Lesezugriff funktionierte mit automatischer
Kontoerkennung; keine gespeicherte Konfiguration oder Zugangsdaten geändert.

Chromium/WebKit: Mitgliedersuche und Abwahl, persönliche/Clubansicht,
Jahreswechsel mit historischem Kauf, Monats-/Tagesfilter, Signature-Farbwerte,
Korrekturen, CSV, Monatsarchive und 320–1440px geprüft. Admin-Rollenprüfung
unverändert erfolgreich. Vorführbetrieb und alle Käufe bleiben erhalten.
Service Worker v340.

Veröffentlicht: Commit c4965aa; Pages-Workflow 42510053340 erfolgreich.
Live-JavaScript mit Suche/Jahres-/Tageskalender und Service Worker v340
auf joern-kaemper.de nach Veröffentlichung bestätigt.
