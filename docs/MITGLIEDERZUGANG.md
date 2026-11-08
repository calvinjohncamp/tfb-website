# TFB-Mitgliederzugang

Stand: 08.11.2026. Die öffentliche Website darf jeder lesen. Anmeldung und
Schreiben sind aktiven TFB-Mitgliedern vorbehalten; Home/Aktuell bleiben in der
Redaktion Admins vorbehalten, Mannschaftsrechte richten sich nach der Zuordnung.
Private Konten, Mitgliederliste, Einladungen und Abrechnungen sind keine
öffentlichen Websiteinhalte.

## Erste Anmeldung eines Mitglieds

1. Beim Vorstand einen persönlichen Freischaltcode anfordern.
2. Auf der Website „Anmelden“ wählen und die beim Verein hinterlegte
   E-Mail-Adresse oder die Mitgliedsnummer eingeben.
3. „Ich habe einen Freischaltcode“ wählen, den Code eingeben und ein eigenes
   Passwort mit mindestens zwölf Zeichen festlegen.
4. Danach mit E-Mail/Mitgliedsnummer und Passwort anmelden. Zum Schreiben gelten
   zusätzlich die bestehenden Clubregeln und gegebenenfalls die Elternfreigabe.

Codes sind einmalig und 24 Stunden gültig. Die Website versendet aktuell keine
automatischen Freischaltmails. Die Vereinsliste allein aktiviert noch kein Konto.
Es gibt keine freie Registrierung mit einer beliebigen E-Mail-Adresse.

„TFB-E-Mail“ bedeutet die persönlich beim Verein hinterlegte Adresse, keine
bestimmte Maildomain. Hinterlegte Zweitadressen funktionieren ebenfalls. Bei
mehreren Mitgliedern mit derselben Familienadresse ist die Mitgliedsnummer nötig,
damit der Zugang eindeutig zugeordnet werden kann. Ohne hinterlegte E-Mail ist
der Zugang über Mitgliedsnummer und persönlichen Code möglich; für eine spätere
E-Mail-Anmeldung muss die Vereinsliste ergänzt werden.

## Freischaltung durch den Vorstand

Die Verwaltung öffnet [die Mitgliederverwaltung](https://tfb-api.calvinjohncamp.workers.dev/manage),
meldet sich mit ihrem eigenen Verwaltungskonto an, sucht das Mitglied und
wählt „Code erstellen“. Den Code gezielt dem betreffenden Mitglied übergeben.
Keine Codes oder Zugangsdaten in Projektdateien, öffentliche Beiträge oder
Sammellisten übernehmen. In dieser Prüfung wurden keine echten Codes erzeugt
oder Nachrichten versandt.

Passwort vergessen: neuer persönlicher Code vom Vorstand; damit legt das
Mitglied ein neues Passwort fest. Bereits bestehende Sitzungen werden dabei
widerrufen. Ein gültiges Passwort wird ausschließlich serverseitig geprüft.

Listenpflege erfolgt über den vorhandenen Import mit Vorschau. Eine vollständige
aktuelle Vereinsliste verwenden: Beim Import werden darin fehlende Mitglieder
deaktiviert; Änderungen der Anmeldeadresse setzen Zugang und Sitzungen zurück.
Diese Prüfung hat keinen Import und keine Änderung von Mitgliederdaten ausgeführt.

## Geprüfter produktiver Bestand

Die Datenbank wurde ausschließlich mit aggregierten SELECT-Abfragen gelesen:
307 importierte aktive Mitglieder, zusätzlich ein Verwaltungskonto, 13 importierte
Mitglieder ohne E-Mail-Adresse. Nur das Verwaltungskonto ist aktiviert; für die
übrigen Mitglieder stehen die ersten persönlichen Freischaltungen noch aus.
Diese Zahlen sind der Prüfstichtag, keine laufende Mitgliederstatistik.

## Technische Absicherung

Der Server prüft für jede geschützte Anfrage eine gültige Sitzung und ein aktives
Mitglied in der zentralen Vereinsliste. Fremde E-Mails erzeugen keine Konten.
Gäste sowie gefälschte oder deaktivierte Sitzungen dürfen weder Beiträge noch
Kommentare, Medien oder redaktionelle Änderungen speichern. Die öffentliche
Beitragsprojektion enthält keine Mitglieder-E-Mails, privaten Konten oder
unveröffentlichten Inhalte. Eine Rolle im Browser ersetzt keine Serverberechtigung.

Nachweise: [Release v321](RELEASE-v321.md),
`tools/test-cloudflare-directory.mjs`, `tools/test-guest-access.mjs`,
`tools/test-browser-member-access.mjs`.
