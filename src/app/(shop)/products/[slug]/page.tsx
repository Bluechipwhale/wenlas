import {cache} from 'react';
import {StructuredData} from '@/components/structured-data';
import {pageMetadata,productStructuredData,breadcrumbStructuredData} from '@/lib/seo';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { product,catalogue,publicReviews } from '@/lib/server';
import { ProductDetail } from '@/components/product-detail';
import { ProductCard } from '@/components/product-card';
const readProduct=cache(product);
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const p=await readProduct((await params).slug);return p?pageMetadata({title:p.name,description:p.name+' at Wenlas Resources Ltd., Ikeja, Lagos. '+p.description,path:'/products/'+p.slug,image:p.image}):{title:'Product unavailable',robots:{index:false,follow:false}};}
export default async function Detail({params}:{params:Promise<{slug:string}>}){const p=await readProduct((await params).slug);if(!p)notFound();const [related,reviews]=await Promise.all([catalogue('',p.category_id),publicReviews(p.id)]);return <div className="container catalog-page"><StructuredData id="wenlas-product-data" data={productStructuredData(p)}/><StructuredData id="wenlas-product-breadcrumbs" data={breadcrumbStructuredData([{name:"Home",path:"/"},{name:"Collection",path:"/products"},{name:p.name,path:"/products/"+p.slug}])}/><div className="breadcrumbs"><Link href="/">Home</Link>/<Link href="/products">Collection</Link>/{p.name}</div><ProductDetail product={p} reviews={reviews}/><section className="section"><h2>A little more to discover.</h2><div className="product-grid">{related.products.filter(r=>r.id!==p.id).slice(0,4).map(r=><ProductCard key={r.id} product={r}/>)}</div></section></div>;}
