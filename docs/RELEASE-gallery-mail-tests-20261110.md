# Galerie, Testmail und Mailarchiv nach Jahren · 10.11.2026

Bestandsprüfung: sieben dedizierte Jahresgalerien 2014–2020 bereits als Beiträge
im Clubarchiv. Alte Galerie-Seiten 2022/23/24 sind im bisherigen Import bewusst
Aliasse der entsprechenden Bielstein-Open-Galerien. Keine Bilder neu importieren
oder doppelt speichern. Neue Route #club/galerie, vierter Clubarchiv-Pill Galerie.
10 Jahrgänge, 23 Alben, 1935 vorhandene Bilder. Jahrgangs-Pills primär Blau/Rot,
Album-Pills alternativ Gelb/Schwarz. Fünfteilige Collage öffnet bestehendes
Vollbildalbum mit allen Fotos, vor/zurück, Tastatur und Touch. Direkt zurück Club.
Nur die sieben alten Jahresgalerie-Einträge aus Feed und Suchübersicht ausgeblendet.
Artikel mit eigenen Bildern, gewöhnliche Fotobeiträge und übrige Archivthemen
bleiben erhalten. Alte Jahresgalerie-Beitragslinks führen in die neue Galerie.
Bielstein-Open-URLs bleiben erhalten. Clubarchiv und Mitgliederinfos nun symmetrisch
mit jeweils vier Pills im 2×2-Raster.

Mailbereich: links Mail Versand mit Testmail an Admin und deaktiviertem Mail an
alle; darunter Mail Archiv mit Jahrgängen nach Briefdatum. Archivvorlagen laden,
bearbeiten, speichern, kopieren und löschen. Löschen ist intern reversibel und
kann unmittelbar rückgängig gemacht werden; alte offene Tabs können gelöschte
Datensätze nicht unbemerkt wiederbeleben. ETag-Konfliktschutz bleibt erhalten.

Testversand POST /admin/member-mail/test verwendet ausschließlich die primäre
gültige hinterlegte Adresse des aktuellen authentifizierten Admins (sonst seine
zweite Adresse). Kein frei wählbarer Empfänger und kein Zugriff auf eine
Mitgliederverteilerliste. Betreff [TFB Test]. Bestehende Resend-Anbindung und
verifizierter Absender; maximal 10 Anfragen/15min/IP. Request-UUID, private
R2-Belege und Provider-Idempotenzschlüssel verhindern doppelte Zustellung bei
Wiederholungen nach verlorenen Antworten. Vorschau und Server nutzen denselben
kanonischen HTML-Renderer (member-mail-renderer.mjs); Textalternativfassung dabei.
Testversand verändert keine Archivvorlage. Keine Rundmailfunktion oder Bulkroute.

Adminleiste: E-Mail an alle Mitglieder vor dem letzten größeren Button
Datensicherung / Time Machine. 12px Trennung vor der Sicherung statt 4px zwischen
normalen Aktionen, entsprechend der Trennung zur Gestaltung. Bestehende
Wiederherstellung gesicherter Website-Inhalte bleibt unverändert; Dialogtitel
angepasst. Keine Behauptung, eine normale Inhaltswiederherstellung setze alle
Mitglieder-, Finanz- oder Maildaten zurück.

Backend 3ce2478b-1f45-43b4-b328-84a5c53e82df veröffentlicht, Basis 9eb0745d geprüft.
Keine Datenbankmigration, keine produktiven Entwürfe gelöscht und keine echten
Testmails ausgelöst. Bestehende Bindings/Secrets/Zeitplan erhalten.

20 Servertests erfolgreich, auch am gebündelten Worker: Adminschutz neuer Routen,
Testempfänger, Idempotenz, Providerfehler, reversible Löschung, Konkurrenz und
Validierung. Zwei Galerie-Inventar-/Routingtests erfolgreich. Chromium/WebKit:
alle 23 Alben und 1935 Bilder erreichbar, Collage und vorhandener Vollbildbetrachter,
alte Links, TFB-Cup-Suche bleibt funktionsfähig, kein Überlauf bei 320/390/834/1440px.
Mail-UI gegen echten Worker mit synthetischen Daten: Jahresgruppen, Test an
simulierten aktuellen Admin, deaktivierter Bulkknopf, Löschen/Rückgängig,
Speichern unter, Reload, Farbwelt, Konflikte und erhaltener Text. Vorhandene
Adminrollen-/Menüprüfung beider Browser erfolgreich. Galerie mobil/desktop
mit geladenen Originalfotos visuell geprüft.
