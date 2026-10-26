(function () {
  const ui = () => TFB.ui;
  const esc = (text) => ui().esc(text);
  async function open() {
    if (!ui().state.member || !ui().state.member.isAdmin) return;
    // Local file previews cannot draw file:// photographs onto an exportable canvas.
    if (location.protocol === 'file:' && !TFB.boardPhotoData) {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'assets/data/board-photo-data.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      } catch (_) { ui().toast('Die lokalen Foto-Dateien konnten nicht geladen werden.'); return; }
    }
    let site = await ui().api.site();
    const block = site.pages.verein.blocks.find((b) => b.id === 'v-vorstand');
    if (!block) return ui().toast('Bitte zuerst einen Vorstandsbereich im Club anlegen.');
    const people = JSON.parse(JSON.stringify(block.people || []));
    const faces = new Map();
    const images = await ui().api.images();
    const photoSource = (p) => {
      const src = p.memberId ? faces.get(p.memberId)?.avatarLarge || faces.get(p.memberId)?.avatar : (TFB.boardPhotoPreviews || {})[p.image] || p.image;
      return (TFB.boardPhotoData || {})[src] || images[src] || src;
    };
    const photoKey = (p) => p.memberId ? `member:${p.memberId}:${faces.get(p.memberId)?.avatarRevision || 0}` : p.image;
    const photoPreview = (p) => p.photoCrop?.source === photoKey(p) ? p.photoCrop.image : p.memberId ? faces.get(p.memberId)?.avatar : photoSource(p);
    const draw = () => {
      ui().openSheet(`<form class="editor board-editor" data-board-editor>
        <h2>Vorstand bearbeiten</h2>
        <label class="field"><span>Überschrift</span><input name="title" value="${esc(block.title || 'Vorstand')}"></label>
        <div data-board-rows>${people.map((p, i) => `<section class="board-editor-row" data-board-row="${i}">
          <header><strong>${esc(p.role || 'Neue Funktion')}</strong><div class="board-row-tools">
            <button type="button" data-board-move="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} title="Nach oben" aria-label="Nach oben">${ui().icon.up}</button>
            <button type="button" data-board-move="${i}" data-dir="1" ${i === people.length - 1 ? 'disabled' : ''} title="Nach unten" aria-label="Nach unten">${ui().icon.down}</button>
            <button type="button" data-board-remove="${i}" title="Funktion entfernen" aria-label="Funktion entfernen">${ui().icon.close}</button>
          </div></header>
          <label class="field"><span>Funktion</span><input data-key="role" value="${esc(p.role || '')}" required></label>
          <label class="field"><span>Name</span><input data-key="name" value="${esc(p.name || '')}" autocomplete="off" required></label>
          <label class="field"><span>E-Mail / Mitglied suchen</span><input data-key="email" value="${esc(p.email || '')}" autocomplete="off"></label>
          <label class="field"><span>Telefon</span><input type="tel" data-key="phone" value="${esc(p.phone || '')}"></label>
          <div class="board-matches" data-matches aria-live="polite"></div>
          ${p.memberId ? `<div class="board-linked"><span class="person-dot">${photoSource(p) ? `<img src="${esc(photoPreview(p))}" alt="">` : ui().icon.user}</span><span>${esc(p.name)} · Mit Mitglied verknüpft</span><button type="button" class="link" data-board-unlink="${i}">Lösen</button></div><p class="muted small">Das Profilbild erscheint auf der Website, sobald die öffentliche Foto-Freigabe vorliegt.</p>` : ''}
          <label class="meet-check"><input type="checkbox" data-key="publishEmail" ${p.publishEmail ? 'checked' : ''}><span>E-Mail als Kontakt auf der öffentlichen Website anzeigen</span></label>
          <label class="meet-check"><input type="checkbox" data-key="publishPhone" ${p.publishPhone ? 'checked' : ''}><span>Telefon auf der öffentlichen Website anzeigen</span></label>
          ${!p.memberId && p.image ? `<div class="board-linked"><span class="person-dot"><img src="${esc(photoPreview(p))}" alt=""></span><span>${esc(p.name)}</span><button type="button" class="link" data-board-photo-remove="${i}">Foto entfernen</button></div>` : ''}
          ${photoSource(p) ? `<button type="button" class="btn small" data-board-crop="${i}">Ausschnitt anpassen</button>` : ''}
        </section>`).join('')}</div>
        <button type="button" class="btn" data-board-add>${ui().icon.plus} Funktion hinzufügen</button>
        <p class="form-error" role="alert"></p><button type="submit" class="btn primary block">Vorstand speichern</button>
      </form>`);
      const form = document.querySelector('[data-board-editor]');
      const collect = () => {
        block.title = form.elements.title.value.trim();
        form.querySelectorAll('[data-board-row]').forEach((row) => {
          const p = people[Number(row.dataset.boardRow)];
          row.querySelectorAll('[data-key]').forEach((input) => { p[input.dataset.key] = input.type === 'checkbox' ? input.checked : input.value.trim(); });
        });
      };
      let timer;
      let sequence = 0;
      form.addEventListener('input', (e) => {
        const input = e.target.closest('[data-key=name],[data-key=email]');
        if (!input) return;
        collect();
        const row = input.closest('[data-board-row]');
        const p = people[Number(row.dataset.boardRow)];
        delete p.memberId;
        const linked = row.querySelector('.board-linked');
        if (linked) linked.remove();
        clearTimeout(timer);
        const current = ++sequence;
        const query = input.value.trim();
        const matches = row.querySelector('[data-matches]');
        matches.innerHTML = '';
        if (query.length < 2) return;
        timer = setTimeout(async () => {
          try {
            const results = await ui().api.searchBoardMembers(query);
            if (current !== sequence || !form.isConnected) return;
            matches.innerHTML = results.length ? results.map((m) => `<button type="button" class="board-match" data-member-id="${esc(m.id)}"><span class="person-dot">${m.avatar ? `<img src="${esc(m.avatar)}" alt="">` : esc(m.firstName[0] + m.lastName[0])}</span><span><strong>${esc(m.firstName)} ${esc(m.lastName)}</strong><small>Nr. ${esc(m.memberNo)} · ${esc(m.email)}</small></span></button>`).join('') : '<p class="muted small">Kein Mitglied gefunden. Du kannst den Namen auch ohne Verknüpfung eintragen.</p>';
            matches.querySelectorAll('[data-member-id]').forEach((button) => button.addEventListener('click', async () => {
              collect();
              const member = results.find((m) => m.id === button.dataset.memberId);
              Object.assign(p, { memberId: member.id, name: `${member.firstName} ${member.lastName}`, email: member.email });
              delete p.image;
              delete p.photoCrop;
              const [details] = await ui().api.boardMembers([member.id]);
              faces.set(member.id, details || member);
              draw();
            }));
          } catch (err) { matches.textContent = err.message; }
        }, 200);
      });
      form.addEventListener('click', (e) => {
        const add = e.target.closest('[data-board-add]');
        const remove = e.target.closest('[data-board-remove]');
        const move = e.target.closest('[data-board-move]');
        const unlink = e.target.closest('[data-board-unlink]');
        const photoRemove = e.target.closest('[data-board-photo-remove]');
        const crop = e.target.closest('[data-board-crop]');
        if (!add && !remove && !move && !unlink && !photoRemove && !crop) return;
        collect();
        if (crop) {
          const p = people[Number(crop.dataset.boardCrop)];
          const source = photoKey(p);
          ui().openAvatarCropper(photoSource(p), async (image, position) => {
            p.photoCrop = { image, position, source };
            draw();
          }, { initial: p.photoCrop?.source === source ? p.photoCrop.position : null, onCancel: draw });
          return;
        }
        if (add) people.push({ role: '', name: '', email: '', publishEmail: false });
        if (remove) people.splice(Number(remove.dataset.boardRemove), 1);
        if (unlink) { const p = people[Number(unlink.dataset.boardUnlink)]; delete p.memberId; delete p.photoCrop; }
        if (photoRemove) { const p = people[Number(photoRemove.dataset.boardPhotoRemove)]; delete p.image; delete p.photoCrop; }
        if (move) {
          const from = Number(move.dataset.boardMove), to = from + Number(move.dataset.dir);
          if (to >= 0 && to < people.length) people.splice(to, 0, ...people.splice(from, 1));
        }
        draw();
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        collect();
        if (people.some((p) => !p.role || !p.name)) { form.querySelector('.form-error').textContent = 'Bitte Funktion und Name für jeden Eintrag ergänzen.'; return; }
        if (people.some((p) => p.publishEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email || ''))) { form.querySelector('.form-error').textContent = 'Bitte eine gültige Kontakt-E-Mail ergänzen oder die Veröffentlichung ausschalten.'; return; }
        const button = form.querySelector('[type=submit]');
        button.disabled = true;
        try {
          site = await ui().api.site();
          const target = site.pages.verein.blocks.find((b) => b.id === 'v-vorstand');
          target.title = block.title;
          target.people = people.map((p) => ({ role: p.role, name: p.name, ...(p.memberId ? { memberId: p.memberId } : {}),
            email: p.publishEmail && !p.memberId ? p.email : '', publishEmail: Boolean(p.publishEmail),
            phone: p.phone || '', publishPhone: Boolean(p.publishPhone), ...(!p.memberId && p.image ? { image: p.image } : {}),
            ...(p.photoCrop && p.photoCrop.source === photoKey(p) ? { photoCrop: p.photoCrop } : {}) }));
          await ui().api.saveSite(site);
          ui().closeSheet();
          await TFB.refreshSite();
          ui().toast('Vorstand gespeichert', true);
        } catch (err) { form.querySelector('.form-error').textContent = err.message; button.disabled = false; }
      });
    };
    const linkedMembers = await ui().api.boardMembers(people.filter((p) => p.memberId).map((p) => p.memberId));
    for (const p of people.filter((p) => p.memberId)) {
      const member = linkedMembers.find((m) => m.id === p.memberId);
      if (member) { p.name = `${member.firstName} ${member.lastName}`; p.email = member.email; faces.set(member.id, member); }
    }
    draw();
  }
  TFB.board = { open };
  TFB.actions['board-edit'] = open;
})();
