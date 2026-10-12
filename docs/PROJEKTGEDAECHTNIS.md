# TFB-Kiosk – Projektgedächtnis und Übergabe

Für den schnellen Einstieg zuerst die kurze **[UEBERGABE.md](UEBERGABE.md)** lesen.
Diese Datei enthält alle Entscheidungen, Konzepte, offenen Punkte und den Verlauf.
Neues bitte unten bei „Verlauf“ ergänzen.

## Nachtrag 11.10.2026 abends – Review mit echten Daten, Aufräumen Stufe 1 (v100)

- Claude hat ChatGPTs Stand v99 mit der echten Sicherung des Nutzers geprüft.
  Bewertung: Chat/Clubgeflüster, Mannschaftsseiten mit Insider News, Club mit fünf
  Kennzahlen und Vorstand wirken wie ein echtes Clubmagazin. Schwachstelle:
  Editoren (Porträt 10 Felder + Optionen, Home 33 Felder) zu komplex für Laien.
- **Leitidee des Nutzers:** „Lass die Mitglieder für Inhalte sorgen“ – Beitragen
  muss so einfach wie möglich sein.
- Nutzer-Entscheidungen: linksbündig ist gewollt; Button „Mannschaftsporträt + News“
  bleibt wie er ist; fünf Kennzahlen statt vier Knöpfe; Vorstand nicht umsortieren
  (Reihenfolge wie heutige Vereinswebsite); Vorstandsdaten dürfen ins Repository.
- Umgesetzt (Stufe 1): siehe UEBERGABE.md „Neu in v100“. Commits `f8e6c90`
  (Sicherungspunkt v99), `1d0b829`, `02f8fb3`.
- Ordner umbenannt in `9. TFB-Website`, `TFB-Kiosk öffnen.html` gelöscht.
- Stufe 2 erledigt (v101): Porträt-Editor in Schritten 1–4 + „Mehr Gestaltung“,
  Handy-Vorschau-Knopf. Stufe 3 erledigt (v102): Home-Editor in Schritten +
  „Mehr Gestaltung“, einheitliche Umschalter/Knöpfe. Danach: Live-Seite.
- v103: Nutzer will Home hochwertiger/abwechslungsreicher (Vorlagen: Art Newspaper,
  Stutterheim, Gazette, Tablet, Vanity Fair, Foks). Sechs Looks per Schalter zum
  Vergleichen; Editor bleibt gleich. Danach: Mannschaftsporträt/Unterseiten mit
  flexiblen Hoch-/Querformat-Fotos (Wunsch des Nutzers, noch offen).
- v104: Entscheidung – Look 6 „Wechselspiel“ ist Standard; Klassisch und Magazin im
  Admin umschaltbar (`site.homeLook`). Zeitung/Bühne/Kacheln verworfen.
- v105: Nutzer will im Admin WYSIWYG im jeweils gewählten Look bearbeiten → umgesetzt;
  Home bis 10 Themen über Plus-Knopf „Neues Thema“.
- v106: Unterseiten-Look (4 Quadrate oben, Text, Zitat, Kollage) gilt für alle
  Unterseiten (Nutzer: „nicht zu kompliziert“). Editor folgt der Seitenreihenfolge;
  Textgrößen inkl. Verkleinern, Farben, WYSIWYG-Überschriften.
- v107: Home-Editor: Themen-Leiste für bis zu 10 Themen, Kleine Zeile/Unterzeile
  sichtbar, zweiter Link, Link bleibt beim Umschalten erhalten. Lehre: beim Vereinfachen
  nichts verstecken, was auf der Seite sichtbar ist.
- v108: Home-Typografie fest (keine Größen), Fließtext nur Fett/Kursiv/Rot; Link-Text
  sichtbar. Nutzer: „nicht mehr so weit weg von einer guten Seite eins“.
- v109: Idee des Nutzers umgesetzt – Unterseiten aus Abschnitten (Text · Überschrift ·
  Zitat) mit Pfeilen und Plus, feste Gestaltung, nur zwei Schriftgrößen (Text/Überschrift).
- v111: Nutzer zufrieden mit Unterseiten-Editor („genau so lassen“); gleiche Bedienung im
  Mannschaftsporträt. Chat-Beiträge mit freiwilliger Überschrift; Chat-Seite heißt „Clubgeflüster“.
- v112–v115: Titelfotos im Seitenformat einpassen; Aktuell-Beiträge 1–4 Fotos (breit/Quadrate);
  Aktuell ohne Unterseiten (Nutzer: „kurz und knackig“), Texteditor überall gleich schlank.
- v116: Leitziel bestätigt – Laien (Mitglieder, Jugendliche) sollen alles selbst pflegen.
  Menü oben (Namen, Ziele intern/extern, Reihenfolge, sichtbar) im Admin bearbeitbar.
- **11.10.2026 abends eingefroren** als Tag `stand-2026-10-11-abend` (v116), vom Nutzer
  abgenommen. Nächster großer Job: **Verabreden** aufdröseln und rund machen.
- **11.10.2026 spät erneut eingefroren** als Tag `stand-2026-10-11-spaet` (v120): zusätzlich
  blätterbare Galerien, Club → History (Galerie bis 100 Fotos unter dem Text).

## Verbindlicher Stand 11.10.2026 – Projekt-Update

Diese Zusammenfassung und die aktualisierte `UEBERGABE.md` haben Vorrang vor
älteren Abschnitten. Maßgeblich bleiben aktuelle Software und Nutzerinhalte.
**Nicht veröffentlicht**, lokale Browser-Datenschicht; Cache **v99**.
Der Nutzer ist sehr zufrieden und hat genügend eigene Flüsternachrichten für
die Vorstellung beim Vorstand gepflegt. Kein neuer Commit, Tag oder Release.

- **Navigation/Home:** Home ist Startseite. Kiosk · Chat · Aktuell · Sport · Club ·
  Verabreden · Padel. Home-Themen mit Detailseite/direktem Link/ohne Ziel;
  „Mehr erfahren“ separat abschaltbar, verlinkte Titel mit rotem Hover. Links und
  Symbole editierbar/sortierbar; Foto-Unterseiten mit bis zu 100 Bildern.
  Home-Beispielhinweis entfernt; bestehende Inhalte bewahren.
  Neu v98: ungepflegte Beispiel-News bereinigt, Home-/News-Bilder als sortierbare
  Collage bis 100 Fotos, fünfteilige Vorschau, volle Collage vor Einzelbildern.
  Schnupper-Kalenderlink durch bearbeitbare Terminüberschrift/-text ersetzt.
  Neu v99: gemeinsame Vollbildfunktion für Einzelfotos, auch in Mannschaftsliste,
  Porträt, Training und weiteren Inhaltsseiten. Foto zeigt Originalquelle, X/Klick
  daneben/Escape schließen; Collagen und Fotoeditoren behalten ihre Bedienung.
  32 Tests bestanden, Desktop-/Smartphone-Browserprüfung erfolgreich.
