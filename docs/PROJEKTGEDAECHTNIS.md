# TFB-Kiosk – Projektgedächtnis und Übergabe

Für den schnellen Einstieg zuerst die kurze **[UEBERGABE.md](UEBERGABE.md)** lesen.
Diese Datei enthält alle Entscheidungen, Konzepte, offenen Punkte und den Verlauf.
Neues bitte unten bei „Verlauf“ ergänzen.

## Stand am Ende des 10.10.2026 (gilt vor älteren Abschnitten weiter unten)

Ältere Abschnitte beschreiben Zwischenstände (z. B. „Kiosk ist Startseite“, „Reiter Verein“,
Garamond-artige Überschriften) – **überholt** durch:

- **Startseite = Home** (`#home`) für alle Besucher; Logo führt dorthin; neue Aufrufe landen
  immer auf Home (Ausnahme: Neu laden, Deep-Links mit `/`). Manifest `start_url ./#home`.
- Menü: **KIOSK** (immer Signal-Rot) · AKTUELL · SPORT · **CLUB** (Adresse `#club`, intern
  Seite `verein`) · **VERABREDEN** (intern `treffen`) · PADEL. Aktiver Bereich: dunkle Schrift + roter Strich.
- **Logo:** Ball in Signal-Rot (Masken `tfb-logo-noball` + `tfb-logo-ball`, Position in
  `.tfb-logo-split`: left 84.53 %, top 47.95 %, Breite 15.53 %, Höhe 34.78 %).
- **Home-Themen** (Baustein `feature`): `layout` wide/portrait/square, `kicker`, `title`,
  `subtitle`, `text`, `link {url, label, style chip|button|card, title, text, image}`,
  `more {text, quote, quoteBy, images}` → Unterseite `#home/<id>`.
- **Fließtext-Auszeichnung** überall in Text-Bausteinen: `[Text](https://… | #seite)`, `**fett**`, `## Zwischenüberschrift`.
- **Team-Seiten** `#team/<schlüssel>`, Inhalte in `site.teams[schlüssel] = {photo, posts[≤10]}`.
- **Account-Karte** nach Padel-Vorbild; `api.updateProfile` (Handynummer, Info-Mails, Einladungen).
- **Sichern & Laden:** `api.exportAll()` / `api.importAll()`; Datei enthält `db`, `images`
  und `extra` (`tfb_kiosk_look_v3` = Farbe/Schrift, `tfb_meet_demo_v2` = Verabredungen).
- Offline unter `file://` in Chrome geprüft (Texte + Fotos überstehen Neustart).

## Gestaltungssystem: Schriften und Farben (Stand 10.10.2026)

**Schriften – drei Rollen**

| Rolle | Schrift | Einsatz |
|---|---|---|
| Grundschrift `--font` (fest) | Systemschrift: SF Pro (Apple), Segoe UI (Windows), Roboto (Android) | Fließtext, Menü, Knöpfe, Formulare, Kacheln, Versal-Beschriftungen |
| Auszeichnung `--serif` (in der Verwaltung wählbar, Standard „Modern (System)“) | Test: System, Avenir Next, Futura, DIN, Klassisch (offline) · Inter Tight, Manrope, Outfit, Plus Jakarta Sans, DM Sans, Sora, Space Grotesk, Bricolage Grotesque, Syne, Unbounded, Barlow Condensed (Google Fonts, nur Test) | Seitentitel, Themen-Überschriften, Zwischenüberschriften, Datumszahlen, Bierdeckel-Betrag, Zitate, Initiale, Nummern |
| Handschrift `--hand` (fest) | Bradley Hand (Windows: Segoe Print) | Bierdeckel-Datum/-Monat, Strichlisten-Namen |

Der Schriftzug „TENNISFREUNDE BIELSTEIN“ ist Teil des Logos (Bild), keine Schrift.
Entscheidung offen: 1–2 Favoriten wählen, Google-Schrift dann selbst ausliefern (Datenschutz/offline).

**Farben**

