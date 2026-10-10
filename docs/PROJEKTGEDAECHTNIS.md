# TFB-Kiosk – Projektgedächtnis und Übergabe

Kurzer Einstieg für jede neue Arbeitssitzung. Oben steht der aktuelle Stand,
unten die offenen Punkte. Neues bitte oben bei „Verlauf“ ergänzen.

## Neu ab 10.10.2026: Vereinswebsite im selben Projekt (Vorführversion für den Vorstand)

- **Kopfzeile (10.10.):** komplettes Vereinslogo (TFB. + Schriftzug), daneben der
  Bereich (KIOSK, NEWS, SPORT, VEREIN) auf der Grundlinie von „TFB.●“, rechts
  Profilbild. **Menü oben** direkt unter dem Logo (statt Reiter unten), bleibt
  beim Scrollen sichtbar. „Aktuell“ heißt jetzt **News**. Partner stehen auf
  jeder Seite **ganz unten**.
- Reiter: **Kiosk · News · Sport · Verein · Padel**. Kiosk zuerst; nur der
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
