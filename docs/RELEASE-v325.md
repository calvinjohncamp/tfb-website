# App-Button in Signature-Farben und Installationsprüfung – v325

Profil-/Account-Button „TFB als App auf dem Startbildschirm“: in der roten Welt
Signature-Rot (#C4553A) mit weißem Text, in der gelben Welt Signature-Blau
(#001D3D) mit Signature-Gelb (#FFC300). Service Worker v325.

Installationslogik geprüft: iPhone und iPad (einschließlich iPad mit Desktop-UA)
bekommen die Apple-Anleitung, Android die Chrome-Anleitung; beide Plattformen
sind manuell wählbar. Desktop zeigt die Anleitung ohne automatisches Banner.
Apple: Safari > Teilen > Zum Home-Bildschirm > Hinzufügen. Android: Chrome >
Drei-Punkte-Menü > Zum Startbildschirm hinzufügen / App installieren. Wenn
beforeinstallprompt angeboten wird, gibt es zusätzlich den nativen Installationsknopf.

Erkannt wird der aktuelle App-Modus (display-mode: standalone beziehungsweise
navigator.standalone), keine vollständige Liste installierter Apps. Beim Start
über das installierte App-Symbol sind Banner UND Profil-Installationsbutton
absichtlich ausgeblendet. Im Safari-Tab lässt sich eine vorhandene Installation
nicht zuverlässig nachweisen. Ein ausgeblendetes Banner bleibt lokal verborgen;
der Profilbutton bleibt außerhalb des App-Modus dennoch erreichbar.

Das zweite Nutzerbild zeigt die ältere Code-Mail. Die seit v323/v324 tatsächlich
versandte Vorlage enthält bereits oben das feste gelb-blaue Original-TFB-Logo
(228px, mobil begrenzt), unabhängig von der Welt. Öffentliches Logo erreichbar;
Mailtests prüfen Logo-URL und festes Branding. Worker bleibt auf dem geprüften
v324-Stand 8ed65887-0de0-4db8-bb27-0f5cc8235cee; kein erneuter Codeversand nötig.

Prüfung: 9 gezielte Tests (Installationsverhalten und Mailzugang) bestanden.
Browserprüfung Chromium/WebKit umfasst beide Buttonfarben und vorausgewählte
Geräteanleitung sowie Anmeldung, Profil/Kommentare, Mitgliederübersicht und Rollen.

Veröffentlicht: Quellstand 59763c3, Pages-Lauf 42464428176 erfolgreich,
live ausgelieferter Service Worker tfb-kiosk-v325 bestätigt.
