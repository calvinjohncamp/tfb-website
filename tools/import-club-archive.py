"""Build the Clubarchiv from a read-only snapshot of the old WordPress site."""
import argparse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from gzip import open as gzip_open
from hashlib import sha256
from html import escape, unescape
from html.parser import HTMLParser
from io import BytesIO
import json
from pathlib import Path
import re
import unicodedata
from urllib.parse import quote, unquote, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets/clubarchiv'
ROUTE = '#club/archiv/beitrag/'
SITE = 'https://www.tfbielstein.de/'
ALLOWED = set('p div span h2 h3 h4 h5 h6 ul ol li dl dt dd table thead tbody tfoot tr th td figure figcaption blockquote strong b em i u s sup sub pre code br hr a img'.split())
VOID = {'img', 'br', 'hr'}
DROP = {'script', 'style', 'form', 'button', 'svg', 'template', 'iframe', 'object', 'embed'}
FILES = {'.pdf', '.mp4', '.mp3', '.pptx', '.docx', '.xlsx', '.zip'}
PICTURES = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.tif', '.tiff'}
PROTECTED = {'clubmeisterschaften-doppel-2023', 'clubmeisterschaften-2023-ergebnisse', 'cm23-ergebniss-melden', 'clubmeisterschaften-2023'}
SERVICE = {'start', 'beitrag', 'galerie', 'training', 'my-calendar', 'platzreservierung', 'activation-required',
           'maven-registration-successful-page', 'maven-registration-page', 'maven-member'}
CURRENT = {
    'tennisfreunde': '#club', 'vorstand-ansprechpartner': '#club', 'portraet': '#club',
    'allgemeines': '#club', 'die-aktuellen-mitgliedsbeitraege': '#club', 'anmeldformular': '#aufnahme',
    'trainer': '#sport/training', 'schnuppertraining': '#sport/training', 'mannschaften': '#sport',
    'satzung-des-tfb-e-v': '#satzung', 'impressum': '#impressum',
}
GALLERY_ALIASES = {'galerie-2024': '7950', 'galerie-2023': '7596', 'galerie-2022': '6332'}
DUPLICATES = {
    '50-jahre-tennisfreunde-bielstein-ein-unvergessliches-jubilaeum': '#home/h-50',
    'clubmeisterschaften-der-jugend': '#aktuell/beitrag/b-mv3zxn57',
    'juniorinnen-u18-bauen-siegesserie-aus': '#aktuell/beitrag/b-mv3zr4uq',
}


def clean_text(value):
    value = re.sub(r'<[^>]*>', ' ', value)
    return ' '.join(unescape(value).split())


def search_text(value):
    return ''.join(c for c in unicodedata.normalize('NFD', value.lower()) if not unicodedata.combining(c)).replace('ß', 'ss')


def safe_url(value, base):
    try:
        parts = urlsplit(urljoin(base, value.strip()))
        if parts.scheme not in {'http', 'https'} or not parts.hostname or parts.username or parts.password:
            return ''
        if parts.hostname in {'tfbielstein.de', 'www.tfbielstein.de'}:
            parts = parts._replace(scheme='https', netloc='www.tfbielstein.de')
        return parts._replace(path=quote(parts.path, safe="/%:@!$&'()*+,;=-._~"),
                              query=quote(parts.query, safe="%/?@!$&'()*+,;=:-._~")).geturl()
    except ValueError:
        return ''


def own_media(url):
    parsed = urlsplit(url)
    return parsed.hostname == 'www.tfbielstein.de' and parsed.path.startswith(('/wp-content/uploads/', '/wp-content/gallery/'))


def media_key(url):
    return urlunsplit(urlsplit(url)._replace(query='', fragment=''))


def image_markup(src, alt=''):
    return f'<img src="{escape(src, quote=True)}" alt="{escape(alt, quote=True)}" loading="lazy" decoding="async">'


