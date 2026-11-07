import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {readFileSync} from 'node:fs';
const c={TFB:{},structuredClone,crypto:webcrypto};vm.createContext(c);vm.runInContext(readFileSync(new URL('../assets/js/newsroom.js',import.meta.url),'utf8'),c);
const {ordered,transfer}=c.TFB.newsroom;
const plain=x=>JSON.parse(JSON.stringify(x));
test('Mixed editorial content sorts news newest first and dates earliest first without moving structural headings',()=>{
 const input=[{id:'dates',type:'heading'},{id:'far',type:'event',date:'2027-05-15'},{id:'near',type:'event',date:'2026-11-20'},{id:'news',type:'heading'},{id:'older',type:'post',date:'2026-07-06'},{id:'media',type:'post',mediaCollection:{entries:[{date:'2026-11-07'}]}},{id:'gallery',type:'gallery',date:'2026-07-04'},{id:'undated',type:'post'}],before=structuredClone(input);
 assert.deepEqual(plain(ordered(input)).map(b=>b.id),['dates','near','far','news','media','older','gallery','undated']);assert.deepEqual(input,before);
});
test('Equal dates follow editorial order, including an item inserted at the top',()=>{
 const blocks=[{id:'second',type:'post',date:'2026-11-07'},{id:'first',type:'post',date:'2026-11-07'}];assert.deepEqual(plain(ordered(blocks)).map(b=>b.id),['second','first']);blocks.reverse();assert.deepEqual(plain(ordered(blocks)).map(b=>b.id),['first','second']);
});
test('Transfer builds one two-page change, preserves all media and editorial fields, and never mutates its source',()=>{
 const source={id:'signature',type:'feature',title:'Eine Idee',layout:'portrait-right',kicker:'Planung',text:'Hinweis',mediaButtonLabel:'Zeig her!',mediaCollection:{title:'Sammlung',entries:[{id:'e',title:'Detail',subtitle:'Signature',format:'9:16',images:['cms:1','cms:2'],instagramUrl:'https://instagram.com/p/example'}]}};
 const input={_cms:{versions:{'page:home':4,'page:aktuell':2}},pages:{home:{blocks:[source,{id:'other',type:'feature'}]},aktuell:{blocks:[{id:'existing',type:'post'}]},verein:{blocks:[]}}},before=structuredClone(input),next=plain(transfer(input,'signature','2026-11-07'));
 assert.deepEqual(input,before);assert.deepEqual(next.pages.home.blocks,[{id:'other',type:'feature'}]);assert.deepEqual(next.pages.aktuell.blocks[0],{...source,type:'post',date:'2026-11-07',sourceHomeId:'signature'});assert.deepEqual(next._cms,input._cms);assert.deepEqual(next.pages.verein,input.pages.verein);
});
test('Transfer refuses missing sources, duplicate targets, and invalid dates',()=>{
 const b={id:'x',mediaCollection:{entries:[]}},input={pages:{home:{blocks:[b]},aktuell:{blocks:[]}}};assert.throws(()=>transfer(input,'absent','2026-11-07'),/nicht mehr verfügbar/);assert.throws(()=>transfer(input,'x','2026-02-30'),/datum/i);assert.throws(()=>transfer(input,'x',''),/datum/i);input.pages.aktuell.blocks.push(b);assert.throws(()=>transfer(input,'x','2026-11-07'),/bereits/);
});

test('New items lead on equal dates without changing headings or unrelated content',()=>{const blocks=[{type:'heading',id:'News'},{type:'post',id:'old',date:'2026-11-07'}];c.TFB.newsroom.insert(blocks,{type:'post',id:'new',date:'2026-11-07'});assert.deepEqual(plain(ordered(blocks)).map(b=>b.id),['News','new','old']);});

test('News can move back to Home as the first feature, retaining media, dates and stable archive origin',()=>{
 const b={id:'news',type:'post',title:'News',date:'2026-11-07',mediaSingle:true,mediaCollection:{entries:[{id:'e',title:'Detail',images:['cms:a'],format:'4:5'}]}};
 const input={pages:{home:{blocks:[{id:'first',type:'feature'}]},aktuell:{blocks:[b]}}};
 const next=plain(transfer(input,'news',undefined,{from:'aktuell'}));assert.equal(next.pages.aktuell.blocks.length,0);const back=next.pages.home.blocks[0];assert.equal(back.type,'feature');assert.equal(back.id,'news');assert.equal(back.archivePage,'aktuell');assert.equal(back.navigation,'detail');assert.deepEqual(back.mediaCollection,b.mediaCollection);assert.equal(back.mediaSingle,undefined);
 const roundTrip=plain(transfer(next,'news','2026-11-07'));assert.equal(roundTrip.pages.aktuell.blocks[0].archivePage,'aktuell');
});
test('Copies in both directions have unique identities, shared immutable files, and independently editable content',()=>{
 const b={id:'home',type:'feature',title:'Original',mediaCollection:{entries:[{id:'e',title:'Detail',images:['cms:a','cms:b']}]}};
 const input={pages:{home:{blocks:[b]},aktuell:{blocks:[]}}};const copied=transfer(input,'home','2026-11-07',{mode:'copy'});assert.equal(copied.pages.home.blocks.length,1);const article=copied.pages.aktuell.blocks[0];assert.notEqual(article.id,'home');assert.deepEqual(plain(article.mediaCollection),b.mediaCollection);
 article.title='Unabhängiger Titel';article.mediaCollection.entries[0].images.reverse();assert.equal(copied.pages.home.blocks[0].title,'Original');assert.deepEqual(plain(copied.pages.home.blocks[0].mediaCollection.entries[0].images),['cms:a','cms:b']);
 const second=plain(transfer(copied,article.id,undefined,{from:'aktuell',mode:'copy'}));assert.equal(second.pages.aktuell.blocks.length,1);assert.equal(second.pages.home.blocks.length,2);assert.notEqual(second.pages.home.blocks[0].id,article.id);assert.equal(second.pages.home.blocks[0].archivePage,'home');
});
test('Full Home rejects both copy and move without altering either page',()=>{
 const input={pages:{home:{blocks:Array.from({length:10},(_,i)=>({id:'h'+i,type:'feature'}))},aktuell:{blocks:[{id:'news',mediaCollection:{entries:[]}}]}}},before=structuredClone(input);
 for(const mode of ['move','copy'])assert.throws(()=>transfer(input,'news',undefined,{from:'aktuell',mode}),/höchstens 10/);assert.deepEqual(input,before);
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
