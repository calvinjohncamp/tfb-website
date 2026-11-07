// Browser sample only; preserve the red reference and derive its yellow/blue counterpart.
import {readFileSync,writeFileSync} from 'node:fs';
const base=new URL('../assets/docs/',import.meta.url);
const red=readFileSync(new URL('tfb-mitgliedsanmeldung-muster.html',base),'utf8');
const yellow=red.replaceAll('#C4553A','#FFC300')
 .replace('src="tfb-mail-logo.png"','src="../brand/tfb-logo-midnight-amber.png"')
 .replace('font-weight:700;color:#FFFFFF;text-align:center','font-weight:700;color:#001D3D;text-align:center')
 .replace('letter-spacing:-1.2px;color:#171717','letter-spacing:-1.2px;color:#001D3D');
writeFileSync(new URL('tfb-mitgliedsanmeldung-muster-gelb.html',base),yellow);
console.log('Yellow/blue mail sample generated; red reference unchanged.');
