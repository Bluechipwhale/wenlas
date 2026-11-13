import {pageMetadata} from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import {localMode,supabase,configured} from '@/lib/server';
import {localStore} from '@/lib/local-store';
import {wenlasCatalogueMode} from '@/lib/brand';
import {wenlasProducts} from '@/lib/wenlas-catalogue';
import type {Product} from '@/lib/types';
import './brands.css';
type Brand={name:string;display_name:string;logo_url:string;description:string;product_count:number};
export const metadata=pageMetadata({title:'Shop Tech Brands in Ikeja, Lagos',description:'Explore headphone, speaker and accessory brands at Wenlas Resources Ltd. Browse products and naira prices from our Computer Village, Ikeja store.',path:'/brands'});
export default async function Brands(){
 let brands:Brand[]=[];
 if(wenlasCatalogueMode()){
  const products=await localMode()?localStore().list<Product>('products').filter(p=>p.active&&!p.archived_at):wenlasProducts;
  brands=[...new Set(products.map(p=>p.brand))].map(name=>({name,display_name:name,logo_url:'',description:'',product_count:products.filter(p=>p.brand===name).length})).sort((a,b)=>b.product_count-a.product_count||a.name.localeCompare(b.name));
 }else if(configured()&&!await localMode()){const {data,error}=await(await supabase()).rpc('published_brands');if(error)return <section className="container narrow-page"><h1>Shop by brand</h1><p>Brands are temporarily unavailable.</p><Link href="/products">Browse all products</Link></section>;brands=data||[];}
 return <section className="container brand-directory"><span className="eyebrow muted">YOUR EVERYDAY FAVOURITES</span><h1>Shop by brand</h1><p>Explore the brands available in our catalogue.</p><div className="brand-collections">{brands.map(b=><Link className="brand-collection" key={b.name} href={'/brands/'+encodeURIComponent(b.name)}>{b.logo_url?<Image src={b.logo_url} alt="" width={96} height={72} unoptimized style={{objectFit:'contain'}}/>:<span className="brand-monogram" aria-hidden="true">{b.display_name.split(/\s+/).slice(0,2).map(w=>w[0]).join('')}</span>}<h2>{b.display_name}</h2>{b.description&&<p>{b.description}</p>}<span>{b.product_count} products →</span></Link>)}</div>{!brands.length&&<p>Browse our <Link href="/products">complete catalogue</Link> while brand collections are prepared.</p>}</section>;
}
