// A local, read-only day receipt. No DOM capture, external renderer, upload or sending.
const calendarDay=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'});
const stamp=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const euros=n=>(n/100).toLocaleString('de-DE',{style:'currency',currency:'EUR'});
export function dayImageModel({day,person,entries}){
 if(!/^20\d{2}-\d{2}-\d{2}$/.test(day)||calendarDay.format(new Date(day+'T12:00:00Z'))!==day||!person?.id||!person.name)throw Error('Bitte einen Tag und ein Mitglied auswählen.');
 if(entries.some(e=>e.member_id!==person.id))throw Error('Der Tagesbeleg darf nur Buchungen dieses Mitglieds enthalten.');
 const selected=entries.filter(e=>(e.day||calendarDay.format(new Date(e.created_at)))===day).sort((a,b)=>Date.parse(a.created_at)-Date.parse(b.created_at)||String(a.id).localeCompare(String(b.id)));
 return {day,person:{...person},date:new Date(day+'T12:00:00Z').toLocaleDateString('de-DE',{timeZone:'Europe/Berlin',weekday:'long',day:'numeric',month:'long',year:'numeric'}),totalCents:selected.reduce((sum,e)=>sum+e.net_cents,0),entries:selected};
}
function wrap(ctx,text,maxWidth){
 const lines=[];let line='';for(const word of String(text||'').split(/\s+/)){if(!word)continue;if(ctx.measureText(line?line+' '+word:word).width<=maxWidth){line=line?line+' '+word:word;continue;}if(line){lines.push(line);line='';}let part='';for(const c of word){if(part&&ctx.measureText(part+c).width>maxWidth){lines.push(part);part='';}part+=c;}line=part;}if(line)lines.push(line);return lines;
}
async function photo(src){if(!src)return null;try{const img=new Image();img.crossOrigin='anonymous';await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=src;});return img;}catch{return null;}}
export async function renderDayJpeg(model,{yellow=false}={}){
 await document.fonts?.ready;
 const width=800,pad=32,brand=yellow?'#001D3D':'#C4553A',ink='#171717',muted='#686868',line='#dedede';
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)throw Error('Das Tagesbild konnte nicht erstellt werden.');
 const font=(size,weight=400)=>{ctx.font=`${weight} ${size}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;};
 const items=model.entries.map(e=>{font(14);const title=e.product_name+(e.unit&&e.unit!=='Stück'?' · '+e.unit:'')+' · '+stamp.format(new Date(e.created_at)),titleLines=wrap(ctx,title,width-2*pad-125),notes=[];
  for(const a of e.adjustments){const kind=a.source==='undo'?'Storno':'Gutschrift';notes.push(`${kind}: −${euros(a.amount_cents)} · ${stamp.format(new Date(a.created_at))} · ${a.reason}${a.actor_name?' · Bearbeitet von '+a.actor_name:''}`);}
  font(12);const noteLines=notes.flatMap(n=>wrap(ctx,n,width-2*pad-24));
  return {titleLines,noteLines,net:e.net_cents,original:e.price_cents,height:Math.max(42,titleLines.length*21+18)+(notes.length?24+noteLines.length*18+12:0)};
 });
 font(22,700);const nameLines=wrap(ctx,model.person.name,width-2*pad-72),identityHeight=Math.max(58,nameLines.length*27+10),listTop=148+identityHeight,height=listTop+52+Math.max(48,items.reduce((n,item)=>n+item.height,0))+56+pad;
 // Bound total pixels for Safari/iOS; never truncate rows or corrections.
 const scale=Math.min(2,Math.sqrt(14000000/(width*height)),15000/height);
 canvas.width=Math.floor(width*scale);canvas.height=Math.floor(height*scale);ctx.scale(scale,scale);
 ctx.fillStyle='#F4F4F4';ctx.fillRect(0,0,width,height);
 font(13,500);ctx.fillStyle=muted;ctx.fillText('Tagesübersicht',pad,32);
 font(23,750);ctx.fillStyle=ink;ctx.fillText(model.date,pad,66);
 font(28,750);ctx.fillText(euros(model.totalCents),pad,105);
 const image=await photo(model.person.avatar),faceY=133,faceSize=48;ctx.save();ctx.beginPath();ctx.arc(pad+24,faceY+24,24,0,2*Math.PI);ctx.clip();ctx.fillStyle=yellow?'#E6EBEF':'#F4E5DF';ctx.fillRect(pad,faceY,faceSize,faceSize);
 if(image){const side=Math.min(image.naturalWidth,image.naturalHeight);ctx.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,pad,faceY,faceSize,faceSize);}else{font(17,750);ctx.fillStyle=brand;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((model.person.initials||model.person.name.split(/\s+/).filter(Boolean).map(n=>n[0]).slice(0,2).join('')).toLocaleUpperCase('de-DE'),pad+24,faceY+24);ctx.textAlign='left';ctx.textBaseline='alphabetic';}ctx.restore();
 font(22,750);ctx.fillStyle=brand;nameLines.forEach((text,i)=>ctx.fillText(text,pad+64,faceY+29+i*27));
 const cardX=pad,cardWidth=width-2*pad,cardBottom=height-pad;
 ctx.fillStyle='#fff';ctx.fillRect(cardX,listTop,cardWidth,cardBottom-listTop);ctx.strokeStyle=line;ctx.lineWidth=1;ctx.strokeRect(cardX+.5,listTop+.5,cardWidth-1,cardBottom-listTop-1);
 ctx.fillStyle='#EEEEEE';ctx.fillRect(cardX+1,listTop+1,cardWidth-2,45);font(13,700);ctx.fillStyle=ink;ctx.fillText(model.date,cardX+14,listTop+29);ctx.textAlign='right';ctx.fillText(euros(model.totalCents),width-pad-14,listTop+29);ctx.textAlign='left';
 let y=listTop+46;
 if(!items.length){font(14);ctx.fillStyle=muted;ctx.fillText('Keine Buchungen an diesem Tag.',pad+14,y+30);y+=48;}
 for(const item of items){font(14);ctx.fillStyle=ink;item.titleLines.forEach((text,i)=>ctx.fillText(text,pad+14,y+26+i*21));font(14,700);ctx.textAlign='right';ctx.fillText(euros(item.net),width-pad-14,y+26);ctx.textAlign='left';
  if(item.noteLines.length){let noteY=y+Math.max(42,item.titleLines.length*21+18)+8;font(12,650);ctx.fillStyle=muted;ctx.fillText('Ursprünglicher Betrag: '+euros(item.original),pad+14,noteY);noteY+=21;font(12);item.noteLines.forEach(text=>{ctx.fillText(text,pad+14,noteY);noteY+=18;});}
  y+=item.height;ctx.strokeStyle=line;ctx.beginPath();ctx.moveTo(pad+14,y+.5);ctx.lineTo(width-pad-14,y+.5);ctx.stroke();
 }
 font(15,700);ctx.fillStyle=ink;ctx.fillText('Tagessumme',pad+14,y+34);ctx.textAlign='right';ctx.fillText(euros(model.totalCents),width-pad-14,y+34);ctx.textAlign='left';
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.94));if(!blob)throw Error('Das Tagesbild konnte nicht gespeichert werden.');return blob;
}
