# Release v343

## Chronologische Buchungen, transparente Korrekturen und Kalenderakzente · v343 · 08.11.2026

Buchungen in der Anzeige, im CSV-Export und in der Darstellung gespeicherter
Belege nach echtem Zeitstempel aufsteigend (älteste zuerst, gleiche Zeitstempel
stabil nach Buchungs-ID). Tagesgruppen dadurch ebenfalls chronologisch.
Datenbankabfragen und unveränderliche Originalbelege werden nicht umgeschrieben.

Rücknahmen sind serverseitig auf 30 Sekunden begrenzt. Journal hält Original
plus Gegenbuchung mit actor_id/source/reason/created_at fest; Admin-Korrekturen
haben ebenfalls Akteur und Begründung. Nun zusätzlich eine personenbezogene
Einzelliste im Bereich Rücknahmen und Korrekturen: Art, Produkt, gebuchte Person,
erfassende Person, Zeitpunkt in Berlin, Betrag und Grund. Bei importierten
Vorführ-Rücknahmen war der ursprüngliche Zeitpunkt nicht gespeichert; die
vorhandene Kennzeichnung dazu bleibt unverändert.

Für vergangene Monate lautet der Summenhinweis Monatssumme / vorgesehener
Abbuchungsbetrag. Bewusst kein tatsächlicher Einzugsstatus: Zahlungsweg und
Rhythmus sind noch offen, alle Daten bleiben Vorführung. Laufender Monat bleibt
Monatssumme. Einzelmitglied-/Clubwerte folgen denselben korrigierten Aggregaten.

Admin-Leiste: Außenabstand Weltwahl zu Verwaltungsbuttons 12px gegenüber 4px
zwischen den Verwaltungsbuttons (dreifach). Kalenderkörper: Monatsnamen und
Positionshinweise schwarz, Monatsbeträge Signature-Gelb/Rot. Umsatz-Tage mit
Signature-Zahl und Unterstrich markiert; nur positive Nettoumsätze markiert.
Auswahl weiterhin als dezenter Rahmen erkennbar. Rote Kalenderköpfe: große
Jahres-/Monatszahl und Beschriftungen schwarz, Summen weiß. Gelbe Welt behält
lesbare Akzente auf Signature-Blau.

Chromium/WebKit: frühere Buchung vor späterer, Korrekturliste mit handelnder
Person, historische Monatsbeschriftung, neue Farbwerte und Umsatz-Unterstriche,
Abstand, Rollen und bestehende Abrechnungsabläufe geprüft. Neun Serverprüfungen
zu Journal, 30-Sekunden-Rücknahme, Historie, Berechtigungen, Summen und
Wiederherstellung erfolgreich. Keine Backendänderung, Migration, Datenlöschung,
Bankaktion oder Mail. Service Worker v343.

