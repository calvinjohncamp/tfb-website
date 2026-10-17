// Local design preview only. No SMTP, recipient list, real token or live integration.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,'docs/entwuerfe');mkdirSync(resolve(output,'assets'),{recursive:true});
const original='data:image/png;base64,'+readFileSync(resolve(root,'assets/brand/tfb-logo-original.png')).toString('base64');
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:900,height:402},deviceScaleFactor:1});
  await page.setContent(`<style>
    html,body{margin:0;background:transparent;width:900px;height:402px;overflow:hidden}
    .mark{position:relative;width:100%;height:100%;overflow:hidden}
    .ink,.ball{position:absolute;left:calc(-92 / 1803 * 100%);top:calc(-78 / 805 * 100%);width:calc(2000 / 1803 * 100%);height:calc(1000 / 805 * 100%);background:#171717;mask:url('${original}') 0 0/100% 100% no-repeat;mask-mode:alpha}
    .ball{background:#C4553A;clip-path:inset(46.4% 5.2% 25.6% 80.8%)}
  </style><div class="mark"><span class="ink"></span><span class="ball"></span></div>`);
  await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},original);
  await page.screenshot({path:resolve(output,'assets/tfb-mail-logo.png'),omitBackground:true});
  const values={first_name:'Anna',applicant_name:'Anna Beispiel',membership_label:'Aktive Mitgliedschaft',confirmation_url:'#vorschau-kein-echter-bestaetigungslink',logo_url:'assets/tfb-mail-logo.png',assets_base:'../..'};
  const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const html=readFileSync(resolve(root,'server/templates/mitgliedsanmeldung.html'),'utf8').replace(/\{\{([a-z_]+)\}\}/g,(_,key)=>{if(!(key in values))throw Error('Missing preview value: '+key);return esc(values[key]);});
  writeFileSync(resolve(output,'mitgliedsanmeldung-email.html'),html);
  await page.setViewportSize({width:860,height:1000});
  await page.goto(new URL('../docs/entwuerfe/mitgliedsanmeldung-email.html',import.meta.url).href);
  await page.evaluate(()=>document.fonts.ready);await page.locator('.mail-logo').evaluate(img=>img.decode());
  await page.screenshot({path:resolve(output,'mitgliedsanmeldung-desktop.png'),fullPage:true});
  for(const width of [320,390,620]){
    await page.setViewportSize({width,height:844});
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Email overflow at '+width);
    if(width===390)await page.screenshot({path:resolve(output,'mitgliedsanmeldung-mobil.png'),fullPage:true});
  }
  // Font fallback is intentionally available for clients that do not load webfonts.
  await page.addStyleTag({content:'*{font-family:Arial,sans-serif!important}'});
  await page.setViewportSize({width:320,height:844});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Fallback font overflow');
  console.log('Preview generated: desktop/mobile, 320–860 px, local fonts and Arial fallback. No email sent.');
}finally{await browser.close();}
