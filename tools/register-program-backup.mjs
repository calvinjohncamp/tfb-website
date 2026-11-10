// Register the exact committed program archive in private backup storage before publishing.
import {execFileSync} from 'node:child_process';import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
process.umask(0o077);const root=fileURLToPath(new URL('../',import.meta.url));
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();if(git(['status','--porcelain','--untracked-files=no']))throw Error('Commit the release files before registering the program backup.');
const commit=git(['rev-parse','HEAD']);if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Invalid commit');
const directory=mkdtempSync('/private/tmp/tfb-program-backup-'),config=fileURLToPath(new URL('../server/cloudflare/wrangler.jsonc',import.meta.url));
const wrangler=args=>execFileSync(process.env.TFB_WRANGLER_JS?process.execPath:'npm',[...(process.env.TFB_WRANGLER_JS?[process.env.TFB_WRANGLER_JS]:['--cache','/private/tmp/tfb-npm-cache','exec','--yes','--package=wrangler@4.159.0','--','wrangler']),...args,'--config',config],{cwd:root,stdio:['ignore','pipe','pipe']});
try{
 const zip=directory+'/program.zip';git(['archive','--format=zip','--output='+zip,commit]);const bytes=readFileSync(zip),sha256=createHash('sha256').update(bytes).digest('hex'),key='editorial/releases/'+commit+'.zip';
 wrangler(['r2','object','put','tfb-website-private/'+key,'--file',zip,'--remote']);
 const sql=directory+'/release.sql';writeFileSync(sql,`INSERT INTO cms_releases(commit_id,object_key,sha256,size,created_at) VALUES('${commit}','${key}','${sha256}',${bytes.length},'${new Date().toISOString()}') ON CONFLICT(commit_id) DO UPDATE SET object_key=excluded.object_key,sha256=excluded.sha256,size=excluded.size;\n`);
 wrangler(['d1','execute','tfb-website','--remote','--file',sql]);console.log(JSON.stringify({commit,sha256,size:bytes.length,registered:true}));
}finally{rmSync(directory,{recursive:true,force:true});}
