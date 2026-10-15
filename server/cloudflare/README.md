# Geschütztes Mitgliederverzeichnis ohne Supabase

Stand 15.10.2026: Worker online, Version `da44e29e-1844-48c0-99a7-da0f5a572d96`.
Health-Check 200; anonyme Suche/Verwaltung 401; fremder Browser-Ursprung 403.
Secrets ausschließlich im Worker und lokal unter `.private/`. Verwaltungskonto
eingerichtet; Website-Anbindung aktiviert, geschützte Mitgliederliste geladen.
Die Domain hat ein bis 13.01.2027 gültiges Zertifikat; HTTPS wird erzwungen.

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
- Kiosk, Chat, Verabredungen und Gruppen sind weiterhin lokale Simulationen.
  Die Authentifizierung ergänzt keine geräteübergreifende Zustellung.
  Websitebearbeitung und simulierte Abrechnungen sind noch kein Vereinsbetrieb.
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
