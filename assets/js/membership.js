// Antragsdaten bleiben bis zum Absenden ausschließlich im offenen Formular.
(function () {
  const API = new URL('api/membership', location.href).pathname;
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fields = [
    ['firstName', 'Vorname', 'given-name'], ['lastName', 'Nachname', 'family-name'],
    ['street', 'Straße und Hausnummer', 'street-address'], ['postcode', 'Postleitzahl', 'postal-code'],
    ['city', 'Ort', 'address-level2'], ['email', 'E-Mail', 'email', 'email'],
    ['phone', 'Telefon / Handy (freiwillig)', 'tel', 'tel', false],
    ['birthDate', 'Geburtsdatum', 'bday', 'date'],
  ];
  const bankFields = [
    ['accountHolder', 'Kontoinhaber', 'off'], ['iban', 'IBAN', 'off'],
    ['bic', 'BIC (falls erforderlich)', 'off', 'text', false],
    ['bankName', 'Bank (freiwillig)', 'off', 'text', false],
  ];
  async function request(path, data) {
    const response = await fetch(API + path, {
      method: data ? 'POST' : 'GET', headers: data ? { 'Content-Type': 'application/json' } : {},
      body: data ? JSON.stringify(data) : undefined, cache: 'no-store', credentials: 'same-origin',
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Die Übermittlung ist momentan nicht möglich. Bitte später erneut versuchen.');
    return result;
  }
  async function settings() {
    if (!/^https?:$/.test(location.protocol)) return { live: false };
    try { return await request('/settings'); } catch (_) { return { live: false }; }
  }
  const input = ([name, label, autocomplete, type = 'text', required = true]) => `<label class="field"><span>${label}</span><input name="${name}" type="${type}" autocomplete="${autocomplete}" maxlength="${name === 'iban' ? 40 : 160}" ${required ? 'required' : ''}${type === 'date' ? ` max="${new Date().toLocaleDateString('sv-SE')}"` : ''}></label>`;
  function minor(date) {
    if (!date) return false;
    const born = new Date(date + 'T00:00:00');
    const adult = new Date(born.getFullYear() + 18, born.getMonth(), born.getDate());
    return adult > new Date();
  }
  function validIban(raw) {
    const iban = raw.replace(/\s/g, '').toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;
    const digits = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
    let remainder = 0;
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
    return remainder === 1;
  }
  async function open() {
    const cfg = await settings();
    const ui = TFB.ui;
    ui.openSheet(`<form class="editor membership-form" data-membership>
      <h2>Mitglied werden</h2>
      ${cfg.live ? '' : '<p class="membership-notice" role="status"><strong>Vorschau</strong> · Es werden keine Daten gespeichert oder an den Club verschickt.</p>'}
      <fieldset><legend>Mitgliedsdaten</legend><div class="membership-grid">${fields.map(input).join('')}
      <label class="field"><span>Mitgliedschaft</span><select name="membership" required><option value="active">Aktiv</option><option value="passive">Passiv</option></select></label></div></fieldset>
      <fieldset data-guardian hidden disabled><legend>Sorgeberechtigte Person</legend>
        ${input(['guardianName', 'Vor- und Nachname', 'off'])}
        ${input(['guardianEmail', 'E-Mail der sorgeberechtigten Person', 'off', 'email'])}
        <label class="meet-check"><input name="guardianConsent" type="checkbox" required><span>Ich bin zur Vertretung des Kindes berechtigt und beantrage die Aufnahme in dessen Namen. Eine erforderliche Zustimmung weiterer Sorgeberechtigter liegt vor.</span></label>
      </fieldset>
      <fieldset><legend>Bankverbindung</legend><div class="membership-grid">${bankFields.map(input).join('')}</div>
        <div data-holder hidden>${input(['accountHolderEmail', 'E-Mail des abweichenden Kontoinhabers', 'off', 'email', false])}</div>
        <p class="muted small">Bei einem abweichenden Kontoinhaber erhält dieser einen eigenen Link zur Bestätigung des Lastschriftmandats.</p>
      </fieldset>
      <fieldset><legend>Antrag und Erklärungen</legend>
        <p><a href="${esc(cfg.statutesUrl || 'https://www.tfbielstein.de/satzung-des-tfb-e-v/')}" target="_blank" rel="noopener">Satzung</a>${cfg.contributionsUrl ? ` · <a href="${esc(cfg.contributionsUrl)}" target="_blank" rel="noopener">Beiträge</a>` : ''}</p>
        <label class="meet-check"><input name="applicationConsent" type="checkbox" required><span>Ich beantrage die Mitgliedschaft bei den Tennisfreunden Bielstein e.V. und erkenne die Satzung${cfg.contributionsUrl ? ' und die geltenden Beiträge' : ''} an. Über die Aufnahme entscheidet der Vorstand.</span></label>
        ${cfg.live ? `<div class="membership-legal">${esc(cfg.mandateText)}</div>` : '<p class="membership-notice">Der endgültige SEPA-Mandatstext wird vor dem Livebetrieb mit der Vereinsbank abgestimmt.</p>'}
        <label class="meet-check"><input name="mandateConsent" type="checkbox" required><span data-mandate-label>${cfg.live ? 'Als Kontoinhaber erteile ich das oben beschriebene SEPA-Lastschriftmandat für Mitgliedsbeiträge und Getränkeabrechnungen.' : 'SEPA-Lastschriftmandat bestätigen (nur Vorschau).'}</span></label>
        <details><summary>Datenschutzhinweise zum Antrag</summary><div class="membership-legal">${esc(cfg.privacyText || 'Vorschau: Deine Eingaben bleiben im geöffneten Formular und werden nicht übermittelt. Vor dem Livebetrieb werden hier die vollständigen Hinweise zu Verantwortlichem, Zwecken, Rechtsgrundlagen, Empfängern, Speicherdauer und deinen Rechten hinterlegt.')}</div></details>
        <label class="meet-check"><input name="privacyRead" type="checkbox" required><span>Ich habe die Datenschutzhinweise zum Antrag zur Kenntnis genommen.</span></label>
      </fieldset>
      <div class="membership-trap" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
      <p class="form-error" role="alert"></p>
      <button class="btn primary block" type="submit">${cfg.live ? 'Aufnahme beantragen' : 'Antrag in der Vorschau prüfen'}</button>
      <p class="muted small">${cfg.live ? 'Anschließend bestätigst du den Antrag über einen Link per E-Mail. Das ist noch keine Aufnahmebestätigung.' : 'Auch der Bestätigungsschritt lässt sich ohne E-Mail-Versand ausprobieren.'}</p>
    </form>`);
    const form = document.querySelector('[data-membership]');
    const dialog = form.closest('[role=dialog]');
    dialog.setAttribute('aria-label', 'Aufnahmeantrag');
    const focusables = () => Array.from(dialog.querySelectorAll('button, input, select, summary, a[href]')).filter((el) => !el.disabled && el.getClientRects().length);
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (e.shiftKey && document.activeElement === list[0]) { e.preventDefault(); list[list.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === list[list.length - 1]) { e.preventDefault(); list[0].focus(); }
    });
    form.elements.firstName.focus();
    form.elements.birthDate.addEventListener('change', () => {
      const guardian = form.querySelector('[data-guardian]');
      guardian.hidden = guardian.disabled = !minor(form.elements.birthDate.value);
      updateHolder();
    });
    function updateHolder() {
      const signer = minor(form.elements.birthDate.value) ? form.elements.guardianName.value : `${form.elements.firstName.value} ${form.elements.lastName.value}`;
      const normalize = (s) => s.trim().replace(/\s+/g, ' ').toLocaleLowerCase('de');
      const separate = Boolean(form.elements.accountHolder.value.trim()) && normalize(form.elements.accountHolder.value) !== normalize(signer);
      form.querySelector('[data-holder]').hidden = !separate;
      form.elements.accountHolderEmail.required = separate;
      form.elements.accountHolderEmail.disabled = !separate;
      form.querySelector('[data-mandate-label]').textContent = separate
        ? 'Ich bitte um Einholung des SEPA-Lastschriftmandats beim angegebenen Kontoinhaber. Das Mandat wird erst mit dessen eigener Bestätigung erteilt.'
        : cfg.live ? 'Als Kontoinhaber erteile ich das oben beschriebene SEPA-Lastschriftmandat für Mitgliedsbeiträge und Getränkeabrechnungen.' : 'SEPA-Lastschriftmandat bestätigen (nur Vorschau).';
    }
    ['firstName', 'lastName', 'guardianName', 'accountHolder'].forEach((name) => form.elements[name].addEventListener('input', updateHolder));
    form.elements.iban.addEventListener('input', () => form.elements.iban.setCustomValidity(''));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validIban(form.elements.iban.value)) {
        form.elements.iban.setCustomValidity('Bitte eine gültige IBAN eingeben.');
        form.elements.iban.reportValidity(); return;
      }
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form));
      for (const name of ['guardianConsent', 'applicationConsent', 'mandateConsent', 'privacyRead']) data[name] = Boolean(form.elements[name].checked);
      data.iban = data.iban.replace(/\s/g, '').toUpperCase();
      data.version = cfg.version;
      const button = form.querySelector('[type=submit]');
      button.disabled = true;
      form.querySelector('.form-error').textContent = '';
      try {
        if (!cfg.live) {
          ui.openSheet(`<div class="editor membership-form"><h2>Antrag prüfen</h2><p class="membership-notice">Vorschau · Kein Versand und keine Speicherung.</p><dl class="membership-summary"><dt>Mitglied</dt><dd>${esc(data.firstName)} ${esc(data.lastName)}</dd><dt>Mitgliedschaft</dt><dd>${data.membership === 'active' ? 'Aktiv' : 'Passiv'}</dd><dt>Bestätigung an</dt><dd>${esc(minor(data.birthDate) ? data.guardianEmail : data.email)}</dd></dl><button type="button" class="btn primary block" data-demo-confirm>Bestätigung ausprobieren</button></div>`);
          document.querySelector('[data-demo-confirm]').addEventListener('click', () => ui.openSheet('<div class="editor membership-form"><h2>Bestätigung ausprobiert</h2><p>Im Livebetrieb erhält der Club jetzt deinen bestätigten Antrag und prüft die Aufnahme.</p><p class="membership-notice">Dies war eine Vorschau. Es wurde kein Antrag verschickt oder gespeichert.</p><button type="button" class="btn block" data-action="close-sheet">Schließen</button></div>'));
        } else {
          await request('/applications', data);
          ui.openSheet('<div class="editor membership-form"><h2>Bitte E-Mail bestätigen</h2><p>Dein Antrag ist eingegangen. Du erhältst einen Bestätigungslink per E-Mail. Er ist 48 Stunden gültig. Prüfe auch deinen Spamordner.</p><p>Erst nach allen erforderlichen Bestätigungen wird dein Antrag dem Club zur Bearbeitung vorgelegt. Bei einer Anmeldung für ein Kind geht der Link an die sorgeberechtigte Person. Ein abweichender Kontoinhaber bestätigt sein Mandat separat.</p><button type="button" class="btn block" data-action="close-sheet">Schließen</button></div>');
        }
      } catch (error) { form.querySelector('.form-error').textContent = error.message; button.disabled = false; }
    });
  }
  window.TFB = window.TFB || {};
  TFB.actions = TFB.actions || {};
  TFB.actions['membership-open'] = open;
  TFB.membership = { validIban, minor };
  const confirmation = document.querySelector('[data-membership-confirmation]');
  if (confirmation) {
    confirmation.querySelector('button').disabled = true;
    const token = location.hash.slice(1);
    history.replaceState(null, '', location.pathname);
    confirmation.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = confirmation.querySelector('button');
      button.disabled = true;
      try {
        const result = await request('/confirm', { token });
        confirmation.innerHTML = `<h1>Bestätigung erhalten</h1><p>${esc(result.message)}</p><p>Der Vorstand entscheidet über die Aufnahme. Du bist damit noch nicht automatisch Mitglied.</p><a class="btn primary" href="index.html#club">Zur Website</a>`;
      } catch (error) { confirmation.querySelector('[role=alert]').textContent = error.message; button.disabled = false; }
    });
    if (!/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
      confirmation.querySelector('[role=alert]').textContent = 'Dieser Bestätigungslink ist unvollständig. Bitte öffne den vollständigen Link aus deiner E-Mail.';
      confirmation.querySelector('button').disabled = true;
    } else {
      request('/confirmation-info', { token }).then((info) => {
        confirmation.querySelector('h1').textContent = info.kind === 'mandate' ? 'Lastschriftmandat bestätigen' : 'Aufnahmeantrag bestätigen';
        confirmation.querySelector('button').textContent = info.kind === 'mandate' ? 'Lastschriftmandat erteilen' : 'Antrag verbindlich bestätigen';
        const details = document.createElement('div');
        details.className = 'membership-legal';
        details.textContent = info.text;
        confirmation.querySelector('button').before(details);
        confirmation.querySelector('button').disabled = false;
      }).catch((error) => {
        confirmation.querySelector('[role=alert]').textContent = error.message;
        confirmation.querySelector('button').disabled = true;
      });
    }
  }
})();
