// TFB-Kiosk – zentrale Einstellungen.
// Alles, was später zwischen Test- und Vereinsbetrieb wechselt, steht hier.
window.TFB = window.TFB || {};

TFB.config = {
  clubName: 'Tennisfreunde Bielstein',
  clubShort: 'TFB',
  appName: 'TF Bielstein',

  // Kiosk, Chat und Verabredungen bleiben lokal; Mitgliederzugang separat darunter.
  backend: 'demo',

  // Enable only after server setup, owner login and denied-access tests pass.
  memberDirectory: {
    enabled: true,
    url: 'https://tfb-api.calvinjohncamp.workers.dev',
    hosts: ['joern-kaemper.de', 'www.joern-kaemper.de', 'calvinjohncamp.github.io'],
  },

  // Werbung für die Padel-Buchungs-App des Vereins (eigener Menüpunkt).
  padelUrl: 'https://padel-bielstein.de',

  // Öffentliche Adresse nach der Veröffentlichung – für Einladungslinks in WhatsApp.
  publicUrl: 'https://joern-kaemper.de',

  // Zusatzfunktionen, einzeln abschaltbar. treffen = Menüpunkt „Verabreden“ (Vorführung, assets/js/meet.js).
  features: { treffen: true },

  timeZone: 'Europe/Berlin',
  tallyDays: 7,          // Strichliste zeigt immer die letzten 7 Tage
  undoSeconds: 30,       // so lange lässt sich ein Strich stornieren
  maxQuantity: 12,       // größte Runde in einem Schritt
  debitDayOfMonth: 5,    // Lastschrift-Einzug für den Vormonat

  // Version der Einwilligung. Bei Textänderung hochzählen, dann stimmen alle neu zu.
  consentVersion: 'tfb-kiosk-v3',
  consentPoints: [
    'Ich nutze den TFB-Kiosk statt der Papier-Strichliste.',
    'Meine Käufe werden am Monatsende addiert und vom Verein über mein bestehendes SEPA-Lastschriftmandat eingezogen.',
    'Die bekannte Strichliste bleibt auch in unserer neuen App erhalten – angemeldete Mitglieder sehen wie bisher, was in den vergangenen 7 Tagen im Kiosk passiert ist – es erscheinen dort nur die Namen und Anzahl der Striche, keine Beträge.',
    'Meine Monatsabrechnungen sehe nur ich und der Kassenwart.',
  ],
};
