import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://tfb-tally-test.invalid';
const browser = await chromium.launch({ headless: true,
  ...(process.env.TFB_CHROME_PATH ? { executablePath: process.env.TFB_CHROME_PATH } : {}) });
try {
  const page = await browser.newPage({ serviceWorkers: 'block' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    const path = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto(origin);
  await page.waitForFunction(() => window.TFB?.ui);
  await page.evaluate(async () => {
    TFB.ui.state.member = TFB.api.attachDirectoryMember({ id: 'tally-test', firstName: 'Anna-Lena', lastName: 'Test', email: 'tally@example.invalid', active: true });
    TFB.ui.state.member = await TFB.api.acceptConsent();
    TFB.api.tally = async () => ['Brandt', 'Dietrich', 'Kämper', 'Müller-Schneider', 'von der Linden'].map((lastName, i) => ({
      lastName, firstName: 'Anna-Lena', counts: { Wasser: 18 },
      cats: { drinks: 18, kranz: 1, snacks: 2, spielbetrieb: 1, equipment: 1 }, isMe: i === 2,
    }));
    location.hash = '#strichliste';
  });
  await page.locator('.tally-row').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  for (const width of [1920, 1440, 1024, 834, 768, 720, 700, 680, 640, 639, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const layout = await page.evaluate(() => {
      const paper = document.querySelector('.tally-paper');
      const narrow = paper.clientWidth <= 639 || innerWidth <= 639;
      const headings = [...paper.querySelector('.tally-head').children].slice(1).map(el => el.getBoundingClientRect());
      const rows = [...paper.querySelectorAll('.tally-row')].map(row => {
        const name = row.querySelector('.paper-name').getBoundingClientRect();
        const cells = [...row.querySelectorAll('.tally-cell')].map(el => el.getBoundingClientRect());
        return {
          aligned: cells.every((box, i) => Math.abs(box.x - headings[i].x) < 1 && Math.abs(box.width - headings[i].width) < 1),
          beside: name.right <= cells[0].x && Math.abs(name.y + name.height / 2 - cells[0].y - cells[0].height / 2) < 1,
          above: name.bottom <= cells[0].y,
          namesFit: [...row.querySelectorAll('.paper-name-part')].every(part => {
            const range = document.createRange(); range.selectNodeContents(part);
            const box = part.getBoundingClientRect();
            return range.getClientRects().length === 1 && box.x >= name.x && box.right <= name.right + 1;
          }),
          drinksFit: row.querySelector('.drinks').scrollWidth <= cells[0].width + 1,
        };
      });
      const labels = [...paper.querySelectorAll('.tally-head b')].filter(el => getComputedStyle(el).display !== 'none').map(el => el.getBoundingClientRect());
      const headingsFit = labels.every((box, i) => !i || labels[i - 1].right < box.x);
      return { narrow, paperWidth: paper.clientWidth, overflow: document.documentElement.scrollWidth > innerWidth, headingsFit, rows };
    });
    assert.equal(layout.overflow, false, `No overflow at ${width}px`);
    assert.ok(layout.headingsFit, `Headings do not overlap at ${width}px`);
    for (const row of layout.rows) {
      assert.ok(row.aligned && row.namesFit && row.drinksFit, JSON.stringify({ width, ...layout }));
      assert.ok(layout.narrow ? row.above : row.beside, JSON.stringify({ width, ...layout }));
    }
    if ([1440, 700, 390].includes(width)) await page.screenshot({ path: `/tmp/tfb-tally-fixed-${width}.png`, fullPage: true });
    console.log(`PASS ${width}px: ${layout.paperWidth}px list, names ${layout.narrow ? 'above' : 'beside'} aligned columns`);
  }
  await page.locator('.tally-row').first().click();
  await page.locator('.paper-detail').waitFor();
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
