import copy
import hashlib
import json
import os
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import patch

import membership_server as m


class MembershipTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.store = m.Store(Path(self.temp.name) / 'applications.sqlite3')
        self.cfg = json.loads((m.ROOT / 'server/membership-settings.example.json').read_text())
        self.cfg.update(mandateText='Testmandat', privacyText='Testdatenschutz', contributionsUrl='https://example.org/beitraege')
        self.raw = dict(firstName='Test', lastName='Person', street='Teststraße 1', postcode='51674', city='Wiehl',
                        email='test@example.org', birthDate='1990-01-01', membership='active', accountHolder='Test Person',
                        iban='DE89370400440532013000', applicationConsent=True, mandateConsent=True, privacyRead=True,
                        photoConsent=False, version=self.cfg['version'])

    def tearDown(self):
        self.temp.cleanup()

    def create(self, raw=None):
        app_id = m.application_create(self.store, m.validate(raw or self.raw, self.cfg), self.cfg)
        with self.store.connect() as db:
            messages = db.execute('SELECT body FROM outbox WHERE application=? ORDER BY id', (app_id,)).fetchall()
        tokens = [body[0].split('/mitgliedschaft-bestaetigen.html#')[1].split('\n')[0] for body in messages]
        return app_id, tokens

    def test_photo_not_collected_and_iban(self):
        self.assertNotIn('photoConsent', m.validate(self.raw, self.cfg))
        self.assertTrue(m.valid_iban(self.raw['iban']))
        self.assertFalse(m.valid_iban(self.raw['iban'][:-1] + '1'))

    def test_invalid_required_fields(self):
        for change in ({'birthDate': '2090-01-01'}, {'email': 'invalid'}, {'iban': 'DE00'},
                       {'privacyRead': False}, {'applicationConsent': 'true'}, {'version': 'old'}, {'website': 'spam'}):
            with self.subTest(change=change), self.assertRaises(ValueError):
                m.validate({**self.raw, **change}, self.cfg)

    def test_minor_requires_guardian(self):
        raw = {**self.raw, 'birthDate': '2015-01-01'}
        with self.assertRaises(ValueError):
            m.validate(raw, self.cfg)
        raw.update(guardianName='Test Person', guardianEmail='parent@example.org', guardianConsent=True)
        data = m.validate(raw, self.cfg)
        self.assertEqual(data['recipient'], 'parent@example.org')
        self.assertFalse(data['separateMandate'])

    def test_different_holder_requires_email(self):
        with self.assertRaises(ValueError):
            m.validate({**self.raw, 'accountHolder': 'Andere Person'}, self.cfg)

    def test_single_confirmation_and_idempotence(self):
        app_id, tokens = self.create()
        self.assertIn('Club', m.confirm(self.store, tokens[0], self.cfg))
        with self.store.connect() as db:
            row = db.execute('SELECT status,application_confirmed,mandate_confirmed FROM applications WHERE id=?', (app_id,)).fetchone()
            mail_count = db.execute('SELECT count(*) FROM outbox').fetchone()[0]
        self.assertEqual(row[0], 'review')
        self.assertTrue(row[1] and row[2])
        m.confirm(self.store, tokens[0], self.cfg)
        with self.store.connect() as db:
            self.assertEqual(db.execute('SELECT count(*) FROM outbox').fetchone()[0], mail_count)

    def test_separate_mandate_both_orders(self):
        for reverse in (False, True):
            app_id, tokens = self.create({**self.raw, 'accountHolder': 'Andere Person', 'accountHolderEmail': 'holder@example.org'})
            if reverse:
                tokens.reverse()
            m.confirm(self.store, tokens[0], self.cfg)
            with self.store.connect() as db:
                self.assertEqual(db.execute('SELECT status FROM applications WHERE id=?', (app_id,)).fetchone()[0], 'pending')
            m.confirm(self.store, tokens[1], self.cfg)
            with self.store.connect() as db:
                self.assertEqual(db.execute('SELECT status FROM applications WHERE id=?', (app_id,)).fetchone()[0], 'review')

    def test_lookup_does_not_confirm(self):
        app_id, tokens = self.create()
        with self.store.connect() as db:
            m.token_lookup(db, tokens[0])
            self.assertEqual(db.execute('SELECT status FROM applications WHERE id=?', (app_id,)).fetchone()[0], 'pending')
            self.assertIsNone(db.execute('SELECT used FROM tokens').fetchone()[0])

    def test_expired_and_wrong_token(self):
        _, tokens = self.create()
        with self.store.connect() as db:
            db.execute('UPDATE tokens SET expires=?', (time.time() - 1,))
        for token in (tokens[0], 'x' * 43, '../bad'):
            with self.subTest(token=token), self.assertRaises(ValueError):
                m.confirm(self.store, token, self.cfg)

    def test_hash_and_no_iban_in_emails(self):
        _, tokens = self.create()
        with self.store.connect() as db:
            stored = db.execute('SELECT hash FROM tokens').fetchone()[0]
            self.assertEqual(stored, hashlib.sha256(tokens[0].encode()).hexdigest())
            for body, in db.execute('SELECT body FROM outbox'):
                self.assertNotIn(self.raw['iban'], body)

    def test_cleanup_and_rate_limit(self):
        self.create()
        with self.store.connect() as db:
            db.execute('UPDATE applications SET created=?', (time.time() - 49 * 3600,))
        self.store.cleanup(90)
        with self.store.connect() as db:
            for table in ('applications', 'tokens', 'outbox'):
                self.assertEqual(db.execute(f'SELECT count(*) FROM {table}').fetchone()[0], 0)
        for _ in range(20):
            self.assertTrue(self.store.throttle('test'))
        self.assertFalse(self.store.throttle('test'))

    def test_live_gate(self):
        self.assertFalse(m.live_ready(self.cfg))
        cfg = {**self.cfg, 'live': True, 'bankApproved': True, 'legalApproved': True}
        env = {name: 'test' for name in ('TFB_SMTP_HOST', 'TFB_SMTP_USER', 'TFB_SMTP_PASSWORD', 'TFB_SMTP_FROM', 'TFB_DATA_DIR')}
        env['TFB_ADMIN_PASSWORD'] = 'x' * 24
        with patch.dict(os.environ, env):
            self.assertTrue(m.live_ready(cfg))
            self.assertFalse(m.live_ready({**cfg, 'bankApproved': False}))

    def test_smtp_failure_keeps_message_for_retry(self):
        self.create()
        with patch.dict(os.environ, {'TFB_SMTP_HOST': 'example.org', 'TFB_SMTP_FROM': 'club@example.org'}), patch.object(m.smtplib, 'SMTP_SSL', side_effect=OSError()):
            m.deliver(self.store, self.cfg)
        with self.store.connect() as db:
            attempts, retry = db.execute('SELECT attempts,next_try FROM outbox').fetchone()
        self.assertEqual(attempts, 1)
        self.assertGreater(retry, time.time())


if __name__ == '__main__':
    unittest.main()
