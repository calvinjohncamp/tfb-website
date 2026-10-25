# TFB – Übergabe für die nächste Sitzung

## Feinschliff v223 – 25.10.2026

Nach erfolgreicher Anmeldung immer direkt Home. Gruppen in Dating 2.0 enthalten
bei Neuanlage nur Name und Mitglieder. Alte Trainingsvorgaben bleiben kompatibel
erhalten, werden aber in den Gruppen nicht mehr angezeigt. Der immer sichtbare
Bereich „Regelmäßige Trainingsgruppen“ bietet „Training anlegen“; Trainings haben
einen eigenen Namen, Anlage, Wochentag/Uhrzeit und den bestehenden Zeitraum/Vorlauf.
Reihenfolge von oben: kommende Matches, regelmäßige Trainingsgruppen, meine Gruppen.
Einladungen, Antworten und zentrale Speicherung bleiben erhalten.

Die geschützte Strichliste zeigt das angemeldete Mitglied mit ausschließlich seinen
echten Buchungen und 19 alphabetisch ausgewählte aktive Mitglieder aus dem
zentralen Verzeichnis mit markierten Beispielstrichen. Namen werden nicht in
öffentliche Dateien kopiert. Beispielzeilen sind eine reine Anzeige im Vorführbetrieb
und erzeugen weder Buchungsdatensätze noch Abrechnungsbeträge. Auch bei null eigenen
Buchungen bleibt die eigene Zeile sichtbar. Sortierung: Nachname, Vorname (Deutsch).
Kein Mitgliederimport oder Datenbankschemawechsel. Cache v223.

