# Abstand oberhalb des ersten Chat-Kommentars – v329

Die generische Regel .comment:first-child entfernt den oberen Innenabstand.
In der mobilen Chat-Ansicht trifft das unmittelbar auf die Trennlinie oberhalb
der Kommentare; dadurch klebten erster Avatar und Name an der Linie.

Die spezifische Regel .chat-replies .comment:first-child setzt 14px Innenabstand,
passend zu den folgenden Kommentaren. Gilt für Foto-Avatare und das Vereinslogo,
ohne Änderung der Inhalte oder Kommentarlogik. Frontend-/Service-Worker v329.

Visuell und über Geometrie geprüft in Chromium und WebKit bei 320/390/768/1440px:
erster Avatar mindestens 14px unterhalb der Linie, kein horizontaler Überlauf.
Keine Backend-, Statistik-, Mitglieder- oder Datenänderung.
