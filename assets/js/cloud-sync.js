// Authenticated central demo data; file:// demos continue to use the local API.
(function () {
  if (!TFB.api.secureDirectory || !TFB.directoryCall) return;
  const api=TFB.api, call=TFB.directoryCall, local={};
  const photoOwners=new Map(), localOriginal=api.avatarOriginal.bind(api);
  let member=null, state=null, publicMember=null, queue=Promise.resolve(), last=0, pending=null, generation=0;
  const id=()=>crypto.randomUUID(), key=r=>r.kind+':'+r.id;
  const writeNames=['saveCatalog','setAvatar','setPhotoPermissions','updateProfile','acceptConsent','acceptFeedRules','setParentConsent','addToTab','undo','addPost','editPost','deletePost','removePostFromTeam','hidePost','addComment','editComment','deleteComment','readChatPosts','readCommentPosts'];
  const readNames=['posts','comments','teamPostCounts','myOpenMonth','myStatements'];
  for(const name of [...writeNames,...readNames,'images','putMemberImage'])local[name]=api[name].bind(api);
  function serial(fn) { const task=queue.then(fn,fn);queue=task.catch(()=>{});return task; }
  const storage=(mode,run)=>new Promise((resolve,reject)=>{
    const req=indexedDB.open('tfb_sync_recovery_v1',1);
    req.onupgradeneeded=()=>req.result.createObjectStore('archives');
    req.onerror=()=>reject(Error('Die lokale Sicherung konnte nicht geöffnet werden.'));
    req.onsuccess=()=>{const db=req.result,tx=db.transaction('archives',mode),r=run(tx.objectStore('archives'));
      tx.oncomplete=()=>{db.close();resolve(r?.result);};tx.onerror=tx.onabort=()=>{db.close();reject(Error('Die lokale Sicherung konnte nicht gespeichert werden.'));};};
  });
  async function archive() {
    if(await storage('readonly',s=>s.get(member.id)))return;
    const db=api.syncArchive(), images=await local.images({strict:true});
    await storage('readwrite',s=>s.put({db,images,at:new Date().toISOString()},member.id));
  }
  async function rememberPending(value, ownerId=member?.id) {
    if(!ownerId)return;
    if(member?.id===ownerId)pending=value;
    await storage('readwrite',s=>value?s.put(value,'pending:'+ownerId):s.delete('pending:'+ownerId));
  }
  async function refresh(force=false) {
    if(!member)return;
    if(!force&&Date.now()-last<5000)return;
    const current=generation, next=await call('/app/state');
    if(current!==generation||!member)throw Error('Die Anmeldung wurde inzwischen geändert.');
    state=next;last=Date.now();
    for(const face of state.faces)photoOwners.set(face.avatar,face.id);
    const own=state.records.find(r=>r.kind==='account'&&r.id===member.id)?.value;
    if(own?.avatar)photoOwners.set(own.avatar,member.id);
    const m=await api.applySyncedData(state);
    publicMember=m;if(TFB.ui){TFB.ui.state.member=m;TFB.ui.state.catalog=state.catalog;TFB.ui.refreshAvatars?.();}
    api.syncError='';
    return m;
  }
  async function commit(operations,importing=false) {
    if(!operations.length)return;
    if(pending)throw Error('Eine frühere Speicherung muss zuerst abgeglichen werden. Bitte die App neu öffnen.');
    const command={id:id(),operations,importing}, ownerId=member.id, current=generation;
    await rememberPending(command,ownerId); // Durable before sending; exact replay after interrupted requests.
    try {if(current!==generation)throw Error('Die Anmeldung wurde inzwischen geändert.');await call('/app/commit',command);await rememberPending(null,ownerId);if(current!==generation)throw Error('Die Anmeldung wurde inzwischen geändert.');}
    catch(err) {
      // Keep ambiguous network failures for safe replay, never invent a success.
      if(err.status&&err.status<500){await rememberPending(null,ownerId);if(member?.id===ownerId)await refresh(true).catch(()=>{});}
      api.syncError=err.message;throw err;
    }
    await refresh(true);
  }
  api.connectSync=async m=>serial(async()=>{
    if(member?.id===m.id&&state)return (await refresh())||publicMember||m;
    member=m;generation++;await archive();
    pending=(await storage('readonly',s=>s.get('pending:'+member.id)))||null;
    if(pending){
      try {await call('/app/commit',pending);await rememberPending(null);}
      catch(err){if(!err.status||err.status>=500)throw err;
        await storage('readwrite',s=>s.put({command:pending,error:err.message,at:new Date().toISOString()},'conflict:'+member.id+':'+pending.id));
        await rememberPending(null);TFB.ui?.toast('Eine offene Änderung wurde auf einem anderen Gerät überholt. Bitte prüfe den aktuellen Stand.');
      }
    }
    return refresh(true);
  });
  api.disconnectSync=()=>{generation++;if(state)api.clearSyncedData?.();member=null;state=null;publicMember=null;pending=null;last=0;photoOwners.clear();};
  api.centralSync=true;
  for(const name of writeNames)api[name]=(...args)=>serial(async()=>{
    if(!member)throw Error('Bitte zuerst anmelden.');
    if(pending)throw Error('Die letzte Speicherung ist noch offen. Bitte die App neu öffnen.');
    if(name==='updateProfile'&&['firstName','lastName','email'].some(k=>args[0][k]!=null&&args[0][k]!==member[k]))throw Error('Änderungen an Name oder Anmelde-E-Mail bitte beim Verein vornehmen lassen.');
    await refresh(true);
    const before=new Map(api.syncSnapshot().map(r=>[key(r),r]));
    let result;
    try {
      result=await local[name](...args);
      const after=new Map(api.syncSnapshot().map(r=>[key(r),r]));
      const versions=new Map(state.records.map(r=>[key(r),r.revision]));
      const operations=[];
      for(const [k,r] of after)if(JSON.stringify(r.value)!==JSON.stringify(before.get(k)?.value))operations.push({...r,revision:versions.get(k)||0});
      for(const [k,r] of before)if(!after.has(k)){if(r.kind==='comment'&&!after.has('post:'+r.value.postId))continue;operations.push({...r,deleted:true,revision:versions.get(k)||0});}
      await commit(operations);
      if(['setAvatar','setPhotoPermissions','updateProfile','acceptConsent','acceptFeedRules','setParentConsent'].includes(name))return publicMember;
      document.dispatchEvent(new Event('tfb-chat-updated'));return result;
    } catch(err){if(state)await api.applySyncedData(state).catch(()=>{});throw err;}
  });
  for(const name of readNames)api[name]=(...args)=>serial(async()=>{
    if(!member)return name==='teamPostCounts'?{}:[];
    await refresh();return local[name](...args);
  });
  api.memberAvatars=ids=>serial(async()=>{
    if(!member)return {};
    const faces=await call('/app/faces',{ids:[...new Set(ids)].slice(0,100)});
    for(const face of faces)photoOwners.set(face.avatar,face.id);
    return api.cacheSyncedFaces(faces);
  });
  api.avatarOriginal=async preview=>{
    const ownerId=photoOwners.get(preview);
    if(ownerId&&member){const result=await call('/app/photo',{id:ownerId});return result.image;}
    return localOriginal(preview);
  };
  api.putMemberImage=data=>serial(async()=>{
    if(!member)throw Error('Bitte zuerst anmelden.');
    const ref='img:'+id();await commit([{kind:'media',id:ref,revision:0,value:{data}}]);return ref;
  });
  api.syncMigrationPreview=async()=>{
    if(!member)throw Error('Bitte zuerst anmelden.');
    const backup=await storage('readonly',s=>s.get(member.id));
    if(!backup)return {count:0};
    const ids=new Set([member.id,...(member.isAdmin?['m-demo']:[])]);
    const db=backup.db;
    const posts=db.community.posts.filter(p=>ids.has(p.authorId));
    const comments=(db.community.comments||[]).filter(c=>ids.has(c.authorId));
    const items=db.items.filter(i=>ids.has(i.memberId));
    const account=db.accounts.find(a=>a.memberId===member.id&&a.avatar)|| (member.isAdmin?db.accounts.find(a=>a.memberId==='m-demo'&&a.avatar):null);
    const catalog=Boolean(member.isAdmin&&!state.records.some(r=>r.kind==='catalog')&&JSON.stringify(db.catalog)!==JSON.stringify(state.catalog));
    return {catalog,posts:posts.length,comments:comments.length,items:items.length,photo:Boolean(account?.avatar),count:posts.length+comments.length+items.length+(account?.avatar?1:0)+(catalog?1:0),backup,ids:[...ids]};
  };
  api.importLocalSync=()=>serial(async()=>{
    await refresh(true);const plan=await api.syncMigrationPreview();
    if(!plan.count)return;
    const existing=new Map(state.records.map(r=>[key(r),r]));
    const db=plan.backup.db, ids=new Set(plan.ids), ops=[];
    const own=api.syncSnapshot().find(r=>r.kind==='account');
    const sources=[db.accounts.find(a=>a.memberId===member.id),member.isAdmin?db.accounts.find(a=>a.memberId==='m-demo'):null].filter(Boolean);
    if(sources.length) {
      // Import only missing settings/photo; never replace a newer central profile.
      const value={...own.value}, photo=sources.find(a=>a.avatar);
      if(!value.avatar&&photo)Object.assign(value,{avatar:photo.avatar,avatarLarge:photo.avatarLarge||photo.avatar,photoPublic:false});
      for(const k of ['feedRules','consentedAt','consentVersion'])if(!value[k]){const source=sources.find(a=>a[k]);if(source)value[k]=source[k];}
      if(JSON.stringify(value)!==JSON.stringify(own.value))ops.push({...own,value,revision:existing.get(key(own))?.revision||0});
    }
    if(plan.catalog)ops.push({kind:'catalog',id:'club',value:db.catalog,revision:0});
    const posts=db.community.posts.filter(p=>ids.has(p.authorId));
    const comments=(db.community.comments||[]).filter(c=>ids.has(c.authorId));
    const media=new Set([...posts,...comments].flatMap(p=>p.images||[]));
    // Upload photos before referencing them. Every upload is idempotent by its old ID.
    for(const ref of media)if(!existing.has('media:'+ref)&&plan.backup.images[ref])await commit([{kind:'media',id:ref,value:{data:plan.backup.images[ref]},revision:0}],true);
    for(const p of posts)if(!existing.has('post:'+p.id))ops.push({kind:'post',id:p.id,value:{...p,authorId:member.id},revision:0});
    for(const c of comments)if(!existing.has('comment:'+c.id)&&(existing.has('post:'+c.postId)||posts.some(p=>p.id===c.postId)))ops.push({kind:'comment',id:c.id,value:{...c,authorId:member.id},revision:0});
    for(const i of db.items.filter(i=>ids.has(i.memberId)))if(!existing.has('item:'+i.id))ops.push({kind:'item',id:i.id,value:{...i,memberId:member.id},revision:0});
    // One transaction avoids partially importing a small browser history. Larger
    // histories are chunked; existing IDs ensure a restart resumes without duplicates.
    for(let i=0;i<ops.length;i+=8)await commit(ops.slice(i,i+8),true);
    return refresh(true);
  });
  async function poll(){
    if(!member||document.hidden)return;
    try {const changed=await serial(async()=>{
      const revision=await call('/app/revision');
      if(state?.revision===revision.revision)return false;
      const old=state?.records.map(r=>[r.kind,r.id,r.revision]).join('|');await refresh(true);
      const changed=old!==state.records.map(r=>[r.kind,r.id,r.revision]).join('|');
      if(changed){document.dispatchEvent(new Event('tfb-chat-updated'));
        return true;}
    });if(changed&&!document.querySelector('#sheet-root:not(:empty), .editor, .lightbox')&&TFB.ui)await TFB.ui.renderView();
    }catch(err){api.syncError=err.message;}
  }
  setInterval(poll,10000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll();});
  window.addEventListener('online',poll);
})();
