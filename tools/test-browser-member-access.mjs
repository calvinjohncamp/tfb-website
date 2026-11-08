import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {chromium,webkit} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import {Bucket} from './editorial-fixture.mjs';
import worker from './worker-test-loader.mjs';
import {splitSite} from '../server/cloudflare/editorial.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const engine of [chromium,webkit]){
 const f=await fixture();f.env.CMS_BUCKET=new Bucket();
 const sandbox={TFB:{}};sandbox.window=sandbox;
 vm.runInNewContext(readFileSync(resolve(root,'assets/data/site-seed.js'),'utf8'),sandbox);
 const seed=sandbox.TFB.siteSeed;seed.pages.home.blocks=[];seed.pages.aktuell.blocks=[];
 assert.equal((await f.call('/admin/site/commit',{id:crypto.randomUUID(),changes:Object.entries(splitSite(seed)).map(([key,value])=>({key,expected:0,value}))},f.adminToken)).status,200);
 assert.equal((await f.commit([{kind:'post',id:'member-access-post',revision:0,value:{scope:'club',text:'Öffentlich lesbarer Testbeitrag',images:[]}}])).status,200);
 assert.equal((await f.call('/admin/import',{apply:true,rows:[{memberNo:'1',firstName:'Demo',lastName:'Owner',email:'test@example.invalid'},{memberNo:'4242',firstName:'Test',lastName:'Mitglied',email:'member@example.invalid'}]},f.adminToken)).status,200);
 const m=f.env.DB.sqlite.prepare('SELECT id FROM members WHERE member_no=?').get('4242');
 const activation=await f.call('/admin/activation',{memberId:m.id},f.adminToken);
 const browser=await engine.launch();
 try{
  const page=await browser.newPage({serviceWorkers:'block',viewport:{width:390,height:1000}}),errors=[];
  page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{const req=route.request(),u=new URL(req.url());
   if(u.hostname==='tfb-api.calvinjohncamp.workers.dev'){
    const res=await worker.fetch(new Request('https://tfb-api.test'+u.pathname+u.search,{method:req.method(),headers:{...req.headers(),'CF-Connecting-IP':'192.0.2.9'},...(req.postData()?{body:req.postData()}: {})}),f.env);
    return route.fulfill({status:res.status,headers:Object.fromEntries(res.headers),body:Buffer.from(await res.arrayBuffer())});
   }
   if(u.hostname!=='joern-kaemper.de')return route.abort();
   const file=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));
   try{return route.fulfill({body:readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf'})[extname(file)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
  });
  await page.goto('https://joern-kaemper.de/?tfbPresentation=1#home');await page.locator('.topnav a[href="#chat"]').click();
  await page.getByText('Öffentlich lesbarer Testbeitrag',{exact:true}).waitFor();
  assert.equal(await page.locator('[data-action=post-new],[data-comment-form],[data-compose]').count(),0);
  assert.equal(await page.locator('.chat-comment-button').textContent(),'Zum Kommentieren anmelden');await page.locator('[data-action=login]').first().click();
  const form=page.locator('[data-form=auth]');await form.waitFor();
  await form.getByText(/Nur für aktive TFB-Mitglieder/).waitFor();
  await form.getByText(/Für deinen ersten Zugang brauchst du einen persönlichen Freischaltcode/).waitFor();
  await form.locator('[name=email]').fill('external@example.invalid');await form.locator('[type=submit]').click();
  await form.locator('[name=password]').fill('Synthetic password only 123!');await form.locator('[type=submit]').click();
  await form.locator('.form-error').getByText(/Anmeldung nicht möglich/).waitFor();
  assert.equal(await page.evaluate(()=>TFB.ui.state.member),null);
  await form.locator('[data-action=auth-back]').click();await form.locator('[name=email]').fill('member@example.invalid');await form.locator('[type=submit]').click();
  await form.locator('[data-action=auth-activate]').click();
  await form.locator('[name=activationCode]').fill(activation.body.code);
  await form.locator('[name=password]').fill('Synthetic member password 123!');await form.locator('[name=password2]').fill('Synthetic member password 123!');
  await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>TFB.ui.state.member.email),'member@example.invalid');
  await page.evaluate(()=>location.hash='chat');await page.locator('[data-action=post-new]').waitFor();
  await page.locator('[data-action=comment-unlock]:visible').first().click();
  const rules=page.locator('[data-rules]');await rules.waitFor();
  await rules.locator('[name=ok]').check();await rules.locator('[type=submit]').click();
  const comment=page.locator('[data-comment-form]');await comment.waitFor();
  await comment.locator('[name=text]').fill('Kommentar eines freigeschalteten Mitglieds');await comment.locator('[type=submit]').click();await comment.waitFor({state:'detached'});
  assert((await f.call('/public/community')).body.comments.some(c=>c.text==='Kommentar eines freigeschalteten Mitglieds'&&c.authorId===m.id));
  await page.reload();await page.waitForFunction(()=>TFB.ui?.state.member?.email==='member@example.invalid');
  f.env.DB.sqlite.prepare('UPDATE members SET active=0 WHERE id=?').run(m.id);
  const denied=await page.evaluate(async()=>{try{await TFB.directoryCall('/app/commit',{id:crypto.randomUUID(),operations:[]});return false;}catch(e){return e.status===401;}});assert.equal(denied,true);
  await page.reload();await page.locator('.topnav a[href="#chat"]').click();await page.getByText('Öffentlich lesbarer Testbeitrag',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>TFB.ui.state.member),null);
  assert.equal(await page.locator('[data-action=post-new],[data-comment-form]').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);console.log(`PASS ${engine.name()}: guest reading/login prompts, external denied, imported member activates and reloads, deactivated session blocked, mobile layout.`);
 }finally{await browser.close();}
}
