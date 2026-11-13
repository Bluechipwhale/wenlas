import type {Metadata} from 'next';
import {brand} from './brand';
import type {Product} from './types';

export function siteOrigin(){return new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000').origin;}
export function absoluteUrl(path:string){return new URL(path,siteOrigin()).href;}
export function conciseDescription(value:string,max=160){const text=value.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();if(text.length<=max)return text;return text.slice(0,max-1).replace(/\s+\S*$/,'')+'…';}
export function pageMetadata({title,description,path,image='/opengraph-image',noindex=false}:{title:string;description:string;path:string;image?:string;noindex?:boolean}):Metadata{
 return {title,description:conciseDescription(description),alternates:{canonical:path},robots:{index:!noindex,follow:true},openGraph:{title,description:conciseDescription(description),url:path,type:'website',siteName:brand.fullName,locale:'en_NG',images:[{url:absoluteUrl(image),alt:title}]},twitter:{card:'summary_large_image',title,description:conciseDescription(description),images:[absoluteUrl(image)]}};
}
export function serializeStructuredData(value:unknown){return JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
export function businessStructuredData(){return {'@context':'https://schema.org','@graph':[
 {'@type':'ElectronicsStore','@id':absoluteUrl('/#store'),name:brand.fullName,url:siteOrigin(),image:absoluteUrl('/brand/wenlas-official-logo.png'),logo:absoluteUrl('/brand/wenlas-official-logo.png'),description:'Headphones, Bluetooth speakers, power banks and mobile accessories in Computer Village, Ikeja, Lagos.',address:{'@type':'PostalAddress',streetAddress:'8 Idowu Lane, Chelsea Plaza, Computer Village',addressLocality:'Ikeja',addressRegion:'Lagos',addressCountry:'NG'},openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:'09:00',closes:'18:00'}],sameAs:[brand.sellerUrl],currenciesAccepted:'NGN'},
 {'@type':'WebSite','@id':absoluteUrl('/#website'),url:siteOrigin(),name:brand.fullName,alternateName:brand.name,inLanguage:'en-NG',publisher:{'@id':absoluteUrl('/#store')}}
]};}
export function breadcrumbStructuredData(items:{name:string;path:string}[]){return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:absoluteUrl(item.path)}))};}
export function productStructuredData(product:Product){
 const condition=product.attributes?.find(a=>/^condition$/i.test(a.name))?.value;
 return {'@context':'https://schema.org','@type':'Product','@id':absoluteUrl('/products/'+product.slug+'#product'),url:absoluteUrl('/products/'+product.slug),name:product.name,description:product.description,image:[...new Set([product.image,...product.images])].map(absoluteUrl),sku:product.id,brand:{'@type':'Brand',name:product.brand},...(product.attributes?.length?{additionalProperty:product.attributes.map(a=>({'@type':'PropertyValue',name:a.name,value:a.value,...(a.unit?{unitText:a.unit}:{})}))}:{}),offers:{'@type':'Offer',url:absoluteUrl('/products/'+product.slug),priceCurrency:'NGN',price:(product.price_kobo/100).toFixed(2),seller:product.merchant_id==='wenlas'?{'@id':absoluteUrl('/#store')}:{'@type':'Organization',name:product.merchant_name},...(condition&&/brand new/i.test(condition)?{itemCondition:'https://schema.org/NewCondition'}:{}),...(product.inventory_status==='confirmed'?{availability:product.stock-product.reserved>0?'https://schema.org/InStock':'https://schema.org/OutOfStock'}:{})}};
}