Prüfung: 13 bestehende Backendtests; neue isolierte Browsertests
`node tools/test-browser-finetuning.mjs` (Gruppe, Training, Login/Home, 320–1100 px)
und `node tools/test-browser-tally-examples.mjs` (echter Worker mit Wegwerf-SQLite,
20 Zeilen, 19 Beispiele, echte eigene Buchungen/Betrag auch nach Reload).
Worker-Build erfolgreich; Messung bleibt ausgeschaltet.
Veröffentlicht und geprüft: Website-Quellstand `cc9836e7aae97d1785b27904937e9343db877f8d`,
[Pages-Lauf 40193735376](https://github.com/calvinjohncamp/tfb-website/actions/runs/40193735376)
erfolgreich; Worker `3d57dda8-c68b-481a-b60c-2a8824f00b2e` veröffentlicht.
App, Dating, Sync-Adapter und Service Worker live HTTP 200/bytegleich geprüft;
anonymer Zugriff auf `/app/state` bleibt 401. Privater Nachweis:
`.private/release-v223/live-check.json`. Automatische nuLiga-Aktualisierung
`fcaf08a` übernommen; sonstige lokale Entwürfe unverändert belassen.


## Verbindlicher aktueller Stand: bestätigt und live v222 – 17.10.2026

Der Nutzer hat den aktuellen Gesamtstand einschließlich E-Mail-Muster und
Club-Platzierung bestätigt. E-Mail zur Mitgliedsanmeldung als einseitige PDF in der Club-Seite
verlinkt: rechts außen im Bereich Mitglied werden, „E-Mail-Bestätigung (PDF)“.
Öffnet in neuem Tab, auf Mobilgeräten umbruchfähig und offline verfügbar.
PDF trägt einen kleinen Präsentationsmuster-Hinweis und fiktive Beispieldaten.
Vollständiges Logo mit rotem Ball und Website-Schriften/Farben; Formular und
Versand bleiben unverändert. Mailregel: nur Mitgliedsanmeldung per E-Mail,
sonstige Hinweise in die App-Klingel. Bisherigen mehrstufigen Aufnahme-Prototyp
vor späterer Anbindung gesondert umstellen. Details/Vorschauen:
[MAILKONZEPT.md](MAILKONZEPT.md). Cache `tfb-kiosk-v222`, übriger bestätigter
Produktstand v221 unverändert. Maßgeblicher Stand ist jetzt insgesamt v222;
die folgenden Abschnitte beschreiben die weiterhin gültigen Funktionen.

## Freigabe, Veröffentlichung und Betriebsgrenzen

Der Nutzer hat den aktuellen Auftritt und die Bedienung ausdrücklich bestätigt
(„Sehr schön, gefällt mir alles gut“) und die Aktualisierung der Dokumentation
beauftragt. Dieser Abschnitt hat Vorrang vor historischen Übergaben weiter unten.
Weitere Produktänderungen nur auf neuen Auftrag; ältere offene Listen nicht
selbständig abarbeiten. Kein neuer Datenbank-Rollback oder Betriebsstart beauftragt.

- Website: [joern-kaemper.de](https://joern-kaemper.de/).
- Repository: `calvinjohncamp/tfb-website`, lokaler Ordner `tfb-kiosk/`.
- Veröffentlichter Website-Quellstand: `f5752caac746f3050444f65ed3929c307650fd06`.
- Aktueller Cache `tfb-kiosk-v222`; dieser Dokumentationsabschluss verändert die Website nicht.
- Erfolgreiche Veröffentlichung: [Workflow 39004454286](https://github.com/calvinjohncamp/tfb-website/actions/runs/39004454286).
- Live-Abgleich von Club-Code, CSS, Service Worker und PDF: 200/bytegleich;
  privater Nachweis `.private/release-v222/live-check.json`.
- Zuletzt veröffentlichter Worker: `f2973171-e161-4b08-a74e-0f240c3e58a1`
  (v213; Nachweis `.private/release-v213/worker-deploy.log`). Keine spätere
  Worker-/Datenbankänderung für die folgenden Website-Feinschliffe erforderlich.
- Der Sicherungstag `stand-2026-10-16-v208` bleibt eine ältere Rückfallreferenz,
  ist nicht der aktuelle Live-Stand. Keine neue vollständige D1-Sicherung oder
  neuer Sicherungstag mit diesem reinen Dokumentationsauftrag erstellt.

## Finales Branding und App-Symbol

Kühle Welt bleibt Standard, warme Welt als lokale Alternative erhalten. App-Symbol
verwendet fest die Farben der kühlen Website: Hintergrund **#EFEFEF**, TFB-Zeichen
**#171717**. Website und Splash behalten den Signature-Ball in **#C4553A**.

**Endgültige App-Entscheidung: großes TFB ohne Ball und ohne Unterzeile.**
Die zuvor veröffentlichten Varianten mit Ball (v219/v220) sind überholt.
Nach Ansicht auf dem echten iPhone war der Ball zu klein, um den Tennisbezug
zuverlässig zu vermitteln. Das reine TFB ist bei gleichem Rand rund 18 % größer.
Schriftform bleibt unverzerrt; Originalausschnitt 1524×664 ab (92,78).
Apple 180px, PWA 192/512px, maskable 512px und 1024px-Quelle sind erneuert;
maskable erhält die eigene Sicherheitszone. Browser-Favicons PNG/ICO bleiben
unverändert ohne Ball. Keine erneute Umstellung auf die frühere dunkle Kachel.

`tools/build-app-icons.mjs` liest --bg/--logo direkt aus den Website-CSS-Dateien.
`tools/build-brand.sh` nutzt diesen Build und die separate unveränderte
`assets/brand/tfb-favicon-source.png`. Apple-/Manifest-Icon-URLs sind mit `v=221`
versioniert. Auf bestehenden iPhones kann erneutes Hinzufügen zum Home-Bildschirm
nötig sein; Seitenneuladen allein garantiert keine Aktualisierung installierter Icons.

## Splash, Navigation und Account

- Eine Einstiegsseite mit Original-TFB-Logo und rotem Ball, ohne zusätzlichen
  Aktionsbutton. Der einzige Einstiegsbutton führt **immer nach #home**, auch
  bei zuvor geöffnetem Kiosk oder nach erneutem Öffnen aus der Partnerverwaltung.
- Als angemeldeter Admin: Konto → „Einstiegsseite ansehen“ → roter Ball auf der
  Splash → zentrale Partnerpflege `#partner` (alter Alias `#partnerzahlen`).
  Gäste erhalten diesen Verwaltungszugang nicht; Server prüft die Adminrolle.
- Stift auf der Splash öffnet die vertraute TFB-Textpflege. „Einstiegsseite anzeigen“
  steht oben; die zwei unabhängigen Schalter für kleine Zeilen oberhalb der
  Überschrift und unterhalb des Einstiegsbuttons stehen direkt unter ihrem Textfeld.
  Kleine quadratische Auswahlfelder, schwarzer Rahmen/schwarzes Häkchen auf hellem
  Grund. Ausblenden erhält den Text; zentral speichern wirkt auf allen Geräten.
- Menü **Dating 2.0**, Seitenüberschrift **Verabreden**, Route weiterhin `#treffen`.
- Kiosk hat keine dauerhafte rote Sondermarkierung mehr. Nur der tatsächliche
  aktive Bereich wird hervorgehoben; spätere Menüaktualisierung erhält diesen Zustand.
- Konto verschlankt: Übergangshinweise und „Bisherige Browserdaten übernehmen“
  entfernt. Profil und Mitgliedschaft bleiben, zentrale Bestandsdaten bleiben erhalten.

## Partnerpflege und vorbereitete Auswertung

TFB-Partnerpflege ist zentral und unabhängig von Padel. Schlanke gemeinsame Seite
für Logos, Firma/Marke, Website, Kontakt, Vertragsstand, vereinbarten Jahresbeitrag
und tatsächlich eingegangene Zahlungen pro Beitragsjahr. Kontakt-/Finanzfelder
bleiben ausschließlich für Admins sichtbar. Kategorien: **Premium-Partner** und
**Partnerbandenwerbung** (ohne trennenden Punkt).

Regulärer Beitrag standardmäßig 300 Euro/Jahr. Alle aktiven Partner rotieren
**gleichberechtigt**, keine finanzielle Gewichtung. Premium bekommt ausschließlich
zusätzliche Sichtbarkeit auf der Splash (maximal zwei aktive Premium-Partner).
Zwei Logos je Partnerzeile; Formate/Platzierung wie bei Padel über Geräteklassen.
Ursprünglich 38 Padel-Partner als austauschbarer Testbestand übernommen, ohne
Finanzzusagen/Zahlungen. Echte TFB-Partner nach und nach in dieser Pflege ersetzen;
keine erneute Initialisierung oder Überschreibung inzwischen gepflegter Datensätze.

**Messung bleibt ausgeschaltet:** Frontend `partnerVisibility.enabled=false`,
Worker `PARTNER_MEASUREMENT_ENABLED=0`. Keine Besucherzahlen sammeln, keine
Testwerte als Jahresstatistik anzeigen und kein automatisches Anschalten am Datum.

Vorbereitet sind zwei Ebenen pro Jahr/Seite: (1) Seitenaufrufe, (2) davon Aufrufe
mit Partner-Sichtbarkeit. Gemeinsame Partnerzeile ab mindestens 50 % Sichtbarkeit
für **0,5 Sekunden** im aktiven Tab; vorhandene Logos müssen geladen sein,
bekannte Überlagerungen unterbrechen den Zeitraum. Eine sichtbare Zweierzeile
zählt einmal als `partner_view` und je Partner einmal als `visible`.
Die ältere 1-Sekunden-Definition ist überholt. Bildschirmkontakt ist kein Nachweis
bewusster Wahrnehmung. Ausspielungen/Rotation und gemessene Sichtkontakte getrennt
behandeln. Admin-, Editor-, Präsentations- und lokale Vorschauaufrufe ausschließen.
Jahresübersicht/CSV/Druck sind vorbereitet, noch kein produktives Messjahr.

Schritte: (1) jetziger Live-Auftritt zum Feinschliff, (2) Vorstandsvorschlag für
TFB und Padel ab **01.01.2027**, danach ein volles Jahr auswerten; dazu eigene
Freigabe, Sicherung, Statistikmigration 0004 und Betriebsprüfung erforderlich.
Migration 0005 für Partnerpflege ist bereits eingespielt; 0004 bisher nicht.
Padel-Messung später ins dortige MIS übertragen, gemeinsame Übersicht langfristig
auf TFB vorsehen. (3) nach drei Padel-Betriebsjahren Partnerkonzept nur Padel oder
Padel+TFB prüfen; TFB-Bandenwerbung separat oder gemeinsames Paket bleibt offen.

## Aktuell · Save the Date

Originalanhänge für Oktoberfest und Weihnachtsfeier wieder sichtbar, mit Großansicht
und Download auf Smartphone/Tablet/Desktop. Die gesicherten Originale sind **JPG/JPEG**,
keine PDFs. Sie waren bereits veröffentlicht; die Anzeige akzeptierte zuvor nur
Browser-Uploads. Öffentliche `assets/content/`-Anhänge werden jetzt in Anzeige,
Viewer und Editor unterstützt; statische PDFs sind ebenfalls möglich.

Offene Inhaltsklärung: Weihnachtsflyer nennt **05.12.2026, 18 Uhr**, veröffentlichter
Termineintrag **07.11.2026, 11 Uhr**. Im Rahmen der Wiederherstellung wurden keine
Terminangaben geändert. Auf neuen Auftrag beziehungsweise nach Inhaltsfreigabe klären.

## Prüfungen und Betriebsgrenzen

Für die Änderungen v210–v221 wurden isolierte Backend-/Browserprüfungen eingesetzt:
Adminzugang, Partner-/Logo-/Zahlungspflege, zentrale Splash-Texte, responsive
Darstellung, Home-Einstieg samt Kiosk-Reload, Menütitel und aktive Markierung.
Originalflyer in Großansicht und bytegleiche Downloads geprüft. App-Symbole nach
Abmessungen, exakten Farbwerten, Ballentfernung und Maskable-Sicherheitszone geprüft;
Manifest, Apple-Verknüpfung und Offline-Icons mit echtem Service Worker geprüft.
Die v221-Auslieferung aller Icons, des Manifests und des Service Workers
wurde bytegenau gegen die geprüfte lokale Fassung verglichen. Für v222 zusätzlich
PDF-Seite gerendert und visuell kontrolliert, 24 Seitentests erfolgreich, PDF-Link
in beiden Farbwelten bei 320/390/834/1194/1440px geprüft, Öffnen in neuem Tab und
Offline-Zugriff getestet sowie die finale Live-Auslieferung bytegenau verglichen.

Zentrale Profile/Kiosk/Chats seit v203, Gruppen/Verabredungen seit v204;
Touch-Optimierung seit v205 weiter aktiv. Kiosk bleibt Vorführung ohne produktive
Abbuchung. Übrige redaktionelle Seiten bleiben im bisherigen lokalen Pflege-/Exportweg;
Splash-Texte und Partnerpflege sind die zentralen Ausnahmen. Private Sicherungen,
Mitgliederdaten und Schlüssel niemals veröffentlichen; Browserdaten nicht als
Reparatur löschen. Frühere Wiederherstellungen sind abgeschlossen, nicht erneut
als offene Migration behandeln. Technische Details in
[GERAETEUEBERGREIFENDE_DATEN.md](GERAETEUEBERGREIFENDE_DATEN.md),
[DESIGNVERGLEICH.md](DESIGNVERGLEICH.md) und
[Server-README](../server/cloudflare/README.md).

Die folgenden älteren Abschnitte sind historische Übergaben.

**Verbindlicher Stand: 16.10.2026, veröffentlichte Vorführversion v208.**
Der Nutzer hat Gestaltung und Bedienung ausdrücklich bestätigt und das Einfrieren
beauftragt. Letzte freigegebene Korrektur: ausschließlich die iPad-Partnerflächen
bei gleicher Breite um 20 Prozent höher. Erst auf einen neuen Nutzerauftrag
weiterentwickeln; ältere offene Listen nicht selbständig abarbeiten.

Sicherungstag: `stand-2026-10-16-v208`. Website-Quellstand `4781aca`, Cache
`tfb-kiosk-v208`; Dokumentationsabschluss ist ebenfalls im Sicherungstag enthalten.
Dieser Kurzstand hat Vorrang vor allen historischen Abschnitten weiter unten.

## Live-System und Projektgrenze

- Website: [joern-kaemper.de](https://joern-kaemper.de/).
- Repository: [calvinjohncamp/tfb-website](https://github.com/calvinjohncamp/tfb-website),
  Arbeitsordner `tfb-kiosk/` innerhalb von `9. TFB-Website`. Der Elternordner enthält
  auch eine getrennte Padel-Kopie und fremde Übergaben; diese nicht bearbeiten.
- Website v208 veröffentlicht über
  [Pages-Lauf 38957773956](https://github.com/calvinjohncamp/tfb-website/actions/runs/38957773956).
  Ausgelieferte CSS-Datei und Service Worker bytegenau mit den geprüften Quellen verglichen.
- Cloudflare-Worker `tfb-api`, Version `ec3b353d-216f-42ac-87ab-7881f9cb30c4`,
  D1 `tfb-website`. Diese iPad-/Gestaltungsabschlüsse ändern weder Worker noch Schema.
  Nur bestehende TFB-Dienste verwenden; Padel bleibt ein separates System.

## Bestätigte Gestaltung und Bedienung

- Kühle Welt als Standard, warme Alternative erhalten. Signature-Rot `#C4553A`.
- Alle sieben Menüpunkte in einer Zeile, auch auf dem iPhone: Kiosk, Chat, Aktuell,
  Sport, Club, Dating, Padel. Keine zweizeilige Navigation. „Dating“ ersetzt den
  bisherigen Standard-Menünamen „Verabreden“; die Route bleibt `#treffen`.
- iPhone etwas kleinere, gut lesbare Schrift; iPad hochkant größere Schrift,
  erste/letzte Beschriftung bündig zu den Inhaltskanten, gleichmäßige Abstände.
- Dezente rote aktive Pill, optisch 32 px hoch bei 44 px Tippfläche. Strich näher
  am Begriff, 2,25 statt 3 px. Auf Desktop bleibt die ruhige einzeilige Kopfzeile.
- Partner: zwei gleich breite, mittig eingepasste Logos. Auf iPhone/iPad zusammen
  volle Inhaltsbreite, auf Desktop ab 1024 px zusammen halbe Inhaltsbreite.
  iPhone 100 px Höhe, Desktop 115 px. Tablet mit primärer Touch-Bedienung und
  mindestens 640 × 640 CSS-Pixeln: 132 px statt 110, ab 1024 px Breite 138 statt
  115 px. Das sind jeweils exakt 20 Prozent mehr Höhe; Breiten und Logo-Zentrierung
  bleiben erhalten. iPhone quer und Desktop bekommen diese zusätzliche Erhöhung nicht.
- Roter Ball schaltet vorhandene Admin-Werkzeuge ein/aus; nach Neuladen ausgeblendet.
  Desktop-Fokus über F bleibt auf primäre Maus/Trackpad-Bedienung beschränkt.
- Touch-Optimierung v205 beibehalten: Ansichten lesen bestätigten Cache sofort,
  keine vollständigen Chat-/Bildabfragen bei jedem Seitenwechsel; bekannte Namen/
  Vorschaubilder wiederverwenden, unveränderte Chatbilder nicht erneut schreiben.
  Verspätete Ansichten überschreiben keine später gewählte Seite. Auf Touch entfällt
  die künstliche 480-ms-Bierdeckel-Wartezeit. Nutzer bestätigt die flüssigere Bedienung.

## Zentral gespeicherte Vorführdaten

- Anmeldung, Profilfoto, Kiosk-Einträge, Chatbeiträge/Kommentare/Anhänge und Katalog
  sind seit v203 zentral. Seit v204 zusätzlich Gruppen, Verabredungen, wöchentliche
  Trainingsserien, Teilnehmerantworten und Postfach-Lesestatus.
- Gleicher Account auf iPhone/iPad/Desktop lädt denselben berechtigten Datenbestand.
  Eigene frühere Daten wurden übernommen und anhand privater Sicherungen auf Erhalt
  geprüft. Diese Wiederherstellung ist erledigt, nicht als neue offene Aufgabe ausgeben.
- Geöffnete Apps prüfen alle zehn Sekunden einen Änderungsmarker und beim Zurückkehren.
  Schreibbestätigung erst nach Servererfolg; Revisionen und dauerhafte Vorgangskennungen
  schützen vor Überschreiben und Duplikaten. Unterbrochene Übernahmen werden fortgesetzt.
- Teilnehmer antworten im zentral angemeldeten Modus selbst; keine erfundenen Zusagen.
  Wöchentliche Termine materialisieren beim Öffnen/Abgleich, nicht über einen Cronjob
  oder E-Mail-Versand. Abgesagte Termine werden nicht neu erzeugt.
- Original-Profilbilder öffnen unbeschnitten in hoher gespeicherter Auflösung;
  Vorschau und große Quelle bleiben getrennt. Fotozugriffe bleiben serverseitig geprüft.
- Details und Betriebsgrenzen: [GERAETEUEBERGREIFENDE_DATEN.md](GERAETEUEBERGREIFENDE_DATEN.md).

## Sicherungen und Wiederherstellung

- Private Browser-/D1-Sicherungen und Erhaltungsvergleiche liegen ausschließlich unter
  `.private/release-v203/` und `.private/release-v204/`. Fotos, Chats, Kioskeinträge
  sowie ursprüngliche Planungsfelder und Antworten wurden damals exakt verglichen.
- Zum Einfrieren neuer D1-Export `.private/release-v208/d1-frozen-2026-10-16.sql`,
  in SQLite wiederhergestellt und `PRAGMA integrity_check` erfolgreich geprüft.
  Prüfbericht und Bildschirmvorschauen liegen im selben privaten Ordner.
- Zusätzliche Quellstand-Sicherung als geprüftes Git-Bundle:
  `.private/release-v208/tfb-website-stand-2026-10-16-v208.bundle`.
  Sie enthält den Sicherungstag einschließlich Dokumentationsabschluss, keine lokalen Browserdaten.
- Eine Datenbanksicherung enthält keine browserlokalen Website-Editor-Entwürfe.
  Diese weiterhin bei Bedarf über die vorhandene vollständige Browser-Sicherung sichern.
- Browserdaten/Safari-Cache niemals als vermeintliche Reparatur löschen. Neue Website-
  Fassung durch vollständiges Schließen und Wiederöffnen der App laden.
- Private Exporte, Mitgliederdaten und Zugangsschlüssel niemals committen/veröffentlichen.
  `tools/prepare-pages.py` veröffentlicht nur öffentliche Webdateien und schließt
  Server, Dokumentation, Werkzeuge und Sicherungen aus.
- Zum Quellvergleich den Git-Tag verwenden; eine spätere Wiederherstellung der
  Datenbank ist ein eigener Auftrag. Kein pauschales `git reset --hard`, kein
  Zurückspielen alter Browserdaten über neuere zentrale Daten.

## Prüfung und nächste Sitzung

- Abschluss v208: isolierte Chromium-Ansichten mit Testkonto, beide Farbwelten,
  acht Breiten von 320 bis 1440 px einschließlich großem iPad hochkant und quer.
  Eine Menüzeile, bündige Kanten, keine Überlappung/Überbreite, Partnerbreiten,
  exakte Tablet-Höhen und mittige Logos erfolgreich geprüft. Drei Prüfungen des
  öffentlichen Pakets und `git diff --check` erfolgreich.
- Letzter Funktionsstand v207: Farbwelt-Browsertest und Touch-Performance-Test
  erfolgreich (Profil/Verabredungen etwa 60–75 ms bei künstlicher API-Latenz).
  Zuvor v205: 73 Node-Tests, Zwei-/Vier-Profil-Synchronisierung, Sicherungen,
  Gruppen/Serien/Zusagen/Käufe und unterbrochene Speicherung geprüft.
  Diese Funktionsprüfungen wurden für die reine iPad-Höhenänderung nicht alle wiederholt.
- Der Nutzer hat iPhone-Bedienung und Gestaltung praktisch bestätigt. Automatisierte
  Größenprüfungen sind keine vollständige physische iOS-Geräteabnahme. Weitere
  Detailbeobachtungen des Nutzers erst auf neuen Auftrag bearbeiten.
- Website bleibt eine Vorführung. Produktive Abbuchung/SEPA, zentrale Monatsabschlüsse,
  E-Mail/Push-Zustellung und fertiger Vereinsbetrieb sind nicht freigegeben.
  Website-Editor/CMS und direkter Datei-/localhost-Modus bleiben lokal.
- Möglicher späterer Vereinsumzug zu Supabase ist eine getrennte Entscheidung;
  keine Zusammenlegung mit Padel eigenständig beginnen. Digitale Aufnahme bleibt
  ein separater vorbereiteter Dienst, kein durch diesen Abschluss gestarteter Versand.
- Für Nachprüfungen: `node tools/test-browser-touch-performance.mjs`,
  `node tools/test-browser-meet-sync.mjs`, `node tools/test-browser-cloud-sync.mjs`,
  `node --test tools/test-app-sync.mjs tools/test-meet-sync.mjs tools/test-cloudflare-directory.mjs`
  bzw. gezielt die jeweils betroffenen Tests. `python3 tools/test-public-content.py` vor Veröffentlichung.
  Browser-Tests verwenden isolierte synthetische Daten, keine privaten Chrome-Sitzungen.

## Freigabestand

Stand eingefroren. Neue Änderungen, Veröffentlichungen oder Migrationen erst auf
neuen konkreten Nutzerauftrag. Bestehende Daten und lokale Nutzeränderungen erhalten.

## Historischer Stand bis v203 – nur Verlauf

Die folgenden Aussagen gelten ausschließlich für ihren damaligen Zeitpunkt.
Maßgeblich ist der Abschluss v208 oben.

**Aktueller Stand: 16.10.2026, veröffentlichte Vorführversion v203.**
Datenbankerweiterung, Worker und Website wurden vom Nutzer ausdrücklich freigegeben
und veröffentlicht. Profilfoto, Bierdeckel und Chats/Kommentare/Bildanhänge werden
bei geschützter Anmeldung geräteübergreifend gespeichert. Der Kiosk bleibt eine
Vorführung ohne produktive Abbuchung. Verabredungen/Gruppen und Websitebearbeitung
bleiben lokal. Ausführlicher Verlauf: [PROJEKTGEDAECHTNIS.md](PROJEKTGEDAECHTNIS.md).
Die folgende Zusammenfassung hat Vorrang vor historischen Zwischenständen.

## Veröffentlichung 16.10.2026 abgeschlossen

- Additive Migration `0003-app-sync.sql` erfolgreich; vorhandene Mitglieder-/
  Zugangstabellen erhalten. Private D1-Sicherung vor Migration wiederhergestellt
  und auf Integrität geprüft.
- Worker `26195ded-5951-4e21-b8cf-f1c170af1e09` online; neue Endpunkte verweigern
  anonyme Foto-/App-Zugriffe mit 401. Health-Check 200.
- Website-Quellstand `e775447`, Cache `tfb-kiosk-v203`, erfolgreicher Workflow
  [38945364365](https://github.com/calvinjohncamp/tfb-website/actions/runs/38945364365).
  Ausgelieferte Programmdateien bytegenau mit der lokalen Fassung verglichen.
- Aktuellen Browserbestand vor Umstellung über die bestehende Sicherungsfunktion
  exportiert und privat kopiert. Eigene Daten über die veröffentlichte Oberfläche
  übernommen; zweite D1-Sicherung anschließend wiederhergestellt und Bilddateien,
  Texte sowie Kioskeinträge mit der ersten Browsersicherung exakt verglichen.
- Private Sicherungen, Vergleichsbericht und Bildschirmnachweis ausschließlich
  unter `.private/release-v203/`, ignoriert von Git und Websitepaket.
- Nutzer braucht am iPhone nur die App neu zu öffnen und sich ggf. mit demselben
  Konto anzumelden. Safari-Daten nicht löschen. Die eigene Übernahme ist bereits
  erledigt und darf nicht als noch offener Schritt dargestellt werden.

## Umsetzung v203 (vor Veröffentlichung vorbereitet)

- Profilbilder öffnen die gespeicherte große, unbeschnittene Quelle in Chat,
  Mannschaftsbeiträgen und Verabreden. Großbilder werden beim Anklicken geladen.
- `cloud-sync.js` ergänzt die vorhandene Cloudflare-Anmeldung: Profilfoto,
  Kiosk-Striche, Chats samt Kommentaren/Anhängen und Kiosk-Sortiment werden
  zentral gespeichert. Server prüft Sitzung, Eigentum und Mannschaftsrechte.
- Änderungen verwenden Versionsprüfungen und eine wiederholbare Vorgangskennung.
  Ein lokales IndexedDB-Protokoll erhält unterbrochene Speicherungen. Beim
  Wiederöffnen wird derselbe Vorgang wiederholt, ohne doppelte Striche/Beiträge.
- Vor dem ersten Serverabgleich wird der bisherige Browserbestand samt Bildern
  in einer separaten lokalen IndexedDB gesichert. Account → „Bisherige Browserdaten
  übernehmen“ zeigt eine Vorschau und übernimmt eigene Daten nach Bestätigung.
  Admins können dabei ausdrücklich eigene Inhalte des alten m-demo-Kontos zuordnen.
- Geöffnete Seiten prüfen alle zehn Sekunden einen kleinen Änderungsmarker;
  bei Änderungen wird aktualisiert. Rückkehr zur App stößt ebenfalls einen
  Abgleich an. Ein offener Editor wird nicht neu gerendert.
- Direkter HTML-/localhost-Vorführmodus bleibt lokal. Verabredungen/Gruppen und
  Websitebearbeitung werden mit diesem Ausbau noch nicht zentral gespeichert.
- Neuer SQL-Bestand: `0003-app-sync.sql`, nur neue Tabellen. Worker muss vor der
  Website aktualisiert werden. Diese Reihenfolge wurde inzwischen abgeschlossen.
- Veröffentlichungsschritte und genaue Grenzen:
  [GERAETEUEBERGREIFENDE_DATEN.md](GERAETEUEBERGREIFENDE_DATEN.md).

## Veröffentlichung und Projektgrenze

- Website: https://joern-kaemper.de/ – DNS-Prüfung erfolgreich, HTTPS erzwungen.
  `www` zeigt per CNAME auf `calvinjohncamp.github.io`; Mail-Einträge bleiben erhalten.
- Vorheriger Online-Stand: `a31c60b`, Cache `tfb-kiosk-v201`, Lauf `38775995321`.
  Dieser wurde durch den oben dokumentierten Release v203 ersetzt.
- Repository `calvinjohncamp/tfb-website`, lokaler Projektordner `tfb-kiosk`.
  GitHub ist öffentlich; private Mitgliederdaten, Meldelisten, Sicherungen und
  Schlüssel gehören niemals in Git oder das Pages-Paket.
- Die separate Padel-App wird durch diesen Abschluss nicht verändert.
  Das anschließende Thema Profilbilder und Synchronisierung ist oben dokumentiert.

## Bestätigte Bedienung und Funktionen

- Kühle Gestaltung ist Standard, warme Gestaltung bleibt als Alternative erhalten.
- Roter Ball: Admin-Werkzeuge sind nach Neuladen ausgeblendet; ein Klick blendet
  sie ein, der nächste wieder aus. Das gilt auch bei Cloudflare-Anmeldung.
  Serverseitige Berechtigungen bleiben unabhängig davon geprüft. Eigene Beiträge
  und Kommentare bleiben für Mitglieder bearbeitbar. Sichern/Laden im Profil
  wird für die Verwaltung ebenfalls über diesen Schalter sichtbar.
- Kiosk: Zustimmungstexte gemäß letzter Nutzerfassung, Version `tfb-kiosk-v3`.
  Die bekannte Strichliste zeigt angemeldeten Mitgliedern die vergangenen sieben
  Tage mit Namen und Strichen, ohne Beträge. Monatsabrechnungen sind für das
  Mitglied und den Kassenwart vorgesehen. Namen umbrechen zwischen Nach- und
  Vorname. In Listen bis 639px stehen Nachname und Vorname untereinander in
  einer linken Namensspalte; alle fünf Kategorien bleiben rechts daneben.
  Getränkestriche sind wie alle anderen Striche mittig unter der Überschrift.
  Getränke bleiben breiter; auf Handybreite umbrechen Bündel innerhalb der
  Spalte, ohne zusammengequetscht zu werden. Überschriften: Getränke ausgeschrieben, Kränze (auch auf Desktop),
  Snacks, Spiel, Equip. Mobile Spielernamen um 2px größer (15,6px bzw.
  14,8px auf den kleinsten Displays). Sehr lange Namen dürfen innerhalb ihrer Spalte umbrechen.
  Alte, widersprüchliche Strichlisten-Regeln in app.css zusammengeführt.
  Prüflauf: `node tools/test-browser-tally-layout.mjs`, 15 Displaybreiten von
  320 bis 1920px, 1/6/15/18 Striche, Zentrierung der tatsächlichen Strichgruppen,
  Namen/Spaltenüberschriften und Zeilendetails; Browseraufnahmen Desktop,
  700px, 430px, 390px, 320px visuell geprüft. Bestehender Browsertest
  `tools/test-browser-chat-recovery.mjs` ebenfalls erfolgreich.
- Abrechnungs-Vorführung: In der eigenen Abrechnungsansicht von Admins werden
  im Demo-Backend die beiden Vormonate mit 34,80 € bzw. 23,50 € ergänzt, als
  „eingezogen“ und „Beispiel · fiktiver Betrag“. Nur Anzeige, keine Speicherung
  der Beispiele, keine Änderung an laufenden Käufen. Bereits vorhandene eigene
  Monatsabrechnungen haben Vorrang; andere Mitglieder erhalten keine Beispiele.
  Nutzer betont ausdrücklich: veröffentlichte Website ist eine Vorführung,
  der fertige Vereinsbetrieb ist noch nicht freigegeben.
  Prüfung: `node tools/test-browser-statement-preview.mjs` erfolgreich;
  Desktop und Handy visuell geprüft, auch 320px ohne horizontalen Überlauf.
- Verabreden: Einladende können direkt im Spiel weitere Mitglieder einladen.
  Zusagen über die Spielerzahl hinaus erscheinen auf der sichtbaren Ersatzbank.
  Jeder Teilnehmer einschließlich Einladendem kann mit „Kann nicht“ später absagen,
  bleibt unter „abgesagt“ sichtbar; der erste Ersatz rückt automatisch nach.
- Chat: freiwilliges Überschriftenfeld dauerhaft sichtbar, Nachricht zuerst.
  „Auch in meiner Mannschaft anzeigen“ bietet nur die eigenen Mannschaften an;
  bei mehreren sind diese einzeln wählbar. Bestehende Beitragszuordnungen bleiben
  beim Bearbeiten erhalten. Keine beliebige Admin-Mannschaftsauswahl im Editor.
- Vollständiger Beitrag mit flachen Kommentaren über „Kommentieren“/Kommentarzahl.
  Eigene Kommentare bearbeiten/löschen, Verwaltung kann fremde entfernen.
  Bis zu drei Bilder pro Kommentar, auch reine Bildantworten, mit Galerie,
  Bildbearbeitung im Sinne von Entfernen/Ergänzen und Einwilligung für Personenfotos.
- Neue Kommentare anderer Mitglieder werden beim Beitragsautor je Beitrag in der
  Klingel gebündelt. Lesen/Entfernen bleibt gespeichert; spätere Kommentare melden
  sich erneut. Zusätzliche Hinweise auf Gruppenbeiträge bleiben freiwillig.
- Die drei wiederhergestellten eigenen Chat-Beiträge einschließlich aller acht
  Fotos sind laut Nutzer wieder vollständig vorhanden. Nicht erneut importieren
  oder den aktuellen Browserstand durch eine ältere Sicherung ersetzen.

## Was online ist und was lokal bleibt

Cloudflare-Worker `https://tfb-api.calvinjohncamp.workers.dev` mit D1 `tfb-website`,
Binding `DB`: geschützter Mitgliederzugang, Verwaltung, Mitgliedersuche und eigene
Mannschaftszuordnung. Zugang ist eingerichtet. `member_teams`-Migration ist bereits
angewendet; bei anderen bestehenden Datenbanken vor dem Worker-Update ausführen.
Private Zuordnungen: 313 für 138 Konten; 38 Meldungszeilen ohne eindeutigen Abgleich
bleiben offen. Neue Saison/neue Mitglieder erfordern einen vertrauenswürdigen
privaten Abgleich; Zuordnungen nicht erraten.

**Weiterhin lokale Vorführung je Browser:** Kiosk-Käufe und Abrechnungen,
Chat-Beiträge/Kommentare/Bilder, Verabredungen/Gruppen/Einladungen/Antworten,
Ersatzbank und Klingelzustand. Keine gemeinsame geräteübergreifende Speicherung
oder echte Zustellung; automatische Demo-Antworten bleiben aktiv. Kein echter
SEPA-Einzug oder E-Mail-Versand. Öffentlich erreichbare Website bedeutet hier
noch keinen produktiven Vereinsbetrieb.

Lokale Daten und Bilder gehören in den vollständigen privaten JSON-Export.
Browserdaten nicht pauschal löschen. Die gezielte Chat-Wiederherstellung ist von
„Sicherung laden“ zu unterscheiden, das den vollständigen Stand ersetzt.
Dieser Dokumentationsabschluss erstellt keinen neuen Browserdaten-Export.

## Verbindliche Richtung für den späteren Vereinsbetrieb

Cloudflare im vorhandenen persönlichen Konto bleibt für die Vorführung.
Bei Vereinsentscheidung wird Supabase im bereits vorhandenen Vereinsumfeld
bevorzugt, da die Padel-App es bereits nutzt. Kein zusätzliches Cloudflare-
Vereinskonto planen. Noch keine Migration oder Zusammenlegung mit Padel beauftragt.

Vor echtem Betrieb gemeinsame Speicherung samt Zugriffsrechten, Medien,
Einladungen/Ersatzbank und Benachrichtigungen umsetzen und abnehmen;
Mannschaftspflege, Sicherung/Wiederherstellung und Zuständigkeiten festlegen.
Die Klingel als zentrales Postfach ohne E-Mail bleibt gewünscht; Handy-Push ist
nur eine mögliche spätere Ergänzung, noch nicht umgesetzt.

## Prüfung und Weiterarbeit

Die letzten Funktionsänderungen wurden mit isolierten Browserprüfungen für
Admin-Umschaltung, Kommentare/Bilder/Mannschaften, Wiederherstellung und schmale
Ansichten sowie den zugehörigen Backend-/Sicherungsprüfungen geprüft. Keine echte
iPhone-/iPad-Geräteabnahme behaupten. Für diesen Abschluss nur Dokumentation
geändert; keine neue Website-Veröffentlichung oder Datenmigration erforderlich.

Nächste Sitzung: auf diesem bestätigten Stand aufbauen und das vom Nutzer noch
zu benennende Thema zu TFB-Website und Padel aufnehmen. Keine alte offene Liste
ungeprüft abarbeiten und keine privaten Vorführdaten zurücksetzen.

## Historischer Verlauf – frühere Zwischenstände

Die folgenden Abschnitte dokumentieren frühere Sitzungen. Versionsnummern,
Veröffentlichungsstatus und Bedienhinweise dort gelten nur für den jeweiligen
Zeitpunkt; der Stand v196 oben ist maßgeblich.

## Kühle Welt als Standard, zwei Admin-Optionen (v183)

Nutzer bevorzugt neue Typografie/Menü und aufgeräumten Kiosk; kühle Welt mit neuen
Schriften ist jetzt Standard. Warme ursprüngliche Welt bleibt Nummer zwei.
Zwischenvariante kühl/alte Schriften aus UI und CSS entfernt. Neuer lokaler Key
`tfb_design_world_v2` ignoriert ältere Testpräferenzen, fehlender Wert = cool.
Auf Home links in der Bleistift-Zeile „Kühle Welt“/„Warme Welt“, aktiv markiert,
nur sichtbar wenn derselbe Admin-Zustand auch den Bleistift zeigt. Keine Anzeige
für Gäste/Mitglieder; Demo-Admin blendet über roten Ball ein. Logo-Schriftzug bleibt
auf allen Seiten als Zweierwechsel verfügbar, auch in Fokus/Präsentation.
Auswahl lokal je Browser gespeichert, nicht als zusätzliche globale Site-Einstellung.
Tests erfolgreich: Default/Legacy-Auswahl/Reload, Admin-Sichtbarkeit/Ausrichtung,
alle Routen und Desktop/Mobilbreiten, unveränderte Daten, Offline-Datei, Fokus-Wechsel.
Keine Veröffentlichung; Dokumentation der aktuellen Entscheidung in DESIGNVERGLEICH.md.
v182 und früher unten historisch.

## Drei Welten und Dating-Texte (v182)

Aktueller lokaler Cache v182. Klick auf Logo-Schriftzug überall:
warm (Original/Standard) → kühle Flächen mit EXAKT bisherigen Schriften und
Schriftfarben → vollständige kühle Welt mit Bricolage/DM Sans → warm.
Mittlere Variante eigene CSS-Klasse `editorial-colors-only`, nur Flächen/Farben
für Hintergründe/Linien, keine Font-/Textfarb-Overrides. Auswahl `colors` zusätzlich
zum bisherigen `cool` unter gleichem Preference-Key. Logo-Home und Ball unverändert.
Menüpunkt weiterhin „Verabreden“; darin H1 „Dating 2.0“, Abschnitte
„Einladungen für mich“ und „Meine kommenden Matches“. Logik/Inhalte sonst identisch.
Erweiterter Design-Test prüft alte Font-/Farbwerte auf allen Routen/Breiten,
Dreierzyklus, Reload, neue Texte und Rückkehr. Details: DESIGNVERGLEICH.md.
Keine Veröffentlichung/Designentscheidung; zentrale Admin-Auswahl weiterhin später.

## Designvergleich erweitert: alle Seiten (v181)

Aktuell v181, weiterhin Experiment ohne Entscheidung zwischen warm/kühl.
Nutzer mag die warme Welt weiterhin und möchte nun alle TFB-Seiten vergleichen.
Logo-Schriftzug schaltet auf jeder internen Seite/Unterseite um; Account und Dialoge
folgen der Auswahl. Basis/Inhalte unverändert, keine zweite Datenkopie.
Kühle Zahlen auf Home wieder feine rote Konturen (1.25px, Bricolage 600), Menü
etwas größer, DM Sans 700, dunklerer Sekundärton. Neutrale Flächen auch in Kiosk,
Abrechnungen, Sport/Training/Mannschaften, Club, Verabreden und Rechtstexten.
Kühle Verabreden-Arten auf schmalen Geräten als 2x2, kein Textüberlauf.
Warmer Look bleibt unverändert; beide Welten als spätere Admin-Option nur vorgemerkt.
Ausführliche Quellen/Prüfung in DESIGNVERGLEICH.md. v180-Scope unten historisch.

## Design-Experiment 13.10.2026: Home/Chat (v180)

Nach dem Tagesabschluss bittet der Nutzer um einen reversiblen Vergleich zur
Foks-Vorlage. Aktueller lokaler Cache v180, keine Design-Freigabe oder Veröffentlichung.
Vorheriger warmer v179-Look bleibt Basis/Standard. Kleiner Schriftzug unter dem
TFB-Zeichen schaltet auf Home/Chat zwischen warm und kühl; Zeichen bleibt Home-Link,
Ball bleibt Admin-Gimmick. Inhalte/Fotos/Daten identisch, keine zweite Kopie.
Getrennte Preview-CSS/JS, lokaler Preference-Key, außerhalb Home/Chat inaktiv.
Originalfonts der aktuellen Hersteller-Demo identifiziert und lokal lizenziert:
Bricolage Grotesque (Titel), DM Sans (Fließtext/Kategorien). Screenshotfläche
gemessen #EFEFEF, neutrales Preview-Anthrazit #171717, TFB-Rot bleibt erhalten.
Details, Quellen, Farbabweichungen und Rückbau: [DESIGNVERGLEICH.md](DESIGNVERGLEICH.md).
Tests: Design-Umschaltung/offline/Dateiseite/Mobilbreiten, Fokus-Regression;
Screenshots nur isolierte Testdaten. HTTP-Vorschau separat von bisherigen file-Daten.

## Tagesabschluss 13.10.2026: freigegebener Stand v179

Der Nutzer hat die Umsetzung der optionalen Chat-Hinweise ausdrücklich bestätigt
(„gefällt mir genau so“) und die Arbeit für heute beendet. Aktueller lokaler Stand:
`tfb-kiosk-v179`. Die folgenden Ergänzungen dokumentieren die Entwicklung;
Versionsangaben v178 und früher sind historische Zwischenstände.

- Fokus bleibt ausschließlich für Desktop; Installation für weitere Nutzer bleibt zurückgestellt.
- Account: nächstes zugesagtes Match mit feinem Anthrazit-Rahmen; Kiosk-Umsätze
  mit Details-Link zu Einzelposten/Monatsabrechnungen und Heute-Link zum Bierdeckel.
- Laufende Abrechnung zeigt unter dem Betrag nur „Einzug am [Datum]“.
- Klingel: optional bestehende Beiträge von Mannschafts-/Trainingsgruppenmitgliedern,
  je Autor gebündelt, direkt verlinkt, nach Ansicht dauerhaft als gelesen entfernt.
  Kein neuer Gruppenchat und keine Änderungen am Einladungsablauf.
- Auswahl im eigenen Account unter Benachrichtigungen → Klingel. Standard:
  „Nur Einladungen“; Opt-in: „Einladungen und Gruppenbeiträge“. Keine alten Beiträge
  nachmelden, keine Personen-Followliste, keine Mails/Push/Banner.

Zum Abschluss erfolgreich ausgeführt: `test:browser:chat-notices`,
`test:browser:next-match`, `test:browser:overview`, `test:browser:meet-weekdays`.
Schmale Account-Darstellung visuell kontrolliert; `git diff --check` erfolgreich.
Nicht die gesamte Testsuite erneut ausgeführt; keine echte iPhone-/iPad-Geräteprüfung.
Keine Veröffentlichung, kein Commit/Tag/Push und kein neuer JSON-Sicherungsexport.
Separate Padel-Anwendung unverändert. Nächste Sitzung baut auf diesem Stand auf.

## Ergänzung 13.10.2026: optionale Chat-Hinweise (v179)

Aktueller lokaler Cache v179. Nutzer hat den zunächst besprochenen Gruppenchat
ausdrücklich verworfen: KEIN neuer Chat unter Verabreden/Trainingsgruppen.
Stattdessen bestehende Chat-/Insider-Beiträge nach Verfasser berücksichtigen:
gemeinsame nuLiga-Mannschaft (bestehende rosterOf-Logik) oder bestätigte gemeinsame
Verabreden-Gruppe. Pending zählt nicht. Account-Auswahl unter Benachrichtigungen:
„Nur Einladungen“ (Standard) / „Einladungen und Gruppenbeiträge“.
Beim Einschalten keine alten Beiträge nachmelden; beim erneuten Einschalten
ebenfalls neuer Start. Eigene/verborgene/gelöschte/fremde Beiträge ausgenommen.
Maximal sieben Tage, je Verfasser gebündelt und bei Mehrfachzuordnung nicht doppelt.
Klingel-Link öffnet neuesten Beitrag direkt unter `#chat/beitrag/<id>`; nur dieser
wird gelesen und verschwindet, weitere bleiben im Bündel. Öffnen aus Chat-Übersicht
markiert ebenfalls gelesen. Entfernen/Alle Hinweise entfernen bestätigt alle
Beiträge des jeweiligen Bündels; Einladungslogik unverändert.
Account-speichernde APIs: chatNotices/readChatPosts; keine Mails, Push oder Banner.
Weiterhin lokale Demo, keine geräteübergreifende Zustellung vor Backend-Anbindung.
Neuer isolierter Test: `npm run test:browser:chat-notices` mit localhost:5180.
Erfolgreich geprüft: Standard/Opt-in/Opt-out, Autor-Zuordnung, Bündelung,
Ausschlüsse, Direktlink, dauerhaft gelesen nach Reload, Entfernen und 1100/390/320px.

## Ergänzung 13.10.2026: Abrechnungshinweis (v178)

Aktueller lokaler Cache v178. Im laufenden Monat unter „Meine Abrechnungen“
steht unter dem Gesamtbetrag nur noch „Einzug am [Datum]“, ohne Strichanzahl
und ohne den Zusatz „per SEPA-Lastschrift“. Einzelposten und Berechnung unverändert.

## Ergänzung 13.10.2026: Account-Gliederung (v177)

Aktueller Cache `tfb-kiosk-v177`, nur lokal. Nächstes Match jetzt mit feinem
1px-Signature-Anthrazit-Rahmen und 16px-Rundung passend zu den Account-Feldern.
Über den drei Beträgen steht „Kiosk-Umsätze“. Darunter führt „Details ansehen“
zu `#abrechnungen` (laufender Monat mit Einzelposten und abgeschlossene Monate),
schließt den Account; der Heute-Betrag führt weiterhin zum Bierdeckel im Kiosk.
Keine Änderungen an Umsatz- oder Match-Berechnung. Der erweiterte isolierte
Account-Browsertest ist erfolgreich; v176 unten beschreibt den vorherigen Stand.

## Ergänzung 13.10.2026: nächstes Match im Account (v176)

Aktueller Cache `tfb-kiosk-v176`, weiterhin nur lokal. Im Account unter den beiden
Bestätigungen und über Kiosk-Beträgen/Angaben ein ungerahmter Hinweis mit Datum,
Uhrzeit, Titel/Ort und Direktlink zum nächsten zugesagten Verabreden-Termin.
Gemeinsame `lineup`-Logik: nur tatsächliche Spieler; offene Einladungen, Absagen,
Ersatzplätze und bereits gestartete Termine ausgeschlossen. Auch Training enthalten,
keine automatische Zusage für noch nicht verschickte Serien. Ohne Termin kurzer
Leerhinweis. Quelle ausschließlich lokale TFB-Verabreden, keine Padel-Buchungsanbindung.
Padel-Vorbild in `8. Padel Bielstein 2027` nur gelesen, nicht verändert.
Read-only `TFB.meet.nextMatch(memberId)` in `meet.js`; Account in `app.js`, CSS
`.acct-next-match`. Test `npm run test:browser:next-match` mit localhost:5180 und
isolierten Daten erfolgreich: Sortierung/Zusagen/Ersatz/Absagen, Training, leer,
Position/Direktlink und 1100/834/390/320px. Keine neue Veröffentlichung oder Sicherung.

## Verbindliche Übergabe 13.10.2026: lokaler Stand v175

**Dieser Abschnitt ist aktuell; v165 und frühere Abschlüsse unten sind historisch.**
Nur die TFB-Website in `tfb-kiosk` wurde weiterentwickelt, nicht die separate
Padel-Anwendung in `01 Software`. Fokus-Darstellung wurde vom Nutzer mehrfach
praktisch bestätigt; letzter Auftrag ist die Dokumentationsaktualisierung.

### Einstieg und Vorführung

- Website: `/Users/jk/Dropbox/9. TFB-Website/tfb-kiosk/index.html`, lokal in Chrome;
  gespeicherte Nutzerinhalte liegen im bisherigen Browserprofil und Bildspeicher.
- Desktop `TFB.app`: eigener Hintergrundschalter, reines `#1C1A17`, ohne Logo/Text;
  zweiter Doppelklick stellt den bisherigen Hintergrund samt Darstellung wieder her.
- Desktop `TFB Vorführung.app`: lokale Website als Chrome-App-Fenster. Bei Bedarf
  Ctrl+Cmd+F für Browser-Vollbild; Cmd+W schließt. Apps/Swift-Quellen und Hinweise
  liegen neben dem Repository in `../Präsentationsmodus`, nicht im Website-Git.
- F in der Kopfzeile öffnet Fokus auch ohne Installation/Anmeldung. Links neben
  Klingel, unterkantenbündig; 21,6px-Kreis/1,15px-Anthrazitrand, F 90% Menügröße,
  Gewicht 600, 15,4px Abstand. Auf iPhone/iPad/Android NICHT sichtbar, unabhängig
  von Orientierung, Breite oder Browser-/App-Nutzung. Desktop braucht primären
  Maus-/Trackpad-Zeiger. Keine mobile Freigabe beauftragt.
- Fokus: dunkler Rahmen, mittige Breite 1440/834/390px oder seitlich ziehen;
  versteckte Steuerung am unteren Rand, Alt+1/2/3 für Breiten, Alt+P für Steuerung.
  Das sind Layoutsimulationen, keine iOS-Emulation. X/Escape beendet; eingebettetes
  Desktop-F beendet ebenfalls. macOS-Hintergrund bleibt durch F unverändert.
- Die normale Homepage enthält keinen Installations-/Fokus-Streifen mehr und
  keine entsprechende Bearbeitung. Auch aus dem Konto entfernt. Alte
  `site.focusStrip`-Daten erhalten, aber nicht gerendert.
- Öffentliche App-Installation ausdrücklich bis zur grundsätzlichen Zustimmung
  des Vorstands zurückgestellt. Nicht wieder aktivieren oder aus alten Wünschen
  als offener aktueller Implementierungsauftrag ableiten.

### Technischer Stand und Grenzen

- Cache `tfb-kiosk-v175`, letzte eingefrorene Git-Fassung `d8d7762` / Tag
  `stand-2026-10-12-v160`. Alle späteren Änderungen lokal/uncommittet; kein neuer
  Commit/Push/Tag/Deployment/JSON-Export bei diesem Abschluss. Nutzerdateien,
  vorhandene Änderungen und `.claude/` nicht zurücksetzen.
- `praesentation.html`, `assets/js/presentation.js`, `presentation-bridge.js`,
  `focus.js`, `assets/css/focus.css`: Fokus-Rahmen, Gerätebreiten, Brücke und Einstieg.
  Vollbild benötigt Nutzerklick und Browserfreigabe; sonst Fokus im Browserfenster.
- `demo-backend.js` lädt bei Fokus-Rückkehr lokale Daten frisch; `site.js` kann
  Bildcache erneuern, `app.js` aktualisiert Profilbilder. `autosave.js` pausiert
  das ausgeblendete Elternfenster, damit es keine alten Daten über neue schreibt.
- TFB-Signature-Kachel ohne Ball als gemeinsames App-Symbol, Name `TF Bielstein`;
  Quelle `assets/brand/tfb-app-icon-source.png`, Erzeugung `tools/build-brand.sh`.
- Native Test-App `TF Bielstein.app` / ZIP `assets/downloads/tf-bielstein-mac-v2.zip`:
  Paketfehler repariert, ganze App ad hoc signiert und entpackte ZIP verifiziert.
  Trotzdem keine Developer-ID/Apple-Notarisierung; Gatekeeper blockiert den
  heruntergeladenen Test-Installer weiterhin. Kein freigegebener öffentlicher
  Installationsweg, keine Sicherheitsumgehung. Build `../Präsentationsmodus/build-tf-bielstein.sh`.
  Mac-Launcher Apple Silicon/Chrome/lokaler Websiteordner; Windows-CMD nicht auf
  Windows getestet. Die Dateien bleiben als zurückgestellter Entwurf erhalten.
- `site.js`/`app.css`: Feature-Titel aus nicht trennbaren Wortspannen, Schrift
  bei Bedarf anhand des längsten Worts einpassen; ResizeObserver plus Render-/Font-
  Reaktion. Screenshotfehler „Tennisfreund / e“ behoben, ohne Inhaltsänderung.
- Foto-Randfix in `app.css`: `.gal-single` und Foto maximal verfügbare Bühnenbreite,
  kein horizontaler Fotoüberlauf. `tfb-presentation-page` versteckt nur die äußere
  Fokus-Scrollleiste und sperrt Root-Scroll bei Modal; iframe-Hintergrund Anthrazit.
  Normale Website bleibt scrollbar, Galerie/Foto-Wechsel unverändert bedienbar.
- `meet.js`: Wochentag Mo–So vor Datum/erstem Termin, nächster passender Tag nach
  lokaler Kalenderrechnung (auch über Zeitumstellung). Heute nur bei bevorstehender
  gewählter Uhrzeit. Bei Serien späterer Start desselben Tags; Abweichung wird
  beim Speichern zurückgewiesen. Einzel/Doppel: freie Datumswahl aktualisiert
  Wochentagsknöpfe. Seriendetails oben schreibgeschütztes Feld Wochentag.
  Datenmodell bleibt `from` als Quelle des Serientags, kein redundantes neues Feld,
  keine Migration bestehender Serien/verschickter Termine. Demo-Verabreden bleibt
  lokaler Speicher `tfb_meet_demo_v2`; echter automatischer Versand braucht weiterhin
  einen Serverdienst, nicht durch diese Oberfläche implementiert.

### Prüfnachweise und Weiterarbeit

Nach den letzten Codeänderungen erfolgreich: Fokus-Test einschließlich Foto-Rand,
Wortumbruch/F-Layout/Mobilausschluss; Wochentagstest einschließlich Speichern,
Seriendetails/Einzel/Doppel/Zeitumstellung; Galerie- und Übersichts-Regression.
Screenshots visuell geprüft. Alle Browserläufe in isolierten Testprofilen mit
synthetischen Inhalten, nicht mit den privaten Nutzerinhalten. iPhone/iPad-Größen
und Kennungen simuliert, kein vollständiger Safari-/echter Gerätetest.

Aus `tfb-kiosk`, Vorschau für Fokus-/Einladungstest starten:

```sh
python3 -m http.server 5180 --bind 127.0.0.1
npm run test:browser:focus
npm run test:browser:meet-weekdays
npm run test:browser:gallery
npm run test:browser:overview
```

Auf diesem Mac liefen Tests mit
`TFB_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`.
Die lokale HTML-Vorführung selbst braucht keinen Server. Vorschau über localhost
hat getrennte Demodaten; nicht mit den gespeicherten file:-Inhalten verwechseln.
`npm run test:browser` enthält weiterhin Übersicht/Galerie/Backups; die neuen
Fokus-/Wochentagstests separat. Backup-/Node-Nachweise aus früheren Abschlüssen
nicht als jetzt erneut ausgeführt ausgeben. Im Dokumentationsauftrag keine Tests
erneut ausgeführt und keine neue Inhalts-/Bildsicherung erstellt.

Nur auf neuen Nutzerauftrag weiterarbeiten. Bekannte Folgeaufgaben vom 12.10.2026
(Jugendschutz/Rechte, Buchungsspeicherung, echter Mehrbenutzerbetrieb/Lastschrift,
Sicherungsabgrenzungen und Wartbarkeit) bleiben offen; diese Vorführung ist keine
Produktivfreigabe. Projektgedächtnis oben und aktuelle Umsetzung haben Vorrang
vor den nachfolgenden historischen Zwischenständen.

## Früherer Abschluss dieses Chats 13.10.2026 (v165, historisch)

**Verbindlicher Einstieg: aktueller lokaler Stand vom Nutzer abgenommen.** Nutzer:
„Gefällt mir sehr gut alles jetzt“, aktuell keine weiteren Anpassungen. Dieser
Abschnitt enthält die letzte Button-Platzierung und Playwright-Einrichtung; die
früheren Abschnitte v161 bis v165 darunter sind historische Zwischenstände.
Bei diesem Abschluss wurden ausschließlich diese beiden Dokumentationsdateien aktualisiert.

- Projektordner: `/Users/jk/Dropbox/9. TFB-Website`, eigentliche Anwendung und Git-Repository:
  `/Users/jk/Dropbox/9. TFB-Website/tfb-kiosk`. Die andere Padel-Kopie im Projektordner
  ist nicht diese Anwendung und darf nicht mit ihr verwechselt werden.
- Startdatei: `tfb-kiosk/index.html`, vom Nutzer in Chrome als lokale Datei geöffnet.
  Kein Entwicklungsserver erforderlich. Cache aktuell `tfb-kiosk-v165`.
- Fertig implementiert: gemeinsame Galerie/Collage für Home und Aktuell mit Datum,
  Überschrift, optionalem Text oben/unten und bestehendem Vollbild-Blättern; direkte
  Maus-/Touch-Fotosortierung mit sofortiger Entwurfsanzeige; oberer/unterer Bleistift;
  durchsuchbare Beitragsübersichten und zuletzt korrigierte Button-Platzierung.
- Home: Im Standard-Look Wechselspiel sitzt „Alle Beiträge“ in der ersten Themenkachel
  bei Breiten unter 900px rechts untenbündig mit der 01; Zahl bleibt links, Kicker darunter.
  Die Desktop-Position bleibt oben rechts. Rückfall ohne Home-Themenkachel ist vorhanden.
- Aktuell: Abstand oberhalb der Spalten von 8 über 12 auf 16px erhöht. Hauptüberschrift,
  Einleitung und Desktop-Button nicht verschoben. Ab 1024px bleibt der Button rechts
  im Seitenkopf untenbündig mit der Einleitung; News/Save the Date auf gleicher Höhe.
  Unter 1024px sitzt genau ein sichtbarer Button rechts neben der aktiven Überschrift,
  untenbündig mit deren rotem Strich und unterhalb der mobilen Tab-Auswahl. Funktioniert
  bei News und Save the Date; die Zielübersicht enthält trotzdem nur News, keine Termine.
  Ohne erste Strukturüberschrift bleibt ein mobiler Zugang oberhalb der Inhalte erhalten.
- Letzte Layoutänderungen automatisiert und anhand isolierter Screenshots geprüft,
  anschließend vom Nutzer ausdrücklich bestätigt. Keine weiteren Änderungen ohne neuen Auftrag.
- Aktuelle Prüfnachweise: alle drei vorhandenen Browser-Tests erfolgreich (Übersicht,
  Galerie/Collage, Foto-Sicherung). Positionsprüfung bei 1280/500/390/320px, beide mobilen
  Aktuell-Tabs, Home-Nummer/Button-Unterkante und kein horizontaler Überlauf; Beitragsfilter,
  Sprungziele, Zurück/Neuladen, Chat-Regression sowie Live-Maus-/Touch-Fotosortierung geprüft.
  Fotoexport/-wiederherstellung und Ablehnung ungültiger Sicherungen geprüft.
  Nach letzter rein optischer Home-Korrektur Übersichtstest erneut erfolgreich;
  `git diff --check` erfolgreich. Frühere 51 Node-Tests auf v164 und 23 gezielte Tests
  auf v165 bleiben historische Nachweise; in diesem Chat nicht erneut ausgeführt.
- Änderungen seit v160 liegen lokal und uncommittet vor. Es wurde weder neu committet,
  getaggt noch veröffentlicht. Bestehender Sicherungstag `stand-2026-10-12-v160` bleibt.
  Geändert: `assets/css/app.css`, `assets/js/app.js`, `assets/js/demo-backend.js`,
  `assets/js/site.js`, `sw.js`, `tools/test-home-features.mjs` und beide Gedächtnisdateien.
  Neue Tests: `tools/test-browser-gallery.mjs`, `tools/test-browser-overview.mjs`.
  Neu in diesem Chat: `package.json` und `package-lock.json` für Playwright und Testbefehle.
  Vorbestehendes untracked `.claude/` erhalten, nicht bereinigen oder zurücksetzen.
- Browser-Tests verwenden ausschließlich isolierte Testdaten; persönliche Chrome-Daten,
  gespeicherte Inhalte und JSON-Sicherungen des Nutzers wurden dadurch nicht verändert.
  Die Dokumentationsaktualisierung erzeugt keine neue JSON-Inhaltssicherung.
- Nächster Arbeitsauftrag noch offen: erst die neue Nutzeranfrage aufnehmen. Keine
  weiteren Funktionen oder Umgestaltungen aus älteren Gesprächsteilen eigenständig beginnen.

## Frühere Playwright-Einrichtung (v165, historischer Prüfstand)

Playwright **1.64.0** als Entwicklungsabhängigkeit im Unterordner `tfb-kiosk` installiert;
Chromium-Testbrowser lokal vorhanden. Kostenlos, kein zusätzlicher Download für Besucher.
`node_modules/` ist bereits ignoriert. Die lokale HTML-Seite bleibt ohne Build nutzbar.

Aus dem Anwendungsordner:

```sh
npm run test:browser
```

Einzeln: `npm run test:browser:overview`, `npm run test:browser:gallery`,
`npm run test:browser:backups`. Bei neuer Einrichtung zuerst `npm ci`, danach
`npx playwright install chromium`. Auf diesem Mac benötigten die Testläufe außerhalb
der Codex-Sandbox die native Freigabe, weil der Chromium-Start darin von macOS blockiert
wurde. Das war eine Umgebungsbeschränkung, kein fehlgeschlagener Anwendungstest.
Screenshots entstehen unter `/tmp/tfb-*.png` und sind temporäre Prüfergebnisse.

Cache-Bezeichnung weiterhin `tfb-kiosk-v165`; in diesem Chat nicht erhöht. Die hier
geprüfte direkte HTML-Nutzung lädt die lokalen Dateien. Für einen späteren Betrieb
mit aktivem Service Worker die Cache-Version gemäß den Arbeitsregeln aktualisieren.

## Frühere Platzierung von Alle Beiträge 13.10.2026 (historisch)

Aktueller lokaler Arbeitsstand **v165**, Cache `tfb-kiosk-v165`, nicht committet oder
veröffentlicht; Sicherungstag v160 unverändert.

- Home: Button innerhalb der ersten Themenkachel oben rechts auf der Text-/Hintergrundfläche.
  Kein zusätzlicher Buttonstreifen oberhalb der Kacheln. Ohne Themenkachel bleibt der
  bisherige separate Zugang als Rückfall erhalten. Nicht im Baustein-Bearbeitungsmodus.
- Aktuell: Button rechts im Seitenkopf, unten bündig mit dem Einleitungstext, oberhalb
  von Save the Date. Er zeigt weiterhin ausschließlich News-Inhalte, keine Termine.
  Aus News-Spalte entfernt; News/Save the Date beginnen auf Desktop auf gleicher Höhe.
  Abstand zwischen Seitenkopf und Spalten auf 8px reduziert; mobile Kopfzeile darf umbrechen.
- Isolierter Browsercheck bei 1280/390/320px: Home-Button innerhalb der Textfläche und
  ohne Überdeckung der Nummer, keine zusätzliche Home-Zeile, bündige Desktop-Überschriften
  und Einleitung/Button-Unterkante, kein horizontaler Überlauf. Screenshots kontrolliert.
  Übersichtssuche, Filter, Rückkehr/Neuladen und Chat-Regression ebenfalls erfolgreich.
  23 gezielte Home-/Aktuell-Tests bestanden. Keine Inhalts- oder Sicherungsdaten geändert.

## Alle Beiträge für Home und Aktuell 13.10.2026

Aktueller lokaler Arbeitsstand **v164**, Cache `tfb-kiosk-v164`, nicht committet oder
veröffentlicht. Sicherungstag v160 bleibt unverändert.

- Home erhält „Alle Beiträge“ oberhalb der Inhalte. Bei Aktuell sitzt der Schalter
  ausschließlich in der linken News-Spalte, nicht bei „Save the Date“.
- Eigene Übersichten `#home/alle` und `#aktuell/alle` im kompakten Chat-Look, mit
  Titeln, Datum sofern vorhanden, Foto-Vorschau und Textauszug. Suche nach Titel/Text,
  Filter nach Beitragsart sowie „Nur mit Fotos“; Anzahl und leere Trefferanzeige.
- Themen, Beiträge, Texte, Fotos, gefüllte Galerien und Collagen in Seitenreihenfolge.
  Termine, Strukturüberschriften und ungespeicherte neue Bausteine bleiben draußen.
  Ausgeblendeter Galerie-/Collagentext erscheint auch nicht in Suche oder Vorschau.
- Klick springt über `#home/beitrag/<id>` bzw. `#aktuell/beitrag/<id>` zum bestehenden
  Inhalt auf der Seite, ohne neue Daten oder Kopien. Fokus folgt dem Ziel, Aktuell
  aktiviert dabei die mobile News-Ansicht. Bestehende Home-Artikel-/Albumrouten bleiben.
- 51 Node-Tests erfolgreich. Isolierter Browsercheck mit 20 Beiträgen plus Galerie
  und Collage je Seite: Desktop/Handy, Suche/Filter, direkte Sprünge, Zurück/Neuladen,
  keine Termine in der Übersicht sowie unveränderte Chat-Filter geprüft.
- Zusätzlicher Browser-Test: `tools/test-browser-overview.mjs`; nur isolierte Testdaten,
  kein Zugriff auf persönliche Chrome-Daten und keine Änderung der gespeicherten Seite.

## Unterer Bleistift und direkte Live-Sortierung 13.10.2026

Aktueller lokaler Arbeitsstand **v163**, Cache `tfb-kiosk-v163`, nicht committet oder
veröffentlicht. Sicherungstag v160 bleibt unverändert.

- Seiten mit vorhandenem Bearbeiten-Bleistift bekommen denselben Bleistift zusätzlich
  am Seitenende. Gemeinsame Montage in `app.js`; Home, Aktuell, Club, Sport, Chat, Kiosk
  sowie entsprechende Artikel-/Album-/Porträtansichten. Nur bei sichtbaren Admin-Werkzeugen.
  Der untere Seitenschalter erhält die Scrollposition statt nach oben zu springen.
- Fotos im Baustein-Editor direkt am Bild oder optional am Griff verschieben, mit Maus
  und Touch. Kein nativer Drag-Schatten über dem unveränderten Ziel: Die Vorschaubilder
  rücken bereits während des Ziehens in die neue Reihenfolge, Pfeile/Indizes werden angepasst.
- Galerie/Collage auf der Seite zeigt denselben Entwurf sofort, ohne Speicherung beim
  Ziehen. „Speichern“ übernimmt ihn; Editor schließen stellt den gespeicherten Stand wieder her.
  Abgebrochene Touch-Gesten stellen die Reihenfolge vor dem Ziehen wieder her.
- Foto einpassen/Löschen bleiben getrennt bedienbar. Auf den Sortierbildern dient die
  Touch-Geste dem Verschieben; außerhalb der Bilder bleibt der Editor scrollbar.
- Nachweis: 49 Node-Tests erfolgreich, Syntaxcheck und isolierter Browsercheck auf
  Desktop/Handy. Untere Bleistifte auf Home/Aktuell/Club/Sport/Chat/Kiosk, Scrollposition,
  Umordnung vor Loslassen ohne Griff, passende Seitenvorschau, Speicherung/Neuladen
  und Rücksetzen einer abgebrochenen Touch-Geste geprüft.

## Galerie und Collage flexibel platzieren 13.10.2026

Aktueller lokaler Arbeitsstand **v162**, Cache `tfb-kiosk-v162`; nicht committet oder
veröffentlicht. Sicherungstag v160 bleibt unverändert.

- Collage als eigener Baustein auf Home und Aktuell, neben Galerie. Galerie mit gleichgroßen
  Bildern, Collage mit wechselnden Bildgrößen im vorhandenen Unterseiten-Stil.
- Beide mit Überschrift, optionalem Artikel-Datum und ausblendbarem Fließtext.
  Textposition wählbar: unter der Überschrift oder unter den Bildern. Bestehende Galerien
  ohne Positionsangabe behalten ihren Text unter den Bildern. Ausblenden löscht keinen Text.
- Seitenposition beider Module über die bisherigen Hoch-/Runter-Pfeile im Bearbeitungsmodus;
  Home hat separate Hinzufügen-Knöpfe, Aktuell beide Typen im Baustein-Auswahlmenü.
- Bildgriff im Fotoeditor für direktes Verschieben, auch per Touch. Ziel wird hervorgehoben;
  Scrollen am Rand der Seitenleiste beim Ziehen. Zusätzlich Bildpfeile und Pfeiltasten am Griff.
- Beide öffnen das angeklickte Foto im selben vorhandenen Collagen-Betrachter.
  Je Modul höchstens 100 Fotos, Upload- und Speicherprüfung auf beiden Typen.
- 49 Node-Tests erfolgreich. Erweiterter Browsercheck unter `tools/test-browser-gallery.mjs`
  erfolgreich: Home/Aktuell auf Desktop/Handy, Bildbetrachter, Modul-Pfeile, Textposition,
  gespeicherte Reihenfolge nach Maus- und echtem Touch-Ziehen sowie Neuladen.
  Griff oben mittig, Kamera links und Löschen rechts; drei Vorschaubilder pro Zeile,
  damit die Bedienelemente auch auf dem Handy nicht überlappen.

## Galerie für Home und Aktuell 13.10.2026

Aktueller Arbeitsstand **v161**, Cache `tfb-kiosk-v161`; noch nicht eingefroren,
committet oder veröffentlicht. Der Sicherungstag v160 unten bleibt unverändert erhalten.

- Gemeinsamer Galeriebaustein auf Home und Aktuell, auf Home über „Galerie hinzufügen“
  neben dem bisherigen Themen-Hinzufügen verfügbar. Keine neuen Beispielgalerien in den Nutzerdaten.
- Klick auf beliebiges Foto öffnet direkt dieses Foto im bestehenden Collagen-Betrachter,
  identisch zur Home-Unterseite: Klick aufs Bild, Pfeile, Pfeiltasten, Wischen,
  umlaufendes Blättern und „Alle Fotos“. Kein separater neuer Viewer.
- Optionales Datum mit bestehender Artikel-Datumsplakette und ausgeschriebenem Datum;
  optionaler formatierter Fließtext unter den Fotos. „Text unter der Galerie anzeigen“
  blendet nur die Darstellung aus, gespeicherter Text bleibt erhalten. Datum kann leer bleiben.
- Fotos sortieren, entfernen und einpassen wie bisher. Höchstens 100 Fotos;
  Uploadprüfung und `saveSite` sichern die Grenze auch für Galeriebausteine ab.
  Bestehende Galerieinhalte bleiben erhalten, keine Datenmigration erforderlich.
- 48 Node-Tests erfolgreich. Isolierter Chrome-Test auf Desktop/Handy prüft Home/Aktuell,
  Klick/Pfeile/Tastatur, Rückkehr zur Übersicht, Neuladen, Editor-Datum, Textausblendung
  ohne Datenverlust und Anlegen einer neuen Home-Galerie. Private Browserdaten unverändert.
  Werkzeug: `tools/test-browser-gallery.mjs` (Laufzeitvariablen wie andere Browsertests).
- Praktisch: Seite neu laden, Admin-Werkzeuge bei Bedarf über roten Ball einblenden;
  Home bearbeiten → Galerie hinzufügen. Auf Aktuell: Baustein hinzufügen → Galerie.

## Tagesabschluss 12.10.2026

**EINGEFROREN: v160**, Cache `tfb-kiosk-v160`, Katalogversion 13.
Lokaler Sicherungstag: **`stand-2026-10-12-v160`**. Nicht veröffentlicht und nicht gepusht.
Nutzer hat den fertigen Kiosk bestätigt: „Das sieht alles top aus.“ Heute keine weiteren
Änderungen; Weiterarbeit erst auf ausdrücklichen Auftrag. Ältere Abschnitte unten sind Verlauf.

- Home: Standard `#F5F0E6`, genau eine individuelle bunte Fassung; Umschalten per
  Themennummer funktioniert auch mit ausgeblendeten Stiften und wurde vom Nutzer bestätigt.
  Keine erfundenen Ersatzfarben. Roter TFB-Ball bleibt der Vorführschalter für Admin-Werkzeuge.
- Foto-Sicherung und Wiederherstellung abgesichert; Nutzer bestätigt die praktische Funktion.
- Kiosk: echtes Vereinsangebot und Listenpreise übernommen, Produktzeichnungen vom Nutzer
  abgenommen. Endgültige Reihenfolge: Alkoholfreie Getränke, Bier, Aperol & Wein,
  Spezialitäten, Spielbetrieb, Snacks, Vereinsshop (weiterhin zukünftig).
- Spezialitäten: nur die drei Speisen. Spielbetrieb: Flutlicht (1 h) 5,00 € und Gastspieler
  für eine Stunde 8,00 €. Snacks einschließlich Eis unverändert erhalten.
- Letzter Prüflauf: 46 Node-Tests erfolgreich; Kiosk und erweiterte Strichliste auf
  1280×900 und 390×844 mit synthetischen Daten geprüft, ohne horizontale Überbreite.
- Der Git-Sicherungspunkt enthält Software, Dokumentation und Tests, nicht den privaten
  Browserinhalt. Eigene Fotos, Farben, Mitglieder und Buchungen benötigen weiterhin eine
  vollständige JSON-Sicherung über die vorhandene Sicherungsfunktion.
- Bekannte Folgeaufgaben bleiben unten vorgemerkt: Jugendschutz beim Import, bestätigte
  Buchungsspeicherung, Bereinigung alter Bildbestände, echter Mehrbenutzerbetrieb,
  Lastschriftabschluss und Wartbarkeit. Keine davon ist durch diesen Tagesabschluss erledigt.

## Spielbetrieb und getrennte Snacks (12.10.2026, Cache v160)

- Reihenfolge jetzt Getränke → Bier → Aperol & Wein → Spezialitäten → Spielbetrieb
  → Snacks → zukünftiger Vereinsshop. Spezialitäten nur Bockwurst, Grillwurst, Grillfleisch;
  bestehende Süßigkeiten, Chips und Eis unter Snacks, unveränderte Preise und Symbole.
- Spielbetrieb: Flutlicht (1 h), Eine Stunde, 5,00 €; Gastspieler, Eine Stunde, 8,00 €.
  Preise vom Listenfoto, Stundenbezeichnung für Gastspieler ausdrücklich vom Nutzer.
  Neue Symbole: Flutlichtmast und Tennisspieler mit Schläger.
- Einmalige Migration 12 → 13: Bereichstrennung und neue Gebühren, bestehende Preise,
  Produktkennungen, individuelle Artikel und Buchungshistorie bleiben erhalten.
- Strichliste mit eigener Spielbetrieb-Spalte; Speisen zählen weiterhin unter Snacks.
- Dies sind buchbare Gebühren im bisherigen Kiosk, keine Platz-/Zeitreservierung.
  Frühere offene Einordnungsfrage zu Flutlicht/Gastspieler damit vom Nutzer entschieden.
- Nachweis: 46 Tests erfolgreich; neue Bereiche und Strichliste auf Desktop und Handy
  im getrennten Testbrowser mit synthetischen Buchungen geprüft.

## Apfel und Cornetto verfeinert (12.10.2026, Cache v159)

Apfelsymbol samt Blatt/Stiel um 25 % verkleinert, um dieselbe Etikettmitte skaliert;
Flasche und Etikett unverändert. Cornetto ohne breite Welle, mit feinem gleichmäßigem
Waffelmuster und schlichter Eiskugel. Alle übrigen Produkte, Preise und Daten unverändert.

## Produktname Wein ergänzt (12.10.2026, Cache v158)

„Grauburgunder Wein“ statt „Grauburgunder“. Gezielte Migration 11 → 12 ersetzt nur
den bisherigen Standardnamen, erhält individuelle Namen und alle übrigen Produktdaten.

## Aperol und Apfelschorle nach Nutzerreferenz (12.10.2026, Cache v157)

- Aperol-Dose bei gleicher Breite höher, ohne TO GO. Orange mit blauem Band,
  gelbem APEROL und weißem SPRITZ nach dem gelieferten Screenshot; weiterhin stilisiert.
- Apfelschorle jetzt mit unveränderter eigener Produktfarbe in der Wasserflaschenform;
  quadratisches weißes Etikett mit mittigem Apfel statt senkrechtem APFEL, Stern oder Welle.
  Wasser selbst und alle übrigen Produkte unverändert.
- FASS-Buchstaben senkrecht um die Etikettmitte zentriert, gleicher Abstand oben/unten.
- Nur Zeichnungen geändert, keine neue Katalogmigration und keine Änderungen an Preisen
  oder gespeicherten Buchungen. 44 Node-Tests und Desktop-/Handyprüfung erfolgreich.

## Kiosk-Symbole verfeinert (12.10.2026, Cache v156)

- Zunft-Flasche und Fassbrause verwenden jetzt die Sportsfreund-/Malzbier-Flaschenform.
  Zunft-Flasche goldfarben wie das Glas (`#E9B949`), Fassbrause mit bisherigem hellem
  Akzent (`#B6C85D`). Fassbrause und Apfelschorle mit senkrechten FASS-/APFEL-Etiketten.
- Weizen dunkler orange (`#D88A2E`), Radler heller goldfarben (`#E9CD70`), Form unverändert.
  Aperol-Dose mit größerer APEROL-/SPRITZ-/TO-GO-Beschriftung, weiterhin stilisiert:
  keine bestätigte Nachbildung der im Verein angebotenen Verpackung.
- Bockwurst ohne Streifen, Grillwurst mit vier Grillstreifen und eigenem Symbol;
  Grillfleisch mit unregelmäßiger Kontur. Grauburgunder unverändert.
- Strichliste: „Kränze“ statt „Kranz“, ausdrücklich vom Nutzer bestätigt.
- Einmalige Katalogmigration 10 → 11 betrifft nur diese Produktfarben/-symbole;
  Preise, Buchungshistorie und nachfolgende individuelle Änderungen bleiben erhalten.
- Herstellerprüfung: Zunft Fassbrause gilt als alkoholfrei, enthält aber <0,5 % vol;
  normales Zunft Radler enthält 2,4 % vol. Tatsächliche Radler-Variante im Verein noch
  nicht anhand einer Verpackung bestätigt. Quellen: Erzquell-Sortimentsseiten
  [Fassbrause](https://www.erzquell.de/zunft-koelsch/zunft-koelsch-sortiment/zunft-fassbrause/),
  [Radler](https://www.erzquell.de/zunft-koelsch/zunft-koelsch-sortiment/zunft-radler/).
- Nachweis: 43 Node-Tests erfolgreich; isolierte Browserprüfung auf Desktop und Handy
  mit synthetischen Daten. Keine Original-Browserdaten verändert, nicht veröffentlicht.

## Erster Kiosk-Vorschlag nach echter Liste (12.10.2026, Cache v155)

Nutzer bestätigt Foto-Sicherung als funktionierend. Anschließend echte Getränkeliste als Foto
geliefert und erste Anpassung beauftragt. Lokal vorbereitet, nicht veröffentlicht:

- Reihenfolge: Alkoholfreie Getränke → Bier → Aperol & Wein → Spezialitäten → Vereinsshop.
  Spezialitäten enthält Essen, bestehende Snacks und Eis, ist offen und vorletzter Bereich.
  Vereinsshop samt bisherigen Artikeln bleibt als zukünftiges Angebot erhalten.
- Wasser/Apfelschorle/Cola/Fanta jeweils Flasche 0,25 l, 1,50 €;
  Fassbrause/Sportsfreund/Malzbier/Radler jeweils Flasche 0,33 l, 2,10 €.
- Zunftkölsch: Flasche 0,33 l 2,20 €, Glas 0,2 l 1,80 €, Kranz mit neun Kölsch 14,50 €.
  Weizen Flasche 0,5 l 3,50 €; keine unbelegte Kennzeichnung als alkoholfrei.
- Aperol Büchse 0,25 l 3,50 €; Grauburgunder Flasche 0,75 l 10,00 €.
- Bockwurst mit Brot 2,50 €, Grillwurst mit Brot 3,00 €, Grillfleisch mit Brot 4,00 €.
  Bestehende Snacks-/Eispreise bleiben erhalten. Red Bull nicht auf der Liste: im bestehenden
  Katalog deaktiviert statt gelöscht, bei Neustart nicht mehr als neues Angebot vorbelegt.
- Neue Illustrationen im vorhandenen SVG-Stil: Kölsch-/Weizenflasche, Apfelschorle,
  Fassbrause, Aperol-Dose, Weinflasche, Wurst/Brot und Grillfleisch/Brot. Illustrationen sind
  ein erster Vorschlag, keine fotografisch oder markengetreu bestätigten Verpackungen.
  Wasser heißt neutral „Wasser“; bisherige Gerolsteiner-Zeichnung vorläufig beibehalten.
- Einmalige Katalogmigration 9 → 10, bestehende Produktkennungen bleiben erhalten.
  Alte Striche/Buchungen und ihre Preise werden nicht geändert; individuelle Snacks-/Shopdaten
  und spätere Admin-Preisänderungen bleiben erhalten. v8 → v9 bleibt ein eigener Zwischenschritt.
- Flutlicht 5,00 €/Stunde und Gastspieler 8,00 € sind auf dem Foto, aber noch nicht als
  Kioskartikel übernommen: Entscheidung zur Einordnung/Abwicklung weiterhin offen.
- Nachweis: zwei Katalogtests zu Liste, Symbolen, Reihenfolge, Migration und Historie;
  Browserprüfung mit synthetischen Daten auf 1280×900 und 390×844, keine horizontale
  Überbreite oder leeren Symbole; Screenshots visuell geprüft. Werkzeug: `tools/preview-catalog.mjs`.
- Nutzer soll neu laden und den Vorschlag im Kiosk prüfen. Kein Reset und keine manuelle
  Übertragung privater Browserdaten erforderlich. Listenänderung wird beim Laden gespeichert.

## Foto-Sicherung lokal abgesichert (12.10.2026, Cache v154)

Auf ausdrücklichen Auftrag vor den Kiosk-Inhalten bearbeitet. Beim Tagesabschluss in den
lokalen Sicherungspunkt v160 aufgenommen; nicht gepusht oder veröffentlicht.

- Export wartet auf den vollständigen Bildspeicher-Leseabschluss. Fehler, blockierter Speicher
  und Zeitüberschreitung brechen die Sicherung ab; keine leere Ersatz-Fotosammlung.
  Für die reine Seitenanzeige bleibt der bisherige kurze Fallback erhalten.
- Foto-/PDF-Einträge und verknüpfte Kennungen werden vor Export/Import geprüft. Fehlende oder
  ungültige Einträge werden nicht stillschweigend übersprungen.
- Import schreibt sämtliche Fotos in eine neue, getrennte Bilddatenbank. Erst nach erfolgreichem
  Transaktionsabschluss wird der vollständige Inhaltsstand samt Bilddatenbank-Kennung aktiviert.
  Bei Abbruch, Timeout oder vollem Gerätespeicher bleibt der bisherige aktive Stand erhalten.
- Die bisherige Bilddatenbank wird bei erfolgreichem Import bewusst nicht gelöscht. Das erlaubt
  sichere Aktivierung auch bei Unterbrechung, benötigt aber zusätzlichen Browserspeicher.
  Bereinigung alter Bilddatenbanken ist ein separater zukünftiger Job; nicht unbesehen löschen,
  insbesondere wenn andere TFB-Tabs noch geöffnet sind.
- Automatische Sicherung erstellt zuerst den vollständigen Export und öffnet erst danach die
  Zieldatei. Schreibfehler führen zum Abbruch der temporären Schreibfassung. Läufe sind serialisiert;
  Fehlerstatus und Wiederholungsoption sichtbar, Erfolg nur nach abgeschlossenem Schreiben.
- Automatische Sicherung funktioniert auch mit per Logo ausgeblendeten Admin-Stiften.
  Fotoänderungen werden zusätzlich über eine Laufzeit-Revisionskennung erkannt.
- Nachweis: 40 Node-Tests erfolgreich; separater Chrome-Test mit echtem IndexedDB und rein
  synthetischen Daten erfolgreich. Bestehende JSON-Sicherungen nur lesend geprüft:
  automatisch 117 Foto-/PDF-Einträge, manuell 51; keine ungültigen Einträge oder fehlenden
  referenzierten Kennungen. Nutzerbrowser und Originaldateien nicht verändert.
- Nächster praktischer Schritt: Seite neu laden, automatische Sicherung im Konto auf Status/Erlaubnis
  prüfen, zusätzlich eine datierte manuelle Sicherung erstellen. Keine alte Datei testweise in den
  echten aktuellen Browserstand laden. Zusätzliche Browserstände `extra` werden weiterhin vom
  bisherigen App-Import verarbeitet; keine geräteübergreifende oder tabübergreifende Transaktion.

Testaufrufe: `node --test tools/test-backups.mjs tools/test-board-photos.mjs tools/test-home-features.mjs tools/test-photo-drop.mjs tools/test-photo-viewer.mjs`.
Optionaler echter Browsercheck: `tools/test-browser-backups.mjs` mit Playwright;
`TFB_PLAYWRIGHT_MODULE` und `TFB_CHROME_PATH` können lokale Laufzeitpfade vorgeben.

Historischer Stand: **12.10.2026 – EINGEFROREN** als Git-Tag **`stand-2026-10-12-v152`** (v152, Cache `tfb-kiosk-v152`;
frühere Tags heute: `stand-2026-10-12-v151`, `stand-2026-10-12-v150`, `stand-2026-10-12-v149`, `stand-2026-10-12` = v138, `stand-2026-10-12-abend` = v141). Alles lokal committet,
4 Node-Tests grün. Nicht veröffentlicht, nicht zu GitHub gepusht – nur auf Wunsch des Nutzers pushen.
Nutzer: „Ansonsten alles jetzt eins A. Und so einfrieren bitte.“

## Offene Aufgaben aus der Prüfung vom 12.10.2026

Auf Wunsch des Nutzers für spätere Arbeiten vorgemerkt; hier noch nicht umgesetzt:

- **Jugendschutz beim Mitgliederimport:** Geburtsdatum/Altersstatus gehen beim bisherigen Import
  verloren. Unbekanntes Alter darf keine Erwachsenenfreigabe für Beiträge und öffentliche Fotos bedeuten.
  Import, bestehende Mitglieder und elterliche Freigaben gemeinsam prüfen.
- **Kiosk-Buchungen bei Speicherfehlern:** `addToTab` meldet bislang Erfolg, auch wenn `save(db)`
  scheitert. Erfolg erst nach bestätigter Speicherung; Fehler und Wiederholungen gezielt testen.
- **Vollständige Sicherung und sichere Wiederherstellung:** Kernkorrektur lokal erledigt (siehe oben).
  Später: sichere Bereinigung alter Bilddatenbanken und übergreifende Behandlung zusätzlicher
  Browserstände (`extra`), insbesondere bei mehreren geöffneten Tabs.
- **Echter Mehrbenutzerbetrieb/Supabase:** Direkte Browser-Speicherung und simulierte Antworten
  (insbesondere Verabreden) ersetzen; Identitäten, Rollen, Mannschaftszuordnung und Zugriffsrechte
  serverseitig absichern. Ein bloßer Austausch von `TFB.api` reicht nicht.
- **Monatliche Lastschriftabrechnung:** Den vollständigen Ablauf samt Mandaten, Abschluss,
  Fehlerfällen und Verantwortlichkeiten vor echtem Kioskbetrieb fertigstellen und abnehmen.
- **Wartbarkeit und Dokumentation:** Große Dateien `site.js`/`app.js` schrittweise mit Tests
  strukturieren; veraltete README-Texte und verbliebene Padel-Dokumentation klar abgrenzen.

**Aktueller Auftrag Home-Farben:** Keine neuen Farben erfinden. Standard bleibt `#F5F0E6`;
die bunte Fassung verwendet ausschließlich die vom Nutzer per Pipette festgelegten Werte.
In den beiden gelesenen Sicherungen im Projektwurzelordner
(`TFB-Sicherung_2026-10-11_15-23.json`, `TFB-Sicherung-automatisch.json`) enthalten die drei
Home-Themen keine `bg`-/`linkBg`-Werte. Neuere Sicherung bzw. aktueller Browserstand noch
zu prüfen; daraus folgt ausdrücklich nicht, dass die Farben überall verloren sind.
Die anschließend gelieferten Screenshots belegen vorhandene Farben im laufenden Editor
(unter anderem Hintergrund `#99C6FD`, Link-Knöpfe `#C4E3FF`). Keine Neuanlage erforderlich.

**Lokale Korrektur nach v152 (Cache v153, noch nicht committet/veröffentlicht):**
Die Home-Nummern sind echte Schaltflächen über die gemeinsame Aktionssteuerung,
mit Handzeiger und Tastaturbedienung, bei unveränderter Zahlengestaltung.
Ein nachgewiesener Konflikt wurde behoben: Die offene Themenvorschau erzwingt nicht mehr
bunte Farben gegen einen ausdrücklichen Nummernklick; bereits der erste Klick zeigt Standard.
34 Node-Tests bestehen, einschließlich beider Admin-Ansichten, aller drei Nummern,
Neuladen und unveränderter Speicherung beim Vorführen.
Der Klick in der bereits geöffneten lokalen Chrome-Seite konnte wegen der Browser-Zugriffsgrenze
nicht direkt geprüft werden. Nutzer soll nach Neuladen prüfen; Ursache des zuvor gemeldeten
Verhaltens bei geschlossenem Editor ist damit nicht abschließend nachgewiesen.

## Wie es weitergeht

- **Nächster Job (Nutzer):** Der Nutzer hat die echte **Getränkeliste der Tennisfreunde** fotografiert und
  reicht das Foto als nächsten Schritt ein (heutiges Kiosk-Angebot
  mit Preisen). Damit den Kiosk rund machen: exakt die heutigen Artikel, Bereiche, Preise und Symbole
  übernehmen (Sortiment liegt in `demo-backend.js` → `DEFAULT_CATALOG`, Änderungen bestehender Daten über
  `catalogVersion`-Migration wie bisher; Admin kann auch direkt am Kiosk über den Stift pflegen).

- **Pause für Änderungen.** Der Nutzer spricht zuerst mit dem Vorstand, ob und wie es mit der
  neuen Website weitergeht. Bis dahin **nichts an der App ändern**, außer der Nutzer bittet ausdrücklich.
- Nutzer findet den Stand präsentationsreif („Das gefällt mir alles. Sehr gut.“).
- iPhone/iPad-Test vorerst verworfen: Nutzer präsentiert am Mac (Chrome, Hochformat per Fensterbreite
  bzw. Geräte-Ansicht der Entwicklertools); echte Geräte erst mit der späteren echten App.

## Was am 12.10.2026 dazukam (Details im Projektgedächtnis)

- **nuLiga-Abgleich wöchentlich automatisch:** GitHub Actions `.github/workflows/update-teams.yml`,
  montags 04:00 UTC, schreibt `assets/data/teams.js` und committet („Stand“-Datum). Kosten: im
  Freikontingent (Billed 0 $). Spielerlisten (`rosters.js`, Namen) bleiben bewusst lokal.
- **Sport:** „Mannschaftsporträt“ bzw. „News“ einzeln rot, sobald Porträt gespeichert / News da (v121).
- **Insider News:** Clubgeflüster-Beitrag nur aus einer Mannschaft entfernen, ohne ihn im Chat zu
  löschen („Aus dieser Mannschaft entfernen“, v122).
- **Verabreden rund (v123–v135):** Kacheln Einzel · Doppel · Training · Mannschafts-Spiel;
  „Einmalig“ oder „Jede Woche“ (bis-Datum, Einladung 1–7 Tage vorher); Treffen-/Abfahrtszeit;
  „Wartet auf deine Antwort“; Gruppen mit Bestätigung im Postfach (Gruppe = alle Hinzugefügten,
  unbestätigt heißt nur „noch nicht in deren Meine Gruppen“); Gruppen als Pillen beim Einladen
  (Häkchen); Namen alphabetisch nach Nachname; „Wo“ = Tennisanlage Bielstein vorbelegt.
  **Keine Historie** – Vergangenes verschwindet spurlos. Beispielgruppen entfernt.
- **Postfach (Glocke neben dem Profilbild):** nur Einladungen und Gruppen, keine E-Mails, kein
  Aufploppen; Hinweise mit × oder „Alle Hinweise entfernen“, sonst nach 7 Tagen weg; offene
  Einladungen bleiben bis zur Antwort. Chat/Insider News bewusst ohne Postfach.
- **Kopf:** Glocke 27 px, 31 px Abstand zum Profilbild, unten bündig; Desktop-Menü 15 % enger, mittig.
- **Fenster ruhiger:** `openSheet` tauscht bei offenem Fenster nur den Inhalt (kein Neu-Einblenden).
- **Mitgliederliste aus Excel/CSV** (Konto → Admin): nur Nr., Vorname, Name, E-Mail(s); Vorschau
  neu/geändert/weg; Beispielmitglieder werden beim ersten Import ausgeblendet. Echte Liste liegt
  unter `90 Archiv/Altbestand/Mitgliederliste TFB_2026.xlsx` (307 Personen) – nie ins Repo.
- **Automatisch sichern** (Konto → Admin): Ordner wählen → `TFB-Sicherung-automatisch.json`
  (max. 1×/Min. bei Änderung). Empfehlung: Ordner außerhalb von Git-Repos, z. B. `Dropbox/TFB-Sicherungen`.
- **Admin aufgeräumt (v137):** Seite „Verwaltung“ entfällt; Stift auf allen Seiten (neu auch Kiosk);
  Admin-Teil im Konto-Fenster (Mitgliederliste, Sichern & Laden, Foto-Freigaben). Schrift fest
  **Avenir Next**, Farbe fest **Anthrazit #2A2D2E**. „E-Mail-Benachrichtigungen vom Club“ (an);
  „Einladungen von allen“ (an) ist mit der Namenssuche beim Verabreden verknüpft.
- **Foto-Freigaben (Admin)** als Karten mit Status und Pillen (v138).
- **Vorführ-Schalter (v148, nur Demo):** Klick auf den roten Ball im Logo blendet Admin-Stifte aus/ein.
- Menü: Padel (externer Link) reagiert beim Überfahren wie die anderen Punkte (v149).
- **Farben Home: Standard | Bunt (v150):** genau eine bunte Fassung (Farben je Thema), Umschalter im
  Home-Bearbeiten-Modus; versteckter Vorführ-Schalter: Klick auf die große „01“ (nur Demo/Admin, nicht gespeichert).
- **Beim Laden (Demo):** Admin-Werkzeuge ausgeblendet und Home-Farben „Standard“ (beige) – für die Präsentation.
  Einblenden per rotem Ball im Logo, bunte Fassung per Klick auf eine Themennummer 01/02/03 … (v152, in jeder Ansicht).
- Kopf: Profilbild/Glocke per Messung 4 px unter der Menü-Grundlinie (optischer Ausgleich, v147 – abgenommen).
- Anmeldung: Auge im Passwortfeld (v143), Demo-Kasten entfernt (v144).
- **v139–v141 (nachmittags ergänzt):** Farben je Home-Thema (Textseite + Link-Knöpfe), Link-Abstände (Standard 26/14 px, je Thema ▲/▼) –
  Farbfeld, Pipette, Farbcode, „Standard“ (#F5F0E6); dunkler Grund → helle Schrift. Rückfallpunkt: Tag `stand-2026-10-12`.
- **Entscheidung:** Kiosk-Freigabe wird **nicht** in der App zurückgenommen; Ausstieg per E-Mail an den Vorstand.
- **Supabase-Plan:** Verein bekommt einen bezahlten Supabase-Account; darin zwei Projekte `padel`
  und `tfb` (strikt getrennt). Nutzer plädiert für **einen** gemeinsamen Lastschrift-Kiosk für
  Tennis und Padel (dann im TFB-Projekt, Padel verlinkt) – Vorstand entscheidet. Mitgliederliste
  wird außerhalb als Excel gepflegt und in beide Apps hochgeladen.

## Auf iPhone/iPad testen (Stand 12.10.)

- Doppelklick-Datei aus der Dropbox läuft auf iOS nicht (Dropbox zeigt nur eine Vorschau ohne JavaScript).
- Möglich: Mac als kleiner Webserver im WLAN (`python3 -m http.server 5180` im Ordner `tfb-kiosk`),
  auf iPhone/iPad `http://<IP des Macs>:5180` öffnen. Jedes Gerät hat **eigene** Demo-Daten.
- Haken: Über `http://` im WLAN fehlt `crypto.subtle`; das Demo-Passwort wird dann anders
  verschlüsselt als auf dem Mac (`file://`). Eine Sicherung vom Mac lässt sich laden, die Anmeldung
  mit dem Mac-Passwort klappt dann aber nicht. Lösung bräuchte eine kleine Änderung (einheitliche
  Prüfsumme) oder eine Veröffentlichung unter HTTPS – erst nach Freigabe durch den Nutzer.

---

## Ältere Stände (11.10.2026 und früher)

## Eingefrorener Stand (vom Nutzer abgenommen: „das gefällt mir sehr gut alles jetzt“)

- **Home:** Look „Wechselspiel“ (Standard; Klassisch/Magazin im Admin), bis 10 Themen,
  Themen-Leiste im Editor, feste Typografie, Fließtext Fett/Kursiv/Rot/Link, zwei Links.
- **Unterseiten und Mannschaftsporträts:** gleiche Bedienung – 1 Fotos oben (1 breit,
  2–4 Quadrate, im Seitenformat einpassbar), 2 Überschrift (3 Zeilen), 3 Inhalt aus
  Abschnitten (Text · Überschrift · Zitat, rotes ⊕, Pfeile), 4 Fotos unten (Kollage).
- **Aktuell:** Beiträge kurz und knackig ohne Unterseiten, 1–4 Fotos (breit/Quadrate),
  schlanke Werkzeugleiste.
- **Chat:** Seite „Clubgeflüster“, Beiträge mit freiwilliger roter Überschrift.
- **Menü oben** im Admin pflegbar (Namen, Ziel App-Seite/Website, Reihenfolge, sichtbar).
- **Leitziel:** Mitglieder und Jugendliche ohne EDV-Erfahrung pflegen alles selbst –
  einfach, WYSIWYG, nichts verstecken, was auf der Seite sichtbar ist.

## Nachtrag nach dem Einfrieren (v117)

- Kollagen unten (Unterseiten, Mannschaftsporträts, Fotoseiten) und Titelfotos oben
  öffnen beim Antippen die blätterbare Galerie direkt beim angeklickten Foto: weiter per
  Klick aufs Foto, Pfeilknöpfe, Pfeiltasten, Wischen; „Alle Fotos“ zur Übersicht.
  Bis zu 100 Fotos (`openGallery(..., start)`; vorher nur Einzelbild).

- v118: **Club → History**: neuer Abschnitt neben Kooperationen/unter Anfahrt
  (Block `v-history`, per Seed-Update `club-history-2026-10-11` mit `insertAfter: 'v-koop'`
  in bestehende Daten eingefügt). Überschrift (rot beim Überfahren) und „Mehr erfahren“
  führen zu `#club/history` – Magazin-Seite mit demselben Editor wie das
  Mannschaftsporträt (Fotos oben, 3 Überschriftszeilen, Abschnitte, Galerie bis 100 Fotos,
  blätterbar). Ablage `site.stories.history`; Konfiguration `STORY_PAGES` in site.js –
  weitere solche Seiten lassen sich dort ergänzen. Kurztext im Club-Admin, Unterseite über
  „+ History anlegen“ bzw. Stift (nur Admins).

- v119: History **ohne Fotos oben** (`STORY_PAGES.history.noHero`): Editor 1 Überschrift ·
  2 Inhalt · 3 Fotos – Galerie unter dem Text (bis 100). Früher oben abgelegte Fotos
  wandern automatisch an den Anfang der Galerie (`mergeHeroIntoGallery`).

- v120: Speichern der History-Seite geprüft (Texte + Fotos, Neuladen, zweites Speichern) –
  funktioniert; Meldung heißt jetzt „History gespeichert“. Nutzer: „Sehr schön. Bitte so einfrieren.“

## Nächster großer Job: Verabreden

- Nutzer: „Verabredungen aufdröseln und rund machen – im Moment noch nicht optimal.“
- Vorgehen wie bisher: erst gemeinsam mit echten Daten ansehen und bewerten, dann
  Plan, dann umsetzen. Code: `assets/js/meet.js` (Route `#treffen`, Menüname „Verabreden“).


## Neu: Ordner heißt jetzt „9. TFB-Website“

- Projektordner umbenannt: `Dropbox/9. TFB-Kiosk` → **`Dropbox/9. TFB-Website`**.
  Der App-Unterordner heißt weiterhin `tfb-kiosk/` (Repository-Name).
- Start nur noch per Doppelklick auf **`TFB-Website öffnen.html`**;
  `TFB-Kiosk öffnen.html` wurde auf Wunsch gelöscht.
- Inhalte liegen im Browser (Chrome, Ursprung `file://`), nicht im Ordner. Falls nach
  der Umbenennung etwas fehlt: Verwaltung → Inhalte laden mit der letzten Sicherung.

## Neu in v100 (Aufräumen Stufe 1)

- Alte „vier Info-Knöpfe“ (Club) samt Editor und CSS entfernt – waren ein
  Missverständnis; gewünscht waren fünf Kennzahlen (vorhanden).
- Aktuell: Hinweis „Vorführversion: Termine und Beiträge sind Beispiele.“ entfernt.
- Chat: nur noch ein Titel; „Clubgeflüster“ (editierbar) steht als rote Zeile über
  „Chat“. Partnerzeile heißt „Der Chat wird dir präsentiert von“.
- Handy-Menü: sieben Punkte passen bis 320 px in eine Zeile (Schrift wächst mit Breite).
- **Vorstand wird NICHT automatisch sortiert** – Reihenfolge wie auf der heutigen
  TFB-Website, pflegt der Nutzer selbst im Admin.
- Vorstandsfotos und -kontakte sind bewusst im Repository (wie auf der heutigen
  Vereinswebsite veröffentlicht; Entscheidung des Nutzers).
- Tippfehler „TFB GOES DIGTAL“ ist Nutzerinhalt → im Home-Editor selbst korrigieren.

## Neu in v101 (Aufräumen Stufe 2)

- Mannschaftsporträt-Editor in nummerierten Schritten: 1 Fotos oben, 2 Überschrift,
  3 Text, 4 weitere Fotos (Kollage). Alles andere (Darstellung, kleine Zeile,
  Unterzeile, Großer Textanfang, Textgröße, Zitat, Kollage im Originalformat) liegt
  eingeklappt unter **„Mehr Gestaltung“**; bleibt beim Bearbeiten offen/zu.
- Handy/iPad: Knopf „Vorschau ansehen“ / „Weiter bearbeiten“; Hinweistext passt
  sich an (Desktop: „Links siehst du jede Änderung sofort“).
- Beim Wegschieben bleibt die Kopfzeile sichtbar („antippen zum Weiterbearbeiten“),
  Rückkehr an dieselbe Stelle – gilt auch für den Home-Themen-Editor (`togglePeek`).

## Neu in v116: Menü oben im Admin pflegbar

- Ziel des Nutzers: Seite so vorbereiten, dass Mitglieder/Jugendliche ohne EDV-Erfahrung
  sie selbst pflegen können.
- Home → Stift → Karte „Menü oben“ → „Menü bearbeiten“: je Punkt Name, Ziel (Seite der
  App aus Liste oder Website in neuem Fenster), Pfeile zum Sortieren, „zeigen“;
  „+ Menüpunkt“, eigene Punkte löschbar, „Auf Standard zurücksetzen“. Höchstens
  8 sichtbare Punkte. Umschalten App ↔ Website merkt sich das vorige Ziel.
- Ablage `site.nav` = [{id, label, target, hidden?, custom?}]; ohne Eintrag Standard
  (`TFB.defaultNav` in app.js: Kiosk, Chat, Aktuell, Sport, Club, Verabreden, Padel →
  padel-bielstein.de). Menü wird in app.js aus `TFB.navItems()` gebaut,
  `TFB.refreshNav()` nach Laden/Speichern. Aktiv-Markierung nach Zielseite.
- Seitenliste (`appTargets`) ergänzt um Sport · Training, Impressum, Satzung.

## Neu in v115: Aktuell bleibt ohne Unterseiten

- Entscheidung des Nutzers: Aktuell-Beiträge werden komplett auf der Seite gezeigt,
  kurz und knackig – **keine** Unterseiten, kein „Mehr erfahren“ (v114 zurückgenommen).
- Beitragstext mit schlanker Werkzeugleiste (Fett · Kursiv · Rot · Link · Schlicht).

## Neu in v113: Aktuell-Beiträge mit 1–4 Fotos

- Beiträge (`post`) zeigen 1 Foto breit (16:9) oder 2–4 als gleich große Quadrate
  nebeneinander (`postPhotos`), Datum-Plakette unten links; mehr als 4 alte Fotos →
  „+N“ auf dem vierten, Klick öffnet alle. Unregelmäßige Kollage bei Beiträgen entfällt.
- Editor: Feld „Fotos (1 bis 4)“ (`postPhotosField`, Upload max. 4); Kamera-Symbol
  passt im Seitenformat ein (`news` 16:9 bzw. `square`). Einzelfoto (`image`) wird beim
  Öffnen in die Fotoliste übernommen.

## Neu in v112: Titelfotos im Seitenformat einpassen

- „Foto einpassen“ (Kamera-Symbol) an den Titelfotos von Unterseite und Porträt
  öffnet im Format der Seite: 1 Foto = breit (21:9, `wide`), 2–4 = quadratisch.
  Keine Formatwahl, Hinweis „Ausschnitt genau wie auf der Seite“; breiter Dialog.
- Ohne eigene Titelfotos zeigt Schritt 1 das Ersatzfoto (Teamfoto bzw. Startseitenfoto)
  mit „Foto einpassen“ (vorher nicht erreichbar → abgeschnittene Köpfe).
- Gespeichert werden nur Mittelpunkt/Zoom; das bisherige Format des Fotos bleibt
  (`photo-frame.js`, Option `format`), damit Teamfoto/Home-Foto an anderen Stellen ihr
  Format behalten. Hinweis: Mittelpunkt/Zoom gelten pro Foto überall.
- Anzeige: `.story-photo` behält 16:10 / 2:1 / 21:9, `.story-square` 1:1; das
  eingepasste Foto füllt den Rahmen.

## Neu in v111: Chat-Überschriften, Porträt-Editor = Unterseiten-Editor

- Chat: Seite heißt groß „Clubgeflüster“ (`chatText.feedTitle`), kleine rote Zeile
  darüber entfällt; Feld „Seitentitel“ im Chat-Texteditor bearbeitet jetzt feedTitle.
- Beiträge haben eine freiwillige **Überschrift** (`post.title`, max. 90 Zeichen) im
  Schreibfenster über dem Text; erscheint rot über dem Text im Feed und ersetzt in
  „Alle Beiträge“ das rote „Clubgeflüster“ (ohne Überschrift bleibt der Bereich).
  Suche findet auch Überschriften.
- Mannschaftsporträt-Editor exakt wie Unterseite: 1 Fotos oben (1 breit, 2–4
  automatisch Quadrate), 2 Überschrift (Kleine Zeile darüber / Überschrift /
  Unterzeile darunter sichtbar), 3 Inhalt (Abschnitte), 4 Fotos unten. Darstellung:
  2–4 eigene Titelfotos immer als Quadrate (auch in der Anzeige).

## Neu in v109: Unterseite und Mannschaftsporträt aus Abschnitten

- Inhalt = Liste `sections` aus **Text** (Fließtext, nur Fett/Kursiv/Rot/Link),
  **Überschrift** (immer rot, groß – `.story-h`) und **Zitat** (immer roter Strich,
  große Schrift, optional „von“). Pfeile verschieben, × löscht (mit Rückfrage bei
  Inhalt), unten „+ Text / + Überschrift / + Zitat“. Keine Schriftgrößen mehr
  (Textgröße aus Unterseite und Porträt entfernt; `textSize` wird ignoriert).
- Ablage: Home-Thema `more.sections`, Porträt `portrait.sections`. Alter Stand
  (`text` mit `## …` + `quote` nach dem 2. Absatz) wird beim Öffnen automatisch
  umgewandelt (`legacySections`); zusätzlich werden `text`/`quote` abgeleitet
  gespeichert (`sectionsDerived`) für „hat Unterseite“-Erkennung.
- Editor-Felder sehen aus wie die Seite: Überschrift rot/fett, Zitat mit rotem Strich.
- Getestet mit Padel-Unterseite: Umwandlung 1:1, Verschieben/Hinzufügen live,
  Speichern + Neuladen.
- v110: Rotes ⊕ vor jedem Abschnitt öffnet „Text · Überschrift · Zitat“ und fügt genau
  dort ein (`data-sec-at`); Leiste unten „Abschnitt hinzufügen“ in Signalrot. Fotos
  oben/unten bleiben unverändert (Nutzer einverstanden).

## Neu in v108: Home-Editor so einfach wie möglich

- Festlegung des Nutzers: Auf Home sehen Kleine Zeile, Überschrift, Unterzeile (rot)
  und Fließtext immer gleich aus – keine Größenwahl. „Textgröße“ aus Home entfernt,
  Home-Fließtext ignoriert `textSize` (Unterseite nutzt es weiter).
- Kurzer Text auf Home mit schlanker Werkzeugleiste (`field(..., { simple: true })`):
  Fett · Kursiv · Rot · Link · Schlicht. Unterseite behält die volle Leiste.
- Werkzeugknöpfe leuchten auf, wenn der markierte Text schon fett/kursiv/rot … ist
  (`selectionchange`). Fett/Kursiv/Unterstrichen ohne Markierung → Hinweis statt
  stillem Nichts (vermutete Ursache für „Fett geht nicht“; mit echter Markierung
  funktionierte Fett in allen Tests).
- Link-Text erscheint jetzt auch beim dezenten Link (vorher immer die Adresse, z. B.
  „Hier buchen“ war gespeichert, aber unsichtbar); ohne Text die Adresse. Tooltip
  zeigt die Adresse. Umschalten Website ↔ App behält das runde Linkbild.

## Neu in v107: Home-Editor – Themen-Leiste, Überschriften, zwei Links

- Themen-Leiste oben im Editor „Thema 01 02 03 … +“: Wechsel speichert das aktuelle
  Thema und öffnet das gewählte (Reiter bleibt); „+“ legt ein neues an (max. 10).
  Leeres neues Thema wird beim Wegwechseln verworfen.
- Reiter „Startseite“: 1 Foto · 2 Überschrift (Kleine Zeile darüber, Überschrift,
  Unterzeile darunter – wieder sichtbar, lagen seit v102 unter „Mehr“) · 3 Kurzer
  Text · 4 Links: Link 1 und **Link 2** (`block.link2`, z. B. Seite der App/Unterseite).
  „Mehr erfahren“ erscheint automatisch bei Unterseiten-Inhalt.
- Umschalten Website ↔ Seite der App löscht den Link nicht mehr; der vorige Wert wird
  gemerkt (`link.memo`) und beim Zurückschalten wiederhergestellt.
- Link 2 übernimmt Darstellung/Platz von Link 1, ist per Ziehen verschiebbar (Schlüssel
  `second` in `featureLinks`/`moveLink`).

## Neu in v106: Unterseite im Editor wie auf der Seite

- Reiter „Unterseite“ in Seitenreihenfolge: 1 Fotos oben (1–4; ohne eigene Fotos
  das Startseitenfoto; 1 Foto breit, 2–4 automatisch Quadrate), 2 Text, 3 Zitat,
  4 Fotos unten (Kollage). „Mehr Gestaltung“: Darstellung bei 1 Foto
  (Breit/Original + Ausrichtung), Großer Textanfang, Grundschrift, Kollage-Original.
  (Fehler aus v102 behoben: Titelfotos/Zitat lagen versteckt unter „Mehr“.)
- Werkzeugleiste in Gruppen: Schrift (F K U) · Farbe (Rot, Grau, Marker, „Farbe
  entfernen“) · Größe (sehr klein, klein, normal, groß, sehr groß) · Absatz
  (Überschrift, Link, Schlicht). Neue Zeichen `{klein}`, `{sehrklein}`; Farben und
  Größen ersetzen sich gegenseitig statt zu verschachteln (`SPAN_GROUPS`).
- Editor-Text sieht aus wie die Seite: Zwischenüberschriften groß/fett statt grauer
  Großbuchstaben (globale `h3`-Regel überschrieben), Schriftgröße/Zeilenabstand wie
  `.story-text`.
- Mannschaftsporträt gleich geordnet: 1 Fotos oben, 2 Überschrift, 3 Text, 4 Zitat,
  5 Fotos unten.

## Neu in v105: Home bearbeiten im gewählten Look, bis zu 10 Themen

- WYSIWYG: Der Bearbeiten-Modus von Home zeigt den gewählten Look (Wechselspiel,
  Klassisch oder Magazin). Look oben umschalten → Seite darunter wechselt sofort.
  Dafür tragen Themen die Klassen `feature-first`/`feature-even` (statt
  `:nth-child`, das durch die Bearbeiten-Rahmen nicht mehr stimmte).
- Unten im Bearbeiten-Modus: **„+ Neues Thema (n von 10)“** legt direkt ein Thema an
  (kein Bausteinkatalog). Ab 10 Themen Hinweis statt Knopf; `saveSite` lehnt mehr
  als 10 ab. Abbrechen verwirft das leere Thema.
- Prüfhinweis: Bei Tests im Browser JS-Dateien ohne Zwischenspeicher laden
  (`fetch(..., {cache:'reload'})`), sonst läuft alter Code.

## Neu in v104: Home-Look festgelegt

- **Standard: Look 6 „Wechselspiel“** (Foto/Text je halb, Seiten wechseln, große
  Ziffer) – Nutzer: ruhig, gut lesbar; Fotos komplett per Klick ansehbar.
- Im Admin (Home → Stift → oben „Look der Startseite“) umschaltbar: Wechselspiel ·
  Klassisch (bisheriger Look 1) · Magazin (Look 3). Gespeichert in `site.homeLook`
  (gilt für alle Besucher, in „Sichern & Laden“ enthalten).
- Looks 2/4/5 und der vorübergehende Schalter unten auf Home sind entfernt.

## Neu in v103: sechs Home-Looks zur Auswahl (historisch, ersetzt durch v104)

- Auf Home unten ein schwarzer Schalter „Look · 1–6“ (nicht im Bearbeiten-Modus).
  Gleiche Inhalte, andere Gestaltung; Wahl im Browser (`localStorage tfb_home_look`).
  1 Heute · 2 Zeitung (Haarlinien, Serifen, Aufmacher + 2 Spalten) · 3 Magazin
  (zentrierte Serifen-Überschriften, gerahmte Fotos, rote Trenner) · 4 Bühne
  (Überschrift auf dem Foto; Hoch/Quadrat mit Text daneben) · 5 Kacheln (Karten,
  Aufmacher quer, Text gekürzt) · 6 Wechselspiel (Foto/Text je halb, Seiten wechseln,
  große Ziffer).
- Looks 2–6 geben das Bildformat vor; ein mit „Foto einpassen“ gesetzter Ausschnitt
  (Mittelpunkt + Zoom) bleibt dabei erhalten. Serifenschrift nur in Look 2/3
  (`--look-serif`, Systemschriften, offline).
- Code: `homeLook()`, `lookSwitch()`, Aktion `home-look` in `site.js`; CSS-Block
  „Home-Looks“ am Ende von `app.css`. Nach der Entscheidung: gewählten Look fest
  machen, Schalter und übrige Looks entfernen.

## Neu in v102 (Aufräumen Stufe 3)

- Home-Themen-Editor nach gleichem Muster: Reiter **Startseite** = 1 Foto,
  2 Überschrift, 3 Kurzer Text, 4 Link (Ziel + Link-Text); Reiter **Unterseite** =
  1 Ausführlicher Text, 2 Fotos. Alles Weitere (Anordnung, kleine Zeile, Unterzeile,
  Textgröße, Klickziel, Link-Platz/-Darstellung/-Symbol/-Vorschau, Titelbild der
  Unterseite, Großer Textanfang, Zitat, Originalformat) unter „Mehr Gestaltung“.
  Wird eine Fotokollage statt Einzelfoto genutzt, steht sie in Schritt 1.
- Reiter „Startseite · Unterseite · Fotokollage“ in einer Zeile (auch Handy).
- Einheitliche Knöpfe: Sport-Umschalter Mannschaften/Training im selben
  Segment-Look wie Aktuell; Filter (Saison) bleiben Pillen; „Zum Anmeldeformular“
  rot mit weißer Schrift; „Foto ersetzen/entfernen“ als gleich große kleine Knöpfe.
- Verabreden-Untertitel: „Training, Einzel, Doppel – wer ist dabei?“
- Alle drei Aufräum-Stufen erledigt. Nächster Schritt: Nutzer prüft, dann Arbeit
  an der Live-Seite.

## Neu in v99

- `photo-viewer.js`: Einzelfotos auf den Inhaltsseiten, Mannschaftslisten und
  Porträtseiten sowie sichtbare Teilnehmer-/Chat-Profilfotos öffnen per Klick oder
  Enter/Leertaste die gemeinsame Vollbildansicht. Bildklicks in Mannschafts-/Home-
  Links öffnen das Foto; Text und übrige Linkfläche behalten die Navigation.
- Vorhandene Galerie-/Collage-Viewer, Vorstands-Originalbilder, Link-Vorschaubilder,
  Logo/Partnerlinks und Upload-/Ausschnitt-Editoren bleiben in ihrer bisherigen
  Funktion. Es werden nur bereits sichtbare Fotoquellen verwendet, keine weiteren
  Mitgliederdaten geladen und keine Foto-Freigaben verändert.
- Vollbild zeigt die unbeschnittene Quelle bis 1600px/84vh. X, Hintergrundklick und
  Escape schließen; Bildklick schließt nicht. Scrollzustand und Fokus werden
  wiederhergestellt; Escape schließt nicht gleichzeitig das darunterliegende Formular.
- 32 Tests bestanden, Mannschaftsbild-Klick und Trainerfoto auf Desktop und
  Smartphone-Größe in isolierter Browservorschau geprüft.

## Neu in v98

- Unveränderte Beispiel-News `p-1` bis `p-3` und ungepflegte Home-Themen werden beim
  Laden entfernt. Geänderte Texte, eigene Fotos und Alben bleiben erhalten. Keine
  pauschale Löschung anhand des Autors; Bereinigung auch nach älteren Backups.
- Home-Themen und News-Bausteine können statt eines Einzelbildes bis zu 100 Bilder
  in `block.images` enthalten. Admin-Fotoliste mit Entfernen, Sortieren, Foto einpassen
  und vorhandener Drag-and-Drop-Upload-Funktion. Bestehendes Einzelbild wird beim
  ersten Collage-Upload übernommen; Texte und Links bleiben.
- Vorschau: fünf Fotos im Magazin-Raster plus Restanzahl. Klick: komplette,
  scrollbar große Collage, dann Original-Einzelbilder mit Pfeilen, Klick und Wischen.
- Training: Kalender-Knopf ersetzt durch Textbaustein `s-schnupper-dates`, Titel
  „Termine für Schnuppertraining demnächst“. Über den Seiten-Stift Termintext mit
  Datum/Uhrzeit/Treffpunkt pflegen; keine erfundenen Termine, kein Kalender.
- 30 automatisierte Tests bestanden; neue Collage und Editor in isolierter lokaler
  Browservorschau geprüft, Smartphone-Breite ohne horizontalen Überlauf.

## Ziel und Betriebszustand

Vereinswebsite der **Tennisfreunde Bielstein**, inklusive Kiosk. Nutzer hat echte
Inhalte und eigene Flüsternachrichten gepflegt und ist sehr zufrieden.
Nächstes Ziel: Vorstellung beim Vorstand. **Noch nicht veröffentlicht.**
Mitglieder, Chats, Kiosk und Verabredungen nutzen lokale Browserdaten,
keine gemeinsame produktive Vereinsdatenbank.

## Öffnen und Sichern

- Doppelklick auf `TFB-Website öffnen.html` im Ordner `9. TFB-Website`; Startseite Home. Nach Änderungen Chrome neu laden.
- Daten gehören zum jeweiligen Browser/Ursprung. Direkter HTML-Start und lokale
  Vorschau-Server haben getrennte Datenbestände; Testdaten sind nicht Nutzerinhalte.
- Regelmäßig **Verwaltung → Sichern & Laden**: JSON mit Daten und Fotos sichern.
  Browserdaten niemals als vermeintliche Lösung für Layout-/Cacheprobleme löschen.
- Demo-Admin: `max@tfb-demo.de`; Passwort beim ersten Anmelden frei wählen.
- Aktuelle direkte HTML-Browserprüfung durch Browserrichtlinie nicht möglich.
  Frühere Offline-Prüfungen sind historische Nachweise, keine neue Abnahme.

## Aktueller Funktionsstand

- **Menü:** Logo → Home; Kiosk · Chat · Aktuell · Sport · Club · Verabreden · Padel.
  Dezente globale Fußzeile mit Impressum (`#impressum`), Satzung (`#satzung`) und
  dynamischem Copyright-Jahr. Unterseiten ohne Werbung, einspaltig und im Admin
  bearbeitbar (Stift oder Verwaltung). Rechte Dritter bleiben ausdrücklich erhalten.
  Satzung vom Nutzer wortgetreu übernommen: 17 Paragraphen, Stand 20.03.2015.
  Impressum: Amtsgericht Köln, VR 600693, USt-ID DE330174727 aus dem öffentlichen
  Padel-Impressum; Kai Eichmann als Vorsitzender vom Nutzer ausdrücklich bestätigt.
  Sebastian Manz und Daniel Pollmann, gemeinschaftliche Vertretung; Sebastian Manz
  als inhaltlich Verantwortlicher übernommen. Keine Änderung am Padel-Projekt.
- **Home:** Themen mit Detailseite, direktem Link oder ohne Ziel. „Mehr erfahren“
  unabhängig ausblendbar. Kiosk-Titel/Link führen direkt zum Kiosk; echte Einzelfotos
  öffnen seit v99 ihre Vollbildansicht. Verlinkte Titel
  werden bei Hover Signature-Rot. Links, Symbole und Reihenfolge editierbar.
  Separate Foto-Unterseite mit bis zu 100 Bildern, Collage und Großansicht.
  Zusätzlich Collage statt Titelbild direkt im Home-/News-Feld: bis zu 100 Fotos,
  sortierbar, fünfteilige Vorschau mit Restanzahl, Klick öffnet die gesamte Collage.
  Home-Beispielhinweis und unveränderte Beispiel-News entfernt; gepflegte Inhalte bewahren.
- **Aktuell:** News links 2/3, Save the Date rechts 1/3. Mobil umschaltbar.
- **Chat:** `#chat` zeigt neueste Beiträge zuerst, groß und linksbündig (max. 760px).
  „Alle Beiträge“ → `#chat/alle` mit Suche/Filtern. Alte `#gefluester`-Links gültig.
  Admin-Stift auf Haupt-/Unterseite: 24 Texte editierbar (`site.chatText`).
  Mannschafts-Insider-News und bisherige Rechte bleiben erhalten.
- **Chat-Fotos:** bis zu sechs pro Beitrag; responsive Collage. Erster Klick öffnet
  gesamte Collage groß, danach Einzelbilder mit Pfeilen, Klick und horizontalem Wischen.
  Keine persönlichen Direktnachrichten implementiert.
- **Beispiel-Chats:** exakt `p-s1` bis `p-s4` und `p-t1` bis `p-t3` werden beim
  Laden entfernt und nicht mehr erzeugt, auch nach Import eines alten Backups.
  Eigene Beiträge, Bildreferenzen und Bildspeicher bleiben erhalten.
- **Club:** fünf editierbare/sortierbare Zahlen; unerwünschter „Vier Knöpfe“-Block
  entfernt. Schwarzer Beitragsbutton vor rotem Aufnahmebutton mit schwarzem Text.
  Beitragstabelle als Fenster mit X. Editierbarer Hinweis daneben:
  „TFB-Mitglieder erhalten 10 Prozent Rabatt auf alle Padel-Buchungen.“
  Dieser Text allein implementiert keine Rabattberechnung im getrennten Padel-System.
- **Vorstand:** sieben veröffentlichte Personen mit Kontakten und lokalen Fotos.
  Runde Bilder mit Originalansicht; Basti/Marco aufgehellt, Originale erhalten.
  Rollen, Namen, Kontakte, Reihenfolge und Fotoausschnitt im Admin editierbar.
  Mitgliedssuche nach Name/E-Mail mit Auswahl bei Familienadressen. Verknüpfte
  Profilbilder erscheinen nur mit öffentlicher Freigabe.
- **Sport:** Porträt-/Newsbutton ab 640px zwischen linkem Informationsbereich und
  rechter Platzierung zentriert; mobile kompakte Darstellung bleibt erhalten.
  Zwei Reiter: Mannschaften (`#sport`) und Training (`#sport/training`). Training
  mit Leon Kaufmann, Originalfoto, Funktion, Text und anklickbaren Kontakten,
  Schnuppertraining sowie „Termine für Schnuppertraining demnächst“ mit frei
  bearbeitbarem Termintext (Datum, Uhrzeit, Treffpunkt); kein Kalender-Link mehr.
  Trainerfoto, Funktion, Kontakte und Texte im vorhandenen Admin-Editor bearbeitbar.
  Eigene abweichende Trainingstexte werden bei der Migration nicht überschrieben.
- **Foto-Drop:** Dateibatches auf bestehende Bildfelder ziehen; gleicher Weg wie
  Datei-Upload, interne Sortierung bleibt erhalten. Tatsächliche Übergabe macOS
  Fotos → Chrome noch nicht geprüft. Unaufgelöste Dateiversprechen erhalten eine
  Meldung mit JPEG-Export als Ausweichweg.
- **Foto einpassen:** gemeinsamer Admin-Editor in Bildfeldern, Galerie-/Hero-/Album-
  Vorschaubildern, Chat-Komposition und Bildanhängen. Hochformat (3:4), Querformat
  (3:2), Quadrat; Zoom 1–4, Verschieben per Maus/Finger, horizontale/vertikale Regler.
  Einstellungen als `site.photoFrames[ref]`, gelten für alle Verwendungen derselben
  Bildreferenz. Originaldatei unverändert, Einzelbild-Großansicht bleibt unbeschnitten.
  „Originalansicht“ entfernt nur die Rahmeneinstellung. Kollagen und kleine/runde
  Vorschaurahmen behalten ihr Raster; darin werden Zoom/Position angewendet.
  Eigene Profil-/Vorstandsfotos behalten ihren bisherigen runden Ausschnitt-Editor.
  Übernehmen speichert den Ausschnitt sofort, ohne offene Textentwürfe zu schließen.
- **Foto-Vollbild:** gemeinsame Ansicht für Einzelfotos, auch Mannschaftslisten,
  Porträt-/Trainerfotos und sichtbare Chat-/Teilnehmerbilder. Originalquelle ohne
  Rahmenzuschnitt; X, Hintergrundklick oder Escape schließen. Collagen, Fotoeditoren
  und funktionale Link-Vorschaubilder behalten ihre bisherigen Aktionen.
- **Kiosk/Verabreden:** bestehende lokale Funktionen erhalten. Kiosk-Abrechnung
  vorgesehen als monatliche Vereins-SEPA, nicht Stripe. Push/automatische Antworten
  bei Verabredungen bleiben Vorführung, kein echter Mitgliederbetrieb.

## Aufnahme und Foto-Freigaben

Details: [digitale-aufnahme.md](digitale-aufnahme.md).

- Öffentlicher Aufnahmeantrag ohne Fotoeinwilligung. Lokaler HTML-Start simuliert nur:
  keine Antragsdaten gespeichert oder versendet, keine Mitgliedschaft angelegt.
- Separater Python-/SQLite-Dienst vorbereitet: Bestätigung durch Antragsteller/
  Sorgeberechtigte und ggf. abweichende Kontoinhaber, geschützter Club-Posteingang,
  SMTP-Warteschlange. Versand deaktiviert; keine echten E-Mails versendet.
- Vor Livebetrieb: Satzung, Beitrags-/Datenschutztexte und digitales SEPA-Verfahren
  durch Club/Bank freigeben; HTTPS, Hosting, SMTP und geschützte Datenablage einrichten.
  Software ersetzt keine Rechts-/Bankfreigabe. Keine automatische Übernahme
  bestätigter Anträge in die Mitgliederliste implementiert.
- Freiwillige Foto-Freigaben nach Aufnahme. Minderjährige: Foto für andere erst
  nach dokumentierter Elternzustimmung sichtbar; neues Foto benötigt neue Freigabe.
  Echte Elternverifikation für Produktion noch umzusetzen.

## Wichtige Dateien

| Datei | Aufgabe |
|---|---|
| `assets/js/demo-backend.js` | lokale Daten/Rechte, Sicherung, gezielte Beispiel-Chat-/News-Bereinigung |
| `assets/js/app.js` | Menü, Kiosk, Account, Verwaltung, eigener Fotoausschnitt |
| `assets/js/site.js` | Website, Chat, Collagen, Seiten-/Texteditoren |
| `assets/js/board.js`, `member-photos.js` | Vorstand und Foto-Freigaben |
| `assets/js/membership.js`, `server/` | Aufnahmevorschau und vorbereiteter Server |
| `assets/js/photo-drop.js` | gemeinsame Drag-and-drop-Anbindung |
| `assets/js/photo-frame.js` | nichtdestruktiver Rahmen-/Zoom-/Positionseditor |
| `assets/js/photo-viewer.js` | gemeinsame Vollbild-Einstiege für Einzelfotos |
| `assets/js/meet.js` | lokale Verabredungen |
| `assets/data/site-seed.js` | Startinhalte und gezielte Migrationen |
| `assets/data/legal-pages.js` | Satzungswortlaut und Impressum-Startdaten |
| `assets/data/board-photo-data.js` | lokale Vorstandsquellen für HTML-Fotoausschnitt |
| `assets/css/app.css`, `sw.js` | Gestaltung und Cache-Version |

## Prüfstand und Weiterarbeit

**32 Node-Tests im letzten Implementierungslauf bestanden**: Vorstand/Fotorechte,
Home/Chat/Galerien, News-Collagen bis 100 Bilder, gezielte Beispiel-Bereinigung,
Sport, Rechtstexte, Foto-Drop/-Rahmen und Vollbild-Klick/Keyboard/Schließen.
Bei diesem reinen Dokumentationsupdate nicht erneut ausgeführt.
Foto-Editor: Format, Zoom, Drag, Übernehmen und Fortbestand nach Neuladen im Browser
geprüft. Quadrat im Seitenlayout exakt 360×360px; Smartphone-Dialog ohne Überlauf.
Satzungswortlaut per SHA-256 nach reiner Leerraum-/Paragraphenformatierung abgeglichen.
Fußzeilenlinks, Unterseiten und Smartphone-Layout ohne Überlauf im Browser geprüft.
Neue Trainingsansicht auf Desktop/390px geprüft: Foto geladen, kein horizontaler
Überlauf; Trainer-Editor mit Foto-, Funktions- und Kontaktfeldern geprüft.
Aus dem Projekt-Elternordner:

```sh
node --test tfb-kiosk/tools/test-board-photos.mjs tfb-kiosk/tools/test-home-features.mjs tfb-kiosk/tools/test-photo-drop.mjs tfb-kiosk/tools/test-photo-viewer.mjs
```

Aufnahme-Tests separat aus `tfb-kiosk/server`:
`python3 -B -m unittest -v test_membership.py`.
Bei diesem Dokumentationsupdate nicht erneut ausgeführt.
Frühere Desktop-/Mobilprüfungen in isolierter Vorschau; echte Fotos-App-Übergabe
und aktuelle direkte HTML-Prüfung bleiben offen.

1. Vor Vorstandsvorführung Nutzer-Sicherung erstellen und in seinem Chrome
   nach Neuladen kontrollieren, dass nur gewünschte echte Chats und News erscheinen.
2. Fotos-App-Drop am Mac praktisch ausprobieren; iPhone/iPad nach HTTPS-Veröffentlichung prüfen.
3. Veröffentlichung und eigene TFB-Datenbank separat planen. Aufnahme-Freigaben,
   Mitgliederimport, SEPA-Abschluss und echte Benachrichtigungen noch offen.
   Satzung von 2015 nennt in § 1 Gummersbach und in § 3 schriftliche Aufnahme;
   historische Angaben nicht eigenmächtig korrigiert. Aktuelle Satzungsfassung,
   Vertretungsregel, Impressum und Datenschutz vor Veröffentlichung durch Club prüfen.

## Verbindliche Arbeitsregeln

- Nur `tfb-kiosk/` bearbeiten. Padel-Kopie und deren Dokumentation sind ein anderes
  Projekt; keine Padel-Datenbank oder Veröffentlichung verändern.
- Aktuelle Software und Nutzerinhalte sind maßgeblich. Historische Gedächtnistexte
  nicht als Anlass für Rücksetzungen nehmen. Migrationen eng auf bekannte IDs begrenzen.
- Keine privaten Mitgliederlisten, Geheimnisse, Browserexporte oder echten
  Aufnahmedaten ins Repository. Übernahme veröffentlichter Vorstandsdaten ausdrücklich
  beauftragt; erforderliche Rechtsgrundlage/Information muss der Club sicherstellen.
- Lokaler HTML-Start ohne Build erhalten. JS/CSS-Änderungen mit neuer Cache-Version.
  Signature-Rot `#C4553A`; Gestaltung in kleinen Schritten.
- Deutsch, kurz und ehrlich. Nicht still veröffentlichen, versenden oder committen.
  Bestehende lokale Änderungen nicht zurücksetzen oder ungefragt insgesamt committen.
