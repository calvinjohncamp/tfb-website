// Load the actual worker sources without Cloudflare credentials or a network build.
import {readFileSync} from 'node:fs';
const root=new URL('../server/cloudflare/',import.meta.url);
const data=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const meetingMail=data(readFileSync(new URL("meeting-mail.mjs",root),"utf8"));
let sync=readFileSync(new URL('app-sync.mjs',root),'utf8').replace("import catalog from './demo-catalog.json';",'const catalog='+readFileSync(new URL('demo-catalog.json',root),'utf8')+';');
sync=sync.replace("from './kiosk-billing.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('kiosk-billing.mjs',root),'utf8'))));
sync=sync.replace("from './meet-sync.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('meet-sync.mjs',root),'utf8'))));
sync=sync.replace("from './meeting-mail.mjs'","from "+JSON.stringify(meetingMail));
const visibility=readFileSync(new URL('partner-visibility.mjs',root),'utf8').replace("import partners from './partner-catalog.json';",'const partners='+readFileSync(new URL('partner-catalog.json',root),'utf8')+';');
const editorial=readFileSync(new URL('editorial.mjs',root),'utf8');
const backup=readFileSync(new URL('editorial-backup.mjs',root),'utf8').replace("from './editorial.mjs'",'from '+JSON.stringify(data(editorial)));
const mail=readFileSync(new URL('access-mail.mjs',root),'utf8').replace("import template from './templates/access-mail.html';",'const template='+JSON.stringify(readFileSync(new URL('templates/access-mail.html',root),'utf8'))+';');
const email=readFileSync(new URL('email-auth.mjs',root),'utf8').replace("from './access-mail.mjs'",'from '+JSON.stringify(data(mail)));
const kioskAccount=data(readFileSync(new URL('kiosk-account.mjs',root),'utf8').replace("from './kiosk-domain.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('kiosk-domain.mjs',root),'utf8')))));
const bridge=data(readFileSync(new URL('padel-kiosk-bridge.mjs',root),'utf8').replace("from './kiosk-account.mjs'",'from '+JSON.stringify(kioskAccount)).replace("from './kiosk-billing.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('kiosk-billing.mjs',root),'utf8')))));
let source=readFileSync(new URL('worker.mjs',root),'utf8')
  .replace("from './meeting-mail.mjs'",'from '+JSON.stringify(meetingMail))
  .replace("from './member-mail.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('member-mail.mjs',root),'utf8').replace("from '../../assets/js/member-mail-renderer.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('../../assets/js/member-mail-renderer.mjs',root),'utf8')))))))
  .replace("from './kiosk-account.mjs'",'from '+JSON.stringify(kioskAccount))
  .replace("from './padel-kiosk-bridge.mjs'",'from '+JSON.stringify(bridge))
  .replace("from './kiosk-billing.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('kiosk-billing.mjs',root),'utf8'))))
  .replace("from './simple-usage.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('simple-usage.mjs',root),'utf8'))))
  .replace("from './club-usage.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('club-usage.mjs',root),'utf8'))))
  .replace("from './email-auth.mjs'",'from '+JSON.stringify(data(email)))
  .replace("import schema from './schema.sql';",'const schema='+JSON.stringify(readFileSync(new URL('schema.sql',root),'utf8'))+';')
  .replace("from './editorial.mjs'",'from '+JSON.stringify(data(editorial)))
  .replace("from './editorial-backup.mjs'",'from '+JSON.stringify(data(backup)))
  .replace("from './app-sync.mjs'",'from '+JSON.stringify(data(sync)))
  .replace("from './partner-visibility.mjs'",'from '+JSON.stringify(data(visibility)))
  .replace("from './partner-management.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('partner-management.mjs',root),'utf8'))))
  .replace("from './management.mjs'",'from '+JSON.stringify(data(readFileSync(new URL('management.mjs',root),'utf8'))));
if(process.env.TFB_WORKER_BUNDLE){
  const file=new URL('file://'+process.env.TFB_WORKER_BUNDLE);
  source=readFileSync(file,'utf8').replace(/import (\w+) from ["']([^"']+\.(?:sql|html))["'];/g,(_,name,path)=>`const ${name} = ${JSON.stringify(readFileSync(new URL(path,file),'utf8'))};`);
}
export default (await import(data(source))).default;
