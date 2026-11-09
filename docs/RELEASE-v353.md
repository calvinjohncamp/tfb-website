# Release v353

## Einheitliche Mitgliederansicht und Tagesübersicht als JPG · v353 · 09.11.2026

Persönliche Abrechnung war noch durch die alte .view-Regel auf 760px begrenzt.
Nur für die neue gemeinsame Abrechnung diese Begrenzung aufgehoben; Admin- und
Mitgliederrahmen jetzt beide 1120px mit identischer Kalenderbreite und Optik.
Monatsmarkierung auch bei Hover unverändert, Umsatz-Unterstriche mit festen
2px gegen Flex-Schrumpfung abgesichert. Tagesmarkierungen und Schriftgrößen
bei identischem Mitglied/Monat in beiden Ansichten gleich. Keine neue Tabelle
oder Neuberechnung; beide nutzen weiterhin denselben Renderer und Journal.

CSV-Buttons samt Erklärung nur noch in der clubweiten Admin-Abrechnung.
Meine Abrechnungen zeigt auch für einen Admin im eigenen Account keine CSV-
Auswahl. CSV-Aktion zusätzlich im Frontend auf Adminmodus und echte Adminrolle
begrenzt. Eigene Monats-/Tageswerte und andere vorhandene persönliche Funktionen
bleiben; Rücknahmen/Korrekturen, gesicherte Abrechnungen und weitere Monate wurden
inhaltlich nicht umgebaut, Nutzer möchte diese später separat besprechen.

Neuer Button Screenshot als JPG: mit Abstand neben Admin-CSV-Buttons, im
persönlichen Bereich allein. Aktiv für einen ausgewählten einzelnen Tag und ein
Einzelmitglied; Admin mit Alle Mitglieder muss zuerst eine Person wählen.
Mitglied kann nur sich selbst exportieren. Monatsansicht zeigt den Button
zunächst deaktiviert, Tagesauswahl aktiviert ihn. Kein Export einer Vereins-
Tagesliste mit mehreren Personen als vermeintlich persönlicher Screenshot.

JPG enthält Tagesübersicht, Datum, Betrag, Name, Foto/Initialen, chronologische
Positionen und Tagessumme. Rücknahmen/Gutschriften zum jeweiligen Kauf sind
mit ursprünglichem Betrag, Grund, Zeitpunkt und handelnder Person sichtbar,
auch wenn Bildschirmdetails eingeklappt waren. Keine Kalender, Buttons,
CSV-Erklärungen, technischen Buchungsnummern oder Gesprächsnachrichten im Bild.
Das Bild ist als kompakter Datenbeleg gestaltet, keine vollständige Browser-
Screenshotkopie. Normalgröße 1600px breit; dynamische Höhe, für sehr große Tage
adaptive Auflösung statt Abschneiden. Name und Datum im .jpg-Dateinamen.

Lokal im Browser per Canvas/Blob (kiosk-day-image.js), ohne Fremdbibliothek,
Upload, Speicherobjekt auf dem Server oder automatisches Versenden. Kontext,
Person, Daten und Farbwelt werden beim Klick festgehalten; vorhandenes großes
Profilbild über die bestehende geschützte Abfrage, sonst Initialen. Helfer
verweigert gemischte Mitgliedsdaten. Keine Backend-/Datenänderung, Migration
oder Zahlung. Die bestehenden serverseitigen Mitgliedsfilter bleiben wirksam.

Zwei Modellprüfungen: Berliner Tagesgrenzen, chronologische Reihenfolge,
korrigierte Summe, gemischte Mitglieder abweisen, leere Tage ohne fiktive Zeilen.
Chromium/WebKit: echte JPG-Downloads, JPEG-Dateisignatur, Name/Tagessumme und
Korrekturtexte im gezeichneten Bild ohne Bedienelemente, Admin-/Persönlich-
Geometrie 390/834/1440px, Textbegrenzungen und Umsatz-Unterstriche. Separates
Nicht-Admin-Konto mit eigenen Buchungen getestet: kein CSV, keine fremden
Buchungen, aktuelle und vergangene Monatsmarkierungen, eigener Tages-JPG.
Bestehende CSV-/Abrechnungs-/Fotoabläufe weiterhin erfolgreich. Service Worker
v353 lädt das neue Bildmodul vor.

Veröffentlicht: Commit 978b312, Pages-Workflow 42573002722 erfolgreich.
282 öffentliche Webdateien vorbereitet. Live-Billing, Bildmodul und CSS
bytegleich mit dem geprüften Code; Service Worker v353 bestätigt.
