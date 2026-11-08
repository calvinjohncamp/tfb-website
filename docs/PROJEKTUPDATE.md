# TFB – Projektupdate vom 08.11.2026

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
