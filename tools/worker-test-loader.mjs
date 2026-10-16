// Load the actual worker sources without Cloudflare credentials or a network build.
import {readFileSync} from 'node:fs';
const root=new URL('../server/cloudflare/',import.meta.url);
const data=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
let sync=readFileSync(new URL('app-sync.mjs',root),'utf8').replace("import catalog from './demo-catalog.json';",'const catalog='+readFileSync(new URL('demo-catalog.json',root),'utf8')+';');
let source=readFileSync(new URL('worker.mjs',root),'utf8')
  .replace("import schema from './schema.sql';",'const schema='+JSON.stringify(readFileSync(new URL('schema.sql',root),'utf8'))+';')
  .replace("from './app-sync.mjs'",'from '+JSON.stringify(data(sync)))
  .replace("from './management.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('management.mjs',root),'utf8'))));
if(process.env.TFB_WORKER_BUNDLE){
  const file=new URL('file://'+process.env.TFB_WORKER_BUNDLE);
  source=readFileSync(file,'utf8').replace(/import (\w+) from ["']([^"']+\.sql)["'];/g,(_,name,path)=>`const ${name} = ${JSON.stringify(readFileSync(new URL(path,file),'utf8'))};`);
}
export default (await import(data(source))).default;
