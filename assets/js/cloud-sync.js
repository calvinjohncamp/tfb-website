// Authenticated central demo data; file:// demos continue to use the local API.
(function () {
  if (!TFB.api.secureDirectory || !TFB.directoryCall) return;
  const api=TFB.api, call=TFB.directoryCall, local={};
  const photoOwners=new Map(), localOriginal=api.avatarOriginal.bind(api);
  const nameLookup=api.memberNames.bind(api), knownFaces=new Map();
  let member=null, state=null, publicMember=null, queue=Promise.resolve(), last=0, pending=null, generation=0;
  const publicBase=TFB.config.memberDirectory.url.replace(/\/$/,'');
  let guest=null,guestAt=0,guestPending=null;
  async function guestState(){
    if(guest&&Date.now()-guestAt<10000)return guest;
    if(!guestPending)guestPending=fetch(publicBase+'/public/community',{cache:'no-store'}).then(async response=>{if(!response.ok)throw Error('Die öffentlichen Beiträge konnten nicht geladen werden.');guest=await response.json();guestAt=Date.now();return guest;}).finally(()=>guestPending=null);
    return guestPending;
  }
  api.publicCatalog=async()=> (await guestState()).catalog;
  const id=()=>crypto.randomUUID(), key=r=>r.kind+':'+r.id;
  const writeNames=['saveCatalog','setAvatar','setPhotoPermissions','updateProfile','acceptConsent','acceptFeedRules','setParentConsent','addToTab','undo','addPost','editPost','deletePost','removePostFromTeam','hidePost','addComment','editComment','deleteComment','hideComment','readChatPosts','readCommentPosts'];
  const readNames=['posts','comments','teamPostCounts','myOpenMonth','myStatements','tally'];
  for(const name of [...writeNames,...readNames,'images','putMemberImage'])local[name]=api[name].bind(api);
  api.images=async options=>({...await local.images(options),...(!member?Object.fromEntries((await guestState()).images.map(ref=>[ref,publicBase+'/public/chat-media?'+new URLSearchParams({ref})])):{})});
  function serial(fn) { const task=queue.then(fn,fn);queue=task.catch(()=>{});return task; }
  const storage=(mode,run)=>new Promise((resolve,reject)=>{
    const req=indexedDB.open('tfb_sync_recovery_v1',1);
    req.onupgradeneeded=()=>req.result.createObjectStore('archives');
    req.onerror=()=>reject(Error('Die lokale Sicherung konnte nicht geöffnet werden.'));
    req.onsuccess=()=>{const db=req.result,tx=db.transaction('archives',mode),r=run(tx.objectStore('archives'));
      tx.oncomplete=()=>{db.close();resolve(r?.result);};tx.onerror=tx.onabort=()=>{db.close();reject(Error('Die lokale Sicherung konnte nicht gespeichert werden.'));};};
  });
  async function archive() {
    if(TFB.meet?.snapshot){
      const original=await storage('readonly',s=>s.get('meet-original:'+member.id));
      const current=TFB.meet.snapshot(), saved=original?.data||{groups:[],meets:[],series:[],inbox:[],noSampleGroups:true};
      for(const name of ['groups','series','meets','inbox'])for(const value of current[name]||[])if(!saved[name].some(v=>v.id===value.id))saved[name].push(value);
      await storage('readwrite',s=>s.put({data:saved,at:original?.at||new Date().toISOString()},'meet-original:'+member.id));
    }
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
    const current=generation;
    if(!force&&state){
      const marker=await call('/app/revision');
      if(current!==generation||!member)throw Error('Die Anmeldung wurde inzwischen geändert.');
      if(marker.revision===state.revision){last=Date.now();return publicMember;}
    }
    const next=await call('/app/state');
    if(current!==generation||!member)throw Error('Die Anmeldung wurde inzwischen geändert.');
    state=next;last=Date.now();
    for(const face of state.faces)photoOwners.set(face.avatar,face.id);
    const own=state.records.find(r=>r.kind==='account'&&r.id===member.id)?.value;
    if(own?.avatar)photoOwners.set(own.avatar,member.id);
    knownFaces.clear();
    for(const person of state.members)knownFaces.set(person.id,null);
    for(const face of state.faces)knownFaces.set(face.id,face.avatar);
    knownFaces.set(member.id,own?.avatar||null);
    const m=await api.applySyncedData(state);
    if(state.meetProtocol===1&&TFB.meet?.applySynced)TFB.meet.applySynced(state.meetings);
    publicMember=m;if(TFB.ui){TFB.ui.state.member=m;TFB.ui.state.catalog=state.catalog;TFB.ui.refreshAvatars?.();}
    api.syncError='';
    return m;
  }
  async function commit(operations,importing=false) {
    if(!operations.length)return;
    if(pending)throw Error('Eine frühere Speicherung muss zuerst abgeglichen werden. Bitte die App neu öffnen.');
    const command={id:id(),operations,importing}, ownerId=member.id, current=generation;let acknowledgement;
    await rememberPending(command,ownerId); // Durable before sending; exact replay after interrupted requests.
    try {if(current!==generation)throw Error('Die Anmeldung wurde inzwischen geändert.');acknowledgement=await call('/app/commit',command);await rememberPending(null,ownerId);if(current!==generation)throw Error('Die Anmeldung wurde inzwischen geändert.');}
    catch(err) {
      // Keep ambiguous network failures for safe replay, never invent a success.
      if(err.status&&err.status<500){await rememberPending(null,ownerId);if(member?.id===ownerId)await refresh(true).catch(()=>{});}
      api.syncError=err.message;throw err;
    }
    guest=null;guestAt=0;
    const saved=acknowledgement?.catalogRecord;
    if(operations.length===1&&operations[0].kind==='catalog'&&saved&&saved.id==='club'){
      state.records=state.records.filter(r=>!(r.kind==='catalog'&&r.id==='club'));state.records.push(saved);state.catalog=saved.value;
      publicMember=await api.applySyncedData(state);last=Date.now();if(TFB.ui){TFB.ui.state.member=publicMember;TFB.ui.state.catalog=state.catalog;}
    }else await refresh(true);
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
    await refresh(true);
    if(state.meetProtocol===1){const original=await storage('readonly',s=>s.get('meet-original:'+member.id));if(original)await importMeetingSnapshot(original.data);}
    return publicMember;
  });
  api.disconnectSync=()=>{generation++;guest=null;guestAt=0;if(state){api.clearSyncedData?.();TFB.meet?.applySynced?.({groups:[],meets:[],series:[],inbox:[],noSampleGroups:true});}member=null;state=null;publicMember=null;pending=null;last=0;photoOwners.clear();knownFaces.clear();};
  api.centralSync=true;
  api.refreshKiosk=()=>serial(()=>refresh(true));
  for(const name of writeNames)api[name]=(...args)=>serial(async()=>{
    if(!member)throw Error('Bitte zuerst anmelden.');
    if(pending)throw Error('Die letzte Speicherung ist noch offen. Bitte die App neu öffnen.');
    if(name==='updateProfile'&&['firstName','lastName','email'].some(k=>args[0][k]!=null&&args[0][k]!==member[k]))throw Error('Änderungen an Name oder Anmelde-E-Mail bitte beim Verein vornehmen lassen.');
    const catalogBefore=name==='saveCatalog'?(args[1]?.expected??JSON.stringify(await api.catalog())):null;
    if(name!=='saveCatalog')await refresh();
    if(catalogBefore!==null&&catalogBefore!==JSON.stringify(await api.catalog()))throw Error('Das Sortiment wurde inzwischen geändert. Bitte die Produktbibliothek aktualisieren und die Änderung erneut vornehmen.');
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
  // Navigation reads the last confirmed cache immediately. Polling and writes
  // update it independently, so a slow mobile request cannot block a tap.
  for(const name of readNames)api[name]=async(...args)=>{
    if(!member){
      if(!['posts','comments','teamPostCounts'].includes(name))return [];
      const view=await guestState();
      if(name==='comments')return view.comments.filter(c=>c.postId===args[0]);
      if(name==='teamPostCounts'){const counts={};for(const p of view.posts)for(const team of [p.team,...(p.alsoTeams||[])].filter(Boolean))counts[team]=(counts[team]||0)+1;return counts;}
      return view.posts.filter(p=>p.scope===args[0]||(args[0]?.startsWith('team:')&&p.alsoTeams?.includes(args[0].slice(5)))||(args[0]==='club'&&args[1]?.withTeams)).map(p=>({...p,...(p.scope==='club'&&args[0]?.startsWith('team:')?{fromClub:true,shownIn:args[0].slice(5)}:{})})).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
    }
    const result=await local[name](...args);
    if(name!=='tally'||!state?.demoTally)return result;
    const own=result.find(r=>r.isMe)||{firstName:publicMember.firstName,lastName:publicMember.lastName,isMe:true,counts:{},cats:{},total:0};
    return [own,...state.demoTally].sort((a,b)=>a.lastName.localeCompare(b.lastName,'de')||a.firstName.localeCompare(b.firstName,'de'));
  };
  api.memberNames=async ids=>{
    if(!member)return {};
    const current=generation,result={},people=new Map((state?.members||[]).map(m=>[m.id,`${m.firstName} ${m.lastName}`.trim()]));
    const missing=[];
    for(const id of new Set(ids)){if(people.has(id))result[id]=people.get(id);else missing.push(id);}
    if(missing.length)Object.assign(result,await nameLookup(missing));
    return current===generation&&member?result:{};
  };
  api.memberAvatars=async ids=>{
    if(!member)return {};
    const current=generation,unique=[...new Set(ids)],missing=unique.filter(id=>!knownFaces.has(id));
    for(let i=0;i<missing.length;i+=100){
      const batch=missing.slice(i,i+100),faces=await call('/app/faces',{ids:batch});
      if(current!==generation||!member)return {};
      for(const id of batch)knownFaces.set(id,null);
      for(const face of faces){photoOwners.set(face.avatar,face.id);knownFaces.set(face.id,face.avatar);}
      if(faces.length)api.cacheSyncedFaces(faces);
    }
    return Object.fromEntries(unique.filter(id=>knownFaces.get(id)).map(id=>[id,knownFaces.get(id)]));
  };
  api.avatarOriginal=async preview=>{
    const ownerId=photoOwners.get(preview);
    if(ownerId&&member){const result=await call('/app/photo',{id:ownerId});return result.image;}
    return localOriginal(preview);
  };
  api.putMemberVideo = data => serial(async () => {
    if (!member) throw Error('Bitte zuerst anmelden.');
    return (await call('/app/chat-video', {data})).ref;
  });
  api.getMemberVideo = async (post, ref) => {
    const query = new URLSearchParams({post, ref});
    return (await (member?TFB.directoryFetch('/app/chat-video?' + query):fetch(publicBase+'/public/chat-media?'+query,{cache:'no-store'}))).blob();
  };
  api.putMemberImage=data=>serial(async()=>{
    if(!member)throw Error('Bitte zuerst anmelden.');
    const ref='img:'+id();await commit([{kind:'media',id:ref,revision:0,value:{data}}]);return ref;
  });
  const pick=(v,fields)=>Object.fromEntries(fields.filter(k=>v[k]!==undefined).map(k=>[k,JSON.parse(JSON.stringify(v[k]))]));
  const fields={group:['id','name','weekday','time','place','createdBy','members','pending'],
    series:['id','kind','groupId','title','time','place','note','meetAt','departAt','createdBy','invitees','slots','from','until','leadDays','skipped','active','createdAt'],
    meet:['id','kind','groupId','title','date','time','place','note','meetAt','departAt','createdBy','invitees','slots','seriesId','createdAt']};
  function planningOperations(snapshot,importing=false) {
    const records=new Map(state.records.map(r=>[key(r),r])),baseline=state.meetings,ops=[];
    const collections={group:'groups',series:'series',meet:'meets'},fresh=new Set();
    for(const [kind,collection] of Object.entries(collections)){
      for(const value of snapshot[collection]||[]){
        if(value.createdBy!==member.id)continue;
        const r=records.get(kind+':'+value.id);if(importing&&r)continue;
        const before=baseline[collection].find(v=>v.id===value.id);
        const clean=pick(value,fields[kind]);
        if(!before||JSON.stringify(clean)!==JSON.stringify(pick(before,fields[kind]))){
          if(importing&&kind==='series')clean.reservedDates=(snapshot.meets||[]).filter(m=>m.seriesId===value.id).map(m=>m.date);
          ops.push({kind,id:value.id,value:clean,revision:r?.revision||0});fresh.add(kind+':'+value.id);
        }
      }
      if(!importing)for(const before of baseline[collection])if(before.createdBy===member.id&&!(snapshot[collection]||[]).some(v=>v.id===before.id))ops.push({kind,id:before.id,revision:records.get(kind+':'+before.id)?.revision||0,deleted:true});
    }
    for(const g of snapshot.groups||[])if(!importing&&g.createdBy!==member.id){
      const before=baseline.groups.find(x=>x.id===g.id);if(!before)continue;
      const status=g.members.includes(member.id)?'yes':(g.pending||[]).includes(member.id)?'pending':before.members.includes(member.id)?'left':'no';
      const old=before.members.includes(member.id)?'yes':before.pending.includes(member.id)?'pending':'no';
      if(status!==old&&status!=='pending'){const id=g.id+':'+member.id;ops.push({kind:'group-answer',id,revision:records.get('group-answer:'+id)?.revision||0,value:{groupId:g.id,status}});}
    }
    for(const m of snapshot.meets||[]){
      if(importing&&!fresh.has('meet:'+m.id))continue;
      const before=baseline.meets.find(x=>x.id===m.id),ids=new Set([...Object.keys(before?.responses||{}),...Object.keys(m.responses||{})]);
      for(const target of ids){
        if(target!==member.id&&m.createdBy!==member.id)continue;
        const a=m.responses?.[target],old=before?.responses?.[target];if(JSON.stringify(a)===JSON.stringify(old))continue;
        const id=m.id+':'+target;ops.push({kind:'meet-answer',id,revision:records.get('meet-answer:'+id)?.revision||0,value:{meetId:m.id,memberId:target,a:a?.a||null,at:a?.at,note:a?.note||'',by:a?.by}});
      }
    }
    if(importing)for(const n of snapshot.inbox||[])if(n.to===member.id&&!records.has('meet-notice:'+n.id)&&(fresh.has('meet:'+n.meetId)||fresh.has('group:'+n.groupId)))ops.push({kind:'meet-notice',id:n.id,revision:0,value:n});
    if(!importing){
      const read=baseline.inbox.filter(n=>snapshot.inbox.some(x=>x.id===n.id&&x.read)&&!n.read).map(n=>n.id);
      const dismissed=baseline.inbox.filter(n=>!snapshot.inbox.some(x=>x.id===n.id)).map(n=>n.id);
      if(read.length||dismissed.length)ops.push({kind:'meet-inbox',id:member.id,revision:records.get('meet-inbox:'+member.id)?.revision||0,value:{read,dismissed}});
    }
    return ops;
  }
  async function importMeetingSnapshot(snapshot) {
    const archiveKey='meet-import:'+member.id;
    const unfinished=await storage('readonly',s=>s.get(archiveKey));
    let ops=unfinished?.length?unfinished:planningOperations(snapshot,true);
    // Keep the whole migration plan before the first request. After a reload,
    // skip already committed IDs, but still import missing replies and notices.
    ops=ops.filter(op=>!state.records.some(r=>key(r)===key(op)));
    await storage('readwrite',s=>s.put(ops,archiveKey));
    // Definitions precede answers; imported series reserve historical dates so
    // automatic generation cannot create duplicates during a resumed migration.
    while(ops.length){await commit(ops.slice(0,6),true);ops=ops.slice(6);await storage('readwrite',s=>s.put(ops,archiveKey));}
    return publicMember;
  }
  api.saveMeetSnapshot=snapshot=>{
    if(!member||state?.meetProtocol!==1)return Promise.reject(Error('Die zentrale Verabredung ist noch nicht verbunden. Bitte neu anmelden.'));
    const operations=planningOperations(snapshot);
    return serial(async()=>{try{await commit(operations);}catch(err){if(state.meetings)TFB.meet.applySynced(state.meetings);throw err;}return true;});
  };
  api.importMeetSync=()=>serial(async()=>{
    if(!member||state?.meetProtocol!==1)throw Error('Bitte zuerst anmelden.');
    const original=await storage('readonly',s=>s.get('meet-original:'+member.id));
    if(original)await importMeetingSnapshot(original.data);return publicMember;
  });
  api.remindMeet=meetId=>serial(()=>commit([{kind:'meet-remind',id:'remind-'+id(),revision:0,value:{meetId}}]));
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
    if(!member){
      if(document.hidden||!['chat','team','gefluester'].includes(TFB.ui?.currentView())||document.querySelector('#sheet-root:not(:empty),.editor,[data-form=auth],.lightbox,.cs-viewer'))return;
      const current=generation,before=JSON.stringify(guest);guestAt=0;
      try{const next=await guestState();if(current===generation&&!member&&JSON.stringify(next)!==before){TFB.imageRevision=(TFB.imageRevision||0)+1;await TFB.ui.renderView();}}catch{}
      return;
    }
    if(document.hidden||document.querySelector('#sheet-root .editor'))return;
    try {const changed=await serial(async()=>{
      const revision=await call('/app/revision');
      if(state?.revision===revision.revision)return false;
      const old=state?.records.map(r=>[r.kind,r.id,r.revision,r.value?.creditCents||0]).join('|');await refresh(true);
      const changed=old!==state.records.map(r=>[r.kind,r.id,r.revision,r.value?.creditCents||0]).join('|');
      if(changed){document.dispatchEvent(new Event('tfb-chat-updated'));
        return true;}
    });if(changed&&!document.querySelector('#sheet-root:not(:empty), .editor, .lightbox')&&TFB.ui)await TFB.ui.renderView();
    }catch(err){api.syncError=err.message;}
  }
  setInterval(poll,10000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll();});
  window.addEventListener('online',poll);
  // Both app entrances read the same authoritative kiosk journal, including Padel-origin purchases.
  api.myOpenMonth=async()=>{
    if(!member)return {month:new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Berlin'}).slice(0,7),items:[],totalCents:0};
    const owner=member.id,r=await call('/app/kiosk/report');if(member?.id!==owner)throw Error('Die Anmeldung hat sich geändert.');
    return {month:r.from.slice(0,7),totalCents:r.totalCents,items:r.entries.filter(e=>e.net_cents>0).map(e=>({id:e.id,productId:e.product_id,productName:e.product_name,priceCents:e.net_cents,createdAt:e.created_at,quantity:e.quantity||1,origin:e.origin}))};
  };
  api.tally=async()=>member?call('/app/kiosk/tally'):[];
})();