class Media:
    def __init__(self, records):
        self.records = {item['id']: item for item in records}
        self.variants = {}
        self.jobs = {}
        for item in records:
            original = media_key(item['source_url'])
            sizes = item['media_details'].get('sizes', {})
            copy = sizes.get('1536x1536') or sizes.get('large') or {}
            if item['mime_type'].startswith('image/'):
                urls = [original] + [media_key(size['source_url']) for size in sizes.values() if size.get('source_url')]
                for url in urls:
                    self.variants[url] = (original, copy.get('source_url', original))

    def ref(self, url, thumbnail=""):
        url = media_key(url)
        suffix = Path(urlsplit(url).path).suffix.lower()
        if not own_media(url) or suffix not in PICTURES | FILES:
            return ''
        original, source = self.variants.get(url, (url, url))
        photo = suffix in PICTURES
        stem = sha256(original.encode()).hexdigest()[:22]
        name = stem + ('.webp' if photo else suffix)
        fallback = thumbnail or (self.jobs[name][2] if name in self.jobs else '')
        self.jobs[name] = (source, original, fallback, photo)
        return f'assets/clubarchiv/medien/{name}'

    def download(self, job):
        name, (source, original, thumbnail, photo) = job
        destination = DEST / 'medien' / name
        if destination.is_file():
            return name, None, False
        error = None
        for url in dict.fromkeys(filter(None, (source, original, thumbnail))):
            try:
                request = Request(url, headers={'User-Agent': 'TFB-Clubarchiv/1.0'})
                with urlopen(request, timeout=16) as response:
                    data = response.read()
                    if not data or response.headers.get_content_type() == 'text/html':
                        raise ValueError('Keine Mediendatei')
                if photo:
                    with Image.open(BytesIO(data)) as image:
                        image = ImageOps.exif_transpose(image)
                        image.thumbnail((1600, 1600))
                        mode = 'RGBA' if 'A' in image.getbands() or 'transparency' in image.info else 'RGB'
                        image.convert(mode).save(destination.with_suffix('.part'), 'WEBP', quality=83)
                else:
                    destination.with_suffix('.part').write_bytes(data)
                destination.with_suffix('.part').replace(destination)
                return name, None, url == thumbnail
            except Exception as exc:
                error = str(exc)
        return name, {'url': original, 'error': error}, False


class Gallery(HTMLParser):
    def __init__(self):
        super().__init__()
        self.photos = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag != 'a' or not attrs.get('data-image-id'):
            return
        url = safe_url(attrs.get('href', ''), SITE)
        if own_media(url):
            caption = attrs.get('data-description') or attrs.get('title') or attrs.get('data-title') or ''
            thumbnail = safe_url(attrs.get('data-thumbnail') or '', SITE)
            self.photos[media_key(url)] = (caption, thumbnail if own_media(thumbnail) else '')


class Article(HTMLParser):
    def __init__(self, url, paths, media):
        super().__init__()
        self.url = url
        self.paths = paths
        self.media = media
        self.out = []
        self.skip = []
        self.images = []
        self.external_images = []
        self.embeds = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in DROP:
            if tag not in {'embed'}:
                self.skip.append(tag)
            if tag in {'iframe', 'embed'}:
                target = safe_url(attrs.get('src', ''), self.url)
                if target and target != self.url:
                    self.embeds.append(target)
            return
        if self.skip or tag not in ALLOWED:
            return
        if tag == 'img':
            target = safe_url(attrs.get('data-src') or attrs.get('src') or '', self.url)
            ref = self.media.ref(target)
            if ref:
                self.images.append(ref)
                self.out.append(image_markup(ref, attrs.get('alt', '')))
            elif target and target != self.url:
                self.external_images.append(target)
                self.out.append(f'<a href="{escape(target, quote=True)}" target="_blank" rel="noopener noreferrer">Bild auf der Quellseite</a>')
            return
        if tag == 'a':
            original = attrs.get('href') or ''
            target = safe_url(original, self.url) if original else ''
            local = self.media.ref(target) if target else ''
            parts = urlsplit(target)
            internal = self.paths.get(unquote(parts.path).rstrip('/')) if parts.hostname == 'www.tfbielstein.de' and not parts.query else ''
            target = local or internal or target
            if target:
                external = ' target="_blank" rel="noopener noreferrer"' if target.startswith(('http://', 'https://')) else ''
                self.out.append(f'<a href="{escape(target, quote=True)}"{external}>')
                return
            self.out.append('<a>')
            return
        columns = ''.join(f' {key}="{attrs[key]}"' for key in ('colspan', 'rowspan')
                          if tag in {'td', 'th'} and (attrs.get(key) or '').isdigit())
        self.out.append(f'<{tag}{columns}>')

    def handle_endtag(self, tag):
        if self.skip:
            if self.skip[-1] == tag:
                self.skip.pop()
            return
        if tag in ALLOWED - VOID:
            self.out.append(f'</{tag}>')

    def handle_data(self, data):
        if not self.skip:
            self.out.append(escape(re.sub(r'ngg_shortcode_\d+_placeholder', '', data)))


