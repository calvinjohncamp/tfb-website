// TFB-Website – Startinhalte für die Vorführversion.
// Jede Seite besteht aus Bausteinen (blocks). Reihenfolge = Anzeige-Reihenfolge.
// Bausteine: feature (Home), post, event, text, image, gallery, teams, people, facts, button.
// Bilder dürfen auch feste Dateien sein ("assets/..."). teams = eigene Inhalte je Mannschaft.
// Bilder: null = gezeichneter Platzhalter (Tennisplatz-Linien); hochgeladene Bilder heißen "img:<id>".
window.TFB = window.TFB || {};

TFB.boardPhotoPreviews = {
  'assets/images/board/sebastian-manz.jpg': 'assets/images/board/sebastian-manz-aufgehellt.png',
  'assets/images/board/marco-hennes.jpg': 'assets/images/board/marco-hennes-aufgehellt.png',
};

// Veröffentlicht auf tfbielstein.de/vorstand-ansprechpartner/, übernommen am 11.10.2026.
TFB.boardSeed = [
  { role: '1. Vorsitzender', name: 'Kai Eichmann', phone: '0163 9757690', email: 'kai.eichmann.tennis@gmail.com', image: 'kai-eichmann.jpg' },
  { role: '1. Geschäftsführer und Pressekontakt', name: 'Sebastian Manz', phone: '0173 5256226', email: 'sebastian.manz@tfbielstein.de', image: 'sebastian-manz.jpg' },
  { role: 'Stellvertretende Geschäftsführerin', name: 'Katja Küpper', phone: '0151 22676915', email: 'katja.kuepper@tfbielstein.de', image: 'katja-kuepper.jpg' },
  { role: 'Kassenwart', name: 'Daniel Pollmann', phone: '0171 2701747', email: 'daniel.pollmann@tfbielstein.de', image: 'daniel-pollmann.jpg' },
  { role: '2. Vorsitzender', name: 'Thomas Heine', phone: '02262 97738', email: 'thomas.heine@tfbielstein.de', image: 'thomas-heine.jpg' },
  { role: 'Sportwart', name: 'Marco Hennes', phone: '0174 3808785', email: 'marco.hennes@tfbielstein.de', image: 'marco-hennes.jpg' },
  { role: 'Jugendwart', name: 'Katharina Pollmann', phone: '0175 4522855', email: 'katha.pollmann@web.de', image: 'katharina-pollmann.jpg' },
].map((p) => ({ ...p, image: `assets/images/board/${p.image}`, publishEmail: true, publishPhone: true }));