- **Aktuell:** News 2/3, Save the Date 1/3; mobil umschaltbar. Clubgeflüster ausgelagert.
- **Chat:** großer linksbündiger Feed, neueste Beiträge zuerst; `#chat/alle` mit Suche
  und Filtern. Alte `#gefluester`-Adressen gültig. 24 Texte per Admin-Stift bearbeitbar
  (`site.chatText`). Mannschaftsrechte erhalten. Bis zu sechs Bilder pro Beitrag;
  erst große Gesamtcollage, dann Einzelbilder mit Pfeilen, Klick und horizontalem
  Wischen. Keine persönlichen Direktnachrichten implementiert.
- **Keine künstlichen Chats mehr:** Startbestand leer. Beim Laden werden nur sieben
  bekannte Seed-IDs (`p-s1`–`p-s4`, `p-t1`–`p-t3`) entfernt, auch nach alten Backup-Imports.
  Eigene Nachrichten, Bildreferenzen und Fotos bleiben erhalten. Nutzer-Chrome-Daten
  nicht direkt verändert: Bereinigung erfolgt beim nächsten Laden der neuen Software.
- **Club:** fünf sortierbare/editierbare Zahlen, unerwünschter Zusatzblock entfernt.
  Schwarzer Beitragsbutton vor rotem Aufnahmebutton mit schwarzem Text; Beitragsfenster
  mit X. Editierbarer Hinweis auf 10 Prozent Padel-Rabatt, keine Änderung der getrennten
  Padel-Rabattberechnung. Sieben echte veröffentlichte Vorstandskontakte/Fotos übernommen;
  runde Profilbilder mit Originalansicht. Basti/Marco aufgehellt, Originale erhalten.
  Rollen, Kontakte, Mitgliedssuche mit Auswahl bei gemeinsamen E-Mails, Reihenfolge
  und eigener Vorstands-Fotoausschnitt bearbeitbar.
- **Foto-Freigaben:** freiwillig nach Aufnahme statt im Antrag. Öffentliche Anzeige
  nur mit Freigabe, Minderjährige erst nach dokumentierter Elternzustimmung. Neues
  Foto braucht neue Freigabe; echte Elternverifikation für Produktion noch offen.
- **Sport:** Porträt-/Newsbutton ab 640px zwischen Informationen und Platzierung
  zentriert; mobile kompakte Darstellung erhalten. Zwei Reiter: Mannschaften
  (`#sport`) und Training (`#sport/training`). Training mit Leon Kaufmanns
  Originalfoto und Kontakten, Schnuppertraining und „Termine für Schnuppertraining
  demnächst“ als frei bearbeitbarer Termintext. Kalender-Link und Kalenderverweis
  entfernt. Über Admin-Stift bearbeitbar, einschließlich Trainerfoto/Funktion/Telefon/E-Mail.
- **Foto-Drop:** Dateibatches auf bestehenden Bildfeldern über denselben Uploadweg,
  interne Sortierung erhalten. Tatsächliches Ziehen aus macOS Fotos nach Chrome
  noch nicht geprüft; unaufgelöste Dateiversprechen mit JPEG-Export-Hinweis.
- **Foto-Rahmen:** gemeinsamer Admin-Editor für Website-Fotos, Galerievorschauen,
  Chat-Fotos und Bildanhänge: Hochformat/Querformat/Quadrat, Zoom und Position.
  Pro Bildreferenz als `site.photoFrames` gespeichert, Original unverändert.
  Kollageraster und runde Profil-/Vorstandsrahmen bleiben erhalten.
- **Digitale Aufnahme:** lokal Simulation ohne Speicherung/Versand. Separater
  Python-/SQLite-/SMTP-Prozess vorbereitet, Versand deaktiviert. Club-/Bankfreigaben,
  Rechts-/Datenschutztexte, HTTPS und geschützter Betrieb nötig. Keine automatische
  Mitgliedsanlage. Details in `digitale-aufnahme.md`; keine echten E-Mails versendet.
- **Fußzeile:** Impressum und Satzung als eigene bearbeitbare Unterseiten, plus
  Copyright-Jahr und Vereinsrechte an Inhalten, Gestaltung und App-Konzept.
  Satzung vollständig/wortgetreu, Stand 20.03.2015. Register Köln VR 600693 und
  USt-ID aus öffentlichem Padel-Impressum; Kai Eichmann vom Nutzer bestätigt.
- **Prüfstand:** 32 Node-Tests im letzten Implementierungslauf bestanden
  (Vorstand/Fotorechte, Home/Chat/Galerien, News-Collagen, Beispiel-Bereinigung,
  Sport/Rechtstexte/Fotorahmen, Foto-Drop und Vollbild). Bei diesem reinen
  Dokumentationsupdate keine Tests erneut ausgeführt, auch keine Aufnahme-Tests. Frühere
  Desktop-/Mobilprüfungen in isolierter Vorschau; aktuelle direkte HTML-Prüfung
  durch Browserrichtlinie nicht möglich.

Vor Vorstandsvorstellung eigene Daten über Sichern & Laden sichern und im Nutzer-
Chrome nach Neuladen kontrollieren. Veröffentlichung, eigene TFB-Datenbank,
Mitgliederimport, SEPA und echte Push-Mitteilungen separat vorbereiten.
Padel-Kopie samt deren Dokumentation bleibt unangetastet.

## Historischer Stand am Ende des 10.10.2026

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
| App (dieser Ordner) | `9. TFB-Website/tfb-kiosk/` (Ordner bis 11.10.2026: `9. TFB-Kiosk`) |
| Repository | https://github.com/calvinjohncamp/tfb-kiosk (privat) |
| Starten per Doppelklick | `9. TFB-Website/TFB-Website öffnen.html` |
| Logo-Original | `assets/brand/tfb-logo-original.png` → neu erzeugen mit `zsh tools/build-brand.sh` |
| Padel-Kopie (nur Nachschlagen) | `9. TFB-Website/01 Software/` u. a. – Push dorthin ist gesperrt |

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
- **11.10.2026** – Fotos im Editor **sortierbar**: Titelfotos der Unterseite, Fotokollage und
  Galerie-Bausteine – Pfeile ‹ › auf jedem Vorschaubild oder per Maus ziehen (Griff ⠿);
  `thumbEdit()` / `moveInList()` in site.js. Live-Vorschau zeigt die neue Reihenfolge sofort.
