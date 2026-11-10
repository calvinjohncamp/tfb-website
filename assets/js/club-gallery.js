// Dedicated year galleries reuse the already imported originals, including Open aliases.
(() => {
 const config=[
 ['2024','7950',['Bielstein Open']],['2023','7596',['Bielstein Open · Finaltag','Bielstein Open · Tag 4','Bielstein Open · Tag 3','Bielstein Open · Tag 2','Bielstein Open · Tag 1']],['2022','6332',['Bielstein Open']],
 ['2020','3589',['Karneval']],['2019','3405',['Saisoneröffnung','Homburgische Meisterschaften']],
 ['2018','3220',['Doppelturnier','Mitternachtsturnier','Verschönerung des Vereinsgeländes','Saisoneröffnung']],
 ['2017','2038',['Karneval']],['2016','1942',['Doppel-Clubmeisterschaften','Endspiele Clubmeisterschaften','40 Jahre TF Bielstein','1. Mai','Karneval']],
 ['2015','996',['Pfingst-Open','Saisoneröffnung']],['2014','397',['Saisoneröffnung']],
 ];
 const dedicated=new Set(config.filter(([year])=>Number(year)<=2020).map(([,id])=>id));
 const esc=value=>TFB.ui.esc(String(value??'')),link=(year,album=null)=>`#club/galerie/${year}${album===null?'':'/'+(album+1)}`;
 let active,toolkit;
 const isEntry=item=>dedicated.has(typeof item==='string'?item:item?.id);
 const routeFor=item=>{const id=typeof item==='string'?item:item?.id;const row=config.find(([,key])=>key===id);return row?link(row[0]):'';};
 async function view(hash,render){
  toolkit=render;const parts=hash.split('?')[0].split('/'),row=config.find(([year])=>year===parts[2])||config[0];
  const {items}=await TFB.clubArchive.load(),item=items.find(item=>item.id===row[1]);
  if(!item)return '<p>Die Galerie ist gerade nicht verfügbar.</p><a href="#club">Zur Clubseite</a>';
  const template=document.createElement('template');template.innerHTML=item.html;
  const sets=[...template.content.querySelectorAll('details')].map((group,index)=>({title:row[2][index]||group.querySelector('summary')?.textContent.split(' · ')[0]||'Bilder',photos:[...new Set([...group.querySelectorAll('.archive-gallery img[src]')].map(img=>img.getAttribute('src')))]})).filter(set=>set.photos.length);
  const number=Number(parts[3])-1,index=parts[3]&&Number.isInteger(number)&&number>=0&&number<sets.length?number:-1;
  active=index>=0?sets[index]:{title:'Alle Bilder',photos:[...new Set(sets.flatMap(set=>set.photos))]};
  return `<section class="site-page club-gallery"><header class="view-head page-head"><div><p class="page-kicker">Unser Club in Bildern</p><h1>Galerie</h1><p>Gemeinsame Momente. Schöne Erinnerungen.</p></div><a class="view-close" href="#club" aria-label="Zurück zur Clubseite">${TFB.ui.icon.close}</a></header>
  <nav class="cg-years" aria-label="Galerie-Jahrgänge">${config.map(([year])=>`<a class="history-pill${year===row[0]?' on':''}" href="${link(year)}"${year===row[0]?' aria-current="true"':''}>${year}</a>`).join('')}</nav>
  <nav class="cg-albums" aria-label="Alben ${row[0]}"><a class="history-pill${index===-1?' on':''}" href="${link(row[0])}"${index===-1?' aria-current="page"':''}>Alle Bilder</a>${sets.map((set,i)=>`<a class="history-pill${i===index?' on':''}" href="${link(row[0],i)}"${i===index?' aria-current="page"':''}>${esc(set.title)}</a>`).join('')}</nav>
  ${active?`<section class="cg-album"><h2>${esc(active.title)} · ${row[0]}</h2><p class="muted">${active.photos.length} Bilder · Ein Bild anklicken und im Vollbild durchblättern.</p><div class="cg-photo-collage">${active.photos.map((ref,i)=>`<button type="button" class="collage-item" data-action="club-gallery-open" data-index="${i}" aria-label="Foto ${i+1} von ${active.photos.length} im Vollbild ansehen">${render.picture(ref,ref,`${active.title} ${row[0]} · Bild ${i+1}`,true)}</button>`).join('')}</div></section>`:'<p>Für diesen Jahrgang sind keine Bilder verfügbar.</p>'}</section>`;
 }
 TFB.actions=TFB.actions||{};TFB.actions['club-gallery-open']=element=>{if(active)toolkit.openGallery(active.photos,active.title,true,Number(element.dataset.index)||0);};
 TFB.clubGallery={view,isEntry,routeFor,config};
})();
