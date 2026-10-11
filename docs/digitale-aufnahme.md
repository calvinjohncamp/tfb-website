# Digitale Aufnahme

Der Club-Button öffnet ein Formular ohne Anmeldung. In der lokalen HTML-Vorschau
werden keine Antragsdaten gespeichert oder versendet. Der Bestätigungsschritt ist
dort ausdrücklich eine Simulation. Die Demo-Mitgliederverwaltung erhält keine
Antragsdaten. Echte Mitgliedschaften werden nicht automatisch angelegt.

## Fertiger Ablauf

1. Formular mit Mitgliedsdaten, aktiv/passiv, Bankverbindung und Erklärungen, ohne Fotoeinwilligung.
2. Bei Minderjährigen: Sorgeberechtigte Person mit Vertretungserklärung.
3. Server prüft Pflichtfelder, Alter, IBAN, BIC und Textversion.
4. Bestätigungslink an Antragsteller bzw. Sorgeberechtigte. Gehört das Konto einer
   anderen Person, erhält diese einen eigenen Link zur Mandatserteilung.
5. Erst nach allen Bestätigungen erscheint der Antrag als „Zu prüfen“.
6. Benachrichtigung an info@tfbielstein.de, ohne Bankdaten. Der Antragsteller erhält
   eine Zusammenfassung per E-Mail mit gekürzter IBAN.
7. Club bearbeitet den Antrag im separaten, geschützten Posteingang und markiert
   ihn als aufgenommen oder abgelehnt. Diese Markierung verschickt noch keine
   Aufnahmebestätigung und überträgt keine Daten in die Vereinsverwaltung.

Bestätigungslinks laufen nach 48 Stunden ab. Ein bloßes Öffnen des Links bestätigt
nichts (auch nicht durch E-Mail-Linkscanner). Der Bestätigungsklick ist ein POST.
Erklärungen mit Textversion, Texte, angegebene URLs und Bestätigungszeitpunkte
werden zusammen mit dem Antrag aufbewahrt. E-Mail-Bestätigung belegt den Zugriff
auf das Postfach, nicht die amtliche Identität oder das tatsächliche Sorgerecht.

## Lokale Vorschau

Die gewohnte Datei „TFB-Website öffnen.html“ funktioniert weiterhin.
Alternativ mit Python 3.9 oder neuer:

```sh
python3 tfb-kiosk/server/membership_server.py
```

Website: http://127.0.0.1:8787/ ; Vorschau standardmäßig ohne Versand.
Die Vorschau-Datenbank unter /tmp/tfb-membership-preview enthält keine Anträge,
solange live=false bleibt. Tests: aus dem Verzeichnis tfb-kiosk/server mit
`python3 -B -m unittest -v test_membership.py`.

## Voraussetzungen für den Livebetrieb

- Aktuelle Satzung und Beitragsordnung prüfen; digitalen Antrag rechtlich
  freigeben. Kündigungsangaben von Papierformular und Satzung abgleichen.
- Vereinsbank muss das konkrete digitale Verfahren (auch bei abweichenden
  Kontoinhabern) akzeptieren. Vollständigen SEPA-Mandatstext liefern: Gläubiger-ID,
  Vergabe/Mitteilung der Mandatsreferenz, wiederkehrende Zahlungen, Ermächtigung
  und Weisung an die Bank, Erstattungshinweis und Vorabankündigung abstimmen.
- Vollständige Datenschutzhinweise nach Art. 13 DSGVO für diesen Prozess liefern:
  Verantwortlicher, Zwecke, Rechtsgrundlagen, Empfänger/Dienstleister, Fristen,
  Rechte, Beschwerdestelle und gegebenenfalls Drittlandtransfers.
- SMTP-Zugang, Hosting und sichere Verwaltung bereitstellen. Dienstleister und
  Auftragsverarbeitung prüfen. Die Bankfreigabe wird durch Software nicht ersetzt.

`server/membership-settings.example.json` außerhalb des Webverzeichnisses kopieren
und vervollständigen. `TFB_MEMBERSHIP_SETTINGS` bezeichnet diese Konfigurationsdatei.
`live`, `bankApproved`, `legalApproved` erst nach tatsächlicher Freigabe auf true setzen.
`publicUrl` ist die HTTPS-Basisadresse der Website, gegebenenfalls mit Unterpfad.
`contributionsUrl`, `mandateText` und `privacyText` sind Pflichtangaben
für live. Bei Änderungen der Erklärungen `version` erhöhen.

Erforderliche Umgebungsvariablen im Hosting-Geheimnisspeicher:

- `TFB_ADMIN_PASSWORD`: mindestens 20 Zeichen, Benutzername ist `club`.
- `TFB_SMTP_HOST`, `TFB_SMTP_PORT` (Standard 465), `TFB_SMTP_USER`,
  `TFB_SMTP_PASSWORD`, `TFB_SMTP_FROM`: authentifizierter Mailversand mit TLS.
- `TFB_DATA_DIR`: dauerhafter privater Datenpfad außerhalb des Webverzeichnisses.
- Optional `TFB_PORT` (Standard 8787).

Der Dienst bindet nur an 127.0.0.1. Im Hosting als dauerhaften Dienst hinter einem
HTTPS-Reverse-Proxy betreiben. Bei Unterpfaden muss der Proxy den Website-Unterpfad
vor Weiterleitung entfernen. Die API bleibt relativ zum Website-Stamm erreichbar.
Der Browser nutzt api/membership relativ zum Website-Stamm. Website und API müssen
denselben Ursprung und denselben Website-Stamm verwenden.

