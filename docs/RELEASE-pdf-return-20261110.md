# PDF-Betrachter mit Rückweg · 10.11.2026

Nutzer meldet auf dem iPhone eine Einbahnstraße beim Öffnen der vier PDFs unter Club → Mitgliederinfos. Quelle bestätigt: TFB-App, nicht empfangene E-Mail. Bisher führen direkte PDF-Links mit target=_blank in den systemeigenen PDF-Betrachter, der kein App-X bietet.

Neue gemeinsame, lokal gehostete PDF-Anzeige innerhalb der App. Fest sichtbare Kopfzeile mit Titel, Seitenzahl, Vergrößern/Verkleinern, Herunterladen und 44px-X. Dokumentzoom bis 300 % lässt das X in der Kopfzeile stehen. Das Dokument wird auf iPhone, iPad und Desktop im selben Dialog angezeigt. X, Escape und Browser-Zurück schließen den Betrachter und erhalten Route, Scrollposition und ungespeicherte Texte. Escape schließt nur den PDF-Betrachter und nicht eine dahinterliegende Bearbeitungsmaske.

Die Anzeige fängt normale PDF-Linkklicks (auch versionierte URLs) zentral ab. Mitgliederinfos bleiben je Farbwelt mit den passenden PDF-Dateien verknüpft. Gleiches Verhalten für Chronik, andere PDF-Links und Terminanhänge. Die bestehende HTML-Vorschau der Mitgliedsantrags-Bestätigung behält ihren bereits funktionierenden Dialog. Bewusstes Herunterladen bleibt eine zusätzliche Aktion.

PDF.js 6.5.438 aus dem offiziellen npm-Paket, inklusive Lizenzdateien und lokaler Ressourcen. Import und Worker erst bei PDF-Aufruf. Keine Weitergabe der Dokumente an einen externen PDF-Dienst, keine Ausführung von PDF-JavaScript. Seiten werden nur in Sichtnähe gerendert, entfernte Canvas-Speicher wieder freigegeben, Auflösung und Pixelzahl begrenzt. Dadurch bleibt auch die 66-seitige Chronik auf dem iPhone nutzbar. Ladefehler lassen X und Download sichtbar.

Dateien: assets/js/pdf-viewer.js, assets/css/pdf-viewer.css, assets/vendor/pdfjs/, Einbindung in index.html und site.js. prepare-pages.py veröffentlicht ausschließlich die dafür erforderlichen zusätzlichen öffentlichen PDF-Ressourcentypen innerhalb des Vendor-Verzeichnisses. Keine Backend-/Datenbankänderung.

Prüfwerkzeug: tools/test-browser-pdf-viewer.mjs. Synthetische Konten/Daten; vorhandene Vereinsdaten bleiben unverändert.

Validierung erfolgreich: Chromium und WebKit jeweils 390, 834 und 1440 px. Alle vier Mitglieder-PDFs werden tatsächlich auf Canvas gezeichnet, X vollständig im sichtbaren Bereich. Kein neuer Tab, kein Verlassen der Ausgangsroute; X/Escape/Browser-Zurück erhalten Textentwurf und Scrollstand. Zusätzliche Prüfung direkt auf der Clubseite mit blauer und roter Platzordnung und Rückkehr zu Mitgliederinfos. Auf 390 px außerdem 66-seitige Chronik bis Seite 66 gelesen, alte Canvas-Flächen freigegeben. Ausschließlich isolierte Datenbank und Testkonten; keine echten Vereinsdaten geändert.

Der Service Worker reicht Range-Teilabrufe direkt an den Browser weiter; keine unzulässigen 206-Antworten im App-Shell-Cache. Fremdbibliothek und Lizenzdateien unverändert übernommen; die Whitespace-Prüfung schließt unveränderte Vendor-Dateien aus. Bestehender Mail-Editor in Chromium/WebKit zusätzlich ohne Regression geprüft.


Veröffentlicht und live bestätigt: Programm `693853c`, erfolgreicher Pages-Lauf
`42793635579`. Zehn Webdateien einschließlich PDF.js/Worker/Bilddecoder und
Freihandmarker bytegleich geprüft. Im echten angemeldeten Browser Platzordnung
auf Club geöffnet: Dokument gezeichnet, X sichtbar, geschlossen und unmittelbar
zur selben Clubansicht/Mitgliederinfos mit Fokus auf dem ursprünglichen Pill
zurückgekehrt. Keine Inhaltsänderungen, keine Mail versendet. Privater Nachweis:
`output/TFB-PDF-Betrachter-live.png` und `output/TFB-PDF-Rueckweg-live-check.json`.
Backend unverändert auf `f375fb08-04c4-4170-ac96-9954cb83109b`.

