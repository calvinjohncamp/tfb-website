import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser = await chromium.launch({headless:true, ...(process.env.TFB_CHROME_PATH ? {executablePath:process.env.TFB_CHROME_PATH} : {})});
try {
  const page = await browser.newPage({serviceWorkers:'block'});
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5180/');
  await page.waitForFunction(()=>window.TFB?.ui);
  await page.evaluate(()=>{
    const make=(w,h)=>{const c=document.createElement('canvas'); c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle='#C4553A';ctx.fillRect(0,0,w,h);return c.toDataURL();};
    const db=JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.accounts=db.accounts.filter(a=>!['m-demo','m1'].includes(a.memberId));
    db.accounts.push({memberId:'m-demo',feedRules:'yes'},{memberId:'m1',avatar:make(100,100),avatarLarge:make(600,1000)});
    db.community.posts=[{id:'original-test',authorId:'m1',scope:'club',title:'Testfoto',text:'Profilbild',images:[],createdAt:new Date().toISOString()}];
    localStorage.setItem('tfb_kiosk_demo_v1',JSON.stringify(db));
    localStorage.setItem('tfb_kiosk_demo_session_v1','m-demo');
  });
  await page.goto('http://127.0.0.1:5180/#chat'); await page.reload();
  for(const width of [1100,390]) {
    await page.setViewportSize({width,height:900});
    const avatar=page.locator('.fpost-avatar img').first(); await avatar.waitFor(); await avatar.click();
    const photo=page.locator('.lightbox img'); await photo.waitFor(); await photo.evaluate(img=>img.decode());
    assert.deepEqual(await photo.evaluate(img=>[img.naturalWidth,img.naturalHeight]),[600,1000]);
    const b=await photo.boundingBox(); assert.ok(Math.abs(b.width/b.height-0.6)<0.01);assert.ok(b.x>=0&&b.x+b.width<=width);
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.lightbox')).opacity==='1');
    await page.screenshot({path:`/tmp/tfb-avatar-original-${width}.png`});
    await page.keyboard.press('Escape'); await page.locator('.lightbox').waitFor({state:'detached'});
    await avatar.focus();await page.keyboard.press('Enter');await photo.waitFor();
    await page.locator('.lightbox-close').click();await page.locator('.lightbox').waitFor({state:'detached'});
  }
  assert.deepEqual(errors,[]);
  console.log('Profilbild: Original 600×1000 statt Vorschau 100×100; Desktop/iPhone-Breite, Tastatur und Schließen geprüft.');
} finally {await browser.close();}
