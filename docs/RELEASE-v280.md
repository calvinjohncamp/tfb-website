# Personenabfrage für Chat-Medien v280 – 07.11.2026

Bei Beiträgen mit Bildern oder Videos erscheint die Frage „Sind Personen
erkennbar abgebildet?“ mit neutraler Vorauswahl und den Antworten Nein/Ja.
Nur bei Ja wird die bisherige Einverständnischeckbox eingeblendet und erforderlich.
Bei Nein stehen weder Checkbox noch Einverständnishinweis im Formular; das
Speichern ist ohne diese Bestätigung möglich. Ohne Medien entfällt die gesamte
Abfrage. Dasselbe gilt für Fotos in neuen und bearbeiteten Kommentaren.

Beim Wechsel der Anzeigeart und Umsortieren bleiben die gewählte Antwort und
Bestätigung erhalten. Zusätzliche Medien setzen die Antwort zurück. Der Wechsel
von Ja zu Nein entfernt die Checkbox vollständig; eine spätere Ja-Auswahl
verlangt eine neue Bestätigung. Die Antwort ist eine Abfrage für den jeweiligen
Speichervorgang, wie bisher die Checkbox; keine KI-Analyse oder neue Speicherung
personenbezogener Metadaten. Bestehende Beiträge und Medien bleiben unverändert.

Geprüft: 91 Fachtests, Kommentar-Browsertest (unbeantwortet blockiert,
Ja ohne Einverständnis blockiert, Nein speichert ohne Checkbox, Wechsel Ja/Nein,
Kommentarfotos und Bearbeiten) sowie Karussell-Browsertest (keine Abfrage ohne
Medien, Antwort bleibt beim Darstellungswechsel, Ja mit Bestätigung speichert,
Reload und Großansicht). Nur Frontend mit Service-Worker-Cache v280;
kein Worker-Deployment, keine Datenmigration und kein Live-Testbeitrag.
