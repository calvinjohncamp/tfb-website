# Mitgliederbrief: Textformatierung und sichtbarer Testversand

Auftrag: Testmail an Admin prominent in Signature-Rot/Weiß beziehungsweise Gelb/Blau. Überschrift, Anrede, Nachrichtentext und Gruß erhalten jeweils eine kleine kontextbezogene Leiste für Fett, Kursiv und Signature. Die gelbe Welt verwendet einen gelben Textmarker mit blauer Schrift; die rote Welt rote Schrift. Die dezente Datumszeile erhält keine Formatierung. Anreden werden standardmäßig fett dargestellt, auch in älteren Vorlagen ohne ausdrückliche Formatierung. Eine bewusst anders formatierte Anrede behält die gewählte Gestaltung; gespeicherte Inhalte werden nicht automatisch überschrieben.

Die Klartextfelder bleiben erhalten. Ein zusätzliches optionales `formatting` enthält validierte Textabschnitte mit ausschließlich `text`, `bold`, `italic`, `signature`. Zusammengefügte Abschnitte müssen exakt dem jeweiligen Klartext entsprechen. Kein HTML wird gespeichert oder vom Client als Mailinhalt übernommen. Der gemeinsame Renderer erzeugt Vorschau und tatsächliche HTML-Mail, maskiert Text und übersetzt Signature-Markierungen anhand der Farbwelt. Speichern, Speichern unter, Wiederladen und der bestehende Testtransport erhalten die Formatierung. Veraltete Browser dürfen formatierte Vorlagen nicht stillschweigend ohne Formatierung überschreiben.

Editor: native Textauswahl und Formatierbefehle, zusätzliche Fokus-/Touch-Auswahlbehandlung. WebKit blockiert Ereignisfunktionen im vormals skriptlosen iframe; deshalb erlaubt der Sandbox-Token nun die Ausführung der durch das Elterndokument installierten Listener. Eine ausschließlich für die Editorvorschau gesetzte CSP sperrt sämtliche Skriptquellen, externe Verbindungen, Basisänderungen und Formulare. Stile sind inline zulässig, Logos und Schriften nur von der Website. Browserprüfung bestätigt, dass ein injiziertes Script nicht ausgeführt wird. Einfügen und Ablegen übernimmt ausschließlich Klartext.

Validierung:

- 23 Node-Prüfungen für Archiv, Rollen, Eingaben, Konflikte, Kopien, ETag-Wiederholung, Testtransport und Formatierung. Zusätzlich der gebündelte Worker mit 13 Integrationsprüfungen.
- Vollständiger Chromium- und WebKit-Ablauf: Passage auswählen; Fett, Kursiv und Signature setzen/entfernen; Speichern, Kopieren, Laden; erzeugte HTML-Testmail; beide Buttonpaletten; Löschwiederherstellung; Konflikterhalt und Breiten 320/390/834/1440 px.
- Ausschließlich synthetische Testkonten und simulierte Mailtransporte. Keine echte Testmail versendet und keine vorhandene Nutzervorlage verändert.