- **11.10.2026** – **Ausrichtung von Fotos im Originalformat** (Links/Mitte/Rechts, Standard Mitte):
  Titelbild der Unterseite (`more.heroAlign`), Fotokollage (`more.collageAlign`; Fotos max. 80 %
  Bildschirmhöhe) und Foto-Baustein (neu `original` + `align`). Auswahl erscheint im Editor nur,
  wenn „Originalformat“ aktiv ist – bei zugeschnittenen Fotos füllt das Bild ohnehin die Breite.
- **11.10.2026** – **Großer Textanfang** auf Unterseiten einstellbar: Aus / 1 / 2 / 3 Zeichen
  (`more.dropcap`, Standard 1). Umgesetzt als `<span class="lead-letters">` statt `::first-letter`,
  damit z. B. „50“ komplett groß steht; Leerzeichen am Ende werden nicht mitgenommen.
- **11.10.2026** – **Anhang an Terminen** (Aktuell): Bild oder PDF (`block.attachment = {ref, kind, name}`).
  Bilder werden auf 2400 px verkleinert (Flyer bleiben lesbar), PDFs als `doc:<id>` im
  Bildspeicher (`api.putFile`, max. ca. 10 MB; Sichern & Laden nimmt sie mit). Im Termin ein
  kleines Vorschaubild bzw. PDF-Symbol rechts. **Großansicht** (`openViewer` in site.js): Bild in
  Seitengröße, Klick aufs Bild = Lesegröße (volle Breite, scrollbar) und zurück; PDF im
  eingebauten Betrachter (Blob-URL, „In neuem Tab öffnen“). Schließen mit ×, Klick außerhalb oder Esc.
- **11.10.2026** – **Clubgeflüster & Insider News (erster Entwurf).** Mitglieder schreiben selbst.
  - **Aktuell** in drei Spalten (ab 1024 px): News · **Clubgeflüster** (Mitte) · Save the Date;
    Handy: Umschalter News · Clubgeflüster · Termine (Standard Clubgeflüster).
  - **Sport → Team-Seite:** „Insider News“ (Spielberichte, Touren, Training); Mannschaftsliste zeigt
    „n Insider News“. Neue Insider News erscheinen auch im Clubgeflüster (roter Rand, Link zum Team).
  - Beitrag: Text (max. 2000 Zeichen, Links werden klickbar) + bis zu 4 Fotos (sortierbar);
    erstes Foto im Beitrag, „+n“; Klick → Kollage → Einzelansicht zum Blättern (Pfeile, Wischen,
    Tasten), schließen mit ×, Klick daneben, Esc. Neueste oben, „Ältere anzeigen“ ab 10.
  - **Rechte:** Lesen öffentlich. Schreiben: Clubgeflüster alle angemeldeten Mitglieder; Insider
    News nur gemeldete Spieler der Mannschaft (`community.rosters`, im Echtbetrieb aus nuLiga-
    Spielermeldung + Abgleich Mitgliederliste) und Admins. Eigene Beiträge bearbeiten/löschen;
    Admins: ausblenden/löschen; andere: „Melden“.
  - Einmalig **Clubregeln** bestätigen; bei Fotos Häkchen „Abgebildete sind einverstanden“.
  - **Jugendliche** (unter 18, `birthYear` in der Mitgliederliste): einmal **Einverständnis der
    Eltern** (Name eines Elternteils + Häkchen; Echtbetrieb zusätzlich Bestätigungsmail).
    Anzeige nur „Vorname N.“. Demo-Jugendliche: Paul Jung (Junioren 15), Mia Kramer.
  - Daten: `db.community = { rosters, posts[] }`; API `posts`, `addPost`, `editPost`, `deletePost`,
    `hidePost`, `reportPost`, `canWrite`, `acceptFeedRules`, `setParentConsent`, `putMemberImage`,
    `teamPostCounts`, `teamRoster`. Für echten Betrieb über mehrere Geräte: Supabase.
- **11.10.2026** – Feinschliff Mitmach-Funktionen:
  - **Accountkarte:** Vorname, Nachname, E-Mail, Handy selbst änderbar (auch Admin). Name/E-Mail
    sind die Daten der Mitgliederliste: neue E-Mail = neue Club-Adresse und Login (Prüfung auf
    Format und Dopplung). Jede Änderung in `db.changeLog` für den Vorstand (Anzeige in der
    Verwaltung steht noch aus; Echtbetrieb: Bestätigungsmail an die neue Adresse).
  - **Mannschaftsliste:** links Name (+ „4er“-Kennzeichen), Mitte Teamfoto + „n Insider News →“
    (Handy: roter Zähler am Foto), rechts Platz und Punkte; Mannschaftsführer nur noch auf der Team-Seite.
  - **Team-Seite:** Teamfoto groß + Infokarte (Platz, Punkte, Mannschaftsführer, Liga, Links
    „Spielplan & Mannschaft“ / „Tabelle der Gruppe“ bei nuLiga), darunter mit Abstand Insider News.
    **Teamfoto ändern dürfen jetzt die Spieler der Mannschaft** (`api.setTeamPhoto`).
  - **Clubgeflüster:** Spieler sehen beim Schreiben „Auch in den Insider News · <Team> zeigen“
    (`post.alsoTeams`); dort mit Hinweis „auch im Clubgeflüster“.
  - **Termine:** Anhang als 76-px-Quadrat unter dem Text (überlagert keine Überschrift mehr).
