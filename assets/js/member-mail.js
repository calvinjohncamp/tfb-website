// Board letter editor and central template archive. First draft: no sending action.
(() => {
 const ui=()=>TFB.ui,esc=value=>ui().esc(String(value??'')),admin=()=>Boolean(ui()?.isAdmin());
 let draft=null,rows=[],dirty=false,busy=false,activity='',owner=null,notice='',error=false,frameObserver,fieldObserver,testAttempt=null,deleted=null,testRecipient='',testReady=false;
 const fields=['name','date','subject','headline','salutation','body','closing','theme'];
 const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(new Date());
 const brand=()=>document.documentElement.classList.contains('tfb-logo-midnight-amber')?'club':'red';
 function example(){return {id:crypto.randomUUID(),etag:null,name:'Begrüßung zur neuen Saison',date:today(),subject:'Es geht wieder los – auf eine schöne Tennissaison!',headline:'Es geht wieder los.',salutation:'Liebe Mitglieder,',body:'die neue Saison steht vor der Tür. Wir freuen uns auf viele schöne Stunden auf unserer Anlage – auf spannende Ballwechsel, gemeinsame Matches und gute Gespräche nach dem Spiel.\n\nOb ihr schon lange dabei seid oder gerade erst zu uns gefunden habt: Schön, dass ihr Teil der Tennisfreunde Bielstein seid.\n\nAlle Informationen zu Training, Mannschaften und unseren gemeinsamen Terminen findet ihr wie gewohnt in unserer App. Weitere Neuigkeiten zur Saison geben wir euch rechtzeitig bekannt.\n\nLasst uns gemeinsam in eine schöne Tennissaison starten. Wir freuen uns auf euch!',closing:'Viele Grüße\nEuer Vorstand',theme:brand()};}
 async function call(path,data){if(!admin())throw Error('Bitte als Admin anmelden.');if(!TFB.directoryCall)throw Error('Das zentrale Mailarchiv ist auf der veröffentlichten Website verfügbar.');return TFB.directoryCall('/admin/member-mail'+path,data);}
 const confirmChange=()=>!dirty||confirm('Deine Änderungen sind noch nicht gespeichert. Trotzdem eine andere Mail öffnen?');
 const time=at=>new Intl.DateTimeFormat('de-DE',{dateStyle:'short',timeStyle:'short'}).format(new Date(at));
 function listHtml(){
  if(!rows.length)return '<p class="small muted">Deine gespeicherten Mails erscheinen hier.</p>';
  const years=[...new Set(rows.map(row=>row.date?.slice(0,4)||String(new Date(row.updatedAt).getFullYear())))].sort().reverse();
  return years.map(year=>`<details class="mm-year" open><summary>${esc(year)}</summary><div>${rows.filter(row=>(row.date?.slice(0,4)||String(new Date(row.updatedAt).getFullYear()))===year).map(row=>`<div class="mm-archive-row"><button type="button" class="mm-archive-item" data-mm-load="${esc(row.id)}" aria-current="${row.id===draft.id}"><b>${esc(row.name)}</b><small>Gespeichert ${esc(time(row.updatedAt))}</small></button><button type="button" class="mm-delete" data-mm-delete="${esc(row.id)}" aria-label="${esc(row.name)} löschen" title="Vorlage löschen">×</button></div>`).join('')}</div></details>`).join('');
 }
 function status(){const p=document.querySelector('[data-mm-status]');if(p){p.textContent=notice||(dirty?'Ungespeicherte Änderungen':draft?.etag?'Gespeicherte Vorlage':'Beispielvorlage · noch nicht gespeichert');p.classList.toggle('is-error',error);}document.querySelectorAll('[data-mm-save], [data-mm-copy], [data-mm-new], [data-mm-load], [data-mm-delete], [data-mm-test], [data-mm-undo]').forEach(button=>button.disabled=busy);const save=document.querySelector('[data-mm-save]');if(save){save.textContent=busy&&activity==='save'?'Wird gespeichert …':'Speichern';save.disabled=busy||Boolean(draft?.etag&&!dirty);}document.querySelector('[data-mm-editor]')?.classList.toggle('mm-busy',busy);const test=document.querySelector('[data-mm-test]');if(test){test.disabled=busy||!testReady;test.textContent=busy&&activity==='test'?'Testmail wird gesendet …':'Testmail an Admin';}const undo=document.querySelector('[data-mm-undo]');if(undo)undo.hidden=!deleted;}
 function changed(){dirty=true;notice='';error=false;status();}
 function fieldText(element){
  let text='';
  const walk=node=>{
   if(node.nodeType===3){text+=node.textContent;return;}
   if(node.nodeType!==1)return;
   if(node.tagName==='BR'){text+='\n';return;}
   const block=['DIV','P','LI'].includes(node.tagName);
   if(block&&text&&!text.endsWith('\n'))text+='\n';
   for(const child of node.childNodes)walk(child);
   if(block&&!text.endsWith('\n'))text+='\n';
  };
  for(const child of element.childNodes)walk(child);
  return text.replace(/\r\n?/g,'\n').replace(/\n+$/,'');
 }
 function readFields(){const doc=document.querySelector('[data-mm-preview]')?.contentDocument;for(const key of ['headline','salutation','body','closing']){const el=doc?.querySelector(`[data-mail-field="${key}"]`);if(el)draft[key]=fieldText(el);}}
 function mountLetter(){
  const frame=document.querySelector('[data-mm-preview]');if(!frame||!draft)return;
  frameObserver?.disconnect();fieldObserver?.disconnect();
  frame.onload=()=>{
   if(!frame.isConnected)return;const doc=frame.contentDocument;if(!doc)return;
   const resize=()=>{frame.style.height=Math.ceil(doc.documentElement.getBoundingClientRect().height)+'px';};
   frameObserver=new ResizeObserver(resize);frameObserver.observe(doc.documentElement);resize();doc.fonts.ready.then(resize);
   const onTextChange=()=>{if(!frame.isConnected||!draft||busy)return;const prior=['headline','salutation','body','closing'].map(key=>draft[key]);readFields();if(['headline','salutation','body','closing'].some((key,index)=>draft[key]!==prior[index]))changed();resize();};
   doc.addEventListener('input',onTextChange,true);
   fieldObserver=new MutationObserver(onTextChange);
   doc.querySelectorAll('[data-mail-field]').forEach(element=>fieldObserver.observe(element,{childList:true,characterData:true,subtree:true}));
   doc.addEventListener('paste',event=>{if(!event.target.closest('[data-mail-field]'))return;event.preventDefault();doc.execCommand('insertText',false,event.clipboardData.getData('text/plain'));});
   doc.addEventListener('click',event=>{if(event.target.closest('a'))event.preventDefault();});
   doc.querySelectorAll('[data-mail-field]').forEach(element=>element.setAttribute('contenteditable','plaintext-only'));
  };
  frame.srcdoc=TFB.memberMailTemplate.html(draft,{editable:true});
 }
 function renderEditor(){
  const panel=document.querySelector('[data-mm-editor]');if(!panel||!draft)return;
  panel.innerHTML=`<div class="mm-meta"><label class="field"><span>Name im Archiv</span><input data-mm-field="name" maxlength="120" value="${esc(draft.name)}" autocomplete="off"></label><label class="field"><span>Datum im Brief</span><input type="date" data-mm-field="date" value="${esc(draft.date)}"></label><label class="field mm-subject"><span>E-Mail-Betreff</span><input data-mm-field="subject" maxlength="200" value="${esc(draft.subject)}" autocomplete="off"></label></div><div class="mm-actions"><button class="btn small mm-save" type="button" data-mm-save>Speichern</button><button class="btn small" type="button" data-mm-copy>Speichern unter</button></div><p class="mm-status" data-mm-status role="status" aria-live="polite"></p><button type="button" class="link small mm-undo" data-mm-undo hidden>Löschen rückgängig machen</button><p class="mm-hint">Klicke in den Brief, um Überschrift, Anrede, Text und Gruß zu bearbeiten.</p><iframe class="mm-preview" data-mm-preview title="E-Mail-Brief direkt bearbeiten" sandbox="allow-same-origin"></iframe>`;
  mountLetter();status();paintArchive();
 }
 function paintArchive(){const list=document.querySelector('[data-mm-archive-list]');if(list)list.innerHTML=listHtml();const count=document.querySelector('[data-mm-count]');if(count)count.textContent=rows.length?String(rows.length):'';}
 async function view(){
  if(!admin())return '<section class="member-mail"><h1>E-Mail an alle Mitglieder</h1><p>Bitte als Admin anmelden, um E-Mails zu bearbeiten und das Mailarchiv zu öffnen.</p></section>';
  if(owner!==ui().state.member.id){owner=ui().state.member.id;draft=null;rows=[];dirty=false;notice='';deleted=null;testAttempt=null;testRecipient='';testReady=false;}
  await TFB.loadMemberMailTemplate();draft ||= example();
  try{const archive=await call('');rows=archive.rows;testRecipient=archive.testRecipient||ui().state.member.email||'';testReady=Boolean(archive.testReady);notice='';error=false;}catch(e){notice=e.message;error=true;}
  return `<section class="member-mail"><header class="view-head page-head"><div><p class="page-kicker">Post vom Vorstand</p><h1>E-Mail an alle Mitglieder</h1><p class="muted">Ein schöner Brief für unseren Club.</p></div><a class="view-close" href="#home" aria-label="Schließen">${ui().icon.close}</a></header><div class="mm-layout"><aside class="mm-sidebar"><section class="mm-send"><h2>Mail Versand</h2><button type="button" class="btn small mm-test" data-mm-test${testReady?'':' disabled'}>Testmail an Admin</button><button type="button" class="btn small mm-bulk" disabled aria-disabled="true" title="Der Versand an alle Mitglieder ist noch nicht verfügbar.">Mail an alle</button><p class="small muted">${testReady?`Test nur an ${esc(testRecipient)}. Betreff mit [TFB Test].`:'Testversand derzeit nicht verfügbar.'}</p></section><details class="mm-archive" open><summary>Mail Archiv <small data-mm-count></small></summary><p class="small muted">Nach dem Datum im Brief geordnet.</p><button type="button" class="btn small mm-new" data-mm-new>Neue Mail</button><div class="mm-archive-list" data-mm-archive-list></div></details></aside><div class="mm-editor" data-mm-editor></div></div></section>`;
 }
 let renderedRoot;
 new MutationObserver(()=>{const root=document.querySelector('[data-mm-editor]');if(root&&root!==renderedRoot&&admin()){renderedRoot=root;renderEditor();}}).observe(document.getElementById('app'),{childList:true,subtree:true});
 new MutationObserver(()=>{if(!document.querySelector('[data-mm-editor]')||!draft||busy)return;readFields();const next=brand();if(draft.theme!==next){draft.theme=next;changed();mountLetter();}}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 document.addEventListener('input',event=>{const key=event.target.dataset.mmField;if(!key||!draft||!admin()||busy)return;draft[key]=event.target.value;changed();if(key==='date'&&/^\d{4}-\d{2}-\d{2}$/.test(draft.date)){readFields();mountLetter();}});
 async function save(copyName){
  if(!admin()||busy)return;readFields();const candidate={...draft,...(copyName?{id:crypto.randomUUID(),etag:null,name:copyName}:{})};
  const payload={id:candidate.id,expectedEtag:candidate.etag||null,...Object.fromEntries(fields.map(key=>[key,candidate[key]]))};
  // Preserve copy identity on transport failures so retrying cannot create duplicates.
  if(copyName){draft=candidate;dirty=true;renderEditor();}
  busy=true;activity='save';notice='';error=false;status();
  try{const saved=await call('/save',payload);draft=saved;dirty=false;notice='Gespeichert · '+time(saved.updatedAt);try{({rows}=await call(''));}catch(_){rows=[{id:saved.id,name:saved.name,date:saved.date,updatedAt:saved.updatedAt,etag:saved.etag},...rows.filter(row=>row.id!==saved.id)];}renderEditor();}
  catch(e){notice=e.message;error=true;}
  finally{busy=false;activity='';status();paintArchive();}
 }
 async function sendTest(){
  if(!admin()||busy||!testReady)return;readFields();
  const value=Object.fromEntries(fields.map(key=>[key,draft[key]])),signature=JSON.stringify(value);
  if(testAttempt?.signature!==signature)testAttempt={signature,id:crypto.randomUUID()};
  busy=true;activity='test';notice='Testmail wird an deinen Adminzugang gesendet …';error=false;status();
  try{const result=await call('/test',{...value,requestId:testAttempt.id});notice='Testmail an '+result.to+' gesendet · '+time(result.sentAt);testAttempt=null;}
  catch(e){notice=e.message;error=true;}finally{busy=false;activity='';status();}
 }
 async function removeMail(id){
  const row=rows.find(row=>row.id===id);if(!row||!confirm('„'+row.name+'“ aus dem Mailarchiv löschen?'))return;
  busy=true;activity='archive';status();try{deleted=await call('/delete',{id,expectedEtag:row.etag});if(draft.id===id){draft=example();dirty=false;}rows=rows.filter(row=>row.id!==id);notice='Vorlage gelöscht.';error=false;renderEditor();}catch(e){notice=e.message;error=true;}finally{busy=false;activity='';status();paintArchive();}
 }
 async function undoDelete(){
  if(!deleted)return;busy=true;activity='archive';status();try{const restored=await call('/restore',{id:deleted.id,expectedEtag:deleted.etag});deleted=null;({rows}=await call(''));notice='Vorlage wiederhergestellt.';error=false;paintArchive();}catch(e){notice=e.message;error=true;}finally{busy=false;activity='';status();}
 }
 document.addEventListener('click',async event=>{
  if(!admin()||busy)return;
  if(event.target.closest('[data-mm-test]')){await sendTest();return;}
  if(event.target.closest('[data-mm-undo]')){await undoDelete();return;}
  const remove=event.target.closest('[data-mm-delete]');if(remove){await removeMail(remove.dataset.mmDelete);return;}
  if(event.target.closest('[data-mm-save]')){await save();return;}
  if(event.target.closest('[data-mm-copy]')){
   readFields();ui().openSheet(`<form data-mm-copy-form><h2>Speichern unter</h2><p class="muted">Die bisherige Vorlage bleibt erhalten.</p><label class="field"><span>Name der neuen Vorlage</span><input name="name" required maxlength="120" value="${esc(draft.name+' – Kopie')}" autocomplete="off"></label><p class="form-error" role="alert"></p><button class="btn primary" type="submit">Als neue Vorlage speichern</button></form>`);const form=document.querySelector('[data-mm-copy-form]');form.addEventListener('submit',async e=>{e.preventDefault();const name=form.elements.name.value.trim();if(!name){form.querySelector('.form-error').textContent='Bitte einen Namen eintragen.';return;}ui().closeSheet();await save(name);});return;
  }
  if(event.target.closest('[data-mm-new]')){if(!confirmChange())return;draft=example();dirty=false;notice='';error=false;renderEditor();return;}
  const load=event.target.closest('[data-mm-load]');if(load){if(!confirmChange())return;busy=true;activity='archive';status();try{const saved=await call('/'+load.dataset.mmLoad);draft=saved;dirty=false;notice='Vorlage geladen · gespeichert '+time(saved.updatedAt);error=false;renderEditor();}catch(e){notice=e.message;error=true;}finally{busy=false;activity='';status();}return;}
 });
 window.addEventListener('beforeunload',event=>{if(dirty&&admin()){event.preventDefault();event.returnValue='';}});
 TFB.views=TFB.views||{};TFB.views.membermail=view;
})();
