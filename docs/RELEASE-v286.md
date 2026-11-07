# Aktuell: direkte Redaktion und Medienkarussells – v286, 07.11.2026

Aktuell bietet angemeldeten Admins direkt unter dem Seitenkopf Termin hinzufügen,
News hinzufügen, Karussell hinzufügen und – sofern vorhanden – Home-Karussell
übernehmen. Keine allgemeine Bausteinauswahl für diese Standardaufgaben.
Weitere Inhalte bleibt als eingeklappter Zugang zu bestehenden Zusatzformaten.
Der Bearbeitungsmodus behält News und Save the Date in ihren normalen Spalten;
Datum bestimmt die Reihenfolge statt wirkungsloser Pfeile. News erscheinen
absteigend, Termine aufsteigend nach Datum; gleiche Daten bleiben stabil,
neue Einträge werden innerhalb desselben Tages zuerst eingesetzt. Bestehende
Inhalte werden nur zur Darstellung sortiert und nicht pauschal umgeschrieben.

Neue News-Karussells haben ein einzelnes Formular für Themenzeile, Titel,
Untertitel, Text, Datum, Bilder, Format und optionalen Instagram-Link. Unterstützt
4:5, 9:16, 16:9 und 5:4, Originaldateien bis 10 MB je Bild. Übersichts- und
Detailtexte verwenden bei neuen Karussells dieselben Felder. Von Home übernommene
Sammlungen behalten getrennte Übersichts-/Beitragsfelder und alle Einträge.

Die News-Karte nutzt denselben Kartenumlauf mit Überblendung und Pause wie Home,
mit an die Spaltenhöhe angepassten Karten. Bilder und Button öffnen die große
Unterseite mit manuellem Karussell, Miniaturen, Vollbild und den drei Textzeilen.
Bestehende Home-Gestaltung bleibt erhalten. Öffentliche Besucher sehen keine
neuen Admin-Steuerungen.

Home → Aktuell ist ein ausdrücklicher Admin-Schritt mit Veröffentlichungsdatum.
Ein gemeinsamer revisionsgeschützter CMS-Commit aktualisiert beide Seiten.
Bildreferenzen, Reihenfolge, Texte, Instagram-Links und IDs bleiben erhalten;
keine erneuten Uploads. Konflikte lassen beide Seiten unverändert. Alte Home-
Links öffnen die verschobene Sammlung weiterhin. Das Clubarchiv enthält alle
Bildseiten, durchsucht die Beitragstexte und erhält bestehende Archiv-Adressen.

Prüfungen: 33 Fachtests inklusive echter Worker-CMS-Transaktion (beide Seiten oder
keine bei Konflikt); eigener Browserablauf für News/Termine/Karussell, Bild-Upload,
Detailbearbeitung, Vollbild, Fehlerfall, verlustlosen Umzug, Reload, alte Links,
Übersicht, Clubarchiv und mobile Verwaltung. Home-Medien-, Galerie- und
Übersichts-Browsertests erfolgreich. Rein lesende Gestaltungsvorschau mit den
echten öffentlichen Motiven. Kein Live-Beitrag wurde für die Prüfung verschoben.

Frontend-Cache v286; neues newsroom.js für Sortierung und Umzugsplan. Keine
Worker-/Schemaänderung, kein Import oder CMS-Schreibzugriff bei Veröffentlichung.
Private Quellarchiv-Übertragung bleibt ohne neue Zustimmung ausgesetzt (v283).
