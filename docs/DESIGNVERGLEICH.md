# TFB: Kühle Welt und Warme Welt


Aktueller bestätigter Live-Stand 17.10.2026, Cache v222 (Club-PDF-Ergänzung). Kühle Welt ist Standard,
warme Welt bleibt lokale Alternative; beide nutzen denselben Inhaltsbestand.
Maßgeblich ist die [aktuelle Übergabe](UEBERGABE.md). Frühere Veröffentlichungs-
und Experimenthinweise weiter unten sind historische Recherche.

## Aktuell freigegebenes Branding und App-Symbol

Website und Splash: dunkles TFB mit Signature-Ball #C4553A. Kühle Website:
Hintergrund #EFEFEF, Logo/Text #171717. Finale App-Variante seit v221: **nur TFB,
ohne Ball und Unterzeile**, bei gleichem Rand rund 18 % größer als die Zwischen-
variante mit Ball. Die Schriftform wird proportional aus dem Original übernommen.
App-Farben werden in `tools/build-app-icons.mjs` direkt aus --bg/--logo der
kühlen Website gelesen; App-Icon wechselt nicht mit der lokalen warmen Ansicht.
Apple/PWA und maskable besitzen passende Größen/Sicherheitszonen. Browser-Favicons
bleiben unverändert ohne Ball, mit separater Vorlage. Die Icon-Varianten mit Ball
(v219/v220) sind als finale Entscheidung verworfen, Website-Ball bleibt erhalten.

Kiosk ist kein dauerhaft roter Menüpunkt mehr. Aktive Seite bestimmt Markierung,
Menü heißt Dating 2.0 und die Seite selbst Verabreden. Splash-Einstieg immer Home.

## Referenz und Schriften

