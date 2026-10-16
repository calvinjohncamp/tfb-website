# Geräteübergreifende Vorführung – lokal vorbereitet, v203

Stand 16.10.2026. Die Onlineversion v201 hat eine zentrale Anmeldung, speichert
Profilfoto, Bierdeckel und Chats aber im jeweiligen Browser. Safari-Cache-Löschen
behebt diese Trennung nicht und kann lokale Daten verlieren lassen.

## Vorbereitete Umsetzung

Der bestehende TFB-Cloudflare-Worker und D1 erhalten zusätzliche Tabellen über
`server/cloudflare/migrations/0003-app-sync.sql`. Es wird kein anderes Projekt
und kein Zahlungssystem verwendet. Der Kiosk bleibt eine Vorführung.

`app-sync.mjs` speichert Profilfoto und Einstellungen, einzelne Kiosk-Striche,
Chatbeiträge, Kommentare und Bildanhänge. Eine verwaltete zentrale Artikelliste
liefert Preise für neue Striche. Mitglieder können nur ihre eigenen privaten
Profildaten und Striche lesen; Chat-Zugriffe prüfen Mannschaftsrechte. Der Server
übernimmt keine Rollen oder Autorenkennungen aus dem Browser. Bildfreigaben
bleiben berücksichtigt; eine Elternfreigabe kann der Browser nicht frei setzen.
Die bestehende Mitgliederverwaltung enthält weiterhin keine verifizierten
Geburtsdaten. Das ersetzt kein vollständiges Verfahren für Minderjährige.

Jeder Schreibvorgang prüft erwartete Revisionen und wird atomar in D1 ausgeführt.
Eine eindeutige Vorgangskennung verhindert doppelte Einträge bei Wiederholung.
Große Bilddaten werden in Teilstücken gespeichert. Kleine Profilbilder bleiben
Vorschauen; die große Quelle wird erst beim Öffnen angefordert.

`cloud-sync.js` lädt nach Anmeldung den Serverstand. Aktive Seiten prüfen alle
zehn Sekunden einen kleinen Änderungsmarker und aktualisieren bei Änderungen;
beim Zurückkehren zur App wird ebenfalls geprüft. Die Oberfläche bestätigt das
Speichern erst nach einer Serverantwort. Bei Verbindungsabbruch bleibt der
Vorgang lokal in IndexedDB und wird beim Wiederöffnen mit gleicher Kennung
abgeglichen. Ein Versionskonflikt überschreibt keine neueren Daten.

## Bisherige Browserdaten übernehmen

Vor der ersten Übernahme sichert die App den Browserbestand samt Fotos in
`tfb_sync_recovery_v1` (IndexedDB). Dies ist eine lokale Wiederherstellungskopie,
keine zusätzliche Serversicherung.

Auf dem bisherigen Gerät anmelden und im Account **Bisherige Browserdaten
übernehmen** wählen. Die Vorschau nennt Foto, Striche, Beiträge und Kommentare.
Bei Verwaltungskonten kann sie auch eigene Inhalte des früheren Max-Mustermann-
Vorführkontos enthalten. Die Zuordnung muss ausdrücklich bestätigt werden.
Vorhandene Serverkennungen werden übersprungen, neuere Profile nicht ersetzt.
Abgeschlossene Beispielabrechnungen bleiben Beispiele; sie werden nicht als
echte Vereinsabrechnungen importiert. Fremde lokale Konten werden nicht übernommen.

Der direkte Datei-/localhost-Vorführmodus bleibt lokal. Liegen alte Inhalte nur
in dieser anderen Websiteadresse, müssen sie zuerst über die bestehende private
Sicherung auf dem bisherigen Gerät zur HTTPS-Adresse übertragen werden. Eine
Sicherung darf niemals in Git oder das öffentliche Websitepaket gelangen.

## Veröffentlichung in dieser Reihenfolge

1. Vorher private D1-Sicherung anlegen und Wiederherstellbarkeit prüfen.
2. Additive Schema-Migration `0003-app-sync.sql` auf die bestehende TFB-D1 anwenden.
3. Den geprüften TFB-Worker veröffentlichen; ohne Sitzung müssen `/app/state`,
   `/app/photo` und Schreibzugriffe weiterhin mit 401 abgewiesen werden.
4. Nur die geprüften öffentlichen Webdateien veröffentlichen (Service Worker v203).
   Das Werkzeug `tools/prepare-pages.py` schließt Server, Sicherungen und private
   Daten aus. `cloud-sync.js` ist ausdrücklich als öffentliche Startdatei zugelassen.
5. Am bisherigen Browser anmelden und die eigene Übernahme prüfen/bestätigen;
   anschließend mit demselben Konto auf dem iPhone anmelden. Safari-Daten behalten.

Noch kein produktiver Server oder Datenbestand wurde hierfür verändert.

## Abgrenzung

Verabredungen, Gruppen, Websitebearbeitung und zentrale Monatsabschlüsse sind
weiterhin nicht Teil dieses Abgleichs. Dafür sind eigene Serverfunktionen nötig.
Stammdatenänderungen an Name oder Login-E-Mail erfolgen über die Mitgliederverwaltung;
private Einstellungen und Profilbild über den Account. Der Offlinebetrieb kann
keinen aktuellen Serverstand garantieren; Fehler werden nicht als erfolgreiche
Speicherung gemeldet. Größere Chatbestände benötigen künftig paginierte
Datenabfragen; die Vorführung lädt den sichtbaren Verlauf samt Anhängen zusammen.

## Prüfung

67 Node-Tests und drei Prüfungen zum öffentlichen Inhalt sind bestanden. Der
Cloudflare-Worker wurde mit Wrangler als Dry-Run gebaut und die 14 Server-/
Anmeldetests auch gegen das erzeugte Bundle ausgeführt. Der Zwei-Geräte-Test
ist erfolgreich. Es wurde kein produktiver Dienst verändert.

Automatisierte SQLite-Tests prüfen Geräteübernahme, getrennte private Daten,
Mannschaftsrechte, Kommentare/Bilder, Versionskonflikte, atomare Schreibvorgänge,
Tombstones, wiederholte Vorgänge, Preisherkunft und Fotozugriff. Ein Browsertest
betreibt zwei voneinander getrennte Browserprofile gegen den tatsächlichen
Worker in einer isolierten SQLite-Umgebung. Sämtliche HTTP-Aufrufe sind dabei
abgefangen; es werden keine produktiven Dienste oder echten Mitgliederdaten benutzt.

```sh
node --test tools/test-app-sync.mjs tools/test-cloudflare-directory.mjs
node tools/test-browser-cloud-sync.mjs
```
