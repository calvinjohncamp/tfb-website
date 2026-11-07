# TFB-Splash: an Fensterhöhe angepasste Abstände – v288, 07.11.2026

Bei 1920 × 880 war die echte TFB-Splash-Seite 950px hoch; 70px Überlauf ließ
den Premium-Partner unten herausrutschen. Für Desktop-Landschaft zwischen
561 und 950px Höhe werden obere/untere Außenabstände und vertikale Zwischenräume
flexibel verdichtet. Bei 880px bleiben rund 37px Luft über dem Logo; Partner-
Unterkante bei 854px. Texte, Farben und Partner-Tiles/Logogrößen bleiben erhalten.

Unter 876px Desktop-Höhe werden zusätzlich Logo/Headline maßvoll angepasst,
Beschreibung etwas breiter gesetzt und der Einstieg kompakter. Große Fenster,
Tablet-Portrait, Smartphone und sehr flaches Landscape behalten ihren bisherigen
Ablauf. Scrollen bleibt bei besonders kleinen Fenstern oder längerem Inhalt
möglich; nichts wird abgeschnitten oder per Skalierung unleserlich gemacht.
Keine Änderung an der Padel-App oder an redaktionellen Einstellungen.

Geprüft mit den tatsächlichen öffentlichen Texten und Partnern: 1920×880,
1440×900/821/850/875/876/780, 1366×720 und 1440×1050 komplett sichtbar, oberer
Abstand mindestens32px und mindestens24px unter dem Partnerbereich. Zusätzlich
1280×660, Mobil 390×844, Tablet 768×1024 und Landscape 844×390 vermessen.
Bestehender Splash-Browsertest in Chromium und WebKit grün (Erstbesuch,
mehrfache Reloads, interner Wechsel, Kiosk-/Login-Abgrenzung und Direktlink).
Frontend-Cache v288, nur CSS-Anpassung. Kein CMS-/Worker-Schreibzugriff und
kein Quellarchiv-Upload.