Screenshot: `39AA7771-15D3-4699-B4A7-8A49EB086A32_1_105_c.jpeg`, 623 x 1260px.
Vorlage identifiziert als [Foks von AliThemes](https://foks.alithemes.net/).
Die aktuelle Hersteller-Demo enthält dieselbe Überschrift „Quietly Thinking“.
Ihre CSS-Variablen definieren `Bricolage Grotesque` für Überschriften und
`DM Sans` für Fließtext. Kategorien verwenden die Body-Schrift, keine dritte
Textschrift. Fontnamen aus dem Quelltext geprüft, nicht nur visuell geraten.
Die heutige Live-Demo hat gegenüber dem Screenshot bereits andere Inhalte/Farben;
identische historische Schriftgewichte lassen sich aus dem JPEG allein nicht beweisen.

- Überschriften in der TFB-Vorschau: Bricolage Grotesque, Gewicht 700.
- Fließtext: DM Sans, normale Stärke; Kategorien DM Sans 500.
- Beide variable TTF-Dateien lokal aus dem offiziellen Google-Fonts-Repository
  übernommen; SIL Open Font License jeweils unter `assets/fonts/editorial`.
- Keine externen Schriftabfragen, auch `file://` mit Chrome erfolgreich geprüft.
- Hersteller-Stylesheet:
  https://foks.alithemes.net/wp-content/litespeed/css/245fdf4ed7b4ac788ea2721100981d4f.css?ver=fc93b
- Schriftquellen: https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque
  und https://github.com/google/fonts/tree/main/ofl/dmsans

## Farbvergleich

JPEG-Randfläche gemessen: häufigster Pixel RGB 239/239/239 = `#EFEFEF`.
Dies ist der messbare Screenshotwert, kein Beweis für den damaligen CSS-Wert.
Aktuelle Foks-CSS: Body standardmäßig `#F9F9F9`; dunkler Basiston `#171717`,
in Live-Konfiguration Überschriften zusätzlich `#000000`. Kleine JPEG-Buchstaben
haben Kompressions-/Kantenglättungswerte und erlauben keinen eindeutigen Originalton.

Vorschau: Hintergrund `#EFEFEF`, Flächen `#F7F7F7`/`#F9F9F9`, Text/Logo `#171717`,
Sekundärtext `#686868`, Linien `#D7D7D7`. TFB-Signalrot `#C4553A` bleibt erhalten.
Bestehende Marke im App-Code `#2A2D2E`; Präsentationshintergrund separat `#1C1A17`.
Diese Basistöne werden nicht umgeschrieben, nur innerhalb der Vorschau überschrieben.

## Bedienung und Rückkehr

Auf jeder TFB-Seite den kleinen Schriftzug „Tennisfreunde Bielstein“ unter dem
TFB-Zeichen anklicken. Umschalten ohne Navigation oder Datenänderung; weiterer
Klick wechselt zwischen Kühle Welt (neue Schriften, Standard) und Warme Welt
(ursprüngliche Schriften/Farben). Die Zwischenvariante ist entfernt.
TFB-Zeichen bleibt Home-Link, Ball behält Admin-Gimmick.
Schalter ist native Schaltfläche mit Tastaturbedienung, Tooltip und aria-pressed.
Auswahl lokal unter `tfb_design_world_v2`, getrennt von Vereins-/Accountdaten.
Seit v181 auf allen TFB-Seiten, Unterseiten, Account und Dialogen verfügbar.
Externe verlinkte Websites (z. B. separate Padel-Anwendung), Admin-Designverwaltung
und Betriebssystem-Hintergrund sind nicht Teil dieses Experiments.
Auf Home erscheinen links auf gleicher Höhe wie der rechte Bleistift zwei native
Auswahlbuttons „Kühle Welt“ und „Warme Welt“. Dieselbe Admin-Sichtbarkeit wie der
Bleistift: kein Gast-/Mitglieder-Menü, im Demo-Modus über den roten Ball einblendbar.
Aktive Auswahl hervorgehoben, mit Logo-Wechsel synchron. Auswahl bleibt lokal je
Browser gespeichert; keine zusätzliche veröffentlichte globale Admin-Konfiguration.
Logo-Wechsel in Fokus/Präsentation synchronisiert sich über den gemeinsamen Speicher.

## Entscheidung v183

Kühle Welt voreingestellt; neuer Preference-Key ignoriert ältere Testauswahl,
insbesondere `colors`. Fehlender/ungültiger Wert bedeutet cool, gespeichertes warm
bleibt erhalten. Beide Wege (Home-Adminbuttons und Logo) wirken ohne Navigation,
Datenmutation oder Umschreiben der Originalgestaltung. Die farb-only CSS-Schicht
ist komplett entfernt. Die Abschnitte v182/v181 unten sind historischer Verlauf.
Test: frischer Start/alte Zwischenauswahl, Zwei-Welten-Zyklus, Admin-/Guest-/Member-
Sichtbarkeit, links/rechts-Auswahl auf gleicher Höhe bei 1440/1024/834/390/320px,
alle Routen, Daten unverändert, Reload, Offline-Schriften und Fokus-Wechsel erfolgreich.

## Historische Erweiterung v182

Der Nutzer möchte Farben und Typografie getrennt beurteilen. Mittlere Variante
`colors` / `.editorial-colors-only`: neutrale Hintergründe/Flächen/Linien, aber
KEINE Überschreibung von Fontfamilien, Größen, Gewichten oder Schriftfarben.
Auch Logo-Anthrazit, rote Untertitel und vorhandene Konturzahlen bleiben wie warm.
Vollständige neue Variante weiterhin `cool` / `.editorial-preview-active`.
Warmer Standard `warm`, Preference-Key unverändert; vorhandenes `cool` bleibt gültig.
Tooltip beschreibt aktuelle und nächste Welt. Kein Inhalts-/Accountwechsel.

Verabreden-Menü bleibt „Verabreden“. Seitenüberschrift nun „Dating 2.0“ (auch
unangemeldet), Abschnitte „Einladungen für mich“ und „Meine kommenden Matches“.
Termin-/Einladungslogik unverändert. „Verabreden 2.0“ nur Nutzerreferenz zur separaten
Padel-App, dort keine Änderungen. Dreierwechsel gilt für alle internen Menüpunkte.

Erweiterter Test vergleicht tatsächliche Font-/Farbwerte warm vs. colors auf allen
getesteten Routen/Breiten und prüft unveränderte Inhalte, Zustand nach Reload,
vollständige kühle Welt und Rückkehr. Die mittlere Variante hält Layoutformen
weitgehend wie warm, um den Farbwechsel getrennt beurteilen zu können; auf schmalen
Geräten ebenfalls 2x2-Verabreden-Knöpfe gegen den vorhandenen Textüberlauf.

## Erweiterung v181

Home-Zahlen wieder transparent mit feiner 1.25px-Kontur in TFB-Rot, neue Bricolage-
Schrift bleibt (600). Keine massive graue Füllung. Menü deutlicher mit DM Sans 700,
.85rem auf Desktop, .82rem auf mittleren Breiten, .76rem auf sehr schmalen Geräten;
Sekundärton #686868 statt blassem Altgrau, aktive Einträge dunkel und Kiosk weiter rot.
Neutrale gemeinsame Flächen/Linien/Schriften auch für Kiosk, Abrechnungen, Aktuell,
Sport/Training, Mannschaften, Club, Verabreden, Rechtstexte und Account-/Editorblätter.
Fotos, Produktillustrationen und funktionale Signal-/Statusfarben bleiben erhalten.
Auf sehr schmalen Geräten Verabreden-Arten im kühlen Look 2 x 2 statt vier zu enger
Spalten, damit „Mannschafts-Spiel“ nicht aus dem Bildschirm läuft. Warmer Look unberührt.

Separate Dateien `assets/css/design-preview.css` und `assets/js/design-preview.js`.
Basis-CSS unverändert. Bei späterem vollständigem Entfernen nur Einbindungen,
Logo-Schalter und Preview-/Title-Fit-Hooks entfernen; kein Datenexport/Migration nötig.

## Prüfung

`test:browser:design-preview`: gleiche Inhalte und unveränderte lokale Daten,
Originalfonts offline/file, Umschalter/Tastatur/Reload, Warm-Rückkehr, alle Seiten,
Logo/Ball, Konturzahlen, Menü und Account bei 1440/1024/834/390/320px. Screenshots im isolierten Testprofil
verwenden nur Testinhalte und vorhandene Fotos; echte Nutzerinhalte nicht verändert.
Fokus-Regression ebenfalls erfolgreich. Keine echte iOS-Geräteprüfung.
Lokaler HTTP-Vorschauzugang hat einen eigenen Browser-Datenbestand;
bestehende Offline-Inhalte daher über die bisherige lokale Seite nach Neuladen vergleichen.
