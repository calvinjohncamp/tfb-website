export class Bucket{
 constructor(){this.objects=new Map();}
 async put(key,value,options={}){const bytes=typeof value==='string'?new TextEncoder().encode(value):new Uint8Array(value);this.objects.set(key,{bytes:bytes.slice(),options});return {};}
 async head(key){const object=this.objects.get(key);return object?{key,size:object.bytes.length}:null;}
 async get(key){const object=this.objects.get(key);if(!object)return null;const bytes=object.bytes.slice();return {body:new Blob([bytes]).stream(),arrayBuffer:async()=>bytes.buffer,json:async()=>JSON.parse(new TextDecoder().decode(bytes)),text:async()=>new TextDecoder().decode(bytes)};}
 async delete(key){this.objects.delete(key);}
 async list({prefix='' }={}){return {objects:[...this.objects].filter(([key])=>key.startsWith(prefix)).map(([key,value])=>({key,size:value.bytes.length})),truncated:false};}
}