- **11.10.2026** – Feinschliff 2:
  - Home-Themen: Bild auch **rechts** (`layout: portrait-right | square-right`).
  - Lange Überschriften werden automatisch getrennt (`hyphens: auto`, `lang="de"`).
  - **Save the Date:** Anhang als Quadrat in Größe des Datumsfelds direkt darunter (`.event-side`),
    Text mit voller Breite und gleicher Größe wie News/Clubgeflüster; Aktuell-Spalten gleich breit.
  - **Mannschaftsliste:** Teamfoto links, Name, Knopf „Insider News (n) →“, Platz rechts
    (Handy: Zähler am Foto).
  - **Admins** können beim Schreiben im Clubgeflüster jede Mannschaft für die Insider News
    wählen (Spieler weiterhin nur ihre eigenen). Ursache des Nutzer-Problems: Demo-Max ist nur
    Herren 40 1 zugeordnet, gemeint war Herren 55.
  - **Übersicht aller Beiträge** `#gefluester` (bzw. `#gefluester/<team>`): kleiner Pfeil-Knopf
    neben „Schreib was“; kompakte Karten (Desktop 4 Spalten, Handy 2), Suche nach Name/Stichwort,
    Bereich (Clubgeflüster / Insider News / einzelne Mannschaft), Zeitraum (7/30 Tage), nur mit Fotos;
    Karte antippen öffnet den Beitrag.
- **11.10.2026** – Feinschliff 3: roter Strich unter Zwischenüberschriften mit mehr Luft
  (12 px Strich, 20 px darunter). **Einheitliche Typografie** in News · Clubgeflüster · Save the Date
  (Fließtext .95rem/1.55, Kartenüberschriften 1.15rem Auszeichnungsschrift, 16 px Kartenabstand).
  Automatische Silbentrennung wieder aus. Clubgeflüster-Kopf: Überschrift volle Breite, darunter
  Hinweis links + „Schreib was“ und Pfeil rechts. Beiträge mit **Datum und Uhrzeit** („11. Okt. · 08:38“).
  Bearbeiten/Löschen nur Verfasser; Admin nur „Ausblenden (Admin)“.
  **Profilbild-Ausschnitt** (`openAvatarCropper` in app.js): verschieben + zoomen im Kreis, gespeichert
  wird nur das kleine Bild (320 px), Original bleibt; „Ausschnitt anpassen“ in der Accountkarte.
  **Kopf:** Profilbild oben bündig mit „TFB“, Name dezent rechtsbündig darunter.
- **11.10.2026** – Name unter dem Profilbild wieder entfernt (Nutzer: vorherige Version edler);
  Profilbild wie zuvor unten bündig. **Strichliste in vier Spalten: Getränke · Kranz · Snacks ·
  Equipment** (`tally()` liefert `cats`; Kranz = Artikel mit Symbol „kranz“, Snacks = Bereich
  `snacks`, Equipment = Bereich `shop`, alles andere Getränke). Kranz-Striche in Signal-Rot.
  Handy: Name in eigener Zeile, darunter die vier Spalten; Desktop: Name links, 4 × 84 px.
  Ab 10 Strichen pro Feld „+n“. Demo: einmalig einige Kränze/Snacks ergänzt (`db.demoTallyMix`).
- **11.10.2026** – **Mannschaftsporträt.** Mannschaftsliste: Knopf „Mannschaftsporträt + News“
  mittig zwischen Infos und Platz. Team-Seite: gut sichtbare Porträt-Karte (dunkel, Foto, Titel,
  „Porträt ansehen →“) bzw. „+ Porträt anlegen“ für Spieler/Admins; Insider News bleiben.
  Porträt-Seite `#team/<key>/portraet` im Look der Home-Unterseiten (gemeinsamer Baustein
  `storyHtml()` in site.js): 1–4 Titelfotos (breit/Original/Quadrate, ohne eigene Fotos das
  Teamfoto), Kicker/Überschrift/Unterzeile, Text mit großem Anfang, Zitat, Kollage (Original +
  Ausrichtung). Editor als Seitenleiste mit Live-Vorschau; Fotos per ‹ › sortierbar.
  Daten: `site.teams[key].portrait`, `api.setTeamPortrait` (Admins + Spieler der Mannschaft).
- **11.10.2026** – Strichliste optimiert: Getränke-Spalte breiter, Platz für **15 Striche**
  (drei Bündel), danach „+n“ in derselben Zeile; andere Spalten bis 10 Striche. Linker Rand
  des Notizzettels schmaler (Handy 34 px, Desktop 42 px) – Zettel-Look bleibt.
- **11.10.2026** – **Echter Mannschaftsabgleich aus nuLiga.** `python3 tools/update-rosters.py` liest
  die Spielermeldungen aller Mannschaften (Spielerliste der nuLiga-Mannschaftsseite, Namen im Link
  `rel="ibox…"`) und schreibt `assets/data/rosters.js` – **nur lokal, in .gitignore** (Namen =
  personenbezogene Daten). Die App gleicht „Nachname, Vorname“ (Umlaute normalisiert) mit der
  Mitgliederliste ab (`rosterOf()` in demo-backend.js; Demo-Zuordnung kommt dazu). Ergebnis
  für den Nutzer: Jörn Kämper → Herren 55 1 und Herren 50 1 (Achtung: es gibt auch Jens Kämper –
  immer Vor- UND Nachname abgleichen). Einmal-Korrektur: Admin-Konto aus der Demo-Zuordnung
  Herren 40 1 entfernt, Beiträge mit falscher Mannschaft umgehängt („Ü55“ → Herren 55 1).
  Fehlt rosters.js (z. B. frischer Checkout), läuft die App mit der Demo-Zuordnung.
- **11.10.2026** – Partner-Logos auf allen Seiten um ein Drittel kleiner (Kacheln, Logos und Breite des Duos × 2/3).
- **11.10.2026** – Partner-Duo jetzt auch unter **Verabreden** (Übersicht, Einzelansicht, Anmelde-Hinweis), Seitenschlüssel `treffen`, gleiche Rotation.
- **11.10.2026** – Aktuellen Vorstand von https://www.tfbielstein.de/vorstand-ansprechpartner/
  übernommen: sieben Personen in Originalreihenfolge, veröffentlichte Funktionen, Fotos,
  Telefonnummern und E-Mails. Kai Eichmann nutzt laut direkt abgerufener aktueller Seite
  `kai.eichmann.tennis@gmail.com` (Suchmaschinenkopie veraltet). Bilder lokal unter
  `assets/images/board/`; zentrale Startdaten `TFB.boardSeed` in `assets/data/site-seed.js`.
  Einmaliges Update `club-vorstand-import-2026-10-11` ersetzt auch gespeicherte Platzhalter;
  spätere Änderungen bleiben erhalten. Vorstandseditor bewahrt importierte Bilder und
  ergänzt Telefon/Veröffentlichungsschalter. Keine erfundenen Mitgliedsverknüpfungen;
  bei späterer Verknüpfung gilt ausschließlich die öffentliche Profilfoto-Freigabe.
  Desktop/Smartphone geprüft; sechs Vorstand-/Fototests bestanden. Cache v82.
