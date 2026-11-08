# Gezielte Antworten auf Kommentare – v330

Unter jedem sichtbaren Kommentar erscheint für angemeldete Mitglieder „Antworten“
als erste Aktion vor Bearbeiten/Löschen/Ausblenden. Bestehende Berechtigungen gelten;
Gäste lesen Kommentare/Zitate ohne Schreibaktionen. Der Composer zeigt Name und
maximal 160 Zeichen des gewählten Kommentars, Fotos ohne Text als „Foto-Kommentar“.
Bezug entfernen lässt den bereits geschriebenen Antworttext stehen. Veröffentlicht
bleibt alles in der bestehenden flachen, neuesten-zuerst sortierten Kommentarliste.
Ein kleiner Zitatblock mit gelber/roter Akzentlinie stellt den Bezug her. Antippen
scrollt/fokussiert den Originalkommentar und hebt ihn kurz hervor, einschließlich
der internen Kommentarscrollfläche und reduzierter Bewegungseinstellung.

Gespeichert wird ausschließlich replyTo als Kommentar-ID, kein Text-/Namens-Snapshot.
Angezeigte Zitate werden aus dem aktuellen sichtbaren Kommentar abgeleitet. Nach
Ausblenden oder Löschen erscheint nur ein neutraler Platzhalter. Namen/Text werden
HTML-escaped. Ursprünglicher Kommentar und Antwort behalten unabhängige Eigentümer.

Worker prüft beim Erstellen, dass das Ziel im selben Beitrag existiert, sichtbar
und nicht gelöscht ist. Selbstreferenzen und ungültige IDs werden abgewiesen.
Der publizierte Antwortbezug und zugehörige Beitrag sind unveränderlich. Bereits
bestehende Antworten bleiben editierbar, wenn das Original später verschwindet.
Moderationsregeln und serverseitige Text-/Bildredaktion bleiben erhalten. Keine
Schemaänderung: optionales Feld in vorhandenen JSON-Kommentaren, auch in sicherer
öffentlicher Projektion und zentraler Synchronisierung.

Klingel: Antworten auf eigene Kommentare zählen auch unter fremden Beiträgen.
Pro Beitrag ein gebündelter Hinweis, keine Eigenbenachrichtigung und keine Doppelung
mit Kommentaren zum eigenen Beitrag. „Neue Antwort auf deinen Kommentar“ führt in
den vorhandenen Beitrag; Lesen/Entfernen des Hinweises setzt den synchronisierten
Lesestatus. Wie die vorhandenen Hinweise sieben Tage. Keine neue E-Mail.

Prüfung: 18 gezielte Servertests bestanden (Antwortbezüge, Moderation, App-Sync,
Gast-/Schreibrechte). Neue Chromium-/WebKit-Prüfung: Vorschau, Bezug entfernen,
Senden/Synchronisieren, Sprung/Hervorhebung, beide Akzentfarben, Klingel für den
Kommentarautor/Lesestatus, Rollen, versteckte/gelöschte Zitate, Gäste und Breiten
320/390/834/1440. Vorhandene umfangreiche Kommentar-/Foto-/Moderations-/Klingel-
Browserprüfung ebenfalls bestanden. Worker-Dry-Run erfolgreich. Service Worker v330.
Keine Live-Testkommentare oder Nachrichten erzeugt, keine Migration.
