# Zentrale Redaktion und Sicherungen v232

Stand: 26.10.2026. Technisch implementiert und lokal geprüft; Veröffentlichung
wird separat in UEBERGABE.md protokolliert. R2-Aktivierung vom Nutzer bestätigt.

## Bedienung

Bestehende Seitenstifte verwenden. Nach erfolgreichem Speichern liegt der Inhalt
zentral vor; andere Geräte laden ihn beim Öffnen und prüfen Änderungen alle 15 s,
außer während einer Bearbeitung. Persönliche Entwürfe werden nie automatisch
hochgeladen. Bei einem Konflikt bleibt die unveröffentlichte Fassung im Browser.
Im Admin-Konto unter „Inhalte & Sicherung“ Entwurf vergleichen oder frühere Stände
wählen. Bei Wiederherstellung eine Seite oder alle aufgeführten Inhaltsbereiche
wählen. Ein Sicherheitsstand wird vorher angelegt. Chats, Mitglieder, Käufe und
Partnerzahlungen werden dadurch nicht zurückgesetzt.

„Sicherung herunterladen“ erstellt ein ZIP mit snapshot.json, Medien unter
medien/<SHA256> und programm/projekt.zip. JSON enthält Commit, Revisionen und
Medienprüfsummen. Fehlt ein Bestandteil, wird kein angeblich vollständiges Paket
angeboten. Import ist datenbezogen; Programmdateien werden nicht ausgeführt.
Ältere tfb-sicherung-v1-Dateien können ausschließlich inhaltlich übernommen werden:
keine Übernahme von Konten oder Buchungen. Die enthaltenen Bilder müssen vollständig
vorhanden sein; alte assets/-Verweise müssen am gleichen Ursprung existieren.
Private Sicherungen können Kontaktdaten enthalten: nicht öffentlich verteilen.

Partner-/Splash-Daten bleiben bei den bereits zentralen Endpunkten. Sie sind in
der technischen Gesamtsicherung enthalten, derzeit nicht im Seiten-ZIP-Restore.
Lokale file://-/localhost-Vorführung behält absichtlich den alten lokalen Weg.

## Veröffentlichung: zwingende Reihenfolge

1. Tatsächlichen aktuellen Desktopexport sichern, D1 exportieren, Quellarchiv/
   Git-Bundle sichern; unabhängige Datenbankprobe. Unter .private/release-v232.
2. R2 privat tfb-website-private, kein öffentlicher r2.dev-Bucketzugang.
3. Nur additive Migration 0006-editorial-snapshots.sql auf bestehende D1 anwenden;
   nicht den gesamten Schema-Setup oder ältere Messungs-Migrationen ausführen.
4. Implementierung committen. `node tools/prepare-editorial-bootstrap.mjs
   .private/release-v232/desktop-before.json` erzeugt private Medien/SQL/JSON sowie
   exaktes Git-Quellarchiv. verification.json gegen gesicherten Desktop prüfen.
5. `node tools/apply-editorial-bootstrap.mjs .private/release-v232/bootstrap
   --apply-verified-desktop` lädt Medien/Quellen zuerst, setzt dann zentrale Dokumente.
   Vorher den erwarteten CMS-Kopf 0 prüfen. Niemals mit einem älteren Seed starten.
6. Zufälligen 32-Byte-Schlüssel lokal privat und separat extern sichern; als
   CMS_BACKUP_KEY per wrangler secret put setzen. Nicht in Git, Website oder Logs.
7. Worker deployen; anonymer Zugriff auf öffentliche Inhalte, echter Adminzugriff,
   Rechte, alle Medien und Inhaltsreihenfolge prüfen. Alte Geschäftsdaten erhalten.
8. Erst dann Frontend v232 veröffentlichen. Echten Browser/zweites Gerät prüfen.
   „Technische Sicherung prüfen“ im Admin-Konto startet den ersten Gesamtlauf.
   Erfolg in cms_backup_status prüfen; cron alleine ist kein Erfolgsnachweis.
