# Geschütztes Mitgliederverzeichnis ohne Supabase


## Aktueller Betriebsstand – 17.10.2026 · Website v222

Zuletzt veröffentlichter Worker `f2973171-e161-4b08-a74e-0f240c3e58a1` (v213),
Deploymentnachweis `.private/release-v213/worker-deploy.log`. Seitdem nur Website-
Feinschliffe bis v222, keine erneute Worker-/Datenbankänderung. Aktuelle Freigaben
und Live-Quellstand in [UEBERGABE.md](../../docs/UEBERGABE.md).

Partnerpflege und Splash-Texte seit v210 zentral; Migration 0005 eingespielt.
Öffentliche Konfiguration enthält keine Admin-Kontakt-/Finanzfelder, Änderungen
prüfen serverseitig die Adminrolle. TFB-Daten bleiben von Padel getrennt.
`PARTNER_MEASUREMENT_ENABLED=0` und Frontend-Messung aus. Statistikmigration 0004
noch nicht eingespielt; kein automatischer Start am vorgeschlagenen 01.01.2027.
Vorbereitete Sichtbarkeit: gemeinsame Partnerzeile, 50 % / 0,5 Sekunden, zwei
Logokontakte aber ein Seitenaufruf mit Partner-Sichtbarkeit. Aktivierung braucht
separaten Auftrag, Sicherung und additive Migration; kein Schema-/Setup-Neustart.

Secrets ausschließlich im Worker und lokal unter `.private/`. Verwaltungskonto
ist eingerichtet; Setup und lokale Datenübernahmen nicht erneut ausführen.

Worker `tfb-api`, D1 `tfb-website`, Binding `DB`. Getrennt von den vorhandenen
Folio- und Padel-Anwendungen. Die Datenbankkennung in `wrangler.jsonc` ist keine
Zugangsberechtigung. Vollständige Mitgliederlisten, Konten, Freischaltcodes und
Cloudflare-Zugangsdaten gehören niemals in Git oder das Pages-Paket.

## Umfang und Grenzen

- Server prüft jede Sitzung und den aktiven Mitgliedsstatus. Nur die Verwaltung
  kann Listen importieren und persönliche Freischaltcodes erstellen.
- Erstanmeldung braucht einen zufälligen, einmaligen Code (24 Stunden gültig).
  Bekanntsein einer E-Mail-Adresse allein schaltet keinen Zugang frei.
- Keine öffentliche E-Mail-/Mitgliedschaftsauskunft. Die Anmeldung verwendet
  E-Mail oder Mitgliedsnummer. Bei geteilter Familien-E-Mail die Nummer benutzen.
- Passwörter: HMAC mit eigenem geheimem Server-Pepper, zufälliges Salt, PBKDF2
  SHA-256 mit 100.000 Iterationen (workerd-Grenze). Rate-Limit vor jeder Anmeldung.
- Sitzungen: zufällige 256-Bit-Bearer-Tokens, nur deren SHA-256-Hashes in D1,
  12 Stunden gültig. Browser speichert sein Token nur im Sitzungsspeicher.
- Suche ab zwei Zeichen, maximal acht Treffer; Namen/IDs ohne E-Mail-Adressen.
  Keine Schnittstelle für den Download der gesamten Liste durch Mitglieder.
- Listenimport ist atomar, bietet eine Vorschau, übernimmt nur Nummer, Namen
  und E-Mail-Felder und akzeptiert keine Rollen vom Browser. Deaktivierte
  Mitglieder verlieren ihre Sitzungen. Änderungen der Login-Adresse widerrufen
  Passwort, Aktivierung und Sitzungen. Ein bestehender Admin bleibt erhalten.
- D1-Datenbank und Servercode werden nicht an Websitebesucher ausgeliefert.
  CORS schränkt Browser-Ursprünge ein, ersetzt jedoch keine Authentifizierung.
- Seit v203 sind Profilfoto, Kiosk-Striche und Chat/Kommentare/Anhänge zentral.
  Seit v204 sind auch Verabredungen, Gruppen und Trainingsserien zentral.
  Übrige redaktionelle Websitebearbeitung bleibt lokal; Partner und Splash-Texte
  sind seit v210 die zentralen Ausnahmen.
  Die Kiosk-Vorführung ist weiterhin kein produktiver Abrechnungsbetrieb.
- Die Website-Schaltung ist für die öffentlichen Website-Hosts aktiviert.
  Anfragen mit Zugangsdaten erfordern HTTPS. In der Vorführung blendet der rote
  Ball Admin-Werkzeuge auch bei geschützter Anmeldung ein/aus; nach Neuladen sind
  sie ausgeblendet. Zum Importieren/Sichern zuerst über den Ball einblenden.
  Diese Ansicht ändert keine serverseitigen Verwaltungsrechte.
- Vorhandene lokale Browserdaten werden nicht durch Cloud-Daten ersetzt.

## Einrichtung

1. Lokal mit Wrangler bei Cloudflare anmelden. Erforderliche OAuth-Rechte:
   `account:read`, `user:read`, `workers:write`, `workers_scripts:write`, `d1:write`.
2. `wrangler deploy --config server/cloudflare/wrangler.jsonc` ersetzt nur
   den Platzhalter `tfb-api` und erhält das konfigurierte D1-Binding.
3. Zwei zufällige Server-Secrets `PASSWORD_PEPPER` und `SETUP_TOKEN` setzen.
   Lokal vorbereitete Werte liegen ausschließlich unter `.private/` (ignoriert).
   Den Pepper sicher aufbewahren; ein Verlust macht vorhandene Passwort-Hashes
   unbrauchbar. Niemals Secrets ausgeben oder in Commit/Chat/URLs aufnehmen.
