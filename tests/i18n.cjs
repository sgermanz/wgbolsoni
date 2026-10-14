const assert=require('node:assert/strict');
const fs=require('node:fs'); const path=require('node:path'); const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const modules=new Map();
function load(file) {
  file=path.resolve(root,file);
  if(modules.has(file)) return modules.get(file).exports;
  if(file.endsWith('.json')) return JSON.parse(fs.readFileSync(file,'utf8'));
  const module={exports:{}}; modules.set(file,module);
  const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>{
    if(name==='server-only') return {};
    if(name==='next/headers') return {headers:async()=>new Headers({'x-wgb-locale':'en','x-wgb-pathname':'/politicas'})};
    if(name.startsWith('@/') || name.startsWith('./')) {
      const base=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);
      for(const ext of ['', '.ts','.json']) if(fs.existsSync(base+ext)) return load(base+ext);
    }
    return require(name);
  };
  new Function('require','module','exports',js)(localRequire,module,module.exports);
  return module.exports;
}
const routing=load('lib/i18n/routing.ts');
const {translateUI}=load('lib/i18n/shared.ts');
const server=load('lib/i18n/server.ts');
const {proxy}=load('proxy.ts');
const {NextRequest}=require('next/server');
let checks=0;
function check(name,fn) {fn(); checks++;}
check('five locales',()=>assert.deepEqual(routing.LOCALES,['pt','en','es','fr','zh']));
for(const [header,expected] of [[null,'pt'],['pt-PT, en;q=0.8','pt'],['en-GB','en'],['es-MX','es'],['fr-CA','fr'],['zh-TW','zh'],['de-DE','en'],['en;q=0.1,fr;q=0.9','fr'],['fr;q=0,en;q=1','en']]) check('detect '+header,()=>assert.equal(routing.detectLocale(header),expected));
for(const [locale,href,expected] of [['fr','/blog?cat=agro#top','/fr/blog?cat=agro#top'],['pt','/zh/politicas','/politicas'],['es','/','/es'],['zh','/en#areas','/zh#areas'],['en','/api/contact','/api/contact'],['en','/admin','/admin'],['en','/logo.png','/logo.png'],['en','https://loja.uiclap.com','https://loja.uiclap.com'],['en','//example.com','//example.com']]) check('href '+href,()=>assert.equal(routing.localeHref(locale,href),expected));
function request(url,headers={}) {return new NextRequest('https://wgbolsoni.net'+url,{headers});}
check('French auto redirect preserving query',()=>assert.equal(proxy(request('/blog?cat=agro',{'accept-language':'fr-FR'})).headers.get('location'),'https://wgbolsoni.net/fr/blog?cat=agro'));
check('saved Portuguese wins',()=>assert.equal(proxy(request('/politicas',{'accept-language':'en',cookie:'wgb-language=pt'})).headers.get('location'),null));
check('explicit Spanish wins',()=>{
 const response=proxy(request('/es/politicas',{'accept-language':'fr',cookie:'wgb-language=en','x-wgb-locale':'zh'}));
 assert.equal(response.headers.get('x-middleware-request-x-wgb-locale'),'es');
 assert.equal(response.headers.get('x-middleware-rewrite'),'https://wgbolsoni.net/politicas');
});
check('manual preference cookie',()=>{
 const response=proxy(request('/fr/blog?lang=es&cat=agro'));
 assert.equal(response.headers.get('location'),'https://wgbolsoni.net/es/blog?cat=agro');
 assert.match(response.headers.get('set-cookie'),/wgb-language=es/);
 assert.match(response.headers.get('cache-control'),/no-store/);
});
check('crawlers see canonical Portuguese',()=>assert.equal(proxy(request('/',{'accept-language':'en','user-agent':'Googlebot'})).headers.get('location'),null));
for(const url of ['/api/contact','/admin','/_next/static/file.js','/logo.png']) check('excluded '+url,()=>assert.equal(proxy(request(url,{'accept-language':'zh'})).headers.get('location'),null));
check('UI interpolation',()=>assert.equal(translateUI('en','Página {page} de {total}',{page:2,total:3}),'Page 2 of 3'));
check('Portuguese unchanged',()=>assert.equal(translateUI('pt','  Seu nome  '),'  Seu nome  '));
check('content preserves identifiers',()=>{
 const record={id:1,title:'Proteína',slug:'proteina',url:'/areas/proteina',cover:{url:'/api/media/file/a.jpg'},email:'wgb@wgbolsoni.net',body:{root:{children:[{type:'heading',tag:'h2',text:'Conduta e ética',format:1}]}}};
 const translated=server.localizeRecord(record,'en');
 assert.equal(translated.title,'Protein'); assert.equal(translated.slug,'proteina'); assert.equal(translated.email,record.email);
 assert.equal(translated.cover.url,record.cover.url); assert.equal(translated.url,'/en/areas/proteina');
 assert.equal(translated.body.root.children[0].text,'Conduct and ethics'); assert.equal(translated.body.root.children[0].tag,'h2');
 assert.equal(translated.body.root.children[0].format,1); assert.equal(record.title,'Proteína');
});
check('official book titles preserved',()=>assert.equal(server.localizeRecord({title:'Proteína',synopsis:'Conduta e ética'},'en',true).title,'Proteína'));
for(const file of ['ui','content']) {
 const entries=load('lib/i18n/'+file+'.json');
 check(file+' unique keys',()=>assert.equal(new Set(entries.map(x=>x.pt.replace(/\s+/g,' ').trim())).size,entries.length));
 check(file+' four complete languages',()=>{for(const entry of entries) for(const locale of ['en','es','fr','zh']) assert.equal(typeof entry[locale],'string');});
 check(file+' placeholders preserved',()=>{for(const entry of entries) for(const locale of ['en','es','fr','zh']) assert.deepEqual((entry.pt.match(/\{\w+\}/g)||[]).sort(),(entry[locale].match(/\{\w+\}/g)||[]).sort());});
}
console.log(JSON.stringify({success:true,checks},null,2));
