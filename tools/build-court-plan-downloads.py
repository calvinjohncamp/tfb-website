"""Build the one-page A4 landscape plan from the same data used by the website.

Requires reportlab, fonttools, svglib, pypdf and Poppler (pdftoppm).
The JPEG is rendered from the checked PDF at 300 dpi, not from a second layout.
"""
from pathlib import Path
import json
import subprocess
import tempfile
import math

from fontTools.ttLib import TTFont as FontToolsFont
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen.canvas import Canvas
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/docs'
DATA = json.loads(subprocess.check_output([
    'node', '-e', "const vm=require('vm'),fs=require('fs'),c={TFB:{}};"
    "vm.runInNewContext(fs.readFileSync('assets/data/court-plan.js','utf8'),c);"
    "process.stdout.write(JSON.stringify(c.TFB.courtPlanData));"
], cwd=ROOT, text=True))
assert len(DATA['days']) == 5 and len(DATA['entries']) == 29


def fonts(folder):
    for name, source, weight in [('Body', 'dm-sans', 450), ('Bold', 'dm-sans', 700), ('Display', 'bricolage-grotesque', 700)]:
        font = FontToolsFont(ROOT / f'assets/fonts/editorial/{source}.ttf')
        axes = {axis.axisTag: (weight if axis.axisTag == 'wght' else axis.defaultValue) for axis in font['fvar'].axes}
        instance = instantiateVariableFont(font, axes, inplace=False)
        path = folder / f'{name}.ttf'
        instance.save(path)
        pdfmetrics.registerFont(TTFont(name, str(path)))


def text(canvas, x, y, value, size=9, font='Body', color='#171717'):
    canvas.setFillColor(HexColor(color))
    canvas.setFont(font, size)
    canvas.drawString(x, y, value)


def court(canvas, x, y, width, accent, ink):
    canvas.saveState()
    canvas.translate(x, y)
    # Positive CSS rotation tilts clockwise; PDF coordinates point upwards.
    canvas.rotate(-8)
    height = width * .632
    canvas.setFillColor(HexColor(accent))
    canvas.setStrokeColor(HexColor(ink))
    canvas.setLineWidth(.8)
    canvas.rect(0, 0, width, height, fill=1, stroke=1)
    canvas.setLineWidth(.5)
    for line_y in [height * .16, height * .84]:
        canvas.line(0, line_y, width, line_y)
    for line_x in [width * .24, width * .76]:
        canvas.line(line_x, height * .16, line_x, height * .84)
    canvas.line(width / 2, 0, width / 2, height)
    canvas.line(width * .24, height / 2, width * .76, height / 2)
    canvas.restoreState()


