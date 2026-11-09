// Responsive presentation of the fixed summer plan; this is not live booking.
(function () {
  let day = 0, week = false;
  const data = () => TFB.courtPlanData;
  const esc = text => TFB.ui.esc(text);
  const time = entry => `${entry.start}:00–${entry.end}:00`;
  const entries = index => data().entries.filter(e => e.day === index);
  const filename = (world, type) => `assets/docs/tfb-platzbelegung-sommer-2027-${world}.${type}`;
  const previews = () => ['black-crail', 'midnight-amber'].map((world, i) => `<img class="cp-brand-${i ? 'amber' : 'crail'}" src="${filename(world, 'jpg')}" alt="Wochenplan Sommer 2027: Montag bis Freitag, Plätze 1, 2, 3, 4, 6 und 7" width="3508" height="2481" loading="lazy">`).join('');
  const downloads = () => ['black-crail', 'midnight-amber'].map((world, i) => `<span class="cp-brand-${i ? 'amber' : 'crail'} cp-file-links"><a class="btn" href="${filename(world, 'pdf')}" download>PDF herunterladen</a><a class="btn" href="${filename(world, 'jpg')}" download>JPEG herunterladen</a></span>`).join('');
  function matrix() {
    return `<section class="cp-week-view" aria-labelledby="cp-week-title"><header class="cp-day-head"><h3 id="cp-week-title">Die Woche auf einen Blick</h3><span>Montag bis Freitag</span></header>
      <p class="cp-matrix-hint">Alle Plätze, alle Trainingszeiten. Die Matrix lässt sich bei Bedarf seitlich bewegen.</p>
      <div class="cp-matrix-scroll" role="region" aria-label="Wochenmatrix Platzbelegung" tabindex="0"><table class="cp-matrix"><caption>Feste Platzbelegungen im ${data().season}. Alle Zeiten in Uhr.</caption><thead><tr><th scope="col">Platz</th>${data().days.map(name => `<th scope="col">${name}</th>`).join('')}</tr></thead>
      <tbody>${data().courts.map(court => `<tr><th scope="row"><small>Platz</small><b>${court}</b></th>${data().days.map((_, index) => {
        const events = entries(index).filter(e => e.court === court);
        return `<td>${events.length ? events.map(e => `<article class="cp-matrix-event cp-${e.kind}" data-booking="${e.cell}"><strong>${esc(e.label)}</strong><time>${time(e)} Uhr</time></article>`).join('') : '<span class="cp-matrix-empty" aria-label="Keine feste Belegung">–</span>'}</td>`;
      }).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  }
  function dayView(index) {
    const { days, courts } = data(), bookings = entries(index);
    return `<section class="cp-day" aria-labelledby="cp-day-${index}">
      <header class="cp-day-head"><h3 id="cp-day-${index}">${days[index]}</h3><span>${bookings.length ? `${bookings.length} feste Belegungen` : 'Keine feste Belegung'}</span></header>
      ${bookings.length ? `<div class="cp-timetable">
        <div class="cp-axis" aria-hidden="true"><span>Platz</span><div>${Array.from({ length: 8 }, (_, i) => `<span style="--hour:${i}">${i + 14}:00</span>`).join('')}</div></div>
        ${courts.map(court => {
          const events = bookings.filter(e => e.court === court);
          return `<div class="cp-lane"><h4><span>Platz</span> ${court}</h4><div class="cp-track ${events.length ? '' : 'is-empty'}">
            ${events.length ? events.map(e => `<article class="cp-event cp-${e.kind}" style="--start:${(e.start - 14) / 7 * 100}%;--duration:${(e.end - e.start) / 7 * 100}%" aria-label="Platz ${court}, ${esc(e.label)}, ${time(e)} Uhr"><strong>${esc(e.label)}</strong><time>${time(e)} Uhr</time></article>`).join('') : '<span class="cp-unassigned">Keine feste Belegung</span>'}
          </div></div>`;
        }).join('')}
      </div>` : `<div class="cp-empty"><span class="cp-court-icon" aria-hidden="true"><i></i></span><h4>Raum für dein Spiel.</h4><p>Für ${days[index]} sind im Sommerplan keine festen Belegungen eingetragen.</p></div>`}
    </section>`;
  }
  function content() {
    return `<div class="cp-content" id="court-plan-content">${week ? matrix() : dayView(day)}</div>`;
  }
  function render() {
    return `<section class="court-plan" aria-labelledby="court-plan-title">
      <header class="cp-head"><div><p class="cp-kicker">${data().season}</p><h2 id="court-plan-title">Platzbelegung</h2><p>Wer spielt wann? Die festen Trainingszeiten im Überblick.</p></div><span class="cp-court-icon" aria-hidden="true"><i></i></span></header>
      <div class="cp-controls"><div class="cp-days" role="group" aria-label="Wochentag wählen">${data().days.map((label, i) => `<button type="button" data-action="court-plan-day" data-day="${i}" aria-label="${label}" aria-controls="court-plan-content" aria-pressed="${!week && day === i}"><span class="cp-day-short" aria-hidden="true">${label.slice(0, 2)}</span><span class="cp-day-long" aria-hidden="true">${label}</span><span class="cp-day-dot ${entries(i).length ? 'has-entries' : ''}" aria-hidden="true"></span></button>`).join('')}</div>
      <button type="button" class="cp-week" data-action="court-plan-week" aria-controls="court-plan-content" aria-pressed="${week}">Ganze Woche</button></div>
      <div class="cp-legend" aria-label="Legende"><span><i class="cp-team"></i>Mannschaft</span><span><i class="cp-youth"></i>Jugendtraining</span><span><i class="cp-coach"></i>Trainer</span></div>
      ${content()}
      <section class="cp-downloads" aria-labelledby="cp-download-title"><button type="button" class="cp-preview-button" data-action="court-plan-preview" aria-label="Wochenplan als Druckvorschau öffnen">${previews()}<span>Vorschau öffnen</span></button><div><h3 id="cp-download-title">Deine Woche zum Mitnehmen.</h3><p>Der komplette Wochenplan von Montag bis Freitag auf einer Seite. Als PDF zum Drucken oder als JPEG zum Speichern und Weitergeben – in A4 quer.</p>${downloads()}</div></section>
      <footer class="cp-note"><strong>Gut zu wissen</strong><p>Der Sommerplan zeigt feste Belegungen, keine Live-Verfügbarkeit. Ohne Eintrag ist keine feste Belegung hinterlegt. Vormittags sind keine festen Zeiten eingetragen.</p></footer>
      <p class="cp-status" role="status" aria-live="polite"></p>
    </section>`;
  }
  function update() {
    const root = document.querySelector('.court-plan');
    if (!root) return;
    root.querySelector('.cp-content').outerHTML = content();
    root.querySelectorAll('[data-action="court-plan-day"]').forEach(button => button.setAttribute('aria-pressed', String(!week && Number(button.dataset.day) === day)));
    root.querySelector('[data-action="court-plan-week"]').setAttribute('aria-pressed', String(week));
    root.querySelector('.cp-status').textContent = `${week ? 'Ganze Woche' : data().days[day]} angezeigt.`;
  }
  TFB.courtPlan = Object.freeze({ render });
  TFB.actions['court-plan-day'] = button => {
    const selected = Number(button.dataset.day);
    if (!Number.isInteger(selected) || selected < 0 || selected >= data().days.length) return;
    day = selected; week = false; update();
  };
  TFB.actions['court-plan-week'] = () => { week = !week; update(); };
  TFB.actions['court-plan-preview'] = () => {
    TFB.ui.openSheet(`<section class="editor cp-download-preview" aria-labelledby="cp-preview-title"><h2 id="cp-preview-title">Wochenplan · ${data().season}</h2><p>A4 quer · eine Seite · Montag bis Freitag</p>${previews()}${downloads()}</section>`);
    const sheet = document.querySelector('.cp-download-preview')?.closest('[role="dialog"]');
    sheet?.setAttribute('aria-labelledby', 'cp-preview-title');sheet?.querySelector('.sheet-close')?.focus();
  };
})();
