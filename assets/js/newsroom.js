// Editorial ordering and lossless media moves/copies; no persistence side effects.
(function () {
  const newsTypes = new Set(['post','gallery','collage','feature']);
  const dateOf = block => block.date || block.mediaCollection?.entries?.[0]?.date || '';
  function ordered(blocks) {
    const sort = (items, direction) => items.map((block,index)=>({block,index})).sort((a,b)=>{
      const x=dateOf(a.block),y=dateOf(b.block);
      return (!x)-(!y) || direction*x.localeCompare(y) || a.index-b.index;
    }).map(x=>x.block);
    const news=sort(blocks.filter(b=>newsTypes.has(b.type)),-1),dates=sort(blocks.filter(b=>b.type==='event'),1);
    return blocks.map(b=>newsTypes.has(b.type)?news.shift():b.type==='event'?dates.shift():b);
  }
  function insert(blocks,block) {
    const isEvent=block.type==='event',index=blocks.findIndex(b=>isEvent?b.type==='event':newsTypes.has(b.type));
    // Place a newly created item first among items sharing the same date.
    blocks.splice(index<0?blocks.length:index,0,block);
  }
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
  function transfer(input,id,date,{from='home',mode='move',maxHome=10}={}) {
    if(!['home','aktuell'].includes(from)||!['move','copy'].includes(mode))throw Error('Ungültige Übernahme.');
    const to=from==='home'?'aktuell':'home';
    if(to==='aktuell'&&!validDate(date))throw Error('Bitte ein gültiges Veröffentlichungsdatum wählen.');
    const next=structuredClone(input),source=next.pages[from].blocks.find(b=>b.id===id&&!b._new&&b.mediaCollection);
    if(!source)throw Error('Dieses Karussell ist nicht mehr verfügbar. Bitte die Seite neu laden.');
    const target=next.pages[to].blocks;
    if(mode==='move'&&target.some(b=>b.id===id))throw Error('Dieser Beitrag ist bereits auf der Zielseite vorhanden.');
    if(to==='home'&&target.filter(b=>b.type==='feature'&&!b._new).length>=maxHome)throw Error(`Home zeigt höchstens ${maxHome} Themen. Bitte zuerst Platz schaffen.`);
    const item={...structuredClone(source),type:to==='home'?'feature':'post'};
    if(mode==='copy'){item.id='b-'+crypto.randomUUID();item.archivePage=to;}
    else if(from==='aktuell'&&!item.sourceHomeId&&!item.archivePage)item.archivePage='aktuell';
    if(to==='aktuell')Object.assign(item,{date,sourceHomeId:source.sourceHomeId||source.id});
    else Object.assign(item,{layout:source.layout||'wide',navigation:'detail'});
    // Home's summary and detail may subsequently be edited independently.
    delete item.mediaSingle;
    if(mode==='move')next.pages[from].blocks=next.pages[from].blocks.filter(b=>b.id!==id);
    if(to==='home')target.unshift(item);else insert(target,item);
    return next;
  }
  function reorder(input,page,expected,desired) {
    const next=structuredClone(input),blocks=next.pages[page].blocks;
    if(JSON.stringify(blocks.map(b=>b.id))!==JSON.stringify(expected))throw Error('Die Reihenfolge oder die Inhalte der Seite wurden inzwischen verändert. Bitte die Übersicht neu öffnen.');
    if(desired.length!==expected.length||new Set(desired).size!==desired.length||desired.some(id=>!expected.includes(id)))throw Error('Die Reihenfolge ist unvollständig. Bitte die Übersicht neu öffnen.');
    const byId=new Map(blocks.map(b=>[b.id,b]));next.pages[page].blocks=desired.map(id=>byId.get(id));return next;
  }
  TFB.newsroom={ordered,dateOf,validDate,insert,transfer,reorder};
})();
