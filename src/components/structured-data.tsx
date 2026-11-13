import {headers} from 'next/headers';
import {serializeStructuredData} from '@/lib/seo';
export async function StructuredData({data,id}:{data:unknown;id:string}){
 const nonce=(await headers()).get('x-nonce')||undefined;
 return <script id={id} type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html:serializeStructuredData(data)}}/>;
}
