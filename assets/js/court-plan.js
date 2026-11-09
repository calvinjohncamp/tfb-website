// Responsive presentation of the fixed summer plan; this is not live booking.
(function () {
  let day = 0, week = false;
  const data = () => TFB.courtPlanData;
  const esc = text => TFB.ui.esc(text);
  const time = entry => `${entry.start}:00–${entry.end}:00`;
  const entries = index => data().entries.filter(e => e.day === index);
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
    return `<div class="cp-content" id="court-plan-content">${week ? data().days.map((_, i) => dayView(i)).join('') : dayView(day)}</div>`;
  }
  function render() {
    return `<section class="court-plan" aria-labelledby="court-plan-title">
      <header class="cp-head"><div><p class="cp-kicker">${data().season}</p><h2 id="court-plan-title">Platzbelegung</h2><p>Wer spielt wann? Die festen Trainingszeiten im Überblick.</p></div><span class="cp-court-icon" aria-hidden="true"><i></i></span></header>
      <div class="cp-controls"><div class="cp-days" role="group" aria-label="Wochentag wählen">${data().days.map((label, i) => `<button type="button" data-action="court-plan-day" data-day="${i}" aria-label="${label}" aria-controls="court-plan-content" aria-pressed="${!week && day === i}"><span class="cp-day-short" aria-hidden="true">${label.slice(0, 2)}</span><span class="cp-day-long" aria-hidden="true">${label}</span><span class="cp-day-dot ${entries(i).length ? 'has-entries' : ''}" aria-hidden="true"></span></button>`).join('')}</div>
      <button type="button" class="cp-week" data-action="court-plan-week" aria-controls="court-plan-content" aria-pressed="${week}">Ganze Woche</button></div>
      <div class="cp-legend" aria-label="Legende"><span><i class="cp-team"></i>Mannschaft</span><span><i class="cp-youth"></i>Jugendtraining</span><span><i class="cp-coach"></i>Trainer</span></div>
      ${content()}
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
    if (!Number.isInteger(selected) || selected < 0 || selected > 6) return;
    day = selected; week = false; update();
  };
  TFB.actions['court-plan-week'] = () => { week = !week; update(); };
})();
