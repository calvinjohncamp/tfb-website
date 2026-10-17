# TFB · Mitgliedsanmeldung: erster E-Mail-Entwurf

Stand 17.10.2026. Designentwurf auf Nutzerauftrag, **nicht an den Versand angeschlossen**.
Seit v222 ist ausschließlich das Präsentationsmuster als PDF auf der Club-Seite
verlinkt. Keine echten Nachrichten, Empfänger oder Tokens verwendet.

## Verbindliche Richtung

Nur eine automatische E-Mail-Art für die Anmeldung als Vereinsmitglied vorsehen:
Eingang des Mitgliedsantrags mit einem Bestätigungsbutton. Keine zusätzliche
Willkommensmail, Antragszusammenfassung nach Bestätigung, Statusmail oder
Vorstands-Benachrichtigung per E-Mail. Alle sonstigen Benachrichtigungen gehören
in die App-Klingel, einschließlich Verwaltungshinweisen. Keine automatische
Übernahme der Padel-Mailstrecken, Sponsorrotation oder Mail-Sichtbarkeitsmessung.

Der Entwurf ist für die **Beantragung der Vereinsmitgliedschaft**, nicht für ein
gewöhnliches App-Login. Er bestätigt weder die Aufnahme noch einen fertigen
App-Zugang. Nach Bestätigung prüft der Vorstand; weitere Meldungen später in der
App, sobald der Zugang freigeschaltet ist. Nur ein primärer Aktionsbutton.

## Padel-Referenzen tatsächlich gelesen

Im benachbarten Projekt `01 Software/`:

- `Edge-Functions/stripe-webhook/index.ts`: `bookingMailHtml`, Buchungsbestätigung,
  Markenkopf, ruhige Inhaltskarte, Datenübersicht, Abschluss und Partnerbereich.
- `Edge-Functions/manage-meetup/index.ts`: Einladungs-/Terminmails und `MAIL_THEME`.
- `config/supabase-auth-mail-templates.mjs`: einheitliche Hülle und klarer
  Bestätigungsbutton für die Authentifizierung.

Familienähnlichkeit durch Aufbau, Logo-Präsenz, großzügige Abstände, eine klar
gegliederte Karte und einen deutlichen Aktionsbutton. TFB verwendet seine eigene
kühle Website-Palette: #EFEFEF Hintergrund, #F9F9F9 Karte, #171717 Text/Logo,
#686868 Sekundärtext, #D7D7D7 Linien, #C4553A Signalrot. Vollständiges TFB-Logo
**mit Ball und Vereinsnamen**, unabhängig vom reduzierten App-Symbol ohne Ball.
Keine Sponsorleiste und keine zusätzlichen Werbe-/Aktionsmodule.

## Entwurf und Vorschauen

- [Präsentations-PDF](../assets/docs/tfb-mitgliedsanmeldung-muster.pdf)
- [Desktopvorschau](entwuerfe/mitgliedsanmeldung-desktop.png)
- [Mobilvorschau](entwuerfe/mitgliedsanmeldung-mobil.png)
- [HTML-Vorschau](entwuerfe/mitgliedsanmeldung-email.html)
- [HTML-Vorlage](../server/templates/mitgliedsanmeldung.html)
- [Textalternative](../server/templates/mitgliedsanmeldung.txt)

Betreffvorschlag: **Bitte bestätige deinen Mitgliedsantrag – Tennisfreunde Bielstein**.
Preheader: Antrag angekommen, Bestätigung und spätere Benachrichtigungen in der App.
Fiktives Beispiel Anna Beispiel, aktive Mitgliedschaft; keine Bank-/Zahlungsdaten
in der Mail. Personalisierungsfelder müssen beim späteren Versand HTML-escaped
und Aktionslinks ausschließlich vom eigenen Backend erzeugt/validiert werden.
Vorschaulink ist lediglich ein lokaler Anker, kein verwendbarer Bestätigungslink.

Schriften: Bricolage Grotesque/DM Sans aus den vorhandenen Website-Dateien,
Arial als Fallback. Logo ist ein gerendertes PNG mit Originalproportionen statt
einer CSS-Maske in der Mail. Tabellenlayout, zentrale Inline-Stile, mobiler Umbruch,
Bild-Alternativtext und separate Textfassung sind vorbereitet. Die spätere
Versandfassung soll das Logo als eingebetteten CID-Anhang erhalten; reale
Mailbox-/Outlook-/iOS-Mail-/Dark-Mode-Prüfung steht vor einem Versand noch aus.
Keine Trackingpixel, Öffnungszählung oder versteckte Fremdressourcen hinzugefügt.

Lokale Neuerzeugung: `node tools/build-membership-mail-preview.mjs`.
Browserprüfung für 320/390/620/860 px, lokale Schriften und Arial-Fallback ohne
horizontalen Überlauf; beide Screenshots visuell geprüft. Das Werkzeug enthält
keine Mailversandfunktion und erzeugt ausschließlich lokale Entwurfsdateien.

## Bestehender Aufnahme-Prototyp und spätere Anbindung

`server/membership_server.py` enthält bisher mehrere Versandereignisse: erster
Bestätigungslink, gegebenenfalls separater Mandatslink, Nachricht an den Verein
und Zusammenfassung an den Antragsteller. Diese vorhandene Prototyp-Logik ist
**noch nicht auf die neue Ein-Mail-Vorgabe umgestellt**. Keine Änderung daran im
Designauftrag. Die neue HTML-/Textvorlage ist noch nicht in `deliver()` eingebunden.

Vor einer Aktivierung muss der Ablauf gesondert angepasst werden: Antragsstatus
und berechtigte Admin-Hinweise in die zentrale App-Klingel integrieren, parallele
Folgemails entfernen, Wiederholungsversand gegen Duplikate absichern. Sorgeberechtigte
und abweichende Kontoinhaber sind im bisherigen Prototyp eigene Empfänger; diese
Sonderfälle müssen mit der Ein-Mail-Vorgabe abgestimmt werden, ohne zusätzliche
Mailarten stillschweigend zu aktivieren. Die 48-Stunden-Frist des Entwurfs entspricht
dem bestehenden Prototyp. Bisherige Aufnahme-/Bank-/Betriebsfreigaben bleiben
unverändert; Designfreigabe allein aktiviert weder Aufnahme noch Versand.

## Präsentationslink auf der Club-Seite – v222

Im Bereich Mitglied werden rechts außen neben den bestehenden Aktionen:
„E-Mail-Bestätigung (PDF)“. Öffnet die einseitige A4-Musteransicht in einem neuen
Tab. Auf kleinen Geräten darf die Aktionszeile umbrechen. PDF mit Logo/Schriften,
fiktiven Daten und kleinem Musterhinweis; der Bestätigungsbutton im PDF besitzt
keinen echten Aktionslink. Versand, Aufnahmeantrag und Klingel-Anbindung bleiben
unverändert. PDF wird als öffentliche Website-Datei und offline bereitgestellt.
Neuerzeugung nach Vorschauänderungen: erst `node tools/build-membership-mail-preview.mjs`,
dann `node tools/build-membership-mail-pdf.mjs`. Letzteres erzeugt die PDF in
output/pdf und kopiert sie in assets/docs für die Veröffentlichung.
