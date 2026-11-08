# Gestaltung der eigenen Reichweitenmessung – Entscheidung 08.11.2026

Zweck: Vereinswebsite betreiben/verbessern, gefragte Inhalte und Reichweite der
öffentlichen und angemeldeten Nutzung in Summen beurteilen. Keine Werbung,
Leistungsbewertung einzelner Mitglieder, Kontaktaufnahme oder Nutzerprofile.

Die zuvor eingesetzten freiwilligen persistenten Browserkennungen werden für neue
Daten abgeschafft. Besucher/Besuche werden nur täglich geschätzt; monatsübergreifende
Wiedererkennung wird aufgegeben. Tagesgebundene HMACs und ein 30-Minuten-Zustand
ermöglichen die grobe Reichweiten-/Intensitätsabschätzung ohne neue Kennung auf dem
Endgerät. Gültige ohnehin nötige Anmeldung ermöglicht die getrennte Summe der
Mitgliederaufrufe. Keine personenbezogenen Seitenfolgen oder Statistik-Kontoliste.
Die kurzlebigen Kennungen sind pseudonym, nicht pauschal als anonym zu bezeichnen.

Erforderlichkeit/Begrenzung: Ohne kurzlebige Entdoppelung könnten lediglich Aufrufe,
keine Besuche geschätzt werden. Für Monatsreichweite externer Personen wird gerade
keine längere Kennung beibehalten. Kein Speichern vollständiger Verbindungsadressen,
kein User-Agent im Merkmal, keine Detail-URLs/Inhalte. Ausschließlich vorhandene
eigene Cloudflare-Infrastruktur; kein neuer Analysedienst. Technische Hosting-
Verbindungsdaten sind von der Statistikablage zu unterscheiden. Maßgebliche
Zählbeschränkungen sind sichtbar, keine Scheinpräzision oder rückwirkende Schätzung.

Betroffeneninteressen: keine Entscheidung oder individuelle Bewertung anhand der
Zahlen; nur begrenzte grobe Summen im geschützten Adminbereich. Transparenz im Footer,
Kontakt für Widerspruch und Rechte, DNT/GPC und frühere ausdrückliche Ablehnungen
bleiben berücksichtigt. Eine Ablehnung wird nicht stillschweigend in eine Kennung
oder Zustimmung umgewandelt. Frühere Einwilligungsdaten bleiben separat archiviert.
Die Oberfläche nennt als Grundlage das berechtigte Interesse nach Art. 6 Abs. 1
lit. f DSGVO. Diese Dokumentation beschreibt die konkrete technische Abwägung,
keine pauschale rechtliche Freigabe sämtlicher denkbarer Analyseverfahren.

Berücksichtigte behördliche Orientierung: [LfDI Baden-Württemberg, FAQ zu Cookies
und Tracking, Abschnitt 3 Reichweitenanalyse](https://www.baden-wuerttemberg.datenschutz.de/faq-zu-cookies-und-tracking-2/).
Die Hinweise unterscheiden zwischen Gerätezugriff und weiterer Datenverarbeitung;
auch ohne Cookies sind Zweck, Datenminimierung, Auftragsverarbeitung und Transparenz
zu berücksichtigen. Die allgemeine Begründung „andere Websites zählen auch“ war
nicht Grundlage der Implementierung.
