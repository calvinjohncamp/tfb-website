(function(){
 const cfg=TFB.config.memberDirectory;
 const isRemote=Boolean(cfg?.enabled&&location.protocol==='https:'&&cfg.hosts.includes(location.hostname));
 const fallback=TFB.partners.slice();let splash=null,revision=0;
 const cache='tfb_partner_public_v1';
 function apply(data){if(!data||!Array.isArray(data.partners)||!data.splash)return false;TFB.partners=data.partners;splash=data.splash;revision=data.revision;TFB.resetPartnerRotation?.();return true;}
 if(isRemote){try{apply(JSON.parse(localStorage.getItem(cache)||'null'));}catch(_){}}
 async function refresh(){
  if(!isRemote)return;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);
  try{const response=await fetch(cfg.url.replace(/\/$/,'')+'/public/partner-content',{cache:'no-store',credentials:'omit',signal:controller.signal});if(!response.ok)throw Error('Partner konnten nicht geladen werden.');const data=await response.json();if(apply(data)){try{localStorage.setItem(cache,JSON.stringify(data));}catch(_){}}}
  catch(_){/* Last public content remains available offline. */}finally{clearTimeout(timer);}
 }
 async function saveSplash(value){
  if(!TFB.ui?.isAdmin())throw Error('Nur Admins dürfen die Einstiegsseite ändern.');
  const result=await TFB.directoryCall('/admin/partner-settings',{revision,splash:value});splash=result.splash;revision=result.revision;await refresh();
 }
 TFB.partnerContent={isRemote,refresh,saveSplash,get splash(){return splash;},get revision(){return revision;},fallback};
 TFB.partnerContent.ready=refresh();
})();
