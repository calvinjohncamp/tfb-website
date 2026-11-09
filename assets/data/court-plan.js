// Fixed summer schedule from the board's "Platzbelegung Sommer 27.xlsx".
// Each hour column describes an hour; merged cells extend through their last hour.
// Confirmed by Jörn: season 2027; Tuesday Johann ends at 21:00 (not 22:00).
(function () {
  const rows = [
    // weekday (Monday=0), court, start, end, label, type, source cell
    [0, 1, 17, 19, 'Herren 60', 'team', 'G6'],
    [0, 2, 17, 19, 'Herren 60', 'team', 'G7'],
    [0, 4, 17, 20, 'Clubtrainer', 'coach', 'G9'],
    [0, 6, 16, 21, 'Jugendtraining', 'youth', 'F10'],
    [1, 1, 18, 20, 'Herren 50.1', 'team', 'H13'],
    [1, 2, 18, 20, 'Herren 50.2', 'team', 'H14'],
    [1, 3, 17, 19, 'Damen 55', 'team', 'G15'],
    [1, 4, 17, 19, 'Damen 55', 'team', 'G16'],
    [1, 6, 14, 20, 'Jugendtraining', 'youth', 'D17'],
    [1, 7, 17, 21, 'Tr. Johann', 'coach', 'G18'],
    [2, 1, 18, 20, 'Herren 55', 'team', 'H20'],
    [2, 2, 18, 20, 'Herren 55', 'team', 'H21'],
    [2, 3, 18, 20, 'Damen 30', 'team', 'H22'],
    [2, 4, 17, 18, 'Clubtrainer', 'coach', 'G23'],
    [2, 4, 18, 20, 'Damen 40', 'team', 'H23'],
    [2, 6, 15, 20, 'Jugendtraining', 'youth', 'E24'],
    [2, 7, 15, 20, 'Jugendtraining', 'youth', 'E25'],
    [3, 1, 16, 18, 'Herren 60', 'team', 'F27'],
    [3, 1, 18, 20, 'Herren 40.1', 'team', 'H27'],
    [3, 2, 16, 18, 'Herren 60', 'team', 'F28'],
    [3, 2, 18, 20, 'Herren 40.2', 'team', 'H28'],
    [3, 3, 16, 18, 'Herren 65', 'team', 'F29'],
    [3, 3, 18, 20, 'Herren 40.3', 'team', 'H29'],
    [3, 4, 18, 20, 'Herren 30', 'team', 'H30'],
    [3, 6, 14, 20, 'Jugendtraining', 'youth', 'D31'],
    [4, 1, 18, 20, 'Herren', 'team', 'H34'],
    [4, 2, 18, 20, 'Herren', 'team', 'H35'],
    [4, 4, 14, 21, 'Tr. Johann', 'coach', 'D37'],
    [4, 6, 14, 19, 'Jugendtraining', 'youth', 'D38'],
  ];
  TFB.courtPlanData = Object.freeze({
    season: 'Sommer 2027', courts: Object.freeze([1, 2, 3, 4, 6, 7]),
    days: Object.freeze(['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag']),
    entries: Object.freeze(rows.map(([day, court, start, end, label, kind, cell]) => Object.freeze({ day, court, start, end, label, kind, cell }))),
  });
})();
