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
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'tfb-api.calvinjohncamp.workers.dev') {const req=route.request(),r=await worker.fetch(new Request('https://tfb-api.test'+url.pathname+url.search,{method:req.method(),headers:{...req.headers(),'CF-Connecting-IP':'192.0.2.10'},...(req.postData()?{body:req.postData()}:{})}),f.env);return route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:Buffer.from(await r.arrayBuffer())});}
    if (url.origin !== origin) return route.abort();
    const path = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto(origin);
  await page.waitForFunction(() => TFB.ui?.state.member?.adminHidden);
  await enter();
  assert.equal(await page.evaluate(() => TFB.api.secureDirectory), true);
  assert.equal(await page.locator('[data-action="site-edit"]').count(), 0);
  const pencil = page.locator('[data-action="admin-toggle"]');
  await pencil.click();

  await page.locator('[data-action="site-edit"]').first().waitFor();
  const expected = ['Splash bearbeiten','Home bearbeiten','Partner verwalten','Mitglieder verwalten','Clubstatistik','App-Anleitung','Sicherungen'];
  for (const view of ['home','kiosk','chat','aktuell','sport','club','treffen']) {
    await page.evaluate(async view => { location.hash = '#'+view; await TFB.ui.renderView(view); }, view);
    await page.locator('.tfb-admin-links').waitFor();
    assert.deepEqual(await page.locator('.tfb-admin-links > *').allTextContents(), expected, view);
    for (const width of [390,834,1440]) {
      await page.setViewportSize({width,height:1000});
      const layout = await page.evaluate(() => {
        const world=document.querySelector('.tfb-admin-design .world-switch').getBoundingClientRect(),links=document.querySelector('.tfb-admin-links').getBoundingClientRect(),first=document.querySelector('.tfb-admin-links > *').getBoundingClientRect();
        return {below:links.top>=world.bottom,left:Math.abs(first.left-world.left)<1,overflow:document.documentElement.scrollWidth>innerWidth};
      });
      assert.equal(layout.below,true,view);assert.equal(layout.left,true,view);assert.equal(layout.overflow,false,view);
    }
  }
  await page.locator('.tfb-admin-links [data-action="site-edit"]').click();
  await page.locator('.site-page[data-page="home"].editing-page').waitFor();
  assert.equal(await page.evaluate(()=>location.hash),'#home');
  await page.screenshot({path:`/private/tmp/tfb335-admin-${engine.name()}.png`,fullPage:true});
  await page.locator('[data-action="site-done"]').first().click();
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
  assert.deepEqual(errors, []);
  console.log('PASS: secure-login admin pencil toggles Home/Kiosk tools, stays hidden after session refresh/reload, retains role and never elevates ordinary members.');
} finally { await browser.close(); }

}
