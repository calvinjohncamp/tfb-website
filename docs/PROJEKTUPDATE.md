# TFB – Projektupdate vom 08.11.2026

## Persönliche Abrechnung mit Profilbild und klarer Kopffarbtrennung · v344 · 08.11.2026

Vor dem ausgewählten Mitglied bzw. dem eigenen Namen steht ein runder Avatar,
bei fehlendem Foto ein Initialenkreis (z.B. JK für Jörn Kämper). Auch Suchtreffer
und Personenzuordnung bei clubweiten Buchungen verwenden den Kreis. Fotos kommen
über die bestehende geschützte memberAvatars-Abfrage; vorhandene Freigabe- und
Prüflogik bleibt erhalten. Nur die in Ansicht/Suche benötigten IDs werden geladen.
Kein Foto notwendig; bei Ladefehler bleiben Initialen sichtbar. Keine neue
Fotoablage oder Speicherung. Suchfeld ohne Beispiel-Platzhalter.

Rote Kalenderköpfe: linke Seite schwarz, rechte Summen und Beschriftungen weiß.
Blaue Kalenderköpfe: linke Jahres-/Monatsangaben weiß, rechte Angaben gelb.
Monatsbeträge auf dem hellen Jahresblatt in der gelben Welt wieder Signature-
Blau für bessere Lesbarkeit; Umsatz-Tagesmarkierungen bleiben Signature-Gelb.
Rote Monatsbeträge bleiben rot. Kalenderlogik und Buchungswerte unverändert.

Chromium/WebKit erfolgreich: Initialen DO und JK, vorhandenes Profilbild,
leeres Suchfeld, Namens-/Umlaut-/Mailtreffer nach Avatarergänzung, Kopffarbwerte,
dunkelblaue Monatsbeträge, Kalendergeometrie und bestehende Abrechnungsabläufe.
Keine Backendänderung, Migration, Datenlöschung, Zahlung oder Mail.
Service Worker v344.


## Chronologische Buchungen, transparente Korrekturen und Kalenderakzente · v343 · 08.11.2026

Buchungen in der Anzeige, im CSV-Export und in der Darstellung gespeicherter
Belege nach echtem Zeitstempel aufsteigend (älteste zuerst, gleiche Zeitstempel
stabil nach Buchungs-ID). Tagesgruppen dadurch ebenfalls chronologisch.
Datenbankabfragen und unveränderliche Originalbelege werden nicht umgeschrieben.

Rücknahmen sind serverseitig auf 30 Sekunden begrenzt. Journal hält Original
plus Gegenbuchung mit actor_id/source/reason/created_at fest; Admin-Korrekturen
haben ebenfalls Akteur und Begründung. Nun zusätzlich eine personenbezogene
Einzelliste im Bereich Rücknahmen und Korrekturen: Art, Produkt, gebuchte Person,
erfassende Person, Zeitpunkt in Berlin, Betrag und Grund. Bei importierten
Vorführ-Rücknahmen war der ursprüngliche Zeitpunkt nicht gespeichert; die
vorhandene Kennzeichnung dazu bleibt unverändert.

Für vergangene Monate lautet der Summenhinweis Monatssumme / vorgesehener
Abbuchungsbetrag. Bewusst kein tatsächlicher Einzugsstatus: Zahlungsweg und
Rhythmus sind noch offen, alle Daten bleiben Vorführung. Laufender Monat bleibt
Monatssumme. Einzelmitglied-/Clubwerte folgen denselben korrigierten Aggregaten.

Admin-Leiste: Außenabstand Weltwahl zu Verwaltungsbuttons 12px gegenüber 4px
zwischen den Verwaltungsbuttons (dreifach). Kalenderkörper: Monatsnamen und
Positionshinweise schwarz, Monatsbeträge Signature-Gelb/Rot. Umsatz-Tage mit
Signature-Zahl und Unterstrich markiert; nur positive Nettoumsätze markiert.
Auswahl weiterhin als dezenter Rahmen erkennbar. Rote Kalenderköpfe: große
Jahres-/Monatszahl und Beschriftungen schwarz, Summen weiß. Gelbe Welt behält
lesbare Akzente auf Signature-Blau.

Chromium/WebKit: frühere Buchung vor späterer, Korrekturliste mit handelnder
Person, historische Monatsbeschriftung, neue Farbwerte und Umsatz-Unterstriche,
Abstand, Rollen und bestehende Abrechnungsabläufe geprüft. Neun Serverprüfungen
zu Journal, 30-Sekunden-Rücknahme, Historie, Berechtigungen, Summen und
Wiederherstellung erfolgreich. Keine Backendänderung, Migration, Datenlöschung,
Bankaktion oder Mail. Service Worker v343.


## Aktive Admin-Kachel, Umlautsuche und direkter Monatsstart · v342 · 08.11.2026

Aktueller Admin-Seitenlink mit aria-current=page und Signature-Farben:
Kiosk/Statistik/Partner in Blau mit gelber Schrift in der gelben Welt bzw.
Signature-Rot mit Weiß in der roten Welt. Kompakte Menüstruktur bleibt.

Nach Screenshot echte Suchursache korrigiert: NFD plus Entfernen der
Akzentzeichen hatte Kä zu Ka gemacht und damit Katharina/Katja/Annika usw.
einbezogen. Suche normalisiert jetzt wie Dating 2.0 nach NFC und erhält ä/ö/ü.
Lokale Namens-Treffer sofort, zusätzlich derselbe geschützte Namenssuchdienst
wie Dating. Bei Eingaben mit @ oder Punkt werden die hinterlegten Mailadressen
über den bestehenden Admin-Lesezugang exakt als Teiltext verglichen, weil der
allgemeine Suchdienst Satzzeichen im Suchtext vereinfacht. Keine öffentlichen
Mailadressen, keine neue API oder Berechtigung. Antwortversion und Prüfung des
noch verbundenen Eingabefelds verhindern überholte Treffer nach Eingabewechsel.

Die native Jahresauswahl liegt transparent über einer sichtbaren Jahreszahl
mit eigenem Pfeil. Dadurch kein Abschneiden großer Ziffern durch native
Select-Textmaße; Auswahl und Tastaturbedienung bleiben erhalten.
Beim Öffnen der Club- und persönlichen Abrechnung sind der laufende Monat,
sein Tageskalender und seine Buchungen sofort sichtbar. Andere Monate weiterhin
anklickbar; Jahresübersicht weiterhin als Rückweg verfügbar.

