# History-Gestaltung · 10.11.2026

Nutzer wünscht direkte Veröffentlichung und Finetuning live. Club zeigt nun
Clubarchiv → History → Anfahrt, mit gelbem Zur-History-Button in der bestehenden
Archivbuttonform und blauem Anfahrtsbutton. Darstellung ordnet die bestehenden
Blockkennungen, ohne aktuelle CMS-Inhalte zu überschreiben.

History: drei Hochformatkarten, Reihenfolge 50 Jahre TFB / 25 Jahre TFB /
Bilder aus den Anfangsjahren. Erste Karte nutzt das vorhandene Foto der Männer
mit Eis und die Pills Bericht/Bildergalerie. Chronik öffnet per Bild oder
Zur-Chronik-Pill dieselbe unveränderte PDF; Dateigröße/Format/Seitenzahl entfallen.
Anfangsjahre mit Bilder-ansehen-Pill. Unbeschnittene Originalfotos in ruhigen
Hochformatrahmen; drei Spalten ab 1001 px, darunter untereinander. Pills dürfen
bei Platzmangel umbrechen. Vorhandene Ziele, Fotobetrachter und Inhalte erhalten.

Chromium/WebKit: 320/390/834/1024/1440 px, beide Farbwelten, genaue Clubreihenfolge,
Buttonmaße wie Zum Archiv, Gelb #FFC300 und Blau #001D3D, drei geordnete Karten,
vier Pills, PDF-Ziele für Bild und Pill identisch, keine Dateimetadaten,
kein Seitenüberlauf; 33 Jubiläumsbilder mit Großansicht und Anfangsjahre erreichbar.
Desktop und iPhone visuell geprüft, inklusive gezielter Anfangsjahre-Bildansicht.
Service Worker tfb-kiosk-history-layout-20261110-2, neue CSS/JS-Versions-URLs.

Live bestätigt: Programmcommit cf80f80, GitHub-Pages-Lauf 42768891785 erfolgreich.
index.html aus dem Veröffentlichungspaket, sw.js, site.js und club-history.css
öffentlich bytegleich. Chromium und WebKit live erfolgreich: Clubreihenfolge und
Farben, drei Karten mit Original-CMS-Bildern, vier Pills, Chronik-Link auf Bild und
Pill, Bericht und 33 Jubiläumsbilder erreichbar. Desktop und iPhone ohne Überlauf.
Live-Screenshots: Hauptprojekt output/TFB-History-3-Karten-live-{chromium,webkit}-{390,1440}.png.
Keine produktiven CMS-, Mitglieder- oder Finanzdaten verändert.
