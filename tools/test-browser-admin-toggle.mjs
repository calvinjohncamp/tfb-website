import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from 'playwright';
import vm from 'node:vm';
import {fixture} from './app-sync-fixture.mjs';
import {Bucket} from './editorial-fixture.mjs';
import worker from './worker-test-loader.mjs';
import {splitSite} from '../server/cloudflare/editorial.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://joern-kaemper.de';
for (const engine of [chromium,webkit]) {
const browser = await engine.launch({ headless: true });
const f=await fixture();f.env.CMS_BUCKET=new Bucket();const sandbox={TFB:{}};sandbox.window=sandbox;vm.runInNewContext(readFileSync(resolve(root,'assets/data/site-seed.js'),'utf8'),sandbox);
assert.equal((await f.call('/admin/site/commit',{id:crypto.randomUUID(),changes:Object.entries(splitSite(sandbox.TFB.siteSeed)).map(([key,value])=>({key,expected:0,value}))},f.adminToken)).status,200);
try {
  const page = await browser.newPage({ serviceWorkers: 'block' });
  page.setDefaultTimeout(10000);
  const enter = async()=>{await page.waitForFunction(()=>!document.body.classList.contains('tfb-starting'));const splash=page.locator('[data-action="splash-enter"]');if(await splash.isVisible())await splash.click();};
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(token=>{if(!sessionStorage.getItem('tfb_directory_token_v1'))sessionStorage.setItem('tfb_directory_token_v1',token);},f.adminToken);
  let releaseSync;
  const syncGate = new Promise(resolve => { releaseSync = resolve; });
  let delaySync = true;
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'tfb-api.calvinjohncamp.workers.dev') {if (url.pathname === '/app/state' && delaySync) await syncGate; const req=route.request(),r=await worker.fetch(new Request('https://tfb-api.test'+url.pathname+url.search,{method:req.method(),headers:{...req.headers(),'CF-Connecting-IP':'192.0.2.10'},...(req.postData()?{body:req.postData()}:{})}),f.env);return route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:Buffer.from(await r.arrayBuffer())});}
    if (url.origin !== origin) return route.abort();
    const path = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto(origin);
  await enter();
  await page.locator('.site-page[data-page=home] .feature').first().waitFor();
  assert.equal(await page.locator('.header-admin-edit').count(), 0, 'Home renders while authenticated sync is pending');
  delaySync = false;
  releaseSync();
  await page.locator('.header-admin-edit').waitFor();
  await page.waitForFunction(() => TFB.ui?.state.member?.adminHidden);
  assert.equal(await page.evaluate(() => TFB.api.secureDirectory), true);
  assert.equal(await page.locator('[data-action="site-edit"]').count(), 0);
  const pencil = page.locator('[data-action="admin-toggle"]');
  await pencil.click();

  await page.locator('.site-page[data-page=home].editing-page').waitFor();
  const expected = ['Splash','Partner','Mitglieder','Statistik','Kiosk-Buchungen','E-Mail an alle Mitglieder','Datensicherung / Time Machine'];
  for (const view of ['home','kiosk','chat','aktuell','sport','club','treffen']) {
    await page.evaluate(async view => { location.hash = '#'+view; await TFB.ui.renderView(view); }, view);
    await page.locator('.tfb-admin-links').waitFor();
    await pencil.click();
    await page.locator('.tfb-admin-links, .editing-page, .newsroom-tools').first().waitFor({state:'detached'});
    assert.equal(await pencil.getAttribute('aria-pressed'),'false',view);
    await pencil.click();
    await page.locator('.tfb-admin-links').waitFor();
    assert.equal(await pencil.getAttribute('aria-pressed'),'true',view);
    if (view === 'aktuell') await page.locator('.newsroom-tools').waitFor();
    if (['sport','club'].includes(view)) {
      await page.locator('.editing-page[data-page='+(view==='club'?'verein':view)+'] [data-action=block-edit]').first().waitFor();
      assert.equal(await page.locator('[data-action=site-edit]').count(),0);
    }
    if (view === 'sport') {
      await page.locator('.sport-switch a[href="#sport/training"]').click();
      await page.locator('.editing-page[data-page=sport] .sport-switch a[aria-current=page][href="#sport/training"]').waitFor();
      await page.locator('.sport-switch a[href="#sport"]').click();
      await page.locator('.editing-page[data-page=sport] .sport-switch a[aria-current=page][href="#sport"]').waitFor();
    }
    assert.deepEqual(await page.locator('.tfb-admin-links > *').allTextContents(), expected, view);
    for (const width of [390,834,1440]) {
      await page.setViewportSize({width,height:1000});
      const layout = await page.evaluate(() => {
        const links = document.querySelector('.tfb-admin-links');
        return links.getBoundingClientRect().right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
      });
      const heights=await page.locator('.tfb-admin-links .btn').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().height));
      assert.ok(heights.every(height=>Math.abs(height-heights[0])<1),view+' button heights');
      assert.equal(layout,true,view+' admin navigation fits');
    }
  }
  await page.locator('.tfb-admin-links a[href="#kioskabrechnung"]').click();
  await page.locator('[data-kb-admin-view] .kb-calendar').waitFor();
  assert.equal(await page.locator('[data-kb-member]').inputValue(),'');
  assert.equal(await page.locator('.tfb-admin-links a[aria-current=page]').innerText(),'Kiosk-Buchungen');
  for(const yellow of [true,false]){
    const switcher = page.locator('.topbar [data-tfb-brand]');
    if ((await switcher.getAttribute('aria-pressed') === 'true') !== yellow) await switcher.click();
    const bg = yellow ? 'rgb(255, 195, 0)' : 'rgb(196, 85, 58)';
    const fg = yellow ? 'rgb(0, 29, 61)' : 'rgb(0, 0, 0)';
    await page.waitForFunction(({bg,fg})=>['.tfb-backup-button','.tfb-admin-links [aria-current=page]'].every(selector=>{
      const style=getComputedStyle(document.querySelector(selector));
      return style.backgroundColor===bg && style.color===fg;
    }),{bg,fg});
  }
  assert.match(await page.locator('.kb-account-heading').innerText(),/Clubweite Abrechnung/);
  await pencil.click();
  await page.locator('.site-page[data-page=home]').waitFor();
  assert.equal(await page.locator('.tfb-admin-links, [data-kb-admin-view]').count(),0);
  await page.locator('.brand-home').click();
  const homeEditor = page.locator('.site-page[data-page=home].editing-page');
  await page.locator('.site-page[data-page=home]').waitFor();
  if (!await homeEditor.count()) await pencil.click();
  await page.locator('.site-page[data-page="home"].editing-page').waitFor();
  assert.equal(await page.evaluate(()=>location.hash),'#home');
  await page.screenshot({path:`/private/tmp/tfb335-admin-${engine.name()}.png`,fullPage:true});
  await pencil.click();
  await page.waitForFunction(() => TFB.ui.state.member.adminHidden === true);
  assert.equal(await page.locator('[data-action="site-edit"]').count(), 0);
  const role = await page.evaluate(async () => {
    const verified = await TFB.api.session();
    TFB.ui.state.member = verified;
    await TFB.ui.renderView();
    return verified.isAdmin;
  });
  assert.equal(role, true, 'Hiding controls never changes the verified role');
  assert.equal(await page.locator('[data-action="site-edit"]').count(), 0);
  await page.evaluate(async () => {
    TFB.ui.state.member = await TFB.api.acceptConsent();
    location.hash = '#kiosk';
  });
  await page.locator('.kiosk-link').first().waitFor();
  assert.equal(await page.locator('[data-action="edit-start"]').count(), 0);
  await pencil.click();
  await page.locator('[data-action="edit-start"]').first().waitFor();
  await page.reload();
  await enter();
  await page.waitForFunction(() => TFB.ui?.state.member?.adminHidden);
  assert.equal(await page.locator('[data-action="edit-start"]').count(), 0);
  // An ordinary verified member cannot enable admin tools with the pencil.
  await page.evaluate(token=>localStorage.setItem('tfb_directory_token_v1',token),f.otherToken);
  await page.reload();
  await enter();
  await page.waitForFunction(() => TFB.ui?.state.member && !TFB.ui.state.member.isAdmin && !TFB.ui.state.member.adminHidden);
  assert.equal(await pencil.count(), 0);
  assert.equal(await page.locator('[data-action="site-edit"], [data-action="edit-start"]').count(), 0);
  await page.evaluate(()=>{location.hash='#kioskabrechnung';});
  await page.getByText('Diese clubweite Übersicht steht nur der berechtigten Verwaltung zur Verfügung.').waitFor();
  assert.equal(await page.locator('[data-kb-admin-view]').count(),0);
  assert.deepEqual(errors, []);
  console.log('PASS: secure-login admin pencil toggles tools across public and admin routes, stays hidden after session refresh/reload, retains role and never elevates ordinary members.');
} finally { await browser.close(); }

}
