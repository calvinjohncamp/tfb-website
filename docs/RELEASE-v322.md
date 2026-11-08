# Automatischer Mitgliederzugang, Mitgliederübersicht und App-Hilfe – v322

Mitglieder fordern den Freischaltcode selbst per Mail an. Anschließend geben sie
den sechsstelligen Code ein und setzen ihr Passwort (mindestens zwölf Zeichen).
Danach normale Anmeldung mit E-Mail/Mitgliedsnummer und Passwort; erneute Mail
zum Zurücksetzen über „Passwort vergessen“. Keine Vorstandsgenehmigung nötig.
Haupt-/Zweitadresse aus aktiver Vereinsliste; Familienadresse mit zusätzlicher
Mitgliedsnummer. Unbekannte oder mehrdeutige Adressen erhalten dieselbe neutrale
Antwort, aber keine Mail. Codes: zehn Minuten, einmalig, fünf Versuche, 60 Sekunden
Versandpause, IP-Limit; nur Hash in D1. Neue Codes widerrufen alte, erfolgreiche
Passwortsetzung widerruft bestehende Sitzungen. Providerfehler werden angezeigt.

Vorhandener Resend-Account calvinjohncamp, ausdrücklich vom Nutzer freigegeben:
getrennter Schlüssel tfb-website-auth, ausschließlich Sending access und Domain
padel-bielstein.de. Nur als Worker-Secret RESEND_API_KEY hinterlegt. Absender
„Tennisfreunde Bielstein <tfb@padel-bielstein.de>“. Kein Padel-Schlüssel, DNS,
Tarif oder Padel-Anwendung geändert. Keine Schlüsselwerte in Git/Frontend.

Admin-Bereich: getrennte Reiter „Mitglieder & Zugänge“ und „Liste importieren“.
Kennzahlen, Suche, Statusfilter, Sortierung, letzte Anmeldung/letzte Aktivität;
Aktiv = Rückmeldung/Aktion in letzten fünf Minuten. Heartbeat bei sichtbarer App,
Verwaltung aktualisiert sich alle 30 Sekunden ohne Verlust der Filter. Historische
Login-Zeiten unbekannt statt erfunden. Nur echte Admins erhalten die Daten.
Listenimport bleibt Datei → Vorschau → bewusste Übernahme.

App-Hilfe: dezente Karte nach mobiler Anmeldung, ausblendbar pro Gerät, dauerhaft
im Profil erreichbar. Getrennte Apple-/Android-Schritte, nativer Installations-
prompt bei Browserunterstützung. In installierter Standalone-App kein Hinweis.
Quellen: Apple https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios
und Google https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid

Additive Migration 0009: member_access und member_login_challenges. Bestehende
Mitglieder, Passwort-Hashes, Sitzungen, Umsätze und CMS-Daten werden nicht migriert
oder zurückgesetzt. Vorheriger serverseitiger D1-Wiederherstellungspunkt privat
dokumentiert. Ein lokaler Datenexport wurde von Auto-Review abgewiesen und nicht
ausgeführt; stattdessen keine personenbezogenen Daten exportiert.

29 Servertests und vollständiger Browserlauf Chromium/WebKit bestanden:
automatischer synthetischer Versand, Code/Passwort, fremde/mehrdeutige Adresse,
Ablauf/Replay/Rate/Fehlversuche, Mailfehler, Rollen, Profilbild und Kommentar,
Adminstatus/Suche/Importvorschau, Installationshilfe/Ausblenden/Profil und responsive
Breiten 390/834/1440px. Worker-Dry-Run und Syntax-/Diffchecks erfolgreich. Keine
vollständige neue npm-test-Gesamtprüfung. Frontend-Service-Worker v322.

Live abgeschlossen: Code 9b1901b9ca18eef1b7713689f9fe6b0bd4716b28, Pages-Lauf 42462633281 erfolgreich. Worker d8352047-7169-48fa-a1de-2a33997ca6c2. Sechs Webdateien live bytegleich; Registrierung, Adminübersicht und echte Resend-Zustellung (Delivered) geprüft. Kein Nutzerpasswort geändert.