def classify(item, title):
    slug = item['slug']
    label = f'{title} {slug}'.lower()
    date = item['date'][:10]
    year = date[:4]
    event_years = [candidate for candidate in re.findall(r'\b20\d{2}\b', title + ' ' + slug)
                   if 2000 <= int(candidate) <= int(year) + 1]
    if event_years:
        year = event_years[-1]
    open_related = ('bielstein-open' in slug or 'bielsteinopen' in slug or
                    re.fullmatch(r'(?:presse|tuni?erzeitung|turnierzeitung|spielertableau|das-turnier)-20\d{2}', slug) or
                    'bielstein open' in label or slug in {'galerie-2022', 'galerie-2023', 'galerie-2024'})
    topics = []
    if open_related:
        topics.append('Bielstein Open')
    if 'galerie' in label or 'fotogalerie' in label:
        topics.append('Fotogalerien')
    if 'tfb-life' in slug:
        topics.append('TFB-Life')
    if any(word in label for word in ('chronik', 'historie', 'jubiläum', '40-jahre', '50-jahre')):
        topics.append('Chronik')
    if re.search(r'mannschaft|herren|damen|junior|medenspiel', label):
        topics.append('Mannschaften')
    if not topics:
        topics.append('Vereinsleben')
    series = f'Bielstein Open {year}' if open_related and year in {'2021', '2022', '2023', '2024'} else ''
    # A migrated WordPress page can have a different creation date from the actual event.
    display = date if not event_years or date.startswith(year) else ''
    return topics, series, year, display


def load_items(source):
    return {kind: json.loads((source / f'{kind}.json').read_text()) for kind in ('pages', 'posts', 'media')}


def gallery_markup(source, item, media):
    gallery = Gallery()
    first = source / f"page-{item['id']}.html"
    if first.exists():
        gallery.feed(first.read_text(errors='replace'))
    for followup in sorted(source.glob(f"page-{item['id']}-more-*.html")):
        gallery.feed(followup.read_text(errors='replace'))
    groups = defaultdict(list)
    refs = []
    for url, (caption, thumbnail) in gallery.photos.items():
        ref = media.ref(url, thumbnail)
        if not ref:
            continue
        refs.append(ref)
        group = unquote(urlsplit(url).path).split('/')[-2]
        alt = clean_text(caption)
        groups[group].append(f'<a href="{ref}" data-archive-photo aria-label="{escape(alt or "Foto öffnen", quote=True)}">{image_markup(ref, alt)}</a>')
    if not refs:
        return '', []
    body = ['<h2>Fotogalerie</h2>']
    for group, photos in groups.items():
        label = escape(group.replace('-', ' ').replace('_', ' '))
        body.append(f'<details><summary>{label} · {len(photos)} Fotos</summary><div class="archive-gallery">{"".join(photos)}</div></details>')
    return ''.join(body), refs


def write_data(data):
    DEST.mkdir(parents=True, exist_ok=True)
    pending = DEST / 'bestand.json.part'
    pending.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    pending.replace(DEST / 'bestand.json')


# Einladungen und Terminlisten aus den alten redaktionellen Beiträgen.
PAST_ANNOUNCEMENTS = {
    '8674': '2026-04-19', '5785': '2022-08-06', '5691': '2022-05-07',
    '4848': '2021-07-31', '3315': '2020-06-06', '1686': '2016-08-27',
    '410': '2015-05-02', '3414': '2019-07-13', '3228': '', '3032': '2018-07-28', '2683': '',
    '1989': '2017-03-31', '1963': '2016-12-17', '1682': '2016-07-18',
    '1590': '', '1072': '2015-09-06', '853': '', '642': '', '189': '', '139': '2015-03-20',
}


