# Mitgliederbrief: Editor und zentrales Mailarchiv · 10.11.2026

Nutzerauftrag: letzter Adminpunkt „E-Mail an alle Mitglieder“, rechts von Kiosk
und Sicherung. Erster Entwurf ausdrücklich nur Editor und Archiv; echter Versand
zurückgestellt. Kein Versandknopf, keine Empfängerliste geladen, keine Rundmail.

Neue Adminroute #membermail. Wiederverwendbare Beispielvorlage „Begrüßung zur neuen
Saison“ / „Es geht wieder los.“. Name im Archiv, Briefdatum und E-Mail-Betreff im
kompakten Kopf; Überschrift, Anrede, Fließtext und Gruß direkt im Brief editierbar.
Schlichtes Mailarchiv, Neue Mail, Speichern und Speichern unter. Save-as kopiert
mit neuer UUID und erhält die alte Fassung. Gespeicherte Vorlagen können nach
Neuladen und auf anderen Geräten erneut geöffnet und verändert werden.

Briefgestaltung aus der vorhandenen Mitgliedsanmeldungs-Bestätigung übernommen:
TFB-Logo, DM Sans / Bricolage Grotesque mit Arial-Fallback, helle Brieffläche,
Signature-Linie, Vereinsfooter. Zwei Farbwelten über bestehenden globalen Schalter;
Farbwelt in Vorlage gespeichert. Ein gemeinsamer HTML-Renderer erzeugt Vorschau
und die zukünftige Mailfassung; reine Texteingaben werden HTML-escaped, keine
beliebige HTML-/Skripteingabe. Sandbox ohne Skriptausführung. Eingaben erst nach
Anschluss der Änderungsbeobachtung aktiv, Absatzstruktur browserübergreifend
kanonisch erfasst. Änderungen bleiben bei einem Speicherkonflikt erhalten.

Private Speicherung in bestehendem CMS_BUCKET unter member-mail/drafts/*.json.
GET /admin/member-mail, GET /admin/member-mail/{uuid}, POST /admin/member-mail/save.
Alle Routen nach bestehender serverseitiger Admin-Sitzungsprüfung. Kein neues
Schema, keine Migration oder Mitglieder-/Kiosk-/CMS-Inhaltsänderung erforderlich.
R2-ETag-Bedingungen verhindern verlorene Paralleländerungen; Wiederholung nach
verlorener Antwort bei gleichem Inhalt idempotent. UUID und Text-/Datumsgrenzen
validiert. Keine öffentliche Lese-/Schreibschnittstelle für Entwürfe.

Backendbasis e6041417-612c-4a4f-82a9-7af226b2ba58 mit aktuellem Familienlogin vor
Deployment geprüft. Neuer Worker 9eb0745d-3410-41d7-bec1-6dd0ab379f51 erfolgreich
veröffentlicht. Bestehende Bindings, Secrets und Zeitplan erhalten.

Prüfungen: 17 Servertests inkl. Zugriffsschutz, Roundtrip, Copy, Pagination,
Idempotenz, Konkurrenz und Validierung erfolgreich. 13 Verzeichnistests auch am
Wrangler-Bündel erfolgreich. Chromium und WebKit gegen echten Worker mit rein
synthetischem SQLite/R2: Adminnavigation, Inline-Text, Datum, zentrales Speichern,
Save-as mit unverändertem Original, Seitenneuladen und Öffnen, Farbwelt speichern,
Konflikt durch paralleles Gerät und erhaltener lokaler Text, kein Überlauf bei
320/390/834/1440px. Bestehende Admin-Toggle-Prüfung beider Browser erfolgreich,
inkl. gewöhnlicher Mitglieder und erneutem Login. Keine echten Mails versendet.

Live bestätigt: Programm e8f0638, Pages-Lauf 42782430621 erfolgreich. Alle sechs
Editor-Webdateien öffentlich bytegleich mit dem geprüften Veröffentlichungspaket.
Neue Archiv-Endpunkte live ohne Anmeldung GET/POST 401. Über bestehenden echten
Chrome-Adminzugang den neuen letzten Menüpunkt geöffnet, Beispielvorlage
„Begrüßung zur neuen Saison“ zentral gespeichert (Mailarchiv: 1), Neue Mail
geöffnet und gespeicherte Vorlage wieder aus dem Archiv geladen. Erfolgstext
„Vorlage geladen · gespeichert …“ und vollständiger Brief sichtbar. Ein sinnvolles
Beispiel bleibt im echten Archiv zur weiteren Bearbeitung. Kein Versand ausgelöst
und keine Empfängerliste abgerufen. Getestete Beispiel-Briefvorschau im Workspace:
output/TFB-Mitgliederbrief-Beispiel.png, generiert mit gemeinsamem Mail-Renderer.