| Farbe | Wert | Einsatz |
|---|---|---|
| Kreideweiß | `#FBFBF8` | Hintergrund (fest) |
| Anthrazit (Markenfarbe `--brand`) | `#2A2D2E` | Logo, Bierdeckel, dunkle Knöpfe, Datumsfelder; wählbar (Schwarz, Sandplatz-Rot, 4 freie Felder) |
| Sandplatz-Rot (Signal `--signal`) | `#C4553A` | Logo-Ball, KIOSK, Aktiv-Strich, Strich unter Zwischenüberschriften, Unterzeilen, „Mehr erfahren“, Initiale, Zitat, Zusagen, Platz 1 (fest) |
| Weiß | `#FFFFFF` | Karten |
| Schrift dunkel / grau | `#1C2520` / `#6A7069` | Text / Nebentext |
| Linien, Flächen | `#E5DDCD`, `#E6E1D6`, `#EFEDE7`, `#F6F3EC` | Rahmen, Platzhalter, gesperrte Felder |
| Menügrau | `#8A8F8A` | inaktive Menüpunkte |
| Verabreden | Schwarz `#111111` (Absage), Grau `#8C918E` (offen), Rot hell 8 %/45 % | Status |
| WhatsApp-Grün | `#25D366` | nur Teilen-Knopf |

Aufräumen geplant: Altlasten `--green*`, `--cardboard*`, `--cream` u. a. entfernen, auf ~10 feste Werte reduzieren.

## Konzept „Treffen 2.0“: Verabreden in der installierten App

**Vorführung gebaut am 10.10.2026** (`assets/js/meet.js`, Speicher `tfb_meet_demo_v2`):
Arten **Training** (Gruppe, wöchentlich), **Einzel** (2 Plätze), **Doppel** (4 Plätze),
**Anderes** (Plätze frei wählbar). Einzel/Doppel: beliebig viele fragen, **wer zuerst
zusagt, spielt**, spätere Zusagen kommen auf die **Ersatzbank** und rücken bei einer
Absage automatisch nach. Einladung = Tabelle aller Teilnehmer (✓ dabei · Ersatz n ·
○ offen · ✗ abgesagt), Status oben („Doppel steht“ / „Noch 1 Platz frei“) mit
Platz-Punkten, eigene Notiz je Zusage, Organisator kann per Tipp auf einen Namen für
andere eintragen, Erinnerung nur an Offene, Hinweis bei Überschneidung mit einer
anderen Zusage zur selben Zeit, Gruppen anlegen/bearbeiten (Name, Trainingstag,
Uhrzeit, Ort, Mitglieder), WhatsApp nur noch als Rückfallweg „Für alle ohne App“.
Mitteilungen erscheinen als iPhone-artiges Banner oben (Vorschau auf echte Push).
In der Demo antworten die anderen nach ein paar Sekunden von selbst.


Stand 10.10.2026. Der Nutzer hält an der Idee fest. Ehrliche Bewertung:
Der WhatsApp-Link allein ist eine Krücke, weil Umfrage und Veranstaltung in
WhatsApp für eine einzelne Gruppe besser sind. Sinnvoll wird es erst, wenn
**alle der Gruppe die App installiert haben**.

- **Installation ohne App Store:** Die App ist eine PWA. Auf dem iPhone
  „Teilen → Zum Home-Bildschirm“. Seit iOS 16.4 gibt es dort **Push-Mitteilungen**,
  und genau die sind der Schlüssel. Eine echte App-Store-App (99 $/Jahr,
  Prüfung durch Apple) ist nicht nötig.
- **Kern:** Gruppen (z. B. Herren 40) mit festen Mitgliedern. Jedes Treffen
  zeigt eine **Tabelle aller Teilnehmer** mit ✓ zugesagt / ✗ abgesagt / ○ offen,
  oben der Status („4 von 4 – Doppel steht“). Antworten mit einem Tipp, auch
  direkt aus der Mitteilung heraus.
- **Was es besser macht als WhatsApp:** feste Trainings wiederholen sich
  automatisch, Erinnerung geht nur an die Offenen, Teilnehmergrenze mit
  Warteliste und Nachrücker-Mitteilung, kurze Notiz je Zusage („komme 15 min
  später“), Ersatz aus anderen Gruppen anfragen, später Platzbelegung und
  Mannschaftsaufstellung (nuLiga), nach dem Training ein Kranz über den Kiosk.
- **Ehrliche Grenze:** Den WhatsApp-Chat für Quatsch, Fotos und Sprüche
  ersetzt es nicht. Realistisch ersetzt es die **Organisation** („wer kommt?“).
  Machen zwei von zehn nicht mit, muss der Organisator doppelt pflegen, und das
  Ganze stirbt. Gegenmittel: Der Organisator kann für andere eintragen
  („hat im Chat zugesagt“), und der WhatsApp-Link bleibt als Rückfallweg.
- **Verbreitung:** Der **Kiosk ist das Zugpferd**. Wer anschreiben will, braucht
  die App ohnehin, und Treffen gibt es dann gratis dazu.
