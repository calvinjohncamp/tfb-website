# Gelbe Unterstreichungen in der bestehenden Gestaltung – v303

Die bestehende Typografie, Seitenaufteilung und Hintergrundgestaltung bleiben
erhalten. Nur die gelbe Farbwelt ergänzt diese Regeln:

- Bestehende Signatur-Textmarkierungen in Home, Magazin-Unterseiten und Aktuell
  erscheinen mit normalem Textgewicht und 2 px gelber Unterstreichung. Beide
  bisherigen Verschachtelungen von Fett/Signaturfarbe werden berücksichtigt.
- Home-Themennummern und Initialen wie das große P des Padel-Artikels bleiben
  gelb. Signatur-Zitate wie „Eat. Sleep. Padel. Repeat.“ werden unterstrichen.
- Splash-Überschrift bleibt blau, Einstieg gelb mit blauer Schrift.
- Alle Datumsfelder unter Aktuell: gelber Hintergrund, blaue Schrift. Dasselbe
  gilt für die bisher gelb beschrifteten Datumsmarken im Home-Feed.
- Mitgliedsbeiträge und Clubarchiv: Signature-Blau mit weißer Schrift. Der
  Archivpfeil wird nur in der gelben Farbwelt ausgeblendet; Routenpfeile bleiben.
- Mannschaftsüberschrift neutral ohne Unterstreichung; Platzierung und nuLiga-
  Links behalten ihre bisherige Gestaltung. Chat und Dating bleiben unverändert.

Im Rich-Text-Editor steht „Unterstreichen / hervorheben“ auch in einfachen
Textfeldern zur Verfügung. Das Format wird als {hervorheben}…{/hervorheben}
sicher gespeichert und wieder eingelesen. Die Signaturauswahl für ganze
Überschriften/Zitate heißt in Gelb „Gelb unterstreichen“. Bestehende Inhaltsdaten
werden weder migriert noch überschrieben. Keine Datenbank-/Workeränderung.

Validierung: 24 Home-/Inhaltstests bestanden, einschließlich neuem Test für
Hervorhebungs-Markup und HTML-Escaping. Isolierte Browserprüfung bei 768, 834,
1024 und 390 px: Padel-Texte, Initiale, Zitat, beide Datumsspalten, Clubbuttons,
Schriftfamilien und Editor-Speichern/Wiederöffnen geprüft. Berechnete Stile von
Chat/Dating in Gelb sowie öffentlichen Seiten in Rot stimmen mit dem bisherigen
Stand überein. Öffentliche CMS-Inhalte vorab bei 834 px lesend geprüft: keine
gelbe Textfarbe in Home/Aktuell/Club, Padel-Initiale und Sport-Platzierungen
bleiben gelb. Service-Worker-Cache v303.

Live am 07.11.2026 veröffentlicht: c2f4e39c68899a8b562e7b0046b15ca30ed5f772.
Pages-Lauf: https://github.com/calvinjohncamp/tfb-website/actions/runs/42403099987
Fünf ausgelieferte Programmdateien bytegleich zum geprüften Paket.
Nachweis: .private/release-v303/live-proof.json.
