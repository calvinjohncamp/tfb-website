import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {webkit} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin='https://tfb-status.invalid';
const browser=await webkit.launch();
try {
 for(const mobile of [true,false]) {
  const page=await browser.newPage({serviceWorkers:'block',isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  await page.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(u.origin!==origin)return route.abort();
    const file=resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));
    if(!file.startsWith(root))return route.abort();
    try{return route.fulfill({body:readFileSync(file),contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.ttf':'font/ttf','.png':'image/png','.jpg':'image/jpeg'})[extname(file)]||'application/octet-stream'});}catch{return route.abort();}
  });
  await page.goto(origin);
  const shield=page.locator('body > .tfb-statusbar-shield');
  assert.equal(await shield.count(),1);
  assert.equal(await shield.getAttribute('aria-hidden'),'true');
  await page.locator('[data-action="splash-enter"]').click();
  assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),'#EFEFEF');
  assert.equal(JSON.parse(readFileSync(resolve(root,'manifest.webmanifest'))).theme_color,'#EFEFEF');
  assert.equal(await page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').getAttribute('content'),'default');
  // Local WebKit lacks native iOS system chrome. Include zero insets explicitly:
  // v309's pseudo-element passed the old test, but failed on the user's iPad.
  for(const viewport of (mobile?[{width:834,height:1194,inset:0},{width:834,height:1194,inset:24},{width:1194,height:834,inset:0},{width:1194,height:834,inset:24},{width:390,height:844,inset:0},{width:390,height:844,inset:59}]:[{width:1440,height:1000,inset:0}])) {
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    for(const yellow of [true,false]) {
      await page.evaluate(({yellow,inset})=>{
        document.documentElement.classList.toggle('tfb-logo-midnight-amber',yellow);
        document.documentElement.style.setProperty('--safe-top',inset+'px');
      },{yellow,inset:viewport.inset});
      assert.equal(await shield.isVisible(),mobile);
      if(!mobile)continue;
      const height=Math.max(12,viewport.inset);
      const style=await shield.evaluate(e=>{
        const s=getComputedStyle(e),r=e.getBoundingClientRect();
        return {height:r.height,width:r.width,top:r.top,position:s.position,color:s.backgroundColor,pointerEvents:s.pointerEvents,opacity:s.opacity};
      });
      assert.deepEqual(style,{height,width:viewport.width,top:0,position:'fixed',color:'rgb(239, 239, 239)',pointerEvents:'none',opacity:'1'});
      // A real, full-width renderer at y=4 and >10px tall meets the relevant
      // WebKit sampling geometry; pseudo-elements/zero-height strips do not.
      assert.equal(await shield.evaluate(e=>{e.style.pointerEvents='auto';const hit=document.elementFromPoint(innerWidth/2,4);e.style.removeProperty('pointer-events');return hit===e;}),true);
      await page.evaluate(()=>{scrollTo(0,400);const probe=document.createElement('div');probe.id='status-probe';probe.style.cssText='position:fixed;inset:0 0 auto;height:100px;background:#ff00ff;z-index:1000000;visibility:hidden';document.body.append(probe);});
      const clip={x:0,y:0,width:viewport.width,height};
      const before=await page.screenshot({clip});
      await page.evaluate(()=>document.getElementById('status-probe').style.visibility='visible');
      const after=await page.screenshot({clip});
      assert.deepEqual(after,before,`opaque top edge at ${viewport.width}px, inset=${viewport.inset}, yellow=${yellow}`);
      await page.evaluate(()=>document.getElementById('status-probe').remove());
      assert.equal(await shield.evaluate(e=>e.getBoundingClientRect().top),0);
    }
  }
  await page.close();
 }
 console.log('PASS WebKit: real fixed DOM shield, opaque pixels/edge geometry with zero and nonzero iPad/iPhone insets, portrait/landscape, both themes, no desktop shield. Native iOS status bar still requires device verification.');
} finally {await browser.close();}
