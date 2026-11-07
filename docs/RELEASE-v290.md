# Home-Admin: getrennte Werkzeuge und schnelle Reihenfolge – v290

Werkzeuge auf Home und Aktuell stehen in einer eigenen statischen Kopfzeile
über dem Beitrag. Textbuttons erhalten passende Breite statt der bisherigen
32px-Iconfelder: Position ändern, Kopieren / verschieben und Bearbeiten.
Mobile Zeilen umbrechen sauber. Die Home-Bearbeitungsleiste überdeckt keine
Artikel mehr; Fertig und Reihenfolge ändern stehen oben und unten bereit.

Neue kompakte Übersicht für alle Home-Inhalte: native Zieh-Sortierung,
Direktwahl einer Zielposition und schrittweises Verschieben. Mehrere Änderungen
bleiben zunächst im Dialog und werden mit Reihenfolge speichern gemeinsam in
einem CMS-Commit veröffentlicht. Abbrechen verwirft nur den Sortierentwurf.
Die Liste scrollt separat, sodass die Aktionen gut erreichbar bleiben. Nach
dem Speichern wird der zuletzt verschobene Inhalt gezeigt. Themenziffern und
Bildseite (links/rechts) folgen weiterhin der aktuellen Feature-Reihenfolge.

Die Übersicht lädt den neuesten Stand. Speichern verwendet aktuelle Inhalts-
felder; parallel geänderte Titel/Texte/Bilder bleiben erhalten. Veränderte
Eintragslisten oder eine anderweitig geänderte Reihenfolge werden abgewiesen,
statt neue Inhalte zu verlieren. Konflikte lassen den Sortierentwurf geöffnet.
Keine neue Datenbank-/Workerfunktion; nur vorhandene redaktionelle Speicher-API.

Prüfungen: 38 Fachtests inklusive reinem Umordnungsplan, Erhalt aktueller Felder
und Ablehnung unvollständiger/veralteter Listen. Neuer Browsertest: Werkzeuge
1440/390/320px ohne Überlappung, Direktposition/Pfeile/Ziehen, keine Speicherung
vor Freigabe, ein Commit für mehrere Änderungen, automatische Ziffern/Seiten,
Abbruch, Fehler/Wiederholung, parallele Inhaltsänderung und Einfügen, neu laden,
mobile Bedienung. Home-Medien-, Galerie- und bidirektionaler Transfer-Browsertest
grün. Galerie-Bildfolge bleibt beim Verschieben des Moduls erhalten. Echte
Inhalte ausschließlich in einer rein lesenden Vorschau geprüft. Frontend-Cache
v290. Keine tatsächlichen Home-Inhalte umsortiert und kein Quellarchiv-Upload.
