import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

// Only synthetic files, a fake origin and local demo storage; no live requests.
const root = fileURLToPath(new URL('../',import.meta.url));
const origin = 'https://tfb-carousel-test.invalid';
const browser = await chromium.launch({headless:true});
try {
  const page = await browser.newPage({serviceWorkers:'block',viewport:{width:1280,height:1000}});
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror',error => errors.push(error.message));
  await page.route('**/*',route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    const file = resolve(root,'.'+decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(root)) return route.abort();
    const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf'};
    try { return route.fulfill({body:readFileSync(file),contentType:types[extname(file)] || 'application/octet-stream'}); }
    catch { return route.fulfill({status:404,body:''}); }
  });
  await page.goto(origin+'/?tfbPresentation=1#chat');
  await page.waitForFunction(() => window.TFB?.ui);
  const files = await page.evaluate(async () => {
    TFB.ui.state.member = TFB.api.attachDirectoryMember({id:'carousel-author',firstName:'Carousel',lastName:'Test',email:'carousel@example.invalid',active:true,isAdmin:false,teams:[]});
    await TFB.api.acceptFeedRules();
    await TFB.ui.renderView();
    return ['#c55a40','#007c89','#47764c','#795b9d'].map((color,index) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080; canvas.height = 1350;
      const context = canvas.getContext('2d');
      context.fillStyle=color; context.fillRect(0,0,1080,1350);
      context.fillStyle='#fff';context.font='70px sans-serif';context.fillText('SEITE '+(index+1),80,150);
      context.strokeStyle='#fff';context.lineWidth=20;context.strokeRect(20,20,1040,1310);
      return canvas.toDataURL('image/png').split(',')[1];
    });
  });
  await page.reload();
  await page.waitForFunction(() => TFB.ui?.state.member?.id === 'carousel-author');
  await page.evaluate(async () => { location.hash = '#chat'; await TFB.ui.renderView('chat'); });
  await page.locator('[data-action="post-new"][data-scope="club"]').click();
  await page.locator('[data-compose] [name="text"]').fill('Vier fertige Bildseiten zum selbständigen Durchblättern.');
  await page.locator('[data-compose] [name="title"]').fill('Karussell-Prüfung');
  await page.locator('[data-cphoto]').setInputFiles(files.map((data,index) => ({name:`slide-${index+1}.png`,mimeType:'image/png',buffer:Buffer.from(data,'base64')})));
  await page.waitForFunction(() => document.querySelectorAll('[data-compose] .compose-medium').length === 4 && !document.querySelector('[data-compose] [type="submit"]').disabled);
  await page.locator('[name="photoView"]').selectOption('carousel');
  assert.equal(await page.locator('[data-cslideshow]').count(),0);
  await page.locator('[name="photoOk"]').check();
  await page.locator('[data-compose] [type="submit"]').click();
  await page.locator('.cs-carousel').waitFor();
  const id = await page.locator('.cs-carousel').getAttribute('data-cs-post');
  const gallery = () => page.locator(`.cs-carousel[data-cs-post="${id}"]`).first();
  const current = (where = gallery()) => where.locator('[data-cs-published-page]:not([hidden])');
  const index = async (where = gallery()) => Number(await current(where).getAttribute('data-cs-published-page'));
  await gallery().scrollIntoViewIfNeeded();
  assert.equal(await gallery().getAttribute('data-cs-auto'),null);
  assert.equal(await gallery().locator('[data-cs-slideshow]').count(),0);
  assert.equal(await gallery().locator('[data-cs-step="-1"]').isDisabled(),true);
  await page.waitForTimeout(2900);
  assert.equal(await index(),0,'Visible carousel does not advance automatically');
  const fit = await current().locator('.cs-media img').evaluate(img => ({fit:getComputedStyle(img).objectFit,width:img.naturalWidth,height:img.naturalHeight,ratio:img.closest('.cs-stage').getBoundingClientRect().width/img.closest('.cs-stage').getBoundingClientRect().height}));
  assert.equal(fit.fit,'contain'); assert.equal(fit.width,1080); assert.equal(fit.height,1350); assert.ok(Math.abs(fit.ratio-.8)<.005);
  await gallery().locator('[data-cs-step="1"]').click(); assert.equal(await index(),1);
  await gallery().focus(); await page.keyboard.press('End'); assert.equal(await index(),3);
  assert.equal(await gallery().locator('[data-cs-step="1"]').isDisabled(),true);
  await page.keyboard.press('Home'); assert.equal(await index(),0);
  await gallery().locator('[data-cs-published-dot="2"]').click(); assert.equal(await index(),2);
  await page.screenshot({path:'/tmp/tfb-chat-carousel-desktop.png'});
  await current().getByRole('button',{name:'Vollbild',exact:true}).click();
  const viewer = page.locator('.cs-viewer .cs-carousel');
  await viewer.waitFor(); assert.equal(await index(viewer),2);
  assert.equal(await page.locator('[data-cs-wide]').count(),0);
  await viewer.locator('[data-cs-step="1"]').click(); assert.equal(await index(viewer),3);
  await page.keyboard.press('Escape'); await page.locator('.cs-viewer').waitFor({state:'detached'});
  assert.equal(await index(),2,'Closing the viewer keeps the feed position');
  await page.reload(); await page.locator('.cs-carousel').waitFor();
  assert.equal(await index(),0);
  await page.setViewportSize({width:390,height:844}); await gallery().scrollIntoViewIfNeeded();
  await gallery().dispatchEvent('touchstart',{touches:[{identifier:1,clientX:300,clientY:300}]});
  await gallery().dispatchEvent('touchend',{changedTouches:[{identifier:1,clientX:80,clientY:305}]});
  assert.equal(await index(),1,'Horizontal swipe advances');
  await gallery().dispatchEvent('touchstart',{touches:[{identifier:1,clientX:300,clientY:300}]});
  await gallery().dispatchEvent('touchend',{changedTouches:[{identifier:1,clientX:240,clientY:500}]});
  assert.equal(await index(),1,'Vertical scrolling does not advance');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:'/tmp/tfb-chat-carousel-mobile.png'});
  // Editing retains the selected mode; existing collage and slideshow still work.
  await page.locator(`.chat-post-row:has([data-cs-post="${id}"]) [data-action="post-edit"]`).click();
  assert.equal(await page.locator('[name="photoView"]').inputValue(),'carousel');
  await page.locator('[name="photoView"]').selectOption('collage');
  await page.locator('[name="photoOk"]').check();await page.locator('[data-compose] [type="submit"]').click();
  await page.locator(`[data-cs-photo-view] [data-cs-collage]:not([hidden])`).first().waitFor();
  await page.locator(`[data-action="post-edit"][data-id="${id}"]`).click();
  await page.locator('[name="photoView"]').selectOption('slideshow');
  await page.locator('[name="photoOk"]').check();await page.locator('[data-compose] [type="submit"]').click();
  await page.locator('[data-cs-carousel]:not([hidden]) [data-cs-auto]').first().waitFor();
  await page.waitForFunction(() => document.querySelector('[data-cs-auto] [data-cs-published-page]:not([hidden]):not([data-cs-outgoing])')?.dataset.csPublishedPage !== '0');
  assert.deepEqual(errors,[]);
  console.log('PASS: composer, save/reload, full 4:5, no autoplay, arrows, dots, keyboard, viewer, swipe and legacy modes');
} finally { await browser.close(); }
