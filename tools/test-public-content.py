"""Verify that public-content export cannot serialize a whole browser backup."""
import importlib.util
from pathlib import Path
import json
import unittest

spec = importlib.util.spec_from_file_location('public_export', Path(__file__).with_name('export-public-content.py'))
exporter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(exporter)
IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII='


class PublicContentTests(unittest.TestCase):
    def fixture(self):
        return {'format': 'tfb-sicherung', 'version': 1,
                'db': {'members': [{'email': 'PRIVATE-MEMBER'}],
                       'accounts': [{'passwordHash': 'PRIVATE-PASSWORD'}],
                       'community': {'posts': [{'text': 'PRIVATE-CHAT'}]},
                       'site': {'pages': {
                           'home': {'blocks': [{'id': 'public', 'image': 'img:public',
                                               'people': [{'name': 'Public person', 'email': 'PRIVATE-CONTACT',
                                                           'phone': 'PRIVATE-PHONE', 'memberId': 'PRIVATE-ID'}]},
                                              {'_new': True, 'text': 'PRIVATE-DRAFT', 'image': 'img:missing'}]},
                           'private': {'blocks': [{'text': 'PRIVATE-PAGE'}]}},
                           'photoFrames': {'img:public': {'x': 1}, 'img:private': {'x': 2}}}},
                'images': {'img:public': IMAGE, 'img:private': 'PRIVATE-IMAGE'},
                'extra': {'tfb_meet_demo_v2': 'PRIVATE-MEETUP'}}

    def test_only_public_pages_and_referenced_images(self):
        site, files = exporter.extract(self.fixture())
        self.assertNotIn('PRIVATE-', json.dumps(site))
        self.assertEqual(set(site['pages']), {'home'})
        self.assertEqual(len(files), 1)
        image = site['pages']['home']['blocks'][0]['image']
        self.assertTrue(image.startswith('assets/content/'))
        self.assertEqual(set(site['photoFrames']), {image})
        self.assertEqual(len(site['pages']['home']['blocks']), 1)

    def test_public_contact_flags_are_respected(self):
        backup = self.fixture()
        person = backup['db']['site']['pages']['home']['blocks'][0]['people'][0]
        person.update(email='public@example.org', publishEmail=True, publishPhone=False)
        site, _ = exporter.extract(backup)
        exported = site['pages']['home']['blocks'][0]['people'][0]
        self.assertEqual(exported['email'], 'public@example.org')
        self.assertNotIn('phone', exported)
        self.assertNotIn('memberId', exported)

    def test_missing_or_invalid_image_stops_export(self):
        backup = self.fixture()
        del backup['images']['img:public']
        with self.assertRaises(KeyError):
            exporter.extract(backup)
        backup['images']['img:public'] = 'data:image/png;base64,cHJpdmF0ZQ=='
        with self.assertRaises(ValueError):
            exporter.extract(backup)


if __name__ == '__main__':
    unittest.main()