Chromium und WebKit: Kä (inklusive kombiniertem Unicode-Umlaut) findet Kämper
und keine Ka-Namen; KE/Jan bleiben geprüft; vollständige E-Mail mit Punkt und @
findet den korrekten Namen. Automatischer Monatsstart in beiden Ansichten,
Jahreszahl innerhalb der Kopfbegrenzung bei Handy/Tablet/Desktop, aktives Menü
in beiden Farbwelten sowie Korrekturen, CSV und Archive erfolgreich geprüft.
Keine Backend-/Datenänderung oder echte Zahlung. Service Worker v342.


## Kompakte Verwaltung und quadratische Kalender · v341 · 08.11.2026

Globale Admin-Leiste verkleinert: Kühle/Warme Welt kompakter, daneben Splash,
Home, Partner, Mitglieder, Statistik, Kiosk und ein SVG-Sicherungssymbol mit
zugänglichem Namen/Tooltip Datensicherung. Bearbeiten-/Verwalten-Zusätze und
App-Anleitung entfernt; die Anleitung im Account bleibt. Eine Zeile bei
verfügbarem Platz, auf kleinen Displays natürliche Umbrüche. Kioskseite enthält
keine doppelte Kiosk-Abrechnungs-/Artikelarchiv-Leiste mehr. Artikelarchiv bleibt
innerhalb der Abrechnung unter Weitere Zeiträume und Verwaltung erreichbar.

Jahres- und Monatskalender sind gleich große quadratische Blätter im TFB-Look:
links große Jahreszahl, Jahressumme und zwölf typografische Monatsfelder in
3x4-Anordnung. Nach Monatswahl rechts derselbe Rahmen mit großem Monatsnamen,
Monatssumme und Tagesraster. Unter 761px untereinander. Vor der Auswahl wird nur
das Jahresblatt angezeigt. Signature-Blau/Gelb oder Rot/Weiß; ausgewählter
Monat und Tag bleiben hervorgehoben. Buchungen und Namensdarstellung erhalten.

Suche: nur zusammenhängende Teilzeichenfolgen, ohne Beachtung der Schreibweise;
Suchfeld ohne Browser-Autokorrektur. Zusätzlich wird auch die native
Mitgliedsauswahl auf Treffer eingeschränkt, solange ein Suchtext vorliegt.
Die gesamte Auswahl bleibt nach Löschen des Suchtextes wieder verfügbar.
Kiosk-Mitgliedsauswahl und Mitgliederverwaltung sortieren mit deutscher
Telefonbuch-Kollation: ä wie ae, daher Kämper vor Kaufmann.

Chromium/WebKit: KE/Jan mit gezielten passenden und unpassenden Testnamen,
Kämper/Kaufmann-Reihenfolge, Rollen, kompakte Admin-Leiste auf allen Bereichen,
Kalenderquadrate/-gleichheit nebeneinander bei 834/1440px sowie untereinander
bei 390px, Textbegrenzungen und mobile Überläufe geprüft. Abrechnungsabläufe,
Korrekturen, CSV und Archive weiter erfolgreich. Keine Backendänderung,
Migration, Datenbereinigung, echte Zahlung oder E-Mail in dieser Version.
Service Worker v341.


## Kalender-Abrechnung und leere Dublette bereinigt · v340 · 08.11.2026

Ersetzt die lange v339-Monatsliste: kompakter Kalender mit Jahresauswahl
(aktuelles Jahr vorausgewählt), zwölf Monatskacheln mit Betrag und Markierung
des laufenden Monats. Künftige Monate deaktiviert. Jahresbetrag im Kopf, Heute
als Schnellzugriff. Monatsklick zeigt Tageskalender und gruppierte Buchungen;
Tag wählt nur dessen Käufe, Ganzer Monat setzt zurück. Übersicht-Button erhält
die Jahres- und Mitgliedsauswahl. Vorjahre bei vorhandenen Daten auswählbar.

Admin: Alle Mitglieder voreingestellt, zusätzlich sofortige Namenssuche neben
der Auswahl (Teiltext, Groß-/Kleinschreibung und Umlaute normalisiert;
Tastaturauswahl über Pfeil/Enter, Escape schließt). Ausgewählter Name fett im
Signature-Kopf. Bei Einzelmitglied entfällt der wiederholte Name am Kauf,
in der Clubgesamtansicht bleibt die Zuordnung sichtbar. Datum/Uhrzeit inline
hinter dem Artikel; Details weiterhin aufklappbar. Persönliche Abrechnung nutzt
denselben Kalender. Blau/Gelb bzw. Signature-Rot/Weiß für Kalender und Rückweg.

Explizit beauftragte Live-Datenbereinigung: Der zweite Jörn-Kämper-Eintrag war
bereits inaktiv, ohne Login, Käufe, Abrechnungen, App-Datensätze, Sessions,
Zugriffsmetadaten oder Teams. Nach lokaler Sicherung und bedingter Löschung
wurde genau dieser eine leere Datensatz entfernt. Aktiver Adminzugang und seine
49 Kiosk-Einträge danach unverändert bestätigt. Keine Buchung gelöscht,
keine Zusammenlegung von Finanzdaten, kein Zahlungs-/Mailaufruf. Keine Migration
oder Backendänderung erforderlich. Die Importlogik aus v324 ordnet bereits nach
eindeutigem Name/E-Mail-Paar zu; eine fehlende Mitgliedsnummer erzeugt dort kein
neues Konto. Cloudflare-Lesezugriff funktionierte mit automatischer
Kontoerkennung; keine gespeicherte Konfiguration oder Zugangsdaten geändert.

Chromium/WebKit: Mitgliedersuche und Abwahl, persönliche/Clubansicht,
Jahreswechsel mit historischem Kauf, Monats-/Tagesfilter, Signature-Farbwerte,
Korrekturen, CSV, Monatsarchive und 320–1440px geprüft. Admin-Rollenprüfung
unverändert erfolgreich. Vorführbetrieb und alle Käufe bleiben erhalten.
Service Worker v340.


## Clubweite Kiosk-Abrechnung und klare Jahresliste · v339 · 08.11.2026

Eigene Verwaltungsseite #kioskabrechnung, von jeder Seite über die zentrale
Admin-Leiste erreichbar, direkt nach Clubstatistik. Clubstatistik zählt
Website-Nutzung; Kiosk-Abrechnung zeigt Käufe des gesamten Clubs mit
Mitgliedsfilter. Persönliche Abrechnungen bleiben davon getrennt. Direkter Link
und Neuladen erhalten die Verwaltungsseite; normale Mitglieder sehen dort keine
Clubdaten. Die bisherige Kiosk-Schaltfläche führt ebenfalls zur neuen Seite.

