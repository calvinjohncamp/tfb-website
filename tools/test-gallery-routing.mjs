import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';
const context={TFB:{actions:{}}};vm.runInNewContext(readFileSync(new URL('../assets/js/club-gallery.js',import.meta.url),'utf8'),context);
const gallery=context.TFB.clubGallery,{items}=JSON.parse(readFileSync(new URL('../assets/clubarchiv/bestand.json',import.meta.url)));
test('all ten gallery years reuse imported originals: 23 albums and 1935 photos',()=>{
 assert.equal(gallery.config.length,10);let albums=0,photos=0;
 for(const [year,id] of gallery.config){const item=items.find(item=>item.id===id);assert.ok(item,year);albums+=(item.html.match(/<details>/g)||[]).length;photos+=(item.html.match(/<img /g)||[]).length;}
 assert.equal(albums,23);assert.equal(photos,1935);
});
test('only the seven standalone older year galleries leave the article archive',()=>{
 assert.equal(items.filter(gallery.isEntry).length,7);
 for(const id of ['397','996','1942','2038','3220','3405','3589'])assert.ok(gallery.isEntry(id));
 for(const id of ['8567','8453','7950','7596','6332','35'])assert.equal(gallery.isEntry(id),false,id);
 assert.equal(gallery.routeFor('3405'),'#club/galerie/2019/1');
});
