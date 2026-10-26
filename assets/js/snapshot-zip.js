// Small, dependency-free ZIP STORE reader/writer for our own snapshot packages.
// Uploaded archives are data only. Code archives are never executed by the browser.
(function(){
 const enc=new TextEncoder(),dec=new TextDecoder();
 const table=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
 const crc=bytes=>{let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
 function header(size,values){const bytes=new Uint8Array(size),v=new DataView(bytes.buffer);for(const [offset,width,value] of values)v['setUint'+width](offset,value,true);return bytes;}
 function pack(files){const local=[],central=[];let offset=0,count=0;for(const [name,input] of Object.entries(files)){
  const bytes=typeof input==='string'?enc.encode(input):new Uint8Array(input),path=enc.encode(name),sum=crc(bytes);
  const h=header(30,[[0,32,0x04034b50],[4,16,20],[6,16,0x800],[14,32,sum],[18,32,bytes.length],[22,32,bytes.length],[26,16,path.length]]);
  local.push(h,path,bytes);central.push(header(46,[[0,32,0x02014b50],[4,16,20],[6,16,20],[8,16,0x800],[16,32,sum],[20,32,bytes.length],[24,32,bytes.length],[28,16,path.length],[42,32,offset]]),path);offset+=30+path.length+bytes.length;count++;
 }const length=central.reduce((n,b)=>n+b.length,0);return new Blob([...local,...central,header(22,[[0,32,0x06054b50],[8,16,count],[10,16,count],[12,32,length],[16,32,offset]])],{type:'application/zip'});}
 function unpack(input){const bytes=new Uint8Array(input);if(bytes.length>512*1024*1024)throw Error('Dieses Paket ist zu groß.');const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),files={};let offset=0,total=0;
 while(offset+30<=bytes.length&&v.getUint32(offset,true)===0x04034b50){if(v.getUint16(offset+8,true)!==0||v.getUint16(offset+6,true)&8)throw Error('Bitte ein unverändertes TFB-Sicherungspaket verwenden.');const size=v.getUint32(offset+18,true),nameLength=v.getUint16(offset+26,true),extra=v.getUint16(offset+28,true),name=dec.decode(bytes.slice(offset+30,offset+30+nameLength)),start=offset+30+nameLength+extra;
  if(!name||name.startsWith('/')||name.split('/').includes('..')||name.includes('\\')||files[name]||start+size>bytes.length||++total>5000)throw Error('Ungültiger Inhalt im Sicherungspaket.');const file=bytes.slice(start,start+size);if(crc(file)!==v.getUint32(offset+14,true))throw Error('Die Sicherungsdatei ist beschädigt.');files[name]=file;offset=start+size;
 }if(!files['snapshot.json'])throw Error('Das Paket enthält keinen TFB-Inhaltsstand.');return files;}
 window.TFB=window.TFB||{};TFB.snapshotZip={pack,unpack};
})();
