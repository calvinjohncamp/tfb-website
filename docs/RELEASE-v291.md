# Karussell-Start, öffentliche Bereiche und Mannschaftspflege – v291

Home- und Aktuell-Karussells haben im bestehenden Editor zwei direkte Optionen:
„Animation startet sofort“ und „Animation erst per Play starten“. Bestehende
Beiträge starten wie bisher automatisch. Die Einstellung gehört zum Artikel
und bleibt beim Kopieren und Verschieben erhalten. Play/Pause und Vollbild
übernehmen den aktuellen Zustand; ein neuer Seitenaufruf nutzt die gespeicherte
Startwahl. Reduzierte Bewegung bleibt berücksichtigt.

Kiosk, Chat und Dating 2.0 sind unabhängig von der Anmeldung im Menü erreichbar.
Gäste sehen das aktive Sortiment mit Preisen, veröffentlichte Chat- und
Mannschaftsbeiträge mit Medien und Kommentaren sowie den Dating-Einstieg mit
Match-, Trainings- und Gruppenfunktionen. Schreiben, Anschreiben und Einladen
führen zur Anmeldung. Persönliche Einladungen, Antworten, Konten, Käufe,
Strichlisten und Abrechnungen werden nicht öffentlich ausgegeben. Verborgene
oder gelöschte Beiträge und unveröffentlichte Medien bleiben ausgeschlossen.
Öffentliche Beitrags-DTOs enthalten weder Kontodatensätze noch E-Mail-Adressen;
Profilbilder werden dort nicht aus dem geschützten Mitgliederbestand übernommen.

Mitglieder dürfen Teamfoto, Mannschaftsporträt und Teamberichte ihrer in
member_teams zugeordneten Mannschaft zentral speichern. Der Server prüft jede
Zuordnung und erlaubt nur das einzelne Mannschaftsfeld. Fremde Teams und
Home/Aktuell bleiben gesperrt. CMS-Revisionen verhindern das Überschreiben
paralleler Änderungen; Medien gehen in den vorhandenen CMS-Speicher und dessen
Sicherungsmechanismus ein. Es werden keine Mitgliedschaften oder Adminrollen
verändert.

Anmeldung bleibt an ein vorhandenes aktives Mitgliedskonto gebunden, eindeutig
über die importierte E-Mail oder Mitgliedsnummer. Für das erste Passwort ist
ein Freischaltcode nötig. Eine beliebige E-Mail erzeugt weder Mitgliedschaft
noch Adminrechte; es wurde kein ungesicherter Selbstregistrierungsweg ergänzt.

Prüfung: 40 Server-/Redaktions-/Reihenfolgetests; Browser für Gastzugang,
öffentlichen Chat, Kiosk, Dating, beide gespeicherten Startmodi und Vollbild;
bestehende Home-Medien- und Zoomchecks; Geräteabgleich mit Anmeldung,
Kommentaren, Kiosk und Wiederholung unterbrochener Speicherungen. Pages-Build
mit 268 Webdateien; Worker-Dry-Run erfolgreich. Testdaten ausschließlich in
isolierter SQLite-/Browserumgebung. Keine Live-Inhaltsänderung im Release.