9. Externe verschlüsselte Kopie mit `tools/export-editorial-system.mjs` erstellen
   und Wiederherstellungsprobe durchführen. Live-/Backup-Nachweise privat halten.

## Technische Sicherung und Wiederanlauf

Worker-Cron täglich 02:15 UTC: Inhalts-Tages-/Monatsstand plus verschlüsselte
Gesamtdatenbank. 30 Tage/12 Monate, benannte Stände und Restore-Sicherheitsstände
bleiben. Datenbank-Sitzungen und Rate-Limits werden bewusst nicht wiederbelebt.
Alle anderen Daten sowie historische Snapshot-JSON sind enthalten. Medien und
Quellreleases sind unveränderlich im privaten Bucket; die DB-Sicherung referenziert
sie. Eine DB-Datei ohne diese Objekte ist noch keine vollständige Betriebssicherung.
Bei Änderungen während des Exports wird abgebrochen statt ein inkonsistenter Stand
bestätigt. Ein Fehler ist im Admin sichtbar; die letzte erfolgreiche Sicherung
bleibt erhalten. Fehlender Schlüssel/Speicher verhindert erfolgreiche Sicherungen.

Unabhängige Kopie (Operator, Cloudflare-Anmeldung erforderlich):

```
node tools/export-editorial-system.mjs YYYY-MM-DD SEPARATE-KEY-FILE NEW-PRIVATE-DIRECTORY
```

Das Tool lädt DB und Objekte, prüft Medien-/Codehashes, stellt eine neue lokale
Testdatenbank her und packt alles in ein zusätzlich AES-256-GCM-verschlüsseltes
Paket. Temporäre Klartextdateien werden entfernt, Schlüssel nicht beigelegt.
Dies ist ein manueller Operator-Lauf, noch kein extern automatisierter Backupjob.
Regelmäßige Kopie außerhalb R2 organisatorisch einplanen. Ohne getrennte
Schlüsselsicherung sind verschlüsselte Sicherungen nicht wiederherstellbar.
Originale Worker-Secrets (insbesondere PASSWORD_PEPPER) ebenfalls getrennt sichern;
ein DB-Export allein enthält sie nicht. Keine echten Secrets in diese Dokumentation.

Bei Totalausfall: Paket lokal entschlüsseln, DB/Objekthashes prüfen, Testdatenbank
auf neuem Ziel herstellen, kompatiblen Worker/Secret-Konfiguration prüfen, Objekte
und DB in getrennte Ersatzumgebung laden, fachlich prüfen, erst dann umschalten.
Werkzeug tools/editorial-recovery.mjs überschreibt keine vorhandene Datenbank.
Gesamtdatenbank-Rollback ist ausdrücklich ein Betreiber-Notfallvorgang und setzt
auch Geschäftsdaten auf den Sicherungszeitpunkt zurück; kein normaler Seiten-Restore.

## Grenzen und laufende Kontrolle

R2 Standard hat Freimengen; Aktivierung bedeutet verbrauchsabhängige Abrechnung
oberhalb der Freimengen, keine Zusage kostenfreien Gesamtbetriebs. Free-Worker hat
CPU-/D1-Anfragelimits: ersten echten Vollsicherungslauf und spätere Größen prüfen.
Bei Überschreitung nicht still auf einen Bezahlplan wechseln, sondern Ursache und
konkrete Kosten mit Nutzer klären. Speichermedien werden noch nicht automatisch
entsorgt; alte Stände sollen ihre Dateien behalten. Monatlich Speicherverbrauch,
letzten Sicherungserfolg, externen Kopierlauf und Wiederherstellbarkeit prüfen.

Tests: npm run test:editorial und npm run test:browser:editorial;
Backend-Regressionschecks zusätzlich tools/test-app-sync.mjs und Partner-Tests.
