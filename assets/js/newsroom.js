// Editorial ordering and lossless media moves/copies; no persistence side effects.
(function () {
  const newsTypes = new Set(['post','gallery','collage','feature','carousel']);
  const CAROUSEL_LIMIT = 15;
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
  const creationDate = block => [block.createdOn, block.date, block.mediaCollection?.entries?.[0]?.date].find(validDate) || '';
  const dateOf = block => block.type === 'event' ? block.date || '' : creationDate(block);
  function ordered(blocks) {
    const sort = (items, direction) => items.map((block,index)=>({block,index})).sort((a,b)=>{
      const x=dateOf(a.block),y=dateOf(b.block);
      return (!x)-(!y) || direction*x.localeCompare(y) || (direction < 0 ? (b.block.createdAt || '').localeCompare(a.block.createdAt || '') : 0) || a.index-b.index;
    }).map(x=>x.block);
    const news=sort(blocks.filter(b=>newsTypes.has(b.type)),-1),dates=sort(blocks.filter(b=>b.type==='event'),1);
    return blocks.map(b=>newsTypes.has(b.type)?news.shift():b.type==='event'?dates.shift():b);
  }
  function insert(blocks,block) {
    const isEvent=block.type==='event',index=blocks.findIndex(b=>isEvent?b.type==='event':newsTypes.has(b.type));
    // Place a newly created item first among items sharing the same date.
    blocks.splice(index<0?blocks.length:index,0,block);
  }
  const homeTypes = new Set(['feature', 'post', 'gallery', 'collage', 'carousel', 'text', 'image']);
  const canMoveToNews = block => homeTypes.has(block.type);
  function moveToNews(input, id, date) {
    if (input.pages.aktuell.deleted) throw Error('Die Seite Aktuell wurde entfernt.');
    const next = structuredClone(input);
    const source = next.pages.home.blocks.find(b => b.id === id && !b._new && canMoveToNews(b));
    if (!source) throw Error('Der Artikel ist auf Home nicht mehr verfügbar.');
    date = creationDate(source) || date;
    if (!validDate(date)) throw Error('Bitte ein gültiges Erstellungsdatum wählen.');
    const target = next.pages.aktuell.blocks;
    if (target.some(b => b.id === id)) throw Error('Der Artikel ist bereits unter Aktuell oder im Archiv vorhanden.');
    const type = ['gallery', 'collage', 'carousel'].includes(source.type) ? source.type : 'post';
    const title = source.title || source.caption || ({gallery:'Galerie',collage:'Collage',carousel:'Karussell'})[type] || 'Artikel';
    const article = { ...source, type, title, date, createdOn: date, sourceHomeId: id, articleId: source.articleId || id };
    if (source.type === 'feature' && article.image && !article.images?.length) article.images = [article.image];
    delete article.hideDate;
    next.pages.home.blocks = next.pages.home.blocks.filter(b => b.id !== id);
    insert(target, article);
    return next;
  }
  const canArchive = block => block.type === 'event' || canMoveToNews(block);
  function archiveNews(input, id) {
    const next = structuredClone(input);
    const article = next.pages.aktuell.blocks.find(b => b.id === id && !b._new);
    if (!article || article.archived || !canArchive(article)) throw Error('Der Eintrag ist unter Aktuell nicht mehr verfügbar.');
    article.archived = true;
    return next;
  }
  function reorder(input,page,expected,desired) {
    const next=structuredClone(input),blocks=next.pages[page].blocks;
    if(JSON.stringify(blocks.map(b=>b.id))!==JSON.stringify(expected))throw Error('Die Reihenfolge oder die Inhalte der Seite wurden inzwischen verändert. Bitte die Übersicht neu öffnen.');
    if(desired.length!==expected.length||new Set(desired).size!==desired.length||desired.some(id=>!expected.includes(id)))throw Error('Die Reihenfolge ist unvollständig. Bitte die Übersicht neu öffnen.');
    const byId=new Map(blocks.map(b=>[b.id,b]));next.pages[page].blocks=desired.map(id=>byId.get(id));return next;
  }
  TFB.newsroom={CAROUSEL_LIMIT,creationDate,ordered,dateOf,validDate,insert,canMoveToNews,moveToNews,canArchive,archiveNews,reorder};
})();
