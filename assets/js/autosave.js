// TFB – Automatische Sicherung in einen Ordner (z. B. in der Dropbox).
//
// Die Demo speichert alles im Browser. Löscht jemand die Browserdaten, wäre es weg. Darum schreibt die
// App – einmal einen Ordner gewählt – selbstständig die Datei „TFB-Sicherung-automatisch.json“ dorthin:
// höchstens einmal pro Minute und nur, wenn sich etwas geändert hat, zusätzlich beim Verlassen der Seite.
// Gleiches Format wie „Inhalte sichern“; wiederherstellen mit „Sicherung laden“.
// Technik: File System Access API von Chrome; der gewählte Ordner wird im Browser gemerkt.
(function () {
  const ui = () => TFB.ui;
  const FILE = 'TFB-Sicherung-automatisch.json';
  const supported = 'showDirectoryPicker' in window;
  let dir = null;
  let lastSig = '';
  let lastAt = null;
  let paused = false;
  let inFlight = null;
  let lastError = '';

  // Ordner-Merkzettel in einer eigenen kleinen IndexedDB
  const kv = (mode, fn) => new Promise((resolve, reject) => {
    const req = indexedDB.open('tfb_autosave', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const q = fn(req.result.transaction('kv', mode).objectStore('kv'));
      q.onsuccess = () => resolve(q.result);
      q.onerror = () => reject(q.error);
    };
  });

  // Schneller Änderungs-Check: die drei Speicherstände (Fotos ändern sich nie ohne sie).
  const signature = () => ['tfb_kiosk_demo_v1', 'tfb_kiosk_look_v3', 'tfb_meet_demo_v2'].map(k => localStorage.getItem(k) || '').concat(TFB.imageRevision || 0).join('\u0000');
  async function snapshot() {
    const data = await ui().api.exportAll();
    data.extra = {};
    ['tfb_kiosk_look_v3', 'tfb_meet_demo_v2'].forEach(k => { data.extra[k] = localStorage.getItem(k); });
    return JSON.stringify(data);
  }
  async function perform(force) {
    // While Fokus owns the active data, its embedded app performs the backup.
    if (document.body?.classList?.contains('tfb-focus-active')) return;
    const target = dir;
    const member = ui()?.state.member;
    if (!target || !member || !(member.isAdmin || member.adminHidden)) return;
    if ((await target.queryPermission({ mode: 'readwrite' })) !== 'granted') { paused = true; lastError = ''; refresh(); return false; }
    paused = false;
    const sig = signature();
    if (!force && sig === lastSig) return;
    // Do not even open the destination until every photo has been read and validated.
    const contents = await snapshot();
    const file = await target.getFileHandle(FILE, { create: true });
    const out = await file.createWritable();
    try { await out.write(contents); await out.close(); }
    catch (err) { try { await out.abort(); } catch (_) {} throw err; }
    lastSig = sig;
    lastAt = new Date();
    lastError = '';
    refresh();
    return true;
  }
  function run(force = false) {
    if (inFlight) return inFlight;
    inFlight = perform(force).catch(err => {
      const message = err.message || 'Sicherung konnte nicht abgeschlossen werden.';
      if (lastError !== message) ui()?.toast('Automatische Sicherung fehlgeschlagen: ' + message);
      lastError = message;
      refresh();
      throw err;
    }).finally(() => { inFlight = null; });
    return inFlight;
  }
  const quiet = () => run().catch(() => {}); // Failure remains visible in status().

  async function choose() {
    try {
      if (inFlight) { try { await inFlight; } catch (_) {} }
      dir = await window.showDirectoryPicker({ id: 'tfb-sicherung', mode: 'readwrite' });
      lastSig = ''; lastAt = null; lastError = '';
      await kv('readwrite', (s) => s.put(dir, 'dir'));
      if (await run(true)) ui().toast(`Automatische Sicherung an – „${FILE}“ liegt im Ordner „${dir.name}“`, true);
    } catch (err) { if (err && err.name !== 'AbortError') ui().toast(err.message); }
    refresh();
  }
  async function resume() {
    try {
      if ((await dir.requestPermission({ mode: 'readwrite' })) === 'granted' && await run(true)) ui().toast('Automatische Sicherung läuft wieder', true);
    } catch (err) { ui().toast(err.message); }
    refresh();
  }
  async function stop() {
    if (inFlight) { try { await inFlight; } catch (_) {} }
    dir = null; lastSig = ''; lastAt = null; lastError = '';
    try { await kv('readwrite', (s) => s.delete('dir')); } catch (_) {}
    ui().toast('Automatische Sicherung ausgeschaltet', true);
    refresh();
  }

  function status() {
    if (!supported) return '<p class="small muted">Dieser Browser kann nicht automatisch in einen Ordner sichern – bitte Chrome verwenden oder regelmäßig „Inhalte sichern“.</p>';
    if (!dir) return `<p class="small muted">Aus. Einmal einen Ordner wählen (am besten in der Dropbox) – danach sichert die App selbstständig, sobald sich etwas ändert.</p>
      <button type="button" class="btn" data-autosave="choose">Ordner wählen</button>`;
    if (lastError) return `<p class="small form-error"><b>Sicherung fehlgeschlagen</b> – ${ui().esc(lastError)} Die letzte erfolgreich geschriebene Sicherung wurde nicht ersetzt.</p>
      <button type="button" class="btn primary" data-autosave="resume">Erneut versuchen</button>
      <button type="button" class="link" data-autosave="stop">Ausschalten</button>`;
    if (paused) return `<p class="small"><b>Pausiert</b> – Chrome fragt nach dem Neustart einmal nach der Erlaubnis für „${ui().esc(dir.name)}“.</p>
      <button type="button" class="btn primary" data-autosave="resume">Sicherung fortsetzen</button>`;
    return `<p class="small"><b>An</b> · Ordner „${ui().esc(dir.name)}“ · ${lastAt ? `zuletzt ${lastAt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr` : 'wartet auf die erste Änderung'}</p>
      <button type="button" class="link" data-autosave="stop">Ausschalten</button>`;
  }
  function refresh() {
    const el = document.querySelector('[data-autosave-box]');
    if (el) el.innerHTML = status();
  }
  const box = () => `<div class="autosave-box" data-autosave-box>${status()}</div>`;

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-autosave]');
    if (!b) return;
    ({ choose, resume, stop })[b.dataset.autosave]();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) quiet(); });
  setInterval(quiet, 60000);

  // Beim Start: gemerkten Ordner holen; Browser bitten, die Daten nicht von selbst zu räumen.
  if (supported) kv('readonly', (s) => s.get('dir')).then((h) => { dir = h || null; refresh(); setTimeout(quiet, 5000); }).catch(() => {});
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (_) {}

  TFB.autosave = { box, run };
})();
