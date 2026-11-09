# Release v357

## Feste Produktbereiche und schneller Statuswechsel · v357 · 09.11.2026

Produktbibliothek nicht mehr nach einzelnen Tabs gefiltert. Feste Reihenfolge:
Aktiv, Inaktiv, Archiviert mit fetten Überschriften und Anzahlen. Aktiv bleibt
immer sichtbar; Inaktiv und Archiviert lassen sich über beschriftete Augen-
Symbole ein-/ausblenden. Suche gilt für alle drei Bereiche. Neuer Statuswechsel
öffnet nötigenfalls den Zielbereich und verschiebt die Karte unmittelbar dorthin.
Inaktiv-Button bleibt in Signature-Farbe: weiß auf Rot, gelb auf Signature-Blau.
Während Speicherung farbiger Status und ausdrücklicher Hinweis „Wird gespeichert“;
weitere Mutationen gesperrt, Suche und Sichtbarkeit bleiben bedienbar.

Ursache der wahrgenommenen Wartezeit: vorher vollständiger App-Neuabgleich nach
Katalogspeicherung, ggf. zusätzlich ein vorgelagerter Abgleich. Katalog-only-
Speicherung nutzt jetzt die bestehende revisionsgeschützte Schreibanfrage direkt.
Server bestätigt exakt seinen normalisierten Katalog samt neuer Datensatzrevision,
Client übernimmt diese Bestätigung ohne großen /app/state-Abruf. Der nächste
Hintergrundabgleich bleibt bestehen. Idempotente Wiederholungen ohne Katalog-
Bestätigung nutzen weiterhin den vollständigen Abgleich als sicheren Fallback.
Sonstige Speicher-/Buchungsvorgänge bleiben unverändert. Kein vorgetäuschter
Speichererfolg: bis zur Bestätigung ausdrücklich ausstehend; Fehler führt zur
letzten bestätigten Darstellung und sichtbarem Hinweis „Nicht bestätigt“.

Buchungslogik erneut geprüft: inaktive und archivierte Produkte serverseitig
nicht neu buchbar; bestehende Käufe behalten Preis und Produktangaben. Schon
vorhandener Schutz gegen veraltete Preise und parallele Adminänderungen bleibt.
Keine Änderungen an Live-Produkten, Preisen, Käufen, Zahlungswegen oder Datenbank-
Schema; ausschließlich Darstellung und Katalog-Speicherablauf geändert.

Prüfung: 15 Server-/Buchungstests plus 2 Einrichtungstests erfolgreich; 15 Tests
auch gegen das tatsächliche Worker-Bündel. Chromium/WebKit inklusive vorhandener
Abrechnungs-/CSV-/JPG-Abläufe erfolgreich. Verzögerte Antwort (800 ms) zeigt die
Karte sofort im neuen Bereich; synchrone Rückmeldung in beiden Browser-Fixtures
ca. 1 ms, keine Aussage über reale Bank-/Netzlaufzeiten. Pro erfolgreichem
Statuswechsel nur eine /app/commit-Anfrage und kein /app/state im Speichervorgang.
Gezielt abgelehnte Anfrage wird zurückgenommen, Serverstatus bleibt aktiv.
Farbwerte beider Welten, responsive Ansichten, bestehende Preis-/Historien-
absicherungen und feste Bereichsreihenfolge geprüft. Service Worker v357.

Live bestätigt: Code c0abcc1, Testnachschärfung 7a16df3. Pages-Workflow
42585860931 erfolgreich; Worker-Version 42744063-ef10-44b3-bd7e-28012e626f1d.
Bibliotheksmodul, Synchronisation, CSS und Service Worker v357 öffentlich bytegleich.
Kein Einrichtungsskript erneut ausgeführt; vorhandene Nutzeränderungen am
Sortiment und sämtliche Buchungen unverändert belassen.
