// Download an independent, encrypted system copy. Key stays outside the package.
import {mkdirSync,readFileSync,writeFileSync,existsSync,mkdtempSync,rmSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {decryptSystemBackup,restoreDatabase,verifyObjects} from './editorial-recovery.mjs';
process.umask(0o077);
const [date,keyFile,outputArg]=process.argv.slice(2);
if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||!keyFile||!outputArg)throw Error('Usage: node tools/export-editorial-system.mjs YYYY-MM-DD separate-key-file NEW-private-output');
const output=resolve(outputArg);if(existsSync(output))throw Error('Output must be a new directory');mkdirSync(output,{recursive:true,mode:0o700});
const working=mkdtempSync('/private/tmp/tfb-system-copy-');
try{
const remote='backups/daily/'+date+'.json.gz.aes',encrypted=resolve(working,'database.json.gz.aes');
function get(key,file){mkdirSync(dirname(file),{recursive:true,mode:0o700});execFileSync('npm',['--cache','/private/tmp/tfb-npm-cache','exec','--yes','--package=wrangler','--','wrangler','r2','object','get','tfb-website-private/'+key,'--remote','--file',file],{stdio:['ignore','pipe','pipe']});}
get(remote,encrypted);const archive=await decryptSystemBackup(readFileSync(encrypted),readFileSync(keyFile,'utf8').trim());
for(const object of archive.objects){if(!/^editorial\/(media\/[a-f0-9]{64}|releases\/[a-f0-9]{40}\.zip)$/.test(object.key))throw Error('Unexpected object path');get(object.key,resolve(working,object.key));}
const verified=verifyObjects(archive,working),restored=restoreDatabase(archive,resolve(working,'restore-check.sqlite'));
writeFileSync(resolve(output,'verification.json'),JSON.stringify({createdAt:archive.createdAt,objects:verified,...restored},null,2));
const packageValue={format:'tfb-system-package',version:1,database:readFileSync(encrypted).toString('base64'),objects:Object.fromEntries(archive.objects.map(x=>[x.key,readFileSync(resolve(working,x.key)).toString('base64')]))};
const raw=new TextEncoder().encode(JSON.stringify(packageValue)),packed=await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
const key=await crypto.subtle.importKey('raw',Buffer.from(readFileSync(keyFile,'utf8').trim(),'hex'),'AES-GCM',false,['encrypt']),iv=crypto.getRandomValues(new Uint8Array(12));
const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,packed);writeFileSync(resolve(output,'tfb-system-package.json.gz.aes'),Buffer.concat([iv,Buffer.from(cipher)]));
writeFileSync(resolve(output,'README.txt'),'Independent AES-256-GCM encrypted system package. Keep the key separately. Decrypt the outer package to obtain the encrypted database archive and immutable objects (base64). History JSON is embedded in the database archive. Production recovery requires a compatible Worker, the database migration, media upload and separate original Worker secrets (especially PASSWORD_PEPPER). Never publish this directory. This command never changes production.\n');
console.log(JSON.stringify({output,verifiedObjects:verified,restoreCheck:restored}));

}finally{rmSync(working,{recursive:true,force:true});}
