// Keep document reading inside the app, including installed iPhone/iPad apps.
(() => {
 const vendor=new URL('../vendor/pdfjs/',document.currentScript.src).href;
 let library,active;
 const load=()=>library ||= import(vendor+'pdf.mjs').then(pdf=>{pdf.GlobalWorkerOptions.workerSrc=vendor+'pdf.worker.mjs';return pdf;}).catch(error=>{library=null;throw error;});
 async function open(src,title='PDF',filename=''){
  if(active)active.close(false);
  const url=new URL(src,location.href);if(!['https:','http:','blob:','data:'].includes(url.protocol))return;
  const previous=document.activeElement,scroll=window.scrollY,hadLock=document.body.classList.contains('no-scroll'),origin=location.href,id=crypto.randomUUID();
  const box=document.createElement('dialog');box.className='tfb-pdf-viewer';box.setAttribute('aria-labelledby','tfb-pdf-title');
  box.innerHTML='<header class="tfb-pdf-head"><div><h2 id="tfb-pdf-title"></h2><span class="tfb-pdf-status" role="status">PDF wird geladen …</span></div><button type="button" class="tfb-pdf-close" aria-label="PDF schließen und zurück">×</button><div class="tfb-pdf-tools"><button type="button" data-pdf-zoom="-1" aria-label="PDF verkleinern" disabled>−</button><output aria-label="Vergrößerung">100%</output><button type="button" data-pdf-zoom="1" aria-label="PDF vergrößern">+</button><a class="tfb-pdf-download" data-pdf-native>Herunterladen</a></div></header><div class="tfb-pdf-pages" tabindex="0" aria-label="PDF-Seiten"></div>';
  box.querySelector('h2').textContent=title||'PDF';const download=box.querySelector('a');download.href=url.href;download.download=filename||url.pathname.split('/').at(-1)||'TFB.pdf';
  const pages=box.querySelector('.tfb-pdf-pages'),status=box.querySelector('[role=status]'),tasks=new Set();
  let loading,pdf,observer,resizeTimer,closed=false,queue=Promise.resolve(),zoomIndex=0;
  const zooms=[1,1.25,1.5,2,2.5,3];
  for(const button of box.querySelectorAll('[data-pdf-zoom]'))button.addEventListener('click',()=>{zoomIndex=Math.max(0,Math.min(zooms.length-1,zoomIndex+Number(button.dataset.pdfZoom)));const zoom=zooms[zoomIndex];box.style.setProperty('--pdf-width',zoom*100+'%');box.style.setProperty('--pdf-max',zoom*1000+'px');box.querySelector('output').textContent=Math.round(zoom*100)+'%';box.querySelector('[data-pdf-zoom="-1"]').disabled=zoomIndex===0;box.querySelector('[data-pdf-zoom="1"]').disabled=zoomIndex===zooms.length-1;resized();});
  const entry={close};active=entry;
  function close(goBack=true){
   if(closed)return;closed=true;observer?.disconnect();clearTimeout(resizeTimer);window.removeEventListener('resize',resized);window.removeEventListener('popstate',popped);window.removeEventListener('hashchange',navigated);for(const task of tasks)task.cancel();loading?.destroy().catch(()=>{});box.close();box.remove();if(!hadLock)document.body.classList.remove('no-scroll');if(active===entry)active=null;
   if(location.href===origin){window.scrollTo(0,scroll);if(previous?.isConnected)previous.focus({preventScroll:true});}
   if(goBack&&history.state?.tfbPdf===id)history.back();
  }
  function popped(){if(history.state?.tfbPdf!==id)close(false);}
  function navigated(){if(location.href!==origin)close(false);}
  box.querySelector('button').addEventListener('click',()=>close());box.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();}});box.addEventListener('cancel',event=>{event.preventDefault();close();});
  document.body.append(box);document.body.classList.add('no-scroll');box.showModal();box.querySelector('button').focus({preventScroll:true});
  history.pushState({...history.state,tfbPdf:id},'',location.href);window.addEventListener('popstate',popped);window.addEventListener('hashchange',navigated);
  async function render(section){
   if(closed||section.dataset.done||section.dataset.near!=='true')return;section.dataset.done='loading';
   try{
    const page=await pdf.getPage(Number(section.dataset.page));if(closed)return;const viewport=page.getViewport({scale:1}),width=section.clientWidth,scale=width/viewport.width,view=page.getViewport({scale}),ratio=Math.min(window.devicePixelRatio||1,2,Math.sqrt(8000000/(view.width*view.height)));
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(view.width*ratio);canvas.height=Math.ceil(view.height*ratio);canvas.style.width='100%';canvas.style.height='auto';canvas.setAttribute('aria-label','Seite '+section.dataset.page+' von '+pdf.numPages);canvas.setAttribute('role','img');section.replaceChildren(canvas);section.style.aspectRatio=viewport.width+'/'+viewport.height;
    const task=page.render({canvasContext:canvas.getContext('2d'),viewport:view,transform:[ratio,0,0,ratio,0,0]});tasks.add(task);try{await task.promise;}finally{tasks.delete(task);}if(closed)return;section.dataset.done='true';page.cleanup();if(section.dataset.near!=='true')release(section);
   }catch(error){if(closed||error.name==='RenderingCancelledException')return;section.dataset.done='error';section.textContent='Diese Seite konnte nicht angezeigt werden. Das PDF kannst du weiterhin herunterladen.';}
  }
  const enqueue=section=>{queue=queue.then(()=>render(section));};
  function release(section){if(section.dataset.done!=='true')return;for(const canvas of section.querySelectorAll('canvas')){canvas.width=canvas.height=0;}section.replaceChildren();delete section.dataset.done;}
  function observe(){observer?.disconnect();observer=new IntersectionObserver(entries=>{for(const item of entries){item.target.dataset.near=String(item.isIntersecting);if(item.isIntersecting)enqueue(item.target);else release(item.target);}},{root:pages,rootMargin:'600px'});pages.querySelectorAll('.tfb-pdf-page').forEach(section=>observer.observe(section));}
  function resized(){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(closed||!pdf)return;for(const task of tasks)task.cancel();for(const section of pages.children)delete section.dataset.done;observe();},180);}
  window.addEventListener('resize',resized);
  try{
   const lib=await load();if(closed)return;loading=lib.getDocument({url:url.href,cMapUrl:vendor+'cmaps/',cMapPacked:true,standardFontDataUrl:vendor+'standard_fonts/',wasmUrl:vendor+'wasm/',isEvalSupported:false,enableXfa:false});pdf=await loading.promise;if(closed)return;
   status.textContent=pdf.numPages+(pdf.numPages===1?' Seite':' Seiten');const first=await pdf.getPage(1),viewport=first.getViewport({scale:1});if(closed)return;
   for(let number=1;number<=pdf.numPages;number++){const section=document.createElement('section');section.className='tfb-pdf-page';section.dataset.page=number;section.setAttribute('aria-label','Seite '+number);section.style.aspectRatio=viewport.width+'/'+viewport.height;pages.append(section);}observe();
  }catch(error){if(!closed){status.textContent='PDF konnte nicht geladen werden.';pages.textContent='Bitte versuche es erneut oder lade die Datei herunter. Mit dem X kommst du zurück.';}}
 }
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href]');if(!link||link.hasAttribute('data-pdf-native')||link.closest('[data-action="membership-mail-preview"]'))return;
  let url;try{url=new URL(link.href,location.href);}catch(_){return;}if(!/\.pdf$/i.test(url.pathname))return;
  event.preventDefault();event.stopImmediatePropagation();open(url.href,link.dataset.pdfTitle||link.getAttribute('aria-label')||link.textContent.trim()||url.pathname.split('/').at(-1),link.getAttribute('download')||'');
 },true);
 TFB.pdfViewer={open};
})();