- **Voraussetzungen:** Supabase (gemeinsame Daten, Echtzeit), Veröffentlichung
  unter HTTPS, Web-Push (VAPID-Schlüssel + Edge Function). Im Demo-Modus lässt
  sich nur die Oberfläche zeigen, kein echter Push.

## Neu ab 10.10.2026: Vereinswebsite im selben Projekt (Vorführversion für den Vorstand)

- **Kopfzeile (10.10.):** nur komplettes Vereinslogo (81 px hoch) und rechts das
  Profilbild (58 px), unten bündig mit „TENNISFREUNDE BIELSTEIN“ – kein Bereichswort,
  kein Demo-Hinweis. Darunter ein ruhiges **Schrift-Menü ohne Symbole**
  (Großbuchstaben, gesperrt), aktiver Bereich in Signal-Rot. KIOSK beginnt bündig
  mit dem Schriftzug im Logo, das „L“ von PADEL endet bündig mit dem Profilbild,
  gleiche Abstände dazwischen. Abstand Logo → Menü = Menü → Inhalt (30 px).
- **Kiosk-Kopf (10.10.):** kein Umschalter mehr. Bierdeckel links (Breite
  ≈ 0,615 × Inhaltsbreite − 5 px, Inhalt wächst mit), rechts quadratische Knöpfe
  (84 × 84 px, rechtsbündig) **Strichliste** und **Abrechnungen**
  (Symbol über Beschriftung). Diese Seiten schließen mit dem Kreuz.
- **Raster für alle Geräte (10.10.):** Handy < 640 px wie bisher. iPad hochkant
  640–1023 px: bis 880 px breit, Sortiment 3 Spalten, Beiträge 2 Spalten, Vorstand
  3 Spalten, Mannschaftsführer sichtbar. Ab 1024 px (iPad quer/Desktop): bis 1200 px,
  Kopf in einer Zeile (Logo · Menü · Profilbild; Menü mittig zwischen Logo-Ende
  und Profilbild, Grundlinie = Unterkante Schriftzug = Unterkante Profilbild), Kiosk mit feststehendem Deckel
  links und Sortiment rechts (4 Spalten), Vereinsseiten mit Terminspalte rechts,
  Texte zweispaltig, Vorstand 4 Spalten. Bearbeiten ab 640 px als Fenster in der Mitte.
- Partner-Duo auf allen Geräten **linksbündig** (Text und Logos).
- Menüschrift Desktop/iPad quer **20 % größer** (.96rem); 1024–1279 px etwas enger gesetzt.
- **Treffen (Vorführung, 10.10.):** Menüpunkt zwischen Verein und Padel. Einladungen
  mit Vorlagen (z. B. „Training Herren 40, Di 19:00“ = ein Tipp), Mitgliedersuche über
  Echtname und E-Mail-Teil (nur Namen sichtbar), „Per WhatsApp senden“ (fertiger Text
  + Link; mit freiwilliger Handynummer direkt an Einzelpersonen), Zusage/Absage mit
  einem Tipp, Übersicht Dabei/Abgesagt/Offen, Erinnerung an Offene. In der Demo
  antworten Eingeladene automatisch. **Schnell entfernbar:** `features.treffen: false`
  in config.js, oder `assets/js/meet.js` + Abschnitt „Treffen“ in app.css löschen.
  WhatsApp kann Gruppen nicht automatisch übernehmen; Links funktionieren erst nach
  Veröffentlichung (`publicUrl`).
- **Startseite ist immer der Kiosk** (auch für Gäste); beide Startdateien
  („TFB-Kiosk öffnen.html“, „TFB-Website öffnen.html“) öffnen den Kiosk. Menüpunkt heißt wieder **Aktuell**. Bleibt beim Scrollen sichtbar. Partner stehen
  auf jeder Seite **ganz unten**.
- Reiter: **Kiosk · Aktuell · Sport · Verein · Padel**. Kiosk zuerst; nur der
  Kiosk-Bereich braucht Anmeldung (Umschalter Kiosk · Strichliste · Abrechnungen).
  Gäste landen auf „Aktuell“, Mitglieder im Kiosk. Wort neben dem Logo = Bereich.
- Verwaltung jetzt über das Profilbild (unten ist kein Platz mehr); dort auch
  „Website bearbeiten“. Admins sehen auf jeder Seite einen Stift.
- Seiten aus **Bausteinen** (`assets/js/site.js`, Startinhalte `assets/data/site-seed.js`):
  Beitrag (Foto, Datum, Text), Termin, Text, Zwischenüberschrift, Foto, Galerie,
  Ansprechpartner, Zahlen, Knopf, Mannschaften. Direkt auf der Seite bearbeiten,
  Pfeile zum Sortieren. Fotos werden beim Hochladen auf max. 1600 px verkleinert
  und im Browser-Bildspeicher (IndexedDB) abgelegt.
