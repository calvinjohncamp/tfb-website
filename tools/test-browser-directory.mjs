// Run against wrangler dev with a disposable local D1 database, never production.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.TFB_PLAYWRIGHT_MODULE || 'playwright');
const apiBase='http://127.0.0.1:8791';
const root=fileURLToPath(new URL('../',import.meta.url));
async function call(path,data,token){const r=await fetch(apiBase+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://joern-kaemper.de',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(data)});const body=await r.json();assert.equal(r.status,200,JSON.stringify(body));return body;}
const admin=await call('/auth/login',{identifier:'runtime@example.invalid',password:'Runtime test password 123!'});
await call('/admin/import',{apply:true,rows:[
  {memberNo:'1',firstName:'Runtime',lastName:'Test',email:'runtime@example.invalid'},
  {memberNo:'2002',firstName:'Demo',lastName:'Zugang',email:'demo@example.invalid'},
  {memberNo:'2003',firstName:'Andere',lastName:'Testperson',email:'not-in-browser@example.invalid'}]},admin.token);
const peopleResponse=await fetch(apiBase+'/members/search?q=zugang',{headers:{Authorization:'Bearer '+admin.token}});
const [person]=await peopleResponse.json();
const code=await call('/admin/activation',{memberId:person.id},admin.token);
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='tfb-api.calvinjohncamp.workers.dev'){
  const request=route.request();const headers=new Headers(request.headers());headers.set('Origin','https://joern-kaemper.de');
   const response=await fetch(apiBase+url.pathname+url.search,{method:request.method(),headers,...(request.postData()?{body:request.postData()}:{})});
   return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
  }
  if(url.origin!=='https://joern-kaemper.de')return route.abort();
  const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.webmanifest':'application/manifest+json'};
  try{let body=readFileSync(path);if(url.pathname==='/assets/js/config.js')body=Buffer.from(body.toString().replace('enabled: false','enabled: true'));return route.fulfill({body,contentType:types[extname(path)]||'application/octet-stream'});}
  catch{return route.fulfill({status:404,body:''});}
 });
 await page.goto('https://joern-kaemper.de/#home');await page.waitForFunction(()=>window.TFB?.ui);
 assert.equal(await page.evaluate(()=>TFB.ui.state.member),null);
 await page.locator('[data-action="login"]').first().click();
 await page.locator('[name="email"]').fill('2002');
 await page.locator('[data-form="auth"] button[type="submit"]').click();
 await page.locator('[data-action="auth-activate"]').click();
 await page.locator('[name="activationCode"]').fill(code.code);
 await page.locator('[name="password"]').fill('Browser test password 123!');
 await page.locator('[name="password2"]').fill('Browser test password 123!');
 await page.locator('[data-form="auth"] button[type="submit"]').click();
 try { await page.waitForFunction(()=>TFB.ui.state.member?.firstName==='Demo',null,{timeout:5000}); }
 catch(e) { console.log({formErrors:await page.locator('.form-error').allTextContents(),errors});throw e; }
 await page.evaluate(()=>location.hash='#treffen');
 await page.locator('[data-action="meet-new"][data-kind="einzel"]').click();
 await page.locator('[data-meet-form] [name="search"]').fill('Andere');
 await page.locator('[data-suggest] button').filter({hasText:'Andere Testperson'}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('tfb_kiosk_demo_v1').includes('not-in-browser@example.invalid')),false);
 await page.screenshot({path:'/tmp/tfb-protected-directory.png'});
 await page.evaluate(()=>TFB.ui.api.signOut());await page.reload();
 await page.waitForFunction(()=>window.TFB?.ui);
 assert.equal(await page.evaluate(()=>TFB.ui.state.member),null);
 const message=await page.evaluate(async()=>{try{await TFB.api.searchMembers('Andere');return '';}catch(e){return e.message;}});
 assert.match(message,/anmelden|Anmeldung|melde.*an/i);
 assert.deepEqual(errors,[]);
 console.log('PASS: anonymous visitor, activation, protected real-time name suggestions, no member-list copy, logout denial.');
}finally{await browser.close();}
