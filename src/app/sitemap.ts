import type { MetadataRoute } from 'next';
import { catalogue,localMode,configured,supabase,records } from '@/lib/server';
import { localStore } from '@/lib/local-store';
import {wenlasCatalogueMode} from '@/lib/brand';
import {wenlasProducts,wenlasCategories} from '@/lib/wenlas-catalogue';
import type { Product } from '@/lib/types';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
const base=new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000').origin;
if(wenlasCatalogueMode()){const products=wenlasProducts.filter(p=>p.active&&!p.archived_at);return [{url:base,changeFrequency:'weekly',priority:1},{url:base+'/products',changeFrequency:'weekly',priority:.9},{url:base+'/brands',priority:.7},{url:base+'/contact',priority:.7},...wenlasCategories.map(c=>({url:base+'/categories/'+encodeURIComponent(c.id),changeFrequency:'weekly' as const,priority:.8})),...[...new Set(products.map(p=>p.brand))].map(name=>({url:base+'/brands/'+encodeURIComponent(name),priority:.6})),...products.map(p=>({url:base+'/products/'+p.slug,lastModified:p.imported_at||p.created_at,changeFrequency:'weekly' as const,priority:.7}))];}
const [data,stores]=await Promise.all([catalogue(),records('merchants',true)]);let products:{slug:string;created_at:string}[]=[];
if(await localMode())products=localStore().list<Product>('products').filter(p=>p.active);
else if(configured()){const db=await supabase();for(let offset=0;offset<49000;offset+=1000){const {data:batch,error}=await db.from('products').select('slug,created_at').eq('active',true).order('id').range(offset,offset+999);if(error)throw new Error('Sitemap data unavailable');products.push(...(batch||[]));if(!batch||batch.length<1000)break;}}
return [{url:base},{url:base+'/products'},{url:base+'/merchants'},...stores.map(m=>({url:base+'/merchants/'+encodeURIComponent(m.id)})),...data.categories.map(c=>({url:base+'/categories/'+encodeURIComponent(c.id)})),...products.map(p=>({url:base+'/products/'+p.slug,lastModified:p.created_at}))];}
