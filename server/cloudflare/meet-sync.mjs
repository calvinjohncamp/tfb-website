// Shared planning records. Permissions derive from the session and stored invitations.
export const meetingKinds = new Set(['group','series','meet','meet-answer','group-answer','meet-inbox','meet-notice','meet-remind']);
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const clone=v=>JSON.parse(JSON.stringify(v));
const text=(v,max=2000)=>{if(typeof v!=='string'||v.length>max)fail(400,'Ungültiger Verabredungstext.');return v;};
const day=v=>{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v+'T12:00:00Z'))||new Date(v+'T12:00:00Z').toISOString().slice(0,10)!==v)fail(400,'Ungültiges Datum.');return v;};
const time=v=>{if(typeof v!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(v))fail(400,'Ungültige Uhrzeit.');return v;};
export const berlinDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const addDays=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const everyone=g=>[...new Set([g.createdBy,...g.members,...g.pending])];
const row=(c,kind,id)=>c.map.get(kind+':'+id);
const projectedGroup=(c,r)=>{
  const g=clone(r.value),all=everyone(g);g.members=[g.createdBy];g.pending=[];
  for(const id of all){if(id===g.createdBy)continue;const answer=row(c,'group-answer',g.id+':'+id);
    const status=answer&&!answer.deleted&&answer.value.invitation===(r.value.inviteEpochs?.[id]||0)?answer.value.status:null;
    if(status==='yes'||(!status&&r.value.members.includes(id)))g.members.push(id);
    else if(!status)g.pending.push(id);
  }
  return g;
};
const participant=(r,id)=>r&&(r.value.createdBy===id||(r.value.invitees||[...(r.value.members||[]),...(r.value.pending||[])]).includes(id));
export function meetingProjection(c,member) {
  const groups=c.rows.filter(r=>r.kind==='group'&&!r.deleted).map(r=>projectedGroup(c,r));
  const meets=c.rows.filter(r=>r.kind==='meet'&&!r.deleted).map(r=>{
    const m=clone(r.value);m.responses={};
    for(const a of c.rows.filter(a=>a.kind==='meet-answer'&&!a.deleted&&a.value.meetId===m.id&&m.invitees.includes(a.value.memberId)))if(a.value.a)m.responses[a.value.memberId]={a:a.value.a,at:a.value.at,note:a.value.note,...(a.value.by?{by:a.value.by}:{})};
    return m;
  });
  const visibleGroups=new Set(c.rows.filter(r=>r.kind==='group'&&(r.deleted?participant(r,member.id):participant({value:projectedGroup(c,r)},member.id))).map(r=>r.id));
  const visibleMeets=new Set(c.rows.filter(r=>r.kind==='meet'&&participant(r,member.id)).map(r=>r.id));
  const visibleSeries=new Set(c.rows.filter(r=>r.kind==='series'&&(r.value.createdBy===member.id||(r.value.groupId&&row(c,'group',r.value.groupId)&&!row(c,'group',r.value.groupId).deleted?participant({value:projectedGroup(c,row(c,'group',r.value.groupId))},member.id):participant(r,member.id)))).map(r=>r.id));
  const records=c.rows.filter(r=>
    (r.kind==='group'&&visibleGroups.has(r.id))||(r.kind==='meet'&&visibleMeets.has(r.id))||(r.kind==='series'&&visibleSeries.has(r.id))||
    (['meet-answer','meet-remind'].includes(r.kind)&&visibleMeets.has(r.value?.meetId))||(r.kind==='group-answer'&&visibleGroups.has(r.value?.groupId))||
    (['meet-inbox','meet-notice','group-answer'].includes(r.kind)&&r.owner_id===member.id));
  const data={groups:groups.filter(g=>visibleGroups.has(g.id)),meets:meets.filter(m=>visibleMeets.has(m.id)),series:c.rows.filter(r=>r.kind==='series'&&!r.deleted&&visibleSeries.has(r.id)).map(r=>clone(r.value)),inbox:[],noSampleGroups:true};
  const status=row(c,'meet-inbox',member.id)?.value||{},read=new Set(status.read||[]),dismissed=new Set(status.dismissed||[]);
  const put=n=>{if(n.to!==member.id||dismissed.has(n.id))return;data.inbox.push({...n,read:read.has(n.id)||Boolean(n.read),extra:n.extra||{}});};
  const atOf=r=>r.updated_at||Date.now();
  for(const g of data.groups){const r=row(c,'group',g.id);
    if(g.pending.includes(member.id))put({id:'gi:'+g.id+':'+(r.value.inviteEpochs?.[member.id]||0),to:member.id,type:'group-invite',from:g.createdBy,groupId:g.id,snap:{title:g.name},at:atOf(r)});
  }
  for(const m of data.meets){if(m.date<berlinDay())continue;const r=row(c,'meet',m.id);
    if(member.id!==m.createdBy&&!m.responses[member.id])put({id:'mi:'+m.id,to:member.id,type:'invite',from:m.createdBy,meetId:m.id,snap:{title:m.title,date:m.date,time:m.time},at:atOf(r)});
    if(member.id===m.createdBy)for(const a of c.rows.filter(a=>a.kind==='meet-answer'&&!a.deleted&&a.value.meetId===m.id&&a.value.memberId!==member.id&&a.value.a&&!a.value.imported))put({id:'ma:'+a.id+':'+a.revision,to:member.id,type:a.value.a,from:a.value.memberId,meetId:m.id,snap:{title:m.title,date:m.date,time:m.time},at:a.value.at,extra:{note:a.value.note}});
  }
  for(const r of records.filter(r=>r.kind==='meet-remind'&&!r.deleted)) {
    const m=data.meets.find(m=>m.id===r.value.meetId);
    if(m&&m.createdBy!==member.id&&!m.responses[member.id])put({id:'mr:'+r.id,to:member.id,type:'remind',from:m.createdBy,meetId:m.id,snap:{title:m.title,date:m.date,time:m.time},at:r.value.at});
  }
  for(const r of c.rows.filter(r=>r.kind==='meet'&&r.deleted&&r.value&&participant(r,member.id)&&r.value.createdBy!==member.id&&r.value.date>=berlinDay()))put({id:'mc:'+r.id,to:member.id,type:'cancel',from:r.value.createdBy,meetId:r.id,snap:{title:r.value.title,date:r.value.date,time:r.value.time},at:atOf(r)});
  for(const a of c.rows.filter(a=>a.kind==='group-answer'&&!a.deleted&&!a.value.imported)){
    const g=data.groups.find(g=>g.id===a.value.groupId&&g.createdBy===member.id);
    if(g)put({id:'ga:'+a.id+':'+a.revision,to:member.id,type:a.value.status==='yes'?'group-yes':a.value.status==='left'?'group-left':'group-no',from:a.value.memberId,groupId:g.id,snap:{title:g.name},at:a.value.at});
  }
  for(const r of records.filter(r=>r.kind==='meet-notice'&&!r.deleted)){
    const n=r.value;
    if((n.meetId&&data.inbox.some(x=>x.meetId===n.meetId&&x.type===n.type))||(n.groupId&&data.inbox.some(x=>x.groupId===n.groupId&&x.type===n.type&&x.from===n.from)))continue;
    put(n);
  }
  data.inbox.sort((a,b)=>b.at-a.at);
  return {records,data,memberIds:[...new Set([...data.groups.flatMap(everyone),...data.meets.flatMap(m=>m.invitees),...data.series.flatMap(s=>s.invitees)])]};
}
export async function validateMeetingOperation(env,member,c,op,all,importing) {
  const old=row(c,op.kind,op.id),v=op.value,now=Date.now();
  if(!op.deleted&&(!v||typeof v!=='object'||Array.isArray(v)))fail(400,'Verabredungsdaten fehlen.');
  const ref=(kind,id)=>{const pending=all.find(x=>x.kind===kind&&x.id===id);return pending?{...pending,owner_id:row(c,kind,id)?.owner_id||member.id}:row(c,kind,id);};
  const activeIds=new Set((await env.DB.prepare('SELECT id FROM members WHERE active=1').all()).results.map(m=>m.id));
  const ids=v=>{if(!Array.isArray(v)||v.length>100||v.some(id=>typeof id!=='string'||!activeIds.has(id)))fail(400,'Bitte gültige aktive Mitglieder auswählen.');return [...new Set(v)];};
  let value,ownerId=old?.owner_id||member.id;
  if((old?.revision||0)!==op.revision&&op.kind!=='meet-inbox')fail(409,'Die Verabredung wurde auf einem anderen Gerät geändert. Bitte neu öffnen.');
  if(['group','series','meet'].includes(op.kind)) {
    if(old&&old.owner_id!==member.id)fail(403,'Ändern darf nur die Person, die die Verabredung oder Gruppe angelegt hat.');
    if(op.deleted){if(!old)fail(404,'Nicht mehr vorhanden.');return {...op,ownerId,value:{...old.value,cancelledAt:now},scope:''};}
    if(op.kind==='group') {
      const requested=ids([...(v.members||[]),...(v.pending||[]),member.id]);
      const members=importing?ids(v.members||[member.id]):(old?.value.members||[member.id]).filter(id=>requested.includes(id));
      if(!members.includes(member.id))members.unshift(member.id);
      const pending=requested.filter(id=>!members.includes(id)),inviteEpochs={};
      for(const id of requested)inviteEpochs[id]=old&&everyone(projectedGroup(c,old)).includes(id)?old.value.inviteEpochs?.[id]||0:importing?0:(old?.revision||0)+1;
      value={id:op.id,name:text(v.name,120),createdBy:member.id,members,pending,inviteEpochs};
      // Retain older training defaults without requiring them for a people-only group.
      if(v.weekday!=null){if(!Number.isInteger(v.weekday)||v.weekday<0||v.weekday>6)fail(400,'Trainingstag prüfen.');Object.assign(value,{weekday:v.weekday,time:time(v.time),place:text(v.place||'',200)});}
      if(!value.name.trim())fail(400,'Bitte einen Gruppennamen eingeben.');
    } else {
      if(!['einzel','doppel','training','frei'].includes(v.kind))fail(400,'Ungültige Verabredungsart.');
      const invitees=ids([...(v.invitees||[]),member.id]);
      const g=v.groupId?ref('group',v.groupId):null;
      if(v.groupId&&(!g||g.deleted||!(g.value.createdBy===member.id||projectedGroup(c,g).members.includes(member.id))))fail(403,'Keine Berechtigung für diese Gruppe.');
      const slots=v.kind==='einzel'?2:v.kind==='doppel'?4:v.slots==null?null:v.slots;
      if(slots!==null&&(!Number.isInteger(slots)||slots<2||slots>100))fail(400,'Ungültige Platzanzahl.');
      value={id:op.id,kind:v.kind,groupId:v.groupId||null,title:text(v.title,120),time:time(v.time),place:text(v.place||'',200),note:text(v.note||''),meetAt:v.meetAt?time(v.meetAt):'',departAt:v.departAt?time(v.departAt):'',createdBy:member.id,invitees,slots,createdAt:old?.value.createdAt||(importing&&v.createdAt?v.createdAt:new Date().toISOString())};
      if(!value.title.trim()||invitees.length<2)fail(400,'Bitte einen Titel und mindestens eine weitere Person wählen.');
      if(op.kind==='series') {
        const from=day(v.from),until=day(v.until);
        if(until<from||Date.parse(until)-Date.parse(from)>2*366*86400000||!Number.isInteger(v.leadDays)||v.leadDays<1||v.leadDays>7)fail(400,'Zeitraum oder Vorlauf prüfen.');
        if(!Array.isArray(v.skipped||[])||(v.skipped||[]).length>200)fail(400,'Ungültige ausgenommene Termine.');
        Object.assign(value,{from,until,leadDays:v.leadDays,skipped:[...new Set((v.skipped||[]).map(day))],reservedDates:importing?(v.reservedDates||[]).map(day):old?.value.reservedDates||[]});
      } else {
        value.date=day(v.date);value.seriesId=v.seriesId||null;
        if(v.seriesId){const s=ref('series',v.seriesId);if(!s||s.deleted||s.owner_id!==member.id)fail(403,'Ungültige Trainingsserie.');}
      }
    }
  } else if(op.kind==='meet-answer') {
    const m=ref('meet',v?.meetId||old?.value.meetId),target=v?.memberId||old?.value.memberId;
    if(!m||m.deleted||!m.value.invitees.includes(target)||(target!==member.id&&m.value.createdBy!==member.id))fail(403,'Du kannst nur selbst oder als einladende Person antworten.');
    if(op.id!==m.id+':'+target||op.deleted)fail(400,'Ungültige Antwortkennung.');
    if(!['yes','no',null].includes(v.a))fail(400,'Ungültige Antwort.');
    ownerId=target;
    const at=importing&&Number.isFinite(v.at)?v.at:old?.value.a===v.a?old.value.at:now;
    if(at>now+60000||at<0)fail(400,'Ungültiger Antwortzeitpunkt.');
    value={meetId:m.id,memberId:target,a:v.a,note:text(v.note||'',60),at,imported:Boolean(importing),...(importing?(v.by===m.value.createdBy?{by:v.by}:{}):target!==member.id?{by:member.id}:{})};
  } else if(op.kind==='group-answer') {
    const g=ref('group',v?.groupId),target=member.id;
    if(!g||g.deleted||!everyone(g.value).includes(target)||g.value.createdBy===target||op.id!==g.id+':'+target||op.deleted)fail(403,'Diese Gruppen-Einladung ist nicht verfügbar.');
    if(!['yes','no','left'].includes(v.status))fail(400,'Ungültige Gruppenantwort.');
    value={groupId:g.id,memberId:target,status:v.status,invitation:g.value.inviteEpochs?.[target]||0,at:now};
  } else if(op.kind==='meet-remind') {
    const m=ref('meet',v?.meetId);
    if(old||op.deleted||!m||m.deleted||m.value.createdBy!==member.id)fail(403,'Erinnern darf nur die einladende Person.');
    value={meetId:m.id,at:now};
  } else if(op.kind==='meet-inbox') {
    if(op.id!==member.id||op.deleted)fail(403,'Nur das eigene Postfach kann geändert werden.');
    value={};for(const name of ['read','dismissed']){
      const values=v[name]||[];if(!Array.isArray(values)||values.length>10000||values.some(x=>typeof x!=='string'||x.length>240))fail(400,'Ungültiger Postfachstatus.');
      value[name]=[...new Set([...(old?.value[name]||[]),...values])];
    }
    return {...op,revision:old?.revision||0,ownerId:member.id,value,scope:''};
  } else if(op.kind==='meet-notice') {
    if(!importing||old||op.deleted||v.to!==member.id)fail(403,'Hinweise werden vom Server erstellt.');
    const related=v.groupId?ref('group',v.groupId):ref('meet',v.meetId);
    if(!related||!participant(related,member.id))fail(403,'Hinweis gehört nicht zu deinen Verabredungen.');
    value={id:op.id,to:member.id,type:text(v.type,30),from:typeof v.from==='string'&&activeIds.has(v.from)?v.from:null,...(v.groupId?{groupId:v.groupId}:{meetId:v.meetId}),snap:{title:text(v.snap?.title||'',120),...(v.snap?.date?{date:day(v.snap.date)}:{}),...(v.snap?.time?{time:time(v.snap.time)}:{})},at:Number.isFinite(v.at)?v.at:now,read:Boolean(v.read),extra:{note:text(v.extra?.note||'',60)}};
  } else fail(400,'Ungültige Verabredungsdaten.');
  return {...op,value,ownerId,scope:''};
}
export async function materializeMeetings(env,c,member) {
  const today=berlinDay(),created=[],statements=[];
  const groups=new Map(c.rows.filter(r=>r.kind==='group'&&!r.deleted).map(r=>[r.id,projectedGroup(c,r)]));
  const append=(kind,id,owner,value)=>{
    const payload=crypto.randomUUID(),json=JSON.stringify(value);
    statements.push(env.DB.prepare('INSERT INTO app_payloads(payload_id,part,data) VALUES (?,0,?)').bind(payload,json));
    statements.push(env.DB.prepare('INSERT INTO app_records(kind,id,owner_id,scope,revision,deleted,payload_id,updated_at) VALUES (?,?,?,\'\',1,0,?,?) ON CONFLICT(kind,id) DO NOTHING').bind(kind,id,owner,payload,Date.now()));
    statements.push(env.DB.prepare('DELETE FROM app_payloads WHERE payload_id=? AND NOT EXISTS(SELECT 1 FROM app_records WHERE payload_id=?)').bind(payload,payload));
  };
  for(const s of c.rows.filter(r=>r.kind==='series'&&!r.deleted&&participant(r,member.id))){
    for(let date=s.value.from,n=0;date<=s.value.until&&n<200&&created.length<5;date=addDays(date,7),n++){
      if(date<today||(s.value.skipped||[]).includes(date)||(s.value.reservedDates||[]).includes(date))continue;
      if(addDays(date,-s.value.leadDays)>today)break;
      if(c.rows.some(r=>r.kind==='meet'&&r.value?.seriesId===s.id&&r.value.date===date))continue;
      const g=groups.get(s.value.groupId),invitees=g?everyone(g):s.value.invitees;
      const id='mt-'+s.id+'-'+date,value={...s.value,id,date,seriesId:s.id,invitees:[...new Set([s.owner_id,...invitees])],createdAt:new Date().toISOString()};
      delete value.from;delete value.until;delete value.leadDays;delete value.skipped;
      append('meet',id,s.owner_id,value);append('meet-answer',id+':'+s.owner_id,s.owner_id,{meetId:id,memberId:s.owner_id,a:'yes',at:Date.now(),note:'',imported:false});created.push(id);
    }
  }
  if(statements.length)await env.DB.batch(statements);
  return created.length;
}
