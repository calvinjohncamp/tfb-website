# Automatische Reichweitenzählung und Mitglieder-/Gastaufteilung – v331

Statistik-Zustimmungsabfrage, Composer-/Startkarte und Eintrag „Freiwillige
Nutzungsstatistik“ im Account entfernt. Keine Freigabe für die neue Messung nötig.
Der Footer enthält nur noch „Datenschutz zur Statistik“ mit Information und
Vereinskontakt für Widerspruch/Betroffenenrechte, keine neue Zustimmungsoberfläche.
Andere Erklärungen (z.B. Kiosk/Lastschrift, Foto- und Chatregeln) bleiben unberührt.

Neuer Endpunkt /public/usage-count akzeptiert nur eine einmalige Ereignis-ID,
Seitenkategorie und App-/Browser-Modus. Keine persistente Browser-/Besuchskennung,
kein Statistik-Cookie, kein Fingerprinting aus Geräteeigenschaften, keine
Analyticsanbieter. Altes Browser-ID-Feld wird beim Laden entfernt. Eine frühere
explizite Ablehnung bleibt als Widerspruch berücksichtigt; DNT/GPC ebenfalls.
Alte /public/usage-Payloads werden nicht mehr ausgewertet. Bereits offene ältere
App-Ansichten benötigen einen Reload, um die neue Oberfläche/Erfassung zu laden.

Besucher/Besuche sind nun explizit tägliche serverseitige Schätzungen. Die ohnehin
vorliegende Verbindungsadresse wird nur unmittelbar zu einer geheimen tagesgebundenen
HMAC-Kennung abgeleitet, nicht gespeichert; bei gültiger Anmeldung stattdessen
verifiziertes Konto. Kein User-Agent im Wiedererkennungsmerkmal. Gemeinsame Netze
können mehrere Gäste zusammenfassen, Verbindungswechsel einen Gast mehrfach zählen.
Besuchstrennung nach 30 Minuten ohne Seitenaufruf und am Tageswechsel. Monatskarte
heißt „Besucher-Tage“ (Summe täglicher Schätzungen), keine behauptete Monatsreichweite
unterschiedlicher Menschen. Angemeldete Mitglieder separat pro Monat dedupliziert.
Keine personenbezogenen Seitenfolgen: Ereignistabelle enthält nur HMAC-Ereignis-ID,
Claim/Ablauf; Sitzungszustand nur abgeleitete Tageskennung, zufällige serverseitige
Besuchs-ID und letzte Zählzeit. Kennungen laufen täglich, Mitglieder spätestens
monatlich ab; Wiederholungsschutz 24h. Tagesaggregate 400 Tage, Monate bis 14 Monate.

Neue Nutzerbitte: „Wer nutzt unsere Seite?“ zeigt Seitenaufrufe und Prozentanteile
für Mitglieder (angemeldet, einschließlich Admins) und Besucher ohne Anmeldung.
Ohne Anmeldung können wir die tatsächliche Vereinszugehörigkeit nicht erkennen;
diese Gruppe enthält Externe UND Mitglieder ohne Login. Gleiche Aufteilung pro
Seitenkategorie und im Tages-CSV. Summe beider Gruppen entspricht Gesamtaufrufen.
Die Rolle wird ausschließlich aus serverseitig geprüfter Sitzung abgeleitet,
nicht vom Browser behauptet. „Klicks“ sind hier bewusste Seitenwechsel, keine
Erfassung aller Buttonbetätigungen oder Chat-/Kioskaktionen.

Migration 0011-simple-usage additiv, getrennte usage_nc_-Tabellen und neue Messreihe.
Die alte freiwillige Messung wird unverändert archiviert; Monatszahlen stehen in
den Methodenhinweisen, vollständiger bisheriger Bericht unter /admin/usage-legacy.
Keine Vermischung unterschiedlicher Messdefinitionen und keine rückwirkenden Werte.
D1-Time-Travel-Punkt vor Migration:
00000122-000009c6-0000511d-ca80de7c6713a9e31422e19a911894b2.
Keine Mitglieder-/Kiosk-/Chatinhalte verändert und kein Datenbankexport.

Prüfung: 27 Servertests (neue Messung, Segmentzuordnung, frühere Messung, Kommentare,
Moderation, App-Sync und Gastrechte) bestanden. Chromium/WebKit: automatische Gäste-
und Admin-Aufrufe ohne Freigabe/Browser-ID, kein Neuzählen bei Neurendern, kein
Statistikfeld im Account, reine Information, DNT, Tages-/Monatsansicht, Segmente,
CSV und 320/390/834/1440px ohne Überlauf. Desktopansicht visuell geprüft.
Worker-Dry-Run erfolgreich. Service Worker v331.

Live veröffentlicht: Quellstand d9dafa9, Pages-Lauf 42471923925 erfolgreich,
Worker a2643c7d-1421-40ec-ab71-eb91db8576db, Service Worker v331.
Neue Messreihe startet 2026-11-08T10:33:23Z (11:33 Uhr Berlin); frühere
Messreihe unverändert archiviert. Echte Browserprüfung ohne Zustimmungsfeld:
Admin rief Aktuell und Home auf, Übersicht zeigte 2 Mitgliederaufrufe / 100 %
und 0 Aufrufe ohne Anmeldung. Keine künstlichen Gastzähler oder Testkonten erzeugt.
