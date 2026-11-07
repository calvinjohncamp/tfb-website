import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium,webkit} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin='https://tfb-brand.invalid';
const browser=await (process.env.TFB_BROWSER==='webkit'?webkit:chromium).launch();
try{
 const context=await browser.newContext({serviceWorkers:'block'}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.abort();const file=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));try{return route.fulfill({body:readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.ttf':'font/ttf','.webmanifest':'application/manifest+json'})[extname(file)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}});
 await page.goto(origin+'/');
 const rootBrand=()=>page.evaluate(()=>document.documentElement.classList.contains('tfb-logo-midnight-amber'));
 const toggle=page.locator('#tfb-splash [data-tfb-brand]');
 assert.equal(await rootBrand(),true,'First visit defaults to blue/yellow');
 assert.equal(await toggle.getAttribute('aria-pressed'),'true');
 assert.match(await page.locator('link[rel="icon"]').getAttribute('href'),/v=305/);
 assert.match(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'),/v=305/);
 assert.match(await page.locator('link[rel="manifest"]').getAttribute('href'),/v=305/);
 await toggle.click();assert.equal(await rootBrand(),false);await page.reload();assert.equal(await rootBrand(),false,'Explicit red preference persists');
 await toggle.click();await page.reload();assert.equal(await rootBrand(),true,'Explicit yellow preference persists');
 await page.evaluate(()=>localStorage.removeItem('tfb_brand_theme'));await page.reload();assert.equal(await rootBrand(),true,'Missing preference returns to new default');
 assert.deepEqual(errors,[]);console.log('PASS default blue/yellow, saved red/yellow choices, reset, versioned app/favicon references.');
}finally{await browser.close();}
