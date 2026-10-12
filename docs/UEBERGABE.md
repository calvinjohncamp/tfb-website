# TFB – Übergabe für die nächste Sitzung

**Zuerst lesen.** Ausführlicher Verlauf: [PROJEKTGEDAECHTNIS.md](PROJEKTGEDAECHTNIS.md).
Diese Zusammenfassung hat Vorrang vor älteren Zwischenständen.

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
