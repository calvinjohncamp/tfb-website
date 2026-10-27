import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium,webkit} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url)),origin='http://127.0.0.1:18767';
for(const engine of [chromium,webkit]){
 const browser=await engine.launch({headless:true});
 try{
  const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{
   const url=new URL(route.request().url());if(url.origin!==origin)return route.abort();
   const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root))return route.abort();
   const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf'};
   try{return route.fulfill({body:readFileSync(path),contentType:types[extname(path)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
  });
  await page.goto(origin+'/#home');await page.locator('#tfb-splash:not([hidden])').waitFor();
  for(let i=0;i<3;i++){
   await page.locator('[data-action="splash-enter"]').click();await page.locator('#tfb-splash').waitFor({state:'hidden'});
   assert.ok(await page.evaluate(()=>Number(sessionStorage.getItem('tfb_splash_visit_v1'))>Date.now()-60000),'Recent visit exists');
   await page.evaluate(()=>location.hash='#club');await page.waitForFunction(()=>location.hash==='#club');
   assert.equal(await page.locator('#tfb-splash').isVisible(),false,'Internal navigation does not reopen Splash');
   await page.evaluate(()=>location.hash='#home');await page.reload();await page.locator('#tfb-splash:not([hidden])').waitFor();
   assert.equal(await page.evaluate(()=>performance.getEntriesByType('navigation')[0].type),'reload');
  }
  await page.locator('[data-action="splash-enter"]').click();await page.evaluate(()=>location.hash='#impressum');await page.reload();
  await page.waitForFunction(()=>Boolean(window.TFB?.ui));await page.waitForTimeout(500);
  assert.equal(await page.locator('#tfb-splash:not([hidden])').count(),0,'Direct legal links bypass Splash');
  assert.deepEqual(errors,[]);console.log(engine.name()+': first visit, three reloads, internal navigation and direct legal link passed.');
 }finally{await browser.close();}
}
