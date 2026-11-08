# Gemeinsame Abrechnungshierarchie für Mitglieder und Verwaltung - v338

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

