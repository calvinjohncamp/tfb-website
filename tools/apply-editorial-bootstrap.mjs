// Explicit operator deployment step. Never imports accounts, chats or purchases.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const output=resolve(process.argv[2]||'.private/release-v232/bootstrap'),manifest=JSON.parse(readFileSync(resolve(output,'snapshot.json'),'utf8'));
if(process.argv[3]!=='--apply-verified-desktop'||!manifest.release)throw Error('A committed source archive and --apply-verified-desktop are required');
const prefix=['--cache','/private/tmp/tfb-npm-cache','exec','--yes','--package=wrangler','--','wrangler'];
const run=args=>execFileSync('npm',[...prefix,...args],{stdio:'pipe',maxBuffer:16*1024*1024});
for(const [i,item] of manifest.media.entries()){
 run(['r2','object','put','tfb-website-private/'+item.object_key,'--file',resolve(output,'media',item.hash),'--content-type',item.mime,'--remote']);
 if((i+1)%10===0)console.log(`${i+1}/${manifest.media.length} verified media files uploaded`);
}
run(['r2','object','put','tfb-website-private/'+manifest.release.object_key,'--file',resolve(output,'programm.zip'),'--content-type','application/zip','--remote']);
run(['r2','object','put','tfb-website-private/editorial/history/'+manifest.id+'.json','--file',resolve(output,'snapshot.json'),'--content-type','application/json','--remote']);
const result=run(['d1','execute','tfb-website','--remote','--config','server/cloudflare/wrangler.jsonc','--file',resolve(output,'bootstrap.sql')]);writeFileSync(resolve(output,'apply.log'),result,{mode:0o600});
console.log('Verified desktop baseline and matching source archive installed. No business tables imported.');
