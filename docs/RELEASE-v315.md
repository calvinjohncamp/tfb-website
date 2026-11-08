# Clubarchiv ohne Termine und dunkle Datumsfelder – v315

Die Save-the-Date-Spalte samt mobilen Tabs und Nachladefunktion entfällt aus
dem Clubarchiv. Archivbeiträge stehen einspaltig bei maximal 900px. Bestehende
historische Termin-Detailadressen bleiben lesbar, mit Überschrift Vergangener
Termin. Aktuelle Termine bleiben ausschließlich unter Aktuell sichtbar.

Der Defibrillator-Beitrag war im frisch geladenen Live-Archiv an dritter Stelle
vorhanden. Ein veralteter Client-HTTP-Cache ist eine plausible Erklärung für die
abweichende Sicht des Nutzers, auf dessen Gerät nicht direkt nachweisbar.
Archiv-JSON wird nun mit neuem Versionsparameter und cache:no-cache geladen;
der Service Worker revalidiert es zusätzlich ausdrücklich. Archivdaten bleiben
unverändert erhalten. Service Worker v315.

Die gelbe Welt verwendet unter Aktuell dunkle Datumsfelder (#171717) mit weißer
Beschriftung und voller Deckkraft wie die rote Welt und die bisherigen Archiv-
Datumsfelder. Betrifft News und Save the Date, keine Änderungen der Termindaten.

Prüfung: Chromium und WebKit mit echten Live-CMS-Inhalten und lokalem Release,
ausschließlich lesende Requests. Simulierter alter unversionierter Archivbestand
enthält den Defibrillator nicht; versionierter Abruf zeigt Bericht und Bild.
Archiv ohne Tabs/Terminspalte; einspaltig und ohne Überlauf bei 390/834/1440px.
Aktuell in beiden Welten mit dunklen Feldern und weißen Texten, mobile Termin-
Umschaltung weiterhin funktionsfähig. Keine Browserfehler. Zwei Identitätstests,
JS-Syntax, Diffcheck und Paket aus 274 öffentlichen Dateien erfolgreich.