Für Club und Einzelmitglied: Heute als Schnellzugriff, danach Januar bis
Dezember in chronologischer Reihenfolge. Laufender Monat markiert, künftige
Monate deaktiviert, leere vergangene Monate mit 0 Euro sichtbar. Jahressumme
unter der Liste. Vorjahre nur bei vorhandenen Buchungen als eigener aufklappbarer
Bereich. Monat öffnet Tage und Einzelkäufe mit Namen im Admin, Artikeln,
Zeitpunkt, Betrag und Tagessummen. Details/Korrekturen/CSV bleiben erhalten.
Keine Backendänderung, Migration, Datenlöschung oder echte Abbuchung.
Service-Worker v339. Chromium/WebKit prüfen Navigation, Rollen, Monatsliste,
Preis-Historie, Korrekturen, Monatsversionen und CSV sowie 320–1440px Breite.


## Übersichtliche Abrechnung nach Zeitraum - 08.11.2026 · v338

Nutzer hat den flachen Abrechnungsbereich aus v337 als unübersichtlich bewertet
und den sofortigen Umbau mit gemeinsamer Hierarchie für Mitglieder und Admin
beauftragt. Diese Darstellung ersetzt die alte flache Einstiegsliste.

Startansicht: klickbare Beträge für Heute, laufender Monat, vergangener Monat,
aktuelles Jahr und Vorjahr. Darunter vergangene Monate des laufenden Jahres mit
Buchungen sowie weitere ältere Jahre bei vorhandenen Daten. Keine Einzelposten
auf der Startansicht. Jahresauswahl zeigt ausschließlich Monatsbeträge und
Jahressumme; laufendes Jahr nur bereits begonnene Monate, frühere Jahre zwölf.
Monatsauswahl zeigt nach Berliner Kalendertagen gruppierte Einzelkäufe mit
Tagessummen und Monatssumme darunter. Heute öffnet nur die Tagesbuchungen.
Übersicht-/Jahresnavigation erlaubt Rücksprung ohne verschachtelte Jahreslisten.

Admin hat dieselbe Hierarchie und zusätzlich Mitgliedsauswahl (alle oder ein
Mitglied). Erlaubnisse weiterhin serverseitig; Mitglieder sehen nur ihre Werte.
Neue reine Lese-Endpunkte /app/kiosk/overview und /admin/kiosk/overview liefern
Tages-/Monats-/Jahresaggregate aus Journal und Gegenbuchungen. Jahresansicht lädt
keine jährlichen Einzelpositionen. Berliner Tages-/Jahresgrenzen geprüft;
Korrekturen werden in allen Summen identisch berücksichtigt. Datumsformatter
serverseitig wiederverwendet. Keine neue Migration oder Datensatzänderung.

Vorführhinweis kompakt und aufklappbar. CSV und Jahresnavigation im Detail;
Original-/Korrekturbeträge und gesicherte historische Monatsversionen eingeklappt.
Versionen nach ausgewähltem Monat gefiltert. Freie Zeiträume, letzte sieben Tage,
Produktarchiv und Sortimentsverlauf unter Weitere Zeiträume und Verwaltung.
Berechtigte Korrekturen, Fragen/Antworten und druckbare Belege bleiben erhalten.
Mitgliederansicht hält die gewählte Ebene bei Neurendern; überholte parallele
Leseantworten überschreiben die aktuelle Navigation nicht.

22 Serverprüfungen für Abrechnung, Synchronisierung und Gastrechte bestanden.
Chromium/WebKit: Jahr ohne Einzelposten, Monat mit Tagesgruppen, Zurücknavigation,
Preis-/Artikelhistorie, Gutschrift, Versionsstände, Mitgliedsansicht, Rückfrage,
CSV/Beleg und 320/390/834/1440 px bestanden. Start- und Jahresansicht visuell geprüft.
Worker-Dry-Run bestanden; Service Worker v338. Details RELEASE-v338.md.

Vorführbuchungen und bestehende Abrechnungsstände bleiben ausdrücklich erhalten.
Keine echten Forderungen, Abbuchungen, Abrechnungsmails, Mandatsaktivierung oder
Reset. Offene Entscheidungen aus der Finanzwart-Abstimmung und das geplante
Startdatum April 2027 bleiben unverändert. PDF-Abstimmungsvorlage weiterhin gültig.

Live veröffentlicht: Quellstand 632e44e, Pages-Lauf 42486845376 erfolgreich,
Worker a26f8324-a658-4956-bb57-d964ff44304e, Service Worker v338.
Öffentlich ausgelieferte Hierarchie-JS, CSS und Cacheversion geprüft. Keine
Migration oder Datenänderung erforderlich; keine Live-Testbuchungen erzeugt.
Lokaler Projektordner durch gezielten Patch aktualisiert; übrige Änderungen
und die PDF-Abstimmungsvorlage erhalten.

## Tagesabschluss und nächster Einstieg - 08.11.2026

**Verbindlicher Abschlussstand:** Die Sitzung ist beendet. Kiosk und Abrechnung
laufen weiterhin ausschließlich als Vorführung. Keine echten Forderungen,
Abbuchungen, Zahlungsaktivierung oder Abrechnungsmails. Kein weiterer Reset.

### Erledigt und veröffentlicht

- Letzter App-Stand v337: Produktarchiv, Preis-/Namensschutz alter Buchungen,
  unveränderliches Journal, nachvollziehbare Rücknahmen/Gutschriften, gesicherte
  Vorführmonate mit Versionen, persönliche Historie, CSV/druckbare HTML-Belege
  und buchungsbezogene Fragen/Antworten. Zugang unter Kiosk im Admin-Modus.
- Quelle 25c12fb, Pages-Lauf 42479337447 erfolgreich, Worker
  2d83e402-b772-4348-bedd-4f34699b7d5f, Service Worker v337. Migration 0013
  installiert. Technische Einzelheiten und Prüfungen: RELEASE-v337.md.
- Letzter dokumentierter Erhaltungsabgleich: 48 vorhandene Vorführpositionen,
  16.550 Cent ursprünglicher Gesamtwert, vier bestehende Rücknahmen; unverändert
  übernommen. Dies ist ein Abnahmestand, kein laufender Live-Zähler.
- Statistik wurde separat am 08.11.2026 um 12:36:33 Uhr Berlin auf null gesetzt.
  Dies war KEIN Reset der Kiosk-/Abrechnungsdaten. Finanzdaten bleiben erhalten.

### Einseitige Vorlage zur Abstimmung

