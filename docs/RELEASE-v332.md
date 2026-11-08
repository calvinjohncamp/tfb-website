# Clubstatistik: klare Kennzahlen und Jahresverlauf – v332

Verbindlicher Nachfolger der Statistikdarstellung v331: Seitenaufrufe, Besucher,
Besuche, Seiten pro Besuch und App-Aufrufe jeweils mit Mitglieder-/Externenanteil.
„Aktive Mitglieder“ und die missverständliche doppelte Zielgruppenkarte entfallen.
Mitglieder sind unterschiedliche verifizierte Konten pro Tag/Monat/Jahr; zehn
Aufrufe desselben Kontos sind ein Besucher. Externe = ohne verifizierte Anmeldung,
auch Mitglieder ohne Login; ihre tägliche Netzschätzung wird für längere Zeiträume
addiert und ausdrücklich als Schätzung gekennzeichnet, keine exakte Personenzahl.
Heute, Dieser Monat, Dieses Jahr, Vorheriges Jahr sowie Monats-/Jahrauswahl.
Diagramm: letzte 30 Tage, Monate des gewählten Jahres oder Jahresverlauf.
Tabelle: Gesamt / Mitglieder / Externe. CSV mit klaren Einheiten und Zeitraum.
Migration 0012 ergänzt vorhandene Zähler und Monats-/Jahres-Seitenaggregate;
keine bisherigen Aufrufe gelöscht. Historisch nicht sicher zuordenbare gemischte
Besuche/App-Aufrufe bleiben ausdrücklich nicht zugeordnet. Keine erfundenen
Werte vor Messbeginn. Aktuelle Monatsmitglieder einmalig für das Jahres-Set
übernommen. Tagesaggregate 400 Tage, Monate fünf Jahre, Jahre zehn Jahre;
Mitglieder-HMAC-Sets nur aktueller Tag/Monat/Jahr, keine Browserkennungen.
25 Serverprüfungen, Chromium/WebKit inkl. 320/390/834/1440 px, CSV, Jahreswechsel
und fehlende Vorjahresdaten bestanden; Worker-Dry-Run erfolgreich. Details:
RELEASE-v332.md. Service Worker v332.


D1-Time-Travel-Punkt vor Migration: `00000122-00000b66-0000511d-1114afdd3b47ccacb698935dab8168e9`. Kein Datenbankexport.