- **Partner:** zwei Logos je Seite, Gestaltung und Rotation 1:1 aus der Padel-App
  (`assets/js/partner-rotation.js`, Daten `assets/data/partners.js`, Logos
  `assets/partners/`, 38 Partner, Gewichte Premium 3 · Partner 3 · Regional 1).
- **Mannschaften** aus nuLiga (TVM, Verein 35703): `python3 tools/update-teams.py`
  schreibt `assets/data/teams.js`. nuLiga braucht dafür eine Sitzung (Cookie);
  später als täglicher Serverdienst. Spielerlisten werden nur verlinkt.
- Inhalte: Termine/Beiträge sind Beispiele; Vorstand mit Platzhaltern
  (keine Kontaktdaten Einzelner übernommen).

## Worum es geht

Eigenständige Handy-App für die **Tennisfreunde Bielstein (TFB)**: Kiosk und
digitale Strichliste für Getränke und Snacks auf der Tennisanlage. Ziel ist die
Präsentation vor dem Vorstand; bei Zustimmung wird daraus der Echtbetrieb.

- Ersetzt die Papier-Strichliste. Abgerechnet wird **monatlich per
  SEPA-Lastschrift des Vereins** (Mandate bestehen bereits). **Kein Stripe.**
- Abgeleitet aus der Padel-Bielstein-App, aber **strikt getrennt** von ihr:
  eigener Code, eigenes Repository, später eigene Datenbank.

## Wo was liegt

| Was | Wo |
|---|---|
| App (dieser Ordner) | `9. TFB-Kiosk/tfb-kiosk/` |
| Repository | https://github.com/calvinjohncamp/tfb-kiosk (privat) |
| Starten per Doppelklick | `9. TFB-Kiosk/TFB-Kiosk öffnen.html` |
| Logo-Original | `assets/brand/tfb-logo-original.png` → neu erzeugen mit `zsh tools/build-brand.sh` |
| Padel-Kopie (nur Nachschlagen) | `9. TFB-Kiosk/01 Software/` u. a. – Push dorthin ist gesperrt |

## Festgelegte Gestaltung (Stand 09.10.2026)

- **Indie-Look mit gezeichneten Symbolen**, keine Produktfotos (die Fotowelt
  bleibt der Padel-App vorbehalten).
- **Hintergrund Kreideweiß** (fest).
- **Markenfarbe** färbt Logo, Bierdeckel und Akzente. Standard **Anthrazit**.
  Fest: Schwarz, Anthrazit, Sandplatz-Rot; dazu vier freie Felder (Farbwähler/
  Pipette, mit × leerbar). Liegt im Reiter „Verwaltung“.
- **Bierdeckel „Stapel“**: zwei eckige Deckel, hinten die Markenfarbe. Zeigt das
  **heutige Datum** und die Striche/Summe **von heute**; darunter Monatssumme
  und Einzugstermin.
- Kopfzeile: großes „TFB.“-Logo, rechts daneben „KIOSK“; der originale Schriftzug
  „Tennisfreunde Bielstein“ steht rechtsbündig vor dem Profilbild (Abstand 14 px
  wie Ball↔KIOSK). Alles exakt auf der Grundlinie von „TFB.“. Ist zu wenig Platz,
  bricht „TENNISFREUNDE“ über „BIELSTEIN“ um.
- Unterseiten (Strichliste, Abrechnungen, Verwaltung) haben oben rechts ein
  Schließen-Kreuz zurück zum Kiosk; das TFB.-Logo führt ebenfalls zum Kiosk.
- **Signalfarbe Sandplatz-Rot `#C4553A`** (CSS `--signal`): „KIOSK“, Striche, „bald“.
  Bleibt fest, auch wenn die Markenfarbe geändert wird.
- Reiter für alle: **Kiosk · Strichliste · Abrechnungen · Padel** (Link zur
  Padel-Buchungs-App). Admins sehen zusätzlich **Verwaltung**.
- Profilbild hochladen; Antippen im Profil zeigt es groß (ganzes Originalbild).

## Funktionen, die stehen (Demo-Modus)

- Anmeldung über E-Mail aus der Mitgliederliste, Passwort beim ersten Mal,
  einmalige Zustimmung (Kioskordnung, Lastschrift, Sichtbarkeit Strichliste).