Fertiges, visuell geprüftes PDF: **TFB-Kiosk-Abrechnung-Abstimmung.pdf**.
Lokaler Projektpfad (nicht als öffentliche Website-Datei veröffentlicht):
`01 Software/output/pdf/TFB-Kiosk-Abrechnung-Abstimmung.pdf`.
Genau eine DIN-A4-Seite; TFB-Logo in Blau/Gelb. Inhalt: heutiger Vorführbetrieb,
Informationen für Mitglieder und Finanzverwaltung/Buchhalter, Schutz historischer
Buchungen bei Sortimentspflege, vorgeschlagener Monatsablauf, offene Bank- und
Mandatsfragen sowie der spätere kontrollierte Stichtag X. Nutzer will die Vorlage
mit zweitem Admin und Buchhalter/Finanzwart besprechen. Kein Versand durch uns.
Die App wurde für die PDF-Erstellung nicht geändert oder erneut deployed.

### Vorläufiger Stopp bei der echten Abrechnung

Nutzer will derzeit NICHT weiter ins Detail gehen oder den echten Bankeinzug
programmieren lassen. Zuerst beschreibt Buchhalter/Finanzwart, wie der heutige
Abbuchungsauftrag korrekt in die App übertragen werden soll. Dafür klären:

1. Bisherige Bank/Vereinssoftware und Einreichungsweg; benötigtes Import-/Bankformat
   und zuständige Person für Freigabe und Zahlungsabgleich.
2. Verwendbare SEPA-Mandate einschließlich Reichweite für Kioskkäufe und nötige
   Zahler-/Konten-/Mandatszuordnung. App-Zustimmung ist keine Bankanbindung.
3. Einzugstag, vereinbarte Vorankündigungsfrist und zulässiger Informationsweg.
   Die alte Anzeige „Einzug am 5.“ ist keine freigegebene Vorgabe mehr.
4. Benötigte Monats-/Einzelpostenexporte, Kontierungen und Aufbewahrungsregeln.

Erst nach diesen Angaben den echten Ablauf festlegen, gemeinsam testen und
separat aktivieren. Keine stillschweigende Übernahme bisheriger Demodaten als
Forderungen. Keine kostenpflichtige Zahlungs-/Mailanbindung ohne passende
Entscheidung. Padel-Zahlungsweg (Stripe oder ggf. Lastschrift) weiterhin offen.

### Späterer Stichtag X - noch nicht beauftragt

Nutzer bereinigt bis dahin das gewünschte Produktsortiment. Anschließend sollen
bisherige Vorführbuchungen und Vorführabrechnungen aus der aktiven App verschwinden,
damit ein klarer Start mit null erfolgt. Konten, Einstellungen und das bereinigte
Sortiment bleiben erhalten. Das umfasst auch abhängige Demo-Journal-/Korrektur-/
Archiv-/Fragedaten; keinen verwaisten Zustand hinterlassen. Die gesonderte
Statistik-Resetdatei ist hierfür ausdrücklich NICHT geeignet.

Kein fester Termin, kein automatischer Job und kein Kiosk-Reset ausgeführt oder
vorab freigegeben. Für die spätere Bereinigung ist ein gezielter, überprüfter
Operatorablauf mit Sicherung und ausdrücklich benanntem Stichtag erforderlich;
aktuelle Unveränderlichkeitssperren schützen das Journal. Frühere Sicherungen
werden nicht beiläufig gelöscht. Geplanter App-Start bleibt April 2027.

### Arbeitsstand für die Fortsetzung

Die veröffentlichten Änderungen und Nachweise liegen in GitHub main. Der lokale
Projektordner enthält zusätzlich ältere, unveröffentlichte Änderungen; nicht
pauschal bereinigen, überschreiben oder pushen. Bisherige isolierte Arbeitskopie:
`/private/tmp/tfb-v326-analytics`. Diese Tagesabschluss-Änderung betrifft nur
Dokumentation; keine neue App-Version, Migration oder Veröffentlichung nötig.

## Produktarchiv und vorbereitete Kiosk-Abrechnung – 08.11.2026 · v337

Nutzerfreigabe: Produktpflege und Abrechnung vorbereiten und direkt deployen.
Vorführbuchungen ausdrücklich erhalten. Echtstart April 2027; Zahlungswege und
Einzugstermin klärt der Vorstand. Keine Zahlungsaktivierung, SEPA-Datei, Stripe-
Verarbeitung, automatischen Monatsforderungen oder Abrechnungsmails implementiert.
Padel unverändert; gemeinsamer Kiosk später vorgesehen, Zahlungsadapter noch offen.

Neue additive Migration 0013: kiosk_entries, kiosk_adjustments, kiosk_statements,
kiosk_catalog_history und kiosk_messages. Originale, Gegenbuchungen, Monatsstände,
Sortimentsverlauf und Rückfragen gegen UPDATE/DELETE geschützt. Keine Löschung.
Bestehende zentrale item-Datensätze werden idempotent ins Vorführjournal übernommen,
inklusive bereits zurückgenommener Positionen. Namen/Preise/Zeitpunkte bleiben aus
dem Original; fehlende historische Kategorie/Einheit wird nicht erfunden. Legacy-
Stornozeit explizit als unbekannt dokumentiert. Neue Käufe speichern zusätzlich
Zusatztext, Kategorie, Einheit und Verkauf/Verleih. Alle Positionen mode=demo.

Artikelpflege: „Aus Sortiment entfernen“. Bereits verwendete Artikel archivieren,
unverwendete aus dem aktuellen Katalog entfernen. Bei fehlendem vorherigem
Katalog gilt der serverseitige Standardkatalog als Ausgangsstand. Archivierte
Artikel nicht bestellbar, gezielt wieder aktivierbar. Sichtbarkeit bleibt separat.
Preis-/Namensänderungen gelten nur für neue Käufe. Sortimentsstände mit Bearbeiter
und Zeit unveränderlich dokumentiert. Verleiheinheit frei benennbar, keine
Lager-/Rückgabe-/Kautionsverwaltung. Bestehendes Sortiment nicht bereinigt.

Im Kiosk unter Admin: Kiosk-Abrechnung und Archivierte Artikel. Die globale
Admin-Leiste mit sieben Buttons bleibt unverändert. Monats-/Mitgliederfilter,
letzte sieben Tage und Datumsbereich; alle Mitglieder höchstens drei Monate,
ein Mitglied bis zwei Jahre pro Abruf. Originalbetrag, Korrekturen und Nettosumme,
aufklappbare Einzelpositionen mit Buchungsnummern. Begründete Teil-/Vollgutschriften
mit Betragsgrenze und Idempotenz; Originale bleiben erhalten. Synchronisierte
Nettobeträge aktualisieren den Bierdeckel. Mitglied sieht nur eigene Daten.

