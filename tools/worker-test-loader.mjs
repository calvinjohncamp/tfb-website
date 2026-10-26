// Load the actual worker sources without Cloudflare credentials or a network build.
import {readFileSync} from 'node:fs';
const root=new URL('../server/cloudflare/',import.meta.url);
const data=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
let sync=readFileSync(new URL('app-sync.mjs',root),'utf8').replace("import catalog from './demo-catalog.json';",'const catalog='+readFileSync(new URL('demo-catalog.json',root),'utf8')+';');
sync=sync.replace("from './meet-sync.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('meet-sync.mjs',root),'utf8'))));
const visibility=readFileSync(new URL('partner-visibility.mjs',root),'utf8').replace("import partners from './partner-catalog.json';",'const partners='+readFileSync(new URL('partner-catalog.json',root),'utf8')+';');
const editorial=readFileSync(new URL('editorial.mjs',root),'utf8');
const backup=readFileSync(new URL('editorial-backup.mjs',root),'utf8').replace("from './editorial.mjs'",'from '+JSON.stringify(data(editorial)));
let source=readFileSync(new URL('worker.mjs',root),'utf8')
  .replace("import schema from './schema.sql';",'const schema='+JSON.stringify(readFileSync(new URL('schema.sql',root),'utf8'))+';')
  .replace("from './editorial.mjs'",'from '+JSON.stringify(data(editorial)))
  .replace("from './editorial-backup.mjs'",'from '+JSON.stringify(data(backup)))
  .replace("from './app-sync.mjs'",'from '+JSON.stringify(data(sync)))
  .replace("from './partner-visibility.mjs'",'from '+JSON.stringify(data(visibility)))
  .replace("from './partner-management.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('partner-management.mjs',root),'utf8'))))
  .replace("from './management.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('management.mjs',root),'utf8'))));
if(process.env.TFB_WORKER_BUNDLE){
  const file=new URL('file://'+process.env.TFB_WORKER_BUNDLE);
  source=readFileSync(file,'utf8').replace(/import (\w+) from ["']([^"']+\.sql)["'];/g,(_,name,path)=>`const ${name} = ${JSON.stringify(readFileSync(new URL(path,file),'utf8'))};`);
}
export default (await import(data(source))).default;
