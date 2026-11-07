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
    if(new URL(route.request().url()).pathname.endsWith('/assets/js/chat-video.js'))return route.fulfill({contentType:'text/javascript',body:`export async function prepareChatVideo(file){return {file,width:file.name.includes('portrait')?1080:1920,height:file.name.includes('portrait')?1920:1080};}`});
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
  const form=page.locator('[data-compose]');
  for(const shape of ['portrait','landscape']){
    await page.locator('[data-action=post-new][data-scope=club]').click();
    await page.locator('[data-cphoto]').setInputFiles({name:shape+'.mp4',mimeType:'video/mp4',buffer:Buffer.from('synthetic-video-only')});
    await page.waitForFunction(()=>document.querySelectorAll('[data-compose] .compose-medium').length===1&&!document.querySelector('[data-compose] [type=submit]').disabled);
    assert.deepEqual(await form.locator('[name=photoView]').evaluateAll(nodes=>nodes.map(n=>n.value)),['collage','slideshow','carousel']);
    assert.equal(await form.locator('[name=photoView][value=collage]').isDisabled(),true);assert.equal(await form.locator('[name=photoView][value=slideshow]').isDisabled(),true);assert.equal(await form.locator('[name=photoView]:checked').inputValue(),'carousel');
    await form.locator('[name=title]').fill('Video '+shape);await form.locator('[name=photoPeople][value=no]').check();await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});
    const saved=await page.evaluate(async shape=>(await TFB.api.posts('club')).find(p=>p.title==='Video '+shape),shape);assert.equal(saved.photoView,'carousel');assert.equal(saved.designs[0].format,shape==='portrait'?'9 / 16':'16 / 9');
  }
  await page.locator('[data-action=post-new][data-scope=club]').click();await page.locator('[data-cphoto]').setInputFiles(files.slice(0,2).map((data,i)=>({name:i+'.png',mimeType:'image/png',buffer:Buffer.from(data,'base64')})));await form.locator('[name=photoView][value=collage]').waitFor();assert.equal(await form.locator('[name=photoView]:checked').inputValue(),'collage');await form.locator('[name=photoView][value=slideshow]').check();
  await page.locator('[data-cphoto]').setInputFiles({name:'portrait.mp4',mimeType:'video/mp4',buffer:Buffer.from('synthetic-video-only')});await page.waitForFunction(()=>document.querySelectorAll('[data-compose] .compose-medium').length===3&&!document.querySelector('[data-compose] [type=submit]').disabled);assert.equal(await form.locator('[name=photoView][value=slideshow]').isDisabled(),true);assert.equal(await form.locator('[name=photoView]:checked').inputValue(),'carousel');
  await form.locator('[data-cremove="2"]').click();assert.equal(await form.locator('[name=photoView][value=slideshow]').isDisabled(),false);assert.equal(await form.locator('[name=photoView]:checked').inputValue(),'slideshow');
  assert.deepEqual(errors,[]);console.log('PASS: portrait/landscape video import, disabled collage/slideshow, carousel persistence, collage default and restoration after removing video. Video conversion stubbed; no live data.');
}finally{await browser.close();}
