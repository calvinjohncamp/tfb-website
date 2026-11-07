import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{resolve,extname}from'node:path';import{fileURLToPath}from'node:url';import{chromium,webkit}from'playwright';
const root=fileURLToPath(new URL('../',import.meta.url)),origin='https://tfb-polish.invalid';
const browser=await(process.env.TFB_BROWSER==='webkit'?webkit:chromium).launch();
const blue='rgb(0, 29, 61)',yellow='rgb(255, 195, 0)',red='rgb(196, 85, 58)';
try{
 const page=await browser.newPage({serviceWorkers:'block',viewport:{width:834,height:1194}}),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.abort();const file=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));try{return route.fulfill({body:readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf'})[extname(file)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}});
 await page.goto(origin+'/');await page.locator('[data-action="splash-enter"]').click();
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'polish-admin',firstName:'UI',lastName:'Test',isAdmin:true,active:true,email:'ui@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';const s=await TFB.api.site();s.pages.home.blocks=[{id:'p',type:'feature',title:'Test',image:'assets/images/board/kai-eichmann.jpg',text:'{hervorheben}Neuer Akzent{/hervorheben} **{rot}Alter Akzent{/rot}**',more:{text:'Unterseite'}}];s.pages.aktuell.blocks=[{id:'n',type:'post',title:'News-Test',date:'2026-11-07',text:'Text'}];await TFB.api.saveSite(s);await TFB.refreshSite(true);});
 const nav=async key=>{await page.evaluate(key=>location.hash=key,key);await page.waitForTimeout(150);};
 const css=(loc,prop)=>loc.evaluate((e,p)=>getComputedStyle(e)[p],prop);
 for(const brand of ['club','signature']){
  await page.evaluate(async()=>{const s=await TFB.api.site();s.pages.home.blocks[0].text='{hervorheben}Neuer Akzent{/hervorheben} **{rot}Alter Akzent{/rot}** {marker}Alter Marker{/marker}';await TFB.api.saveSite(s);await TFB.refreshSite(true);});
  if(await page.evaluate(()=>document.documentElement.classList.contains('tfb-logo-midnight-amber'))!==(brand==='club'))await page.locator('.topbar [data-tfb-brand]').click();
  await nav('club');const history=page.locator('.story-teaser .more-link');
  assert.equal(await css(history,'borderTopColor'),brand==='club'?yellow:red);assert.equal(await css(history,'backgroundImage'),'none');assert.equal(await css(history,'backgroundColor'),'rgba(0, 0, 0, 0)');if(brand==='club')assert.equal(await css(history,'color'),blue);
  for(const width of [390,834]){await page.setViewportSize({width,height:1100});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}await page.setViewportSize({width:834,height:1194});
  await page.locator('[data-action="membership-mail-preview"]').click();const frame=page.frameLocator('.membership-mail-dialog iframe');await frame.locator('.mail-logo').waitFor();const button=frame.locator('a[aria-disabled="true"]');
  assert.equal(await css(button.locator('..'),'backgroundColor'),brand==='club'?yellow:red);assert.equal(await css(button,'color'),brand==='club'?blue:'rgb(255, 255, 255)');assert.match(await frame.locator('.mail-logo').getAttribute('src'),brand==='club'?/midnight-amber/:/tfb-mail-logo/);
  await page.locator('.sheet-close').click();assert.equal(page.context().pages().length,1);
  await nav('home');for(const b of await page.locator('.feature :is(.more-link,.content-overview-tools>.btn)').all())assert.equal(await css(b,'borderTopColor'),brand==='club'?yellow:red);
  assert.equal(await css(page.locator('.feature .tx-highlight').first(),'fontWeight'),'400');assert.equal(await css(page.locator('.feature .tx-red strong,.feature strong .tx-red').first(),'fontWeight'),brand==='club'?'400':'700');
  if(brand==='signature'){assert.equal(await css(page.locator('.feature .tx-mark'),'backgroundImage'),'none');assert.equal(await css(page.locator('.feature .tx-mark'),'color'),red);}
  for(const key of ['home','aktuell']){
   await nav(key);await page.locator(`[data-action="site-edit"][data-page="${key}"]`).first().click();await page.locator('[data-action="block-edit"]').first().click();const editor=page.locator('[data-editor="block"]'),area=editor.locator('[data-rich-for="text"]');
   await area.evaluate(e=>{e.innerHTML='<p>Testmarkierung</p>';e.dispatchEvent(new Event('input',{bubbles:true}));e.focus();const r=document.createRange();r.selectNodeContents(e.firstChild);const s=getSelection();s.removeAllRanges();s.addRange(r);});
   await editor.getByRole('button',{name:brand==='club'?'Mit Textmarker hervorheben':'In Signature-Rot hervorheben',exact:true}).click();const marked=area.locator('.tx-highlight');
   assert.equal(await css(marked,'fontWeight'),'400');assert.equal(await css(marked,'textDecorationLine'),'none');if(brand==='club')assert.match(await css(marked,'backgroundImage'),/tfb-highlight-freihand/);else{assert.equal(await css(marked,'backgroundImage'),'none');assert.equal(await css(marked,'color'),red);}
   const weight=()=>area.evaluate(e=>{const walk=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode())if(n.textContent==='Testmarkierung')return getComputedStyle(n.parentElement).fontWeight;});
   await area.locator('..').locator('[data-rich="bold"]').click();assert(Number(await weight())>=700,'Bold is independently available');await area.locator('..').locator('[data-rich="bold"]').click();assert.equal(await weight(),'400');
   await editor.locator('[type="submit"]').click();const saved=await page.evaluate(async key=>(await TFB.api.site()).pages[key].blocks[0].text,key);assert.match(saved,/\{hervorheben\}Testmarkierung\{\/hervorheben\}/);await page.locator('[data-action="site-done"]').first().click();
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS both themes: History/Home borders, themed mail, clear Home/Aktuell emphasis, independent bold, save/reload markup, mobile and iPad widths.');
}finally{await browser.close();}
