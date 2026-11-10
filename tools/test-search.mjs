import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context = {TFB:{}};
vm.runInNewContext(readFileSync(new URL('../assets/js/search.js',import.meta.url),'utf8'),context);
const {compile}=context.TFB.search;
test('multiple words match independently across text, separators and case',()=>{
 for(const q of ['Cup TFB','TFB-Cup','  TFB   CUP ','TFB–Cup']) assert.ok(compile(q).matches('Der TFB lädt zum großen Cup 2025 ein'),q);
 assert.ok(compile('groß eröffNung').matches('GROSS: die Eröffnung'));
 assert.equal(compile('TFB Cup nonexistent').matches('TFB Cup'),false);
 assert.ok(compile('').matches('Alles'));
});
test('club names are equivalent, including the reported Cup article',()=>{
 for(const q of ['TFB Cup','Cup Tennisfreunde Bielstein','TF Bielstein Cup'])
  for(const title of ['TF Bielstein Cup 2025','TFB-Cup 2025','Tennisfreunde Bielstein Cup']) assert.ok(compile(q).matches(title),q+' / '+title);
});
test('headline matches outrank body-only matches',()=>{
 const search=compile('TFB Cup');
 assert.ok(search.score('TF Bielstein Cup 2025')>search.score('Weitere Turniere'));
 assert.ok(search.score('TFB Cup')>search.score('Cup beim TFB'));
 assert.equal(compile('').score('TFB Cup'),0);
});
test('every imported headline is searchable by its separated words',()=>{
 const {items}=JSON.parse(readFileSync(new URL('../assets/clubarchiv/bestand.json',import.meta.url)));
 for(const item of items) {
  const words=context.TFB.search.normalize(item.title).split(' ');
  assert.ok(compile(words.reverse().join(' ')).matches(item.title),item.title);
 }
 const cup=items.find(item=>item.id==='8453');
 assert.ok(compile('TFB Cup').matches(cup.title+' '+cup.search));
});
