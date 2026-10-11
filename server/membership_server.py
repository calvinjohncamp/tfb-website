"""TFB membership API and local website preview; Python standard library only."""
import base64
import datetime as dt
import hashlib
import hmac
import ipaddress
import json
import os
from pathlib import Path
import re
import secrets
import smtplib
import sqlite3
import ssl
import threading
import time
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PREFIX = '/api/membership'
TEXT_FIELDS = ('firstName', 'lastName', 'street', 'postcode', 'city', 'email', 'phone',
               'birthDate', 'membership', 'accountHolder', 'iban', 'bic', 'bankName',
               'guardianName', 'guardianEmail', 'accountHolderEmail')
CONSENTS = ('applicationConsent', 'mandateConsent', 'privacyRead', 'guardianConsent')
EMAIL = re.compile(r'^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$')


def minor(date):
    born = dt.date.fromisoformat(date)
    today = dt.date.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day)) < 18


def valid_iban(value):
    if not re.fullmatch(r'[A-Z]{2}\d{2}[A-Z0-9]{11,30}', value):
        return False
    digits = ''.join(str(ord(c) - 55) if c.isalpha() else c for c in value[4:] + value[:4])
    return int(digits) % 97 == 1


def validate(raw, cfg):
    if not isinstance(raw, dict) or raw.get('website'):
        raise ValueError('Der Antrag konnte nicht verarbeitet werden.')
    data = {}
    for name in TEXT_FIELDS:
        value = raw.get(name, '')
        if not isinstance(value, str) or len(value) > 160 or any(ord(c) < 32 for c in value):
            raise ValueError('Bitte die Eingaben prüfen.')
        data[name] = value.strip()
    for name in CONSENTS:
        if name in raw and not isinstance(raw[name], bool):
            raise ValueError('Bitte die Erklärungen prüfen.')
        data[name] = raw.get(name, False)
    for name in ('firstName', 'lastName', 'street', 'postcode', 'city', 'email', 'birthDate', 'accountHolder', 'iban'):
        if not data[name]:
            raise ValueError('Bitte alle Pflichtfelder ausfüllen.')
    try:
        born = dt.date.fromisoformat(data['birthDate'])
        if born > dt.date.today() or born.year < 1900:
            raise ValueError()
    except ValueError:
        raise ValueError('Bitte ein gültiges Geburtsdatum eingeben.')
    if data['membership'] not in ('active', 'passive') or not EMAIL.fullmatch(data['email']):
        raise ValueError('Bitte Mitgliedschaft und E-Mail prüfen.')
    if minor(data['birthDate']):
        if not data['guardianName'] or not EMAIL.fullmatch(data['guardianEmail']) or not data['guardianConsent']:
            raise ValueError('Bitte die Angaben und Zustimmung der Sorgeberechtigten ergänzen.')
        signer, recipient = data['guardianName'], data['guardianEmail']
    else:
        signer, recipient = data['firstName'] + ' ' + data['lastName'], data['email']
        data['guardianName'] = data['guardianEmail'] = ''
        data['guardianConsent'] = False
    separate = ' '.join(signer.casefold().split()) != ' '.join(data['accountHolder'].casefold().split())
    if separate and not EMAIL.fullmatch(data['accountHolderEmail']):
        raise ValueError('Bitte die E-Mail des abweichenden Kontoinhabers ergänzen.')
    if not separate:
        data['accountHolderEmail'] = ''
    data['iban'] = re.sub(r'\s+', '', data['iban']).upper()
    data['bic'] = data['bic'].upper()
    if not valid_iban(data['iban']) or (data['bic'] and not re.fullmatch(r'[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?', data['bic'])):
        raise ValueError('Bitte IBAN und gegebenenfalls BIC prüfen.')
    if not all(data[name] for name in ('applicationConsent', 'mandateConsent', 'privacyRead')):
        raise ValueError('Bitte die erforderlichen Erklärungen bestätigen.')
    if raw.get('version') != cfg['version']:
        raise ValueError('Die Antragstexte wurden aktualisiert. Bitte das Formular neu öffnen.')
    data['recipient'] = recipient
    data['separateMandate'] = separate
    data['declarations'] = {name: cfg[name] for name in ('version', 'mandateText', 'privacyText', 'statutesUrl', 'contributionsUrl')}
    return data


