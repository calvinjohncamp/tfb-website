# Mitglieder eindeutig zuordnen, Übersicht gruppieren, Codefeld verfeinern – v324

Ein importierter, unbenutzter Eintrag derselben Person hatte ein Semikolon hinter
der E-Mail-Adresse. Die bestehende Admin-Identität blieb erhalten; Mitgliedsnummer
und Importzuordnung wurden verknüpft, der unbenutzte Doppeleintrag reversibel
deaktiviert. Vorher serverseitigen D1-Time-Travel-Wiederherstellungspunkt erfasst.
Kein Datenbankexport, kein Passwortwechsel, keine zusätzliche echte Code-Mail.

Import und Login normalisieren abschließende Semikola/Kommas. Ein fehlendes
Mitgliedskennzeichen erzeugt beim Import keine zweite Person, sofern Name und
eine hinterlegte E-Mail eindeutig übereinstimmen. Gleiche Familienadressen bei
verschiedenen Personen bleiben getrennt. Nummern bleiben nur bei mehrdeutigen
Familienadressen als optionale Zuordnung nötig. Registrierung erstellt weiterhin
keine neuen Mitgliedsdatensätze.

Mitgliederübersicht: eingerichtete Zugänge zuerst, danach separat „Noch nicht
gestartet“. Beide Gruppen immer nach Nachnamen/Vornamen mit deutscher Sortierung.
Suche, Statusfilter, Onlineanzeige und Aktualisierung bleiben nutzbar.

Mail: Codefeld 200px breit, 55px hoch, linksbündig. Ziffern fest Signature-Blau
#001D3D auf Signature-Gelb; Outlook-/WebKit-Farbfallback. Gültigkeitshinweis
linksbündig. Vorhandener gelb-blauer Mitgliedsanmeldungs-Look bleibt erhalten.

Validierung: 32 Servertests bestanden (Mitglieder, Mailzugang, Gäste, App-Sync).
Chromium und WebKit: automatische Anmeldung, Profil/Kommentar, Rollen, Import,
Gruppierung/Alphabet, responsive Übersicht 390/834/1440px bestanden. Mail in
320/390/760px geprüft und visuell kontrolliert. Worker-Dry-Run bestanden.
Frontend-Service-Worker v324. Keine Schemaänderung.
