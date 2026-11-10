// Board letter editor and central template archive. First draft: no sending action.
(() => {
 const ui=()=>TFB.ui,esc=value=>ui().esc(String(value??'')),admin=()=>Boolean(ui()?.isAdmin());
 let draft=null,rows=[],dirty=false,busy=false,owner=null,notice='',error=false,frameObserver,fieldObserver;
 const fields=['name','date','subject','headline','salutation','body','closing','theme'];
 const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(new Date());
 const brand=()=>document.documentElement.classList.contains('tfb-logo-midnight-amber')?'club':'red';
 function example(){return {id:crypto.randomUUID(),etag:null,name:'Begrüßung zur neuen Saison',date:today(),subject:'Es geht wieder los – auf eine schöne Tennissaison!',headline:'Es geht wieder los.',salutation:'Liebe Mitglieder,',body:'die neue Saison steht vor der Tür. Wir freuen uns auf viele schöne Stunden auf unserer Anlage – auf spannende Ballwechsel, gemeinsame Matches und gute Gespräche nach dem Spiel.\n\nOb ihr schon lange dabei seid oder gerade erst zu uns gefunden habt: Schön, dass ihr Teil der Tennisfreunde Bielstein seid.\n\nAlle Informationen zu Training, Mannschaften und unseren gemeinsamen Terminen findet ihr wie gewohnt in unserer App. Weitere Neuigkeiten zur Saison geben wir euch rechtzeitig bekannt.\n\nLasst uns gemeinsam in eine schöne Tennissaison starten. Wir freuen uns auf euch!',closing:'Viele Grüße\nEuer Vorstand',theme:brand()};}
 async function call(path,data){if(!admin())throw Error('Bitte als Admin anmelden.');if(!TFB.directoryCall)throw Error('Das zentrale Mailarchiv ist auf der veröffentlichten Website verfügbar.');return TFB.directoryCall('/admin/member-mail'+path,data);}
 const confirmChange=()=>!dirty||confirm('Deine Änderungen sind noch nicht gespeichert. Trotzdem eine andere Mail öffnen?');
 const time=at=>new Intl.DateTimeFormat('de-DE',{dateStyle:'short',timeStyle:'short'}).format(new Date(at));
 function listHtml(){return rows.length?rows.map(row=>`<button type="button" class="mm-archive-item" data-mm-load="${esc(row.id)}" aria-current="${row.id===draft.id}"><b>${esc(row.name)}</b><small>Gespeichert ${esc(time(row.updatedAt))}</small></button>`).join(''):'<p class="small muted">Deine gespeicherten Mails erscheinen hier.</p>';}
 function status(){const p=document.querySelector('[data-mm-status]');if(p){p.textContent=notice||(dirty?'Ungespeicherte Änderungen':draft?.etag?'Gespeicherte Vorlage':'Beispielvorlage · noch nicht gespeichert');p.classList.toggle('is-error',error);}document.querySelectorAll('[data-mm-save], [data-mm-copy], [data-mm-new], [data-mm-load]').forEach(button=>button.disabled=busy);const save=document.querySelector('[data-mm-save]');if(save){save.textContent=busy?'Wird gespeichert …':'Speichern';save.disabled=busy||Boolean(draft?.etag&&!dirty);}document.querySelector('[data-mm-editor]')?.classList.toggle('mm-busy',busy);}
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
  panel.innerHTML=`<div class="mm-meta"><label class="field"><span>Name im Archiv</span><input data-mm-field="name" maxlength="120" value="${esc(draft.name)}" autocomplete="off"></label><label class="field"><span>Datum im Brief</span><input type="date" data-mm-field="date" value="${esc(draft.date)}"></label><label class="field mm-subject"><span>E-Mail-Betreff</span><input data-mm-field="subject" maxlength="200" value="${esc(draft.subject)}" autocomplete="off"></label></div><div class="mm-actions"><button class="btn small mm-save" type="button" data-mm-save>Speichern</button><button class="btn small" type="button" data-mm-copy>Speichern unter</button></div><p class="mm-status" data-mm-status role="status" aria-live="polite"></p><p class="mm-hint">Klicke in den Brief, um Überschrift, Anrede, Text und Gruß zu bearbeiten.</p><iframe class="mm-preview" data-mm-preview title="E-Mail-Brief direkt bearbeiten" sandbox="allow-same-origin"></iframe>`;
  mountLetter();status();paintArchive();
 }
 function paintArchive(){const list=document.querySelector('[data-mm-archive-list]');if(list)list.innerHTML=listHtml();const count=document.querySelector('[data-mm-count]');if(count)count.textContent=rows.length?String(rows.length):'';}
 async function view(){
  if(!admin())return '<section class="member-mail"><h1>E-Mail an alle Mitglieder</h1><p>Bitte als Admin anmelden, um E-Mails zu bearbeiten und das Mailarchiv zu öffnen.</p></section>';
  if(owner!==ui().state.member.id){owner=ui().state.member.id;draft=null;rows=[];dirty=false;notice='';}
  draft ||= example();
  try{({rows}=await call(''));notice='';error=false;}catch(e){notice=e.message;error=true;}
  return `<section class="member-mail"><header class="view-head page-head"><div><p class="page-kicker">Post vom Vorstand</p><h1>E-Mail an alle Mitglieder</h1><p class="muted">Ein schöner Brief für unseren Club.</p></div><a class="view-close" href="#home" aria-label="Schließen">${ui().icon.close}</a></header><div class="mm-layout"><details class="mm-archive" open><summary>Mailarchiv <small data-mm-count></small></summary><button type="button" class="btn small mm-new" data-mm-new>Neue Mail</button><div class="mm-archive-list" data-mm-archive-list></div></details><div class="mm-editor" data-mm-editor></div></div></section>`;
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
  busy=true;notice='';error=false;status();
  try{const saved=await call('/save',payload);draft=saved;dirty=false;notice='Gespeichert · '+time(saved.updatedAt);try{({rows}=await call(''));}catch(_){rows=[{id:saved.id,name:saved.name,date:saved.date,updatedAt:saved.updatedAt},...rows.filter(row=>row.id!==saved.id)];}renderEditor();}
  catch(e){notice=e.message;error=true;}
  finally{busy=false;status();paintArchive();}
 }
 document.addEventListener('click',async event=>{
  if(!admin()||busy)return;
  if(event.target.closest('[data-mm-save]')){await save();return;}
  if(event.target.closest('[data-mm-copy]')){
   readFields();ui().openSheet(`<form data-mm-copy-form><h2>Speichern unter</h2><p class="muted">Die bisherige Vorlage bleibt erhalten.</p><label class="field"><span>Name der neuen Vorlage</span><input name="name" required maxlength="120" value="${esc(draft.name+' – Kopie')}" autocomplete="off"></label><p class="form-error" role="alert"></p><button class="btn primary" type="submit">Als neue Vorlage speichern</button></form>`);const form=document.querySelector('[data-mm-copy-form]');form.addEventListener('submit',async e=>{e.preventDefault();const name=form.elements.name.value.trim();if(!name){form.querySelector('.form-error').textContent='Bitte einen Namen eintragen.';return;}ui().closeSheet();await save(name);});return;
  }
  if(event.target.closest('[data-mm-new]')){if(!confirmChange())return;draft=example();dirty=false;notice='';error=false;renderEditor();return;}
  const load=event.target.closest('[data-mm-load]');if(load){if(!confirmChange())return;busy=true;status();try{const saved=await call('/'+load.dataset.mmLoad);draft=saved;dirty=false;notice='Vorlage geladen · gespeichert '+time(saved.updatedAt);error=false;renderEditor();}catch(e){notice=e.message;error=true;}finally{busy=false;status();}return;}
 });
 window.addEventListener('beforeunload',event=>{if(dirty&&admin()){event.preventDefault();event.returnValue='';}});
 TFB.views=TFB.views||{};TFB.views.membermail=view;
})();
