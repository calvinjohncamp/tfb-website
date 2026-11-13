import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from 'playwright';
import { fixture } from './app-sync-fixture.mjs';
import { publishBrowserSite } from './browser-site-fixture.mjs';
import worker from './worker-test-loader.mjs';
import { prepareLibraryCatalog } from './kiosk-library-catalog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

for (const engine of [chromium, webkit]) {
  const f = await fixture();
  await publishBrowserSite(f);
  await f.commit([
    {kind:'account',id:f.admin.id,revision:0,value:{consentVersion:'tfb-kiosk-preparation-v1',consentedAt:new Date().toISOString()}},
    {kind:'catalog',id:'club',revision:0,value:prepareLibraryCatalog((await f.state()).body.catalog)}
  ]);
  const browser = await engine.launch();
  try {
    const page = await browser.newPage({ serviceWorkers:'block', viewport:{width:1440,height:1050} });
    await page.addInitScript(token => sessionStorage.setItem('tfb_directory_token_v1', token), f.adminToken);
    await page.route('**/*', async route => {
      const req = route.request(), url = new URL(req.url());
      if (url.hostname === 'tfb-api.calvinjohncamp.workers.dev') {
        const res = await worker.fetch(new Request('https://tfb.test'+url.pathname+url.search, {
          method:req.method(), headers:{...req.headers(),'CF-Connecting-IP':'192.0.2.55'},
          ...(req.postData()?{body:req.postData()}:{})
        }),f.env);
        return route.fulfill({status:res.status,headers:Object.fromEntries(res.headers),body:Buffer.from(await res.arrayBuffer())});
      }
      if (url.hostname !== 'joern-kaemper.de') return route.abort();
      const file = resolve(root, '.'+(url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
      const type = {'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.ttf':'font/ttf'}[extname(file)];
      try { return route.fulfill({body:readFileSync(file),contentType:type||'application/octet-stream'}); }
      catch { return route.fulfill({status:404,body:''}); }
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(10000);
    await page.goto('https://joern-kaemper.de/#home');
    await page.locator('[data-action=splash-enter]').click();
    const nav = page.locator('.tfb-admin-links');
    const view = slug => page.evaluate(slug => { location.hash = slug; }, slug);
    const close = async () => { await page.locator('.sheet-close').click(); await page.locator('#sheet-root.open').waitFor({state:'hidden'}); };
    for (const yellow of [true,false]) {
      await view('home');
      const switcher = page.locator('.topbar [data-tfb-brand]');
      if ((await switcher.getAttribute('aria-pressed') === 'true') !== yellow) await switcher.click();
      const bg = yellow ? 'rgb(255, 195, 0)' : 'rgb(196, 85, 58)';
      const fg = yellow ? 'rgb(0, 29, 61)' : 'rgb(0, 0, 0)';
      const color = async (selector, expectedBg=bg, expectedFg=fg) => {
        await page.waitForFunction(({selector, expectedBg, expectedFg}) => {
          const el = document.querySelector(selector);
          if (!el?.isConnected || !el.getClientRects().length) return false;
          const style = getComputedStyle(el);
          return style.backgroundColor === expectedBg && style.color === expectedFg;
        }, {selector, expectedBg, expectedFg}).catch(async error => {
          const actual = await page.evaluate(selector => {
            const el = document.querySelector(selector);
            return el ? [getComputedStyle(el).backgroundColor, getComputedStyle(el).color] : null;
          }, selector);
          throw new Error(selector+' expected '+expectedBg+' / '+expectedFg+' got '+actual, {cause:error});
        });
      };
      if (!(await nav.isVisible())) await page.locator('[data-action=admin-toggle]').click();
      await color('.tfb-backup-button');
      await color('.header-admin-edit[aria-pressed="true"]');
      await nav.locator('[data-action=splash-edit]').click();
      await color('[data-editor=splash] .btn.primary');
      await close();
      await nav.locator('[data-action=members-manage]').click();
      await color('.memberhub-tabs button.on');
      await close();
      await nav.locator('[data-action=admin-backup]').click();
      await color('.cms-backup-primary');
      await close();
      await nav.locator('[data-action=site-edit]').click();
      await color('.editing-page .btn.primary');
      await page.locator('[data-action=site-done]').first().click();
      await view('partner');
      await color('.partner-admin .btn.primary');
      await page.locator('[data-action=partner-new]').click();
      await color('.partner-editor .btn.primary');
      await close();
      await view('clubstatistik');
      await color('.usage-periods button[aria-pressed=true]');
      await view('membermail');
      await color('.mm-save');
      await color('.mm-test');
      await view('kioskabrechnung');
      await color('.tfb-admin-links [aria-current=page]');
      await color('[data-kb-admin-view] .kb-calendar-head');
      await color('[data-kb-admin-view] .kb-day-picker-head');
      await view('produktbibliothek');
      await color('.pl-hero');
      await color('.pl-hero h1', 'rgba(0, 0, 0, 0)');
      await color('.pl-create-actions [data-pl-new]');
      await page.locator('[data-pl-card=gerolsteiner] [data-pl-act=edit]').click();
      await color('.signature-product-editor .btn.primary');
      await color('[data-signature-color][aria-pressed=true]');
      await close();
      await page.locator('[data-pl-section]').first().click();
      await color('[data-editor=section] .btn.primary');
      await color('[data-editor=section] .seg button.on');
      await close();
      await view('kiosk');
      await page.locator('[data-action=edit-start]').first().click();
      await color('.editbar');
      await color('.editbar .btn.primary', 'rgba(0, 0, 0, 0)');
      await page.locator('[data-action=edit-done]').click();
      await view('produktbibliothek');
      await color('.pl-hero');
      await page.setViewportSize({width:390,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.setViewportSize({width:1440,height:1050});
    }
    assert.deepEqual(errors, []);
    console.log(engine.name()+': all administration entries and product/category editors follow both themes');
  } finally { await browser.close(); }
}
