# Release v348

## Klare CSV-Exporte für Monat, kumuliertes Jahr und Jahresabschluss · v348 · 08.11.2026

Überflüssigen Jahresübersicht-Button unter den Buchungen entfernt; die
Jahresnavigation oberhalb der Kalender bleibt. Statt Einzelposten als CSV nun
drei eindeutig beschriftete Exportoptionen: Monat als CSV, Jahr kumuliert als
CSV und Jahresabschluss [ausgewähltes Jahr] als CSV. Sie sind auch in der
Jahresübersicht verfügbar; Monat ist dort deaktiviert, bis ein Monat gewählt
wurde. Die Mitgliedsauswahl gilt für jeden Export (alle oder ein Mitglied).

Monat exportiert immer den ganzen gewählten Monat, auch bei ausgewähltem
Einzeltag; laufender Monat nur bis heute. Kumuliert: 01.01. bis Ende des
gewählten Monats, beim laufenden Monat bis heute. Ohne Monatsauswahl bis heute
im aktuellen Jahr bzw. 31.12. bei einem Vorjahr. Jahresabschluss umfasst
01.01.–31.12. und ist erst ab dem 31.12. des jeweiligen Jahrs aktiviert;
Vorjahre sofort. Genaue Auswahl/Zeiträume stehen unter den Buttons und in den
CSV-Dateinamen sowie den Datenspalten. Leere Platzhalterjahre liefern nur die
CSV-Kopfzeile und keine erfundenen Buchungen.

Die Exporte sind reine Lesevorgänge zum aktuellen Korrekturstand, kein
buchhalterisches Festschreiben/Sperren und kein Einzug. Export enthält die
Buchungen des gewählten Zeitraums einschließlich aller zugehörigen Rücknahmen
und Korrekturen zum Exportstand (auch später erfasste). CSV ordnet Buchungs-
und Korrekturzeilen nach dem tatsächlichen Zeitstempel, enthält handelnde
Person, Quelle, Exportart und Datenstand. Vorführbetrag EUR bleibt der
korrigierte Buchungswert; Korrektur EUR ist separat dokumentiert und darf nicht
nochmals vom bereits korrigierten Vorführbetrag abgezogen werden.

Jahresdaten werden nur für den Download abgerufen; keine lange Jahresliste
auf dem Bildschirm. Wiederverwendet bestehende geschützte Monatsberichte,
maximal zwei Abfragen gleichzeitig; kein neuer Server-Endpunkt oder Migration.
Ein fehlgeschlagener Monatsabruf bricht den gesamten Export ab, kein stiller
Teilexport. Fortschritt angezeigt, parallele Exportklicks abgefangen. Monats-
und Mitgliedsauswahl werden beim Klick festgehalten. CSV schützt Formelzellen,
verwendet UTF-8-BOM/Semikolon und unterscheidbare Dateinamen. Neuer Modulbaustein
assets/js/kiosk-export.js, im Service Worker v348 vorgeladen.

Vier gezielte Modul-/Integrationsprüfungen: Schaltjahr, Stichtage/31.12.,
Jahresdaten über bestehende Monats-API, Club-/Persönlichkeitsrechte, UTC/Berliner
Jahresgrenze, chronologische Korrekturen, Formelzellen und Fehlerabbruch.
Chromium/WebKit: tatsächliche Downloads für Monat, kumuliertes Jahr und
Vorjahresabschluss, korrekte enthaltene/ausgeschlossene Buchungen, drei Buttons,
Jahresabschluss vorzeitig gesperrt, keine Jahresliste, bestehende Abrechnungs-
und Fotoabläufe geprüft. Vorführbuchungen vollständig erhalten.

