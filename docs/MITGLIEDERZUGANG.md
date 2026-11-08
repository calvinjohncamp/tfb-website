# TFB-Mitgliederzugang

Stand: 08.11.2026 · v322. Jeder darf die öffentlichen Websiteinhalte lesen.
Anmelden und Schreiben bleiben aktiven TFB-Mitgliedern vorbehalten. Nach Anmeldung
können Mitglieder ihr Profilbild ergänzen, Chats und Kommentare verfassen und den
Kiosk nutzen. Bestehende Club-/Fotoregeln gelten weiter. Adminrechte und Pflege
fremder Mannschaften werden dadurch nicht freigegeben.

## Ohne Umweg zum eigenen Account

1. „Anmelden“ → „Erster Besuch? Zugang anlegen“.
2. Die persönlich beim TFB hinterlegte E-Mail-Adresse eingeben.
3. „Freischaltcode senden“: Die App erzeugt und versendet ihn automatisch.
4. Den sechsstelligen Code aus der Mail eingeben und ein Passwort mit mindestens
   zwölf Zeichen festlegen. Danach ist das Mitglied angemeldet.
5. Beim nächsten Mal E-Mail/Mitgliedsnummer und Passwort verwenden.

Keine Genehmigung oder manuelle Codeerstellung durch den Vorstand notwendig.
Der Code ist zehn Minuten gültig und einmal verwendbar. Ein neuer Code kann nach
60 Sekunden angefordert werden; fünf falsche Eingaben sperren den jeweiligen Code.
„Passwort vergessen“ startet denselben Mailweg und erlaubt ein neues Passwort.

Haupt- und Zweitadressen aus der Vereinsliste funktionieren. Bei einer gemeinsamen
Familienadresse zusätzlich unter „Gemeinsame Familienadresse?“ die Mitgliedsnummer
angeben. Ohne hinterlegte Mail muss zuerst die Vereinsliste ergänzt werden.
Die neutrale Bestätigung nach dem Anfordern verrät Außenstehenden nicht, ob jemand
Mitglied ist. Bei fehlender Mail auch Spam-Ordner und Vereinsadresse prüfen.

## Mitglieder verwalten

Im Admin-Bereich öffnet „Mitglieder verwalten“ zwei Reiter:

- **Mitglieder & Zugänge:** Kennzahlen, Namens-/Mail-/Nummernsuche, Statusfilter,
  letzte Anmeldung und letzte Aktivität. „Aktiv“ heißt innerhalb der letzten fünf
  Minuten; es ist keine sekundengenaue Onlinegarantie. Frühere Login-Zeiten wurden
  vor dieser Funktion nicht erfasst und werden deshalb als unbekannt angezeigt.
- **Liste importieren:** vollständige Excel-/CSV-Liste wählen, Vorschau prüfen,
  dann übernehmen. Fehlende Mitglieder werden deaktiviert. Änderungen der
  Login-Adresse widerrufen den bisherigen Zugang und bestehende Sitzungen.

Nur die serverseitig geprüfte Verwaltung darf diese Übersicht laden. Private
Mitgliederlisten, Konten und Kioskabrechnungen sind keine öffentlichen Inhalte.

## Versand und spätere Übergabe

Resend läuft vorerst über den vorhandenen persönlichen Account, mit einem
separaten reinen Versandschlüssel für TFB. Aktueller Absendername Tennisfreunde
Bielstein, Versandadresse tfb@padel-bielstein.de aus der vorhandenen verifizierten
Domain. Für den späteren TFB-Account nur Worker-Secret RESEND_API_KEY und bei Bedarf
AUTH_EMAIL_FROM ändern; keine Schlüssel ins Frontend oder Repository schreiben.
Die ältere manuelle Freischaltung bleibt als bestehender Verwaltungs-Notweg
technisch erhalten, ist aber nicht mehr der reguläre Mitgliederablauf.

## Website als App

Nach mobiler Anmeldung erscheint eine dezente, ausblendbare Installationskarte.
Die Anleitung bleibt im Profil unter „TFB als App auf dem Startbildschirm“.
iPhone/iPad: Safari → Teilen → Zum Home-Bildschirm → Hinzufügen.
Android: Chrome → ⋮ → Zum Startbildschirm hinzufügen / App installieren.
In einer bereits installierten App bleibt die Karte ausgeblendet.

Prüfnachweise: [Release v322](RELEASE-v322.md), `tools/test-email-access.mjs` und
`tools/test-browser-member-hub.mjs`. Die Prüfung vor der automatischen Freischaltung
zählte 307 importierte aktive Mitglieder plus Verwaltungskonto, davon 13 ohne Mail;
das ist ein Stichtag und keine aktuelle Zugangsstatistik. Der Adminbereich zeigt
ab v322 den laufenden Stand.
