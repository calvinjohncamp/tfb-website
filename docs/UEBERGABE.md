# TFB – Übergabe für die nächste Sitzung

**Zuerst lesen.** Ausführlicher Verlauf: [PROJEKTGEDAECHTNIS.md](PROJEKTGEDAECHTNIS.md).
Diese Zusammenfassung hat Vorrang vor älteren Zwischenständen.

Stand: **11.10.2026 abends, Home-Editor vereinfacht**. Cache **tfb-kiosk-v108**.
Alles committet (Sicherungspunkt v99 `f8e6c90`, danach Stufe 1). Nicht veröffentlicht.

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
