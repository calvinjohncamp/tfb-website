// TFB-Website – Startinhalte für die Vorführversion.
// Jede Seite besteht aus Bausteinen (blocks). Reihenfolge = Anzeige-Reihenfolge.
// Bausteine: hero, post, event, text, image, gallery, teams, people, facts, button.
// Bilder: null = gezeichneter Platzhalter (Tennisplatz-Linien); hochgeladene Bilder heißen "img:<id>".
window.TFB = window.TFB || {};

TFB.siteSeed = {
  version: 1,
  pages: {
    aktuell: {
      title: 'News',
      intro: 'Neuigkeiten, Termine und Geschichten von der Anlage.',
      partnerKicker: 'Die News werden dir präsentiert von',
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
      title: 'Verein',
      intro: 'Der Name ist Programm: Tennisfreunde.',
      partnerKicker: 'Der Verein wird dir präsentiert von',
      blocks: [
        { id: 'v-facts', type: 'facts', items: [
          { value: '1976', label: 'gegründet' },
          { value: '28', label: 'Mannschaften 2026' },
          { value: '50', label: 'Jahre Tennis in Bielstein' },
        ] },
        { id: 'v-mitglied', type: 'text', title: 'Mitglied werden', text: 'Wir hegen und pflegen unsere Tennisfreundschaften – im Club und darüber hinaus. Neue Mitglieder empfangen wir mit einem Kennenlern-Abend, zwei Vorstandsmitglieder führen euch durch den Club. Von Anfang an helfen wir euch, Anschluss zu finden.' },
        { id: 'v-mitglied-btn', type: 'button', label: 'Zum Anmeldeformular', url: 'https://www.tfbielstein.de/anmeldeformular/' },
        { id: 'v-vorstand', type: 'people', title: 'Vorstand', people: [
          { role: 'Vorsitz', name: 'Name folgt' },
          { role: 'Stellvertretung', name: 'Name folgt' },
          { role: 'Kasse', name: 'Name folgt' },
          { role: 'Sport', name: 'Name folgt' },
          { role: 'Jugend', name: 'Name folgt' },
        ] },
        { id: 'v-chronik', type: 'text', title: 'Chronik', text: '2026 feiern die Tennisfreunde 50 Jahre Tennis in Bielstein. Wir sind stolz auf die Entwicklung unseres Clubs und schauen dankbar zurück – auf das Engagement aller früheren Vorstände und den Einsatz unserer Mitglieder.' },
        { id: 'v-anfahrt', type: 'text', title: 'Anfahrt', text: 'Tennisfreunde Bielstein e.V.\nJahnstraße, 51674 Wiehl-Bielstein' },
        { id: 'v-anfahrt-btn', type: 'button', label: 'Route planen', url: 'https://maps.google.com/?q=Jahnstra%C3%9Fe+51674+Wiehl+Tennis' },
        { id: 'v-koop', type: 'text', title: 'Kooperationen', text: 'Mit dem Sportpark am See bieten wir unseren Mitgliedern ein vergünstigtes Kraft- und Ausdauertraining als ideale Ergänzung zum Tennis.' },
      ],
    },
  },
};
