import {pageMetadata,breadcrumbStructuredData} from '@/lib/seo';
import {StructuredData} from '@/components/structured-data';
import {cataloguePage} from '@/lib/catalogue-query';
import Products from '../../products/page';
import Link from 'next/link';
import {catalogue} from '@/lib/server';
import {notFound} from 'next/navigation';
export async function generateMetadata({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|undefined>>}){const {id}=await params,{categories}=await catalogue(),category=categories.find(c=>c.id===id);if(!category)return {title:'Category unavailable',robots:{index:false,follow:false}};const filters=await searchParams,page=cataloguePage(filters.page),filtered=Object.entries(filters).some(([key,value])=>key!=='page'&&Boolean(value));return pageMetadata({title:category.name+' in Ikeja, Lagos',description:'Explore '+category.name.toLowerCase()+' at Wenlas Resources Ltd. Compare products and naira prices from Computer Village, Ikeja, Lagos.',path:'/categories/'+encodeURIComponent(id)+(!filtered&&page>1?'?page='+page:''),image:category.image,noindex:filtered});}
export default async function Category({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|undefined>>}) {
 const {id}=await params;const {categories}=await catalogue();const current=categories.find(c=>c.id===id);if(!current)notFound();
 const trail=[current];const seen=new Set([current.id]);
 while(trail[0].parent_id&&trail.length<3){const parent=categories.find(c=>c.id===trail[0].parent_id);if(!parent||seen.has(parent.id))break;seen.add(parent.id);trail.unshift(parent);}
 const children=categories.filter(c=>c.parent_id===id);
 return <><StructuredData id="wenlas-category-breadcrumbs" data={breadcrumbStructuredData([{name:"Home",path:"/"},{name:"Collection",path:"/products"},...trail.map(c=>({name:c.name,path:"/categories/"+encodeURIComponent(c.id)}))])}/><nav aria-label="Category breadcrumb" className="container resource-subnav" style={{paddingTop:24}}><Link href="/products">All products</Link>{trail.map(c=>c.id===id?<span key={c.id} aria-current="page">{c.name}</span>:<Link key={c.id} href={'/categories/'+encodeURIComponent(c.id)}>{c.name}</Link>)}</nav>{children.length>0&&<nav className="container resource-subnav" aria-label="Subcategories">{children.map(c=><Link key={c.id} href={'/categories/'+encodeURIComponent(c.id)}>{c.name} →</Link>)}</nav>}<Products searchParams={Promise.resolve({...await searchParams,category:id})}/></>;
}