Vorführmonat sichern: alle oder ausgewähltes Mitglied. Deterministische Prüfsumme
verhindert doppelte Versionen; nach finanzieller Änderung neue Version statt
Überschreiben. Persönliche Abrechnungen unter dem bestehenden Account-Zugang,
Monatswahl, gesicherte Versionen und detaillierte Belege. CSV für Einzelpositionen,
HTML-Beleg mit druckbarer Darstellung/PDF über Browser. Keine amtliche Rechnung
oder behauptetes DATEV-Format. Persönliche Fragen zur Buchung und Adminantworten
bleiben an der Position, ohne E-Mail. Nachrichten ändern keine Abrechnungsversion.
Aktuelle Verwaltung darf Finanzdaten sehen; gesonderte Kassenwartrolle noch nicht
vorhanden. Echte Bankfunktionen serverseitig ausdrücklich gesperrt.

Freigabetext tfb-kiosk-preparation-v1: Vorführbetrieb/keine echte Forderung.
Bisherige v3-Freigaben bleiben für Demo gültig; keine Umdeutung in neue Mandate.
Angekündigter Einzug am 5. aus Deckel/Account/Abrechnung entfernt. Spätere echte
Zahlungsfreigabe separat. Unbelegte lokale Demo-Monatssummen sind kein zentrales
Abrechnungsjournal; die neue Historie basiert ausschließlich auf gespeicherten
Einzelpositionen. Kein automatischer Reset und keine Umstellung alter Daten auf live.

Technische verschlüsselte Vollsicherung umfasst alle neuen Tabellen; unabhängige
Wiederherstellung mit Journal, Gutschriften und Monatsständen geprüft. Inhaltliche
Website-Snapshots sind weiterhin keine vollständige Mitglieder-/Finanzsicherung.
40 Serverprüfungen und Chromium/WebKit: Preiswechsel, Verleiheinheit, Entfernen/
Wiederherstellen, Korrektur, unveränderliche Monatsversionen, persönliches Archiv,
CSV/Beleg, Rückfrage sowie 320/390/834/1440 px bestanden. Worker-Dry-Run bestanden.
Migration zuerst, Worker danach, erneute idempotente Übernahme zum Schließen des
Deploy-Zeitfensters. Service Worker v337. Details RELEASE-v337.md.

Live veröffentlicht: Quellstand 25c12fb, Pages-Lauf 42479337447 erfolgreich,
Worker 2d83e402-b772-4348-bedd-4f34699b7d5f, Service Worker v337.
Vorführdaten lesend abgeglichen: weiterhin 308 Mitglieder, 147 App-Datensätze,
48 ursprüngliche Einzelpositionen. Neues Journal: ebenfalls 48 Positionen mit
16.550 Cent ursprünglichem Gesamtwert, vier bereits bestehende Rücknahmen.
Keine live-Einträge, keine künstlichen Vorführmonatsstände oder Fragen angelegt.
Zweite additive Migration schrieb null Zeilen: keine Doppelübernahme.
Öffentlich ausgelieferte Kiosk-JS/CSS, App, Freigabetext und Cacheversion geprüft.
Keine Live-Testkäufe, Korrekturen, Produktänderungen oder echten Mails ausgelöst.
Benutzerbrowser war nicht als Browser-Verbindung verfügbar; die vollständige
UI-Abnahme erfolgte mit echten lokalen Worker-Fixtures in Chromium/WebKit.
Bestehender Projektordner mit gezieltem Patch aktualisiert; dessen zusätzliche
Index-/Corporate-Einbindungen und sonstige unveröffentlichte Änderungen erhalten.

## Statistik-Neustart und Sicherung der Zähler – 08.11.2026 · v336

Auf ausdrücklichen Nutzerwunsch einmaliger Neustart der gesamten Clubstatistik.
Operator-Datei operations/reset-usage-2026-11-08.sql leert nur usage_nc_ und frühere
usage_-Messdaten inkl. Dedup-/Sessionstatus und setzt simple_enabled_at,
splash_started_at, audience_split_started_at und reset_at auf denselben Zeitpunkt.
Keine Migration und niemals automatisch beim Deployment ausführen. Keine Mitglieder,
Kioskdaten, Chats, CMS-Inhalte oder Partnerzahlen löschen. D1-Time-Travel-Punkt
vor Neustart: 00000123-00000058-0000511d-9bf73bb2c78154a57088a43ea8c5fd00.
Kein privater Datenbankexport. Historische Sicherungen werden nicht gelöscht.
Messbeginn in der Übersicht jetzt mit Berliner Uhrzeit, reset_at im CSV dokumentiert.
Splash/Home starten gemeinsam; direkte Home-Aufrufe, weitere Home-Besuche oder
Abbruch auf der Splash können weiterhin zu unterschiedlichen Aufrufzahlen führen.
Die technische AES-GCM-Datenbanksicherung enthält bereits sämtliche Statistik-
tabellen. Zusätzlich enthalten neue manuelle/tägliche/monatliche/safety-Snapshots
und der aktuelle Website-Download einen konsistenten anonymen Statistikstand in
statistics.tables; ein SQLite-Lesevorgang für die sieben Aggregat-/Metatabellen.
Keine Mitglieds-/Netz-/Session-HMACs oder Ereigniskennungen im Inhaltspaket.
Ältere Sicherungen werden nicht rückwirkend mit aktuellen Zählern beschriftet.
Seitenwiederherstellungen übernehmen ausschließlich Inhalte und setzen Zähler
nicht zurück; komplette Datenbankwiederherstellung bleibt Betreiberaufgabe.
Sicherungshinweis und Download-Bestätigung entsprechend ergänzt. Keine neue
Datenbankstruktur. Kiosk-Abrechnung ausdrücklich für den nächsten Schritt offen.
19 Serverprüfungen inkl. Zählerreset, CMS, Statistik, verschlüsselter Sicherung,
unabhängiger DB-Wiederherstellung und unbeeinflusster Zähler bei Inhalts-Restore
bestanden; Browser-CMS-Test mit ZIP-Export/Import inklusive Statistik bestanden.
Worker-Dry-Run erfolgreich. Service Worker v336. Details RELEASE-v336.md.