def calendar_items(path, paths, media):
    if not path:
        return []
    opener = gzip_open if path.suffix == '.gz' else open
    with opener(path, 'rt') as source:
        days = json.load(source)
    occurrences = {}
    for group in days.values():
        for event in group:
            categories = {category['category_name'] for category in event.get('categories', [])
                          if category.get('category_private') == '0'}
            public = event.get('event_approved') == '1' and event.get('event_status') == '1'
            title = clean_text(event['event_title']).replace(r'\"', '"')
            open_training = ('Training' in categories and event.get('event_recur') == 'S1'
                             and re.search(r'schnuppertraining|jugend.*camp|tenniscamp', title, re.I))
            if public and title and (categories & {'Events', 'Bielstein Open'} or open_training):
                date = event['occur_begin'][:10]
                key = date, search_text(title)
                # Mehrtägige Termine stehen je Kalendertag im Export. Bei doppelten
                # Einträgen für denselben Beginn behalten wir die ausführlichere Fassung.
                score = (event['occur_end'][:10], bool(event['event_desc']), bool(event['event_image']),
                         event['event_time'] != '00:00:00')
                if key not in occurrences or score > occurrences[key][0]:
                    occurrences[key] = (score, event, title)
    result = []
    for (date, _), (_, event, title) in occurrences.items():
        url = urljoin(SITE, '?p=' + event['event_post']) if event['event_post'].isdigit() and event['event_post'] != '0' else urljoin(SITE, 'my-calendar/')
        parser = Article(url, paths, media)
        parser.feed(event['event_desc'] or event['event_short'] or '')
        end = event['occur_end'][:10]
        time = event['occur_begin'][11:16]
        place = clean_text(event['event_label'])
        meta = [f'{time} Uhr' if time != '00:00' else '',
                'bis ' + '.'.join(reversed(end.split('-'))) if end > date else '', place]
        info = ' · '.join(part for part in meta if part)
        body = (f'<p>{escape(info)}</p>' if info else '') + ''.join(parser.out)
        image = safe_url(event['event_image'], url) if event['event_image'] else ''
        cover = (media.ref(image) if image else '') or next(iter(parser.images), '')
        topics = ['Vergangene Termine']
        if re.search(r'bielstein[ -]+open', title, re.I):
            topics.append('Bielstein Open')
        result.append({'id': 'kalender-' + event['occur_id'], 'title': title, 'date': date,
                       'year': date[:4], 'topic': topics[0], 'topics': topics, 'event': True,
                       'summary': clean_text(body), 'cover': cover, 'source': url, 'html': body,
                       'search': search_text(f'{title} {date} {info} {clean_text(body)}')})
    return result


