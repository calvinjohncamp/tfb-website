// Fixed TFB contribution categories; only annual amounts are maintained in the CMS.
(function () {
  const regular = Object.freeze([
    ['youth14', 'Jugend bis 14 Jahre', 5000],
    ['youth18', 'Jugend bis 18 Jahre', 9000],
    ['adult', 'Erwachsene', 21000],
    ['spouse', 'Ehepartner', 15000],
    ['education', 'Azubi / Student / Schüler', 11000],
    ['passive', 'Passive Mitglieder', 5000],
    ['guest', 'Gastmitgliedschaft / 2. Mitgliedschaft', 11000],
  ].map(Object.freeze));
  const trial = Object.freeze([
    ['trialAdult', 'Schnupperjahr Erwachsene', 8000],
    ['trialYouth', 'Schnupperjahr Jugend', 5000],
  ].map(Object.freeze));
  const categories = Object.freeze([...regular, ...trial]);
  const defaults = Object.freeze(Object.fromEntries(categories.map(([key, , amount]) => [key, amount])));
  const ui = () => TFB.ui;
  const admin = () => Boolean(ui()?.state.member?.isAdmin);
  const money = value => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value / 100);
  const valid = value => Number.isSafeInteger(value) && value >= 0 && value <= 9999999;
  function read(site) {
    const stored = site?.pages?.verein?.membershipFees?.amounts || {};
    return Object.fromEntries(categories.map(([key, , amount]) => [key, valid(stored[key]) ? stored[key] : amount]));
  }
  function parse(value) {
    const text = String(value).trim();
    if (!/^\d{1,5}(?:[,.]\d{1,2})?$/.test(text)) throw Error('Bitte einen Betrag von 0 bis 99.999,99 Euro mit höchstens zwei Nachkommastellen eingeben.');
    const [whole, fraction = ''] = text.replace(',', '.').split('.');
    const amount = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
    if (!valid(amount)) throw Error('Bitte einen gültigen Eurobetrag eingeben.');
    return amount;
  }
  function dialog(title, first) {
    const sheet = document.querySelector('.membership-fees, [data-membership-fees-form]')?.closest('[role="dialog"]');
    if (!sheet) return;
    sheet.setAttribute('aria-labelledby', title);
    sheet.onkeydown = event => {
      if (event.key !== 'Tab') return;
      const list = [...sheet.querySelectorAll('button, input, a[href]')].filter(el => !el.disabled && el.getClientRects().length);
      const index = list.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); list.at(-1)?.focus(); }
      else if (!event.shiftKey && index === list.length - 1) { event.preventDefault(); list[0]?.focus(); }
    };
    sheet.querySelector(first || '.sheet-close')?.focus({ preventScroll: true });
  }
  async function open() {
    try {
      const source = await ui().api.site(), amounts = read(source), esc = ui().esc;
      const row = ([key, label]) => `<div data-fee="${key}"><dt>${esc(label)}</dt><dd>${amounts[key] === 0 ? 'Beitragsfrei' : money(amounts[key])}</dd></div>`;
      ui().openSheet(`<section class="editor membership-fees" aria-labelledby="membership-fees-title">
        <p class="fees-eyebrow">Tennisfreunde Bielstein</p>
        <h2 id="membership-fees-title">Mitgliedsbeiträge ab 2027</h2>
        <p class="fees-intro">Gültig ab dem 1. Januar 2027. Alle Beiträge gelten pro Kalenderjahr.</p>
        ${admin() ? '<button type="button" class="btn small fees-edit-button" data-action="membership-fees-edit">Beiträge bearbeiten</button>' : ''}
        <section class="fees-trial" aria-labelledby="fees-trial-title">
          <h3 id="fees-trial-title">Erst mal Tennis ausprobieren</h3>
          <p>Schnuppermitgliedschaft für Tennisanfänger im ersten Jahr der Vereinszugehörigkeit.</p>
          <dl>${trial.map(row).join('')}</dl>
        </section>
        <h3 class="fees-regular-title">Reguläre Mitgliedschaft</h3>
        <dl class="fees-list">${regular.map(row).join('')}</dl>
        <div class="fees-notes"><p>Ab dem 3. Kind beitragsfrei.</p><p>Der Aufnahmetermin ist jeweils der 1. Januar.</p></div>
      </section>`);
      dialog('membership-fees-title');
    } catch (error) { ui().toast(error.message); }
  }
  async function edit() {
    if (!admin()) { ui().toast('Nur Admins dürfen die Mitgliedsbeiträge bearbeiten.'); return; }
    try {
      const source = await ui().api.site(), amounts = read(source), esc = ui().esc;
      if (!admin()) return;
      const inputs = rows => rows.map(([key, label]) => `<label class="field fees-amount-field"><span>${esc(label)}</span><span class="fees-amount-wrap"><input name="${key}" aria-label="${esc(label)} in Euro" type="text" inputmode="decimal" autocomplete="off" maxlength="8" required pattern="[0-9]{1,5}([,.][0-9]{1,2})?" value="${(amounts[key] / 100).toFixed(2).replace('.', ',')}"><span aria-hidden="true">€</span></span></label>`).join('');
      ui().openSheet(`<form class="editor fees-editor" data-membership-fees-form aria-labelledby="fees-editor-title">
        <p class="fees-eyebrow">TFB · Verwaltung</p><h2 id="fees-editor-title">Mitgliedsbeiträge pflegen</h2>
        <p class="fees-intro">Jahresbeiträge ab 2027 in Euro. Die Kategorien sind fest vorgegeben. Die Beitragsfreiheit ab dem 3. Kind bleibt bestehen.</p>
        <fieldset><legend>Reguläre Mitgliedschaft</legend>${inputs(regular)}</fieldset>
        <fieldset><legend>Schnupperjahr</legend>${inputs(trial)}</fieldset>
        <p class="form-error" role="alert"></p>
        <div class="fees-editor-actions"><button class="btn primary" type="submit">Beiträge speichern</button><button class="btn" type="button" data-action="membership-fees">Abbrechen</button></div>
      </form>`);
      const form = document.querySelector('[data-membership-fees-form]');
      form.addEventListener('input', event => event.target.setCustomValidity?.(''));
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const error = form.querySelector('.form-error'); error.textContent = '';
        if (!admin()) { error.textContent = 'Bitte als Admin anmelden.'; return; }
        const amounts = {};
        for (const [key] of categories) {
          const input = form.elements.namedItem(key);
          try { amounts[key] = parse(input.value); }
          catch (err) { input.setCustomValidity(err.message); input.reportValidity(); return; }
        }
        if (!form.reportValidity()) return;
        const controls = [...form.querySelectorAll('input, button')]; controls.forEach(el => { el.disabled = true; });
        try {
          source.pages.verein.membershipFees = { version: 1, effectiveFrom: '2027-01-01', amounts };
          await ui().api.saveSite(source);
          await TFB.refreshSite?.(true);
          await open();
          ui().toast('Mitgliedsbeiträge gespeichert', true);
        } catch (err) { error.textContent = err.message; }
        finally { if (form.isConnected) controls.forEach(el => { el.disabled = false; }); }
      });
      dialog('fees-editor-title', 'input');
    } catch (error) { ui().toast(error.message); }
  }
  TFB.membershipFees = Object.freeze({ regular, trial, categories, defaults, read, parse, open, edit });
  TFB.actions = TFB.actions || {};
  TFB.actions['membership-fees-edit'] = edit;
})();
