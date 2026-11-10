# Mehrwortsuche, rote Mitglieder-PDFs und Anfahrt · 10.11.2026

Gemeldeter Fall: Artikel 8453 heißt „TF Bielstein Cup 2025“. Das bisherige
Suchfeld konnte „TFB“ nicht der ausgeschriebenen Clubbezeichnung zuordnen.
Gemeinsame Suchlogik in assets/js/search.js erkennt TFB / TF Bielstein /
Tennisfreunde Bielstein. Mehrere Begriffe müssen alle vorkommen, unabhängig von
Reihenfolge, Großschreibung, Akzenten, Bindestrichen und Zwischenräumen.
Headline-Treffer werden priorisiert; ohne Suchbegriff gilt die bisherige Ordnung.

Clubarchiv baut Index immer auch aus aktueller Überschrift und HTML-Text statt
nur aus einem möglicherweise veralteten Importindex. Home/Aktuell: zusätzlich
Detailtext, Abschnitte, Zitate und Mediensammlungen im Index. Chat-/Insiderübersicht
nutzt ebenfalls Mehrwortsuche über Autor, Headline und Text. Lokale Partner-,
Mitgliederverwaltungs- und Produktsuche nutzen dieselbe Vergleichsfunktion.
Bestehende Themen-/Jahr-/Foto-/Zeitraumfilter bleiben erhalten. PDF-Inhalte werden
nicht zusätzlich volltextindexiert. Authentifizierte serverseitige Personensuche
und Backend unverändert; keine Mitglieder-/Inhalts-/Finanzdaten mutiert.

Vier zusätzliche Mitglieder-PDFs in Signature-Rot/Schwarz mit passendem Vektorlogo.
Alle Texte und Seitenzahlen 1/2/1/7 identisch zur jeweiligen bisherigen Ausgabe,
alle elf roten Seiten mit Poppler gerendert und visuell geprüft. Blaue/gelbe PDFs
bytegenau unverändert. Builder unterstützt --theme red, rote Dateien haben Suffix
-rot. Links wechseln bei Farbweltwechsel sofort, ohne Neuladen. Alle acht Varianten
offline vorgesehen. Keine Textänderung in den Dokumenten.

Neuer Mitgliederinfos-Untertitel: „Einige PDFs mit Zusatzinfos.“ Route planen
wieder links unter der Adresse, 22px Abstand entsprechend Clubarchiv-Pills.
Kompakte Breite, 14px Ecken und Farbwelt bleiben erhalten.

Validierung: node --test tools/test-search.mjs erfolgreich (Mehrwortsuche,
Aliasregression, Headline-Ranking und sämtliche importierten Headlines).
Chromium und WebKit lokal: echter Cup-Artikel über vier Suchvarianten auffindbar,
Link öffnet den Bericht, Filter/Leersuche/Reset; Home/Aktuell-Übersichten;
320/390/834/1440px, beide Farbwelten, alle PDF-Downloads, sofortiger Themenwechsel,
Position und Größe Route planen, kein Seitenüberlauf oder Skriptfehler.
Zusätzliche lokale Inhaltsfixtures bestätigen Suche in vollständigem Detailtext,
Abschnitten sowie Chat-Headline/Text/Autor. Keine öffentlichen Testdaten angelegt.
