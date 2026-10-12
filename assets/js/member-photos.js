(function () {
  const ui = () => TFB.ui;
  const esc = (text) => ui().esc(text);
  const labels = { members: 'Profilbild im Mitgliederbereich', public: 'Profilbild auf der öffentlichen Vereinswebsite', events: 'Vereinsfotos auf der öffentlichen Vereinswebsite' };
  async function settings() {
    const m = await ui().api.session();
    if (!m) return;
    ui().state.member = m;
    const p = m.photoPermissions;
    ui().openSheet(`<form class="editor" data-photo-settings>
      <h2>Fotos und Freigaben</h2>
      <p>Du kannst Mitglied sein, ohne ein Foto hochzuladen oder einer Veröffentlichung zuzustimmen. Freigaben kannst du hier jederzeit zurücknehmen.</p>
      <h3>Dein Profilbild</h3>
      <p>Angemeldete Mitglieder sehen dein Profilbild.${m.photoMinor ? ' Bei dir wird es erst nach dokumentierter Elternzustimmung sichtbar.' : ''}</p>
      <label class="meet-check"><input type="checkbox" name="publicAvatar" ${p.publicAvatar ? 'checked' : ''} ${m.avatar ? '' : 'disabled'}><span>Mein Profilbild darf auch auf der öffentlichen Vereinswebsite angezeigt werden, beispielsweise beim Vorstand.</span></label>
      <h3>Fotos aus dem Vereinsleben</h3>
      <label class="meet-check"><input type="checkbox" name="events" ${p.events ? 'checked' : ''}><span>Ich willige freiwillig ein, dass der Club Fotos von mir bei Vereinsveranstaltungen zur Berichterstattung über das Vereinsleben auf der öffentlichen Vereinswebsite veröffentlicht. Ich kann diese Einwilligung jederzeit für die Zukunft beim Club widerrufen.</span></label>
      ${m.photoMinor ? `<fieldset class="photo-parent"><legend>Elternzustimmung</legend>
        <p class="membership-notice">In dieser lokalen Vorführversion wird keine E-Mail versendet. Der Club dokumentiert eine tatsächlich vorliegende Elternzustimmung in der Verwaltung.</p>
        <label class="field"><span>Name der sorgeberechtigten Person</span><input name="parentName" value="${esc((p.pending || p.approval || {}).parentName || '')}" autocomplete="off"></label>
        <label class="field"><span>E-Mail der sorgeberechtigten Person</span><input type="email" name="parentEmail" value="${esc((p.pending || p.approval || {}).parentEmail || '')}" autocomplete="off"></label>
        <p>${p.pending ? 'Elternfreigabe angefragt; noch nicht bestätigt.' : p.approval ? 'Elternzustimmung dokumentiert. Für ein neues Profilfoto ist eine neue Freigabe erforderlich.' : 'Noch keine Elternfreigabe dokumentiert.'}</p>
      </fieldset>` : ''}
      <p class="form-error" role="alert"></p><button type="submit" class="btn primary block">Freigaben speichern</button>
    </form>`);
    const form = document.querySelector('[data-photo-settings]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        ui().state.member = await ui().api.setPhotoPermissions({ publicAvatar: form.elements.publicAvatar.checked,
          events: form.elements.events.checked, parentName: form.elements.parentName && form.elements.parentName.value,
          parentEmail: form.elements.parentEmail && form.elements.parentEmail.value });
        ui().closeSheet();
        await TFB.refreshSite();
        ui().toast(m.photoMinor ? 'Freigaben gespeichert; erforderliche Elternzustimmung wird geprüft.' : 'Foto-Freigaben gespeichert', true);
      } catch (err) { form.querySelector('.form-error').textContent = err.message; }
    });
  }
  async function admin() {
    try {
      const requests = await ui().api.photoRequests();
      const short = { members: 'Profilbild für Mitglieder', public: 'Profilbild öffentlich', events: 'Vereinsfotos öffentlich' };
      ui().openSheet(`<div class="editor photo-admin"><h2>Foto-Freigaben</h2>
        <p class="small muted">Wer hat welchen Veröffentlichungen zugestimmt? Bei Minderjährigen dokumentierst du hier eine vorliegende Elternzustimmung. In der Vorführversion werden keine E-Mails verschickt.</p>
        ${requests.length ? `<div class="photo-list">${requests.map((m) => {
          const p = m.pending || m.approval || { scopes: [...(m.publicAvatar ? ['public'] : []), ...(m.events ? ['events'] : [])] };
          const state = m.pending ? ['wait', 'Wartet auf Bestätigung'] : m.approval ? ['ok', 'Elternzustimmung dokumentiert'] : m.photoMinor ? ['none', 'Keine Elternzustimmung'] : ['ok', 'Eigene Freigabe'];
          return `<section class="photo-request">
            <div class="photo-request-head"><strong>${esc(m.firstName)} ${esc(m.lastName)}</strong><span class="photo-state ${state[0]}">${state[1]}</span></div>
            ${p.scopes.length ? `<div class="photo-tags">${p.scopes.map((x) => `<span>${esc(short[x] || labels[x])}</span>`).join('')}</div>` : ''}
            ${p.parentName ? `<p class="small muted">Sorgeberechtigt: ${esc(p.parentName)} · ${esc(p.parentEmail)}</p>` : ''}
            ${m.pending ? `<label class="meet-check"><input type="checkbox" data-proof="${esc(m.id)}"><span>Die Zustimmung der Sorgeberechtigten für diese Zwecke liegt dem Club vor und wurde geprüft.</span></label>` : ''}
            <div class="photo-actions">
              ${m.pending ? `<button type="button" class="btn small primary" data-approve="${esc(m.id)}">Zustimmung dokumentieren</button>` : ''}
              <button type="button" class="btn small ghost-danger" data-revoke="${esc(m.id)}">${m.pending ? 'Anfrage ablehnen' : 'Freigabe zurücknehmen'}</button>
            </div>
          </section>`;
        }).join('')}</div>` : '<p class="muted">Noch keine Fotos oder Foto-Freigaben vorhanden.</p>'}
        <p class="form-error" role="alert"></p>
      </div>`);
      const root = document.querySelector('#sheet-root .editor');
      root.addEventListener('click', async (e) => {
        const button = e.target.closest('[data-approve], [data-revoke]');
        if (!button) return;
        const id = button.dataset.approve || button.dataset.revoke;
        const proof = Array.from(root.querySelectorAll('[data-proof]')).find((input) => input.dataset.proof === id);
        try {
          await ui().api.reviewPhotoRequest(id, Boolean(button.dataset.approve), Boolean(proof && proof.checked));
          await TFB.refreshSite();
          await admin();
        } catch (err) { root.querySelector('.form-error').textContent = err.message; }
      });
    } catch (err) { ui().toast(err.message); }
  }
  TFB.actions['photo-settings'] = settings;
  TFB.actions['photo-admin'] = admin;
})();
