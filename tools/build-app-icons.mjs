// App icons use the original logo geometry; the browser favicon has its own source.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {chromium} from 'playwright';

const root=fileURLToPath(new URL('../',import.meta.url));
const original='data:image/png;base64,'+readFileSync(resolve(root,'assets/brand/tfb-logo-original.png')).toString('base64');
// Original: 2000 × 1000. Mark without subtitle: 1803 × 664 at (92,78).
// Ball: original box 280 × 280 at (1616,464). Both layers use the SAME mask.
const browser=await chromium.launch({headless:true});
try{
  for(const [file,size,width] of [
    ['assets/brand/tfb-app-icon-source.png',1024,80/88*100],
    ['assets/icons/icon-512.png',512,80/88*100],
    ['assets/icons/icon-192.png',192,80/88*100],
    ['assets/icons/icon-180.png',180,80/88*100],
    // Entire mark fits inside the central 80%-diameter safe circle.
    ['assets/icons/icon-maskable-512.png',512,72],
  ]){
    const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
    await page.setContent(`<style>
      html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#F5F0E6}
      .mark{position:absolute;left:${(100-width)/2}%;top:50%;width:${width}%;aspect-ratio:1803/664;transform:translateY(-50%);overflow:hidden}
      .ink,.ball{position:absolute;left:calc(-92 / 1803 * 100%);top:calc(-78 / 664 * 100%);width:calc(2000 / 1803 * 100%);height:calc(1000 / 664 * 100%);background:#1C1A17;mask:url('${original}') 0 0/100% 100% no-repeat;mask-mode:alpha}
      .ball{background:#C4553A;clip-path:inset(46.4% 5.2% 25.6% 80.8%)}
    </style><div class="mark"><span class="ink"></span><span class="ball"></span></div>`);
    await page.evaluate(async src=>{const image=new Image();image.src=src;await image.decode();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},original);
    await page.screenshot({path:resolve(root,file),omitBackground:false});
    await page.close();console.log(`${file}: ${size} × ${size}`);
  }
}finally{await browser.close();}