- Anschreiben mit Anzahl (Runde). Danach: kurze Bestätigung (2,5 s), Seite
  scrollt zum Deckel, dezenter **Storno-Stempel** (hellgrau, ohne Außenrand,
  anthrazit Ring) auf der rechten oberen Deckelecke, **30 Sekunden**
  (`undoSeconds` in config.js). In der Abrechnung heißt es „stornieren“.
  Deckel bleibt bewusst zentriert.
- Erzquell-Flasche als gemeinsame Form für Malzbier, Sportsfreund und Radler
  (`erzquell()` in art.js) – nur die Farben unterscheiden sich.
- **Strichliste**: letzte 7 Kalendertage, alphabetisch nach Nachname, nur Striche.
- **Meine Abrechnungen**: laufender Monat, abgeschlossene Monate.
- **Verwaltung → Kiosk bearbeiten** (direkt am Kiosk, wie ihn Mitglieder sehen):
  Artikel anlegen/ändern/löschen/ausblenden (Name, Zusatzzeile, Preis, Bereich,
  Symbol, Farbe), Artikel und **Bereiche** per Pfeil sortieren, Bereiche
  anlegen/umbenennen/löschen, Status „Geöffnet“ oder „Bald (nur Vorschau)“.
- Sortiment übernommen aus dem bisherigen Padel-Kiosk (ohne Padel-Artikel).
  Reihenfolge: Alkoholfrei, Bier, Snacks & Eis, Vereinsshop („bald“) ganz unten.

Im Demo-Modus liegen alle Daten nur im Browser des Geräts. Demo-Zugang:
`max@tfb-demo.de` (ist Admin). Datenschicht: `assets/js/demo-backend.js`
(`TFB.api`), für Supabase wird nur diese Schicht ersetzt.

## Offene Punkte – bewusst auf später verschoben

*(Ergänzt 10.10. abends:)* echte Inhalte einpflegen (Nutzer), Schrift entscheiden und
selbst ausliefern, CSS-Farben aufräumen, Verabreden-Details, automatische Link-Vorschau
(Serverdienst), Mannschaftsführer-Rechte für Team-Seiten, echte Push-Mitteilungen,
Präsentation auf dem iPad (braucht Veröffentlichung + Sicherung laden).


1. **Supabase-Projekt** anlegen, sobald ein kostenloser Platz frei ist (Padel
   zieht ca. Ende Oktober 2026 zum Verein um). Bis dahin Demo-Modus.
   Nicht die Padel-Datenbank mitbenutzen.
2. **Mitgliederliste importieren** (Excel-Upload im Admin): Vorschau „neu /
   geändert / nicht mehr dabei“, erst nach Bestätigung übernehmen; Ausgetretene
   nur deaktivieren. Spaltenüberschriften der Vereinsliste stehen noch aus.
3. **Monatsabschluss** für den Kassenwart: Beträge einfrieren, Liste je
   Mitglied, optional SEPA-Datei (pain.008) fürs Online-Banking.
   Klären: Wie lädt der Kassenwart die Lastschriften heute hoch?
4. **Rollen**: nur Admin oder zusätzlich Kassenwart/Vorstand mit eigenen Rechten?
5. **Echtes Sortiment** vom Foto der Papier-Strichliste übernehmen (Foto folgt).
6. Markenfarbe und Sortiment gelten im Demo-Modus nur auf dem eigenen Gerät;
   mit Supabase für alle.
7. **Veröffentlichung** unter einer Subdomain von joern-kaemper.de (z. B.
   `kiosk.joern-kaemper.de`); Domain des Vereins später.
8. Passwort-vergessen per Mail, Datenschutzhinweis/Kioskordnung als Text.
9. Optional: Logo als Vektordatei (SVG/PDF) für Druck und große Flächen.

## Eingefrorener Stand 09.10.2026 (Git-Tag `stand-2026-10-09`)

Gestaltung für heute abgeschlossen und vom Nutzer abgenommen. Ausgangspunkt
für die nächste Sitzung:

- Startseite: Bierdeckel „Stapel“ mit Tagesdatum, Kipp-/Wackel-Effekt und
  dezentem Storno-Stempel (30 s); darunter Alkoholfrei, Bier, Snacks & Eis,
  Vereinsshop („bald“, volle Kacheln).
- Kopfzeile: TFB. · KIOSK (Signal-Rot) · Schriftzug Tennisfreunde Bielstein ·
  Profilbild (mit Vergrößerung).
- Reiter: Kiosk · Strichliste · Abrechnungen · Padel (Link) · Verwaltung (Admin).
- Verwaltung: Kiosk direkt bearbeiten (Artikel, Bereiche, Reihenfolge, Symbole,
  Farben), Markenfarbe (Schwarz, Anthrazit, Sandplatz-Rot + 4 freie Felder).
