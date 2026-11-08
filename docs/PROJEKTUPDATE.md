# TFB – Projektupdate vom 08.11.2026

## Splash in der Bereichstabelle und historische Diagrammjahre – 08.11.2026 · v334

Splash steht als erste Zeile in der gemeinsamen Tabelle „Was interessiert die
Besucher?“, kein separater Splash-Block mehr. Eine Summenzeile enthält Gesamt,
Mitglieder und Externe; Mitglieder/Externe jeweils mit Prozentanteil an dieser
Tabellensumme. Die Tabellensumme enthält Splash-Anzeigen, die oberen Kennzahlen
und die kumulierten Jahreskurven bleiben unverändert reine Seitenaufrufe.
Kurzer Tabellenhinweis und Methodentext erklären den unterschiedlichen Umfang.
Hinter 30 Tage / Monate / Jahre erscheinen abgeschlossene Jahre automatisch als
Jahreszahl. Auswahl zeigt Januar bis Dezember genau dieses Jahres. 2026 erscheint
ab 2027, 2027 erst ab 2028. Server lehnt laufende/zukünftige Kalenderjahre als
historischen Diagrammfilter ab. Die oberen Zeitraumfilter bleiben unabhängig.
Keine Änderung an Erfassung, Speicherung oder CSV, keine Datenbankmigration.
12 Statistik-Servertests inkl. Jahreswechsel bestanden; Chromium/WebKit prüfen
Splash als erste Zeile, einzige Tabelle, Summen/Anteile, historische Jahreswahl,
CSV und 320/390/834/1440 px. Worker-Dry-Run erfolgreich. Service Worker v334.
Details RELEASE-v334.md.

Live veröffentlicht: Quellstand 69960d5, Pages-Lauf 42475414949 erfolgreich,
Worker b26b10d0-f74d-4319-9300-acc8d81668c8, Service Worker v334.
Öffentlich ausgelieferte JS-Datei enthält gemeinsame Tabelle/Summenzeile und
automatische historische Diagrammjahre; Cachedatei bestätigt v334.

## Splash und vollständige Statistik-Historie – 08.11.2026 · v333

Splash wird separat als sichtbare Öffnung erfasst, mit Mitglieder-/Externensplit,
nicht als zusätzlicher Seitenaufruf, Besucher oder Besuch. Initiale Anzeige nach
Session-Auflösung, erneute echte Öffnung zählt neu; Neurendern, Hintergrund und
Editor-Vorschau zählen nicht neu. Noch keine rückwirkenden Splash-Zahlen; Start
wird mit dem ersten Kontakt dokumentiert. Dies belegt die Einstiegsseite, nicht
die tatsächliche Sichtbarkeit eines einzelnen Sponsorlogos. Eigene Admins zählen.
Abgeschlossene Jahre erscheinen automatisch mit Jahreszahl (2026 ab 2027, danach
2027 ab 2028 usw.). Kein festes „Vorheriges Jahr“. Balkenverläufe: letzte 30 Tage,
letzte zwölf Monate bis zum aktuellen Monat rechts, sämtliche Jahre chronologisch
mit aktuellem Jahr rechts. Separater kumulierter Mehrjahresvergleich darunter:
Jan–Dez, nur Seitenaufrufe ohne Splash, Reset je Jahr, 2026 erst ab November,
keine zukünftigen Monate/vorgeblichen Daten vor Messbeginn. Monatswertetabelle
für genaue Werte und mobile Lesbarkeit ergänzt.
CSV lädt unabhängig von der Auswahl die gesamte verfügbare Aggregathistorie:
Jahre, Monate, Tage und Seiten inklusive Splash, alte freiwillige Messreihe
explizit separat. Sortierung nach Messreihe, Zeitraum und Bereich. Summen-/Detail-
ebenen klar benannt und dürfen nicht addiert werden. Kein Export von Mitglieder-
IDs, Schlüsseln oder Rohereignissen. Fehlerbehandlung und Berechtigungsprüfung.
Verbindliche Speicherregel ab v333: reine Tages-/Monats-/Jahreszähler bleiben für
die vollständige Historie erhalten, auch Seitenaggregate. Ersetzt die befristeten
Aggregatregeln v331/v332; die temporären HMAC-/Session-/Retry-Kennungen werden
weiterhin wie bisher gelöscht. Keine neue Browserkennung, keine Nutzerprofile.
Besucher und Besuche bleiben getrennt: ein angemeldetes Mitglied pro Zeitraum
ein Besucher, sämtliche Aufrufe zählen; Seiten pro Besuch = Aufrufe / Besuche.
Datenschutzinfo und Methodentext angepasst. Keine Schema-Migration erforderlich.
28 Servertests inkl. Splash, Wiederholungsschutz, Jahreswechsel, vollständigem
CSV und Gast-/Adminrechten bestanden. Chromium/WebKit inkl. 320/390/834/1440 px,
Splash-Einmalzählung, CSV-Inhalt und vollständiger Diagrammoberfläche geprüft;
Worker-Dry-Run erfolgreich. Service Worker v333. Details RELEASE-v333.md.

