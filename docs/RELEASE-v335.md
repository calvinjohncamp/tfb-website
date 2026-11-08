# Einheitliche Admin-Leiste auf allen Seiten – v335

Bei eingeblendeten Admin-Werkzeugen steht die Farbwelt-Auswahl immer in der ersten
Zeile. Darunter links beginnend und in fester Reihenfolge: Splash bearbeiten,
Home bearbeiten, Partner verwalten, Mitglieder verwalten, Clubstatistik,
App-Anleitung, Sicherungen. „Home bearbeiten“ ist seitenunabhängig sichtbar und
nutzt die vorhandene direkte Navigation in den Home-Editor. Flex-Umbruch der
Verwaltungsbuttons innerhalb der zweiten und weiterer Zeilen bei kleiner Breite.
Kiosk zeigt die Leiste auch vor der eigenen Lastschriftfreigabe eines Admins.
Seitenbezogene Bearbeitungsfunktionen unten bleiben auf ihrer jeweiligen Seite;
kein zusätzlicher Home-Stift unten in Kiosk/Chat usw. Keine Änderung an Rollen,
Speicherung oder API. Nach Reload bleibt die Admin-Leiste zunächst ausgeblendet.
Bestehender Admin-Test auf realistische lokale Worker-/CMS-Fixtures aktualisiert.
Chromium/WebKit: identische sieben Buttons auf Home, Kiosk, Chat, Aktuell, Sport,
Club und Dating 2.0; 390/834/1440 px, feste zweite Zeile, linksbündiger Beginn,
kein horizontaler Überlauf. Home-Editor von Dating 2.0 aus tatsächlich geöffnet;
Ein-/Ausblenden, Rolle nach Session-Refresh, Reload und gewöhnliches Mitglied
geprüft. Service Worker v335. Details RELEASE-v335.md.

Live veröffentlicht: Quellstand a5df1fa, Pages-Lauf 42475809621 erfolgreich,
Service Worker v335. Öffentlich ausgelieferte app.js, design-preview.css und
sw.js geprüft. Auch der bestehende Projektordner besteht den erweiterten
Admin-Test; dessen bereits angepasste lokale Fixture-Integration bleibt erhalten.