- **11.10.2026** – Vorstandsfotos als runde Profilbilder (88 px Desktop, 80 px Handy),
  gleicher feiner Rand wie das persönliche Profilbild. Klick öffnet unbeschnittenes Original
  in bestehender Lightbox; bei Mitgliedsverknüpfung sind Vorschau und Original gleichermaßen
  durch öffentliche Foto-Freigabe geschützt. Originaldateien für Kai und Katja nachgeladen.
  Basti und Marco haben separate aufgehellte Vorschauen unter
  `assets/images/board/sebastian-manz-aufgehellt.png` und `marco-hennes-aufgehellt.png`;
  unveränderte Originale bleiben für die Großansicht erhalten. Zuordnung über
  `TFB.boardPhotoPreviews`, ohne gespeicherte Vorstandsangaben zu überschreiben.
  Integriertes image_gen für beide Bearbeitungen; Vorgabe: Gesichtsschatten behutsam aufhellen,
  Identität, Gesichtszüge, Ausdruck, Hautstruktur, Kleidung, Hintergrund, Bildausschnitt und
  Schwarz-Weiß-Stil erhalten, keine Verschönerung oder neuen Details. Ausschnitte und
  Originalansicht auf Desktop/Handy geprüft; sechs Tests bestanden. Cache v83.
- **11.10.2026** – Vorstandseditor: je Foto „Ausschnitt anpassen“, gleicher Editor
  wie im eigenen Profil (Verschieben/Zoom). Speichert nur einen 320-px-Ausschnitt in
  `person.photoCrop` samt Zoom/Position und Quellkennung; Original und persönliches
  Mitgliedsfoto unverändert. Neuer Quellstand/Fotowiderruf macht verknüpfte Ausschnitte
  ungültig; öffentliche `site()`-Antwort entfernt Roh-Ausschnitte, `boardPeople()` prüft
  Foto-Freigabe. `openAvatarCropper` über `TFB.ui` wiederverwendbar, optional mit
  Startposition und Abbrechen-Rückkehr. Board-Änderungen erst mit „Vorstand speichern“
  dauerhaft. Lokale HTML-Vorschau lädt bei Bedarf `assets/data/board-photo-data.js`
  (mechanisch eingebettete sieben Quelldateien), um file://-Canvas-Beschränkungen zu
  vermeiden. Datei bei Änderung der Quelldateien neu erzeugen. Vorschau: Verschieben,
  Zoom, Übernehmen, Speichern, erneutes Öffnen und Handy-Layout geprüft. Direkte
  file://-Browserprüfung durch Browserrichtlinie nicht möglich. Cache v84.
- **11.10.2026** – Home-Themen: `navigation` = `detail` / `link` / `none` steuert
  Bild/Überschrift unabhängig vom CTA. `showMore` blendet „Mehr erfahren“ bei einer
  Detailseite aus, ohne vorhandene Detailtexte/Fotos zu löschen. Kiosk per einmaligem
  Update auf direkten bestehenden Link umgestellt; Padel unverändert. Link-Symbol
  auswählbar, eigenes rundes Link-Foto weiterhin möglich. Home-Vorführhinweis entfernt.
  Jedes Thema kann eine separate `album`-Fotoseite unter `#home/<id>/fotos` erhalten,
  ohne Artikeltext, mit bis zu 100 Fotos, optional Originalformat, Bildsortierung und
  bestehender Großansicht. Reiter „Fotokollage“ im WYSIWYG-Editor; für `h-50` leer
  vorbereitet, keine Testbilder in die eigentlichen Startdaten übernommen.
  Hauptlink und Fotolink separat positionierbar/ziehbar; Pfeile ändern Reihenfolge am
  gleichen Platz. Limit vor Upload und beim Speichern geprüft. Texte, Bilder und Links
  bestehender Home-Beiträge bleiben erhalten. Vier neue Home-Tests und neun bestehende
  Vorstand-/Fototests bestanden; Upload, Speichern, Großansicht, Reihenfolge und mobile
  Kollage in isolierter Vorschau geprüft. Cache v85.
- **11.10.2026** – Signature-Rot beim Hover auf Home-Überschriften gilt auch
  für direkte Seitenlinks, nicht nur für Beiträge mit Detailseite. Tastaturfokus
  erhält denselben Effekt. Cache v86.
- **11.10.2026** – Club: schwarzer Button „Mitgliedsbeiträge“ vor dem Aufnahmebutton
  (Signature-Rot mit schwarzem Text). Beitragsfenster mit Schnuppermitgliedschaft,
  Jahresbeiträgen und Familien-/Aufnahmehinweisen aus der vom Nutzer gelieferten
  Beitragsübersicht. Bestehendes Schließen-X und Escape bleiben nutzbar. Cache v87.
- **11.10.2026** – Club-Aufnahmebuttons: optionaler, frei editierbarer Hinweis `note`
  daneben; einmalig vorbelegt mit „TFB-Mitglieder erhalten 10 Prozent Rabatt auf alle
  Padel-Buchungen.“ Im Knopf-Editor ändern oder leeren. Clubgeflüster und Insider News
  akzeptieren sechs Fotos beim Schreiben/Bearbeiten; mehr als sechs werden abgewiesen,
  nicht still gekürzt. Vorschau und Beitragsübersicht zeigen responsive Collagen:
  bei sechs Fotos ein großes Bild, zwei rechts, drei darunter. Klick auf ein Beitragsfoto
  öffnet direkt dessen Einzelansicht mit Navigation. Eigene persönliche Nachrichten sind
  im aktuellen Projekt nicht implementiert; Collage-CSS ist wiederverwendbar.
  Desktop-/Mobilvorschau und Einzelbildwechsel geprüft; 16 Tests bestanden. Cache v88.
- **11.10.2026** – Chat-Galerie: erster Klick auf die Vorschau öffnet immer die
  große vollständige Collage. Klick auf ein Collagefoto öffnet die Einzelansicht;
  erst dort erscheinen Pfeile. Klick auf das Einzelbild blättert weiter, horizontales
  Wischen vor/zurück ist möglich. Vertikales Scrollen und Mehrfingergesten lösen
  keinen Bildwechsel aus; Folge-Klick nach einem Wischen wird unterdrückt.
  Browser-Klickablauf geprüft, Wischlogik automatisiert getestet. 17 Tests, Cache v89.
