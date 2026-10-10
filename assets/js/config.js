// TFB-Kiosk – zentrale Einstellungen.
// Alles, was später zwischen Test- und Vereinsbetrieb wechselt, steht hier.
window.TFB = window.TFB || {};

TFB.config = {
  clubName: 'Tennisfreunde Bielstein',
  clubShort: 'TFB',
  appName: 'TFB-Kiosk',

  // 'demo' = alle Daten bleiben auf diesem Gerät (bis Supabase verfügbar ist).
  backend: 'demo',

  // Werbung für die Padel-Buchungs-App des Vereins (eigener Menüpunkt).
  padelUrl: 'https://padel-bielstein.de',

  // Öffentliche Adresse nach der Veröffentlichung – für Einladungslinks in WhatsApp.
  publicUrl: 'https://kiosk.joern-kaemper.de',

  // Zusatzfunktionen, einzeln abschaltbar. treffen = Menüpunkt „Verabreden“ (Vorführung, assets/js/meet.js).
  features: { treffen: true },

  timeZone: 'Europe/Berlin',
  tallyDays: 7,          // Strichliste zeigt immer die letzten 7 Tage
  undoSeconds: 30,       // so lange lässt sich ein Strich stornieren
  maxQuantity: 12,       // größte Runde in einem Schritt
  debitDayOfMonth: 5,    // Lastschrift-Einzug für den Vormonat

  // Version der Einwilligung. Bei Textänderung hochzählen, dann stimmen alle neu zu.
  consentVersion: 'tfb-kiosk-v1',
  consentPoints: [
    'Ich nutze den TFB-Kiosk statt der Papier-Strichliste.',
    'Meine Striche werden am Monatsende zusammengerechnet und vom Verein über mein bestehendes SEPA-Lastschriftmandat eingezogen.',
    'Wie bisher auf der Strichliste sehen angemeldete Mitglieder, wer in den letzten 7 Tagen etwas genommen hat – nur Name und Anzahl der Striche, keine Beträge.',
    'Meine Monatsabrechnungen sehe nur ich und der Kassenwart.',
  ],
};