def build(source, report, download, calendar, reuse_failures):
    records = load_items(source)
    media = Media(records['media'])
    items = []
    selected = [(kind, item) for kind in ('posts', 'pages') for item in records[kind]
                if item['slug'] not in PROTECTED | SERVICE]
    path_for = {unquote(urlsplit(item['link']).path).rstrip('/'):
                f"{ROUTE}{GALLERY_ALIASES.get(item['slug'], item['id'])}"
                for _, item in selected}
    source_issues = []
    for kind, item in selected:
        slug = item['slug']
        if slug in GALLERY_ALIASES:
            continue
        original = item['link']
        title = clean_text(item['title']['rendered'])
        topics, series, year, display = classify(item, title)
        existing = DUPLICATES.get(slug) or CURRENT.get(slug)
        raw = item['content']['rendered']
        parser = Article(original, path_for, media)
        parser.feed(raw)
        body = ''.join(parser.out)
        gallery, gallery_refs = gallery_markup(source, item, media)
        if parser.embeds:
            body += '<ul>' + ''.join(f'<li><a href="{escape(url, quote=True)}" target="_blank" rel="noopener noreferrer">Externe Einbettung öffnen</a></li>' for url in dict.fromkeys(parser.embeds)) + '</ul>'
        body += gallery
        if not clean_text(body) and not parser.images and not gallery_refs and not parser.embeds:
            source_issues.append({'slug': slug, 'reason': 'Kein öffentlicher Seiteninhalt im Export'})
        if 'ngg_shortcode_' in raw and not gallery_refs:
            source_issues.append({'slug': slug, 'reason': 'Galerieplatzhalter ohne auffindbare Bilder'})
        if parser.external_images:
            source_issues.append({'slug': slug, 'reason': 'Externe Bilder verlinkt', 'urls': sorted(set(parser.external_images))})
        feature = media.records.get(item['featured_media'])
        if item['featured_media'] and not feature:
            source_issues.append({'slug': slug, 'reason': 'Beitragsbild nicht öffentlich in der Medienschnittstelle'})
        cover = (media.ref(feature['source_url']) if feature else '') or next(iter(parser.images + gallery_refs), '')
        summary = clean_text(''.join(parser.out))
        summary = summary[:180].rsplit(' ', 1)[0] + ' …' if len(summary) > 180 else summary
        announcement = str(item['id']) in PAST_ANNOUNCEMENTS
        if announcement:
            display = PAST_ANNOUNCEMENTS[str(item['id'])] or display
            topics = ['Vergangene Termine', *topics]
        items.append({'id': str(item['id']), 'event': announcement, 'title': title, 'date': display, 'year': year, 'topic': topics[0], 'topics': topics,
                      'series': series, 'summary': summary, 'cover': cover, 'hasInlineImage': bool(parser.images or gallery_refs),
                      'source': original, 'existing': existing or '', 'html': body,
                      'search': search_text(f'{title} {year} {" ".join(topics)} {clean_text(body)}')})
    events = calendar_items(calendar, path_for, media)
    items.extend(events)
    items.sort(key=lambda item: (item['year'], item['date'], item['id']), reverse=True)
    highlights = [next(item['id'] for item in items if item['source'].rstrip('/').endswith('/' + slug)) for slug in (
        '50-jahre-tennisfreunde-bielstein-ein-unvergessliches-jubilaeum', 'bielstein-open-2024',
        'chronik-der-tennisfreunde-bielstein', 'tfb-life')]
    audit = {'source': {kind: len(rows) for kind, rows in records.items()}, 'archive': len(items),
             'calendarEvents': len(events), 'existing': {**CURRENT, **DUPLICATES}, 'protected': sorted(PROTECTED), 'service': sorted(SERVICE),
             'galleryAliases': GALLERY_ALIASES, 'issues': source_issues, 'mediaJobs': len(media.jobs)}
    data = {'items': items, 'highlights': highlights}
    if download:
        (DEST / 'medien').mkdir(parents=True, exist_ok=True)
        previous = json.loads(report.read_text()) if reuse_failures and report.exists() else {}
        failures = {name: error for name, error in previous.get('mediaFailures', {}).items()
                    if name in media.jobs and not (DEST / 'medien' / name).is_file()}
        thumbnails = [name for name in previous.get('thumbnailFallbacks', []) if name in media.jobs]
        pending = sorted((name, job) for name, job in media.jobs.items()
                         if name not in failures and not (DEST / 'medien' / name).is_file())
        with ThreadPoolExecutor(max_workers=8) as pool:
            for index, (name, error, thumbnail) in enumerate(pool.map(media.download, pending), 1):
                if error:
                    failures[name] = error
                if thumbnail:
                    thumbnails.append(name)
                if index % 200 == 0:
                    print(f'{index}/{len(pending)} neue Dateien geprüft', flush=True)
        for item in items:
            for name, error in failures.items():
                local = f'assets/clubarchiv/medien/{name}'
                if item['cover'] == local:
                    item['cover'] = ''
                if local in item['html']:
                    item['html'] = re.sub(r'<a href="' + re.escape(local) + r'" data-archive-photo[^>]*><img[^>]*></a>', '', item['html'])
                    item['html'] = re.sub(r'<img src="' + re.escape(local) + r'"[^>]*>', '', item['html'])
                    item['html'] = item['html'].replace(f'href="{local}"', f'href="{escape(error["url"], quote=True)}"')
            item['hasInlineImage'] = '<img ' in item['html']
            def update_gallery(match):
                count = match[2].count('<img ')
                return (f'<details><summary>{match[1]} · {count} Fotos</summary>'
                        f'<div class="archive-gallery">{match[2]}</div></details>') if count else ''
            item['html'] = re.sub(r'<details><summary>(.*?) · \d+ Fotos</summary><div class="archive-gallery">(.*?)</div></details>',
                                  update_gallery, item['html'])
        audit['thumbnailFallbacks'] = thumbnails
        audit['mediaFailures'] = failures
    write_data(data)
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n')
    print(f"{len(items)} Archiveinträge, {len(media.jobs)} zugehörige Dateien", flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    parser.add_argument('report', type=Path)
    parser.add_argument('--download', action='store_true')
    parser.add_argument('--calendar', type=Path)
    parser.add_argument('--reuse-failures', action='store_true')
    arguments = parser.parse_args()
    build(arguments.source, arguments.report, arguments.download, arguments.calendar, arguments.reuse_failures)