TFB.siteSeed = {
  version: 1,
  chatText: {
    title: 'Chat', feedTitle: 'Clubgeflüster', feedIntro: 'Hier schreiben unsere Mitglieder.',
    writeLabel: 'Schreib was', allLabel: 'Alle Beiträge', olderLabel: 'Ältere anzeigen',
    feedEmpty: 'Noch ist es still hier. Schreib den ersten Beitrag!', loginLabel: 'Zum Mitschreiben anmelden',
    overviewKicker: 'Clubgeflüster & Insider News', overviewTitle: 'Alle Beiträge',
    overviewIntro: 'Schnell finden, wer was geschrieben hat.', searchPlaceholder: 'Name oder Stichwort, z. B. Hennef',
    allAreas: 'Alle Bereiche', clubFilter: 'Nur Clubgeflüster', teamFilter: 'Nur Insider News (alle Mannschaften)',
    teamLabel: 'Insider News', periodAll: 'Alle', periodWeek: '7 Tage', periodMonth: '30 Tage',
    photosOnly: 'Nur mit Fotos', overviewEmpty: 'Nichts gefunden – Filter lockern?',
    guestNote: 'Zum Mitschreiben bitte anmelden.', countOne: 'Beitrag', countMany: 'Beiträge',
  },
  teams: {},
  // Einmalige Text-Updates für Geräte, auf denen schon gepflegt wurde: ersetzen nur die
  // genannten Felder (Fotos und Link bleiben). Jedes Update läuft genau einmal.
  updates: [
    { id: 'club-history-2026-10-11', page: 'verein', insertAfter: 'v-koop', insertBlock: { id: 'v-history', type: 'text', title: 'History', text: 'Fünf Jahrzehnte Tennisfreunde Bielstein – Fotos und Geschichten aus unserer Clubgeschichte.' } },
    { id: 'club-padel-rabatt-2026-10-11', page: 'verein', block: 'v-mitglied-btn', set: { note: 'TFB-Mitglieder erhalten 10 Prozent Rabatt auf alle Padel-Buchungen.' } },
    { id: 'home-kiosk-direkt-2026-10-11', page: 'home', block: 'h-kiosk', set: { navigation: 'link', showMore: false } },
    { id: 'home-jubilaeum-album-2026-10-11', page: 'home', block: 'h-50', set: { album: { enabled: true, label: 'Fotos der Veranstaltung', images: [], position: 'right', order: 1, icon: 'camera' } } },
    { id: 'club-vorstand-import-2026-10-11', page: 'verein', block: 'v-vorstand', set: { people: TFB.boardSeed } },
    { id: 'padel-text-2026-10-11', page: 'home', block: 'h-padel',
      set: { kicker: 'Ab Mai 2027 im Freibad Bielstein', title: 'Padel kommt nach Bielstein.',
        subtitle: 'Zwei Outdoor-Courts, 365 Tage im Jahr geöffnet – für alle Tennis- und Padelfreunde.',
        text: 'Padel ist die am schnellsten wachsende Sportart in Deutschland: schnell gelernt, rasant gespielt und fast immer im Doppel. Anfang 2027 bauen die Tennisfreunde Bielstein die ersten beiden Courts, ab Mai wird gespielt.\n\nDas Beste daran: In der Freibad-Saison ist dein Buchungsticket gleichzeitig deine Eintrittskarte ins Freibad.' },
      more: { text: 'Padel boomt, und zwar zu Recht. Gespielt wird auf einem kleinen Feld mit Glaswänden, der Ball darf von der Wand zurückgespielt werden. Das sorgt für lange Ballwechsel, viel Bewegung und noch mehr Spaß. Die Regeln sind in fünf Minuten erklärt. Wer Tennis spielt, fühlt sich sofort zu Hause, und wer noch nie einen Schläger in der Hand hatte, hat nach einer Stunde trotzdem Spaß.\n\n## Zwei Courts im Freibad Bielstein\n\nAnfang 2027 bauen die Tennisfreunde Bielstein die ersten beiden Outdoor-Courts und erweitern damit ihr sportliches Angebot. Ab Mai 2027 geht es los, für Mitglieder und für alle, die Lust auf Padel haben.\n\n## 365 Tage geöffnet\n\nPadel Bielstein ist das ganze Jahr über geöffnet. Während der Freibad-Saison gilt dein Buchungsticket gleichzeitig als Eintrittskarte ins Freibad. Erst ein Match, dann ab ins Becken.\n\n**Hit. Run. Padel-Fun.** Wir freuen uns auf dich!', quote: 'Hit. Run. Padel-Fun.', quoteBy: '' } },
    { id: 'kiosk-foto-auf-unterseite-2026-10-11', page: 'home', block: 'h-kiosk', moveImageToMore: true, more: { original: true } },
    { id: 'club-tiles-entfernen-2026-10-11', page: 'verein', removeBlock: 'v-tiles' },
    { id: 'club-zahlen-vier-2026-10-11', page: 'verein', block: 'v-facts',
      set: { items: [
        { value: '1976', label: 'gegründet' },
        { value: '28', label: 'Mannschaften 2026' },
        { value: '50', label: 'Jahre Tennis in Bielstein' },
        { value: '6', label: 'Außenplätze' },
      ] } },
    { id: 'club-zahlen-fuenf-2026-10-11', page: 'verein', block: 'v-facts',
      fillFacts: 5 },
    { id: 'club-aufnahme-digital-2026-10-11', page: 'verein', block: 'v-mitglied-btn',
      set: { url: '#aufnahme' } },
    { id: 'sport-trainer-2026-10-11', page: 'sport', block: 's-training',
      setWhenText: 'Unser Trainer Leon Kaufmann ist vom Tennisverband Mittelrhein ausgebildet und trainiert Kinder, Jugendliche und Erwachsene – vom ersten Ballwechsel bis zur Turniervorbereitung.\n\nTrainingszeiten und freie Plätze erfahrt ihr direkt bei Leon oder beim Vorstand.',
      set: { title: 'Leon Kaufmann', subtitle: 'Jugend- und Erwachsenentrainer',
        text: 'Ausgebildet als Tennistrainer im Verband (TVM).\n\nAufgrund seiner hohen Spielstärke und Trainererfahrung ist Leon hervorragend für die Entwicklung der Jugend qualifiziert. Fortgeschrittene und Turnierspieler:innen unterstützt er bei der Entwicklung ihrer Schlagtechnik und Spielstrategie.',
        phone: '0176 76731093', email: 'leonkaufmann2002@icloud.com', image: 'assets/images/leon-kaufmann.jpg' } },
    { id: 'sport-schnupper-2026-10-11', page: 'sport', block: 's-schnupper',
      setWhenText: 'An ausgewählten Samstagen bieten wir kostenloses Schnuppertraining an. Jedes Alter ist willkommen, Schläger stellen wir.',
      set: { text: 'Die Tennisfreunde Bielstein bieten an verschiedenen Samstagen ein kostenloses Schnuppertraining an. Tennisinteressierte jeden Alters können erste Tennisschläge unter Anleitung eines professionellen Trainers durchführen.\n\nFalls noch kein eigener Tennisschläger vorhanden ist, stellt der Tennisclub Euch gerne einen Tennisschläger für das Schnuppertraining zur Verfügung.\n\n**Wann:**\nVerschiedene Termine an Samstagen.\nBitte schaut in unseren Kalender, dort sind die Schnuppertrainingstage aufgeführt.' } },
    { id: 'sport-schnupper-kalender-2026-10-11', page: 'sport', block: 's-schnupper-btn',
      set: { label: 'Schnuppertermine im Kalender', url: 'https://www.tfbielstein.de/kalender/' } },
  ],
  pages: {
    // Startseite für alle Besucher: drei große Themen (Beispiele – im Bearbeiten-Modus ersetzen).
    home: {
      title: 'Home',
      intro: '',
      partnerKicker: 'Die Tennisfreunde werden dir präsentiert von',
      blocks: [
        { id: 'h-padel', type: 'feature', layout: 'wide', image: null,
          kicker: 'Ab Mai 2027 im Freibad Bielstein', title: 'Padel kommt nach Bielstein.',
          subtitle: 'Zwei Outdoor-Courts, 365 Tage im Jahr geöffnet – für alle Tennis- und Padelfreunde.',
          text: 'Padel ist die am schnellsten wachsende Sportart in Deutschland: schnell gelernt, rasant gespielt und fast immer im Doppel. Anfang 2027 bauen die Tennisfreunde Bielstein die ersten beiden Courts, ab Mai wird gespielt.\n\nDas Beste daran: In der Freibad-Saison ist dein Buchungsticket gleichzeitig deine Eintrittskarte ins Freibad.',
          link: { url: 'https://padel-bielstein.de', label: 'Mehr zu Padel Bielstein',
            title: 'Padel spielen in Wiehl-Bielstein | Padel Bielstein',
            text: 'Zwei Outdoor-Courts in Wiehl-Bielstein: Padel buchen, Jahresabo sichern, Guthaben verwalten und Mitspieler finden.',
            image: 'assets/home/padel-bielstein-vorschau.jpg' },
          more: {
            text: 'Padel boomt, und zwar zu Recht. Gespielt wird auf einem kleinen Feld mit Glaswänden, der Ball darf von der Wand zurückgespielt werden. Das sorgt für lange Ballwechsel, viel Bewegung und noch mehr Spaß. Die Regeln sind in fünf Minuten erklärt. Wer Tennis spielt, fühlt sich sofort zu Hause, und wer noch nie einen Schläger in der Hand hatte, hat nach einer Stunde trotzdem Spaß.\n\n## Zwei Courts im Freibad Bielstein\n\nAnfang 2027 bauen die Tennisfreunde Bielstein die ersten beiden Outdoor-Courts und erweitern damit ihr sportliches Angebot. Ab Mai 2027 geht es los, für Mitglieder und für alle, die Lust auf Padel haben.\n\n## 365 Tage geöffnet\n\nPadel Bielstein ist das ganze Jahr über geöffnet. Während der Freibad-Saison gilt dein Buchungsticket gleichzeitig als Eintrittskarte ins Freibad. Erst ein Match, dann ab ins Becken.\n\n**Hit. Run. Padel-Fun.** Wir freuen uns auf dich!',
            quote: 'Hit. Run. Padel-Fun.',
            quoteBy: '',
            images: ['ph:padel-court', 'ph:t2', 'ph:t3', 'ph:t5', 'ph:t1'],
          } },
        { id: 'h-kiosk', type: 'feature', layout: 'portrait', image: null,
          kicker: 'Clubleben', title: 'Der Kiosk ist jetzt digital.',
          subtitle: 'Getränk nehmen, antippen, fertig.',
          text: 'Die Strichliste aus Papier hat ausgedient. Wer etwas aus dem Kühlschrank nimmt, tippt es in der App an – abgerechnet wird wie gewohnt einmal im Monat per Lastschrift.\n\nDein Bierdeckel zeigt dir jederzeit, was heute und im laufenden Monat zusammengekommen ist.',
          link: { url: '#kiosk', label: 'Zum Kiosk' },
          more: {
            text: 'Jahrzehntelang hing die Strichliste am Kühlschrank im Clubheim. Sie hat gut funktioniert – solange jeder daran gedacht hat, seinen Strich zu machen, und solange am Monatsende jemand die Zeit hatte, alles abzutippen.\n\nJetzt geht es so: Getränk nehmen, in der App antippen, fertig. Wer eine Runde ausgibt, tippt einfach die Anzahl ein. Ein Fehler? 30 Sekunden lang lässt sich jeder Strich wieder stornieren.\n\n## Wie wird abgerechnet?\n\nWie bisher einmal im Monat über das bestehende SEPA-Lastschriftmandat. Deinen aktuellen Stand siehst du jederzeit auf deinem Bierdeckel.',
            quote: 'Endlich muss am Monatsende niemand mehr Striche zählen.',
            quoteBy: 'Beispielzitat',
            images: [],
          } },
        { id: 'h-50', type: 'feature', layout: 'square', image: null,
          kicker: 'Seit 1976', title: '50 Jahre Tennisfreunde.',
          subtitle: 'Der Name ist Programm.',
          text: 'Seit einem halben Jahrhundert wird in Bielstein mit Begeisterung Tennis gespielt. Wir feiern die Menschen, die den Club getragen haben – und alle, die ihn heute lebendig halten.',
          link: { url: '#club', label: 'Den Club kennenlernen' },
          more: { text: '', quote: '', quoteBy: '', images: [] } },
      ],
    },
    aktuell: {
      title: 'Aktuell',
      intro: 'Neuigkeiten, Termine und Geschichten von der Anlage.',
      partnerKicker: 'Aktuelles wird dir präsentiert von',
      blocks: [
        { id: 'b-termine', type: 'heading', title: 'Nächste Termine' },
        { id: 'e-1', type: 'event', date: '2026-10-17', time: '15:00', title: 'Saisonabschluss mit Kranzrunde', place: 'Tennisanlage, Jahnstraße', text: 'Wir lassen die Sommersaison gemeinsam ausklingen. Der Kiosk ist geöffnet, der erste Kranz geht aufs Haus.' },
        { id: 'e-2', type: 'event', date: '2026-11-07', time: '11:00', title: 'Schnuppertraining in der Halle', place: 'Tennishalle Bielstein', text: 'Kostenlos und für jedes Alter. Schläger stellen wir.' },
        { id: 'e-3', type: 'event', date: '2026-11-21', time: '19:00', title: 'Mitgliederversammlung', place: 'Clubheim', text: '' },
        { id: 'b-news', type: 'heading', title: 'Neuigkeiten' },
        { id: 'p-1', type: 'post', date: '2026-09-28', title: 'Vier Teams auf Platz eins', image: null, text: 'Was für ein Sommer: Herren 55, Damen 30, Damen 55 (SG) und unsere Junioren 15 stehen in ihren Gruppen ganz oben. Glückwunsch an alle Spielerinnen und Spieler – und danke an die Mannschaftsführer für die Organisation.' },
        { id: 'p-2', type: 'post', date: '2026-09-12', title: '50 Jahre Tennisfreunde Bielstein', image: null, text: 'Seit 1976 wird in Bielstein mit Begeisterung Tennis gespielt. Im Jubiläumsjahr feiern wir die Menschen, die den Club getragen haben – und alle, die ihn heute lebendig halten.' },
        { id: 'p-3', type: 'post', date: '2026-08-30', title: 'Neu: der TFB-Kiosk auf dem Handy', image: null, text: 'Getränk nehmen, antippen, fertig. Die digitale Strichliste ersetzt das Papier – abgerechnet wird wie gewohnt einmal im Monat.' },
        { id: 'g-1', type: 'gallery', title: 'Galerie', images: [] },
      ],
    },
    sport: {
      title: 'Sport',
      intro: 'Mannschaften, Training und Nachwuchs.',
      partnerKicker: 'Der Sport wird dir präsentiert von',
      blocks: [
        { id: 's-teams', type: 'teams', title: 'Mannschaften' },
        { id: 's-training', type: 'text', title: 'Training', text: 'Unser Trainer Leon Kaufmann ist vom Tennisverband Mittelrhein ausgebildet und trainiert Kinder, Jugendliche und Erwachsene – vom ersten Ballwechsel bis zur Turniervorbereitung.\n\nTrainingszeiten und freie Plätze erfahrt ihr direkt bei Leon oder beim Vorstand.' },
        { id: 's-schnupper', type: 'text', title: 'Schnuppertraining', text: 'An ausgewählten Samstagen bieten wir kostenloses Schnuppertraining an. Jedes Alter ist willkommen, Schläger stellen wir.' },
        { id: 's-schnupper-btn', type: 'button', label: 'Termine ansehen', url: '#aktuell' },
        { id: 's-jugend', type: 'text', title: 'Jugend', text: 'Tennis soll bei uns vor allem Spaß machen. Jedes Kind entwickelt sich nach seinen Möglichkeiten – mit erfahrenem Trainerteam, Fördertrainings in der Sommersaison und früher Einbindung in die Medenspiele (U10, U12, U15).' },
      ],
    },
    verein: {
      title: 'Club',
      intro: 'Der Name ist Programm: Tennisfreunde.',
      partnerKicker: 'Der Club wird dir präsentiert von',
      blocks: [
        { id: 'v-facts', type: 'facts', items: [
          { value: '1976', label: 'gegründet' },
          { value: '28', label: 'Mannschaften 2026' },
          { value: '50', label: 'Jahre Tennis in Bielstein' },
          { value: '6', label: 'Außenplätze' },
          { value: '–', label: 'Kennzahl' },
        ] },
        { id: 'v-mitglied', type: 'text', title: 'Mitglied werden', text: 'Wir hegen und pflegen unsere Tennisfreundschaften – im Club und darüber hinaus. Neue Mitglieder empfangen wir mit einem Kennenlern-Abend, zwei Vorstandsmitglieder führen euch durch den Club. Von Anfang an helfen wir euch, Anschluss zu finden.' },
        { id: 'v-mitglied-btn', type: 'button', label: 'Zum Anmeldeformular', url: '#aufnahme', note: 'TFB-Mitglieder erhalten 10 Prozent Rabatt auf alle Padel-Buchungen.' },
        { id: 'v-vorstand', type: 'people', title: 'Vorstand', people: TFB.boardSeed },
        { id: 'v-chronik', type: 'text', title: 'Chronik', text: '2026 feiern die Tennisfreunde 50 Jahre Tennis in Bielstein. Wir sind stolz auf die Entwicklung unseres Clubs und schauen dankbar zurück – auf das Engagement aller früheren Vorstände und den Einsatz unserer Mitglieder.' },
        { id: 'v-anfahrt', type: 'text', title: 'Anfahrt', text: 'Tennisfreunde Bielstein e.V.\nJahnstraße, 51674 Wiehl-Bielstein' },
        { id: 'v-anfahrt-btn', type: 'button', label: 'Route planen', url: 'https://maps.google.com/?q=Jahnstra%C3%9Fe+51674+Wiehl+Tennis' },
        { id: 'v-koop', type: 'text', title: 'Kooperationen', text: 'Mit dem Sportpark am See bieten wir unseren Mitgliedern ein vergünstigtes Kraft- und Ausdauertraining als ideale Ergänzung zum Tennis.' },
        { id: 'v-history', type: 'text', title: 'History', text: 'Fünf Jahrzehnte Tennisfreunde Bielstein – Fotos und Geschichten aus unserer Clubgeschichte.' },
      ],
    },
  },
};
