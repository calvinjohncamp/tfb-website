# TFB – Projektupdate vom 08.11.2026

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
