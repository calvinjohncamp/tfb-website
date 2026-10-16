import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';

const root = new URL('../', import.meta.url);
test('standalone photos open originals by click and keyboard without stealing gallery or editor actions', () => {
  const handlers = {};
  const opened = [];
  let attributes = {src:'assets/original.jpg',alt:'Mannschaft'};
  let excluded = false;
  let control = null;
  const img = {closest(selector) {
    if (selector.startsWith('img[')) return this;
    if (selector === 'button, a') return control;
    return excluded ? {} : null;
  },getAttribute:k=>attributes[k],setAttribute:(k,v)=>{attributes[k]=v;},classList:{add(){}}};
  const context = {TFB:{ui:{openLightbox:(...args)=>opened.push(args)}},
    document:{body:{},querySelectorAll:()=>[img],addEventListener:(type,handler)=>{handlers[type]=handler;}},
    MutationObserver:class {observe(){}}};
  vm.runInNewContext(readFileSync(new URL('assets/js/photo-viewer.js',root),'utf8'),context);
  assert.equal(attributes.role,'button');
  assert.equal(attributes.tabindex,'0');
  let prevented=0,stopped=0;
  const event={target:img,type:'click',preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;}};
  handlers.click(event);
  assert.deepEqual(opened[0],['assets/original.jpg','Mannschaft']);
  assert.equal(prevented,1); assert.equal(stopped,1);
  handlers.keydown({...event,type:'keydown',key:'Enter'});
  handlers.keydown({...event,type:'keydown',key:' '});
  handlers.keydown({...event,type:'keydown',key:'ArrowRight'});
  assert.equal(opened.length,3);
  excluded=true; handlers.click(event); assert.equal(opened.length,3);
  excluded=false; control={matches:()=>false}; handlers.click(event); assert.equal(opened.length,3);
  control={matches:()=>true}; handlers.click(event); assert.equal(opened.length,4);
});

test('fullscreen viewer closes by X, backdrop and Escape, keeps image clicks open and restores scroll/focus', () => {
  const source=readFileSync(new URL('assets/js/app.js',root),'utf8');
  const code=source.slice(source.indexOf('  function openLightbox('),source.indexOf('  // ---------- Sheet & Toasts'));
  const keys = new Set(); let focused=0,restored=0;
  let box=null,keydown=null;
  const document={activeElement:{focus(){restored++;}},
    querySelector:()=>box,querySelectorAll:()=>box?[box]:[],
    addEventListener:(type,handler)=>{keydown=handler;},removeEventListener:()=>{keydown=null;},
    body:{appendChild:b=>{box=b;},classList:{contains:k=>keys.has(k),add:k=>keys.add(k),remove:k=>keys.delete(k)}},
    createElement:()=>({dataset:{},innerHTML:'',classList:{add(){},remove(){}},
      addEventListener(type,handler){this.click=handler;},querySelector:()=>({focus(){focused++;}}),remove(){box=null;}})};
  const context={document,esc:String,logo:()=>'',icon:{close:'X'},requestAnimationFrame:fn=>fn(),setTimeout:fn=>fn()};
  vm.createContext(context); vm.runInContext(code,context);
  context.openLightbox('assets/team.jpg','Teamfoto');
  assert.match(box.innerHTML,/alt="Teamfoto"/);
  assert.ok(keys.has('no-scroll')); assert.equal(focused,1);
  box.click({target:{closest:()=>null},stopPropagation(){}});
  assert.ok(box);
  box.click({target:box,stopPropagation(){}});
  assert.equal(box,null); assert.ok(!keys.has('no-scroll')); assert.equal(restored,1);
  context.openLightbox('assets/team.jpg','Teamfoto');
  box.click({target:{closest:()=>({})},stopPropagation(){}});
  assert.equal(box,null);
  keys.add('no-scroll'); context.openLightbox('assets/team.jpg','Teamfoto');
  keydown({key:'Escape',preventDefault(){},stopImmediatePropagation(){}});
  assert.equal(box,null); assert.ok(keys.has('no-scroll')); assert.equal(keydown,null);
});

test('thumbnail click loads its large source and never opens a revoked photo', async () => {
  const handlers = {}, opened = [], messages = [];
  let original = 'portrait-original.jpg';
  const img = {closest(selector) { return selector.startsWith('img[') ? this : null; },
    getAttribute: key => ({src: 'square-thumbnail.jpg', alt: 'Anna'})[key],
    setAttribute() {}, classList: {add() {}}};
  const context = {TFB: {ui: {api: {avatarOriginal: async src => {
    assert.equal(src, 'square-thumbnail.jpg'); return original;
  }}, openLightbox: (...args) => opened.push(args), toast: message => messages.push(message)}},
    document: {body: {}, querySelectorAll: () => [img], addEventListener: (type, fn) => handlers[type] = fn},
    MutationObserver: class {observe() {}}};
  vm.runInNewContext(readFileSync(new URL('assets/js/photo-viewer.js', root), 'utf8'), context);
  const event = {type: 'click', target: img, preventDefault() {}, stopImmediatePropagation() {}};
  await handlers.click(event);
  assert.deepEqual(opened, [['portrait-original.jpg', 'Anna']]);
  original = null;
  await handlers.click(event);
  assert.equal(opened.length, 1);
  assert.match(messages[0], /nicht mehr freigegeben/);
});
