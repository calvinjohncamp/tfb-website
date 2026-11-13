const playable = meet => meet && ['einzel', 'doppel'].includes(meet.kind);
const formatDate = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

export function meetingMailStatements(env, ops, current, commitId, signature) {
  const changes = new Map(ops.map(op => [op.kind + ':' + op.id, op]));
  const prior = (kind, id) => current.get(kind + ':' + id);
  const record = (kind, id) => changes.get(kind + ':' + id) || prior(kind, id);
  const statements = [];
  const enqueue = (id, recipient, kind, meet, from, full = false) => {
    statements.push(env.DB.prepare(`INSERT OR IGNORE INTO meeting_mail(id,recipient_id,payload,created_at)
      SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM app_commits WHERE id=? AND signature=?)`)
      .bind(id, recipient, JSON.stringify({kind, meet, from, full}), Date.now(), commitId, signature));
  };
  for (const op of ops) {
    if (op.deleted) continue;
    if (op.kind === 'meet' && playable(op.value)) {
      const meet = op.value;
      const previous = prior('meet', op.id)?.value.invitees || [];
      for (const id of meet.invitees) {
        if (id !== meet.createdBy && !previous.includes(id)) enqueue(`invite:${meet.id}:${id}`, id, 'invite', meet, meet.createdBy);
      }
    }
    if (op.kind === 'meet-answer' && op.value.a === 'yes' && !op.value.by && prior(op.kind, op.id)?.value.a !== 'yes') {
      const answer = op.value;
      const row = record('meet', answer.meetId);
      const meet = row?.value;
      if (row?.deleted || !playable(meet) || answer.memberId === meet.createdBy) continue;
      const yes = meet.invitees.filter(id => record('meet-answer', meet.id + ':' + id)?.value.a === 'yes').length;
      enqueue(`yes:${op.id}:${op.revision + 1}`, meet.createdBy, 'yes', meet, answer.memberId, yes >= meet.slots);
    }
  }
  return statements;
}

export function meetingMailMessage(payload, person, from, sender) {
  const { meet, kind, full } = payload;
  const sport = meet.kind === 'einzel' ? 'Einzel' : 'Doppel';
  const day = formatDate.format(new Date(meet.date + 'T12:00:00Z'));
  const first = from.first_name;
  const invitation = kind === 'invite';
  const subject = invitation ? `Einladung von ${first} – ${sport} am ${day}` : `${first} hat zugesagt – ${sport} am ${day}`;
  const headline = invitation ? `Einladung zum ${sport}` : `${first} ist dabei${full ? ` – dein ${sport} steht` : ''}.`;
  const greeting = `Hallo ${person.first_name},`;
  const body = invitation ? `${first} lädt dich zu einem ${sport} ein.` : `${first} hat für dein ${sport} zugesagt.`;
  const when = `${day} · ${meet.time} Uhr`;
  const button = invitation ? 'Einladung ansehen' : 'Verabredung ansehen';
  const url = 'https://joern-kaemper.de/#treffen/' + encodeURIComponent(meet.id);
  const to = [person.email, person.email2].map(value => String(value || '').trim().replace(/[;, ]+$/, ''))
    .find(value => /^[^\s@;,<>]+@[^\s@;,<>]+\.[^\s@;,<>]+$/.test(value));
  if (!to) return null;
  return {
    from: sender, to: [to], subject: subject.replace(/[\r\n]+/g, ' '),
    text: [headline, greeting, body, when, meet.place, `${button}: ${url}`, 'Tennisfreunde Bielstein · Dating 2.0'].join('\n\n'),
    html: `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <body style="margin:0;background:#EFEFEF;color:#171717;font-family:Arial,sans-serif">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 16px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;text-align:left">
      <tr><td style="padding:18px 32px 24px"><img src="https://joern-kaemper.de/assets/brand/tfb-logo-midnight-amber.png" alt="Tennisfreunde Bielstein" width="228" style="display:block;max-width:100%;height:auto"></td></tr>
      <tr><td style="padding:32px;background:#F9F9F9;border:1px solid #D7D7D7;border-top:3px solid #FFC300;border-radius:0 0 10px 10px">
      <h1 style="margin:0 0 22px;color:#001D3D;font-size:36px;line-height:1.1">${escape(headline)}</h1>
      <p style="line-height:1.6;margin:0 0 18px">${escape(greeting)}<br>${escape(body)}</p>
      <p style="line-height:1.55;color:#001D3D;margin:0 0 24px"><strong>${escape(when)}</strong><br>${escape(meet.place)}</p>
      <a href="${escape(url)}" style="display:inline-block;padding:13px 18px;border-radius:6px;background:#FFC300;color:#001D3D;font-weight:bold;text-decoration:none">${button}</a>
      </td></tr><tr><td style="padding-top:20px;color:#686868;font-size:12px">Tennisfreunde Bielstein · Dating 2.0</td></tr>
      </table></td></tr></table></body></html>`,
  };
}

export async function deliverMeetingMail(env) {
  if (!env.RESEND_API_KEY || !env.AUTH_EMAIL_FROM) return;
  const now = Date.now();
  // Resend retains idempotency keys for 24 hours. Stop automatic retries before that window ends.
  const cutoff = now - 23 * 3600000;
  await env.DB.prepare("UPDATE meeting_mail SET status='expired' WHERE status='pending' AND created_at<?").bind(cutoff).run();
  const rows = (await env.DB.prepare(`SELECT * FROM meeting_mail
    WHERE status='pending' AND created_at>=? AND attempted_at<? ORDER BY created_at LIMIT 10`)
    .bind(cutoff, now - 60000).all()).results;
  for (const row of rows) {
    const claim = await env.DB.prepare("UPDATE meeting_mail SET attempted_at=? WHERE id=? AND status='pending' AND attempted_at=?")
      .bind(now, row.id, row.attempted_at).run();
    if (!claim.meta.changes) continue;
    const payload = JSON.parse(row.payload);
    const people = (await env.DB.prepare('SELECT id, first_name, email, email2 FROM members WHERE active=1 AND id IN (?,?)')
      .bind(row.recipient_id, payload.from).all()).results;
    const recipient = people.find(person => person.id === row.recipient_id);
    const from = people.find(person => person.id === payload.from);
    const message = recipient && from && meetingMailMessage(payload, recipient, from, env.AUTH_EMAIL_FROM);
    if (!message) {
      await env.DB.prepare("UPDATE meeting_mail SET status='no-address' WHERE id=?").bind(row.id).run();
      continue;
    }
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `tfb-meeting/${row.id}` },
        body: JSON.stringify(message), signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) continue;
      const { id } = await response.json();
      if (id) await env.DB.prepare("UPDATE meeting_mail SET status='sent', sent_at=?, provider_id=?, payload='{}' WHERE id=?").bind(Date.now(), id, row.id).run();
    } catch {
      // Leave the message queued. The next attempt uses the same provider key.
    }
  }
}