Proxy nur lokal an den Dienst anbinden. Wenn der Proxy `X-Real-IP` zuverlässig
überschreibt, `TFB_TRUST_PROXY=1` setzen: dann gilt die Begrenzung von 20 öffentlichen
POST-Anfragen pro Stunde je Besucher statt je Proxy. Keine vom Besucher gelieferten
IP-Header ungeprüft durchreichen. Admin-Fehlanmeldungen werden gesondert begrenzt.
Antragsinhalte, Authorization-Header und vollständige E-Mails nicht in Proxylogs
oder Fehlerüberwachung aufnehmen. Bestätigungstokens stehen ausschließlich im
URL-Fragment und werden danach aus der Browseradresse entfernt.

## Geschützter Posteingang und Betrieb

Adresse: /api/membership/admin (über HTTPS). Der separate Passwortschutz ist
unabhängig vom Demo-Admin der Website. Basic-Authentifizierung benötigt HTTPS;
im Browser zum Abmelden das private Fenster schließen. Für mehrere Bearbeiter
oder höheren Schutz kann der Proxy persönliche Konten und MFA vorschalten.

Die SQLite-Datei enthält personenbezogene Daten einschließlich IBAN. Sie wird
mit restriktiven Dateirechten außerhalb des Webverzeichnisses angelegt, ist aber
nicht selbst verschlüsselt. Hosting-Datenträger und Backups verschlüsseln und
Zugriff nur berechtigten Personen erlauben. Kein Datenpfad in Dropbox oder Git.
Die API und der Posteingang werden nicht durch den Service Worker gespeichert.

Unvollständig bestätigte Anträge werden nach 48 Stunden gelöscht; alle übrigen
Anträge standardmäßig nach 90 Tagen ab Eingang (`retentionDays`). Diese Frist ist
ein konfigurierbarer Vorschlag, keine allgemeine gesetzliche Aufbewahrungsfrist.
Der Club muss bestätigte Mandate samt Nachweisen vor Ablauf in die reguläre
Mitgliederverwaltung übernehmen und dort nach den Bank- und gesetzlichen Vorgaben
aufbewahren. Datenschutztexte und Backup-Löschung müssen zu den Fristen passen.

E-Mails liegen bis zum erfolgreichen Versand in einer privaten Versandwarteschlange.
Fehler werden mit wachsendem Abstand erneut versucht. Der Posteingang zeigt die
Anzahl ausstehender E-Mails; im Produktivbetrieb Versandfehler zusätzlich überwachen.
In der Warteschlange stehen vollständige Bestätigungslinks: Backups daher ebenfalls
vertraulich behandeln. Die Token-Tabelle speichert nur Hashwerte. Startet der
Server nicht bei live=true, fehlen Freigaben oder erforderliche Konfigurationen.

Keine echten E-Mails wurden bei Entwicklung oder Tests versendet.

## Profilfotos und Vorstand

Fotoeinwilligungen werden nach der Aufnahme im Profil unter „Foto-Freigaben“
gepflegt. Das optionale Profilfoto ist standardmäßig nur für angemeldete Mitglieder
sichtbar. Eine zusätzliche Freigabe erlaubt die öffentliche Anzeige, etwa beim
Vorstand. Vereinsfotos haben eine gesonderte freiwillige und widerrufbare Erklärung.
Ein neuer Profilbild-Upload nimmt die öffentliche Bildfreigabe zurück.

Bei Minderjährigen bleibt das Profilbild für andere unsichtbar, bis eine geprüfte
Elternzustimmung dokumentiert ist. Der Antrag nennt die sorgeberechtigte Person,
deren E-Mail und die gewünschten Zwecke. Ein Admin kann die tatsächlich vorliegende
Zustimmung unter Verwaltung → Foto-Freigaben dokumentieren oder zurücknehmen.
Diese Vorführversion sendet KEINE Eltern-E-Mails und prüft die Identität nicht;
im Produktivsystem muss die Elternverifikation samt sicherem Nachweis umgesetzt
werden. Die bisherige Selbsterklärung zum Clubgeflüster ersetzt diese Fotozustimmung
nicht. Ein neues Foto benötigt eine neue Zustimmung. Ohne genaues Geburtsdatum
bleibt das gesamte mögliche 18. Lebensjahr vorsorglich zustimmungspflichtig.

Verwaltung → Vorstand bietet Einzelzeilen für Funktion, Name und E-Mail sowie
Hinzufügen, Entfernen und Reihenfolge. Die Suche ist nur für Admins zugänglich,
sucht vollständige E-Mail-Adressen und Namen und liefert bei Familienadressen
mehrere Mitglieder zur ausdrücklichen Auswahl. Verknüpfte Personen werden anhand
der Mitglieds-ID aufgelöst: Name und freigegebenes Profilfoto bleiben aktuell.
Kontakt-E-Mails erscheinen öffentlich nur nach Aktivierung der entsprechenden
Option. Ein Foto wird nur bei öffentlicher Freigabe automatisch übernommen.
Für die Veröffentlichung personenbezogener Vorstandsdaten und Kontaktadressen
muss der Club die erforderliche Rechtsgrundlage und Information sicherstellen.

Diese Mitglieds- und Fotoverwaltung benutzt weiterhin die lokale Demo-Datenschicht.
Sie ist noch nicht mit einer produktiven Vereinsdatenbank verbunden. Die Aufnahme-
API überträgt bestätigte Anträge weiterhin nicht automatisch in die Mitgliederliste.
