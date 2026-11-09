// Compatibility entry point: the implementation is the common kiosk release.
TFB.sharedKioskReady=(async()=>{
 if(!globalThis.ClubKiosk?.create){
  const base='https://joern-kaemper.de/assets/shared-kiosk/20261109-shared-1/';
  for(const name of['asset-base.js','art.js','kiosk.js','billing.js'])await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=base+name;script.onload=resolve;script.onerror=()=>reject(Error('Der gemeinsame Kiosk konnte nicht geladen werden.'));document.head.append(script);});
 }
 const css='https://joern-kaemper.de/assets/shared-kiosk/20261109-shared-1/native.css';
 if(!document.querySelector('link[href="'+css+'"]'))await new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href=css;link.onload=resolve;link.onerror=()=>reject(Error('Der Kiosk konnte gerade nicht geladen werden.'));document.head.append(link);});
 ClubKiosk.installArt(TFB);
})();