class Store:
    def __init__(self, path):
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.path = str(path)
        with self.connect() as db:
            db.executescript('''CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY, data TEXT NOT NULL, created REAL NOT NULL,
                application_confirmed REAL, mandate_confirmed REAL, status TEXT NOT NULL DEFAULT 'pending');
                CREATE TABLE IF NOT EXISTS tokens (
                hash TEXT PRIMARY KEY, application TEXT NOT NULL, kind TEXT NOT NULL, expires REAL NOT NULL, used REAL);
                CREATE TABLE IF NOT EXISTS outbox (
                id INTEGER PRIMARY KEY, recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
                application TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, next_try REAL NOT NULL DEFAULT 0);
                CREATE TABLE IF NOT EXISTS limits (address TEXT PRIMARY KEY, started REAL, count INTEGER);''')
        os.chmod(path, 0o600)

    def connect(self):
        db = sqlite3.connect(self.path, timeout=10)
        db.execute('PRAGMA secure_delete=ON')
        return db

    def throttle(self, address):
        now = time.time()
        with self.connect() as db:
            db.execute('BEGIN IMMEDIATE')
            row = db.execute('SELECT started,count FROM limits WHERE address=?', (address,)).fetchone()
            if row and now - row[0] < 3600 and row[1] >= 20:
                return False
            started, count = (row[0], row[1] + 1) if row and now - row[0] < 3600 else (now, 1)
            db.execute('INSERT OR REPLACE INTO limits VALUES (?,?,?)', (address, started, count))
        return True

    def cleanup(self, days):
        now = time.time()
        with self.connect() as db:
            ids = [r[0] for r in db.execute('SELECT id FROM applications WHERE (status="pending" AND created<?) OR created<?', (now - 48 * 3600, now - days * 86400))]
            for app_id in ids:
                for table, column in (('tokens', 'application'), ('outbox', 'application'), ('applications', 'id')):
                    db.execute(f'DELETE FROM {table} WHERE {column}=?', (app_id,))
            db.execute('DELETE FROM limits WHERE started<?', (now - 3600,))


def queue(db, app_id, recipient, subject, body):
    db.execute('INSERT INTO outbox (recipient,subject,body,application) VALUES (?,?,?,?)', (recipient, subject, body, app_id))


def application_create(store, data, cfg):
    app_id = secrets.token_hex(12)
    now = time.time()
    with store.connect() as db:
        db.execute('INSERT INTO applications (id,data,created) VALUES (?,?,?)', (app_id, json.dumps(data, ensure_ascii=False), now))
        recipients = [(data['recipient'], 'application' if data['separateMandate'] else 'both')]
        if data['separateMandate']:
            recipients.append((data['accountHolderEmail'], 'mandate'))
        for recipient, kind in recipients:
            token = secrets.token_urlsafe(32)
            db.execute('INSERT INTO tokens VALUES (?,?,?,?,NULL)', (hashlib.sha256(token.encode()).hexdigest(), app_id, kind, now + 48 * 3600))
            link = cfg['publicUrl'].rstrip('/') + '/mitgliedschaft-bestaetigen.html#' + token
            text = (data['declarations']['mandateText'] + '\n\nKontoinhaber: ' + data['accountHolder'] + '\nIBAN: …' + data['iban'][-4:]) if kind == 'mandate' else ('Aufnahmeantrag für ' + data['firstName'] + ' ' + data['lastName'])
            queue(db, app_id, recipient, 'TFB: Bitte ' + ('Lastschriftmandat' if kind == 'mandate' else 'Aufnahmeantrag') + ' bestätigen',
                  text + '\n\n' + link + '\n\nDer Link ist 48 Stunden gültig. Wenn du dies nicht veranlasst hast, ignoriere diese Nachricht.\nKontakt: ' + cfg['clubEmail'])
    return app_id


