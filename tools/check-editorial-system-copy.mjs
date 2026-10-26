// Offline operator rehearsal, no Cloudflare access and no production mutations.
import {readFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {decryptSystemPackage,decryptSystemBackup,verifyObjects,restoreDatabase} from './editorial-recovery.mjs';
process.umask(0o077);
const [input,keyFile,target]=process.argv.slice(2);
if(!input||!keyFile||!target)throw Error('Usage: node tools/check-editorial-system-copy.mjs package.aes separate-key-file NEW-private-test-directory');
const output=resolve(target);if(existsSync(output))throw Error('Target must be a new private directory');
const key=readFileSync(keyFile,'utf8').trim(),packageValue=await decryptSystemPackage(readFileSync(input),key);
const archive=await decryptSystemBackup(Buffer.from(packageValue.database,'base64'),key);
mkdirSync(output,{recursive:true,mode:0o700});
for(const [name,value] of Object.entries(packageValue.objects)){
 if(!/^editorial\/(media\/[a-f0-9]{64}|releases\/[a-f0-9]{40}\.zip)$/.test(name))throw Error('Unexpected object path');
 const file=resolve(output,name);mkdirSync(dirname(file),{recursive:true,mode:0o700});writeFileSync(file,Buffer.from(value,'base64'));
}
for(const [name,value] of Object.entries(archive.history||{})){
 if(!/^editorial\/history\/[a-zA-Z0-9-]+\.json$/.test(name))throw Error('Unexpected history path');
 const file=resolve(output,name);mkdirSync(dirname(file),{recursive:true,mode:0o700});writeFileSync(file,JSON.stringify(value));
}
const objects=verifyObjects(archive,output),database=restoreDatabase(archive,resolve(output,'restored.sqlite'));
const result={createdAt:archive.createdAt,objects,...database,integrity:'ok'};
writeFileSync(resolve(output,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
