# Clubstatistik live und sichtbarer App-Einstieg – v326

Neuer Adminbereich #clubstatistik, erreichbar über die Admin-Werkzeuge. Heute,
Monatsauswahl, CSV, sechs Kennzahlen: Seitenaufrufe, Besucher (Browser), Besuche,
Seiten pro Besuch, unterschiedliche angemeldete Mitglieder, Anteil der Aufrufe
im eigenständigen App-Modus. Tagesverlauf und Rangfolge der Seitenkategorien.
Heute/Monat sind laufende Zeiträume. Fehlende Vergleichszeit wird nicht als null
oder als Wachstum ausgegeben; vor Messbeginn steht „–“. Vormonatsvergleich erst
bei vollständigem Messbeginn für denselben Zeitraum. Keine Beispieldaten live.

Datensparsame Opt-in-Lösung, keine externen Analyticsdienste, kein Fingerprinting.
Vor Freigabe keinerlei Statistikübertragung oder Browserkennung. Gleichwertige
Wahl „Ohne Statistik weiter“ / „Statistik erlauben“, ohne Zugangshürde. Permanente
Wahl/Information über Footer und Account. Widerruf beendet weitere Übertragungen
und entfernt lokale Kennungen. DNT und GPC übersteuern die Freigabe.

Browserkennung zufällig, nur für diesen Kalendermonat gültig; abgelaufene Kennung
wird beim nächsten Aufruf ersetzt. Besuchskennung wechselt nach 30 Minuten ohne
Aktivität; Aktivität wird nur lokal in groben Intervallen notiert. Keine Klicks
oder Aktivitätsereignisse übertragen. Serverseitig ausschließlich mit geheimem,
zweckgebundenem HMAC abgeleitete, nach Tag/Monat getrennte Kennungen. Mitglied
nur aus verifizierter Sitzung abgeleitet, keine frei wählbare Mitgliederkennung
in Statistikpayloads. Gäste als Browser gezählt; Mitglieder geräteübergreifend
separat dedupliziert. Ein Browser kann mehrere Menschen / ein Mensch mehrere
Browser bedeuten. Keine vollständigen URLs, Referrer, Namen, Mails, Inhalte oder
IP-Adressen in Statistikdaten. Bestehendes kurzlebiges IP-Hash-Ratelimit nur zum
Missbrauchsschutz. Cloudflare stellt den bestehenden Serverdienst bereit.

Keine Seitenfolge pro Person gespeichert: Wiederholungsschutz enthält nur HMAC
von Ereignis-ID, Claim und Ablaufzeit (24h). Rohkennungen nie in D1. Deduplizierung
besteht nur für den aktuellen Tag/Monat; Tageswerte 400 Tage, Monatssummen bis zu
14 Monate. Bereinigung bei Erfassung (Kennungen/Ereignisse) und täglich im Cron
(auch Alt-Aggregate). D1.batch und eindeutige Schlüssel verhindern Doppelerfassung
paralleler Wiederholungen. Alle Kennzahlen basieren auf derselben freigegebenen
Grundgesamtheit. Monatsbesucher werden nicht aus Tagesbesuchern summiert.
Besuch über Mitternacht an beiden Tagen, im Monat einmal; Monatswechsel beginnt
neue Kennungen. Keine rückwirkende Hochrechnung und keine individuellen Profile.

Client zählt Seitenwechsel, nicht Daten-Neurendern; Modal-/Splash-Anzeige,
Bearbeitung, tfbPresentation, lokale Vorschau, Admins und erkennbare Bots werden
ausgeschlossen. Eine neue Authentität verwirft ausstehende Ereignisse der alten.
Maximal drei kurzzeitige Wiederholungen im Arbeitsspeicher, keine Offline-Queue.

Account-App-Button hat exakt die Inhaltsbreite des Speichern-Buttons (18px Einzug
pro Seite), behält Blau/Gelb bzw. Rot/Weiß. Neue Mitglieder sehen nach mobiler
Anmeldung oben die Karte „Dein Club. Ein Fingertipp.“; „So geht’s“ öffnet die
passende Apple-/Android-Anleitung. Nach Ausblenden bleibt die Hilfe im Account;
im bereits gestarteten App-Modus sind Karte und Installationsbutton ausgeblendet.
Keine neue automatische Installation und kein App-Store-Zwang.

Migration 0010-club-usage ist ausschließlich additiv. Serverseitiger D1-Time-Travel-
Punkt vor Migration: 00000122-0000028c-0000511d-2d9ece76a4008d93d98b826c3a854854.
Partnerstatistik bleibt ausgeschaltet und getrennt. Keine Mitglieder-, Kiosk-,
Chat- oder CMS-Daten verändert, kein Voll-Datenbankexport.

Validierung: 38 Servertests bestanden. Chromium/WebKit: Freigabe/Widerruf,
keine IDs vor Einwilligung, Besucher-/Besuchsdeduplizierung, kein Zählen bei
Neurendern auch nach Inaktivität, Adminroute, Quotienten, Heute/Monat, CSV,
320/390/834/1440px; Neuanmeldung, Apple/Android, Account-Buttonbreite, Rollen und
Profil/Kommentare geprüft. Worker-Dry-Run bestanden.

Live veröffentlicht am 08.11.2026: Backend-Version
98f5c3de-5367-4ad8-bc3d-15b9b3a485ff, Pages-Lauf 42466162529 erfolgreich,
Quellstand c4c4f63. Messbeginn serverseitig 2026-11-08T09:12:02Z.
Echte Admin-Ansicht im angemeldeten Browser geprüft: alle neuen Kennzahlen
verfügbar, anfangs null Aufrufe/Besucher/Besuche, Durchschnitt ohne Nenner „–“.
Direktlink #clubstatistik wird zusätzlich ohne Splash geöffnet.
