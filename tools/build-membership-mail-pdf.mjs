// Presentation only. Uses the rendered sample; never submits an application.
import {mkdirSync,copyFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,'output/pdf/tfb-mitgliedsanmeldung-muster.pdf');
mkdirSync(resolve(root,'output/pdf'),{recursive:true});
mkdirSync(resolve(root,'assets/docs'),{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:794,height:1123}});
  await page.goto(new URL('../docs/entwuerfe/mitgliedsanmeldung-email.html',import.meta.url).href);
  await page.emulateMedia({media:'screen'});
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.mail-logo').evaluate(img=>img.decode());
  await page.evaluate(()=>{
    // Keep the visual button but no fake confirmation action inside the PDF.
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.removeAttribute('href'));
    const note=document.createElement('div');
    note.textContent='PRÄSENTATIONSMUSTER · Fiktive Beispieldaten · E-Mail-Versand noch nicht aktiviert';
    note.style.cssText="padding:12px 16px 0;text-align:center;font:11px/1.5 'TFB DM Sans',Arial,sans-serif;color:#686868";
    document.body.prepend(note);
  });
  await page.pdf({path:output,format:'A4',scale:.82,printBackground:true,margin:{top:'6mm',right:'6mm',bottom:'6mm',left:'6mm'},tagged:true});
  copyFileSync(output,resolve(root,'assets/docs/tfb-mitgliedsanmeldung-muster.pdf'));
  console.log(output);
}finally{await browser.close();}