4. Unter `https://tfb-api.calvinjohncamp.workers.dev/manage` die Ersteinrichtung
   mit dem lokalen Einrichtungsschlüssel, eigenem Namen, Vereins-E-Mail und einem
   selbst gewählten Passwort abschließen. Die Tabellen werden erst durch den
   autorisierten Setup-Aufruf angelegt. Der zweite Setup-Aufruf wird abgewiesen.
5. Online ohne Token 401 prüfen, mit Anmeldung den eigenen Datensatz prüfen.
6. Website-Schaltung aktivieren und veröffentlichen. Im eigenen Websiteprofil
   die Mitgliederliste aus Excel/CSV mit Vorschau importieren. Bei Bedarf eine
   lokale Sicherung in einen nur lokal gespeicherten Importdatensatz umwandeln;
   die vollständige Sicherung bleibt immer außerhalb der Veröffentlichung.
7. Freischaltcodes auf `/manage` gezielt für Mitglieder erzeugen und persönlich
   weitergeben. Dieses Projekt verschickt keine Nachrichten automatisch.

Keine Zahlungs-/Domain-/Nameserveränderung erforderlich. D1/Workers-Nutzung
zählt zum vorhandenen Cloudflare-Konto und dessen Tarifgrenzen.

## Prüfung

Zuerst mit Wrangler einen lokalen Probelauf erstellen:

```sh
wrangler deploy --dry-run --config server/cloudflare/wrangler.jsonc --outdir /tmp/tfb-worker-bundle
node --test tools/test-cloudflare-directory.mjs
```

Die Tests verwenden echte lokale SQLite mit erfundenen Daten. Anschließend mit
`wrangler dev --local --port 8791` eine isolierte D1-Testdatenbank mit synthetischen
Secrets starten (niemals Produktions-D1). Der optionale Browserlauf
`node tools/test-browser-directory.mjs` erwartet das synthetische Runtime-Testkonto.
Er prüft Freischaltung, Login, Namensvorschläge im Einladungsformular, Abmeldung
und dass die fremde E-Mail nicht in den lokalen Demo-Datenbestand kopiert wird.

Weitere Regressionen: bestehende Node-Tests und `npm run test:browser`.

## Eigene Mannschaften (15.10.2026)

`member_teams(member_id, team_key)` enthält die privaten Mannschaftszuordnungen.
Bei bestehender Datenbank vor dem Worker-Update die reine Schema-Migration
`migrations/0002-member-teams.sql` ausführen. Neue Datenbanken erhalten die Tabelle
über `schema.sql`. Login und `/auth/session` liefern nur die Mannschaften des
jeweils angemeldeten Mitglieds; Namenssuche liefert keine Mannschaftslisten.

Der private nuLiga-Abgleich liegt ausschließlich lokal unter `.private/`.
Nicht eindeutige Namen nicht automatisch zuordnen. Bei neuen Mitgliedern oder
neuen Mannschaftsmeldungen die private Relation aktualisieren; keine Zuordnung
aus der Nachricht eines Mitglieds oder aus ausgewählten Beitragsempfängern ableiten.
Für den Vereinsbetrieb diese Relation beim geplanten Supabase-Umzug übernehmen.

## Veröffentlichter Ausbau v203: App-Daten

`app-sync.mjs` und additive Migration `0003-app-sync.sql` ergänzen zentrale
Profile/Fotos, Vorführ-Kioskstriche, Chats/Kommentare/Anhänge und den Katalog.
Am 16.10.2026 nach ausdrücklicher Freigabe veröffentlicht. Vor Website-v203
wurde D1 gesichert, die Migration angewendet und der Worker aktualisiert.
Bestehende Tabellen und Mitgliederzugänge blieben erhalten. Technischer Umfang, Übernahme vorhandener
Browserdaten und Betriebsgrenzen:
[GERAETEUEBERGREIFENDE_DATEN.md](../../docs/GERAETEUEBERGREIFENDE_DATEN.md).

Tests sind auch ohne vorab erzeugtes Wrangler-Bundle möglich. Der gemeinsame
Testloader liest die tatsächlichen Quellen; `TFB_WORKER_BUNDLE` erlaubt alternativ
das Testen eines echten Wrangler-Dry-Run-Bundles. Zwei getrennte Browserprofile
prüfen Anmeldung, eigene Datenübernahme, Foto, Bierdeckel, Chats/Kommentare,
Aktualisierung, Wiederöffnung und wiederholte Speicheranfragen.


## Ausbau v204: Gruppen, Verabredungen und Trainingsserien

`meet-sync.mjs` verwendet die bestehenden App-Tabellen; eine weitere Schemaänderung
ist nicht nötig. Gruppen und Serien gehören ihren Erstellern. Antworten sind
getrennte Datensätze pro Mitglied, damit gleichzeitige Zusagen einander nicht
überschreiben. Einladungsrechte werden auf dem Server geprüft. In der angemeldeten
Vorführung werden keine Antworten anderer Mitglieder mehr simuliert.

Der Server erzeugt fällige wöchentliche Termine beim Datenabgleich mit stabilen
Kennungen. Abgesagte Termine werden nicht neu erzeugt. Das ist kein zeitgesteuerter
E-Mail-Versand: Ohne aktive App erfolgt die Materialisierung beim nächsten Öffnen.
Vorhandene eigene Gruppen, Serien, Verabredungen und ihre Antworten werden nach
lokaler Sicherung automatisch übernommen. Bereits vorhandene Serverkennungen
werden einschließlich Löschmarkierungen übersprungen.

Prüfung: `node --test tools/test-meet-sync.mjs` und
`node tools/test-browser-meet-sync.mjs`. Der Browsertest verwendet vier getrennte
Profile mit synthetischen Daten für Desktop, iPad, iPhone und eine eingeladene Person.
