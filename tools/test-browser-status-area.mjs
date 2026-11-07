import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {webkit} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin='https://tfb-status.invalid';
const browser=await webkit.launch();
try {
  const page=await browser.newPage({serviceWorkers:'block',isMobile:true,hasTouch:true,deviceScaleFactor:1});
  await page.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(u.origin!==origin)return route.abort();
    const file=resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));
    if(!file.startsWith(root))return route.abort();
    try{return route.fulfill({body:readFileSync(file),contentType:({'.html':'text/html','.css':'text/css','.js':'text/javascript','.ttf':'font/ttf','.png':'image/png','.jpg':'image/jpeg'})[extname(file)]||'application/octet-stream'});}catch{return route.abort();}
  });
  await page.goto(origin);
  await page.locator('[data-action="splash-enter"]').click();
  assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),'#EFEFEF');
  assert.equal(JSON.parse(readFileSync(resolve(root,'manifest.webmanifest'))).theme_color,'#EFEFEF');
  assert.equal(await page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').getAttribute('content'),'default');
  // Desktop WebKit does not provide a native iOS status bar. Simulate its inset
  // explicitly, then compare pixels with and without bright content underneath.
  for(const viewport of [{width:834,height:1194,inset:24},{width:1194,height:834,inset:24},{width:390,height:844,inset:59},{width:1440,height:1000,inset:0}]) {
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    for(const yellow of [true,false]) {
      await page.evaluate(({yellow,inset})=>{
        document.documentElement.classList.toggle('tfb-logo-midnight-amber',yellow);
        document.documentElement.style.setProperty('--safe-top',inset+'px');
      },{yellow,inset:viewport.inset});
      const style=await page.evaluate(()=>{
        const s=getComputedStyle(document.body,'::before');
        return {height:s.height,position:s.position,top:s.top,color:s.backgroundColor,pointerEvents:s.pointerEvents,opacity:s.opacity,rootColor:getComputedStyle(document.documentElement).backgroundColor};
      });
      assert.deepEqual(style,{height:viewport.inset+'px',position:'fixed',top:'0px',color:'rgb(239, 239, 239)',pointerEvents:'none',opacity:'1',rootColor:'rgb(239, 239, 239)'});
      if(!viewport.inset)continue;
      await page.evaluate(()=>{scrollTo(0,400);const probe=document.createElement('div');probe.id='status-probe';probe.style.cssText='position:fixed;inset:0 0 auto;height:100px;background:#ff00ff;z-index:1000000;visibility:hidden';document.body.append(probe);});
      const clip={x:0,y:0,width:viewport.width,height:viewport.inset};
      const before=await page.screenshot({clip});
      await page.evaluate(()=>document.getElementById('status-probe').style.visibility='visible');
      const after=await page.screenshot({clip});
      assert.deepEqual(after,before,`status area stays opaque over content at ${viewport.width}px, yellow=${yellow}`);
      await page.evaluate(()=>document.getElementById('status-probe').remove());
    }
  }
  console.log('PASS WebKit: solid safe-area pixels over scrolling/bright content, iPad portrait/landscape and iPhone inset simulation, both themes; desktop zero height; matching theme metadata. Native iOS system chrome requires device verification.');
} finally {await browser.close();}
