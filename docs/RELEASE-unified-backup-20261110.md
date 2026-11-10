# Eine Sicherung, eine Zeitachse · 10.11.2026

Auftrag und bestätigtes Verhalten: Die Adminoberfläche zeigt nur „Jetzt sichern“ und „Gesicherte Stände“. Beim Zurückholen eines Website-Stands bleiben die heutigen Mitglieder, Umsätze, Chats, Seitenaufrufe und das aktuelle Mailarchiv erhalten. Es wird ausdrücklich kein Datenbank-Rollback durch die normale Wiederherstellung angeboten.

Oberfläche: optionaler Name, eindeutiger Erfolg mit sofort sichtbarem neuem Stand, Datum/Uhrzeit, Ansehen und kurze Wiederherstellungsvorschau mit verständlichen Bereichsnamen. Keine technischen Sicherungs-, Download- oder Importaktionen im Hauptdialog. Marineblau/Weiß bzw. Signature-Rot/Weiß, responsiv; vor jeder tatsächlichen Inhaltswiederherstellung automatisch eine vollständige Sicherung.

Ein neuer Sicherungsstand verbindet einen CMS-Snapshot mit einem eigenen, unveränderlichen AES-GCM-verschlüsselten Datenbankarchiv unter backups/points/<snapshot-id>.json.gz.aes. Alle aktuellen privaten member-mail/-Dokumente sind mit Inhalt und SHA256 im verschlüsselten Archiv enthalten; eine spätere Änderung/Löschung verändert die Kopie nicht. Programmarchive und verwaltete CMS-Medien werden in den getrennten privaten R2-Bucket tfb-website-backups kopiert. Auch das verschlüsselte Datenbank-/Mailarchiv liegt dort. Der Zusatzbucket befindet sich im bestehenden Cloudflare-Konto; Betreiber-Secrets werden weiterhin separat verwahrt. Importierte Clubarchiv-Medien behalten ihren vorhandenen separaten Medienbucket/Importbestand.

Nur bestätigte komplette neue Sicherungen erhalten die entsprechende Kennzeichnung. Bei einem Fehler kein Erfolg und kein scheinbar vollständiger Zeiteintrag; erneuter Versuch mit derselben Anfragekennung möglich. Vorhandene ältere CMS-Stände bleiben als frühere Website-Stände sichtbar. Tages-/Monatssicherung verwendet dieselbe Funktion und dieselbe Liste. Bestehende Aufbewahrung: 30 Tages- und 12 Monatsstände, benannte manuelle und Wiederherstellungsschutz-Stände bleiben erhalten. Historische Dateiexporte bleiben für Betreiber kompatibel, verschwinden aus der normalen Bedienung.

Sicherheitsgrenze der normalen Wiederherstellung: ausschließlich validierte cms_documents mit freigegebenen page:/global:-Schlüsseln, aktualisierte CMS-Veröffentlichungsindizes und Historie. Keine Schreiboperationen auf Mitglieder, Kioskbuchungen, Abrechnung, Chat-/Account-Daten oder Statistik; keine Rücksetzung privater R2-Mails. Die vollständigen Kopien sind zusätzliche Betreiber-Notfallvorsorge und keine pauschale Rücksetzung dieser laufenden Daten.

Operatorwerkzeuge können Mail-Dokumente jetzt ebenfalls aus einer verschlüsselten Kopie in ein neues privates Prüfverzeichnis rekonstruieren. Bestehende Dateien werden dabei nicht überschrieben. tools/register-program-backup.mjs legt den genauen committed Programmstand im privaten Speicher ab und registriert die Prüfsumme; vor jedem Programmrelease aus dem sauberen Release-Checkout ausführen (TFB_WRANGLER_JS optionaler Pfad zum vorhandenen Wrangler). TFB_BACKUP_BUCKET=tfb-website-backups wählt bei tools/export-editorial-system.mjs die getrennte Kopie. Keine Schlüssel in Git, UI oder Protokollen.

Prüfungen: 34 Node-Prüfungen für Rechte, Sicherung, Verschlüsselung, unabhängige Kopie, Wiederholung, Ausfälle, Inhaltsrestore und bestehende Mail-/Zugangsfunktionen; auch gegen den gebündelten Worker. Ein vollständiger Vergleich aller laufenden Geschäftstabellen nach Wiederherstellung bestätigt den Erhalt eines späteren Mitglieds, späterer Umsätze, Chats und Seitenaufrufe. Mail-R2-Dokumente bytegleich erhalten; ältere gesicherte Mail aus dem verschlüsselten Archiv lokal rekonstruiert. Chromium und WebKit: Jetzt sichern → sichtbarer Eintrag → Vorschau → Wiederherstellen, beide Farbwelten, 390/834/1440 px.

Keine Produktivwiederherstellung und keine echte Mail beim Entwickeln/Testen auslösen. Bei Live-Prüfung nur einen neuen Sicherungsstand anlegen und Liste/Vorschau lesen. Programm- und Backendstand vor Veröffentlichung gegen Remote abgleichen. Keine Datenbankmigration erforderlich; der neue private Sicherungsbucket und die zusätzliche Worker-Bindung sind eingerichtet.

Sicherung und Inhaltswiederherstellung erhalten eine eigene längere Antwortfrist (120 s); Login und andere API-Aktionen behalten 15 s. Worker bindet diese laufenden Aufgaben an den Request-Lebenszyklus, damit ein kurzer Verbindungsabbruch nicht unmittelbar alle Sicherungsarbeiten beendet. Erneute Anfragen mit gleicher Kennung bleiben wiederholbar. Keine erfolgreiche Meldung allein aufgrund eines gestarteten Auftrags.

Live-Erstprüfung erfolgreich: Programm 2dea3f9, Pages-Lauf 42812565564, Worker 9595c3e7-88b8-4874-af23-bd5be4416002. Echter neuer Stand „Nach Umstellung der Datensicherung“, ID dc5c52b1-f913-4531-8939-ac59fccc5697, sofort mit vollständiger Kennzeichnung in Gesicherte Stände erschienen. Erster Lauf inklusive erstmaliger Zusatzkopie rund 90 Sekunden. Verschlüsseltes Original und Zweitkopie anschließend heruntergeladen und ohne Entschlüsselung bytegleich geprüft: 24.528.461 Bytes. Keine Produktivwiederherstellung und keine Mail versendet. Beide Farbwelten live bestätigt; Screenshots und Prüfsummen privat unter output/TFB-TimeMachine-*.

Abschluss im Hintergrund: Wird die Sicherungsmaske während des Laufs geschlossen, bleibt eine inzwischen geöffnete andere Bearbeitungsmaske erhalten. Der Abschluss meldet sich per Hinweis; er ersetzt keine fremde Maske. Zusätzlich in beiden Browsern mit kontrolliert verzögerter Kopie und einem neuen ungespeicherten Formular geprüft.

Abschluss veröffentlicht: Programm 63c1dbc, erfolgreicher Pages-Lauf
42813704200. Fünf relevante Webdateien bytegleich mit dem geprüften Paket.
Backend unverändert auf 9595c3e7-88b8-4874-af23-bd5be4416002. Beide Welten,
sichtbarer Live-Sicherungsstand und bytegleiche getrennte Verschlüsselungskopie
bestätigt. Privater Nachweis: output/TFB-TimeMachine-live-check.json und
output/TFB-TimeMachine-Kopienpruefung.json. Aktueller Programmstand im privaten
Sicherungsarchiv registriert. Keine Live-Wiederherstellung vorgenommen.