Live veröffentlicht: Quellstand 05a8c92, Pages-Lauf 42474205709 erfolgreich,
Worker 4ed904c8-3a6c-4f32-a5e4-e56f11b1ed83, Service Worker v333.
Echte Browserprüfung: sichtbare Öffnung der Einstiegsseite aus dem Profil und
anschließender Eintritt nach Home. Ergebnis: Splash 1 / Mitglieder 1 / Externe 0,
Seitenaufrufe separat von 10 auf 11, weiterhin 1 Besucher und 1 Besuch.
Kumulierte Kurve mit Novemberpunkt und dynamische Jahresauswahl sichtbar.
CSV vollständig serverseitig und mit echten Downloads in Chromium/WebKit-Fixtures
geprüft; Live-Download über Browserautomation nicht abschließend verifiziert
(Automationsverbindung abgebrochen). Keine synthetischen Live-Zähler erzeugt.

## Verständliche Statistik mit Jahresansicht – 08.11.2026 · v332

Verbindlicher Nachfolger der Statistikdarstellung v331: Seitenaufrufe, Besucher,
Besuche, Seiten pro Besuch und App-Aufrufe jeweils mit Mitglieder-/Externenanteil.
„Aktive Mitglieder“ und die missverständliche doppelte Zielgruppenkarte entfallen.
Mitglieder sind unterschiedliche verifizierte Konten pro Tag/Monat/Jahr; zehn
Aufrufe desselben Kontos sind ein Besucher. Externe = ohne verifizierte Anmeldung,
auch Mitglieder ohne Login; ihre tägliche Netzschätzung wird für längere Zeiträume
addiert und ausdrücklich als Schätzung gekennzeichnet, keine exakte Personenzahl.
Heute, Dieser Monat, Dieses Jahr, Vorheriges Jahr sowie Monats-/Jahrauswahl.
Diagramm: letzte 30 Tage, Monate des gewählten Jahres oder Jahresverlauf.
Tabelle: Gesamt / Mitglieder / Externe. CSV mit klaren Einheiten und Zeitraum.
Migration 0012 ergänzt vorhandene Zähler und Monats-/Jahres-Seitenaggregate;
keine bisherigen Aufrufe gelöscht. Historisch nicht sicher zuordenbare gemischte
Besuche/App-Aufrufe bleiben ausdrücklich nicht zugeordnet. Keine erfundenen
Werte vor Messbeginn. Aktuelle Monatsmitglieder einmalig für das Jahres-Set
übernommen. Tagesaggregate 400 Tage, Monate fünf Jahre, Jahre zehn Jahre;
Mitglieder-HMAC-Sets nur aktueller Tag/Monat/Jahr, keine Browserkennungen.
25 Serverprüfungen, Chromium/WebKit inkl. 320/390/834/1440 px, CSV, Jahreswechsel
und fehlende Vorjahresdaten bestanden; Worker-Dry-Run erfolgreich. Details:
RELEASE-v332.md. Service Worker v332.

