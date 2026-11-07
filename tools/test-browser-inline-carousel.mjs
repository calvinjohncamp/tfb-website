import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium,webkit} from 'playwright';
const source=readFileSync(new URL('../assets/js/home-media.js',import.meta.url),'utf8').replace('TFB.homeMedia={cover,','TFB.testMountOrbit=mountOrbit;TFB.homeMedia={cover,');
const css=readFileSync(new URL('../assets/css/home-media.css',import.meta.url),'utf8');
for(const engine of [chromium,webkit]){
 const browser=await engine.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1024,height:1366},deviceScaleFactor:2,hasTouch:true,isMobile:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><main id="app"></main><script>window.TFB={}</script>');
  await page.addStyleTag({content:css});await page.addScriptTag({content:source});
  for(const [kind,width,height] of [['home',480,600],['news',580,440],['zoom',1024,1200]]){
   await page.evaluate(({kind,width,height})=>{
    window.controller?.destroy();
    const colors=['#b63228','#176b78','#46712e','#82467c','#bd6b13'];
    const images=colors.map(color=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="108" height="135"><rect width="108" height="135" fill="${color}"/></svg>`));
    app.className=kind==='news'?'media-news':'';
    app.innerHTML=TFB.homeMedia.cover({title:'Test',animationStart:'manual',mediaCollection:{entries:[{title:'Five pictures',images}]}},'#detail',x=>x);
    const orbit=app.firstElementChild;orbit.removeAttribute('data-hm-orbit');
    if(kind==='zoom')orbit.classList.add('hm-zoom-orbit');
    orbit.style.cssText=`width:${width}px;height:${height}px;min-height:0`;
    window.controller=TFB.testMountOrbit(orbit,{paused:true});
   },{kind,width,height});
   await page.locator('.hm-card img').first().evaluate(img=>img.decode());
   for(let step=0;step<5;step++){
    const snapshot=async phase=>{
     await page.evaluate(phase=>controller.setState({phase,paused:true}),phase);
     return (await page.locator('.hm-orbit').screenshot()).toString('base64');
    };
    await page.evaluate(phase=>controller.setState({phase,paused:true}),step+.25);
    assert(await page.locator('.hm-card').evaluateAll(cards=>cards.some(card=>Math.abs(Number(card.style.opacity)-.5)<.001)),'Outgoing picture fades across the whole half-step, not in a short burst');
    const before=await snapshot(step+.49999),after=await snapshot(step+.50001);
    const difference=await page.evaluate(async({before,after})=>{
     const pixels=async data=>{const img=new Image();img.src='data:image/png;base64,'+data;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(0,0,c.width,c.height).data;};
     const a=await pixels(before),b=await pixels(after);let changed=0,total=0;
     for(let i=0;i<a.length;i+=4){const d=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);total+=d;if(d>80)changed++;}
     return {changed:changed/(a.length/4),mean:total/(a.length/4)};
    },{before,after});
    assert(difference.changed<.001,`${engine.name()} ${kind} step ${step}: visible flash at depth switch: ${JSON.stringify(difference)}`);
    await page.evaluate(phase=>controller.setState({phase,paused:true}),step+1);
    assert.deepEqual(await page.locator('.hm-card').evaluateAll(cards=>cards.map(card=>card.style.opacity)),Array(5).fill('1'));
    assert.equal(await page.locator('.hm-stage').count(),1);
    assert.equal(await page.locator('.hm-stage > *').count(),5,'No temporary image layers');
   }
   await page.locator('.hm-orbit').screenshot({path:`/tmp/tfb298-${engine.name()}-${kind}.png`});
  }
  assert.deepEqual(errors,[]);
  console.log(`PASS ${engine.name()}: all five depth switches visually continuous in inline Home, inline News and zoom; no temporary layers; all cards opaque at rest.`);
 }finally{await browser.close();}
}
