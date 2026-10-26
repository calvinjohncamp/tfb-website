# Geräteübergreifende Vorführung

Stand 26.10.2026: v232 zentralisiert auch die redaktionellen Seiten. Umsetzung
und Tests sind abgeschlossen und v232 ist veröffentlicht. Live-Nachweise stehen
in [UEBERGABE.md](UEBERGABE.md). Desktopstand und frisches Mobilprofil stimmen überein.
Die folgenden v222-Angaben sind historisch. Technischer Ablauf und Sicherungsumfang:
[Zentrale Redaktion](ZENTRALE_REDAKTION.md).

# Historischer Stand v222

Aktueller bestätigter Stand 17.10.2026: Website v222 (Präsentations-PDF), Profil/Kiosk/Chats seit v203,
Planung seit v204 zentral, Touch-Optimierung seit v205. Seit v210 sind auch
TFB-Partnerpflege und Splash-Texte zentral, einschließlich Jahreszahlungen und
unabhängiger Schalter für die kleinen Splash-Zeilen. Übrige redaktionelle Seiten
behalten ihren bisherigen lokalen Pflege-/Exportweg. Der frühere Browserimport
ist aus dem Konto entfernt; bestehende zentrale Daten bleiben erhalten.

App-Symbol seit v221: großes TFB ohne Ball, #171717 auf #EFEFEF; Website/Splash
behalten Ball #C4553A. Versions-URLs aktualisieren PWA-/Apple-Verknüpfungen,
bereits installierte iPhone-Symbole können erneutes Hinzufügen erfordern.
Partner-Sichtbarkeitsmessung bleibt ausdrücklich aus; vorbereitete 0,5-Sekunden-
Definition und spätere Freigabeschritte in [UEBERGABE.md](UEBERGABE.md).

Die folgenden Abschnitte dokumentieren die technische Einführung; bei älteren
Aussagen zu lokal/zentral haben diese Angaben und die aktuelle Übergabe Vorrang.

Migration, Worker und Website v203 sind nach ausdrücklicher
Nutzerfreigabe veröffentlicht. Die eigene Übernahme wurde durchgeführt und durch
Vergleich der privaten Sicherungen vor/nach der Umstellung geprüft. Profilbild,
Chatbilder/-texte und Kioskeinträge sind erhalten. Die frühere Onlineversion v201
hatte nur die Anmeldung zentralisiert. Safari-Cache-Löschen ist nicht erforderlich.

## Umsetzung

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

Diese Reihenfolge ist am 16.10.2026 für den bestehenden TFB-Server abgeschlossen.
Die eigene Browserdatenübernahme ist erledigt. Andere Mitglieder übernehmen bei
Bedarf ihren jeweiligen bisherigen Browserbestand über dieselbe Vorschau.

## Abgrenzung

Websitebearbeitung und zentrale Monatsabschlüsse sind weiterhin nicht Teil dieses
Abgleichs. Gruppen, Verabredungen und Trainingsserien sind seit v204 enthalten.
Stammdatenänderungen an Name oder Login-E-Mail erfolgen über die Mitgliederverwaltung;
private Einstellungen und Profilbild über den Account. Der Offlinebetrieb kann
keinen aktuellen Serverstand garantieren; Fehler werden nicht als erfolgreiche
Speicherung gemeldet. Größere Chatbestände benötigen künftig paginierte
Datenabfragen; die Vorführung lädt den sichtbaren Verlauf samt Anhängen zusammen.

## Prüfung

67 Node-Tests und drei Prüfungen zum öffentlichen Inhalt sind bestanden. Der
Cloudflare-Worker wurde mit Wrangler als Dry-Run gebaut und die 14 Server-/
Anmeldetests auch gegen das erzeugte Bundle ausgeführt. Der Zwei-Geräte-Test
ist erfolgreich. Danach wurden die freigegebene Veröffentlichung und der
Erhalt der bisherigen Daten separat auf der Live-Anwendung geprüft.

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


## Ergänzung v204: Planung auf allen Geräten

Gruppen, Einzelverabredungen, wiederkehrendes Training und Teilnehmerantworten
werden auch in der Vorführung zentral gespeichert. Nach der Anmeldung erhalten
alle Geräte denselben berechtigten Datenbestand. Auf dem bisherigen Gerät werden
eigene alte Planungseinträge automatisch aus dem zuvor privat gesicherten
Browserbestand übernommen. Bereits zentrale Kennungen werden übersprungen, damit
ein altes Gerät keine neueren Änderungen oder Löschungen zurücksetzt. Fremde
Beispielgruppen und simulierte Verabredungen werden nicht importiert.

Bestätigungen, Absagen, Notizen und der Lesestatus des Postfachs werden getrennt
abgeglichen. Andere Mitglieder antworten in der angemeldeten Vorführung selbst;
automatisch erfundene Zusagen sind deaktiviert. Wöchentliche Termine erzeugt der
Server beim Öffnen oder Datenabgleich, sobald der Vorlauf erreicht ist. Es gibt
keinen Hintergrundversand per E-Mail. Die Originaltermine bleiben erhalten und
werden nicht doppelt erzeugt.