def token_lookup(db, token):
    if not isinstance(token, str) or not re.fullmatch(r'[A-Za-z0-9_-]{40,100}', token):
        raise ValueError('Dieser Bestätigungslink ist ungültig.')
    digest = hashlib.sha256(token.encode()).hexdigest()
    row = db.execute('SELECT application,kind,expires,used FROM tokens WHERE hash=?', (digest,)).fetchone()
    if not row or (not row[3] and row[2] < time.time()):
        raise ValueError('Dieser Link ist ungültig oder abgelaufen. Bitte einen neuen Antrag stellen.')
    app = db.execute('SELECT data,application_confirmed,mandate_confirmed,status FROM applications WHERE id=?', (row[0],)).fetchone()
    if not app:
        raise ValueError('Dieser Antrag ist nicht mehr verfügbar.')
    return digest, row, app


def confirm(store, token, cfg):
    with store.connect() as db:
        db.execute('BEGIN IMMEDIATE')
        digest, row, app = token_lookup(db, token)
        if row[3]:
            return 'Diese Erklärung wurde bereits bestätigt.'
        now = time.time()
        application_time = now if row[1] in ('both', 'application') else app[1]
        mandate_time = now if row[1] in ('both', 'mandate') else app[2]
        ready = bool(application_time and mandate_time)
        db.execute('UPDATE tokens SET used=? WHERE hash=?', (now, digest))
        db.execute('UPDATE applications SET application_confirmed=?,mandate_confirmed=?,status=? WHERE id=?', (application_time, mandate_time, 'review' if ready else 'pending', row[0]))
        data = json.loads(app[0])
        if ready:
            queue(db, row[0], cfg['clubEmail'], 'TFB: Neuer bestätigter Aufnahmeantrag',
                  'Ein vollständig bestätigter Antrag liegt vor.\nAntragsnummer: ' + row[0] + '\nGeschützter Posteingang: ' + cfg['publicUrl'].rstrip('/') + PREFIX + '/admin\n\nBankdaten werden ausschließlich im geschützten Posteingang angezeigt.')
            copy = '\n'.join(name + ': ' + str(data[name]) for name in TEXT_FIELDS if data[name] and name not in ('iban', 'bic'))
            queue(db, row[0], data['recipient'], 'TFB: Dein Aufnahmeantrag ist bestätigt',
                  'Dein Antrag liegt dem Vorstand zur Prüfung vor. Dies ist noch keine Aufnahmebestätigung.\nAntragsnummer: ' + row[0] + '\n\n' + copy + '\nIBAN: …' + data['iban'][-4:] + '\n\n' + data['declarations']['mandateText'] + '\n\n' + data['declarations']['privacyText'])
        return 'Dein bestätigter Antrag liegt dem Club zur Prüfung vor.' if ready else 'Deine Erklärung ist bestätigt. Die Bestätigung der anderen Person steht noch aus.'


def deliver(store, cfg):
    with store.connect() as db:
        messages = db.execute('SELECT id,recipient,subject,body,attempts FROM outbox WHERE next_try<=? ORDER BY id LIMIT 10', (time.time(),)).fetchall()
    for mail_id, recipient, subject, body, attempts in messages:
        try:
            msg = EmailMessage()
            msg['From'], msg['To'], msg['Subject'] = os.environ['TFB_SMTP_FROM'], recipient, subject
            msg.set_content(body)
            host, port = os.environ['TFB_SMTP_HOST'], int(os.environ.get('TFB_SMTP_PORT', '465'))
            client = smtplib.SMTP_SSL(host, port, timeout=15, context=ssl.create_default_context()) if port == 465 else smtplib.SMTP(host, port, timeout=15)
            with client:
                if port != 465:
                    client.starttls(context=ssl.create_default_context())
                client.login(os.environ['TFB_SMTP_USER'], os.environ['TFB_SMTP_PASSWORD'])
                client.send_message(msg)
            with store.connect() as db:
                db.execute('DELETE FROM outbox WHERE id=?', (mail_id,))
        except Exception:
            with store.connect() as db:
                db.execute('UPDATE outbox SET attempts=attempts+1,next_try=? WHERE id=?', (time.time() + min(3600, 60 * 2 ** min(attempts, 6)), mail_id))