- 25+ eigene Indie-Symbole, u. a. Kölschstange/-kranz, Erzquell-Flasche
  (Malzbier, Sportsfreund, Radler), Riegel, Hanuta, Goldbär, Hotdog, Basecap/Shirt
  mit TFB-Logo, Padel-Schläger.
- Weiterhin Demo-Modus (Daten im Browser). Offene Punkte siehe oben.

**Nächste Schritte (Vorschlag):** Foto der Papier-Strichliste → echtes Sortiment
und Preise (u. a. Malzbier-Preis prüfen); danach Supabase, Mitgliederimport,
Monatsabschluss.

## Verlauf

- **09.10.2026** – Projektstart aus der Padel-Kopie. Demo-Oberfläche, neues
  TFB-Logo, Indie-Look festgelegt (Kreideweiß, Anthrazit, Stapel-Deckel mit
  Tagesdatum), Profilbild mit Vergrößerung, Verwaltung mit Kiosk-Bearbeitung
  und sortierbaren Bereichen, echtes Startsortiment mit neuen Symbolen.
  Gestaltung damit grob abgeschlossen.
- **09.10.2026** – Kölsch-Kranz (10 Gläser, 20,00 € wie im Padel-Kiosk) mit
  eigenem Symbol direkt neben dem Kölsch (2,00 €). Ein Kranz zählt auf der
  Strichliste als ein Strich „Kölsch-Kranz“.
- **09.10.2026** – Symbole nachgeschärft: Snickers/Mars als längliche Riegel in
  Originalfarben, Hanuta quadratisch, Goldbär, Bockwurst als Hotdog, Pringles mit
  Mr. P, Red Bull mit Karo, Sonne und Bullen. Alkoholfrei steht jetzt vorne:
  Gerolsteiner, Coca-Cola, Fanta, Sportsfreund, Red Bull.
- **09.10.2026** – Symbole reduziert: Goldbär als reine Silhouette, Hanuta als
  quadratische Waffel mit Nusscreme-Schicht, Snickers/Mars mit schrägem
  Logo-Feld, Red Bull nur noch blau-silbernes Karo. Hotdog und Pringles bleiben.
  Gummibär final im klassischen Gummibärchen-Stil (Vorlage vom Nutzer, eigene
  Zeichnung): runde Ohren mit Glanz, Gesicht, Ärmchen/Beinchen als helle Bögen.
- **09.10.2026** – Bierdeckel lebendig: mit der Maus darüber kippt der vordere
  Deckel leicht nach rechts und zurück; beim Antippen wackelt er kurz, dann
  öffnet sich die Abrechnung. Bei „Bewegung reduzieren“ ohne Animation.
- **09.10.2026** – Vereinsshop mit gleich großen Kacheln (Preis + „bald“ statt
  Plus). Neu: Padelbälle (9 €) und Padel-Schläger (159 €) neben den
  Tennisbällen. Vereinsshirt und navyblaue Basecap tragen das echte TFB.-Logo in
  Weiß (`assets/js/brand-data.js`, erzeugt von `tools/build-brand.sh`).
  Danach: Kappe ohne Glanzstreifen am Schirm, Overgrip-Linien innerhalb der Rolle,
  Tennisbälle gelb, Padelbälle orange.
- **09.10.2026** – Kopfzeile: originaler Schriftzug „Tennisfreunde Bielstein“
  (aus dem Logo, `tfb-tagline`) über „KIOSK“. Neuer Reiter **Padel** öffnet
  padel-bielstein.de in neuem Fenster (`padelUrl` in config.js). Malzbier
  (Golden Malz aus Bielstein, eigenes Symbol, 2,00 € vorläufig) bei Alkoholfrei.
- **10.10.2026** – Gerolsteiner als eigenes Symbol nach dem Produktfoto aus dem
  Padel-Kiosk: schlanke Gourmet-Glasflasche, dunkle Kappe wie bei Cola, weißes Etikett
  mit rotem Stern und türkiser Welle.
- **10.10.2026** – Vereinswebsite-Gerüst im Kiosk-Look: Aktuell, Sport, Verein,
  Bausteine mit Bearbeitung und Foto-Upload, Galerie mit Großansicht,
  Mannschaften aus nuLiga, Partner-Duo mit Rotation wie in der Padel-App.
