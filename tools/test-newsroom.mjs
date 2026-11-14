import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {readFileSync} from 'node:fs';
const c={TFB:{},structuredClone,crypto:webcrypto};vm.createContext(c);vm.runInContext(readFileSync(new URL('../assets/js/newsroom.js',import.meta.url),'utf8'),c);
const {ordered,moveToNews,archiveNews}=c.TFB.newsroom;
const plain=x=>JSON.parse(JSON.stringify(x));
test('Mixed editorial content sorts news newest first and dates earliest first without moving structural headings',()=>{
 const input=[{id:'dates',type:'heading'},{id:'far',type:'event',date:'2027-05-15'},{id:'near',type:'event',date:'2026-11-20'},{id:'news',type:'heading'},{id:'older',type:'post',date:'2026-07-06'},{id:'media',type:'post',mediaCollection:{entries:[{date:'2026-11-07'}]}},{id:'gallery',type:'gallery',date:'2026-07-04'},{id:'undated',type:'post'}],before=structuredClone(input);
 assert.deepEqual(plain(ordered(input)).map(b=>b.id),['dates','near','far','news','media','older','gallery','undated']);assert.deepEqual(input,before);
});
test('Equal dates follow editorial order, including an item inserted at the top',()=>{
 const blocks=[{id:'second',type:'post',date:'2026-11-07'},{id:'first',type:'post',date:'2026-11-07'}];assert.deepEqual(plain(ordered(blocks)).map(b=>b.id),['second','first']);blocks.reverse();assert.deepEqual(plain(ordered(blocks)).map(b=>b.id),['first','second']);
});
test('Moving a topic preserves its identity, photos, links and detail', () => {
 const topic = { id:'topic', type:'feature', title:'Thema', image:'cover', more:{text:'Detail'}, album:{enabled:true,images:['photo']}, link:{url:'#sport'} };
 const start = { pages:{home:{blocks:[topic]},aktuell:{blocks:[]}} };
 const result = plain(moveToNews(start, 'topic', '2026-11-14'));
 assert.deepEqual(result.pages.home.blocks, []);
 assert.deepEqual(result.pages.aktuell.blocks[0], { ...topic, type:'post', images:['cover'], date:'2026-11-14', createdOn:'2026-11-14', sourceHomeId:'topic', articleId:'topic' });
 assert.deepEqual(start.pages.home.blocks, [topic]);
 const dated = {...topic, createdOn:'2026-09-11', createdAt:'2026-09-11T08:15:00Z'};
 const knownDate = plain(moveToNews({pages:{home:{blocks:[dated]},aktuell:{blocks:[]}}}, 'topic', '2026-11-14')).pages.aktuell.blocks[0];
 assert.equal(knownDate.date, '2026-09-11');
 assert.equal(knownDate.createdAt, dated.createdAt);
 assert.throws(() => moveToNews(start, 'topic', '2026-02-30'), /Erstellungsdatum/);
});
test('Archiving changes only the publication state and keeps the article in the CMS', () => {
 const article = { id:'news', type:'post', title:'News', date:'2026-11-01', mediaCollection:{entries:[{images:['photo']}] }};
 const start = { pages:{home:{blocks:[]},aktuell:{blocks:[article]}} };
 const result = plain(archiveNews(start, 'news'));
 assert.deepEqual(result.pages.aktuell.blocks, [{ ...article, archived:true }]);
 assert.equal(start.pages.aktuell.blocks[0].archived, undefined);
 assert.throws(() => archiveNews(result, 'news'), /nicht mehr verfügbar/);
});

test('Home reordering preserves current content and all other pages without mutating its input',()=>{
 const input={_cms:{versions:{'page:home':7}},pages:{home:{title:'Home',blocks:[{id:'a',type:'feature',title:'Parallel aktualisiert',mediaCollection:{entries:[{images:['cms:original']}]}},{id:'b',type:'gallery',images:['cms:other']},{id:'c',type:'text',text:'Unverändert'}]},aktuell:{blocks:[{id:'news'}]}}},before=structuredClone(input);
 const next=plain(c.TFB.newsroom.reorder(input,'home',['a','b','c'],['c','a','b']));assert.deepEqual(next.pages.home.blocks.map(b=>b.id),['c','a','b']);assert.equal(next.pages.home.blocks[1].title,'Parallel aktualisiert');assert.deepEqual(next.pages.home.blocks[1].mediaCollection.entries[0].images,['cms:original']);assert.deepEqual(next.pages.aktuell,input.pages.aktuell);assert.deepEqual(input,before);
});
test('Home reordering rejects changed lists and incomplete permutations instead of dropping content',()=>{
 const input={pages:{home:{blocks:[{id:'a'},{id:'b'},{id:'new'}]}}};assert.throws(()=>c.TFB.newsroom.reorder(input,'home',['a','b'],['b','a']),/inzwischen verändert/);
 for(const desired of [['a','a','new'],['a','b'],['a','b','unknown']])assert.throws(()=>c.TFB.newsroom.reorder(input,'home',['a','b','new'],desired),/unvollständig/);
 const swapped={pages:{home:{blocks:[{id:'b'},{id:'a'}]}}};assert.throws(()=>c.TFB.newsroom.reorder(swapped,'home',['a','b'],['b','a']),/inzwischen verändert/);
});