Live veröffentlicht: Quellstand bf1b5ac, Pages-Lauf 42473335424 erfolgreich,
Worker 7da0046a-5ec1-4f9a-9c17-81705c3762ee, Service Worker v332.
Echte angemeldete Browserprüfung: Heute und Jahr zeigen 10 Seitenaufrufe,
1 Besucher (1 Mitglied, 0 Externe), 1 Mitgliedsbesuch, 10 Seiten pro Besuch.
Monatsdiagramm: zwölf Felder; Vorjahr: keine Messdaten und Striche statt Nullen.
Keine künstlichen Live-Ereignisse, Testkonten oder Kommentare erzeugt.

## Automatische Statistik und getrennte Mitglieder-/Gastaufrufe – 08.11.2026 · v331

Neue, verbindliche Festlegung: Statistik-Zustimmungsabfragen und Account-Eintrag
entfernt. Neue Reichweitenzählung automatisch ohne persistente Browserkennungen.
Tägliche serverseitige Besucherschätzung; Monatskarte „Besucher-Tage“, keine
personenbezogene Monatsreichweite vortäuschen. Seitenaufrufe bleiben die Kernzahl.
Eigene Admins werden mitgezählt. DNT/GPC und frühere ausdrückliche Ablehnungen
bleiben respektiert. Reine Datenschutzinformation im Footer, keine neue Abfrage.
Mitglieder-/Gastaufteilung nach verifizierter Anmeldung: Anzahl/Anteil, pro Seite
und CSV. „Ohne Anmeldung“ enthält auch Mitglieder ohne Login. Keine beliebigen
Button-/Chat-/Kiosk-Klicks erfassen. Alte freiwillige Reihe separat archiviert.
Migration 0011 additiv, keine bisherigen Nutzerdaten überschrieben. Details:
RELEASE-v331.md und STATISTIK-DATENMINIMIERUNG-v331.md. 27 Servertests plus
Chromium/WebKit-Prüfungen und Worker-Dry-Run bestanden; Service Worker v331.
Live: d9dafa9, Pages-Lauf 42471923925 erfolgreich, Worker
a2643c7d-1421-40ec-ab71-eb91db8576db. Beginn 08.11.2026, 11:33 Uhr Berlin.
Echt geprüft: 2 automatische Mitgliederaufrufe, keine Statistikabfrage.

## Antworten auf Kommentare – 08.11.2026 · v330

„Antworten“ als erste Kommentaraktion für Mitglieder. Composer und veröffentlichte
Antwort zeigen einen kompakten Zitatbezug; Tipp springt zum Original. Flache Liste
bleibt erhalten. Gespeichert wird nur die Original-ID; ausgeblendete/gelöschte
Quelltexte erscheinen nicht weiter im Zitat. Server prüft selben Beitrag,
Sichtbarkeit und unveränderlichen Bezug. Klingelhinweis auch für Kommentarautoren
unter fremden Beiträgen, vorhandener Lesestatus synchronisiert. Keine E-Mails.
18 Servertests, neue Chromium-/WebKit-Prüfungen und bestehende Kommentarprüfung
bestanden, Worker-Dry-Run erfolgreich. Details RELEASE-v330.md. Keine Migration.
Live: 01c9d17, Pages-Lauf 42470589926 erfolgreich, Worker
1bd4f53e-f079-4aee-8b9e-3a5efc1bef84, Service Worker v330.

## Chat-Kommentare: Abstand zur Linie – 08.11.2026 · v329

Erster Kommentar erhält 14px oberen Innenabstand. Avatar/TFB-Symbol und Name
stehen damit unterhalb der Trennlinie mit derselben Luft wie weitere Kommentare.
Chromium/WebKit bei 320/390/768/1440px visuell und geometrisch geprüft.
Nur CSS und Service-Worker v329; keine Daten-/Backendänderung. RELEASE-v329.md.

