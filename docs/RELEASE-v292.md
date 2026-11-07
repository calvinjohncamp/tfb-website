# Home-Editoren nach Bereich und eindeutiges Clubarchiv – v292

Die Home-Seitenbearbeitung behält allgemeine Look-/Menüeinstellungen oben und
Werkzeuge direkt am jeweiligen Inhalt. Normale Themen öffnen ausschließlich
Startseite und Unterseite dieses Themas. Die frühere Themenleiste mit Nummern,
Plus und automatischem Speichern beim Themenwechsel entfällt vollständig.
Karussells, Galerien und Collagen verwenden weiterhin ihren jeweiligen Editor.
Eine bereits mit einem Thema verknüpfte Fotokollage hat einen eigenen Button
„Fotokollage bearbeiten“ und ein separates Formular. Dort gibt es keinen
Wechsel zu anderen Themen, keine Start-/Unterseitenfelder und keine Aktion,
die versehentlich das gesamte Thema löschen könnte. Die Veröffentlichung der
Fotokollage lässt sich weiterhin in diesem Formular deaktivieren. Inhalte
werden explizit mit Speichern gesichert; Fertig beendet die Home-Bearbeitung.

Das Clubarchiv fasst Home-/Aktuell-Kopien desselben Karussells zu einem Eintrag
zusammen. Bestehende Kopien werden über Quell- und erhaltene Beitrags-IDs in
der Mediensammlung erkannt. Neue Kopien erhalten zusätzlich eine dauerhafte
articleId, auch beim erneuten Kopieren oder Zurückverschieben. Der Quellartikel
bleibt beim Kopieren unverändert. Aktuell ist bei mehreren Platzierungen die
bevorzugte Archivdarstellung. Frühere Archiv-URLs bleiben als Aliase erreichbar.
Unabhängige Artikel mit zufällig gleichen Bildern bleiben getrennt.
Home/Aktuell-Inhalte werden weder gelöscht noch zusammengelegt oder umsortiert.

Validierung: 36 Unit-Tests zu Home, Transfer und Archiv-Identität; Browsercheck
für globale Home-Einstellungen, getrennte Themen-/Unterseiten-/Fotokollagen-,
Galerie-, Collagen- und Karussell-Editoren sowie unabhängiges Speichern und Fertig.
Bestehende Transfer-/Archivlink- und Home-Medien-Browserprüfungen erfolgreich.
Pages-Build: 268 Webdateien. Kein Backend-Deployment oder Live-CMS-Commit nötig.
