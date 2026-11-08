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
          <p class="small muted">${esc(file.name)} · ${plan.zeilen} Mitglieder gelesen. Übernommen werden Mitgliedsnummer, Vorname, Nachname und E-Mail-Adressen.</p>
          <ul class="import-plan">
            <li><b>${plan.neu.length}</b> neu${names(plan.neu)}</li>
            <li><b>${plan.geaendert.length}</b> geändert${names(plan.geaendert)}</li>
            <li><b>${plan.gleich}</b> unverändert</li>
            <li><b>${plan.weg.length}</b> nicht mehr in der Liste – werden deaktiviert, nicht gelöscht${names(plan.weg)}</li>
            ${plan.beispiele ? `<li><b>${plan.beispiele}</b> erfundene Beispielmitglieder werden ausgeblendet</li>` : ''}
            ${plan.ohneMail ? `<li><b>${plan.ohneMail}</b> ohne E-Mail – vor der automatischen Freischaltung die Vereinsliste ergänzen</li>` : ''}
          </ul>
          <button type="button" class="btn primary block big" data-import-apply>Übernehmen</button>
          <button type="button" class="link center" data-action="close-sheet">Abbrechen</button>
        </div>`);
      document.querySelector('[data-import-apply]').addEventListener('click', async (e) => {
        if (!ui().state.member?.isAdmin) return;
        const button = e.currentTarget;
        button.disabled = true;
        try {
          const done = await api.importMembers(rows, { apply: true });
          closeSheet();
          toast(`Übernommen: ${done.zeilen} Mitglieder – jetzt beim Verabreden per Namen findbar`, true);
          ui().renderView();
        } catch (err) { toast(err.message); button.disabled = false; }
      });
    } catch (err) { toast(err.message || 'Die Datei konnte nicht gelesen werden.'); }
  }

  let snapshot=null,activeTab='overview';
  const when = value => value ? new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)) : 'Noch kein Login erfasst';
  function memberRows() {
    const box=document.querySelector('[data-member-results]');if(!box||!snapshot)return;
    const query=(document.querySelector('[data-member-query]')?.value||'').trim().toLocaleLowerCase('de');
    const filter=document.querySelector('[data-member-filter]')?.value||'all';
    const recent=document.querySelector('[data-member-sort]')?.value==='recent';
    const rows=snapshot.members.filter(m=>`${m.firstName} ${m.lastName} ${m.email} ${m.email2} ${m.memberNo}`.toLocaleLowerCase('de').includes(query))
      .filter(m=>filter==='all'||(filter==='online'&&m.online)||(filter==='activated'&&m.activated)||(filter==='pending'&&!m.activated)||(filter==='noemail'&&!m.email&&!m.email2));
    if(recent)rows.sort((a,b)=>(b.lastSeenAt||0)-(a.lastSeenAt||0));
    document.querySelector('[data-member-count]').textContent=`${rows.length} von ${snapshot.members.length} Mitgliedern`;
    box.innerHTML=rows.length ? rows.map(m=>`<article class="memberhub-person"><span class="memberhub-avatar" aria-hidden="true">${esc((m.firstName[0]||'')+(m.lastName[0]||''))}</span><div class="memberhub-person-main"><strong>${esc(m.firstName)} ${esc(m.lastName)}${m.isAdmin?' <small class="memberhub-admin">Admin</small>':''}</strong><span>${esc(m.email||m.email2||'Keine E-Mail hinterlegt')} · Nr. ${esc(m.memberNo||'–')}</span><small>Letzte Anmeldung: ${esc(when(m.lastLoginAt))}</small>${m.lastSeenAt?`<small>Zuletzt aktiv: ${esc(when(m.lastSeenAt))}</small>`:''}</div><span class="memberhub-status ${m.online?'online':m.activated?'ready':'pending'}">${m.online?'Aktiv':m.activated?'Zugang bereit':'Noch nicht gestartet'}</span></article>`).join('') : '<p class="memberhub-empty">Dazu haben wir gerade keine Mitglieder gefunden.</p>';
  }
  function hubBody(){
    if(activeTab==='import')return `<div class="memberhub-import"><span class="memberhub-eyebrow">Vereinsliste</span><h3>Alle Mitglieder. Ein guter Stand.</h3><p>Lade die aktuelle vollständige Excel-Datei (.xlsx) oder CSV. Erst die Vorschau, dann entscheidest du, was übernommen wird.</p><div class="memberhub-import-drop"><b>Mitgliederliste auswählen</b><span>Mitgliedsnummer · Vorname · Nachname · E-Mail</span><label class="btn primary">Liste laden<input type="file" accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" data-members-input hidden></label></div><p class="small muted">Fehlende Mitglieder werden deaktiviert, nicht gelöscht. Änderungen an der Anmelde-E-Mail setzen den bisherigen Zugang zurück. Umsätze und Profilfotos bleiben dem Mitgliedskonto zugeordnet.</p></div>`;
    const n=snapshot.summary;
    return `<div class="memberhub-stats">${[['all',n.total,'Mitglieder'],['online',n.online,'Aktiv · letzte 5 Min.'],['activated',n.activated,'Zugang eingerichtet'],['pending',n.total-n.activated,'Noch nicht gestartet']].map(([filter,num,label])=>`<button type="button" data-member-stat="${filter}"><b>${num}</b><span>${label}</span></button>`).join('')}</div><p class="memberhub-explain">„Aktiv“ bedeutet eine Aktion oder Rückmeldung in den letzten fünf Minuten. Geschlossene Apps verschwinden daher mit kurzer Verzögerung. Anmeldungen werden ab jetzt erfasst.</p><div class="memberhub-filters"><label><span class="memberhub-filter-label">Mitglieder suchen</span><input type="search" data-member-query placeholder="Name, E-Mail oder Mitgliedsnummer"></label><label><span class="memberhub-filter-label">Status</span><select data-member-filter><option value="all">Alle Mitglieder</option><option value="online">Gerade aktiv</option><option value="activated">Zugang eingerichtet</option><option value="pending">Noch nicht gestartet</option><option value="noemail">Ohne E-Mail (${n.withoutEmail})</option></select></label><label><span class="memberhub-filter-label">Sortierung</span><select data-member-sort><option value="name">Nach Namen</option><option value="recent">Zuletzt aktiv zuerst</option></select></label></div><div class="memberhub-list-head"><span data-member-count></span><button type="button" class="link" data-member-refresh>Aktualisieren</button></div><div class="memberhub-people" data-member-results></div>`;
  }
  function paintHub(){
    const content=document.querySelector('[data-member-hub-content]');if(!content||!snapshot)return;
    const saved={};for(const attr of ['query','filter','sort']){const el=document.querySelector(`[data-member-${attr}]`);if(el)saved[attr]=el.value;}
    const scroller=content.closest('.sheet'),scrollTop=scroller?.scrollTop||0;
    content.innerHTML=hubBody();for(const [attr,value] of Object.entries(saved)){const el=document.querySelector(`[data-member-${attr}]`);if(el)el.value=value;}if(scroller)scroller.scrollTop=scrollTop;document.querySelectorAll('[data-member-tab]').forEach(b=>{b.classList.toggle('on',b.dataset.memberTab===activeTab);b.setAttribute('aria-pressed',String(b.dataset.memberTab===activeTab));});
    if(activeTab==='overview')memberRows();
  }
  async function refreshHub(){
    const content=document.querySelector('[data-member-hub-content]');
    try{snapshot=await ui().api.memberAccessOverview();if(ui()?.isAdmin()&&content?.isConnected)paintHub();}
    catch(error){if(content?.isConnected)content.innerHTML=`<p role="alert">${esc(error.message||'Die Übersicht konnte nicht geladen werden.')}</p><button class="btn" data-member-refresh>Erneut versuchen</button><button class="btn" data-member-import-only>Zum Listenimport</button>`;}
  }
  async function open(){
    if(!ui().isAdmin())return;activeTab='overview';snapshot=null;
    ui().openSheet(`<section class="editor memberhub"><header class="memberhub-head"><div><span class="memberhub-eyebrow">Dein Club im Blick</span><h2>Mitglieder verwalten</h2></div></header><div class="memberhub-tabs"><button type="button" class="on" data-member-tab="overview" aria-pressed="true">Mitglieder &amp; Zugänge</button><button type="button" data-member-tab="import" aria-pressed="false">Liste importieren</button></div><div data-member-hub-content><p class="muted" role="status">Deine Mitgliederübersicht wird geladen …</p></div></section>`);
    await refreshHub();
  }
  document.addEventListener('click',event=>{
    if(!ui()?.isAdmin())return;
    const tab=event.target.closest('[data-member-tab]');
    if(tab){activeTab=tab.dataset.memberTab;if(snapshot)paintHub();else if(activeTab==='import'){document.querySelector('[data-member-hub-content]').innerHTML=hubBody();}return;}
    if(event.target.closest('[data-member-refresh]'))refreshHub();
    if(event.target.closest('[data-member-import-only]')){activeTab='import';document.querySelector('[data-member-hub-content]').innerHTML=hubBody();}
    const stat=event.target.closest('[data-member-stat]');if(stat){document.querySelector('[data-member-filter]').value=stat.dataset.memberStat;memberRows();}
  });
  document.addEventListener('input',event=>{if(event.target.matches('[data-member-query]')&&ui()?.isAdmin())memberRows();});
  document.addEventListener('change',event=>{if(event.target.matches('[data-member-filter],[data-member-sort]')&&ui()?.isAdmin())memberRows();});

  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-members-input]') || !e.target.files[0] || !ui().state.member?.isAdmin) return;
    const file = e.target.files[0];
    e.target.value = '';
    pick(file);
  });

  setInterval(()=>{if(ui()?.isAdmin()&&document.visibilityState!=='hidden'&&activeTab==='overview'&&document.querySelector('.memberhub')&&!document.activeElement?.matches('.memberhub-filters input,.memberhub-filters select'))refreshHub();},30000);
  TFB.memberImport = { open, readXlsx, toMembers };
})();