- **11.10.2026** – Neuer Hauptmenüpunkt **Chat** zwischen Kiosk und Aktuell.
  `#chat` zeigt Clubgeflüster plus bisherige Team-Beiträge/Teaser als großen,
  chronologischen Feed, neuester Beitrag zuerst. Schreiben und „Alle Beiträge“
  stehen oben. `#chat/alle` bietet die bestehende Übersicht mit Suche und Filtern;
  alte `#gefluester`-Links bleiben gültig und markieren Chat im Menü.
  Aktuell enthält nur noch News (2/3) und Termine (1/3), mit jeweils einer
  zusammenhängenden Spalte. Mobil: News / Save the Date umschaltbar, News als Start.
  Bestehende Inhalte, Redaktionsbearbeitung und Mannschaftsrechte bleiben erhalten.
  Chat kann auch als Linkziel im Home-Editor gewählt werden. Desktop und Smartphone
  geprüft; 18 Tests bestanden. Cache v90.
- **11.10.2026** – Chat-Feed linksbündig an derselben Kante wie die Seitenüberschrift,
  weiterhin auf gut lesbare 760px begrenzt. Sportliste ab 640px mit vier Spalten:
  Foto, Name, freier mittlerer Bereich, Platzierung. Porträt-/Newsbutton ist innerhalb
  des freien Bereichs zentriert statt innerhalb der gesamten Zeile. Buttonbreite
  passt sich schmalen Zeilen an. Ausrichtung auf Desktop und Tablet per Geometrie
  überprüft (0px Abweichung, keine Überlappung). Cache v91.
- **11.10.2026** – Chat-Texte sind über den Admin-Stift auf `#chat` und
  `#chat/alle` editierbar. 24 Textfelder: Haupttitel, Clubgeflüster-Überschrift,
  Beschreibungen, Aktionen, Übersichtsüberschrift/-kicker, Suchfeld, Filter,
  Zeiträume, leere Zustände und Beitragszählung. Speicherung als `site.chatText`,
  fehlende Felder fallen auf `TFB.siteSeed.chatText` zurück; leere Texte bleiben leer.
  Bestehende Beiträge und Fotos werden nicht geändert. Speichern und Unterseitenstift
  in isolierter Browser-Vorschau geprüft; 19 Tests bestanden. Cache v92.
- **11.10.2026** – `photo-drop.js`: Datei-Drag-and-drop für vorhandene Bildfelder
  (Chat, Website-/Galerieeditor, Profil), inklusive Hervorhebung. Übergibt FileList
  an denselben Change-Handler wie die Dateiauswahl, ohne separate Speicherlogik.
  Interne Sortiergesten bleiben unangetastet; Mehrfach-Drops auf Einzelfelder und
  ungeeignete Dateien werden abgewiesen. Keine Datei-/Netzwerk-URLs werden aus
  Drag-Texten geladen. Unaufgelöste macOS-Dateiversprechen bekommen eine Meldung
  mit JPEG-Export als Ausweichweg. Echte Übergabe Fotos-App → Chrome nicht geprüft;
  Dateibatches und Fehlerfälle automatisiert geprüft. 24 Tests, Cache v93.
- **11.10.2026** – Die sieben automatisch erzeugten Beispielbeiträge werden nicht
  mehr angelegt. Beim Laden werden ausschliesslich die alten IDs `p-s1` bis `p-s4`
  und `p-t1` bis `p-t3` aus vorhandenen Chatdaten entfernt, auch nach dem Import
  eines alten Backups. Eigene Nachrichten, Bildreferenzen und Bildspeicher bleiben
  erhalten. Regressionstest fuer Erststart, wiederholtes Laden und Backup-Import;
  Foto-Privatsphaerentest legt jetzt einen eigenen Testbeitrag an. Cache v94.
- **11.10.2026** – Projekt-Update auf Nutzerwunsch: verbindlichen aktuellen Stand
  vor den historischen Verlauf gesetzt und `UEBERGABE.md` neu konsolidiert.
  Geänderte Navigation, Chat-/Galeriefunktionen, Club/Vorstand, Aufnahmegrenzen,
  Foto-Drop, Prüfstand und offene Veröffentlichungsschritte zusammengeführt.
  Nur Dokumentation geändert; keine Veröffentlichung, Mail, Datenlöschung oder Commit.
- **11.10.2026** – Sport in Mannschaften und Training unterteilt, vorhandene
  Bausteine bleiben im selben Seitenspeicher und Admin-Editor. Trainertext/Kontakte
  anhand https://www.tfbielstein.de/trainer/ übernommen, Originalfoto lokal als
  `assets/images/leon-kaufmann.jpg` (1200px breit), im Offline-Cache enthalten.
  Schnuppertext vom Nutzer und Vereinsseite übernommen, Kalenderlink zur bisherigen
  Website. Einmalige Inhaltsmigration ersetzt nur bekannte alte Standardtexte;
  spätere oder bereits abweichende Texte bleiben erhalten. Bestehenden Jugendblock
  bewahrt. Foto, Funktion, Telefon und E-Mail editierbar. Desktop-/Mobilvorschau und
  Trainer-Editor geprüft; 26 Tests bestanden. Cache v95, keine Veröffentlichung.
- **11.10.2026** – Globale dezente Fußzeile mit Impressum/Satzung und Copyright.
  `assets/data/legal-pages.js` enthält alle 17 Paragraphen der Nutzer-Satzung mit
  historischem Stand 20.03.2015, nur visuell gegliedert. SHA-256-Abgleich des gesamten
  Wortlauts (Leerraum und §-Abstand normalisiert) bestanden. Neue Seiten nur bei
  Fehlen ergänzt, spätere Admin-Änderungen erhalten. Eigener Stift und Verwaltung
  führen in bestehenden Editor; keine Partnerwerbung auf Rechtstext-Unterseiten.
  Registerdaten (Amtsgericht Köln, VR 600693), USt-ID DE330174727, Postanschrift und
  Verantwortlicher Sebastian Manz aus https://padel-bielstein.de/ übernommen.
  Abweichung im Vorsitz geklärt: Nutzer bestätigt Kai Eichmann, nicht den auf Padel
  genannten Jens Kämper kommissarisch. Gemeinschaftliche Vertretung mit Sebastian
  Manz und Daniel Pollmann. Rechte Dritter ausdrücklich vorbehalten.
  Satzung nennt historisch Gummersbach und verlangt schriftlichen Mitgliedsantrag;
  nicht eigenmächtig geändert. Vereinsprüfung vor Veröffentlichung bleibt nötig.
  Desktop-/390px-Vorschau und Linkwechsel geprüft, mobil kein horizontaler Überlauf;
  27 Tests bestanden, Cache v96. Keine Veröffentlichung, keine Padel-Änderung.
