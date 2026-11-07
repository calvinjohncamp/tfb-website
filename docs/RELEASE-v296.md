# TFB-Kommentare, Moderation und längere Bildanzeige – v296

Admins erhalten auch unter „Dein Kommentar“ die persönliche/TFB-Absenderwahl
mit dem vorhandenen runden TFB-Symbol. Sie gilt ebenso beim Bearbeiten eigener
Kommentare; neue Kommentare beginnen persönlich. Post- und Kommentarformulare
verwenden denselben Sender-Picker. Echte Autoren-/Besitzer-ID bleibt erhalten.
Server prüft Adminrolle und Club-Scope; Mitglieder können keinen offiziellen
Absender vortäuschen. Fremde Kommentartexte können auch Admins nicht umschreiben.
Eigene Kommentare lassen sich weiterhin löschen.

Neue Standardmoderation: Ausblenden mit zweitem Bestätigungsklick; danach steht
anstelle des Inhalts „Dieser Kommentar wurde von den Tennisfreunden Bielstein
ausgeblendet.“ Admins können ihn über „Wieder anzeigen“ freigeben. Nach der Aktion
bleibt der betroffene Kommentar im Blick. Platzhalter zählen weiterhin als
Kommentar. Speicherung erhält Originaltext/Fotos für die Wiederfreigabe und
setzt serverseitig hidden, moderatedAt und moderatedBy; Besitzer-ID bleibt
unverändert. Originalinhalt wird in öffentlichen DTOs und Nichtadmin-Appdaten
redigiert, zugehörige Fotos sind nicht mehr über den öffentlichen Medienweg
zugänglich, sofern sie nicht unabhängig in einem anderen sichtbaren Beitrag
veröffentlicht sind. Admin-Appdaten bleiben für die Wiederfreigabe vollständig.
Ausgeblendete Kommentare können nicht durch den Verfasser umgeschrieben oder
wieder sichtbar gemacht werden; Versionskonflikte und bereits gelöschte
Kommentare werden sicher abgefangen. Verborgene Kommentare erzeugen keine
normalen Kommentarhinweise. Es gibt keine automatische Inhaltsklassifizierung.

Gastansichten von Chat/Mannschaften gleichen veröffentlichte Änderungen etwa
alle zehn Sekunden ab; offene Formulare, Login und Bildansichten werden dabei
nicht unterbrochen. Gastcache wird nach eigenen Speicherungen und Abmeldung
verworfen. Moderationshinweise erscheinen dadurch auch in bereits geöffneten
Gastansichten. Neue Anfragen erhalten sofort die serverseitige Redigierung.

Bildzeiten: Foto-Diashow von 2,4 auf 3,4 Sekunden pro Bild; bewegliches Home- /
Aktuell-Karussell einschließlich Vollbild bekommt +1 Sekunde Ruhezeit (erster
Start 3 statt 2 Sekunden, wiederkehrende Pause 2,1 statt 1,1 Sekunden). Übergang
bleibt 900 ms bzw. Foto-Überblendung 360 ms. Manuelles Weiterklicken bleibt sofort;
Video-Clipdauern und ausdrücklich gesetzte Textzeiten werden nicht geändert.

Validierung: 15 Servertests zu Rollen, Absendern, Datenprojektion, Mediensperre,
Moderation, Wiederfreigabe, Besitzer-ID und Versionskonflikten. Isolierter Browser
mit echtem Worker prüft TFB/persönlichen Kommentar, Bearbeiten, Ausblenden,
Bestätigung, Gastansicht, Wiederfreigabe, mobile Breite und automatische
Übernahme in geöffneter Gastansicht. Bestehende Kommentar-/Foto-/Emoji- und
Chat-Karussell-Checks erfolgreich. Echter Timingtest für längere Standzeiten;
Safari/WebKit-Touch-, Home-Medien- und Zoomchecks erfolgreich. Keine Tests mit
Produktions-Schreibzugriffen, keine Live-Beiträge automatisch verändert.
