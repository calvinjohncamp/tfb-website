# Gelb-Blau als Standard, blaue App-Symbole, ruhigere News – v305

Neue Besuche ohne gespeicherte Farbauswahl starten in Gelb-Blau. Eine bewusst
gewählte rote Variante bleibt gespeichert und weiterhin auswählbar.
App-Symbole (180/192/512, maskierbar), PNG-Favicon und alle sechs ICO-Größen
tragen nun Signature-Blau #001D3D. Form, quadratischer heller Hintergrund und
Abstände bleiben erhalten. Der bestehende Build liest Blau aus dem Marken-CSS.
Manifest, Apple-Touch-Icon und Favicon nutzen v305 gegen alte Browsercaches.
Service-Worker-Cache v305.

Die drei aktuell hervorgehobenen News-Texte wurden über den regulären Editor
im zentralen CMS bereinigt: Jugend-Clubmeisterschaften, 50 Jahre TFB und
Juniorinnen U18. Wortlaut, Absatzstruktur, Daten und Bilder bleiben erhalten;
der Editor normalisierte ein älteres Einzelbild in die entsprechende Bilderliste.
Vergleich der öffentlichen Dokumente vor/nach Änderung: ausschließlich die drei
Textfelder und diese gleichwertige Bilddarstellung geändert. CMS-Revision 63→66.
Vorher wurde ein benannter wiederherstellbarer Stand angelegt:
„Vor Aktuell-Bereinigung und blauem App-Symbol · 07.11.2026“.

Automatische Medien-Themenzeilen und Unterzeilen unter Aktuell bleiben ebenfalls
neutral, in beiden Farbwelten. Die ausgeschriebenen Datumszeilen behalten ihren
bisherigen Akzent, ebenso die unveränderten Datumsfelder. Explizite zukünftige
Textmarkierungen sind im Rich-Text-Editor unverändert möglich. Es gibt keine
pauschale Unterdrückung von Markierungen auf der Seite.

Validierung: 24 Inhaltstests; vorhandener kompletter Gestaltungstest inklusive
Farbwechsel, Admin-Welten und Splash-Vorschau; neuer WebKit-Test für Erstbesuch,
gespeicherte rote/gelbe Farbauswahl und neue Icon-Referenzen bestanden.
Öffentliche Vorschau bei 834 px: bereinigte Artikel in beiden Farbwelten,
Datumsmarkierung und Datumsfelder geprüft. Alle PNGs deckend, alte Abmessungen
und exakte Signaturfarbe bestätigt; sechs ICO-Größen geprüft. CMS-Nachweise
liegen privat unter .private/release-v305/.