- **10.10.2026** – Treffen als Vorführung (WhatsApp-Link + Zusage per Tipp).
  Danach ehrlich bewertet: allein eine Krücke. Konzept „Treffen 2.0“ (Gruppen-
  Tabelle in der installierten App mit Push) festgehalten, Entscheidung offen.
  Kurze Übergabedatei `docs/UEBERGABE.md` angelegt.
- **10.10.2026** – Treffen 2.0 als Vorführung umgebaut: Gruppen, Training/Einzel/
  Doppel/Anderes, Teilnehmer-Tabelle, Ersatzbank mit automatischem Nachrücken,
  Mitteilungs-Vorschau.
- **10.10.2026** – Eingefroren (Tag `stand-2026-10-10`). Menüpunkt „Treffen“ heißt jetzt
  **Verabreden**. Farben: Zusage Signal-Rot, Absage Schwarz, offen Anthrazit-Grau.
  Profilbilder links in der Teilnehmer-Tabelle, Doppel-Symbol als zwei Paare,
  Enter übernimmt den ersten Namensvorschlag. Desktop-Menüschrift wieder .74rem
  (wie im Hochformat), dafür größere Abstände.
- **10.10.2026 (abends)** – **Home-Seite** als Einstieg für alle Besucher (`#home`, Baustein
  `feature`: Bild breit/hoch/quadratisch, Kicker mit roter Nummer, Überschrift, Unterzeile,
  Text, Link mit Vorschau-Karte; Vorschau im Demo-Modus von Hand, später automatisch per
  Serverdienst). Startmotive gezeichnet (Padel-Court, Kiosk-Symbole, „50“); Padel-Vorschaubild
  aus der Padel-Kopie (`assets/home/padel-bielstein-vorschau.jpg`). **Verein → Club**.
  **Signal-Rot** stärker: Ball im Logo (eigene Masken `tfb-logo-noball`/`tfb-logo-ball` aus
  `tools/build-brand.sh`), KIOSK im Menü, Strich unter Zwischenüberschriften, Wochentag im
  Datumsfeld, Unterzeilen und Link-Knöpfe. **Schrift-Test** in der Verwaltung (System,
  Avenir Next, Inter Tight, Manrope – Google Fonts nur zum Testen, im Echtbetrieb selbst
  ausliefern wegen Datenschutz – oder Klassisch); Standard jetzt „Modern (System)“.
  **Team-Seiten** `#team/<schlüssel>` (Schlüssel ohne „(4er)“, Sommer/Winter teilen sich
  die Seite): Teamfoto (auch klein in der Mannschaftsliste), Platz/Punkte/Mannschaftsführer,
  nuLiga-Link, bis zu 10 Beiträge (beim elften fällt der älteste weg). Inhalte in `site.teams`.
- **10.10.2026 (spät)** – Offline-Test unter `file://` in echtem Chrome (eigenes Profil,
  ohne Netz): Texte und Fotos überstehen Neustart (localStorage wird verzögert geschrieben –
  nach dem Speichern nicht sofort hart beenden). **Sichern & Laden** in der Verwaltung
  (`api.exportAll/importAll`, Datei `TFB-Sicherung_<Datum>.json` inkl. Fotos, Farbe, Schrift,
  Verabredungen). Start immer auf **Home** (auch Startdateien und Manifest). **Dezente Links**,
  Fließtext-Auszeichnungen, **Unterseiten** der Home-Themen mit Kollage (`more: {text, quote,
  quoteBy, images}`; `ph:`-Bilder = Beispiel-Platzhalter). **Account-Karte** nach Padel-Vorbild
  (`api.updateProfile`: Handynummer, Info-Mails, Einladungen). Mehr Testschriften.
- **10.10.2026 (Sitzungsende)** – Übersicht Schriften/Farben erstellt (Abschnitt
  „Gestaltungssystem“). Stand eingefroren als Tag `stand-2026-10-10-abend`. Nutzer:
  „Mir gefällt das alles sehr, sehr gut“ – nächster Schritt: echte Bilder und Texte einpflegen.
- **11.10.2026** – Padel-Text überarbeitet („Padel kommt nach Bielstein.“, ab Mai 2027 im
  Freibad, 365 Tage, Buchungsticket = Freibad-Eintritt, Slogan „Hit. Run. Padel-Fun.“ als Zitat).
  Neu: **einmalige Text-Updates** (`TFB.siteSeed.updates`, erledigte IDs in `site.applied`) –
  damit lassen sich Texte auf bereits gepflegten Geräten ersetzen, ohne Fotos/Links anzufassen.
  Breite Home-Ansicht: Kicker/Überschrift/Unterzeile links dicht gestapelt, Text + Links rechts.
