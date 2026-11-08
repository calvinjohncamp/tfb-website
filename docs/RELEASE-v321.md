# Mitgliederzugang geprüft und verständlicher erklärt – v321

Produktiver Bestand am 08.11.2026 ausschließlich aggregiert gelesen: 307
importierte aktive Mitglieder plus ein Verwaltungskonto; 13 ohne hinterlegte
E-Mail. Nur das Verwaltungskonto aktiviert. Mitglieder brauchen für den ersten
Zugang einen persönlichen, einmaligen Freischaltcode vom Vorstand, danach ihr
Passwort. Keine freie Registrierung; E-Mail oder Mitgliedsnummer, bei geteilten
Familienadressen Mitgliedsnummer. Zweitadressen werden unterstützt.

Der bestehende Server erzwingt bereits aktive Mitgliedschaft und gültige Sitzung
vor jedem geschützten Zugriff. Kein Backend-Deployment erforderlich. Die
Anmeldung erklärt nun Mitgliederbeschränkung, ersten Code und Familienadressen.
Gast-Kommentarschaltflächen heißen „Zum Kommentieren anmelden“. Frontend v321.
Keine produktiven Mitglieder-/CMS-Änderungen, Codes oder Nachrichten erzeugt.

13 Servertests bestanden: unbekannte E-Mail/Codebindung, normalisierte Haupt- und
Zweitadresse, mehrdeutige Familienadresse, einmaliger Code, Rollen, deaktivierte
und gefälschte Sitzungen, Gast-Schreib-/Uploadverbot, öffentliche Leserechte.
Neue Browserregression in Chromium und WebKit mit rein synthetischen Daten:
Gast liest Beiträge, externer Zugang scheitert, importiertes Mitglied aktiviert,
kommentiert nach Regelbestätigung, bleibt nach Reload angemeldet; Deaktivierung
sperrt Session und Schreiben. Mobile Breite ohne Überlauf oder Browserfehler.

Live geprüft: öffentliche Beiträge 200; private Daten/Verwaltung und Commit ohne
Token 401; synthetische nicht hinterlegte E-Mail bei Login und Aktivierung 401.
Berechtigungsprüfungen ohne produktive Konto- oder Inhaltsänderung. Diff-/Syntax-
prüfung und Paket mit 274 öffentlichen Dateien erfolgreich.

Betriebsanleitung: [Mitgliederzugang](MITGLIEDERZUGANG.md).

Live: 380bc3d5ffa3a6159bbd5dfe9128d791c19edf74; Pages-Lauf https://github.com/calvinjohncamp/tfb-website/actions/runs/42460748569 erfolgreich. Drei Webdateien bytegleich, mobile Anmeldehinweise live geprüft.
