# Installationshilfe dauerhaft erreichbar und HD-Ansichten – v327

Die Account-Schaltfläche zur TFB-App öffnet jetzt auch in einer bereits als App
gestarteten Ansicht die unveränderte Apple-/Android-Anleitung. Nur die automatische
Installationskarte bleibt dort ausgeblendet. Benutzer müssen nicht erneut eine
Installationsaufforderung sehen, können die Anleitung aber jederzeit aufrufen.
Zusätzlich gibt es direkt in den Admin-Werkzeugen „App-Anleitung“. Alle Wege
verwenden dieselbe help()-Funktion und denselben Dialog mit beiden Plattformreitern.
Die angeglichene Breite des Account-Buttons bleibt erhalten.

Statistik: keine Zählweise geändert. Admins sind weiterhin absichtlich ausgeschlossen,
auch mit versteckten Werkzeugen. Das steht nun zusätzlich direkt im sichtbaren
Einleitungstext der Clubstatistik. Freiwillige Freigabe bedeutet: ein Besucher muss
„Statistik erlauben“ wählen, bevor Kennungen erzeugt oder Zählereignisse übertragen
werden. Ohne Freigabe oder als Admin bleibt ein eigener Aufruf ungezählt.

Zwei Präsentations-PNGs unter docs/praesentation/app-installation/ enthalten den
wirklich gerenderten Dialog inklusive Schließen-Knopf, Griff, Typografie und
Plattformauswahl; keine nachgezeichneten Oberflächen. 390px Mobilansicht bei 5-facher
Pixeldichte, sauberer Ausschnitt auf Pixelgrenzen. Apple und Android jeweils 1950px
breit. Keine persönlichen Daten und keine künstlichen Besucher live erzeugt.
Reproduzierbar: node tools/export-install-guide.mjs [Ausgabeverzeichnis].

Prüfung: sechs gezielte Servertests/Installationsverhalten bestanden. Chromium und
WebKit: Mitglied nach Anmeldung, beide Plattformen, identischer Dialog über direkte
Admin-Schaltfläche, Account-Hilfe im simulierten installierten Modus, keine automatische
Installationskarte in diesem Modus; Profil-/Kommentar-/Mitgliederprüfungen weiter
bestanden. Beide HD-PNGs visuell kontrolliert. Frontend-Service-Worker v327.
Backend/Migration unverändert.
