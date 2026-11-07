// Editorial ordering and lossless Home → Aktuell transfer; no persistence side effects.
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
  function transfer(input,id,date) {
    if(!validDate(date))throw Error('Bitte ein gültiges Veröffentlichungsdatum wählen.');
    const next=structuredClone(input),source=next.pages.home.blocks.find(b=>b.id===id&&!b._new&&b.mediaCollection);
    if(!source)throw Error('Dieses Home-Karussell ist nicht mehr verfügbar. Bitte die Seite neu laden.');
    if(next.pages.aktuell.blocks.some(b=>b.id===id))throw Error('Dieser Beitrag ist bereits in Aktuell vorhanden.');
    const moved={...source,type:'post',date,sourceHomeId:id};
    next.pages.home.blocks=next.pages.home.blocks.filter(b=>b.id!==id);
    insert(next.pages.aktuell.blocks,moved);
    return next;
  }
  TFB.newsroom={ordered,dateOf,validDate,insert,transfer};
})();