## Admin-Aufrufe zählen mit – 08.11.2026 · v328

Explizite Nutzerkorrektur: Admins werden ab jetzt bei normalen Websiteaufrufen
wie alle anderen mitgezählt, auch bei ausgeblendeten Werkzeugen. Frontend,
Worker und Aggregation angepasst, irreführende Ausschlusstexte entfernt.
Statistikfreigabe und übriger Datenschutz unverändert. Keine rückwirkenden Zahlen.
Vier Servertests und Chromium-/WebKit-Prüfungen mit echten Admin-Zählern bestanden.
Details RELEASE-v328.md. Keine Datenmigration, Service Worker v328.
Live geprüft: 2 echte Admin-Aufrufe, 1 Besucher, 1 Besuch, 2 Seiten/Besuch.
Freigabe im aktuellen Nutzerbrowser aktiviert. Quellstand a870aee, Pages-Lauf
42469035486, Worker 4be0e842-0142-4c9d-951a-73237d0ec54c.

## App-Anleitung dauerhaft erreichbar und HD-Bilder – 08.11.2026 · v327

Account-App-Button bleibt jetzt auch im installierten App-Modus sichtbar. Die
unveränderte Apple-/Android-Anleitung ist zusätzlich direkt über „App-Anleitung“
in den Admin-Werkzeugen erreichbar. Alle Zugänge öffnen dieselbe help()-Funktion.
Nur die automatische Installationskarte wird in der installierten App ausgeblendet.
HD-Präsentationsbilder aus der echten Oberfläche (1950px breit) liegen unter
praesentation/app-installation/. Exporttool: tools/export-install-guide.mjs.

Statistik zählt Admins absichtlich nicht; dieser Hinweis steht nun zusätzlich oben
in der Übersicht. Andere Besucher werden nur nach „Statistik erlauben“ gezählt.
Sechs gezielte Tests sowie Chromium-/WebKit-Prüfungen einschließlich direktem
Admin-Aufruf und simuliertem installierten App-Modus bestanden. Details RELEASE-v327.md.
Live: a7c0ba8, Pages-Lauf 42468674037 erfolgreich, Service Worker v327.

## Clubstatistik und App-Einstieg – 08.11.2026 · v326

Neue Admin-Ansicht #clubstatistik mit Heute/Monat, Besucher-Browsern, Besuchen,
Seiten pro Besuch, Aufrufen, unterschiedlichen Mitgliedern, App-Anteil, Tageskurve,
Seitenrangfolge und CSV. Keine rückwirkenden Zahlen; fehlende Vergleichsdaten
werden ausdrücklich benannt. Nur freiwillige Statistikfreigaben: keine IDs oder
Übertragung vor Einwilligung, keine Namen/Mails/IPs/Klickverläufe in Statistikdaten.
Monatliche Zufallskennung, 30-Minuten-Besuche, HMAC-Ableitung pro Tag/Monat,
Widerruf in Footer und Account, DNT/GPC berücksichtigt. Details RELEASE-v326.md.
Partnerstatistik bleibt deaktiviert. Migration 0010 nur neue Statistiktabellen.

Account-App-Button exakt auf Speichern-Inhaltsbreite eingerückt. Mobile Mitglieder
sehen nach Anmeldung die Installationskarte mit Apple-/Android-Anleitung;
ausblendbar, später im Account erreichbar. Im installierten App-Modus ausgeblendet.
38 Servertests bestanden; Chromium-/WebKit-Prüfungen für Statistikfreigabe,
Widerruf, Besuchsgrenzen, Adminschutz, CSV und Mobilbreiten sowie Neuanmeldung,
Profil/Kommentar und Installationshilfe erfolgreich.
Live: Worker 98f5c3de-5367-4ad8-bc3d-15b9b3a485ff, Pages-Lauf 42466162529,
Messbeginn 08.11.2026, 10:12 Uhr Berlin. Echte Admin-Ansicht geprüft.
Finales Frontend 16f3db4 / Pages-Lauf 42466428986 erfolgreich; Direktlink
#clubstatistik nach Reload ohne Splash verifiziert.

