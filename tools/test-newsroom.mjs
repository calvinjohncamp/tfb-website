import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const c={TFB:{},structuredClone};vm.createContext(c);vm.runInContext(readFileSync(new URL('../assets/js/newsroom.js',import.meta.url),'utf8'),c);
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