Live veröffentlicht: Quellstand 8fa13cc, Pages-Lauf 42476465818 erfolgreich,
Worker 7a6ec5bc-c923-41b4-ab3b-442c683c9e21, Service Worker v336.
Einmaliger Reset am 2026-11-08T11:36:33.765Z = 08.11.2026, 12:36:33 Berlin.
Reset-Bookmark: 00000124-00000006-0000511d-cfaf7d763af4d5175d5e46b67d94fc8b.
Lesende Live-Kontrolle bestätigt alle elf Statistik-/Dedup-Tabellen leer und
sämtliche Startmarken identisch. Vorher/nachher unverändert: 308 Mitglieder,
147 App-Datensätze, 16 CMS-Dokumente. Kein Live-Testaufruf nach dem Nullsetzen.
Öffentliche Dateien für Sicherungshinweis, genaue Startzeit und v336 bestätigt.
Die erste Kontrollabfrage nutzte zu viele UNION-Terme für D1; nach erfolgreichem
Reset nur lesend korrigiert geprüft, den Reset ausdrücklich nicht wiederholt.

## Einheitliche Admin-Leiste auf allen Seiten – 08.11.2026 · v335

Bei eingeblendeten Admin-Werkzeugen steht die Farbwelt-Auswahl immer in der ersten
Zeile. Darunter links beginnend und in fester Reihenfolge: Splash bearbeiten,
Home bearbeiten, Partner verwalten, Mitglieder verwalten, Clubstatistik,
App-Anleitung, Sicherungen. „Home bearbeiten“ ist seitenunabhängig sichtbar und
nutzt die vorhandene direkte Navigation in den Home-Editor. Flex-Umbruch der
Verwaltungsbuttons innerhalb der zweiten und weiterer Zeilen bei kleiner Breite.
Kiosk zeigt die Leiste auch vor der eigenen Lastschriftfreigabe eines Admins.
Seitenbezogene Bearbeitungsfunktionen unten bleiben auf ihrer jeweiligen Seite;
kein zusätzlicher Home-Stift unten in Kiosk/Chat usw. Keine Änderung an Rollen,
Speicherung oder API. Nach Reload bleibt die Admin-Leiste zunächst ausgeblendet.
Bestehender Admin-Test auf realistische lokale Worker-/CMS-Fixtures aktualisiert.
Chromium/WebKit: identische sieben Buttons auf Home, Kiosk, Chat, Aktuell, Sport,
Club und Dating 2.0; 390/834/1440 px, feste zweite Zeile, linksbündiger Beginn,
kein horizontaler Überlauf. Home-Editor von Dating 2.0 aus tatsächlich geöffnet;
Ein-/Ausblenden, Rolle nach Session-Refresh, Reload und gewöhnliches Mitglied
geprüft. Service Worker v335. Details RELEASE-v335.md.

Live veröffentlicht: Quellstand a5df1fa, Pages-Lauf 42475809621 erfolgreich,
Service Worker v335. Öffentlich ausgelieferte app.js, design-preview.css und
sw.js geprüft. Auch der bestehende Projektordner besteht den erweiterten
Admin-Test; dessen bereits angepasste lokale Fixture-Integration bleibt erhalten.

## Splash in der Bereichstabelle und historische Diagrammjahre – 08.11.2026 · v334

Splash steht als erste Zeile in der gemeinsamen Tabelle „Was interessiert die
Besucher?“, kein separater Splash-Block mehr. Eine Summenzeile enthält Gesamt,
Mitglieder und Externe; Mitglieder/Externe jeweils mit Prozentanteil an dieser
Tabellensumme. Die Tabellensumme enthält Splash-Anzeigen, die oberen Kennzahlen
und die kumulierten Jahreskurven bleiben unverändert reine Seitenaufrufe.
Kurzer Tabellenhinweis und Methodentext erklären den unterschiedlichen Umfang.
Hinter 30 Tage / Monate / Jahre erscheinen abgeschlossene Jahre automatisch als
Jahreszahl. Auswahl zeigt Januar bis Dezember genau dieses Jahres. 2026 erscheint
ab 2027, 2027 erst ab 2028. Server lehnt laufende/zukünftige Kalenderjahre als
historischen Diagrammfilter ab. Die oberen Zeitraumfilter bleiben unabhängig.
Keine Änderung an Erfassung, Speicherung oder CSV, keine Datenbankmigration.
12 Statistik-Servertests inkl. Jahreswechsel bestanden; Chromium/WebKit prüfen
Splash als erste Zeile, einzige Tabelle, Summen/Anteile, historische Jahreswahl,
CSV und 320/390/834/1440 px. Worker-Dry-Run erfolgreich. Service Worker v334.
Details RELEASE-v334.md.

Live veröffentlicht: Quellstand 69960d5, Pages-Lauf 42475414949 erfolgreich,
Worker b26b10d0-f74d-4319-9300-acc8d81668c8, Service Worker v334.
Öffentlich ausgelieferte JS-Datei enthält gemeinsame Tabelle/Summenzeile und
automatische historische Diagrammjahre; Cachedatei bestätigt v334.

## Splash und vollständige Statistik-Historie – 08.11.2026 · v333

Splash wird separat als sichtbare Öffnung erfasst, mit Mitglieder-/Externensplit,
nicht als zusätzlicher Seitenaufruf, Besucher oder Besuch. Initiale Anzeige nach
Session-Auflösung, erneute echte Öffnung zählt neu; Neurendern, Hintergrund und
Editor-Vorschau zählen nicht neu. Noch keine rückwirkenden Splash-Zahlen; Start
wird mit dem ersten Kontakt dokumentiert. Dies belegt die Einstiegsseite, nicht
die tatsächliche Sichtbarkeit eines einzelnen Sponsorlogos. Eigene Admins zählen.
Abgeschlossene Jahre erscheinen automatisch mit Jahreszahl (2026 ab 2027, danach
2027 ab 2028 usw.). Kein festes „Vorheriges Jahr“. Balkenverläufe: letzte 30 Tage,
letzte zwölf Monate bis zum aktuellen Monat rechts, sämtliche Jahre chronologisch
mit aktuellem Jahr rechts. Separater kumulierter Mehrjahresvergleich darunter:
Jan–Dez, nur Seitenaufrufe ohne Splash, Reset je Jahr, 2026 erst ab November,
keine zukünftigen Monate/vorgeblichen Daten vor Messbeginn. Monatswertetabelle
für genaue Werte und mobile Lesbarkeit ergänzt.
CSV lädt unabhängig von der Auswahl die gesamte verfügbare Aggregathistorie:
Jahre, Monate, Tage und Seiten inklusive Splash, alte freiwillige Messreihe
explizit separat. Sortierung nach Messreihe, Zeitraum und Bereich. Summen-/Detail-
ebenen klar benannt und dürfen nicht addiert werden. Kein Export von Mitglieder-
IDs, Schlüsseln oder Rohereignissen. Fehlerbehandlung und Berechtigungsprüfung.
Verbindliche Speicherregel ab v333: reine Tages-/Monats-/Jahreszähler bleiben für
die vollständige Historie erhalten, auch Seitenaggregate. Ersetzt die befristeten
Aggregatregeln v331/v332; die temporären HMAC-/Session-/Retry-Kennungen werden
weiterhin wie bisher gelöscht. Keine neue Browserkennung, keine Nutzerprofile.
Besucher und Besuche bleiben getrennt: ein angemeldetes Mitglied pro Zeitraum
ein Besucher, sämtliche Aufrufe zählen; Seiten pro Besuch = Aufrufe / Besuche.
Datenschutzinfo und Methodentext angepasst. Keine Schema-Migration erforderlich.
28 Servertests inkl. Splash, Wiederholungsschutz, Jahreswechsel, vollständigem
CSV und Gast-/Adminrechten bestanden. Chromium/WebKit inkl. 320/390/834/1440 px,
Splash-Einmalzählung, CSV-Inhalt und vollständiger Diagrammoberfläche geprüft;
Worker-Dry-Run erfolgreich. Service Worker v333. Details RELEASE-v333.md.

