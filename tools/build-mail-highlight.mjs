// Rasterize the existing vector marker for email clients without SVG support.
import {readFileSync} from 'node:fs';
const {chromium}=await import(process.env.TFB_PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:960,height:144},deviceScaleFactor:1});
 const svg=readFileSync(new URL('../assets/brand/tfb-highlight-freihand.svg',import.meta.url),'utf8');
 await page.setContent('<style>html,body{margin:0;background:transparent}svg{display:block;width:960px;height:144px}</style>'+svg);
 await page.locator('svg').screenshot({path:new URL('../assets/brand/tfb-highlight-freihand-mail.png',import.meta.url).pathname,omitBackground:true});
 console.log('Email marker: existing SVG paths and opacity, transparent 960 × 144 PNG.');
}finally{await browser.close();}
