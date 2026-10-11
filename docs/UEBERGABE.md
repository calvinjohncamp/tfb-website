# TFB – Übergabe für die nächste Sitzung

**Zuerst lesen.** Ausführlicher Verlauf: [PROJEKTGEDAECHTNIS.md](PROJEKTGEDAECHTNIS.md).
Diese Zusammenfassung hat Vorrang vor älteren Zwischenständen.

Stand: **11.10.2026, konsolidiertes Projekt-Update nach Foto-Vollbildansicht**. Cache **tfb-kiosk-v99**.
Änderungen liegen lokal vor. Kein neuer Commit, Tag oder Release bei diesem Update.

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

- Doppelklick auf `TFB-Website öffnen.html` oder `TFB-Kiosk öffnen.html` im
  Projekt-Elternordner; Startseite Home. Nach Änderungen Chrome neu laden.
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
