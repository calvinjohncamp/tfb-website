# Anmeldung bei gemeinsam verwendeter E-Mail-Adresse

Live-Prüfung am 09.11.2026: 307 aktive Konten, davon ein eingerichteter Zugang.
38 primäre E-Mail-Adressen werden von mehreren Mitgliedern verwendet. Die
vorliegenden Codeanforderungen waren nicht eindeutig bzw. nicht hinterlegt;
sie wurden neutral bestätigt, ohne eine Mail zu versenden. Kein Beleg für einen
allgemeinen Ausfall des Mailanbieters. Private Mitgliederdetails bleiben außerhalb
von Repository und öffentlichem Paket.

Freischaltung, Passwortzurücksetzen und Passwortanmeldung akzeptieren jetzt
optional den vollständigen Vor- und Nachnamen zur eindeutigen Zuordnung einer
hinterlegten E-Mail-Adresse. Das Namensfeld ist direkt sichtbar. Die bestehende
Mitgliedsnummer bleibt eine Alternative. Gleiche Namen bleiben mehrdeutig und
brauchen weiterhin die Mitgliedsnummer. Namen ersetzen weder Mail-Code noch
Passwort; die öffentliche Antwort verrät keine Mitgliedschaft. Es wurden keine
Konten, Mitgliedsadressen, Rollen oder bestehenden Passwörter verändert.

Prüfungen: 21 Zugangstests erfolgreich; Chromium und WebKit mit gemeinsamen
Testadressen: Freischaltung, spätere Anmeldung und mobile Darstellung erfolgreich.
Worker-Dry-Run erfolgreich. Zusätzlich 9 von 10 App-Sync-Tests erfolgreich; der
bestehende Fehler im Altimport-Test „prices and timestamps“ tritt identisch auf
dem unveränderten produktiven Quellstand 2a7bb86 auf.