def live_ready(cfg):
    required = ('TFB_ADMIN_PASSWORD', 'TFB_SMTP_HOST', 'TFB_SMTP_USER', 'TFB_SMTP_PASSWORD', 'TFB_SMTP_FROM', 'TFB_DATA_DIR')
    return bool(cfg.get('live') and cfg.get('bankApproved') and cfg.get('legalApproved')
                and all(os.environ.get(k) for k in required) and len(os.environ.get('TFB_ADMIN_PASSWORD', '')) >= 20
                and cfg.get('publicUrl', '').startswith('https://')
                and all(cfg.get(k) for k in ('version', 'contributionsUrl', 'statutesUrl', 'mandateText', 'privacyText')))


class Handler(BaseHTTPRequestHandler):
    def setup(self):
        super().setup()
        self.connection.settimeout(20)

    def address(self):
        address = self.client_address[0]
        if os.environ.get('TFB_TRUST_PROXY') == '1':
            try:
                address = str(ipaddress.ip_address(self.headers.get('X-Real-IP', address)))
            except ValueError:
                pass
        return address

    def log_message(self, *_):
        pass  # No personal data, credentials or confirmation links in access logs.

    def reply(self, status, body, kind='application/json; charset=utf-8'):
        payload = json.dumps(body, ensure_ascii=False).encode() if isinstance(body, dict) else body.encode() if isinstance(body, str) else body
        self.send_response(status)
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(len(payload)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        if self.path.startswith(PREFIX):
            self.send_header('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'")
        self.end_headers()
        self.wfile.write(payload)

    def admin(self):
        password = os.environ.get('TFB_ADMIN_PASSWORD', '')
        expected = 'Basic ' + base64.b64encode(('club:' + password).encode()).decode()
        if len(password) >= 20 and hmac.compare_digest(self.headers.get('Authorization', ''), expected):
            return True
        if not self.server.store.throttle('admin:' + self.address()):
            self.reply(429, {'error': 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.'})
            return False
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm="TFB Aufnahmeantraege", charset="UTF-8"')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        return False

    def do_GET(self):
        path = urlsplit(self.path).path
        cfg = self.server.cfg
        if path == PREFIX + '/settings':
            public = {name: cfg.get(name, '') for name in ('version', 'statutesUrl', 'contributionsUrl', 'mandateText', 'privacyText')}
            return self.reply(200, {**public, 'live': live_ready(cfg)})
        if path in (PREFIX + '/admin', PREFIX + '/admin/applications'):
            if not self.admin():
                return
            if path.endswith('/applications'):
                with self.server.store.connect() as db:
                    rows = db.execute('SELECT id,data,created,application_confirmed,mandate_confirmed,status FROM applications ORDER BY created DESC').fetchall()
                    pending_mail = db.execute('SELECT count(*) FROM outbox').fetchone()[0]
                return self.reply(200, {'applications': [dict(zip(('id', 'data', 'created', 'applicationConfirmed', 'mandateConfirmed', 'status'), (r[0], json.loads(r[1]), *r[2:]))) for r in rows], 'pendingMail': pending_mail})
            return self.reply(200, ADMIN_HTML, 'text/html; charset=utf-8')
        if path.startswith(PREFIX):
            return self.reply(404, {'error': 'Nicht gefunden.'})
        relative = path.lstrip('/') or 'index.html'
        allowed = relative in ('index.html', 'mitgliedschaft-bestaetigen.html', 'sw.js', 'manifest.webmanifest') or relative.startswith('assets/')
        file = (ROOT / relative).resolve()
        asset_safe = not relative.startswith('assets/') or file.is_relative_to((ROOT / 'assets').resolve())
        if not allowed or not asset_safe or not file.is_relative_to(ROOT) or not file.is_file():
            return self.reply(404, {'error': 'Nicht gefunden.'})
        import mimetypes
        return self.reply(200, file.read_bytes(), mimetypes.guess_type(str(file))[0] or 'application/octet-stream')

    def do_POST(self):
        cfg, store = self.server.cfg, self.server.store
        expected_origin = self.server.origin
        if self.headers.get('Origin') != expected_origin or not self.headers.get('Content-Type', '').startswith('application/json'):
            return self.reply(403, {'error': 'Unzulässige Anfrage.'})
        if not store.throttle(self.address()):
            return self.reply(429, {'error': 'Zu viele Versuche. Bitte später erneut versuchen.'})
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 16000:
                raise ValueError('Die Anfrage ist zu groß oder leer.')
            raw = json.loads(self.rfile.read(size))
            if not isinstance(raw, dict):
                raise ValueError('Ungültige Anfrage.')
            path = urlsplit(self.path).path
            if path == PREFIX + '/admin/status':
                if not self.admin():
                    return
                status = raw.get('status')
                if status not in ('review', 'accepted', 'rejected'):
                    raise ValueError('Ungültiger Status.')
                with store.connect() as db:
                    changed = db.execute('UPDATE applications SET status=? WHERE id=? AND application_confirmed IS NOT NULL AND mandate_confirmed IS NOT NULL', (status, raw.get('id', ''))).rowcount
                if not changed:
                    raise ValueError('Dieser Antrag ist noch nicht vollständig bestätigt.')
                return self.reply(200, {'ok': True})
            if not live_ready(cfg):
                return self.reply(503, {'error': 'Der Onlineversand ist noch nicht freigeschaltet.'})
            if path == PREFIX + '/applications':
                application_create(store, validate(raw, cfg), cfg)
                self.server.mail_event.set()
                return self.reply(202, {'ok': True})
            if path == PREFIX + '/confirmation-info':
                with store.connect() as db:
                    _, token, app = token_lookup(db, raw.get('token'))
                data = json.loads(app[0])
                text = 'Aufnahmeantrag für ' + data['firstName'] + ' ' + data['lastName'] + '\nMitgliedschaft: ' + ('Aktiv' if data['membership'] == 'active' else 'Passiv')
                if token[1] in ('mandate', 'both'):
                    text += '\n\n' + data['declarations']['mandateText'] + '\nKontoinhaber: ' + data['accountHolder'] + '\nIBAN: …' + data['iban'][-4:]
                text += '\n\n' + data['declarations']['privacyText']
                return self.reply(200, {'kind': token[1], 'text': text})
            if path == PREFIX + '/confirm':
                message = confirm(store, raw.get('token'), cfg)
                self.server.mail_event.set()
                return self.reply(200, {'message': message})
            return self.reply(404, {'error': 'Nicht gefunden.'})
        except (ValueError, TypeError) as error:
            return self.reply(400, {'error': str(error) if isinstance(error, ValueError) and not isinstance(error, json.JSONDecodeError) else 'Bitte die Eingaben prüfen.'})
        except Exception:
            return self.reply(500, {'error': 'Die Verarbeitung ist momentan nicht möglich. Bitte später erneut versuchen.'})


ADMIN_HTML = '''<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TFB · Aufnahmeanträge</title>
<style>body{font:16px system-ui;margin:24px;color:#222}main{max-width:1100px;margin:auto}h1{font-size:26px}article{border-top:1px solid #ddd;padding:20px 0}dl{display:grid;grid-template-columns:180px minmax(0,1fr);gap:8px}dd{margin:0;overflow-wrap:anywhere}select,button{padding:10px;font:inherit}pre{white-space:pre-wrap}summary{cursor:pointer}@media(max-width:550px){dl{grid-template-columns:1fr}dt{font-weight:600}}</style>
<main><h1>Aufnahmeanträge</h1><p id="status" role="status"></p><div id="list"></div></main><script>
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={firstName:'Vorname',lastName:'Nachname',street:'Straße',postcode:'PLZ',city:'Ort',email:'E-Mail',phone:'Telefon',birthDate:'Geburtsdatum',membership:'Mitgliedschaft',accountHolder:'Kontoinhaber',iban:'IBAN',bic:'BIC',bankName:'Bank',guardianName:'Sorgeberechtigte Person',guardianEmail:'E-Mail Sorgeberechtigte',accountHolderEmail:'E-Mail Kontoinhaber'};
const labels={pending:'Bestätigung ausstehend',review:'Zu prüfen',accepted:'Aufgenommen',rejected:'Abgelehnt'};
async function load(){try{const r=await fetch('admin/applications',{cache:'no-store'});if(!r.ok)throw Error('Posteingang nicht erreichbar.');const x=await r.json();document.querySelector('#status').textContent=x.applications.length+' Anträge · '+x.pendingMail+' E-Mails warten auf Versand';document.querySelector('#list').innerHTML=x.applications.map(a=>'<article><h2>'+esc(a.data.firstName+' '+a.data.lastName)+'</h2><p>'+esc(labels[a.status])+' · '+new Date(a.created*1000).toLocaleString('de-DE')+'</p><dl>'+Object.entries(names).filter(([k])=>a.data[k]).map(([k,v])=>'<dt>'+v+'</dt><dd>'+esc(a.data[k])+'</dd>').join('')+'<dt>Antrag bestätigt</dt><dd>'+(a.applicationConfirmed?new Date(a.applicationConfirmed*1000).toLocaleString('de-DE'):'Ausstehend')+'</dd><dt>Mandat bestätigt</dt><dd>'+(a.mandateConfirmed?new Date(a.mandateConfirmed*1000).toLocaleString('de-DE'):'Ausstehend')+'</dd></dl><details><summary>Erklärungen und Nachweis</summary><pre>'+esc(JSON.stringify(a.data.declarations,null,2))+'</pre><p>Antragsnummer: '+esc(a.id)+'</p></details>'+(a.status!=='pending'?'<label>Status <select data-id="'+esc(a.id)+'">'+['review','accepted','rejected'].map(v=>'<option value="'+v+'" '+(v===a.status?'selected':'')+'>'+labels[v]+'</option>').join('')+'</select></label>':'')+'</article>').join('')||'<p>Keine Anträge vorhanden.</p>'}catch(e){document.querySelector('#status').textContent=e.message}}
document.addEventListener('change',async e=>{if(!e.target.matches('[data-id]'))return;const r=await fetch('admin/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:e.target.dataset.id,status:e.target.value})});if(!r.ok){document.querySelector('#status').textContent='Status konnte nicht gespeichert werden.';return}await load()});load();</script></html>'''


def make_server(port=8787, cfg=None, data_dir=None):
    if cfg is None:
        cfg = json.loads(Path(os.environ.get('TFB_MEMBERSHIP_SETTINGS', ROOT / 'server/membership-settings.example.json')).read_text())
    if cfg.get('live') and not live_ready(cfg):
        raise RuntimeError('Livebetrieb nicht vollständig konfiguriert. Siehe docs/digitale-aufnahme.md.')
    directory = Path(data_dir or os.environ.get('TFB_DATA_DIR', '/tmp/tfb-membership-preview'))
    if directory.resolve().is_relative_to(ROOT):
        raise RuntimeError('TFB_DATA_DIR muss außerhalb des Website-Verzeichnisses liegen.')
    server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    server.cfg, server.store = cfg, Store(directory / 'applications.sqlite3')
    server.origin = cfg['publicUrl'].rstrip('/') if live_ready(cfg) else f'http://127.0.0.1:{server.server_port}'
    server.origin = '{0.scheme}://{0.netloc}'.format(urlsplit(server.origin))
    server.mail_event = threading.Event()
    return server


def worker(server):
    while True:
        server.store.cleanup(int(server.cfg.get('retentionDays', 90)))
        if live_ready(server.cfg):
            deliver(server.store, server.cfg)
        server.mail_event.wait(30)
        server.mail_event.clear()


if __name__ == '__main__':
    os.umask(0o077)
    server = make_server(int(os.environ.get('TFB_PORT', '8787')))
    threading.Thread(target=worker, args=(server,), daemon=True).start()
    print(f'TFB Vorschau: http://127.0.0.1:{server.server_port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
