export class Bucket{
 constructor(){this.objects=new Map();}
 async put(key,value,options={}){const prior=await this.head(key);if(options.onlyIf instanceof Headers){if(options.onlyIf.get('If-None-Match')==='*'&&prior)return null;}else if(options.onlyIf?.etagMatches!==undefined&&options.onlyIf.etagMatches!==prior?.etag)return null;const bytes=typeof value==='string'?new TextEncoder().encode(value):typeof value?.getReader==='function'?new Uint8Array(await new Response(value).arrayBuffer()):new Uint8Array(value);this.objects.set(key,{bytes:bytes.slice(),options,etag:String((this.serial=(this.serial||0)+1))});return this.head(key);}
 async head(key){const object=this.objects.get(key);return object?{key,size:object.bytes.length,etag:object.etag,customMetadata:object.options.customMetadata||{}}:null;}
 async get(key){const object=this.objects.get(key);if(!object)return null;const bytes=object.bytes.slice();return {...await this.head(key),body:new Blob([bytes]).stream(),arrayBuffer:async()=>bytes.buffer,json:async()=>JSON.parse(new TextDecoder().decode(bytes)),text:async()=>new TextDecoder().decode(bytes)};}
 async delete(key){this.objects.delete(key);}
 async list({prefix='',include=[] }={}){return {objects:[...this.objects].filter(([key])=>key.startsWith(prefix)).map(([key,value])=>({key,size:value.bytes.length,...(include.includes('customMetadata')?{customMetadata:value.options.customMetadata||{}}:{})})),truncated:false};}
}
