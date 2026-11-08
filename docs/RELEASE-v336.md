# Statistik-Neustart und vollständige Sicherung der Zähler – v336

Auf ausdrücklichen Nutzerwunsch einmaliger Neustart der gesamten Clubstatistik.
Operator-Datei operations/reset-usage-2026-11-08.sql leert nur usage_nc_ und frühere
usage_-Messdaten inkl. Dedup-/Sessionstatus und setzt simple_enabled_at,
splash_started_at, audience_split_started_at und reset_at auf denselben Zeitpunkt.
Keine Migration und niemals automatisch beim Deployment ausführen. Keine Mitglieder,
Kioskdaten, Chats, CMS-Inhalte oder Partnerzahlen löschen. D1-Time-Travel-Punkt
vor Neustart: 00000123-00000058-0000511d-9bf73bb2c78154a57088a43ea8c5fd00.
Kein privater Datenbankexport. Historische Sicherungen werden nicht gelöscht.
Messbeginn in der Übersicht jetzt mit Berliner Uhrzeit, reset_at im CSV dokumentiert.
Splash/Home starten gemeinsam; direkte Home-Aufrufe, weitere Home-Besuche oder
Abbruch auf der Splash können weiterhin zu unterschiedlichen Aufrufzahlen führen.
Die technische AES-GCM-Datenbanksicherung enthält bereits sämtliche Statistik-
tabellen. Zusätzlich enthalten neue manuelle/tägliche/monatliche/safety-Snapshots
und der aktuelle Website-Download einen konsistenten anonymen Statistikstand in
statistics.tables; ein SQLite-Lesevorgang für die sieben Aggregat-/Metatabellen.
Keine Mitglieds-/Netz-/Session-HMACs oder Ereigniskennungen im Inhaltspaket.
Ältere Sicherungen werden nicht rückwirkend mit aktuellen Zählern beschriftet.
Seitenwiederherstellungen übernehmen ausschließlich Inhalte und setzen Zähler
nicht zurück; komplette Datenbankwiederherstellung bleibt Betreiberaufgabe.
Sicherungshinweis und Download-Bestätigung entsprechend ergänzt. Keine neue
Datenbankstruktur. Kiosk-Abrechnung ausdrücklich für den nächsten Schritt offen.
19 Serverprüfungen inkl. Zählerreset, CMS, Statistik, verschlüsselter Sicherung,
unabhängiger DB-Wiederherstellung und unbeeinflusster Zähler bei Inhalts-Restore
bestanden; Browser-CMS-Test mit ZIP-Export/Import inklusive Statistik bestanden.
Worker-Dry-Run erfolgreich. Service Worker v336. Details RELEASE-v336.md.

Live veröffentlicht: Quellstand 8fa13cc, Pages-Lauf 42476465818 erfolgreich,
Worker 7a6ec5bc-c923-41b4-ab3b-442c683c9e21, Service Worker v336.
Einmaliger Reset am 2026-11-08T11:36:33.765Z = 08.11.2026, 12:36:33 Berlin.
Reset-Bookmark: 00000124-00000006-0000511d-cfaf7d763af4d5175d5e46b67d94fc8b.
Lesende Live-Kontrolle bestätigt alle elf Statistik-/Dedup-Tabellen leer und
sämtliche Startmarken identisch. Vorher/nachher unverändert: 308 Mitglieder,
147 App-Datensätze, 16 CMS-Dokumente. Kein Live-Testaufruf nach dem Nullsetzen.
Öffentliche Dateien für Sicherungshinweis, genaue Startzeit und v336 bestätigt.
Die erste Kontrollabfrage nutzte zu viele UNION-Terme für D1; nach erfolgreichem
Reset nur lesend korrigiert geprüft, den Reset ausdrücklich nicht wiederholt.