- **11.10.2026** – Gemeinsamer nichtdestruktiver Foto-Rahmeneditor `photo-frame.js`:
  Portrait 3:4, Landschaft 3:2, Quadrat; Zoom 1–4, normierte Position 0–1 mit
  Pointer-Drag und zwei Reglern. Startformat ohne Einstellung aus Originalmaßen.
  CSS-Cover, Position und Transform-Origin entsprechen der Drag-Geometrie; kein
  Canvas, keine Datei-/CORS-Konvertierung notwendig. Originaldatei bleibt erhalten.
  Admin-API `setPhotoFrame` prüft Rechte/Referenz/Format, begrenzt Zahlen und rollt
  bei Speicherfehlern zurück. Speicherung als `site.photoFrames[ref]`, automatisch
  Bestandteil der bestehenden Sicherung; gemeinsame Einstellung bei Wiederverwendung
  derselben Referenz. Einzelbild-Galerie zeigt das Original, Collagen bleiben im Raster.
  Foto-Felder und Galerie-/Hero-/Album-/Tile-Thumbnails, Chat-Komposition sowie
  Bildanhänge bieten Einpassen. Profil/Board weiterhin bisheriger runder Cropper.
  Separate zugängliche Dialogebene mit Fokus/Escape, darunterliegende Textentwürfe
  bleiben offen und unangetastet. Übernehmen speichert sofort, Originalansicht setzt
  nur Metadaten zurück. Desktop Drag/Zoom/Save/Reload und 390px-Dialog geprüft;
  360px-Quadrat exakt, kein mobiler Überlauf. 28 Tests bestanden, Cache v97.
- **11.10.2026, v98** – News-/Home-Felder mit `block.images` bis 100 Fotos:
  vorhandenes Einzelbild beim ersten Collage-Upload übernehmen, Sortieren/Entfernen/
  Einpassen im Admin. Serverseitige lokale API-Validierung des 100er-Limits;
  fünfteilige Magazin-Vorschau plus Restanzahl, große scrollbar vollständige Collage
  vor Original-Einzelbildern mit Klick/Pfeilen/Wischen. Keine Änderung der Chat-Grenze
  von sechs Bildern. Unveränderte Beispiel-News anhand bekannter IDs und Inhalte
  entfernen; gepflegte Texte/Fotos/Alben schützen, Bereinigung auch nach Backup-Import.
  Kalenderknopf durch `s-schnupper-dates` ersetzt: „Termine für Schnuppertraining
  demnächst“, leerer editierbarer Termintext statt erfundener Termine. Migration nur
  einmal, spätere eigene Termintexte bleiben. 30 Tests bestanden.
- **11.10.2026, v99** – Gemeinsame Einzelfoto-Vollbildfunktion `photo-viewer.js`:
  Mannschaftslisten-/Porträt-/Trainer-/Inhaltsfotos sowie sichtbare Teilnehmer- und
  Chat-Profilbilder per Klick oder Enter/Leertaste öffnen. Foto-Klick innerhalb von
  Mannschafts-/Home-Links zeigt das Original; andere Linkflächen navigieren weiter.
  Collagen/Galerien, bestehende Vorstands-Originalbilder, Link-Vorschaubilder,
  Fotoeditoren und Profil-Menü behalten ihre Bedienung. Keine zusätzliche
  Mitgliederabfrage, Freigaben unverändert. Unbeschnittenes Foto bis 1600px/84vh;
  X, Hintergrund oder Escape schließen, Bildklick bleibt offen. Fokus und vorheriger
  Scrollzustand zurück, Escape schließt kein darunterliegendes Formular. 32 Tests
  bestanden; Desktop-Mannschaftsfoto und Trainerfoto, Schließwege und mobile
  390×844-Ansicht erfolgreich in isolierter Vorschau geprüft.
- **11.10.2026, Projekt-Update auf Nutzerwunsch** – Projektgedächtnis und Übergabe
  auf v99 konsolidiert, veraltete Kalenderangaben und Testzahlen im aktuellen Stand
  korrigiert, neuer Vollbild-Testbefehl und Modulverzeichnis ergänzt. Historische
  Zwischenstände erhalten. Kein Code geändert, keine erneuten Tests, kein Commit,
  kein Versand und keine Veröffentlichung; offene Produktions-/Rechts-/Bankfreigaben
  bleiben bestehen. Padel-Projekt nicht verändert.
- **12.10.2026** – **Verabreden rund (v123).** Reihenfolge Einzel · Doppel · Training · Anderes.
  Beim Anlegen „Einmalig“ (Einladung sofort) oder „Jede Woche“ (regelmäßige Einladung: erster Termin,
  bis einschließlich, Einladung 1–7 Tage vorher; jeder Termin wird neu zu-/abgesagt; Serie in der
  Übersicht unter „Regelmäßig“, ändern/beenden nur durch den Einladenden, einzelne Termine absagbar).
  **Postfach** (Glocke neben dem Profilbild, Zahl = ungelesen): Einladungen, Zu-/Absagen an den
  Einladenden, „Runde steht“, Nachrücken, Absagen, Erinnerungen. Keine E-Mails, keine Banner mehr.
  Chat/Insider News bewusst ohne Postfach. Übersicht: „Wartet auf deine Antwort“ oben.
  Echtbetrieb: Serverdienst legt die Wochentermine an; optional später Web-Push für die Glocke.
  Außerdem 12.10.: wöchentlicher nuLiga-Abgleich per GitHub Actions (montags), Sport-Knopf färbt
  „Mannschaftsporträt“/„News“ einzeln rot (v121), Clubgeflüster-Beitrag nur aus Mannschaft
  entfernen (v122). Supabase-Plan: ein Vereins-Account, zwei Projekte (padel, tfb); ein
  gemeinsamer Lastschrift-Kiosk ist Wunsch des Nutzers, Vorstand entscheidet.