def build(world, ink, accent, soft):
    width, height = landscape(A4)
    path = OUT / f'tfb-platzbelegung-sommer-2027-{world}.pdf'
    canvas = Canvas(str(path), pagesize=(width, height), pageCompression=1)
    canvas.setTitle('TFB Platzbelegung - Sommer 2027 - Montag bis Freitag')
    canvas.setAuthor('Tennisfreunde Bielstein e.V.')
    canvas.setSubject('Feste Platzbelegung, A4 quer, eine Seite')
    canvas.setFillColor(HexColor('#FFFFFF'))
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    logo = svg2rlg(str(ROOT / f'assets/brand/tfb-logo-{world}.svg'))
    logo_scale = 94 / logo.width
    logo_height = logo.height * logo_scale
    logo.scale(logo_scale, logo_scale)
    renderPDF.draw(logo, canvas, 28, height - 68)
    header_center_y = height - 68 + logo_height / 2
    title = 'Platzbelegung'
    subtitle = 'SOMMER 2027  /  MONTAG BIS FREITAG'
    gap = 18
    title_ascent = pdfmetrics.getAscent('Display') * 24 / 1000
    subtitle_descent = pdfmetrics.getDescent('Bold') * 9 / 1000
    title_baseline = header_center_y - (title_ascent - gap + subtitle_descent) / 2
    text(canvas, (width - pdfmetrics.stringWidth(title, 'Display', 24)) / 2, title_baseline, title, 24, 'Display', ink)
    text(canvas, (width - pdfmetrics.stringWidth(subtitle, 'Bold', 9)) / 2, title_baseline - gap, subtitle, 9, 'Bold', ink)
    angle = math.radians(-8)
    court_width, court_height = 78, 78 * .632
    court_offset_x = court_width / 2 * math.cos(angle) - court_height / 2 * math.sin(angle)
    court_offset_y = court_width / 2 * math.sin(angle) + court_height / 2 * math.cos(angle)
    court(canvas, width - 75 - court_offset_x, header_center_y - court_offset_y, court_width, accent, ink)

    left, top = 28, height - 90
    total, court_width, header_height, row_height = width - 56, 43, 30, 64
    column_width = (total - court_width) / 5
    canvas.setFillColor(HexColor(ink))
    canvas.roundRect(left, top - header_height, total, header_height, 4, fill=1, stroke=0)
    text(canvas, left + 8, top - 19, 'Platz', 8, 'Bold', '#FFFFFF')
    for index, day in enumerate(DATA['days']):
        text(canvas, left + court_width + index * column_width + 9, top - 19, day, 10, 'Bold', '#FFFFFF')
    bottom = top - header_height - row_height * len(DATA['courts'])
    for row, court_number in enumerate(DATA['courts']):
        row_top = top - header_height - row * row_height
        canvas.setFillColor(HexColor('#F5F5F3'))
        canvas.rect(left, row_top - row_height, court_width, row_height, fill=1, stroke=0)
        text(canvas, left + 15, row_top - 37, str(court_number), 16, 'Display', ink)
        canvas.setStrokeColor(HexColor('#DADBD7'))
        canvas.setLineWidth(.45)
        canvas.line(left, row_top - row_height, left + total, row_top - row_height)
        for index, _ in enumerate(DATA['days']):
            x = left + court_width + index * column_width
            canvas.setStrokeColor(HexColor('#DADBD7'))
            canvas.setLineWidth(.45)
            canvas.setDash()
            canvas.line(x, row_top, x, row_top - row_height)
            bookings = [entry for entry in DATA['entries'] if entry['court'] == court_number and entry['day'] == index]
            if not bookings:
                text(canvas, x + 10, row_top - 35, '-', 10, 'Body', '#8A8A86')
            for offset, entry in enumerate(bookings):
                card_height = 26 if len(bookings) > 1 else 38
                card_top = row_top - (4 + offset * 30 if len(bookings) > 1 else 13)
                card_x, card_width = x + 6, column_width - 12
                background = soft if entry['kind'] == 'youth' else '#F3F4F2' if entry['kind'] == 'team' else '#FFFFFF'
                canvas.setFillColor(HexColor(background))
                canvas.roundRect(card_x, card_top - card_height, card_width, card_height, 2, fill=1, stroke=0)
                canvas.setStrokeColor(HexColor(accent if entry['kind'] == 'youth' else ink))
                canvas.setLineWidth(2 if entry['kind'] != 'coach' else .6)
                if entry['kind'] == 'coach':
                    canvas.setDash(2, 2)
                    canvas.rect(card_x, card_top - card_height, card_width, card_height, fill=0, stroke=1)
                    canvas.setDash()
                else:
                    canvas.line(card_x, card_top - card_height + 2, card_x, card_top - 2)
                label_size = 9.3
                assert pdfmetrics.stringWidth(entry['label'], 'Bold', label_size) <= card_width - 16, entry
                text(canvas, card_x + 8, card_top - (10 if card_height == 26 else 14), entry['label'], label_size, 'Bold', ink)
                times = f"{entry['start']}:00 - {entry['end']}:00 Uhr"
                text(canvas, card_x + 8, card_top - (21 if card_height == 26 else 27), times, 7.7, 'Body', ink)

    footer = bottom - 22
    legends = [(ink, 'Mannschaft'), (soft, 'Jugendtraining'), ('#FFFFFF', 'Trainer')]
    x = left
    for color, label in legends:
        canvas.setFillColor(HexColor(color))
        canvas.setStrokeColor(HexColor(ink))
        canvas.setLineWidth(.5)
        if label == 'Trainer':
            canvas.setDash(1.5, 1.5)
        canvas.rect(x, footer - 1, 7, 7, fill=1, stroke=1)
        canvas.setDash()
        text(canvas, x + 12, footer, label, 8, 'Body', ink)
        x += 108
    text(canvas, left, footer - 18, 'Feste Trainingszeiten. Kein Eintrag = keine feste Belegung im Sommerplan. Keine Live-Verfügbarkeit.', 7.5, 'Body', '#64645F')
    text(canvas, left, footer - 31, 'Samstag und Sonntag sind nicht Bestandteil dieses Trainingsplans. Vormittags sind keine festen Zeiten eingetragen.', 7.5, 'Body', '#64645F')
    canvas.showPage()
    canvas.save()
    reader = PdfReader(path)
    assert len(reader.pages) == 1
    assert abs(float(reader.pages[0].mediabox.width) - width) < .1
    assert abs(float(reader.pages[0].mediabox.height) - height) < .1
    extracted = reader.pages[0].extract_text()
    from collections import Counter
    lines = [line.strip() for line in extracted.splitlines()]
    lines = lines[:lines.index('Mannschaft')]  # Only matrix content, before the legend.
    for label, count in Counter(entry['label'] for entry in DATA['entries']).items():
        assert lines.count(label) == count, (label, count, lines.count(label))
    expected_times = Counter(f"{entry['start']}:00 - {entry['end']}:00 Uhr" for entry in DATA['entries'])
    assert Counter(line for line in lines if line.endswith(' Uhr')) == expected_times
    subprocess.run(['pdftoppm', '-singlefile', '-r', '300', '-jpeg', '-jpegopt', 'quality=94', str(path), str(path.with_suffix(''))], check=True)
    print(f'{path.name}: eine A4-Querformatseite, 29 Belegungen, JPEG mit 300 dpi')


OUT.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory(prefix='tfb-plan-fonts-') as folder:
    fonts(Path(folder))
    build('black-crail', '#171717', '#C4553A', '#EAA18A')
    build('midnight-amber', '#001D3D', '#FFC300', '#FFF2C5')
