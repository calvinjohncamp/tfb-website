# Mitgliederinfos und vier neu gestaltete PDFs · 10.11.2026

Club neben Clubarchiv neuer Bereich Mitgliederinfos, gleicher Überschriften-/Pilllook,
Untertitel Ordnungen, Spielbetrieb und unser Jugendkonzept. Vier Signature-blaue
Pills Platzordnung / Hausordnung / Regeln Spielbetrieb / Jugendkonzept öffnen
versionierte PDFs im neuen Tab. Ab 741px zwei gleich breite Bereiche nebeneinander,
darunter untereinander. Vorherige Clubreihenfolge und Navigation erhalten;
keine CMS-Schreibzugriffe, keine Backendänderung.

Aktuelle Quellen direkt aus https://www.tfbielstein.de/downloads/ am 10.11.2026:
Platzordnung-TFB.pdf (April 2023), Haus-und-Platzordnung.pdf (April 2023),
Regeln-Spielbetrieb.pdf (April 2023), Jugendkonzept-TfB.pdf (August 2026).
Vier Originale unter docs/quellen/mitgliederinfos, vollständige Textbasis und
Quell-URLs/SHA256 in tools/member-info-content.json. Alle Textinhalte einschließlich
Beträgen, Fristen, Ansprechpartnern, Datumsangaben und ursprünglichen Formulierungen
beibehalten. Nur alte Logos, Wiederholungs-Kopf-/Fußzeilen und typografische
Zeilentrennungen ersetzt; Listen neu nummeriert und Beiträge/Trainingszeiten
übersichtlich als Tabellen gesetzt. Keine rechtlichen oder finanziellen Inhalte
aktualisiert oder stillschweigend korrigiert.

Vier neue PDF-Dateien unter assets/docs/tfb-{platzordnung,hausordnung,
regeln-spielbetrieb,jugendkonzept}.pdf. 1/2/1/7 A4-Hochformatseiten. Neues TFB-Logo
in Blau-Gelb als Vektorgrafik, echte eingebettete Instanzen von DM Sans (Text/fett)
und Bricolage Grotesque (Überschriften), einheitlicher Kopf, gelber Akzent,
Seitenzähler und dezente Linien. Schriftinstanzen besitzen eindeutige interne
Namen, damit Regular/Bold korrekt und unabhängig eingebettet werden.

Reproduzierbarer Builder tools/build-member-info-pdfs.py (ReportLab, fonttools,
svglib, pypdf, pdfplumber, Poppler). Doppelte Textprüfung: gesamter bereinigter
Quelltext gegen strukturierte Textbasis, danach jeder einzelne Absatz in richtiger
Reihenfolge gegen den tatsächlich gesetzten PDF-Text. Alle Prüfungen bestanden;
Summen-/Fristangaben unverändert. Elf fertige Seiten mit Poppler gerendert und
visuell geprüft; keine abgeschnittenen Inhalte oder einzelne Signatur-Folgeseiten.
Kompakte Dateigrößen etwa 35/44/36/85KB. Kopien der vier fertigen PDFs im
Hauptprojekt output/pdf/. Audit output/member-info-qa/text-audit.json lokal.

Chromium und WebKit: 320/390/740/834/1024/1440px in beiden Farbwelten, korrekte
Position rechts/unten, vier blaue Pills mit passenden Dateizielen, application/pdf,
HTTP 200 und bytegleiche Downloadinhalte, kein Seitenüberlauf; bestehende drei
Clubarchiv-Pills und gelbe Anfahrt erhalten. Keine Skriptfehler. Neuer Cache:
tfb-kiosk-mitgliederinfos-20261110-1, alle vier Dokumente im Offline-Shell.
Veröffentlichung wie vom Nutzer gewünscht direkt, Finetuning an der Live-Version.

Live bestätigt: Programmcommit 3cea9f1, Pages-Lauf 42775020788 erfolgreich.
Vier neue PDFs sowie index.html aus dem Veröffentlichungspaket, sw.js, site.js und
club-history.css öffentlich bytegleich. Chromium und WebKit live erfolgreich:
vier korrekte blaue PDF-Pills, alle Downloads HTTP 200/application/pdf, Mitgliederinfos
rechts bei 834/1440px bzw. unter Clubarchiv bei 390px, kein horizontaler Überlauf.
Elf fertige PDF-Seiten visuell geprüft; Quell- und Ausgabeabsatzvergleich vollständig.
Live-Screenshots output/TFB-Mitgliederinfos-live-{chromium,webkit}-{390,834,1440}.png.
Keine produktiven CMS-, Mitglieder- oder Finanzdaten verändert.
