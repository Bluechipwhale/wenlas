const {cpSync,mkdirSync,existsSync}=require('node:fs');
const {resolve}=require('node:path');
const dist=process.env.NEXT_DIST_DIR||'.next';
const output=resolve(dist,'standalone');
if(!existsSync(resolve(output,'server.js')))throw new Error('Build standalone output first');
mkdirSync(resolve(output,dist),{recursive:true});
cpSync(resolve('public'),resolve(output,'public'),{recursive:true});
cpSync(resolve(dist,'static'),resolve(output,dist,'static'),{recursive:true});
console.log('Standalone assets copied. Start .next/standalone/server.js with the host PORT.');