Live veröffentlicht: Quellstand 05a8c92, Pages-Lauf 42474205709 erfolgreich,
Worker 4ed904c8-3a6c-4f32-a5e4-e56f11b1ed83, Service Worker v333.
Echte Browserprüfung: sichtbare Öffnung der Einstiegsseite aus dem Profil und
anschließender Eintritt nach Home. Ergebnis: Splash 1 / Mitglieder 1 / Externe 0,
Seitenaufrufe separat von 10 auf 11, weiterhin 1 Besucher und 1 Besuch.
Kumulierte Kurve mit Novemberpunkt und dynamische Jahresauswahl sichtbar.
CSV vollständig serverseitig und mit echten Downloads in Chromium/WebKit-Fixtures
geprüft; Live-Download über Browserautomation nicht abschließend verifiziert
(Automationsverbindung abgebrochen). Keine synthetischen Live-Zähler erzeugt.

## Verständliche Statistik mit Jahresansicht – 08.11.2026 · v332

Verbindlicher Nachfolger der Statistikdarstellung v331: Seitenaufrufe, Besucher,
Besuche, Seiten pro Besuch und App-Aufrufe jeweils mit Mitglieder-/Externenanteil.
„Aktive Mitglieder“ und die missverständliche doppelte Zielgruppenkarte entfallen.
Mitglieder sind unterschiedliche verifizierte Konten pro Tag/Monat/Jahr; zehn
Aufrufe desselben Kontos sind ein Besucher. Externe = ohne verifizierte Anmeldung,
auch Mitglieder ohne Login; ihre tägliche Netzschätzung wird für längere Zeiträume
addiert und ausdrücklich als Schätzung gekennzeichnet, keine exakte Personenzahl.
Heute, Dieser Monat, Dieses Jahr, Vorheriges Jahr sowie Monats-/Jahrauswahl.
Diagramm: letzte 30 Tage, Monate des gewählten Jahres oder Jahresverlauf.
Tabelle: Gesamt / Mitglieder / Externe. CSV mit klaren Einheiten und Zeitraum.
Migration 0012 ergänzt vorhandene Zähler und Monats-/Jahres-Seitenaggregate;
keine bisherigen Aufrufe gelöscht. Historisch nicht sicher zuordenbare gemischte
Besuche/App-Aufrufe bleiben ausdrücklich nicht zugeordnet. Keine erfundenen
Werte vor Messbeginn. Aktuelle Monatsmitglieder einmalig für das Jahres-Set
übernommen. Tagesaggregate 400 Tage, Monate fünf Jahre, Jahre zehn Jahre;
Mitglieder-HMAC-Sets nur aktueller Tag/Monat/Jahr, keine Browserkennungen.
25 Serverprüfungen, Chromium/WebKit inkl. 320/390/834/1440 px, CSV, Jahreswechsel
und fehlende Vorjahresdaten bestanden; Worker-Dry-Run erfolgreich. Details:
RELEASE-v332.md. Service Worker v332.

Live veröffentlicht: Quellstand bf1b5ac, Pages-Lauf 42473335424 erfolgreich,
Worker 7da0046a-5ec1-4f9a-9c17-81705c3762ee, Service Worker v332.
Echte angemeldete Browserprüfung: Heute und Jahr zeigen 10 Seitenaufrufe,
1 Besucher (1 Mitglied, 0 Externe), 1 Mitgliedsbesuch, 10 Seiten pro Besuch.
Monatsdiagramm: zwölf Felder; Vorjahr: keine Messdaten und Striche statt Nullen.
Keine künstlichen Live-Ereignisse, Testkonten oder Kommentare erzeugt.

## Automatische Statistik und getrennte Mitglieder-/Gastaufrufe – 08.11.2026 · v331

Neue, verbindliche Festlegung: Statistik-Zustimmungsabfragen und Account-Eintrag
entfernt. Neue Reichweitenzählung automatisch ohne persistente Browserkennungen.
Tägliche serverseitige Besucherschätzung; Monatskarte „Besucher-Tage“, keine
personenbezogene Monatsreichweite vortäuschen. Seitenaufrufe bleiben die Kernzahl.
Eigene Admins werden mitgezählt. DNT/GPC und frühere ausdrückliche Ablehnungen
bleiben respektiert. Reine Datenschutzinformation im Footer, keine neue Abfrage.
Mitglieder-/Gastaufteilung nach verifizierter Anmeldung: Anzahl/Anteil, pro Seite
und CSV. „Ohne Anmeldung“ enthält auch Mitglieder ohne Login. Keine beliebigen
Button-/Chat-/Kiosk-Klicks erfassen. Alte freiwillige Reihe separat archiviert.
Migration 0011 additiv, keine bisherigen Nutzerdaten überschrieben. Details:
RELEASE-v331.md und STATISTIK-DATENMINIMIERUNG-v331.md. 27 Servertests plus
Chromium/WebKit-Prüfungen und Worker-Dry-Run bestanden; Service Worker v331.
Live: d9dafa9, Pages-Lauf 42471923925 erfolgreich, Worker
a2643c7d-1421-40ec-ab71-eb91db8576db. Beginn 08.11.2026, 11:33 Uhr Berlin.
Echt geprüft: 2 automatische Mitgliederaufrufe, keine Statistikabfrage.