## App-Installation: farbiger Profilbutton – 08.11.2026 · v325

Account-Button jetzt Rot/Weiß in der roten Welt und Signature-Blau/Gelb in der
gelben Welt. Apple-/Android-Anleitungen und Erkennung des App-Modus geprüft.
Wichtig: Eine Installation wird beim Start als eigenständige App erkannt, nicht
zuverlässig aus einem normalen Safari-Tab. Dann sind Banner und Profilbutton
absichtlich ausgeblendet. Nur ausgeblendetes Banner: Profilhilfe bleibt verfügbar.
Aktuelle Code-Mail enthält bereits das feste gelb-blaue Logo; Nutzerbild war die
ältere Vorlage. Details und Prüfungen: RELEASE-v325.md.
Live: Quellstand 59763c3, Pages-Lauf 42464428176 erfolgreich, Service Worker v325.

## Mitgliederzuordnung und Übersicht – 08.11.2026 · v324

Eingerichtete Zugänge stehen jetzt separat oben, noch nicht gestartete Mitglieder
darunter; beide Gruppen alphabetisch nach Nachnamen/Vornamen. Der unbenutzte
Doppeleintrag des Admins wurde reversibel deaktiviert und die Mitgliedsdaten dem
bestehenden Konto zugeordnet. Ursache war ein Semikolon hinter der Import-Mail.
Import und Anmeldung bereinigen solche Trennzeichen. Eindeutiger Name plus
hinterlegte Mail verknüpfen dieselbe Person auch ohne Mitgliedsnummer; gemeinsame
Familienadressen verschiedener Personen bleiben getrennt.

Mail-Codefeld jetzt kompakt (200 × 55px), linksbündig, fest Signature-Blau auf Gelb.
32 Servertests und Chromium-/WebKit-Prüfungen bestanden. Details: RELEASE-v324.md.
Live bestätigt: 307 Mitglieder, davon 1 eingerichteter Zugang und 306 noch nicht
gestartet. Pages-Lauf 42464097341 erfolgreich; Worker
8ed65887-0de0-4db8-bb27-0f5cc8235cee; Quellstand e5a382b.

## Freischaltmail: verbindlich Gelb-Blau – 08.11.2026 · Mail-Release v323

Die tatsächliche Freischaltmail verwendet jetzt den bereits entwickelten Look
der gelb-blauen Mitgliedsanmeldungs-Mail, einschließlich Original-Logo,
Hintergrund, Typografie, gelber Linie, gelbem Codefeld mit blauen Ziffern sowie
Info-/Fußbereich. Immer Gelb-Blau, unabhängig von der Website-Farbwelt.
Keine Änderung am automatischen Zugang, Resend-Absender oder an Mitgliederdaten.

Live-Worker `3ffef93a-98d8-44d6-bbe6-0d18ea1926c8`, Quellstand `20e0b80`.
Website und Service Worker bleiben v322. Kein Pages-Deployment nötig.
Vorlage: `server/cloudflare/templates/access-mail.html`, abgeleitet aus dem
bestehenden Muster über `node tools/build-access-mail.mjs`. 19 relevante Tests,
Chromium-/WebKit-Sichtprüfung bei 320/390/760px und Worker-Dry-Run erfolgreich.
Keine zusätzliche echte Code-Mail für diesen reinen Gestaltungswechsel ausgelöst.
Details: [Mail-Release v323](RELEASE-v323.md).

---

## Automatische Freischaltung und Mitgliederverwaltung – 08.11.2026 · v322