- **12.10.2026** – **Gruppen mit Bestätigung (v124).** Wer zu einer Gruppe hinzugefügt wird, steht dort
  als „unbestätigt“ und bekommt eine Einladung ins Postfach (Bestätigen / Nein danke). Erst nach
  Bestätigung erscheint die Gruppe bei ihm unter „Meine Gruppen“; Hinweise verschwinden, sobald alle
  bestätigt haben (Ersteller bekommt „Alle haben bestätigt“). Wöchentliche Gruppentrainings laden immer
  die aktuell bestätigten Mitglieder ein. Nur der Ersteller bearbeitet die Gruppe, andere können sie
  verlassen. „Anderes“ heißt jetzt **„Mannschafts-Spiel“**; beim Anlegen optional „Treffen um“ und
  „Abfahrt um“ (in Karte und Einladung sichtbar).
- **12.10.2026** – **Verabreden ohne Historie (v125).** Grundsatz des Nutzers: keine Spuren, so schlank
  wie möglich. Termine verschwinden nach ihrem Tag, Serien nach ihrem Enddatum bzw. sofort beim
  Beenden, Postfach-Einträge mit ihrem Termin; beantwortete Einladungen und gelesene Gruppen-Infos
  sofort. Aufräumen läuft bei jedem Speichern (`prune()` in meet.js). Kopf: Glocke 34 px, unten bündig
  mit dem Profilbild, 22 px Abstand; Desktop-Menü gleichmäßig zwischen Logo und Glocke verteilt.
- **12.10.2026** – **Mitgliederliste und automatische Sicherung (v132).** Admin → „Mitgliederliste“:
  Excel (.xlsx, ohne Zusatzbibliothek per DecompressionStream entpackt) oder CSV. Spalten der
  Vereinsliste: Nr., Name, Vorname, m, w, Handy, E-Mail, E-Mail – übernommen werden nur Nr., Vorname,
  Name, E-Mail(s). Vorschau neu/geändert/unverändert/nicht mehr dabei; Ausgeschiedene nur deaktiviert;
  beim ersten Import werden die erfundenen Beispielmitglieder ausgeblendet, das Admin-Konto per
  Name/E-Mail zugeordnet (Anmelde-E-Mail bleibt). Echte Mitgliederdaten nie ins Repo.
  Admin → „Sichern & Laden“ → „Automatisch sichern“: einmal Ordner wählen (File System Access API),
  dann schreibt die App `TFB-Sicherung-automatisch.json` (höchstens 1×/Min. bei Änderung, beim
  Verlassen). Ordner sollte außerhalb von Git-Repos liegen. `navigator.storage.persist()` beim Start.
- **12.10.2026** – **Gruppen: alle Hinzugefügten zählen (v133).** Eine Gruppe lädt immer alle ein, die der
  Ersteller hinzugefügt hat (bestätigt + unbestätigt); raus ist nur, wer ablehnt oder austritt.
  „Unbestätigt“ heißt nur: Gruppe erscheint bei ihm noch nicht unter „Meine Gruppen“. Karte zeigt
  „N Mitglieder · X unbestätigt“. Namen in Gruppen und Einladungen alphabetisch nach Nachname.
  Vorführung bestätigt Gruppen-Einladungen immer (keine zufälligen Absagen mehr).
- **12.10.2026** – **Postfach aufräumen (v134).** Jeder Hinweis hat ein ×; „Alle Hinweise entfernen“ lässt
  nur offene Einladungen stehen (die haben kein ×, sie gehen mit der Antwort). Hinweise verschwinden
  sonst nach 7 Tagen bzw. mit ihrem Termin. Neu: „Du bist jetzt Mitglied der Gruppe …“ für den, der bestätigt.
- **12.10.2026** – **Admin aufgeräumt (v137).** Seite „Verwaltung“ entfällt (#verwaltung → Home). Seiten und
  Kiosk bearbeitet der Admin über den Stift oben rechts (neu auch auf der Kiosk-Seite). Im Konto-Fenster
  (nur Admins) Bereich „Admin“: Mitgliederliste laden, Sichern & Laden + Automatisch sichern,
  Foto-Freigaben prüfen. Schrift fest **Avenir Next**, Markenfarbe fest **Anthrazit #2A2D2E** – keine
  Umschalter mehr. Konto: „E-Mail-Benachrichtigungen vom Club“ (Standard an); „Einladungen von allen“
  (Standard an) ist verknüpft: ausgeschaltet findet man die Person beim Verabreden nur über gemeinsame Gruppen.
- **12.10.2026** – **Entscheidung Kiosk-Freigabe:** Kein Zurücknehmen in der App. Die Freigabe „Kiosk &
  Lastschrift“ bleibt bestehen, sonst entstehen Lücken (Konsum ohne Buchung). Wer aussteigen will,
  schreibt dem Vorstand eine E-Mail; der Vorstand nimmt die Freigabe dann zurück.
- **12.10.2026** – **Stand eingefroren als Tag `stand-2026-10-12` (v138).** Nutzer will vor weiteren
  Änderungen mit dem Vorstand sprechen, ob und wie es mit der neuen Website weitergeht. Bis dahin
  keine Änderungen an der App. Zusammenfassung des Tages: siehe UEBERGABE.md oben.
  iPhone/iPad-Test: nur über WLAN-Server des Macs möglich; Demo-Passwort-Prüfsumme unterscheidet
  sich zwischen `file://` (SHA-256) und `http://` im WLAN (Ersatz-Prüfsumme) – siehe Übergabe.
- **12.10.2026 (nach dem Einfrieren)** – **Hintergrundfarbe je Home-Thema (v139).** Im Home-Editor (Stift)
  neuer Schritt „4 · Hintergrund der Textseite“ (Links jetzt Schritt 5): Farbfeld, **Pipette**
  (Chrome-EyeDropper, nimmt Farben vom ganzen Bildschirm, auch aus anderen Fenstern), Farbcode,
  „Standard“ = Creme **#F5F0E6**. Gilt im Look „Wechselspiel“, je Thema separat (`block.bg`), Live-Vorschau.
  Auf dunklem Grund automatisch helle Schrift (`feature-dark`, Entscheidung nach WCAG-Kontrast).
  Rückfallpunkt bleibt Tag `stand-2026-10-12`.
- **12.10.2026** – **Farbe der Link-Knöpfe je Home-Thema (v140).** Schritt „4 · Farben“ im Home-Editor:
  „Hintergrund der Textseite“ (Standard #F5F0E6) und „Hintergrund der Link-Knöpfe“ (Standard #FFFFFF),
  beide mit Farbfeld, Pipette, Farbcode, „Standard“ (gemeinsamer Baustein `colorField`/`wireColorFields`
  in site.js). Gilt für Pillen und Knopf-Links des Themas (`block.linkBg`); Schrift passt sich an
  (`links-dark`/`links-light`).
