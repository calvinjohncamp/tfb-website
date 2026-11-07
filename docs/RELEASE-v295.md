# Karussell: Safari-Touch, Fokus und bewusster Play-Start – v295

Die bestehende Pausenlogik konnte durch verbliebenen Fokus auf einer Bildkarte
auch nach Touchbedienung dauerhaft stoppen. Im WebKit-Test mit simuliertem
1024x1366-iPad-Touchprofil zunächst reproduziert; der Test scheiterte vor dem Fix
an „Touch focus must not freeze autoplay“. Normaler Safari-Autostart funktionierte
im selben Test, es handelt sich nicht um ein generelles Apple-Animationsverbot.

Fokus-Pause wird nun durch echte Tab-Tastaturbedienung aktiviert und durch
Pointer-/Touchbedienung aufgehoben. Touch-Fokus stoppt die Bewegung nicht mehr.
Maus-Hover pausiert nur bei Geräten mit passender Hover-/Feinzeiger-Fähigkeit.
Explizites Play wird nicht unmittelbar vom darüberstehenden Mauszeiger blockiert.
Sichtbarkeitsbeobachtung startet den Zwei-Sekunden-Timer nur neu, wenn sich die
Sichtbarkeit wirklich geändert hat. Beobachter/Modality-Listener werden beim
Entfernen des Karussells sauber abgemeldet.

Systempräferenz „Bewegung reduzieren“ unterbindet weiterhin den automatischen
Start. Der Play-Button ist dort aber nicht mehr gesperrt: bewusstes Starten ist
möglich. Diese Entscheidung gilt für die aktuelle Ansicht, wird in Vollbild und
zurück übernommen, aber nicht als dauerhafte Einstellung gespeichert. Eine neu
aktivierte Reduktionspräferenz setzt die Freigabe zurück. Neue Seitenaufrufe
respektieren wieder System- und Admin-Startwahl. Explizite Pause bleibt erhalten.
Auf Home und Aktuell gilt derselbe gemeinsame Controller.

Prüfung: neuer Test in Safari/WebKit und Chromium mit Touchprofil für Autostart,
verbliebenen Touch-Fokus, Admin-manuellen Start, reduzierte Bewegung ohne Autoplay,
explizites Play und Vollbild-Übernahme sowie Pause. Zusätzlich Desktop-Kontext
für erhaltene Tab-Fokus-Pause und Freigabe per Maus. Bestehende Home-Medien- und
Zoom-Browserprüfungen angepasst und regressionsgeprüft. Kein physisches iPad
ferngetestet; der abschließende Gerätetest bleibt beim Nutzer. Keine CMS-Inhalte
oder Admin-Startwerte geändert; keine Backend-Änderung.
