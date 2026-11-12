import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { publishedTheme } from '@/lib/server';
export const alt = 'Wenlas Resources Ltd. — Good tech. Great everyday.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image() {
  const theme = await publishedTheme();
  const icon = 'data:image/png;base64,' + (await readFile(join(process.cwd(), 'public/brand/wenlas-official-logo.png'))).toString('base64');
  /* eslint-disable @next/next/no-img-element */
  return new ImageResponse(<div style={{ display:'flex', width:'100%', height:'100%', background:'#eaf4ff', color:'#001b49', padding:68, flexDirection:'column', justifyContent:'space-between', fontFamily:'sans-serif' }}>
    <div style={{ display:'flex', alignItems:'center', gap:20, fontSize:30, fontWeight:700 }}><img src={icon} alt="" width={240} height={120}/><span>Wenlas Resources Ltd.</span></div>
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}><span style={{ fontSize:84, fontWeight:700, letterSpacing:-5, maxWidth:950, lineHeight:1.05 }}>{theme.heroTitle.replace(/\n/g,' ')}</span><span style={{ fontSize:27, color:'#56718b' }}>{theme.tagline}</span></div>
    <div style={{ display:'flex', justifyContent:'space-between', borderTop:'1px solid #caddef', paddingTop:24, fontSize:20 }}><span>AUDIO · ACCESSORIES · EVERYDAY TECH</span><span>Ikeja, Lagos ↗</span></div>
  </div>,size);
}
