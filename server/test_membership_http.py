import base64
import http.client
import json
from pathlib import Path
import tempfile
import threading
import unittest
from unittest.mock import patch

import membership_server as m


class HttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.env = patch.dict(m.os.environ, {'TFB_ADMIN_PASSWORD': 'test-password-for-local-checks'})
        self.env.start()
        cfg = json.loads((m.ROOT / 'server/membership-settings.example.json').read_text())
        self.server = m.make_server(0, cfg, self.temp.name)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.env.stop()
        self.temp.cleanup()

    def request(self, path, data=None, headers=None):
        client = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        client.request('POST' if data is not None else 'GET', path,
                       json.dumps(data) if data is not None else None, headers or {})
        response = client.getresponse()
        result = response.status, dict(response.getheaders()), response.read()
        client.close()
        return result

    def test_preview_config_and_no_submission(self):
        status, headers, body = self.request(m.PREFIX + '/settings')
        self.assertEqual(status, 200)
        self.assertFalse(json.loads(body)['live'])
        self.assertEqual(headers['Cache-Control'], 'no-store')
        status, _, _ = self.request(m.PREFIX + '/applications', {}, {'Origin': self.server.origin, 'Content-Type': 'application/json'})
        self.assertEqual(status, 503)
        with self.server.store.connect() as db:
            self.assertEqual(db.execute('SELECT count(*) FROM applications').fetchone()[0], 0)

    def test_origin_and_admin_auth(self):
        self.assertEqual(self.request(m.PREFIX + '/applications', {}, {'Origin': 'https://other.example', 'Content-Type': 'application/json'})[0], 403)
        self.assertEqual(self.request(m.PREFIX + '/admin')[0], 401)
        auth = 'Basic ' + base64.b64encode(b'club:test-password-for-local-checks').decode()
        status, _, body = self.request(m.PREFIX + '/admin/applications', headers={'Authorization': auth})
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(body)['applications'], [])

    def test_private_files_not_served(self):
        for path in ('/server/membership_server.py', '/docs/digitale-aufnahme.md', '/assets/../server/membership_server.py', '/../README.md'):
            self.assertEqual(self.request(path)[0], 404, path)
        self.assertEqual(self.request('/')[0], 200)

    def test_live_flow_without_sending_mail(self):
        self.server.cfg.update(mandateText='Testmandat', privacyText='Testdatenschutz')
        headers = {'Origin': self.server.origin, 'Content-Type': 'application/json'}
        raw = dict(firstName='Test', lastName='Person', street='Teststraße 1', postcode='51674', city='Wiehl',
                   email='test@example.org', birthDate='1990-01-01', membership='active', accountHolder='Test Person',
                   iban='DE89370400440532013000', applicationConsent=True, mandateConsent=True, privacyRead=True,
                   photoConsent=False, version=self.server.cfg['version'])
        with patch.object(m, 'live_ready', return_value=True):
            self.assertEqual(self.request(m.PREFIX + '/applications', raw, headers)[0], 202)
            with self.server.store.connect() as db:
                body = db.execute('SELECT body FROM outbox').fetchone()[0]
                app_id = db.execute('SELECT id FROM applications').fetchone()[0]
            token = body.split('/mitgliedschaft-bestaetigen.html#')[1].split('\n')[0]
            status, _, body = self.request(m.PREFIX + '/confirmation-info', {'token': token}, headers)
            self.assertEqual(status, 200)
            self.assertIn('Testmandat', json.loads(body)['text'])
            self.assertEqual(self.request(m.PREFIX + '/confirm', {'token': token}, headers)[0], 200)
        auth = 'Basic ' + base64.b64encode(b'club:test-password-for-local-checks').decode()
        status, _, _ = self.request(m.PREFIX + '/admin/status', {'id': app_id, 'status': 'accepted'}, {**headers, 'Authorization': auth})
        self.assertEqual(status, 200)
        with self.server.store.connect() as db:
            self.assertEqual(db.execute('SELECT status FROM applications').fetchone()[0], 'accepted')
            self.assertEqual(db.execute('SELECT count(*) FROM outbox').fetchone()[0], 3)


if __name__ == '__main__':
    unittest.main()
