# Admin-Aufrufe wie alle anderen zählen – v328

Auf ausdrücklichen Nutzerwunsch ist die Admin-Ausnahme aus der Clubstatistik
vollständig entfernt: Frontend sendet normale Seitenaufrufe von Admins;
öffentlicher Worker-Endpunkt und Aggregation verwerfen diese nicht mehr.
Admin-Konten gehen auch in die Kennzahl unterschiedlicher aktiver Mitglieder ein.
Sichtbare oder ausgeblendete Admin-Werkzeuge beeinflussen die Zählung nicht.
Statistiktexte/Methodik entsprechend angepasst; Service Worker v328.

Freiwillige Statistikfreigabe, DNT/GPC, Botfilter, Editor-/Präsentationsausschluss,
Monats-/Besuchsdeduplizierung, Pseudonymisierung und Zugriffsschutz bleiben erhalten.
Interne Admin-/Statistikseiten haben weiterhin keine öffentliche Seitenkategorie;
gezählt werden normale Websitebereiche, keine automatischen Datenaktualisierungen.
Keine rückwirkende Erfindung vorher ausgeschlossener Aufrufe, keine Migration.

Vier gezielte Servertests sowie Chromium-/WebKit-Browserprüfungen bestanden:
Admin tatsächlich als Seitenaufruf, Besucher/Besuch und aktives Mitglied gezählt,
auch bei ausgeblendeten Werkzeugen. Bestehende Freigabe-/Widerrufs-, Quotienten-,
CSV-, Rollen- und Mobilbreitentests erfolgreich. Worker-Dry-Run bestanden.
