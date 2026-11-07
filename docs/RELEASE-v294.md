# Offizieller TFB-Absender im Chat – v294

Nur im Chat-Composer für Clubbeiträge erhalten tatsächliche Admins die Auswahl
„Veröffentlichen als“ mit persönlichem Profilbild/Namen oder TFB-Symbol.
Der persönliche Absender ist bei jedem neuen Beitrag voreingestellt. Die Wahl
wird am Beitrag gespeichert und beim Bearbeiten wieder angezeigt; ein Wechsel
in beide Richtungen ist möglich. Normale Mitglieder sehen keine Absenderwahl.
Home und Aktuell sowie die Kommentarfunktion erhalten keine neue Absenderwahl.

Das vorhandene App-Symbol icon-512.png enthält das reine TFB-Zeichen ohne Ball
oder Vereinsunterzeile. Es wird mit Innenabstand auf #efefef in einem Kreis mit
feinem schwarzem 1px-Rand gezeigt. Offizielle Beiträge heißen öffentlich
„Tennisfreunde Bielstein“ und zeigen dieses Symbol in Chat, Übersicht und
Gastansicht. Reine Textbeiträge brauchen weiterhin keine Medien.

Datenmodell: authorMode=tfb am Post, ansonsten persönlicher Absender. Echte
Autoren-/Besitzer-ID bleibt für Rechte und Nachvollziehbarkeit erhalten; es
wird kein gemeinsames Konto erzeugt. Server prüft bei jeder Änderung die echte
Adminrolle und Club-Scope. Ungültige/gefälschte Absender werden abgewiesen.
Kommentare bleiben persönlich; eine eingeschmuggelte Kommentar-Absenderwahl
wird nicht gespeichert. Künftige freigeschaltete Admins können diese Funktion
mit ihrem eigenen Konto nutzen. Keine bestehenden Beiträge werden umgestellt.

Zusätzlich bleibt die zuvor freigegebene Karussellwahl bei Videos nun auch im
zentralen Serverdatensatz erhalten; der Server hatte das Feld bei Videos bisher
verworfen. Kein Eingriff in Videoimport oder Wiedergabe.

Validierung: 13 Servertests einschließlich Rollenprüfung, Gästeprojektion,
Besitzer-ID, persönlicher Kommentare und Wechsel TFB/persönlich; reale Worker-
Integration im isolierten Browser mit Speichern/Neuladen, beiden Wechselrichtungen,
Standard pro Beitrag, Gastansicht, Admin-/Nichtadmin-UI und mobiler Breite.
Desktop-/Handyansicht visuell geprüft. Bestehender Chat-Karussell-Test erfolgreich.
Website-Build: 268 Dateien. Worker-Dry-Run erfolgreich. Ausschließlich synthetische
Daten in Schreibtests; Live-Inhalte werden durch das Release nicht verändert.
