# Freischaltmail im gelb-blauen Mitgliedsanmeldungs-Look – v323

Die tatsächliche Freischaltmail übernimmt das bereits entwickelte gelb-blaue
Design der Mitgliedsanmeldungs-Mail: grauer Außenbereich, Original-TFB-Logo in
Signature-Blau/Gelb, maximal 620px breite Inhaltskarte, gelbe obere Linie,
blaue Bricolage-Überschrift, gelbes Codefeld mit blauen Ziffern, gleiche Details-,
Info- und Fußbereiche. Responsive Abstände und Arial-Fallbacks bleiben erhalten.
Die Farben sind im Template fest hinterlegt und unabhängig von der Website-Welt.

Generator tools/build-access-mail.mjs leitet server/cloudflare/templates/
access-mail.html aus assets/docs/tfb-mitgliedsanmeldung-muster-gelb.html ab.
Präsentationshinweis und Beispielperson werden entfernt; Antragstexte werden
passend zum automatischen Mitgliederzugang ersetzt. Keine Vorstandsgenehmigung,
kein Bestätigungslink mit abweichender Gültigkeit. Der tatsächliche Code wird
serverseitig escaped in die Vorlage eingesetzt. Logo und Schriften nutzen absolute
HTTPS-URLs derselben Website, damit sie in einer Mail erreichbar sind.

Nur Worker-Änderung. Website, Mitgliedsanmeldungs-Muster, Zugangsdaten,
Codegültigkeit, Empfängerprüfung, Resend-Absender und Berechtigungen unverändert.
Frontend/Service Worker bleiben v322. Kein Pages-Deployment oder Schemawechsel
für diese reine Mailgestaltung nötig.

19 relevante Servertests bestanden; zusätzlich Mailansicht in Chromium und WebKit
bei 320/390/760px geprüft: echtes Logo geladen, feste Blau-/Gelbfarben, vollständiger
Inhalt ohne horizontalen Überlauf. Vorschau mit fiktivem Code 123456 visuell geprüft.
Worker-Dry-Run erfolgreich einschließlich eingebundener HTML-Textvorlage.

Veröffentlicht: Quellstand 20e0b80, Worker-Version 3ffef93a-98d8-44d6-bbe6-0d18ea1926c8. Frontend bleibt v322. Keine weitere echte Code-Mail oder Zugangsdatenänderung ausgelöst.
