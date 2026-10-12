// TFB – Mitgliederliste aus Excel (.xlsx) oder CSV übernehmen (Admin).
//
// Läuft komplett im Browser, auch offline und unter file:// – ohne Zusatzbibliothek:
// Eine .xlsx-Datei ist ein ZIP-Archiv mit XML; Chrome entpackt es selbst (DecompressionStream).
// Erkannte Spalten: Nr. · Name (Nachname) · Vorname · E-Mail (erste und zweite). Alles andere
// (Handy, m/w …) wird nicht übernommen. Erst Vorschau (neu / geändert / nicht mehr dabei), dann übernehmen.
(function () {
  const ui = () => TFB.ui;
  const esc = (s) => ui().esc(s);

  // ---------- .xlsx lesen ----------
  async function unzip(buf, wanted) {
    const dv = new DataView(buf);
    let eocd = buf.byteLength - 22;
    while (eocd >= 0 && dv.getUint32(eocd, true) !== 0x06054b50) eocd -= 1;
    if (eocd < 0) throw new Error('Die Datei ist keine Excel-Datei (.xlsx).');
    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const out = {};
    for (let i = 0; i < count; i += 1) {
      const method = dv.getUint16(p + 10, true);
      const size = dv.getUint32(p + 20, true);
      const nameLen = dv.getUint16(p + 28, true);
      const extraLen = dv.getUint16(p + 30, true);
      const commentLen = dv.getUint16(p + 32, true);
      const local = dv.getUint32(p + 42, true);
      const name = new TextDecoder().decode(new Uint8Array(buf, p + 46, nameLen));
      p += 46 + nameLen + extraLen + commentLen;
      if (!wanted(name)) continue;
      const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
      let bytes = new Uint8Array(buf, start, size);
      if (method === 8) bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
      out[name] = new TextDecoder().decode(bytes);
    }
    return out;
  }
  const colIndex = (ref) => [...ref.replace(/\d+/g, '')].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
  async function readXlsx(file) {
    const files = await unzip(await file.arrayBuffer(), (n) => n === 'xl/sharedStrings.xml' || /^xl\/worksheets\/sheet\d+\.xml$/.test(n));
    const sheetName = Object.keys(files).filter((n) => n.startsWith('xl/worksheets/')).sort()[0];
    if (!sheetName) throw new Error('In der Excel-Datei wurde keine Tabelle gefunden.');
    const xml = (text) => new DOMParser().parseFromString(text, 'application/xml');
    const strings = files['xl/sharedStrings.xml']
      ? [...xml(files['xl/sharedStrings.xml']).getElementsByTagName('si')].map((si) => [...si.getElementsByTagName('t')].map((t) => t.textContent).join(''))
      : [];
    return [...xml(files[sheetName]).getElementsByTagName('row')].map((row) => {
      const cells = [];
      [...row.getElementsByTagName('c')].forEach((c) => {
        const v = c.getElementsByTagName('v')[0];
        const type = c.getAttribute('t');
        const val = type === 's' ? strings[Number(v && v.textContent)] : type === 'inlineStr' ? [...c.getElementsByTagName('t')].map((t) => t.textContent).join('') : v ? v.textContent : '';
        cells[colIndex(c.getAttribute('r') || 'A')] = val == null ? '' : String(val);
      });
      return Array.from(cells, (x) => x || '');
    });
  }
  // ---------- CSV lesen (Semikolon oder Komma) ----------
  async function readCsv(file) {
    const text = (await file.text()).replace(/^﻿/, '');
    const sep = (text.split('\n')[0].match(/;/g) || []).length >= (text.split('\n')[0].match(/,/g) || []).length ? ';' : ',';
    return text.split(/\r?\n/).filter((l) => l.trim()).map((line) => {
      const out = []; let cur = ''; let q = false;
      for (const ch of line) {
        if (ch === '"') q = !q;
        else if (ch === sep && !q) { out.push(cur); cur = ''; } else cur += ch;
      }
      out.push(cur);
      return out.map((x) => x.trim());
    });
  }
  // ---------- Spalten erkennen ----------
  function toMembers(table) {
    const key = (h) => String(h || '').toLowerCase().replace(/[^a-zäöüß]/g, '');
    const at = table.findIndex((row) => row.some((h) => key(h) === 'vorname'));
    if (at < 0) throw new Error('Keine Spalte „Vorname“ gefunden. Erwartet: Nr., Name, Vorname, E-Mail.');
    const head = table[at].map(key);
    const find = (...names) => head.findIndex((h) => names.includes(h));
    const col = { no: find('nr', 'mitgliedsnummer', 'mitgliedsnr', 'nummer'), last: find('name', 'nachname'), first: find('vorname') };
    const mails = head.map((h, i) => (['email', 'mail', 'emailadresse'].includes(h) ? i : -1)).filter((i) => i >= 0);
    return table.slice(at + 1).map((r) => ({
      memberNo: col.no >= 0 ? r[col.no] : '', lastName: col.last >= 0 ? r[col.last] : '', firstName: r[col.first],
      email: mails[0] != null ? r[mails[0]] : '', email2: mails[1] != null ? r[mails[1]] : '',
    }));
  }

  // ---------- Ablauf: Datei → Vorschau → übernehmen ----------
  async function pick(file) {
    const { openSheet, closeSheet, toast, api } = ui();
    let rows;
    try {
      const table = /\.csv$/i.test(file.name) ? await readCsv(file) : await readXlsx(file);
      rows = toMembers(table);
      const plan = await api.importMembers(rows);
      const names = (list) => (list.length ? `<details><summary>Namen zeigen</summary><p class="small muted">${list.map(esc).join(', ')}</p></details>` : '');
      openSheet(`
        <div class="editor import-preview">
          <h2>Mitgliederliste übernehmen?</h2>
          <p class="small muted">${esc(file.name)} · ${plan.zeilen} Mitglieder gelesen. Übernommen werden nur Nr., Vorname, Name und E-Mail.</p>
          <ul class="import-plan">
            <li><b>${plan.neu.length}</b> neu${names(plan.neu)}</li>
            <li><b>${plan.geaendert.length}</b> geändert${names(plan.geaendert)}</li>
            <li><b>${plan.gleich}</b> unverändert</li>
            <li><b>${plan.weg.length}</b> nicht mehr in der Liste – werden deaktiviert, nicht gelöscht${names(plan.weg)}</li>
            ${plan.beispiele ? `<li><b>${plan.beispiele}</b> erfundene Beispielmitglieder werden ausgeblendet</li>` : ''}
            ${plan.ohneMail ? `<li><b>${plan.ohneMail}</b> ohne E-Mail – einladbar, aber (noch) ohne Anmeldung</li>` : ''}
          </ul>
          <button type="button" class="btn primary block big" data-import-apply>Übernehmen</button>
          <button type="button" class="link center" data-action="close-sheet">Abbrechen</button>
        </div>`);
      document.querySelector('[data-import-apply]').addEventListener('click', async (e) => {
        e.currentTarget.disabled = true;
        try {
          const done = await api.importMembers(rows, { apply: true });
          closeSheet();
          toast(`Übernommen: ${done.zeilen} Mitglieder – jetzt beim Verabreden per Namen findbar`, true);
          ui().renderView();
        } catch (err) { toast(err.message); e.currentTarget.disabled = false; }
      });
    } catch (err) { toast(err.message || 'Die Datei konnte nicht gelesen werden.'); }
  }

  function card() {
    setTimeout(async () => {
      const el = document.querySelector('[data-member-info]');
      if (!el) return;
      const info = await ui().api.memberListInfo();
      el.textContent = info.imported
        ? `${info.imported} Mitglieder aus der Liste${info.at ? `, Stand ${new Date(info.at).toLocaleDateString('de-DE')}` : ''}.`
        : 'Noch keine Liste geladen – bisher gibt es nur erfundene Beispielmitglieder.';
    }, 0);
    return `
      <section class="card admin-card">
        <h2>Mitgliederliste</h2>
        <p class="muted">Excel-Datei (.xlsx) oder CSV mit den Spalten Nr., Name, Vorname, E-Mail. Handy und Geschlecht werden nicht übernommen. Vor dem Übernehmen siehst du, wer neu, geändert oder nicht mehr dabei ist. Danach sind alle beim Verabreden und in Gruppen per Namen findbar.</p>
        <p class="small"><b data-member-info>…</b></p>
        <label class="btn primary">Liste laden<input type="file" accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" data-members-input hidden></label>
      </section>`;
  }

  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-members-input]') || !e.target.files[0]) return;
    const file = e.target.files[0];
    e.target.value = '';
    pick(file);
  });

  TFB.memberImport = { card, readXlsx, toMembers };
})();
