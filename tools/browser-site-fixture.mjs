// Publish real public seed pages into an in-memory CMS for browser tests only.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {Bucket} from './editorial-fixture.mjs';
import {splitSite} from '../server/cloudflare/editorial.mjs';
export async function publishBrowserSite(f){
 const context={TFB:{}};context.window=context;
 vm.runInNewContext(readFileSync(new URL('../assets/data/site-seed.js',import.meta.url),'utf8'),context);
 f.env.CMS_BUCKET=new Bucket();
 const changes=Object.entries(splitSite(context.TFB.siteSeed)).map(([key,value])=>({key,expected:0,value}));
 const result=await f.call('/admin/site/commit',{id:crypto.randomUUID(),changes},f.adminToken);
 assert.equal(result.status,200,JSON.stringify(result.body));
}
