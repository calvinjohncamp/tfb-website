import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';

function setup({multiple = true, disabled = false} = {}) {
  const handlers = {}, messages = [], changes = [];
  const input = {accept:'image/*', multiple, disabled, dispatchEvent:event=>changes.push(event)};
  const zone = {nodeType:1, tagName:'LABEL', querySelectorAll:()=>[input],
    classList:{add(){zone.active=true;},remove(){zone.active=false;}}, contains:()=>false};
  const body = {nodeType:1, tagName:'BODY'};
  zone.parentElement = body;
  const context = {document:{body,addEventListener:(name,fn)=>{handlers[name]=fn;}},
    TFB:{ui:{toast:message=>messages.push(message)}},
    Event:class {constructor(type,opts){this.type=type;Object.assign(this,opts);}},
    DataTransfer:class {constructor(){this.files=[];this.items={add:file=>this.files.push(file)};}}};
  vm.runInNewContext(readFileSync(new URL('../assets/js/photo-drop.js',import.meta.url),'utf8'),context);
  const event = (files,types=['Files'],target=zone)=>({target,dataTransfer:{files,types,items:[]},
    preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;}});
  return {handlers,messages,changes,input,zone,body,event};
}

test('dropping six photos routes the complete batch to the existing upload handler',()=>{
  const s=setup();
  const files=Array.from({length:6},(_,i)=>({type:'image/jpeg',name:`photo-${i}.jpg`}));
  const e=s.event(files);
  s.handlers.dragover(e);
  assert.equal(s.zone.active,true);
  assert.equal(e.dataTransfer.dropEffect,'copy');
  s.handlers.drop(e);
  assert.equal(s.input.files.length,6);
  assert.equal(s.changes[0].type,'change');
  assert.equal(s.changes[0].bubbles,true);
  assert.equal(s.zone.active,false);
  assert.ok(e.prevented && e.stopped);
});
test('single-photo targets reject a batch and unsupported files rather than losing photos',()=>{
  const s=setup({multiple:false});
  const image={type:'image/jpeg',name:'photo.jpg'};
  s.handlers.drop(s.event([image,image]));
  assert.match(s.messages.pop(),/ein einzelnes Bild/);
  s.handlers.drop(s.event([{type:'text/plain',name:'notes.txt'}]));
  assert.match(s.messages.pop(),/nur Bilddateien/);
  assert.equal(s.changes.length,0);
  s.handlers.dragstart();
  const localImage=s.event([{type:'image/jpeg',name:'existing.jpg'}]);
  s.handlers.dragover(localImage);
  s.handlers.drop(localImage);
  assert.equal(localImage.prevented,undefined);
  assert.equal(s.changes.length,0);
});
test('unresolved Apple file promises produce feedback; internal reordering is untouched',()=>{
  const s=setup();
  s.handlers.drop(s.event([],['com.apple.pasteboard.promised-file-url']));
  assert.match(s.messages.pop(),/keine Bilddatei/);
  const internal=s.event([],['text/plain']);
  s.handlers.dragover(internal);
  s.handlers.drop(internal);
  assert.equal(internal.prevented,undefined);
  assert.equal(s.changes.length,0);
});
test('off-target drops do not navigate away and disabled inputs cannot receive images',()=>{
  const s=setup({disabled:true});
  const image={type:'image/png',name:'photo.png'};
  const e=s.event([image]);
  s.handlers.drop(e);
  assert.ok(e.prevented);
  assert.equal(s.changes.length,0);
  s.handlers.drop(s.event([image],['Files'],s.body));
  assert.match(s.messages.pop(),/Foto-Feld/);
});
test('Photos file items and files without MIME metadata are accepted',()=>{
  const s=setup();
  const e=s.event([]);
  e.dataTransfer.items=[{kind:'file',getAsFile:()=>({type:'',name:'export.jpg'})}];
  s.handlers.drop(e);
  assert.equal(s.input.files[0].name,'export.jpg');
});
