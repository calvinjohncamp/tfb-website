import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium,webkit} from 'playwright';
for(const engine of [chromium,webkit]){
 const browser=await engine.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1024,height:1366},hasTouch:true,isMobile:true});
  const waiting=new Map();
  await page.route('https://loading.invalid/image-*',route=>new Promise(resolve=>waiting.set(route.request().url(),async()=>{await route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="108" height="135"><rect width="108" height="135" fill="#f05020"/></svg>'});resolve();})));
  await page.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><div id="app"></div><script>window.TFB={}</script>');
  await page.addStyleTag({content:readFileSync('assets/css/home-media.css','utf8')+'#app{width:480px}.hm-orbit{height:600px}'});
  await page.addScriptTag({content:readFileSync('assets/js/home-media.js','utf8')});
  await page.evaluate(()=>{
   document.body.classList.add('tfb-splash-open');
   const cover=(start,lead)=>TFB.homeMedia.cover({title:'Load',mediaCollection:{entries:[{title:'Loading',images:[start,start+1,start+2].map(i=>'https://loading.invalid/image-'+i)}]}},'#detail',x=>x,lead);
   app.innerHTML=cover(0,true)+'<div style="height:2500px"></div>'+cover(3,false);
  });
  const orbit=page.locator('.hm-orbit').first();await orbit.waitFor();
  assert.equal(await orbit.locator('img').first().getAttribute('loading'),'eager');
  assert.equal(await orbit.locator('img').first().getAttribute('fetchpriority'),'high');
  await page.waitForFunction(()=>document.querySelector('.hm-orbit').dataset.hmRunning==='false');
  assert.equal(await orbit.locator('.hm-card:visible').count(),0,'No empty shadow frames before images arrive');
  for(const i of [0,1]){
   for(let attempt=0;!waiting.has('https://loading.invalid/image-'+i)&&attempt<100;attempt++)await page.waitForTimeout(50);
   assert(waiting.has('https://loading.invalid/image-'+i));await waiting.get('https://loading.invalid/image-'+i)();
   await page.waitForFunction(i=>document.querySelectorAll('.hm-card')[i].dataset.hmLoaded==='true',i);
   if(i===0){
    assert.equal(waiting.size,1,'Only the lead image is requested behind Splash');
    await page.evaluate(()=>{document.body.classList.remove('tfb-splash-open');TFB.resumeHomeMedia();});
    assert.equal(await orbit.locator('.hm-card:visible').count(),1);assert.equal(await orbit.getAttribute('data-hm-running'),'false','First picture visible without waiting for the full collection');}
  }
  await page.waitForFunction(()=>document.querySelector('.hm-orbit').dataset.hmRunning==='true');
  await page.waitForFunction(()=>Number(document.querySelector('.hm-orbit').dataset.hmPhase)>=1,{},{timeout:8000});
  assert.equal(await orbit.getAttribute('data-hm-running'),'false','Hold the current image while its successor is still downloading');
  await page.waitForTimeout(500);assert.equal(await orbit.getAttribute('data-hm-phase'),'1');
  await waiting.get('https://loading.invalid/image-2')();
  await page.waitForFunction(()=>document.querySelector('.hm-orbit').dataset.hmRunning==='true');
  assert.equal(waiting.has('https://loading.invalid/image-3'),false,'Second carousel stays unloaded outside the viewport');
  await Promise.all([page.waitForRequest('https://loading.invalid/image-3'),page.locator('.hm-orbit').last().scrollIntoViewIfNeeded()]);
  console.log(`PASS ${engine.name()}: eager/high-priority first image, no empty frames, first image visible independently, autoplay waits for decoded successor.`);
 }finally{await browser.close();}
}