Die Erweiterung verwendet die bereits vorhandenen App-Tabellen. Vor Veröffentlichung
wurde die Live-Datenbank erneut privat exportiert und erfolgreich in SQLite
wiederhergestellt (Integritätsprüfung erfolgreich, 308 Mitglieder erhalten).
20 Server-/Anmeldetests bestehen auch gegen das echte Wrangler-Bundle. Der
zusätzliche Browserlauf prüft alte Planungseinträge, eine neue Gruppe und eine
Trainingsserie vom iPad, eine echte Bestätigung und Zusage eines zweiten Kontos,
den Kaufabgleich auf iPhone/Desktop und die Wiederöffnung ohne Duplikate.


### Live-Prüfung am 16.10.2026

Worker-Version `ec3b353d-216f-42ac-87ab-7881f9cb30c4` ist veröffentlicht.
Website-v204 wurde über GitHub Actions (Lauf `38949186296`) erfolgreich bereitgestellt.
Die anschließende Ergänzung v204.1 sichert den vollständigen Übernahmeplan vor der
ersten Anfrage, sodass auch Antworten und Hinweise nach einem Verbindungsabbruch
vollständig nachgeladen werden. Dieser Fall ist im Vier-Profil-Browsertest geprüft.

Die eigene frühere Gruppe, Trainingsserie und Einzelverabredung sind wieder auf
der Live-Seite sichtbar. Ein privater Vergleich der ursprünglichen Browser-Sicherung
mit dem neuen D1-Export bestätigt sämtliche ursprünglichen Planungsfelder und
Teilnehmerantworten. Alle bereits zentral vorhandenen Datensätze (einschließlich
Fotos, Bierdeckel und Chats) sind unverändert; die 308 Mitglieder sind erhalten.
Vorher-/Nachher-Exporte und Prüfbericht liegen ausschließlich in `.private/`.
Insgesamt 73 Node-Tests, drei öffentliche Inhaltsprüfungen und die Browserprüfungen
für Geräteabgleich, Wochentage, Nachladen von Eingeladenen und nächstes Match bestehen.

Die abschließende Website-v204.1 ist mit Lauf `38949439692` erfolgreich veröffentlicht;
die ausgelieferten Dateien wurden bytegenau gegen die geprüften Quellen verglichen.
Eine zusätzliche Serverprüfung deckt eine erneute Gruppeneinladung nach früherer
Absage ab: Die neue Einladung verlangt eine neue Bestätigung.


## v205: Schnellere Touch-Bedienung

Profil, Kiosk und Listen lesen den bereits bestätigten lokalen Serverstand beim
Öffnen sofort. Sie warten nicht mehr in der Schreibwarteschlange und laden beim
Seitenwechsel nicht erneut sämtliche Chatbilder. Der Geräteabgleich läuft weiter
alle zehn Sekunden und beim Zurückkehren. Schreibbestätigungen erfolgen weiterhin
erst nach dem Servererfolg; Versionskonflikte und dauerhafte Wiederholungskennungen
bleiben erhalten. Vor einer Änderung genügt bei unverändertem Stand die kleine
Revisionsprüfung statt eines weiteren vollständigen Downloads.

Bereits gelieferte Teilnehmernamen und Foto-Vorschauen werden wiederverwendet.
Bei geändertem Serverstand wird der Fotocache neu aufgebaut; Originalfotos werden
weiterhin geschützt beim Öffnen angefordert. Unveränderte Chatbilder werden nicht
nochmals in IndexedDB geschrieben und lösen keine erneute Bildspeicher-Lektüre aus.
Verspätete Seitenaufrufe können einen später gewählten Bildschirm nicht überschreiben.

Auf Touch-Geräten entfällt die künstliche 480-ms-Verzögerung beim Bierdeckel.
Bedienelemente verwenden `touch-action: manipulation`; Spezialgesten für Bildausschnitte
und normale Vergrößerung bleiben erhalten. Der Schließenknopf hat dort 44 px,
die Glocke eine vergrößerte unsichtbare Trefferfläche.

`tools/test-browser-touch-performance.mjs` prüft echte Touch-Ereignisse in isolierten
Chromium-Profilen mit 390 und 834 px und künstlich 250 ms API-Latenz. Vergleich vor/nach:
Profil etwa 339 → 60–75 ms, Verabredungsübersicht etwa 338 → 70–85 ms. Dies sind lokale
Testwerte und keine Messung auf einem physischen iPhone oder in iOS Safari.
Geprüft sind auch schneller Seitenwechsel, direkte Bierdeckel-Navigation und kein
erneutes Schreiben unveränderter Chatbilder nach einem Kauf. Der bestehende Zwei-
und Vier-Profil-Test prüft weiterhin Datenübernahme, Fotos, Chats, Gruppen, Serien,
Zusagen, Käufe, Wiederöffnung und unterbrochene Speichervorgänge.


## Eingefrorener Abschluss v208

Am 16.10.2026 vom Nutzer bestätigt. Quellstand 4781aca, Tag
`stand-2026-10-16-v208`, Cache `tfb-kiosk-v208`. Letzte Änderung ausschließlich
20 Prozent höhere iPad-Partnerflächen; keine weitere Schema- oder Workeränderung.
Aktueller privater D1-Export unter `.private/release-v208/` wurde in SQLite
wiederhergestellt, Integritätsprüfung erfolgreich. Browserlokale CMS-Entwürfe
sind davon nicht umfasst; bestehende Browser-Sicherungsfunktion weiterhin erhalten.