## Antworten auf Kommentare – 08.11.2026 · v330

„Antworten“ als erste Kommentaraktion für Mitglieder. Composer und veröffentlichte
Antwort zeigen einen kompakten Zitatbezug; Tipp springt zum Original. Flache Liste
bleibt erhalten. Gespeichert wird nur die Original-ID; ausgeblendete/gelöschte
Quelltexte erscheinen nicht weiter im Zitat. Server prüft selben Beitrag,
Sichtbarkeit und unveränderlichen Bezug. Klingelhinweis auch für Kommentarautoren
unter fremden Beiträgen, vorhandener Lesestatus synchronisiert. Keine E-Mails.
18 Servertests, neue Chromium-/WebKit-Prüfungen und bestehende Kommentarprüfung
bestanden, Worker-Dry-Run erfolgreich. Details RELEASE-v330.md. Keine Migration.
Live: 01c9d17, Pages-Lauf 42470589926 erfolgreich, Worker
1bd4f53e-f079-4aee-8b9e-3a5efc1bef84, Service Worker v330.

## Chat-Kommentare: Abstand zur Linie – 08.11.2026 · v329

Erster Kommentar erhält 14px oberen Innenabstand. Avatar/TFB-Symbol und Name
stehen damit unterhalb der Trennlinie mit derselben Luft wie weitere Kommentare.
Chromium/WebKit bei 320/390/768/1440px visuell und geometrisch geprüft.
Nur CSS und Service-Worker v329; keine Daten-/Backendänderung. RELEASE-v329.md.

## Admin-Aufrufe zählen mit – 08.11.2026 · v328

Explizite Nutzerkorrektur: Admins werden ab jetzt bei normalen Websiteaufrufen
wie alle anderen mitgezählt, auch bei ausgeblendeten Werkzeugen. Frontend,
Worker und Aggregation angepasst, irreführende Ausschlusstexte entfernt.
Statistikfreigabe und übriger Datenschutz unverändert. Keine rückwirkenden Zahlen.
Vier Servertests und Chromium-/WebKit-Prüfungen mit echten Admin-Zählern bestanden.
Details RELEASE-v328.md. Keine Datenmigration, Service Worker v328.
Live geprüft: 2 echte Admin-Aufrufe, 1 Besucher, 1 Besuch, 2 Seiten/Besuch.
Freigabe im aktuellen Nutzerbrowser aktiviert. Quellstand a870aee, Pages-Lauf
42469035486, Worker 4be0e842-0142-4c9d-951a-73237d0ec54c.

## App-Anleitung dauerhaft erreichbar und HD-Bilder – 08.11.2026 · v327

Account-App-Button bleibt jetzt auch im installierten App-Modus sichtbar. Die
unveränderte Apple-/Android-Anleitung ist zusätzlich direkt über „App-Anleitung“
in den Admin-Werkzeugen erreichbar. Alle Zugänge öffnen dieselbe help()-Funktion.
Nur die automatische Installationskarte wird in der installierten App ausgeblendet.
HD-Präsentationsbilder aus der echten Oberfläche (1950px breit) liegen unter
praesentation/app-installation/. Exporttool: tools/export-install-guide.mjs.

Statistik zählt Admins absichtlich nicht; dieser Hinweis steht nun zusätzlich oben
in der Übersicht. Andere Besucher werden nur nach „Statistik erlauben“ gezählt.
Sechs gezielte Tests sowie Chromium-/WebKit-Prüfungen einschließlich direktem
Admin-Aufruf und simuliertem installierten App-Modus bestanden. Details RELEASE-v327.md.
Live: a7c0ba8, Pages-Lauf 42468674037 erfolgreich, Service Worker v327.

## Clubstatistik und App-Einstieg – 08.11.2026 · v326

Neue Admin-Ansicht #clubstatistik mit Heute/Monat, Besucher-Browsern, Besuchen,
Seiten pro Besuch, Aufrufen, unterschiedlichen Mitgliedern, App-Anteil, Tageskurve,
Seitenrangfolge und CSV. Keine rückwirkenden Zahlen; fehlende Vergleichsdaten
werden ausdrücklich benannt. Nur freiwillige Statistikfreigaben: keine IDs oder
Übertragung vor Einwilligung, keine Namen/Mails/IPs/Klickverläufe in Statistikdaten.
Monatliche Zufallskennung, 30-Minuten-Besuche, HMAC-Ableitung pro Tag/Monat,
Widerruf in Footer und Account, DNT/GPC berücksichtigt. Details RELEASE-v326.md.
Partnerstatistik bleibt deaktiviert. Migration 0010 nur neue Statistiktabellen.

Account-App-Button exakt auf Speichern-Inhaltsbreite eingerückt. Mobile Mitglieder
sehen nach Anmeldung die Installationskarte mit Apple-/Android-Anleitung;
ausblendbar, später im Account erreichbar. Im installierten App-Modus ausgeblendet.
38 Servertests bestanden; Chromium-/WebKit-Prüfungen für Statistikfreigabe,
Widerruf, Besuchsgrenzen, Adminschutz, CSV und Mobilbreiten sowie Neuanmeldung,
Profil/Kommentar und Installationshilfe erfolgreich.
Live: Worker 98f5c3de-5367-4ad8-bc3d-15b9b3a485ff, Pages-Lauf 42466162529,
Messbeginn 08.11.2026, 10:12 Uhr Berlin. Echte Admin-Ansicht geprüft.
Finales Frontend 16f3db4 / Pages-Lauf 42466428986 erfolgreich; Direktlink
#clubstatistik nach Reload ohne Splash verifiziert.

## App-Installation: farbiger Profilbutton – 08.11.2026 · v325

Account-Button jetzt Rot/Weiß in der roten Welt und Signature-Blau/Gelb in der
gelben Welt. Apple-/Android-Anleitungen und Erkennung des App-Modus geprüft.
Wichtig: Eine Installation wird beim Start als eigenständige App erkannt, nicht
zuverlässig aus einem normalen Safari-Tab. Dann sind Banner und Profilbutton
absichtlich ausgeblendet. Nur ausgeblendetes Banner: Profilhilfe bleibt verfügbar.
Aktuelle Code-Mail enthält bereits das feste gelb-blaue Logo; Nutzerbild war die
ältere Vorlage. Details und Prüfungen: RELEASE-v325.md.
Live: Quellstand 59763c3, Pages-Lauf 42464428176 erfolgreich, Service Worker v325.

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
