// Wenlas public build defaults. Private database and setup values live only in Hostinger.
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'config/hostinger-public.json'),'utf8'));
const names=['NEXT_PUBLIC_SITE_URL','WENLAS_CATALOGUE_MODE','LOCAL_DEMO'];
if(Object.keys(config).length!==names.length||names.some(name=>typeof config[name]!=='string'||/[\r\n$"'#]/.test(config[name])))throw Error('Unexpected Wenlas public hosting settings');
const url=new URL(config.NEXT_PUBLIC_SITE_URL);
if(url.protocol!=='https:'||url.username||url.password||url.port||url.pathname!=='/'||url.search||url.hash||url.hostname.includes('edgedirect2u'))throw Error('Use the actual Wenlas HTTPS deployment origin');
if(config.WENLAS_CATALOGUE_MODE!=='true'||config.LOCAL_DEMO!=='false')throw Error('Deploy the isolated Wenlas catalogue with local demo disabled');
fs.writeFileSync(path.join(root,'.env.production'),names.map(name=>name+'='+config[name]).join('\n')+'\n',{mode:0o600});
console.log('Prepared Wenlas public hosting defaults. No previous store or private database settings are included.');