- **11.10.2026** – Link in Home-Themen **verschiebbar**: `link.position` = `left` (unter der
  Unterzeile) oder `right` (unter dem Text, Standard). Im Bearbeiten-Modus mit der Maus ziehen
  (HTML5 Drag & Drop) oder „Link hierher“ tippen; zusätzlich im Editor unter „Platz“. Feste
  Ablageplätze statt freier Pixel, damit es auf allen Geräten sauber bleibt. Dezenter Link
  zeigt jetzt fett die **echte Adresse** (z. B. padel-bielstein.de ↗); der Link-Text gilt nur
  noch für Knopf und Vorschau-Karte. Links öffnen im Bearbeiten-Modus nicht.
- **11.10.2026** – Home-Themen in **linke/rechte Spalte** getrennt (`.feature-left`, `.feature-right`),
  dadurch sitzt der Link rechts direkt unter dem Text. Link-Plätze jetzt fein: `left`, `right-<n>`
  (vor Absatz n) und `right` (unter dem Text) – immer linksbündig. Beim Ziehen erscheinen nur die
  Ablagelinien des eigenen Themas; „Link hierher“-Knöpfe links und rechts für Touch; im Editor
  Auswahlliste „Platz“. Linke Spalte mit mehr Abstand zwischen Kicker, Überschrift, Unterzeile.
- **11.10.2026** – **WYSIWYG-Texteditor** (contenteditable) für Home-Themen, Unterseiten, Texte und
  Beiträge: Fett, Kursiv, Unterstrichen, Rot, Grau, Textmarker, Größer (A+), Sehr groß (A++), Link,
  Zwischenüberschrift, Format entfernen. Gespeichert wird als Text mit Zeichen (`**`, `*`, `__`,
  `{rot}…{/rot}`, `{grau}`, `{marker}`, `{gross}`, `{sehrgross}`, `[Text](url)`, `## `) –
  Umwandlung über `toMarkup()`/`inline()` in site.js; Einfügen nur als reiner Text.
  Textgröße je Thema (`textSize: normal|gross`). Abstand Text → Link = Absatzabstand.
  Unterseite: Häkchen **„Fotos im Originalformat“** (`more.original`, Kollage ohne Zuschnitt).
  Interne Links (z. B. Zum Kiosk) als Pille mit **rundem Symbol** der Zielseite (oder eigenem Bild).
  Einmal-Update: hochgeladenes Titelfoto des Kiosk-Themas auf die Unterseite verschoben
  (Original-Format an), Startseite zeigt wieder das gezeichnete Motiv.
  Gelernt: `.field span { display:block }` störte execCommand im Editor → für `.rich-area` zurückgesetzt.
- **11.10.2026** – **Link-Ziel** im Editor wählbar: „Website“ (Adresse, ohne https:// wird ergänzt)
  oder „Seite der App“ (Auswahl: Home, Kiosk, Strichliste, Abrechnungen, Aktuell, Sport, Club,
  Verabreden und Home-Unterseiten). **Unterseite** im Look der Startseite: Foto oben ohne Schrift,
  darunter links Kicker/Überschrift/Unterzeile/Link (Desktop mitlaufend), rechts Text, Zitat –
  alles linksbündig; Bearbeiten/Schließen über dem Foto.
- **11.10.2026** – **Themen-Editor neu:** Seitenleiste rechts (ab 1100 px, 440 px breit) mit
  **Live-Vorschau** links – die Seite zeigt bei jeder Eingabe genau den bearbeiteten Bereich
  (`preview`-Zustand in site.js, `homeBlocks()` setzt den Entwurf ein; Abbrechen stellt den
  gespeicherten Stand wieder her). Zwei Reiter **„Startseite“** und **„Unterseite „Mehr
  erfahren““** mit je eigenen Feldern und Hinweis, was woher kommt. Handy/iPad: Blatt mit
  „Vorschau ansehen“ (schiebt es weg, Kopfzeile antippen holt es zurück). Von der Unterseite aus
  öffnet der Stift direkt den Reiter „Unterseite“.
  **Titelbild der Unterseite:** `more.heroSource` (`same` | `own`), `more.heroImages` (1–3),
  `more.heroMode` (`wide` | `original` | `squares`). Ist das Startseitenbild hoch-/quadratisch
  und „Breit“ gewählt, steht es links über der Überschrift statt quer zugeschnitten.
- **11.10.2026** – Titelbild der Unterseite: bis zu **4 eigene Fotos**, „2–4 Quadrate nebeneinander“
  (4 Quadrate: Desktop in einer Reihe, Handy 2 × 2).