Aktueller Live-Stand: `tfb-kiosk-v322`, Website-Code
`9b1901b9ca18eef1b7713689f9fe6b0bd4716b28`, erfolgreicher
[Pages-Lauf 42462633281](https://github.com/calvinjohncamp/tfb-website/actions/runs/42462633281).
Worker `tfb-api`: `d8352047-7169-48fa-a1de-2a33997ca6c2`. Dieser Abschnitt ersetzt
die vorherige Beschreibung der manuellen Erstfreischaltung aus v321.
Alle zuvor bestätigten Farb-/Archiv-/Bierdeckelregeln bleiben bestehen.

Verbindlicher Nutzerablauf: E-Mail aus aktiver TFB-Liste eingeben → App versendet
automatisch einen sechsstelligen Code → Code bestätigen und ein Passwort mit
mindestens zwölf Zeichen setzen → angemeldet. Danach E-Mail/Mitgliedsnummer und
Passwort. Passwort vergessen nutzt ebenfalls den automatischen Mailweg.
Keine Vorstandsgenehmigung und keine manuelle Codeanforderung nötig.
Code zehn Minuten/einmalig/fünf Versuche, Versandpause 60 Sekunden. Haupt-/Zweitmail
zulässig; bei Familienadresse zusätzliche Mitgliedsnummer. Unbekannte Adressen
bekommen keine Mail und können kein Konto eröffnen. 13 Mitglieder ohne Mail müssen
ihre Adresse über die Vereinsliste ergänzen lassen.

Resend: bestehender persönlicher Account auf ausdrücklichen Nutzerwunsch.
Separater Schlüssel `tfb-website-auth`, ausschließlich Sending access für
`padel-bielstein.de`, nach ausdrücklicher Aktionserlaubnis erzeugt und nur als
Worker-Secret gespeichert. Absender „Tennisfreunde Bielstein <tfb@padel-bielstein.de>“.
Padel-Anwendung, deren Schlüssel, Tarif und DNS unverändert. Eine echte Mail an
den eindeutig bestätigten eigenen Adminaccount wurde als Delivered verifiziert;
kein Passwort und keine Sitzung des Nutzers durch diesen Versand geändert.

Adminbereich jetzt in „Mitglieder & Zugänge“ und „Liste importieren“ getrennt.
Kennzahlen, Suche, Filter, Sortierung, Zugang eingerichtet/noch nicht gestartet,
letzter Login und letzte Aktivität. Aktiv heißt Aktion/Rückmeldung innerhalb von
fünf Minuten; Verwaltung aktualisiert alle 30 Sekunden. Früher nicht erfasste
Loginzeiten bleiben unbekannt. Produktiv mit bestehender Adminsitzung geprüft:
308 aktive Konten inkl. Verwaltung, ein Zugang eingerichtet, 307 noch nicht
aktiviert. Nicht als historische Dauerstatistik interpretieren.

Mobile App-Hilfe: kleine ausblendbare Karte nach Anmeldung, dauerhafter Link im
Profil; getrennte iPhone/iPad- und Android-Schritte. Installierte Standalone-App
zeigt keine Einladung. Normale Mitglieder können eigenes Profilbild, Chats,
Kommentare und Kiosk nutzen; Verwaltungsrechte bleiben Admins vorbehalten.

Additive Migration 0009 angelegt: nur neue Tabellen für Codes und Zugangszeiten.
Vorheriger serverseitiger D1-Wiederherstellungspunkt privat dokumentiert.
Automatischer Review lehnte lokalen Mitgliederexport ab; kein Export ausgeführt,
keine privaten Bestandsdaten oder Geheimnisse ins Repository übernommen.
29 Servertests und vollständige Chromium-/WebKit-Browserläufe mit synthetischen
Daten erfolgreich, inklusive Code+Passwort, Profilbild, Kommentar, Übersicht,
Importvorschau und App-Hilfe. Paket 276 öffentliche Dateien, sechs geänderte
Webdateien live bytegleich, automatische Registrierung und Adminübersicht live
geprüft. Keine vollständige neue npm-test-Gesamtprüfung oder native Handyinstallation.
Anleitung [Mitgliederzugang](MITGLIEDERZUGANG.md), Details [v322](RELEASE-v322.md).

---

## Mitgliederzugang geprüft und erläutert – 08.11.2026 · v321

Aktuell live: `tfb-kiosk-v321`, Code `380bc3d5ffa3a6159bbd5dfe9128d791c19edf74`,
[Pages-Lauf 42460748569](https://github.com/calvinjohncamp/tfb-website/actions/runs/42460748569)
erfolgreich. Drei Webdateien live bytegleich und Anmeldehinweise im mobilen
Live-Browser geprüft. Dieser Stand ergänzt die bestätigten Gestaltungsregeln
von v320; an den Farbentscheidungen ändert sich nichts.

Produktive Datenbank ausschließlich aggregiert gelesen: 307 aktive importierte
Mitglieder plus Verwaltungskonto; 13 importierte Mitglieder ohne E-Mail. Null
importierte Mitgliederkonten aktiviert, ein Verwaltungskonto aktiviert.
Eine beim TFB hinterlegte E-Mail ermöglicht die Anmeldung, ersetzt jedoch nicht
den persönlichen Erst-Freischaltcode vom Vorstand. Erst danach wird ein eigenes
Passwort gesetzt. Bei gemeinsamer Familienadresse ist die Mitgliedsnummer nötig;
ohne E-Mail funktioniert ebenfalls Mitgliedsnummer plus persönlicher Code.
Keine automatische Code-Mail und keine freie Registrierung.

Serverseitiger Schutz war bereits vorhanden und ist geprüft: Gäste dürfen die
öffentlichen Inhalte lesen, aber keine Beiträge/Kommentare/Medien speichern.
Aktive Mitgliedschaft und gültige Sitzung werden für geschützte Aufrufe geprüft;
deaktivierte oder gefälschte Sitzungen und externe E-Mails scheitern. Keine
Serveränderung, Migration, Mitgliederdatenänderung, echte Codeerzeugung oder
Nachrichtenversendung dieser Prüfung. Oberfläche erklärt die Beschränkung und
den ersten Zugang jetzt ausdrücklich; Gast-Kommentarknöpfe verweisen auf Anmeldung.

13 Servertests und vollständiger Chromium-/WebKit-Durchlauf mit synthetischen
Daten bestanden, einschließlich Erstaktivierung, Kommentar, Reload und Entzug
der Mitgliedschaft. Öffentliche API live 200; private/Schreibaufrufe ohne Token
und ungültige Login-/Aktivierungsversuche live 401. Keine Vollprüfung aller
Anwendungsfunktionen dieses Releases. Anleitung für den Vorstand:
[Mitgliederzugang](MITGLIEDERZUGANG.md), Nachweise [v321](RELEASE-v321.md).

---

Der Nutzer bestätigt den Abschluss mit „Alles super“. Alle in dieser Sitzung
beauftragten Website-Änderungen sind veröffentlicht. Es sind daraus keine offenen
Umsetzungsaufgaben bekannt. Die folgenden Angaben beschreiben den Endstand und
haben Vorrang vor älteren Farbversuchen und Release-Zwischenständen.

## Verifizierter Live-Stand

Website: [joern-kaemper.de](https://joern-kaemper.de/). Programm-/Cachestand v320,
Service Worker `tfb-kiosk-v320`, Live-Code `81b0a6d08cbd684019ca86c244e149fe69db3096`.
[Pages-Lauf 42457537738](https://github.com/calvinjohncamp/tfb-website/actions/runs/42457537738) erfolgreich; zuletzt geänderte CSS-Datei und Service Worker
live bytegleich mit dem geprüften Release. Die Dokumentationsaktualisierung
ändert diesen Website-Stand nicht.

## Abgestimmte Gestaltung

| Bereich | Gelbe Welt | Rote Welt |
| --- | --- | --- |
| Datumsfelder unter Aktuell, News und Save the Date | Signature-Blau #001D3D, Schrift Signature-Gelb #FFC300 | Signature-Rot #C4553A, Schrift Weiß #FFFFFF |
| Bierdeckel: Name | Signature-Blau, klein und unten zentriert | Schwarz #171717, gleiche Größe und Position |
| Bierdeckel: übrige Texte | Bisherige Gestaltung | Sämtliche Texte Schwarz #171717, einschließlich Betrag, Datum und Abrechnungshinweis |
| Bierdeckel: Ball und Striche | Signature-Gelb | Signature-Rot |
| Karussell-Zurück-/Weiterkreise | Transparente Fläche, gelbe Kontur | Transparente Fläche, rote Kontur |
| Aktive Karussell-Seitenanzeige | Gelb | Rot |
| TFB-Absenderlogo im Chat | Signature-Blau | Signature-Rot |

Der Bierdeckel zeigt Vor- und Nachnamen des angemeldeten Mitglieds in dezenter
Schrift. Lange Namen dürfen auf zwei Zeilen umbrechen. In Rot steht der
Abrechnungshinweis mit voller Deckkraft, damit auch er schwarz erscheint.
Das TFB-Absenderlogo folgt der Welt sofort, auch in bestehenden Beiträgen,
Kommentaren, Übersichten und der Absenderauswahl. Persönliche Avatare bleiben
unverändert. Keine Änderungen an Autorendaten oder Berechtigungen.

## Clubarchiv

- Der vollständige Bericht „Gemeinsam Leben retten – Defibrillator bei den
  Tennisfreunden Bielstein“ ist mit allen acht Originalabsätzen und Bild enthalten:
  [Bericht öffnen](https://joern-kaemper.de/#club/archiv/beitrag/start-defibrillator).
- Einordnung 28.10.2026: Bild-Upload und letzte Änderung der alten Startseite
  liegen an diesem Tag. Ein separates Beitragsdatum ist nicht vorhanden; die
  Herleitung ist im Archivdatensatz dokumentiert. Der Nutzer hat inzwischen
  bestätigt, dass der Bericht bei ihm erschienen ist.
- Das Foto liegt eigenständig im öffentlichen Paket unter
  `assets/clubarchiv/defibrillator-2026-10.webp`.
- Kein „Save the Date“, keine Terminspalte und kein News-/Terminumschalter im
  Clubarchiv. Der Beitragsstrom ist einspaltig, bis maximal 900px breit. Bereits
  vorhandene historische Termin-Detailadressen bleiben lesbar.
- Der Archivbestand wird mit Versionsparameter und `cache: no-cache` geladen;
  auch der Service Worker revalidiert ihn. Ein Client-Cache war eine plausible,
  nicht auf dem Nutzergerät nachgewiesene Ursache der verzögerten Sichtbarkeit.

## Prüfung und Veröffentlichungen

Die Änderungen wurden gezielt in Chromium und WebKit geprüft: beide Welten,
Handy/Tablet/Desktop, Datumsfelder bei 390/834/1440px; Bierdeckel zusätzlich bei
320px mit normalem/langem Namen und vielen Strichen. Archiv samt Bild und
Absenderdarstellung wurden im Browser geprüft; keine beobachteten Browserfehler
oder Überläufe. Keine neue vollständige npm-test-Gesamtprüfung dieser Sitzung.
Release-Details stehen in [v312](RELEASE-v312.md) bis [v320](RELEASE-v320.md).
Die zuletzt erprobte schwarze Datumsschrift auf Rot (v318) wurde mit v320
zugunsten weißer Schrift verworfen. Schwarze Bierdeckeltexte aus v319 bleiben.

## Vereinbarte Arbeitsweise

Fertige beauftragte Website-Änderungen immer direkt veröffentlichen; kein
zusätzliches OK zum Deployment erfragen. Releases isoliert auf dem aktuellen
`origin/main` vorbereiten und nur die beauftragten Änderungen übernehmen.
Die Dropbox-Arbeitskopie enthält zahlreiche andere Änderungen und ist kein
pauschal freigegebenes Veröffentlichungspaket. Diese Sitzung änderte Frontend
und statische Archivdaten; keine Worker-/D1-Migration oder CMS-Schreiboperation.

Weiterführend: [Projektgedächtnis](PROJEKTGEDAECHTNIS.md) und
[Übergabe](UEBERGABE.md).
